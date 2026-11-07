import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(
  new URL("../src/heuristics.js", import.meta.url),
  "utf8",
);
const sandbox = { URL };
sandbox.globalThis = sandbox;
vm.runInNewContext(source, sandbox);
const H = sandbox.SuzgecHeuristics;

const PAGE =
  "https://www.hdfilmcehennemi.nl/dizi/evil-izle-14/sezon-3/bolum-5-hd16/";
const gesture = (over = {}) => ({
  time: 1000,
  href: null,
  interactive: false,
  isLink: false,
  ...over,
});

test("registrableDomain handles subdomains and two-level suffixes", () => {
  assert.equal(H.registrableDomain("cvt-s2.agl005.tech"), "agl005.tech");
  assert.equal(H.registrableDomain("www.teknoweb.com.tr"), "teknoweb.com.tr");
  assert.equal(H.registrableDomain("fmhdfc.click"), "fmhdfc.click");
});

test("learnKey keeps full host on shared hosting", () => {
  assert.equal(H.learnKey("d123.cloudfront.net"), "d123.cloudfront.net");
  assert.equal(H.learnKey("cvt-s1.adangle.online"), "adangle.online");
});

test("betting video banner (728x90, cross-site, money wrapper) is hidden and learned", () => {
  const r = H.scoreAdCandidate({
    url: "https://fmhdfc.click/g/s5hy9awr",
    pageUrl: PAGE,
    width: 728,
    height: 90,
    hasMedia: true,
    text: "",
    context: "money-item money-wrapper",
  });
  assert.equal(r.hide, true);
  assert.equal(r.learn, true);
  assert.equal(r.domain, "fmhdfc.click");
});

test("text betting bar is hidden but not learned from one sighting", () => {
  const r = H.scoreAdCandidate({
    url: "https://fmhdfc.click/g/x",
    pageUrl: PAGE,
    width: 1152,
    height: 40,
    text: "Çevrimsiz deneme bonusu",
    context: "money-text money-item",
  });
  assert.equal(r.hide, true);
  assert.equal(r.learn, false);
});

test("ordinary outbound text link is left alone", () => {
  const r = H.scoreAdCandidate({
    url: "https://example.org/article",
    pageUrl: PAGE,
    width: 120,
    height: 18,
    text: "kaynak",
  });
  assert.equal(r.hide, false);
});

test("same-site and safe hosts never score", () => {
  assert.equal(
    H.scoreAdCandidate({
      url: "/film/x",
      pageUrl: PAGE,
      width: 728,
      height: 90,
      hasMedia: true,
    }).score,
    0,
  );
  assert.equal(
    H.scoreAdCandidate({
      url: "https://t.me/kanal",
      pageUrl: PAGE,
      width: 300,
      height: 250,
      hasMedia: true,
    }).score,
    0,
  );
});

test("popunder from a click on the player overlay is blocked", () => {
  const r = H.judgePopup({
    url: "https://cvt-s2.agl005.tech/o",
    pageUrl: PAGE,
    gesture: gesture(),
    now: 1200,
  });
  assert.equal(r.block, true);
});

test("popup without any user gesture is blocked", () => {
  const r = H.judgePopup({
    url: "https://example.org",
    pageUrl: PAGE,
    gesture: gesture({ time: 0 }),
    now: 5000,
  });
  assert.equal(r.block, true);
});

test("link clicked by the user opening its own href is allowed", () => {
  const href = "https://example.org/page";
  const r = H.judgePopup({
    url: href,
    pageUrl: PAGE,
    gesture: gesture({ href, interactive: true, isLink: true }),
    now: 1100,
  });
  assert.equal(r.block, false);
});

test("clicking an internal link that opens a different site is blocked", () => {
  const r = H.judgePopup({
    url: "https://ads.example.net/x",
    pageUrl: PAGE,
    gesture: gesture({
      href: "https://www.hdfilmcehennemi.nl/film/a",
      interactive: true,
      isLink: true,
    }),
    now: 1100,
  });
  assert.equal(r.block, true);
});

test("button opening a cross-site window (share/OAuth) is allowed, gambling is not", () => {
  const g = gesture({ interactive: true });
  assert.equal(
    H.judgePopup({
      url: "https://twitter.com/intent/tweet",
      pageUrl: PAGE,
      gesture: g,
      now: 1100,
    }).block,
    false,
  );
  assert.equal(
    H.judgePopup({
      url: "https://luxbet123.com",
      pageUrl: PAGE,
      gesture: g,
      now: 1100,
    }).block,
    true,
  );
});

test("about:blank popunder from non-button click is blocked", () => {
  assert.equal(
    H.judgePopup({ url: "", pageUrl: PAGE, gesture: gesture(), now: 1100 })
      .block,
    true,
  );
});

test("synthetic _blank anchor to another site is blocked", () => {
  assert.equal(
    H.judgeSyntheticAnchor({
      href: "https://ad.example/x",
      target: "_blank",
      connected: false,
      pageUrl: PAGE,
    }).block,
    true,
  );
  assert.equal(
    H.judgeSyntheticAnchor({
      href: "/download.zip",
      target: "",
      connected: false,
      pageUrl: PAGE,
    }).block,
    false,
  );
});

test("invisible fullscreen link overlay is blocked; visible play button is not", () => {
  const base = { pageUrl: PAGE, zIndex: 9999, textLength: 0, hasMedia: false };
  assert.equal(
    H.judgeOverlay({
      ...base,
      coverRatio: 1,
      opacity: 0,
      position: "fixed",
      transparent: true,
      url: "https://fmhdfc.click/g/a",
    }).block,
    true,
  );
  assert.equal(
    H.judgeOverlay({
      ...base,
      coverRatio: 0.5,
      opacity: 1,
      position: "absolute",
      transparent: false,
      hasMedia: true,
      url: null,
    }).block,
    false,
  );
});

test("selector validation rejects CSS injection", () => {
  assert.equal(H.isValidSelector("div.money-wrapper > a"), true);
  assert.equal(H.isValidSelector("a{} body{display:none"), false);
});

test("non-http popups fail closed unless opened from a real button", () => {
  const g = { time: 1000, href: null, interactive: false, isLink: false };
  assert.equal(H.judgePopup({ url: "data:text/html,x", pageUrl: PAGE, gesture: g, now: 1100 }).block, true);
  assert.equal(H.judgePopup({ url: "javascript:alert(1)", pageUrl: PAGE, gesture: { ...g, interactive: true }, now: 1100 }).block, true);
  assert.equal(H.judgePopup({ url: "blob:https://www.hdfilmcehennemi.nl/x", pageUrl: PAGE, gesture: { ...g, interactive: true }, now: 1100 }).block, false);
});

test("MAIN-world copy of heuristics is in sync (run npm run build)", () => {
  const main = readFileSync(new URL("../src/heuristics.main.js", import.meta.url), "utf8");
  assert.equal(main, source);
});
