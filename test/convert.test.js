import { test } from "node:test";
import assert from "node:assert/strict";
import {
  convertLists,
  parseNetworkFilter,
  parseCosmeticFilter,
  toAsciiHost,
} from "../scripts/filters/convert.mjs";

test("plain ||host^ rules are grouped into requestDomains", () => {
  const { dnr, stats } = convertLists([
    "||ads.example^\n||track.example^\n||ads.example^",
  ]);
  assert.equal(dnr.length, 1);
  assert.deepEqual(dnr[0].condition.requestDomains, [
    "ads.example",
    "track.example",
  ]);
  assert.equal(stats.blockedHosts, 2);
});

test("||host without ^ stays a urlFilter (prefix semantics)", () => {
  const { dnr } = convertLists(["||ads.example"]);
  assert.equal(dnr[0].condition.urlFilter, "||ads.example");
});

test("options map to DNR conditions", () => {
  const r = parseNetworkFilter(
    "||cdn.example^$script,third-party,domain=a.com|~b.a.com",
  );
  assert.equal(r.kind, "rule");
  assert.deepEqual(r.condition.resourceTypes, ["script"]);
  assert.equal(r.condition.domainType, "thirdParty");
  assert.deepEqual(r.condition.initiatorDomains, ["a.com"]);
  assert.deepEqual(r.condition.excludedInitiatorDomains, ["b.a.com"]);
});

test("negated types become excludedResourceTypes", () => {
  const r = parseNetworkFilter("/banner/*$~image");
  assert.deepEqual(r.condition.excludedResourceTypes, ["image"]);
});

test("exceptions become allow rules with higher priority; $important beats them", () => {
  const { dnr } = convertLists([
    "@@||good.example/ads.js",
    "/ads.js$important",
  ]);
  const allow = dnr.find((r) => r.action.type === "allow");
  const important = dnr.find((r) => r.action.type === "block");
  assert.ok(allow.priority > 1);
  assert.ok(important.priority > allow.priority);
});

test("@@$document becomes allowAllRequests on frames", () => {
  const { dnr } = convertLists(["@@||bank.example^$document"]);
  assert.equal(dnr[0].action.type, "allowAllRequests");
  assert.deepEqual(dnr[0].condition.resourceTypes, ["main_frame", "sub_frame"]);
});

test("unsupported modifiers, regex and non-ascii are skipped, not mistranslated", () => {
  const { dnr, stats } = convertLists([
    "||x.example^$redirect=noop.js",
    "/^https?:\\/\\/ad/",
    "/reklamı-göster.js",
    "$script",
  ]);
  assert.equal(dnr.length, 0);
  assert.equal(stats.skipped["option:redirect"], 1);
  assert.equal(stats.skipped.regex, 1);
  assert.equal(stats.skipped["non-ascii"], 1);
  assert.equal(stats.skipped["too-broad"], 1);
});

test("$badfilter cancels the matching rule", () => {
  const { dnr } = convertLists([
    "/adframe.$subdocument",
    "/adframe.$subdocument,badfilter",
  ]);
  assert.equal(dnr.length, 0);
});

test("generichide exceptions are collected for cosmetic opt-out", () => {
  const { cosmeticData } = convertLists(["@@||news.example^$generichide"]);
  assert.deepEqual(cosmeticData.generichide, ["news.example"]);
});

test("cosmetic: generic, specific, exceptions and unsafe selectors", () => {
  const { genericCss, cosmeticData, stats } = convertLists([
    [
      "##.ad-banner",
      "##.sponsor-box",
      "site.example#@#.sponsor-box",
      "site.example,~m.site.example##.promo",
      "##.x { color: red }",
      "tr.example##div:has-text(Reklam)",
      "tr.example##+js(nobab)",
    ].join("\n"),
  ]);
  assert.equal(genericCss, ".ad-banner{display:none!important}");
  assert.deepEqual(cosmeticData.scoped, [[".sponsor-box", ["site.example"]]]);
  assert.deepEqual(cosmeticData.specific["site.example"], [
    [".promo", ["m.site.example"]],
  ]);
  assert.equal(stats.skipped["unsafe-selector"], 1);
  assert.equal(stats.skipped.procedural, 1);
  assert.equal(stats.skipped["scriptlet-or-html"], 1);
});

test("cosmetic parser ignores network lines and handles IDN domains", () => {
  assert.equal(parseCosmeticFilter("||ads.example^"), null);
  assert.match(toAsciiHost("çiçek.com.tr"), /^xn--[a-z0-9-]+\.com\.tr$/);
});

test("popup filters go to the worker list, typed parts still become DNR rules", () => {
  const { dnr, popupData } = convertLists([
    "||popads.example^$popup\n/earn.php?z=$popup,subdocument\n@@||ok.example^$popup\n||scam.example^$document",
  ]);
  assert.deepEqual(popupData.hosts, ["popads.example"]);
  assert.equal(popupData.patterns[0][0], "/earn.php?z=");
  assert.equal(popupData.allow[0][0], "||ok.example^");
  assert.ok(dnr.some((r) => r.condition.urlFilter === "/earn.php?z=" && r.condition.resourceTypes.includes("sub_frame")));
  assert.ok(dnr.some((r) => r.condition.urlFilter === "||scam.example^" && r.condition.resourceTypes.includes("main_frame")));
});

test("patterns DNR cannot express are skipped or normalised", () => {
  assert.equal(parseNetworkFilter("/addyn|*;adtech;").kind, "skip");
  assert.equal(parseNetworkFilter("||*mac24.tv/*.gif").condition.urlFilter, "*mac24.tv/*.gif");
  assert.equal(parseNetworkFilter("|https://x.example/ad|").condition.urlFilter, "|https://x.example/ad|");
});
