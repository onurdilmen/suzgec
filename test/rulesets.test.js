// Guards against Chrome silently refusing to load the extension because of a bad ruleset.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const manifest = read('manifest.json');
const rulesets = manifest.declarative_net_request.rule_resources.map((r) => ({ ...r, rules: read(r.path) }));
const GUARANTEED_STATIC_RULES = 30000;
const VALID_TYPES = new Set(['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'webtransport', 'webbundle', 'other']);

test('total enabled static rules fit the guaranteed budget', () => {
  const total = rulesets.reduce((n, r) => n + r.rules.length, 0);
  assert.ok(total <= GUARANTEED_STATIC_RULES, `${total} rules`);
});

for (const { id, rules } of rulesets) {
  test(`ruleset ${id}: ids, urlFilter syntax, types, regex budget, redirects`, () => {
    const ids = new Set();
    let regex = 0;
    for (const rule of rules) {
      assert.ok(Number.isInteger(rule.id) && rule.id > 0 && !ids.has(rule.id), `bad id ${rule.id}`);
      ids.add(rule.id);
      const c = rule.condition ?? {};
      if (c.urlFilter !== undefined) {
        assert.ok(/^[\x20-\x7e]+$/.test(c.urlFilter), `non-ascii urlFilter in ${rule.id}`);
        const inner = c.urlFilter.replace(/^\|\|?/, '').replace(/\|$/, '');
        assert.ok(!inner.includes('|'), `'|' inside urlFilter ${rule.id}: ${c.urlFilter}`);
        assert.ok(!c.urlFilter.startsWith('||*'), `'||*' in ${rule.id}`);
      }
      if (c.regexFilter !== undefined) regex += 1;
      for (const t of [...(c.resourceTypes ?? []), ...(c.excludedResourceTypes ?? [])]) assert.ok(VALID_TYPES.has(t), `type ${t}`);
      for (const key of ['requestDomains', 'initiatorDomains', 'excludedInitiatorDomains', 'excludedRequestDomains']) {
        if (c[key]) assert.ok(c[key].length > 0 && c[key].every((d) => /^[a-z0-9.-]+$/.test(d)), `${key} in ${rule.id}`);
      }
      const target = rule.action?.redirect?.extensionPath;
      if (target) assert.ok(existsSync(new URL(`..${target}`, import.meta.url)), `missing ${target}`);
    }
    assert.ok(regex <= 1000, `${regex} regex rules`);
  });
}
