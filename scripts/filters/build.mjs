/*
 * Downloads the filter lists and regenerates:
 *   rules/filters.json               DNR static ruleset
 *   src/generated/generic-hide.css   generic element hiding (registered as content CSS)
 *   src/generated/cosmetic.json      site-specific / scoped hiding, generichide domains
 *   src/generated/popup.json         popup/popunder filters (checked by the worker)
 *   filters/meta.json                list versions + conversion stats
 *
 *   npm run filters            (download + convert)
 *   npm run filters -- --offline   (reuse filters/cache)
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { convertLists } from './convert.mjs';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const CACHE = path.join(ROOT, 'filters/cache');

export const LISTS = Object.freeze([
  {
    id: 'easylist',
    title: 'EasyList',
    url: 'https://easylist.to/easylist/easylist.txt',
    license: 'GPLv3 / CC BY-SA 3.0 — https://easylist.to/pages/licence.html',
  },
  {
    id: 'adguard-turkish',
    title: 'AdGuard Turkish filter',
    url: 'https://filters.adtidy.org/extension/ublock/filters/13.txt',
    license: 'GPLv3 — https://github.com/AdguardTeam/AdguardFilters/blob/master/LICENSE',
  },
]);

const MAX_STATIC_RULES = 30000; // Chrome's guaranteed per-extension static rule budget
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

const main = async () => {
  const offline = process.argv.includes('--offline');
  await mkdir(CACHE, { recursive: true });

  const texts = [];
  const sources = [];
  for (const list of LISTS) {
    const file = path.join(CACHE, `${list.id}.txt`);
    const text = offline ? await readFile(file, 'utf8') : await download(list);
    if (!offline) await writeFile(file, text);
    texts.push(text);
    sources.push({
      id: list.id,
      title: list.title,
      url: list.url,
      license: list.license,
      version: header(text, 'Version'),
      lastModified: header(text, 'Last modified') ?? header(text, 'TimeUpdated'),
    });
  }

  const { dnr, genericCss, cosmeticData, popupData, stats } = convertLists(texts);
  if (dnr.length > MAX_STATIC_RULES) throw new Error(`too many DNR rules: ${dnr.length} > ${MAX_STATIC_RULES}`);

  await mkdir(path.join(ROOT, 'src/generated'), { recursive: true });
  await writeFile(path.join(ROOT, 'rules/filters.json'), `${JSON.stringify(dnr)}\n`);
  await writeFile(path.join(ROOT, 'src/generated/generic-hide.css'), `${genericCss}\n`);
  await writeFile(path.join(ROOT, 'src/generated/cosmetic.json'), `${JSON.stringify(cosmeticData)}\n`);
  await writeFile(path.join(ROOT, 'src/generated/popup.json'), `${JSON.stringify(popupData)}\n`);
  await writeFile(
    path.join(ROOT, 'filters/meta.json'),
    `${JSON.stringify({ builtAt: new Date().toISOString(), sources, stats }, null, 2)}\n`,
  );

  const skipped = Object.values(stats.skipped).reduce((a, b) => a + b, 0);
  process.stdout.write(
    `DNR rules: ${dnr.length} (blocked hosts: ${stats.blockedHosts})\n` +
      `cosmetic selectors: ${stats.cosmetic}\n` +
      `popup filters: ${popupData.hosts.length + popupData.patterns.length}\n` +
      `skipped lines: ${skipped}\n`,
  );
};

await main();
