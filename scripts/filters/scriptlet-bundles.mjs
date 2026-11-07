/*
 * Generates one MAIN-world content script per (group, scriptlet) — the uBO Lite model.
 * Each file embeds the self-contained AdGuard scriptlet function plus the host table it
 * applies to, and is registered only for those hosts at document_start, so it runs
 * before the page's own code (needed for YouTube-style JSON/XHR rewriting).
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { scriptlets, SCRIPTLETS_VERSION } from '@adguard/scriptlets';

const safeName = (name) => name.replace(/[^a-z0-9-]/gi, '_');
const hostPatterns = (host) => [`*://${host}/*`, `*://*.${host}/*`];
const ALL_URLS = ['http://*/*', 'https://*/*'];

// Runtime executed inside the page. Kept tiny and closure-only: no globals leak.
const runtime = (fnSource, name, entries, exceptions) => `/* Süzgeç scriptlet: ${name} — generated, do not edit */
(() => {
  'use strict';
  const run = ${fnSource};
  const NAME = ${JSON.stringify(name)};
  const ENTRIES = ${JSON.stringify(entries)};
  const EXCEPTIONS = ${JSON.stringify(exceptions)};
  const host = location.hostname;
  const labels = host.split('.');
  const chain = labels.map((_, i) => labels.slice(i).join('.'));
  const matches = (list) => list.some((d) => chain.includes(d));
  if (EXCEPTIONS.some(([args, include]) => args === null && matches(include))) return;
  const disabled = new Set(EXCEPTIONS.filter(([args, include]) => args !== null && matches(include)).map(([args]) => JSON.stringify(args)));
  const seen = new Set();
  for (const [args, include, exclude] of ENTRIES) {
    if ((include.length && !matches(include)) || matches(exclude)) continue;
    const key = JSON.stringify(args);
    if (disabled.has(key) || seen.has(key)) continue;
    seen.add(key);
    try {
      run({ name: NAME, args, engine: 'extension', version: ${JSON.stringify(SCRIPTLETS_VERSION)}, verbose: false, domainName: host }, args);
    } catch {
      /* a failing scriptlet must never break the page */
    }
  }
})();
`;

/**
 * @param {Array<{name:string,args:string[],include:string[],exclude:string[],exception:boolean,group:string}>} all
 * @param {string} root extension root
 * @returns {Promise<Array<{id:string, group:string, file:string, matches:string[]}>>}
 */
export const writeScriptletBundles = async (all, root) => {
  const dir = path.join(root, 'src/generated/scriptlets');
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  // Exceptions that switch off every scriptlet on a host apply to all bundles.
  const disableAll = all.filter((e) => e.exception && !e.name).map((e) => [null, e.include]);

  const buckets = new Map(); // `${group}\u0000${name}` -> entries
  for (const entry of all) {
    if (!entry.name) continue;
    const key = `${entry.group}\u0000${entry.name}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(entry);
  }

  const registry = [];
  for (const [key, entries] of buckets) {
    const [group, name] = key.split('\u0000');
    const rules = entries.filter((e) => !e.exception);
    if (!rules.length) continue;
    const fn = scriptlets.getScriptletFunction(name);
    if (typeof fn !== 'function') continue;

    const exceptions = [
      ...disableAll,
      ...entries.filter((e) => e.exception).map((e) => [e.args.length ? e.args : null, e.include]),
    ];
    const compact = rules.map((e) => [e.args, e.include, e.exclude]);
    const generic = rules.some((e) => !e.include.length);
    const hosts = [...new Set(rules.flatMap((e) => e.include))].sort();
    const matches = generic ? ALL_URLS : hosts.flatMap(hostPatterns);

    const file = `src/generated/scriptlets/${group}-${safeName(name)}.js`;
    await writeFile(path.join(root, file), runtime(fn.toString(), name, compact, exceptions));
    registry.push({ id: `sl-${group}-${registry.length}`, group, file, matches });
  }
  return registry;
};
