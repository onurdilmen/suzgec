import { test } from "node:test";
import assert from "node:assert/strict";
import {
  compilePattern,
  createPopupMatcher,
  hostChain,
  selectorsForHost,
  cssFor,
} from "../src/filter-match.js";

const regDomain = (h) => h.split(".").slice(-2).join(".");

test("hostChain walks up parent domains", () => {
  assert.deepEqual(hostChain("a.b.example.com"), [
    "a.b.example.com",
    "b.example.com",
    "example.com",
    "com",
  ]);
});

test("compilePattern follows adblock semantics", () => {
  assert.ok(
    compilePattern("||ads.example^").test("https://x.ads.example/path"),
  );
  assert.ok(!compilePattern("||ads.example^").test("https://notads.example/"));
  assert.ok(!compilePattern("||ads.example^").test("https://ads.example.org/"));
  assert.ok(compilePattern("/earn.php?z=").test("https://a.b/earn.php?z=1"));
  assert.ok(compilePattern("|https://pop.").test("https://pop.site/"));
  assert.ok(!compilePattern("|https://pop.").test("http://x/https://pop."));
});

test("popup matcher: host list, scoped patterns and exceptions", () => {
  const match = createPopupMatcher(
    {
      hosts: ["popads.example"],
      patterns: [
        ["/landing/*", ["film.example"], [], ""],
        ["&popunder=", [], [], "thirdParty"],
      ],
      allow: [["||popads.example/ok^", [], [], ""]],
    },
    regDomain,
  );
  assert.equal(
    match("https://cdn.popads.example/x", "film.example"),
    "popup-list",
  );
  assert.equal(match("https://popads.example/ok/", "film.example"), null);
  assert.equal(
    match("https://any.example/landing/1", "film.example"),
    "popup-list",
  );
  assert.equal(match("https://any.example/landing/1", "news.example"), null);
  assert.equal(
    match("https://film.example/?a&popunder=1", "film.example"),
    null,
    "first-party not matched by thirdParty rule",
  );
  assert.equal(match("chrome://settings", "film.example"), null);
});

test("site-specific selectors respect parent domains and exclusions", () => {
  const data = {
    specific: {
      "example.com": [[".promo", ["m.example.com"]]],
      "news.example.com": [["#top-ad"]],
    },
    scoped: [
      [".sponsor", ["example.com"]],
      [".ad-slot", []],
    ],
  };
  assert.deepEqual(selectorsForHost("news.example.com", data).sort(), [
    "#top-ad",
    ".ad-slot",
    ".promo",
  ]);
  assert.deepEqual(selectorsForHost("m.example.com", data), [".ad-slot"]);
  assert.deepEqual(selectorsForHost("other.org", data).sort(), [
    ".ad-slot",
    ".sponsor",
  ]);
});

test("cssFor emits one rule per selector", () => {
  assert.equal(
    cssFor([".a", ".b"]),
    ".a{display:none!important}\n.b{display:none!important}",
  );
});

test("injectionsForHost picks scriptlets/extcss by domain, group and exceptions", async () => {
  const { injectionsForHost } = await import("../src/filter-match.js");
  const entry = (o) => ({ args: [], include: [], exclude: [], exception: false, group: "filters", ...o });
  const scriptlets = [
    entry({ name: "set-constant", args: ["adBlock", "false"], include: ["example.com"] }),
    entry({ name: "abort-on-property-read", args: ["popunder"] }),
    entry({ name: "json-prune", args: ["ads"], include: ["video.example.com"] }),
    entry({ name: "", include: ["safe.example.com"], exception: true }),
    entry({ name: "abort-on-property-read", args: ["popunder"], include: ["news.org"], exception: true }),
    entry({ name: "set-constant", args: ["x", "1"], include: ["example.com"], group: "privacy" }),
  ];
  const index = (entries) => {
    const byDomain = {};
    const generic = [];
    entries.forEach((e, i) => (e.include.length ? e.include.forEach((d) => (byDomain[d] ??= []).push(i)) : generic.push(i)));
    return { entries, byDomain, generic };
  };
  const extcss = [
    entry({ css: ".ad:contains(Reklam) { display: none !important; }", include: ["example.com"] }),
    entry({ css: ".ad:contains(Reklam) { display: none !important; }", include: ["video.example.com"], exception: true }),
  ];
  const data = { scriptlets: index(scriptlets), extcss: index(extcss) };
  const groups = new Set(["filters"]);

  const a = injectionsForHost("video.example.com", data, groups);
  assert.deepEqual(a.scriptlets.map((s) => s.name).sort(), ["abort-on-property-read", "json-prune", "set-constant"]);
  assert.deepEqual(a.css, []);

  assert.deepEqual(injectionsForHost("safe.example.com", data, groups).scriptlets, []);
  assert.deepEqual(injectionsForHost("news.org", data, groups).scriptlets, []);
  assert.equal(injectionsForHost("example.com", data, groups).css.length, 1);
  assert.equal(injectionsForHost("example.com", data, new Set(["filters", "privacy"])).scriptlets.length, 3);
});
