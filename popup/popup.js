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

const render = (state) => {
  $("site").textContent = state.site || "bu sayfa desteklenmiyor";
  const active = !state.paused;
  $("pause").setAttribute("aria-pressed", String(active));
  $("pause").disabled = !host;
  $("pause-label").textContent = active
    ? "Bu sitede koruma açık"
    : "Bu sitede koruma kapalı";
  $("s-network").textContent = state.tab.network ?? "–";
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
