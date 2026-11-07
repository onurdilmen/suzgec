/*
 * Süzgeç service worker: state, learning, dynamic DNR rules, content-script registration.
 */
import "./heuristics.js";

const H = globalThis.SuzgecHeuristics;

const STATE_KEY = "state";
const LEARNED_RULE_ID = 100000;
const LEARN_AFTER_HITS = 3; // weak signals (hidden but score < LEARN_SCORE, blocked popups)
const MAX_LEARNED = 2000;
const MAX_CUSTOM_PER_SITE = 200;
const ALL_RESOURCE_TYPES = [
  "main_frame",
  "sub_frame",
  "stylesheet",
  "script",
  "image",
  "font",
  "object",
  "xmlhttprequest",
  "ping",
  "media",
  "websocket",
  "other",
];
const SCRIPT_IDS = ["suzgec-main", "suzgec-isolated"];

const DEFAULT_STATE = Object.freeze({
  paused: [], // registrable domains where protection is off
  learned: {}, // domain -> { at, from, reason }
  candidates: {}, // domain -> { hits, from }
  custom: {}, // registrable domain -> [selectors]
  trackers: true,
  total: 0,
});

// ---- state (serialised read-modify-write) ---------------------------------
const loadState = async () => {
  const { [STATE_KEY]: stored } = await chrome.storage.local.get(STATE_KEY);
  return { ...DEFAULT_STATE, ...(stored ?? {}) };
};

let queue = Promise.resolve();
const updateState = (mutate) => {
  const run = queue.then(async () => {
    const current = await loadState();
    const next = await mutate(current);
    if (next && next !== current)
      await chrome.storage.local.set({ [STATE_KEY]: next });
    return next ?? current;
  });
  queue = run.catch(() => {});
  return run;
};

// ---- DNR + content scripts -----------------------------------------------
const applyDynamicRules = async (state) => {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const pauseRules = state.paused.map((domain, index) => ({
    id: index + 1,
    priority: 100,
    action: { type: "allowAllRequests" },
    condition: {
      requestDomains: [domain],
      resourceTypes: ["main_frame", "sub_frame"],
    },
  }));
  const learnedDomains = Object.keys(state.learned);
  const learnedRules = learnedDomains.length
    ? [
        {
          id: LEARNED_RULE_ID,
          priority: 2,
          action: { type: "block" },
          condition: {
            requestDomains: learnedDomains,
            resourceTypes: ALL_RESOURCE_TYPES,
          },
        },
      ]
    : [];
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: [...pauseRules, ...learnedRules],
  });
};

const applyRulesets = (state) =>
  chrome.declarativeNetRequest.updateEnabledRulesets(
    state.trackers
      ? { enableRulesetIds: ["trackers"] }
      : { disableRulesetIds: ["trackers"] },
  );

const syncContentScripts = async (state) => {
  const excludeMatches = state.paused.flatMap((domain) => [
    `*://${domain}/*`,
    `*://*.${domain}/*`,
  ]);
  const common = {
    matches: ["http://*/*", "https://*/*"],
    ...(excludeMatches.length ? { excludeMatches } : {}),
    runAt: "document_start",
    allFrames: true,
    matchOriginAsFallback: true,
    persistAcrossSessions: true,
  };
  const registered = await chrome.scripting.getRegisteredContentScripts({
    ids: SCRIPT_IDS,
  });
  if (registered.length)
    await chrome.scripting.unregisterContentScripts({
      ids: registered.map((s) => s.id),
    });
  await chrome.scripting.registerContentScripts([
    {
      ...common,
      id: "suzgec-main",
      world: "MAIN",
      js: ["src/heuristics.main.js", "src/content-main.js"],
    },
    {
      ...common,
      id: "suzgec-isolated",
      world: "ISOLATED",
      js: ["src/heuristics.js", "src/content.js"],
      css: ["src/cosmetic.css"],
    },
  ]);
};

const applyAll = async (state) => {
  await Promise.all([
    applyDynamicRules(state),
    applyRulesets(state),
    syncContentScripts(state),
  ]);
};

// ---- per-tab counters (session storage) ------------------------------------
const tabKey = (tabId) => `tab:${tabId}`;
const EMPTY_TAB = Object.freeze({ popup: 0, hidden: 0 });

const bumpTab = async (tabId, field) => {
  if (tabId == null || tabId < 0) return;
  const key = tabKey(tabId);
  const { [key]: current = EMPTY_TAB } = await chrome.storage.session.get(key);
  await chrome.storage.session.set({
    [key]: { ...current, [field]: current[field] + 1 },
  });
};

// ---- learning --------------------------------------------------------------
const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const learnFrom = ({ url, score, kind, pageHost }) =>
  updateState((state) => {
    const host = hostOf(url);
    if (!host || H.isSafeHost(host) || H.isSameSite(host, pageHost))
      return state;
    const domain = H.learnKey(host);
    if (
      state.learned[domain] ||
      Object.keys(state.learned).length >= MAX_LEARNED
    )
      return state;

    const strong = kind !== "popup" && score >= H.LEARN_SCORE;
    const previous = state.candidates[domain]?.hits ?? 0;
    const hits = previous + 1;
    const from = H.registrableDomain(pageHost);

    if (strong || hits >= LEARN_AFTER_HITS) {
      const { [domain]: _dropped, ...candidates } = state.candidates;
      return {
        ...state,
        candidates,
        learned: {
          ...state.learned,
          [domain]: {
            at: Date.now(),
            from,
            reason: strong ? `skor ${score}` : `${hits} tekrar`,
          },
        },
      };
    }
    return {
      ...state,
      candidates: { ...state.candidates, [domain]: { hits, from } },
    };
  });

// ---- custom (picker) CSS ---------------------------------------------------
const customCss = (selectors) =>
  selectors.length
    ? `${selectors.join(",\n")} { display: none !important; }`
    : "";

const injectCustom = async (tabId, frameId, selectors) => {
  const css = customCss(selectors);
  if (!css) return;
  await chrome.scripting
    .insertCSS({ target: { tabId, frameIds: [frameId] }, css })
    .catch(() => {});
};

// ---- messages --------------------------------------------------------------
const fromContent = async (message, sender) => {
  const tabId = sender.tab?.id;
  const pageHost = String(message.pageHost ?? "");
  const site = H.registrableDomain(pageHost);

  switch (message.type) {
    case "init": {
      const state = await loadState();
      const selectors = state.custom[site] ?? [];
      if (tabId != null)
        await injectCustom(tabId, sender.frameId ?? 0, selectors);
      return { ok: true };
    }
    case "blocked": {
      const kind = message.kind === "popup" ? "popup" : "hidden";
      await bumpTab(tabId, kind);
      await updateState((state) => ({ ...state, total: state.total + 1 }));
      await learnFrom({
        url: String(message.url ?? ""),
        score: Number(message.score) || 0,
        kind: message.kind,
        pageHost,
      });
      return { ok: true };
    }
    case "addCustom": {
      const selector = String(message.selector ?? "");
      if (!H.isValidSelector(selector) || !site) return { ok: false };
      await updateState((state) => {
        const list = state.custom[site] ?? [];
        if (list.includes(selector) || list.length >= MAX_CUSTOM_PER_SITE)
          return state;
        return {
          ...state,
          custom: { ...state.custom, [site]: [...list, selector] },
        };
      });
      if (tabId != null)
        await injectCustom(tabId, sender.frameId ?? 0, [selector]);
      return { ok: true };
    }
    default:
      return { ok: false };
  }
};

const fromPopup = async (message) => {
  const site = H.registrableDomain(String(message.host ?? ""));
  switch (message.type) {
    case "popup:getState": {
      const state = await loadState();
      const { [tabKey(message.tabId)]: tab = EMPTY_TAB } =
        await chrome.storage.session.get(tabKey(message.tabId));
      const network = await chrome.declarativeNetRequest
        .getMatchedRules({ tabId: message.tabId })
        .then((r) => r.rulesMatchedInfo.length)
        .catch(() => null);
      return {
        site,
        paused: state.paused.includes(site),
        trackers: state.trackers,
        total: state.total,
        tab: { ...tab, network },
        learned: Object.entries(state.learned)
          .map(([domain, info]) => ({ domain, ...info }))
          .sort((a, b) => b.at - a.at),
        customCount: (state.custom[site] ?? []).length,
      };
    }
    case "popup:togglePause": {
      if (!site) return { ok: false };
      const state = await updateState((s) => ({
        ...s,
        paused: s.paused.includes(site)
          ? s.paused.filter((d) => d !== site)
          : [...s.paused, site],
      }));
      await applyAll(state);
      return { ok: true };
    }
    case "popup:toggleTrackers": {
      const state = await updateState((s) => ({ ...s, trackers: !s.trackers }));
      await applyRulesets(state);
      return { ok: true };
    }
    case "popup:forget": {
      const domain = String(message.domain ?? "");
      const state = await updateState((s) => {
        if (!s.learned[domain]) return s;
        const { [domain]: _removed, ...learned } = s.learned;
        return { ...s, learned };
      });
      await applyDynamicRules(state);
      return { ok: true };
    }
    case "popup:clearCustom": {
      await updateState((s) => {
        const { [site]: _removed, ...custom } = s.custom;
        return { ...s, custom };
      });
      return { ok: true };
    }
    case "popup:pick": {
      await chrome.tabs
        .sendMessage(message.tabId, { type: "pick" }, { frameId: 0 })
        .catch(() => {});
      return { ok: true };
    }
    default:
      return { ok: false };
  }
};

// Learned rules are applied in batches so a burst of ads triggers one DNR update.
let rulesTimer = 0;
const scheduleRuleSync = () => {
  clearTimeout(rulesTimer);
  rulesTimer = setTimeout(() => {
    loadState()
      .then(applyDynamicRules)
      .catch(() => {});
  }, 500);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const ownPage = String(sender.url ?? "").startsWith(chrome.runtime.getURL(""));
  const isPopup = sender.id === chrome.runtime.id && ownPage;
  const isContent =
    sender.id === chrome.runtime.id && !ownPage && Boolean(sender.tab);
  const handler =
    isPopup && String(message?.type).startsWith("popup:")
      ? fromPopup
      : isContent
        ? fromContent
        : null;
  if (!handler) return false;
  handler(message, sender)
    .then((result) => {
      if (message.type === "blocked") scheduleRuleSync();
      sendResponse(result);
    })
    .catch((error) =>
      sendResponse({ ok: false, error: String(error?.message ?? error) }),
    );
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading" && changeInfo.url)
    chrome.storage.session.remove(tabKey(tabId));
});
chrome.tabs.onRemoved.addListener((tabId) =>
  chrome.storage.session.remove(tabKey(tabId)),
);

const boot = async () => {
  await chrome.declarativeNetRequest.setExtensionActionOptions({
    displayActionCountAsBadgeText: true,
  });
  await chrome.action.setBadgeBackgroundColor({ color: "#b91c1c" });
  await applyAll(await loadState());
};

chrome.runtime.onInstalled.addListener(() => {
  boot().catch(() => {});
});
chrome.runtime.onStartup.addListener(() => {
  boot().catch(() => {});
});
