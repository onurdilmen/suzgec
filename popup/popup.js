const $ = (id) => document.getElementById(id);

const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const host = (() => {
  try {
    const url = new URL(tab?.url ?? "");
    return url.protocol.startsWith("http") ? url.hostname : "";
  } catch {
    return "";
  }
})();

const call = (type, extra = {}) =>
  chrome.runtime.sendMessage({ type, tabId: tab?.id, host, ...extra });

const REASON_LABELS = {
  "cross-site": "başka siteye gidiyor",
  "ad-size": "standart reklam boyutu",
  media: "görsel/video banner",
  gambling: "bahis/kumar içeriği",
  "ad-context": "reklam alanında",
  "same-advertiser": "aynı reklamcı",
  "overlay-link": "görünmez tıklama tuzağı",
  "overlay-layer": "görünmez tam ekran katman",
  "empty-ad-slot": "içi boşalmış reklam alanı",
};
const KIND_LABELS = { popup: "Popup engellendi", hidden: "Gizlendi" };

const describe = (entry) => {
  const reasons = entry.reasons
    .filter((r) => r !== "cross-site")
    .map((r) => REASON_LABELS[r] ?? r);
  const head = KIND_LABELS[entry.kind] ?? entry.kind;
  return reasons.length ? `${head}: ${reasons.join(", ")}` : head;
};

const render = (state) => {
  $("site").textContent = state.site || "bu sayfa desteklenmiyor";
  const active = !state.paused;
  $("pause").setAttribute("aria-pressed", String(active));
  $("pause").disabled = !host;
  $("pause-label").textContent = active
    ? "Bu sitede koruma açık"
    : "Bu sitede koruma kapalı";
  const net = state.tab.network;
  $("s-network").textContent = net ? net.total : "–";
  $("breakdown").hidden = !net || net.total === 0;
  if (net)
    $("breakdown").textContent =
      `Reklam listesi ${net.ads} · İzleyici ${net.trackers} · Öğrenilen ${net.learned}`;
  $("s-hidden").textContent = state.tab.hidden;
  $("s-popup").textContent = state.tab.popup;
  $("trackers").checked = state.trackers;
  $("total").textContent = state.total.toLocaleString("tr-TR");
  $("pick").disabled = !host || state.paused;
  $("clear-custom").hidden = state.customCount === 0;
  $("custom-count").textContent = state.customCount;

  $("learned-count").textContent = state.learned.length;
  $("learned-empty").hidden = state.learned.length > 0;
  const template = $("learned-item");
  const items = state.learned.map((entry) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".domain").textContent = entry.domain;
    node.querySelector(".why").textContent =
      `${entry.from || "?"} · ${entry.reason}`;
    node.querySelector(".forget").addEventListener("click", async () => {
      await call("popup:forget", { domain: entry.domain });
      await refresh();
    });
    return node;
  });
  $("learned").replaceChildren(...items);

  const log = state.tab.log ?? [];
  $("log-empty").hidden = log.length > 0;
  $("log").replaceChildren(
    ...log.map((entry) => {
      const node = $("log-item").content.firstElementChild.cloneNode(true);
      node.querySelector(".domain").textContent =
        entry.count > 1 ? `${entry.domain} ×${entry.count}` : entry.domain;
      node.querySelector(".why").textContent = describe(entry);
      const button = node.querySelector(".forget");
      // Popup reports can be forged by the page: no trust action for them.
      const canTrust =
        entry.kind === "hidden" &&
        entry.domain.includes(".") &&
        !entry.domain.startsWith("(");
      button.hidden = !canTrust;
      button.addEventListener("click", async () => {
        await call("popup:trust", { domain: entry.domain });
        if (tab?.id != null) chrome.tabs.reload(tab.id);
        await refresh();
      });
      return node;
    }),
  );

  $("trusted-section").hidden = state.trusted.length === 0;
  $("trusted-count").textContent = state.trusted.length;
  $("trusted").replaceChildren(
    ...state.trusted.map((domain) => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.querySelector(".domain").textContent = domain;
      node.querySelector(".why").textContent = "bu sitede engellenmez";
      const button = node.querySelector(".forget");
      button.textContent = "Kaldır";
      button.addEventListener("click", async () => {
        await call("popup:untrust", { domain });
        await refresh();
      });
      return node;
    }),
  );
};

const refresh = async () => render(await call("popup:getState"));

$("pause").addEventListener("click", async () => {
  await call("popup:togglePause");
  await refresh();
  if (tab?.id != null) chrome.tabs.reload(tab.id);
});

$("trackers").addEventListener("change", async () => {
  await call("popup:toggleTrackers");
  await refresh();
});

$("pick").addEventListener("click", async () => {
  await call("popup:pick");
  window.close();
});

$("clear-custom").addEventListener("click", async () => {
  await call("popup:clearCustom");
  await refresh();
  if (tab?.id != null) chrome.tabs.reload(tab.id);
});

await refresh();
