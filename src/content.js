/*
 * Isolated-world content script: heuristic ad hiding, click-hijack guard,
 * element picker, and the bridge to the service worker.
 */
(() => {
  "use strict";

  const H = globalThis.SuzgecHeuristics;
  if (!H) return;

  const HIDDEN_ATTR = "data-suzgec-hidden";
  const MEDIA = "img,video,iframe,picture,canvas,svg";
  const pageHost = location.hostname;
  const evaluated = new WeakSet();

  const send = (message) => {
    try {
      chrome.runtime.sendMessage({ ...message, pageHost }).catch(() => {});
    } catch {
      /* extension reloaded: this script is orphaned */
    }
  };

  // ---- bridge from the MAIN-world guard ----------------------------------
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.data?.source !== "suzgec-main") return;
    send({ type: "blocked", kind: "popup", url: String(event.data.url ?? "") });
  });

  // ---- heuristic hiding ---------------------------------------------------
  const tokensOf = (el) =>
    `${el.id ?? ""} ${typeof el.className === "string" ? el.className : ""}`;

  const contextOf = (el, depth = 4) => {
    const parts = [];
    let node = el;
    for (let i = 0; i < depth && node && node !== document.body; i += 1) {
      parts.push(tokensOf(node));
      node = node.parentElement;
    }
    return parts.join(" ");
  };

  // Climb through wrapper elements that are about the same size as the ad itself.
  const containerOf = (el) => {
    let node = el;
    for (let i = 0; i < 3; i += 1) {
      const parent = node.parentElement;
      if (
        !parent ||
        parent === document.body ||
        parent === document.documentElement
      )
        break;
      const a = node.getBoundingClientRect();
      const b = parent.getBoundingClientRect();
      if (b.width > a.width + 24 || b.height > a.height + 24) break;
      node = parent;
    }
    return node;
  };

  const hide = (el, kind, url, score) => {
    if (el.hasAttribute(HIDDEN_ATTR)) return;
    el.setAttribute(HIDDEN_ATTR, kind);
    send({ type: "blocked", kind, url, score });
  };

  // Once a domain is proven to serve an ad on this page, weaker links to it
  // (text strips, small buttons) are hidden too.
  const flaggedDomains = new Set();
  const pendingByDomain = new Map(); // domain -> [{ el, kind, url, score }]

  const flagDomain = (domain) => {
    if (!domain || flaggedDomains.has(domain)) return;
    flaggedDomains.add(domain);
    for (const item of pendingByDomain.get(domain) ?? []) {
      if (item.el.isConnected) hide(item.el, item.kind, item.url, item.score);
    }
    pendingByDomain.delete(domain);
  };

  const applyVerdict = (el, result, kind, url) => {
    if (result.score === 0 || !result.domain) return;
    const container = containerOf(el);
    if (result.hide) {
      hide(container, kind, url, result.score);
      flagDomain(result.domain);
      return;
    }
    if (flaggedDomains.has(result.domain)) {
      hide(container, kind, url, result.score);
      return;
    }
    const list = pendingByDomain.get(result.domain) ?? [];
    pendingByDomain.set(result.domain, [
      ...list,
      { el: container, kind, url, score: result.score },
    ]);
  };

  const hasBackgroundImage = (el) =>
    getComputedStyle(el).backgroundImage !== "none";

  const evaluateAnchor = (a) => {
    const rect = a.getBoundingClientRect();
    const media = a.querySelector(MEDIA);
    const mediaRect = media?.getBoundingClientRect();
    const width = Math.max(rect.width, mediaRect?.width ?? 0);
    const height = Math.max(rect.height, mediaRect?.height ?? 0);
    if (width === 0 && height === 0) return false; // not laid out yet — retry later
    const result = H.scoreAdCandidate({
      url: a.href,
      pageUrl: location.href,
      width,
      height,
      hasMedia: Boolean(media) || hasBackgroundImage(a),
      text: (a.textContent ?? "").trim().slice(0, 200),
      context: contextOf(a),
    });
    applyVerdict(a, result, "ad-link", a.href);
    return true;
  };

  const evaluateFrame = (frame) => {
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const result = H.scoreAdCandidate({
      url: frame.src,
      pageUrl: location.href,
      width: rect.width,
      height: rect.height,
      hasMedia: true,
      context: contextOf(frame),
    });
    applyVerdict(frame, result, "ad-frame", frame.src);
    return true;
  };

  const scan = () => {
    for (const el of document.querySelectorAll(
      `a[href]:not([${HIDDEN_ATTR}]), iframe[src]:not([${HIDDEN_ATTR}])`,
    )) {
      if (evaluated.has(el) || el.closest(`[${HIDDEN_ATTR}]`)) continue;
      const done =
        el instanceof HTMLIFrameElement
          ? evaluateFrame(el)
          : evaluateAnchor(el);
      if (done) evaluated.add(el);
    }
  };

  let scanTimer = 0;
  const scheduleScan = () => {
    if (scanTimer) return;
    scanTimer = window.setTimeout(() => {
      scanTimer = 0;
      scan();
    }, 250);
  };

  new MutationObserver(scheduleScan).observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href", "src", "style", "class"],
  });
  document.addEventListener("DOMContentLoaded", scheduleScan, { once: true });
  window.addEventListener("load", scheduleScan, { once: true });

  // ---- click-hijack guard (runs before page listeners: capture on window at document_start)
  window.addEventListener(
    "click",
    (event) => {
      if (!event.isTrusted || picking) return;
      const el = event.target instanceof Element ? event.target : null;
      if (!el || el === document.documentElement || el === document.body)
        return;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const anchor = el.closest("a[href]");
      const verdict = H.judgeOverlay({
        coverRatio:
          (rect.width * rect.height) /
          Math.max(1, window.innerWidth * window.innerHeight),
        opacity: Number(style.opacity),
        position: style.position,
        zIndex: Number.parseInt(style.zIndex, 10) || 0,
        transparent:
          /rgba\(0, 0, 0, 0\)|transparent/.test(style.backgroundColor) &&
          style.backgroundImage === "none",
        textLength: (el.textContent ?? "").trim().length,
        hasMedia: Boolean(el.querySelector(MEDIA)),
        url: anchor?.href ?? null,
        pageUrl: location.href,
      });
      if (!verdict.block) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      hide(el, "overlay", anchor?.href ?? "", 0);
    },
    true,
  );

  // ---- element picker (top frame only) -------------------------------------
  let picking = false;

  const buildSelector = (el) => {
    if (el.id && !/\d{3,}/.test(el.id)) {
      const byId = `#${CSS.escape(el.id)}`;
      if (document.querySelectorAll(byId).length === 1) return byId;
    }
    const parts = [];
    let node = el;
    while (
      node &&
      node.nodeType === Node.ELEMENT_NODE &&
      node !== document.body &&
      parts.length < 6
    ) {
      const classes = [...node.classList]
        .filter((c) => !/\d{3,}|^(active|show|open|hover|on|in)$/.test(c))
        .slice(0, 2);
      let part =
        node.localName + classes.map((c) => `.${CSS.escape(c)}`).join("");
      const parent = node.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter(
          (c) => c.localName === node.localName,
        );
        if (siblings.length > 1)
          part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      }
      parts.unshift(part);
      const selector = parts.join(" > ");
      if (document.querySelectorAll(selector).length === 1) return selector;
      node = parent;
    }
    return parts.join(" > ");
  };

  const startPicker = () => {
    if (picking || window.top !== window) return;
    picking = true;
    const box = document.createElement("div");
    box.className = "suzgec-pick-box";
    const hint = document.createElement("div");
    hint.className = "suzgec-pick-hint";
    hint.textContent = "Süzgeç: gizlenecek öğeye tıkla · Esc iptal";
    document.documentElement.append(box, hint);
    let current = null;

    const onMove = (event) => {
      const el = document.elementFromPoint(event.clientX, event.clientY);
      if (!el || el === box || el === hint) return;
      current = el;
      const r = el.getBoundingClientRect();
      box.style.setProperty("transform", `translate(${r.left}px, ${r.top}px)`);
      box.style.setProperty("width", `${r.width}px`);
      box.style.setProperty("height", `${r.height}px`);
    };
    const stop = () => {
      picking = false;
      box.remove();
      hint.remove();
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("click", onPick, true);
      window.removeEventListener("keydown", onKey, true);
    };
    const onPick = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const target = current;
      stop();
      if (!target) return;
      const selector = buildSelector(target);
      if (!H.isValidSelector(selector)) return;
      target.setAttribute(HIDDEN_ATTR, "manual");
      send({ type: "addCustom", selector });
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      stop();
    };
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("click", onPick, true);
    window.addEventListener("keydown", onKey, true);
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "pick") startPicker();
  });

  // Ask the worker to inject this site's custom (picker) rules.
  send({ type: "init" });
})();
