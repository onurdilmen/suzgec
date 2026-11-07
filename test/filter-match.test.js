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
