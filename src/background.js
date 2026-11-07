/*
 * Süzgeç service worker: state, learning, dynamic DNR rules, content-script registration.
 */
import "./heuristics.js";

const H = globalThis.SuzgecHeuristics;

const STATE_KEY = "state";
const LEARNED_RULE_ID = 100000;
const TRUSTED_RULE_ID = 100001;
const MAX_LOG = 40;
// A page controls its own DOM and can fake ad signals, so no single site may create a
// global rule: a domain is learned only after independent sites report it.
const STRONG_SITES = 2; // distinct sites with score >= LEARN_SCORE
const WEAK_SITES = 4; // distinct sites with a hide-level score
const MAX_CANDIDATES = 1000;
const MAX_CONTRIB_PER_SITE = 50; // a single site cannot flood the candidate list
const MAX_LEARNED = 2000;
const MAX_CUSTOM_PER_SITE = 200;
const ALL_TYPES = ["main_frame"]; // extended below
// Learned rules never include main_frame: a learned domain can't stop the user from visiting it.
const SUBRESOURCE_TYPES = [
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
ALL_TYPES.push(...SUBRESOURCE_TYPES);
const SCRIPT_IDS = ["suzgec-main", "suzgec-isolated"];

const DEFAULT_STATE = Object.freeze({
  paused: [], // registrable domains where protection is off
  learned: {}, // domain -> { at, from, reason }
  candidates: {}, // domain -> { hits, from }
  custom: {}, // registrable domain -> [selectors]
  trackers: true,
  trusted: [], // domains the user marked "not an ad": never hidden, learned or blocked
  contrib: {}, // site -> number of domains it has ever reported (persistent cap)
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
            resourceTypes: SUBRESOURCE_TYPES,
          },
        },
      ]
    : [];
  const trusted = state.trusted ?? [];
  const trustedRules = trusted.length
    ? [
        {
          id: TRUSTED_RULE_ID,
          priority: 50, // beats the static and learned block rules
          action: { type: "allow" },
          condition: { requestDomains: trusted, resourceTypes: ALL_TYPES },
        },
      ]
    : [];
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((rule) => rule.id),
    addRules: [...pauseRules, ...learnedRules, ...trustedRules],
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
const EMPTY_TAB = Object.freeze({ popup: 0, hidden: 0, log: [] });

// Session writes are serialised too: many ads report at once.
let tabQueue = Promise.resolve();
const updateTab = (tabId, mutate) => {
  if (tabId == null || tabId < 0) return Promise.resolve();
  const key = tabKey(tabId);
  const run = tabQueue.then(async () => {
    const { [key]: current = EMPTY_TAB } = await chrome.storage.session.get(key);
    await chrome.storage.session.set({ [key]: mutate({ ...EMPTY_TAB, ...current }) });
  });
  tabQueue = run.catch(() => {});
  return run;
};

const REASONS = new Set([
  "cross-site", "ad-size", "media", "gambling", "ad-context", "same-advertiser",
  "overlay-link", "overlay-layer",
]);

const recordBlock = (tabId, { kind, url, reasons }) =>
  updateTab(tabId, (tab) => {
    const host = hostOf(url);
    const domain = host ? H.learnKey(host) : kind === "popup" ? "(boş popup)" : "?";
    const clean = (Array.isArray(reasons) ? reasons : [])
      .map(String)
      .filter((r) => REASONS.has(r));
    const existing = tab.log.find((e) => e.domain === domain && e.kind === kind);
    const log = existing
      ? tab.log.map((e) => (e === existing ? { ...e, count: e.count + 1 } : e))
      : [{ domain, kind, reasons: clean, count: 1 }, ...tab.log].slice(0, MAX_LOG);
    return { ...tab, [kind]: tab[kind] + 1, log };
  });

// ---- learning --------------------------------------------------------------
const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

// IP literals, localhost and single-label hosts are free to mint: they never count as a site.
const isPublicSite = (site) =>
  Boolean(site) &&
  site.includes(".") &&
  !/^\d+(\.\d+){3}$/.test(site) &&
  !site.includes(":") &&
  !/(^|\.)localhost$/.test(site);

const learnFrom = ({ url, score, kind, pageHost }) =>
  updateState((state) => {
    // Popup reports travel over window.postMessage, which the page can spoof: stats only.
    if (kind === "popup") return state;
    const host = hostOf(url);
    const from = H.registrableDomain(pageHost);
    if (!host || !isPublicSite(from) || H.isSafeHost(host) || H.isSameSite(host, pageHost))
      return state;
    const domain = H.learnKey(host);
    if (
      state.learned[domain] ||
      (state.trusted ?? []).includes(domain) ||
      Object.keys(state.learned).length >= MAX_LEARNED
    )
      return state;

    const strong = score >= H.LEARN_SCORE;
    const raw = state.candidates[domain];
    const entry = Array.isArray(raw?.strong) && Array.isArray(raw?.weak)
      ? raw
      : { strong: [], weak: [] };
    const bucket = strong ? "strong" : "weak";
    if (entry[bucket].includes(from)) return state;

    const contrib = state.contrib ?? {};
    const contributions = contrib[from] ?? 0;
    if (contributions >= MAX_CONTRIB_PER_SITE) return state;
    const nextContrib = { ...contrib, [from]: contributions + 1 };

    const next = { ...entry, [bucket]: [...entry[bucket], from] };
    const sites = new Set([...next.strong, ...next.weak]);
    const learned =
      next.strong.length >= STRONG_SITES || sites.size >= WEAK_SITES;

    if (learned) {
      const { [domain]: _dropped, ...candidates } = state.candidates;
      return {
        ...state,
        candidates,
        contrib: nextContrib,
        learned: {
          ...state.learned,
          [domain]: {
            at: Date.now(),
            from: [...sites].slice(0, 3).join(", "),
            reason: `${sites.size} sitede reklam`,
          },
        },
      };
    }
    if (
      !state.candidates[domain] &&
      Object.keys(state.candidates).length >= MAX_CANDIDATES
    )
      return state;
    return {
      ...state,
      contrib: nextContrib,
      candidates: { ...state.candidates, [domain]: next },
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
      return { ok: true, trusted: state.trusted ?? [] };
    }
    case "blocked": {
      const kind = message.kind === "popup" ? "popup" : "hidden";
      await recordBlock(tabId, {
        kind,
        url: String(message.url ?? ""),
        reasons: message.reasons,
      });
      await updateState((state) => ({ ...state, total: state.total + 1 }));
      // Only top-level documents count as a reporting site, and the site comes from the
      // browser (sender.tab.url), not from the message: a page can't stack iframes of
      // many throwaway domains to fake independent sites.
      if (sender.frameId === 0) {
        await learnFrom({
          url: String(message.url ?? ""),
          score: Number(message.score) || 0,
          kind: message.kind,
          pageHost: hostOf(sender.tab?.url ?? ""),
        });
      }
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
        .then(({ rulesMatchedInfo }) =>
          rulesMatchedInfo.reduce(
            (acc, { rule }) => {
              const bucket =
                rule.rulesetId === "ads"
                  ? "ads"
                  : rule.rulesetId === "trackers"
                    ? "trackers"
                    : rule.ruleId === LEARNED_RULE_ID
                      ? "learned"
                      : null;
              return bucket
                ? { ...acc, total: acc.total + 1, [bucket]: acc[bucket] + 1 }
                : acc;
            },
            { total: 0, ads: 0, trackers: 0, learned: 0 },
          ),
        )
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
        trusted: state.trusted ?? [],
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
    case "popup:trust":
    case "popup:untrust": {
      const domain = H.learnKey(String(message.domain ?? "").toLowerCase());
      if (!/^[a-z0-9.-]+\.[a-z0-9-]+$/.test(domain)) return { ok: false };
      const trust = message.type === "popup:trust";
      const state = await updateState((s) => {
        const list = (s.trusted ?? []).filter((d) => d !== domain);
        if (!trust) return { ...s, trusted: list };
        const { [domain]: _l, ...learned } = s.learned;
        const { [domain]: _c, ...candidates } = s.candidates;
        return { ...s, learned, candidates, trusted: [...list, domain] };
      });
      await applyDynamicRules(state);
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
