/*
 * Downloads the filter lists and regenerates every list-derived artefact.
 *
 * Groups (each can be switched off from the popup):
 *   filters     EasyList, AdGuard Turkish, uBlock filters/badware/unbreak, Süzgeç custom
 *   privacy     EasyPrivacy, uBlock privacy
 *   annoyances  EasyList Cookie
 *
 * Outputs:
 *   rules/<group>.json                  DNR static rulesets
 *   src/generated/generic-<group>.css   generic element hiding (content-script CSS)
 *   src/generated/cosmetic.json         site-specific / scoped hiding per group
 *   src/generated/inject.json           scriptlets + extended CSS per group
 *   src/generated/popup.json            popup/popunder destinations
 *   redirects/*                         $redirect surrogate resources
 *   src/vendor/extended-css.js          ExtendedCss runtime
 *   filters/meta.json                   versions + stats
 *
 *   npm run filters                 download + convert
 *   npm run filters -- --offline    reuse filters/cache
 */
import { copyFile, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Filter, FilterConverter } from '@adguard/dnr-converter';
import { convertLists } from './convert.mjs';
import { classifyLines } from './classify.mjs';
import { preprocess } from './preprocess.mjs';
import { writeScriptletBundles } from './scriptlet-bundles.mjs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const CACHE = path.join(ROOT, 'filters/cache');
const MODULES = path.join(ROOT, 'node_modules/@adguard');

const UBO_LICENSE = 'GPLv3 — https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE';
const EASYLIST_LICENSE = 'GPLv3 / CC BY-SA 3.0 — https://easylist.to/pages/licence.html';

export const LISTS = Object.freeze([
  { id: 'easylist', group: 'filters', title: 'EasyList', url: 'https://easylist.to/easylist/easylist.txt', license: EASYLIST_LICENSE },
  { id: 'adguard-turkish', group: 'filters', title: 'AdGuard Turkish', url: 'https://filters.adtidy.org/extension/ublock/filters/13.txt', license: 'GPLv3 — https://github.com/AdguardTeam/AdguardFilters/blob/master/LICENSE' },
  { id: 'ublock-filters', group: 'filters', title: 'uBlock filters', url: 'https://ublockorigin.github.io/uAssets/filters/filters.txt', license: UBO_LICENSE },
  { id: 'ublock-badware', group: 'filters', title: 'uBlock Badware', url: 'https://ublockorigin.github.io/uAssets/filters/badware.txt', license: UBO_LICENSE },
  { id: 'ublock-unbreak', group: 'filters', title: 'uBlock Unbreak', url: 'https://ublockorigin.github.io/uAssets/filters/unbreak.txt', license: UBO_LICENSE },
  { id: 'custom', group: 'filters', title: 'Süzgeç', local: 'filters/custom.txt', license: 'Süzgeç' },
  { id: 'easyprivacy', group: 'privacy', title: 'EasyPrivacy', url: 'https://easylist.to/easylist/easyprivacy.txt', license: EASYLIST_LICENSE },
  { id: 'ublock-privacy', group: 'privacy', title: 'uBlock Privacy', url: 'https://ublockorigin.github.io/uAssets/filters/privacy.txt', license: UBO_LICENSE },
  { id: 'easylist-cookie', group: 'annoyances', title: 'EasyList Cookie', url: 'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt', license: EASYLIST_LICENSE },
]);

export const GROUPS = Object.freeze(['filters', 'privacy', 'annoyances']);

// Chrome guarantees 30k enabled static rules per extension; keep headroom.
const RULE_BUDGET = Object.freeze({ filters: 15000, privacy: 12900, annoyances: 2000 }); // + trackers.json (1) ≤ 30000
const REGEX_BUDGET = 1000; // per static ruleset
const MAX_BYTES = 20 * 1024 * 1024;

const download = async (list) => {
  const response = await fetch(list.url, { signal: AbortSignal.timeout(60_000), redirect: 'follow' });
  if (!response.ok) throw new Error(`${list.id}: HTTP ${response.status}`);
  const text = await response.text();
  if (text.length > MAX_BYTES) throw new Error(`${list.id}: unexpectedly large (${text.length} bytes)`);
  if (!/^\s*(!?\s*\[Adblock|! )/.test(text)) throw new Error(`${list.id}: does not look like a filter list`);
  return text;
};

const header = (text, key) => new RegExp(`^! ${key}:\\s*(.+)$`, 'm').exec(text)?.[1]?.trim() ?? null;

const loadList = async (list, offline) => {
  if (list.local) return readFile(path.join(ROOT, list.local), 'utf8');
  const file = path.join(CACHE, `${list.id}.txt`);
  if (offline) return readFile(file, 'utf8');
  const text = await download(list);
  await writeFile(file, text);
  return text;
};

/** Converts the delegated network rules with AdGuard's DNR converter. */
const convertNetwork = async (lines, budget) => {
  if (!lines.length) return { rules: [], errors: 0 };
  const [{ ruleset, errors }] = await new FilterConverter().convert([new Filter(1, lines.join('\n'))], {
    resourcesPath: '/redirects',
    combine: true,
    maxNumberOfRules: budget,
    maxNumberOfRegexpRules: REGEX_BUDGET,
  });
  return { rules: ruleset.getDeclarativeRules(), errors: errors?.length ?? 0 };
};

// Chrome rejects the whole extension on some malformed rules: normalise or drop them.
const DOMAIN_RE = /^[a-z0-9.-]+$/;
const sanitizeRule = (rule) => {
  const condition = { ...rule.condition };
  const filter = condition.urlFilter;
  if (filter !== undefined) {
    const normalized = filter.startsWith('||*') ? filter.slice(2) : filter;
    const inner = normalized.replace(/^\|\|?/, '').replace(/\|$/, '');
    if (!/^[\x20-\x7e]+$/.test(normalized) || inner.includes('|')) return null;
    condition.urlFilter = normalized;
  }
  for (const key of ['requestDomains', 'initiatorDomains']) {
    if (!condition[key]) continue;
    condition[key] = condition[key].filter((d) => DOMAIN_RE.test(d));
    if (!condition[key].length) return null; // an emptied positive constraint would widen the rule
  }
  for (const key of ['excludedRequestDomains', 'excludedInitiatorDomains']) {
    if (!condition[key]) continue;
    condition[key] = condition[key].filter((d) => DOMAIN_RE.test(d));
    if (!condition[key].length) delete condition[key];
  }
  return { ...rule, condition };
};

// uBO-only surrogate names have no AdGuard resource: block instead of redirecting nowhere.
const fixRedirect = (rule) => {
  const target = rule.action?.redirect?.extensionPath;
  if (target === undefined || !/\/undefined$/.test(target)) return rule;
  return { ...rule, action: { type: 'block' } };
};

const assertRedirectsExist = async (rules) => {
  const resources = new Set(await readdir(path.join(MODULES, 'scriptlets/dist/redirect-files')));
  const missing = rules
    .map((r) => r.action?.redirect?.extensionPath)
    .filter((p) => p && !resources.has(p.replace(/^\/redirects\//, '')));
  if (missing.length) throw new Error(`redirect targets missing: ${[...new Set(missing)].join(', ')}`);
};

// Index rules by the domains they target so the worker can look them up per frame.
const indexByDomain = (entries) => {
  const byDomain = {};
  const generic = [];
  entries.forEach((entry, index) => {
    if (entry.include.length) entry.include.forEach((d) => (byDomain[d] ??= []).push(index));
    else generic.push(index);
  });
  return { byDomain, generic };
};

const main = async () => {
  const offline = process.argv.includes('--offline');
  await mkdir(CACHE, { recursive: true });
  await mkdir(path.join(ROOT, 'src/generated'), { recursive: true });

  const texts = new Map();
  const sources = [];
  for (const list of LISTS) {
    const text = await loadList(list, offline);
    texts.set(list.id, text);
    sources.push({
      id: list.id,
      group: list.group,
      title: list.title,
      url: list.url ?? list.local,
      license: list.license,
      version: header(text, 'Version'),
      lastModified: header(text, 'Last modified') ?? header(text, 'TimeUpdated'),
    });
  }

  const classified = Object.fromEntries(
    GROUPS.map((group) => {
      const lines = LISTS.filter((l) => l.group === group).flatMap((l) => preprocess(texts.get(l.id)));
      return [group, classifyLines(lines)];
    }),
  );

  // Cosmetic exceptions (e.g. uBlock Unbreak) must reach every group's hiding rules.
  const cosmeticExceptions = GROUPS.flatMap((g) => classified[g].cosmetic.filter((l) => l.includes('#@#')));

  const cosmetic = { groups: {} };
  const inject = { scriptlets: [], extcss: [] };
  const popup = { hosts: [], patterns: [], allow: [] };
  const stats = { groups: {} };

  for (const group of GROUPS) {
    const c = classified[group];
    const own = convertLists([[...c.network, ...c.cosmetic, ...cosmeticExceptions].join('\n')], { delegate: true });
    const network = await convertNetwork(own.delegated, RULE_BUDGET[group] - own.dnr.length);
    const sanitized = [...own.dnr, ...network.rules].map(sanitizeRule);
    const dropped = sanitized.filter((r) => r === null).length;
    const rules = sanitized
      .filter(Boolean)
      .map(fixRedirect)
      .map(({ id: _id, ...rule }, index) => ({ id: index + 1, ...rule }));
    await assertRedirectsExist(rules);
    if (rules.length > RULE_BUDGET[group]) throw new Error(`${group}: ${rules.length} rules > budget ${RULE_BUDGET[group]}`);

    await writeFile(path.join(ROOT, `rules/${group}.json`), `${JSON.stringify(rules)}\n`);
    await writeFile(path.join(ROOT, `src/generated/generic-${group}.css`), `${own.genericCss}\n`);
    cosmetic.groups[group] = own.cosmeticData;
    popup.hosts.push(...own.popupData.hosts);
    popup.patterns.push(...own.popupData.patterns);
    popup.allow.push(...own.popupData.allow);
    inject.scriptlets.push(...c.scriptlets.map((s) => ({ ...s, group })));
    inject.extcss.push(...c.extcss.map((e) => ({ ...e, group })));

    stats.groups[group] = {
      dnrRules: rules.length,
      blockedHosts: own.stats.blockedHosts,
      converterErrors: network.errors,
      droppedInvalid: dropped,
      cosmeticSelectors: own.stats.cosmetic,
      scriptlets: c.scriptlets.length,
      extendedCss: c.extcss.length,
      skipped: { ...own.stats.skipped, ...c.stats },
    };
  }

  // Scriptlets run as registered MAIN-world content scripts; extended CSS is injected by the worker.
  const scriptletRegistry = await writeScriptletBundles(inject.scriptlets, ROOT);
  const injectData = { extcss: { entries: inject.extcss, ...indexByDomain(inject.extcss) } };
  popup.hosts = [...new Set(popup.hosts)].sort();

  await writeFile(path.join(ROOT, 'src/generated/cosmetic.json'), `${JSON.stringify(cosmetic)}\n`);
  await writeFile(path.join(ROOT, 'src/generated/inject.json'), `${JSON.stringify(injectData)}\n`);
  await writeFile(path.join(ROOT, 'src/generated/popup.json'), `${JSON.stringify(popup)}\n`);
  await writeFile(path.join(ROOT, 'src/generated/scriptlets.json'), `${JSON.stringify(scriptletRegistry)}\n`);

  // Runtime assets shipped with the extension.
  await rm(path.join(ROOT, 'redirects'), { recursive: true, force: true });
  await cp(path.join(MODULES, 'scriptlets/dist/redirect-files'), path.join(ROOT, 'redirects'), { recursive: true });
  await mkdir(path.join(ROOT, 'src/vendor'), { recursive: true });
  await copyFile(path.join(MODULES, 'extended-css/dist/extended-css.min.js'), path.join(ROOT, 'src/vendor/extended-css.js'));

  await writeFile(
    path.join(ROOT, 'filters/meta.json'),
    `${JSON.stringify({ builtAt: new Date().toISOString(), sources, stats }, null, 2)}\n`,
  );

  for (const [group, s] of Object.entries(stats.groups)) {
    process.stdout.write(
      `${group}: ${s.dnrRules} DNR rules (${s.blockedHosts} hosts, ${s.converterErrors} converter errors), ` +
        `${s.cosmeticSelectors} selectors, ${s.scriptlets} scriptlets, ${s.extendedCss} extended css\n`,
    );
  }
  process.stdout.write(`popup filters: ${popup.hosts.length + popup.patterns.length}\n`);
  process.stdout.write(`scriptlet bundles: ${scriptletRegistry.length}\n`);
};

await main();
