/*
 * Runs in the page's MAIN world at document_start, before any site script.
 * Guards window.open and script-driven anchor clicks (popunders, tab-unders).
 */
(() => {
  "use strict";

  const H = globalThis.SuzgecHeuristics;
  try {
    delete globalThis.SuzgecHeuristics; // do not leave a detectable global behind
  } catch {
    /* non-configurable in exotic frames: harmless */
  }
  if (!H) return;

  const nativeOpen = window.open;
  const nativeClick = HTMLElement.prototype.click;
  const nativeDispatch = EventTarget.prototype.dispatchEvent;
  const targetOrigin = location.origin === "null" ? "*" : location.origin;

  let lastGesture = {
    time: -Infinity,
    href: null,
    interactive: false,
    isLink: false,
  };

  const report = (kind, url) => {
    window.postMessage(
      { source: "suzgec-main", kind, url: String(url ?? "").slice(0, 300) },
      targetOrigin,
    );
  };

  const recordGesture = (event) => {
    if (!event.isTrusted) return;
    const target = event.target instanceof Element ? event.target : null;
    const anchor = target?.closest("a[href]") ?? null;
    lastGesture = {
      time: performance.now(),
      href: anchor ? anchor.href : null,
      isLink: Boolean(anchor),
      interactive: Boolean(
        target?.closest(
          'a[href],button,[role="button"],input[type="submit"],input[type="button"],summary',
        ),
      ),
    };
  };
  window.addEventListener("pointerdown", recordGesture, true);
  window.addEventListener("keydown", recordGesture, true);

  // Stand-in returned to blocked window.open callers so they don't fall back to other tricks.
  const fakeWindow = () =>
    new Proxy(function stub() {}, {
      get: (_target, prop) => {
        if (prop === "closed") return false;
        if (prop === Symbol.toPrimitive) return () => "";
        return fakeWindow();
      },
      set: () => true,
      apply: () => undefined,
    });

  const guardedOpen = function open(url, target, features) {
    const verdict = H.judgePopup({
      url,
      pageUrl: location.href,
      gesture: lastGesture,
      now: performance.now(),
    });
    if (verdict.block) {
      report("popup", url || "about:blank");
      return fakeWindow();
    }
    return nativeOpen.call(window, url, target, features);
  };

  const anchorBlocked = (el) =>
    el instanceof HTMLAnchorElement &&
    H.judgeSyntheticAnchor({
      href: el.href,
      target: el.target,
      connected: el.isConnected,
      pageUrl: location.href,
    }).block;

  const guardedClick = function click() {
    if (anchorBlocked(this)) {
      report("popup", this.href);
      return undefined;
    }
    return nativeClick.call(this);
  };

  const guardedDispatch = function dispatchEvent(event) {
    if (
      event instanceof MouseEvent &&
      event.type === "click" &&
      anchorBlocked(this)
    ) {
      report("popup", this.href);
      return false;
    }
    return nativeDispatch.call(this, event);
  };

  const mask = (fn, native) => {
    Object.defineProperty(fn, "toString", {
      value: () => Function.prototype.toString.call(native),
      configurable: true,
    });
    return fn;
  };

  window.open = mask(guardedOpen, nativeOpen);
  HTMLElement.prototype.click = mask(guardedClick, nativeClick);
  EventTarget.prototype.dispatchEvent = mask(guardedDispatch, nativeDispatch);
})();
