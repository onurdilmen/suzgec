/*
 * Süzgeç heuristics — pure functions shared by the content scripts and tests.
 * Loaded as a classic script; exposes globalThis.SuzgecHeuristics.
 */
(() => {
  "use strict";

  const AD_SIZES = Object.freeze([
    [728, 90],
    [970, 90],
    [970, 250],
    [468, 60],
    [320, 50],
    [320, 100],
    [300, 50],
    [300, 250],
    [336, 280],
    [250, 250],
    [200, 200],
    [160, 600],
    [120, 600],
    [300, 600],
  ]);
  const SIZE_TOLERANCE = 8;

  const TWO_LEVEL_SUFFIXES = new Set([
    "com.tr",
    "net.tr",
    "org.tr",
    "gen.tr",
    "web.tr",
    "biz.tr",
    "info.tr",
    "edu.tr",
    "gov.tr",
    "bel.tr",
    "k12.tr",
    "av.tr",
    "co.uk",
    "org.uk",
    "ac.uk",
    "com.au",
    "com.br",
    "co.jp",
    "co.in",
  ]);

  // Hosts where each subdomain belongs to a different owner: never collapse to the registrable domain.
  const SHARED_HOSTING = new Set([
    "cloudfront.net",
    "amazonaws.com",
    "github.io",
    "blogspot.com",
    "herokuapp.com",
    "netlify.app",
    "vercel.app",
    "pages.dev",
    "workers.dev",
    "azureedge.net",
    "akamaized.net",
    "googleusercontent.com",
    "appspot.com",
    "firebaseapp.com",
    "web.app",
    "r2.dev",
  ]);

  // Never hidden, never learned.
  const SAFE_DOMAINS = new Set([
    "google.com",
    "google.com.tr",
    "gstatic.com",
    "googleapis.com",
    "youtube.com",
    "youtu.be",
    "twitter.com",
    "x.com",
    "t.me",
    "telegram.org",
    "whatsapp.com",
    "facebook.com",
    "instagram.com",
    "wikipedia.org",
    "github.com",
    "apple.com",
    "microsoft.com",
    "cloudflare.com",
    "linkedin.com",
    "reddit.com",
    "tiktok.com",
    "spotify.com",
    "discord.com",
    "discord.gg",
    "vimeo.com",
    "twitch.tv",
    "paypal.com",
    "iyzico.com",
    "stripe.com",
    "turkiye.gov.tr",
  ]);

  const GAMBLING_HOST =
    /(bet|casino|bahis|slot|bonus|rulet|poker|jackpot|iddaa|kumar)/i;
  const GAMBLING_TEXT =
    /(^|[^a-zçğıöşü])(bet|casino|bahis|slot|bonus|rulet|poker|jackpot|iddaa|kumar|freespin|çevrimsiz)/i;
  const AD_TOKEN =
    /(^|[\s_-])(ad|ads|adv|advert|advertising|banner|sponsor|sponsored|money|promo|reklam|partner)(?=$|[\s_-])/i;

  const HIDE_SCORE = 6;
  const LEARN_SCORE = 8;
  const GESTURE_WINDOW_MS = 1000;

  const parseUrl = (url, base) => {
    try {
      return new URL(url, base);
    } catch {
      return null;
    }
  };

  const isHttp = (u) =>
    Boolean(u) && (u.protocol === "http:" || u.protocol === "https:");

  const registrableDomain = (hostname) => {
    const host = String(hostname ?? "")
      .toLowerCase()
      .replace(/^\.+|\.+$/g, "");
    if (!host || /^\d+(\.\d+){3}$/.test(host) || host.includes(":"))
      return host;
    const labels = host.split(".");
    if (labels.length <= 2) return host;
    const lastTwo = labels.slice(-2).join(".");
    return TWO_LEVEL_SUFFIXES.has(lastTwo)
      ? labels.slice(-3).join(".")
      : lastTwo;
  };

  // Domain key used for learned block rules.
  const learnKey = (hostname) => {
    const host = String(hostname ?? "").toLowerCase();
    const base = registrableDomain(host);
    return SHARED_HOSTING.has(base) ? host : base;
  };

  const isSameSite = (a, b) => registrableDomain(a) === registrableDomain(b);
  const isSafeHost = (hostname) =>
    SAFE_DOMAINS.has(registrableDomain(hostname));

  const isAdSize = (w, h) =>
    w > 0 &&
    h > 0 &&
    AD_SIZES.some(
      ([aw, ah]) =>
        Math.abs(w - aw) <= SIZE_TOLERANCE &&
        Math.abs(h - ah) <= SIZE_TOLERANCE,
    );

  const NO_AD = Object.freeze({
    score: 0,
    hide: false,
    learn: false,
    reasons: [],
    domain: null,
  });

  /**
   * Scores an outbound link or iframe as an ad.
   * @param {{url:string,pageUrl:string,width?:number,height?:number,hasMedia?:boolean,text?:string,context?:string}} input
   */
  const scoreAdCandidate = ({
    url,
    pageUrl,
    width = 0,
    height = 0,
    hasMedia = false,
    text = "",
    context = "",
  }) => {
    const target = parseUrl(url, pageUrl);
    const page = parseUrl(pageUrl);
    if (!isHttp(target) || !page) return NO_AD;
    if (
      isSameSite(target.hostname, page.hostname) ||
      isSafeHost(target.hostname)
    )
      return NO_AD;

    const reasons = ["cross-site"];
    let score = 3;
    if (isAdSize(width, height)) {
      score += 3;
      reasons.push("ad-size");
    }
    if (hasMedia && text.trim().length < 40) {
      score += 2;
      reasons.push("media");
    }
    if (GAMBLING_HOST.test(target.hostname) || GAMBLING_TEXT.test(text)) {
      score += 2;
      reasons.push("gambling");
    }
    if (AD_TOKEN.test(context)) {
      score += 2;
      reasons.push("ad-context");
    }
    return {
      score,
      hide: score >= HIDE_SCORE,
      learn: score >= LEARN_SCORE,
      reasons,
      domain: learnKey(target.hostname),
    };
  };

  const ALLOW = Object.freeze({ block: false, reason: "allowed" });

  /**
   * Decides whether a window.open() call is a popup/popunder.
   * gesture: last trusted pointer/key event — { time, href, interactive, isLink }.
   */
  const judgePopup = ({
    url,
    pageUrl,
    gesture,
    now,
    windowMs = GESTURE_WINDOW_MS,
  }) => {
    const recent = Boolean(gesture) && now - gesture.time <= windowMs;
    if (!recent) return { block: true, reason: "no-gesture" };

    const text = String(url ?? "").trim();
    if (text === "" || text === "about:blank") {
      return gesture.interactive && !gesture.isLink
        ? ALLOW
        : { block: true, reason: "blank-popunder" };
    }

    // Fail closed: anything we cannot classify is only allowed from a real button press.
    const fromButton = gesture.interactive && !gesture.isLink;
    const target = parseUrl(text, pageUrl);
    const page = parseUrl(pageUrl);
    if (!target || !page)
      return fromButton ? ALLOW : { block: true, reason: "unparsable-url" };
    if (target.protocol === "javascript:")
      return { block: true, reason: "javascript-url" };
    if (!isHttp(target))
      return fromButton ? ALLOW : { block: true, reason: "non-http-popup" };
    if (isSameSite(target.hostname, page.hostname)) return ALLOW;
    if (gesture.href && parseUrl(gesture.href)?.href === target.href)
      return ALLOW;
    if (GAMBLING_HOST.test(target.hostname))
      return { block: true, reason: "gambling-popup" };
    // A real button (share, OAuth, payment) may open a cross-site window; a click on a link
    // or a plain div that opens some *other* site is the popunder pattern.
    if (gesture.interactive && !gesture.isLink) return ALLOW;
    return { block: true, reason: "cross-site-popup" };
  };

  /** Script-driven anchor.click() / dispatchEvent(click) used to open ads. */
  const judgeSyntheticAnchor = ({ href, target, connected, pageUrl }) => {
    const dest = parseUrl(href, pageUrl);
    const page = parseUrl(pageUrl);
    if (!isHttp(dest) || !page || isSameSite(dest.hostname, page.hostname))
      return ALLOW;
    if (target === "_blank" || !connected)
      return { block: true, reason: "synthetic-anchor" };
    return ALLOW;
  };

  /** Invisible full-page layers that swallow the first click. */
  const judgeOverlay = ({
    coverRatio,
    opacity,
    position,
    zIndex,
    transparent,
    textLength,
    hasMedia,
    url,
    pageUrl,
  }) => {
    if (coverRatio < 0.4 || (position !== "fixed" && position !== "absolute"))
      return ALLOW;
    const invisible =
      opacity < 0.1 || (transparent && textLength === 0 && !hasMedia);
    if (!invisible) return ALLOW;
    const dest = url ? parseUrl(url, pageUrl) : null;
    const page = parseUrl(pageUrl);
    const crossSite =
      isHttp(dest) &&
      page &&
      !isSameSite(dest.hostname, page.hostname) &&
      !isSafeHost(dest.hostname);
    if (crossSite) return { block: true, reason: "overlay-link" };
    if (position === "fixed" && zIndex >= 1000 && coverRatio >= 0.8)
      return { block: true, reason: "overlay-layer" };
    return ALLOW;
  };

  const hasAdToken = (text) => AD_TOKEN.test(String(text ?? ""));

  /**
   * An ad slot whose filler was blocked: ad-named container with no text and no
   * visible media left inside. Large containers are never touched (could be layout).
   */
  const judgeEmptySlot = ({ context, textLength, visibleMedia, width, height }) => {
    if (!hasAdToken(context) || textLength > 0 || visibleMedia > 0) return ALLOW;
    if (height > 400 || width * height > 400 * 1200) return ALLOW;
    return { block: true, reason: "empty-ad-slot" };
  };

  const isValidSelector = (selector) =>
    typeof selector === "string" &&
    selector.length > 0 &&
    selector.length <= 500 &&
    !/[{};<@]|\/\*/.test(selector);

  globalThis.SuzgecHeuristics = Object.freeze({
    HIDE_SCORE,
    LEARN_SCORE,
    registrableDomain,
    learnKey,
    isSameSite,
    isSafeHost,
    isAdSize,
    scoreAdCandidate,
    judgePopup,
    judgeSyntheticAnchor,
    judgeOverlay,
    isValidSelector,
    hasAdToken,
    judgeEmptySlot,
  });
})();
