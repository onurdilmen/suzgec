/*
 * Adblock Plus / uBlock filter syntax → Chrome declarativeNetRequest + cosmetic data.
 *
 * Supported: network block/exception rules whose options map to DNR, plain `||host^`
 * rules (grouped into requestDomains), `$document` / `$generichide` / `$elemhide`
 * exceptions, element hiding `##` / `#@#` with domain lists.
 * Skipped (counted in stats): regex rules, scriptlets, procedural cosmetics,
 * redirect/csp/removeparam style modifiers, non-ASCII patterns.
 */
import { domainToASCII } from 'node:url';

const TYPE_MAP = Object.freeze({
  script: ['script'],
  image: ['image'],
  stylesheet: ['stylesheet'],
  css: ['stylesheet'],
  object: ['object'],
  xmlhttprequest: ['xmlhttprequest'],
  xhr: ['xmlhttprequest'],
  subdocument: ['sub_frame'],
  frame: ['sub_frame'],
  ping: ['ping'],
  beacon: ['ping'],
  media: ['media'],
  font: ['font'],
  websocket: ['websocket'],
  other: ['other'],
});

const SUBRESOURCE_TYPES = Object.freeze([
  'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object',
  'xmlhttprequest', 'ping', 'media', 'websocket', 'other',
]);

// Options that change what a rule does in ways DNR can't express: drop the rule.
const UNSUPPORTED_OPTIONS = new Set([
  'csp', 'redirect', 'redirect-rule', 'rewrite', 'removeparam', 'queryprune', 'denyallow',
  'to', 'method', 'header', 'permissions', 'replace', 'urltransform', 'urlskip', 'uritransform',
  'strict1p', 'strict3p', 'strict-first-party', 'strict-third-party', 'popunder',
  'inline-script', 'inline-font', 'webrtc', 'sitekey', 'empty', 'mp4', 'jsonprune', 'cookie',
  'network', 'stealth', 'app', 'content', 'extension', 'jsinject', 'urlblock', 'specifichide',
  'genericblock', 'ipaddress', 'reason',
]);

export const PRIORITY = Object.freeze({ block: 1, allow: 2, important: 3 });

const HOST_RE = /^[a-z0-9.-]+$/;
const BAD_SELECTOR = /[{}]|\/\*|^@|\\\s*$/;
const PROCEDURAL = /:-abp-|:has-text\(|:upward\(|:xpath\(|:matches-css|:matches-attr|:matches-path|:matches-prop|:min-text-length|:others\(|:remove\(|:style\(|:watch-attr|:if\(|:if-not\(|:contains\(|:nth-ancestor\(|:remove-attr|:remove-class|:shadow\(/;

export const toAsciiHost = (raw) => {
  const host = String(raw ?? '').trim().toLowerCase().replace(/\.$/, '');
  if (!host || host.includes('*')) return '';
  const ascii = /^[\x00-\x7f]*$/.test(host) ? host : domainToASCII(host);
  return ascii && HOST_RE.test(ascii) && ascii.includes('.') ? ascii : '';
};

const splitDomains = (value, separator) => {
  const include = [];
  const exclude = [];
  for (const part of value.split(separator)) {
    const negated = part.startsWith('~');
    const host = toAsciiHost(negated ? part.slice(1) : part);
    if (!host) continue;
    (negated ? exclude : include).push(host);
  }
  return { include, exclude };
};

// Split "pattern$opt1,opt2" — the last '$' that is followed by something option-like.
const splitOptions = (text) => {
  const index = text.lastIndexOf('$');
  if (index < 0 || /^\$?[a-z0-9-]*\(/.test(text.slice(index))) return { pattern: text, options: [] };
  const tail = text.slice(index + 1);
  if (!/^~?[a-z0-9_-]+(=|,|$)/i.test(tail)) return { pattern: text, options: [] };
  return { pattern: text.slice(0, index), options: tail.split(/,(?![^=,]*\|)/) };
};

/**
 * Parses one network filter line.
 * @returns {{ kind: 'skip', reason: string } | { kind: 'rule', exception: boolean, important: boolean, pattern: string, condition: object, flags: Set<string> }}
 */
export const parseNetworkFilter = (line) => {
  let text = line.trim();
  const exception = text.startsWith('@@');
  if (exception) text = text.slice(2);

  if (/^\/.*\/(\$|$)/.test(text) && !text.startsWith('//')) return { kind: 'skip', reason: 'regex' };

  const { pattern, options } = splitOptions(text);
  const condition = {};
  const flags = new Set();
  const types = new Set();
  const excludedTypes = new Set();
  let important = false;

  for (const rawOption of options) {
    const option = rawOption.trim();
    const [nameRaw, ...valueParts] = option.split('=');
    const negated = nameRaw.startsWith('~');
    const name = (negated ? nameRaw.slice(1) : nameRaw).toLowerCase();
    const value = valueParts.join('=');

    if (UNSUPPORTED_OPTIONS.has(name)) return { kind: 'skip', reason: `option:${name}` };
    if (name === 'badfilter') {
      flags.add('badfilter');
      continue;
    }
    if (name === 'important') {
      important = true;
      continue;
    }
    if (name === 'match-case') {
      condition.isUrlFilterCaseSensitive = true;
      continue;
    }
    if (name === 'third-party' || name === '3p') {
      condition.domainType = negated ? 'firstParty' : 'thirdParty';
      continue;
    }
    if (name === 'first-party' || name === '1p') {
      condition.domainType = negated ? 'thirdParty' : 'firstParty';
      continue;
    }
    if (name === 'domain' || name === 'from') {
      const { include, exclude } = splitDomains(value, '|');
      if (include.length) condition.initiatorDomains = include;
      if (exclude.length) condition.excludedInitiatorDomains = exclude;
      if (!include.length && !exclude.length) return { kind: 'skip', reason: 'domain-unusable' };
      continue;
    }
    if (['document', 'doc'].includes(name)) {
      if (negated) continue;
      flags.add('document');
      if (!exception) types.add('main_frame'); // block the page itself (scam/redirect pages)
      continue;
    }
    if (name === 'popup') {
      if (!negated) flags.add('popup'); // handled by the worker, DNR can't tell popups apart
      continue;
    }
    if (['elemhide', 'ehide', 'generichide', 'ghide'].includes(name)) {
      flags.add('generichide');
      continue;
    }
    if (name === 'all') {
      SUBRESOURCE_TYPES.forEach((t) => types.add(t));
      types.add('main_frame');
      continue;
    }
    const mapped = TYPE_MAP[name];
    if (!mapped) return { kind: 'skip', reason: `option:${name}` };
    mapped.forEach((t) => (negated ? excludedTypes : types).add(t));
  }

  if (flags.has('generichide') && !exception) return { kind: 'skip', reason: 'hide-option-on-block' };

  if (types.size) condition.resourceTypes = [...types];
  else if (excludedTypes.size) condition.excludedResourceTypes = [...excludedTypes];

  const urlFilter = pattern.trim();
  if (!/^[\x20-\x7e]*$/.test(urlFilter)) return { kind: 'skip', reason: 'non-ascii' };
  const broad = urlFilter === '' || urlFilter === '*' || urlFilter === '|' || urlFilter === '||';
  if (broad && !condition.initiatorDomains && !flags.has('document') && !flags.has('generichide')) {
    return { kind: 'skip', reason: 'too-broad' };
  }
  if (!broad) {
    // DNR syntax: '||' only as a leading host anchor, '|' only at either end.
    const normalized = urlFilter.startsWith('||*') ? urlFilter.slice(2) : urlFilter;
    const inner = normalized.replace(/^\|\|?/, '').replace(/\|$/, '');
    if (inner.includes('|')) return { kind: 'skip', reason: 'invalid-dnr' };
    condition.urlFilter = normalized;
  }
  if (flags.has('popup') && types.size === 0 && excludedTypes.size === 0) flags.add('popup-only');

  return { kind: 'rule', exception, important, pattern: urlFilter, condition, flags };
};

/** Parses one cosmetic line (`##` / `#@#`). Returns null when not cosmetic. */
export const parseCosmeticFilter = (line) => {
  const match = /^([^#]*)#(@?)#(.+)$/.exec(line.trim());
  if (!match) return null;
  const [, domainPart, at, selector] = match;
  if (selector.startsWith('+js') || selector.startsWith('^') || /^[%$?]/.test(selector)) {
    return { kind: 'skip', reason: 'scriptlet-or-html' };
  }
  if (PROCEDURAL.test(selector)) return { kind: 'skip', reason: 'procedural' };
  if (BAD_SELECTOR.test(selector) || selector.length > 1000) return { kind: 'skip', reason: 'unsafe-selector' };
  const { include, exclude } = domainPart ? splitDomains(domainPart, ',') : { include: [], exclude: [] };
  if (domainPart && !include.length && !exclude.length) return { kind: 'skip', reason: 'domain-unusable' };
  return { kind: 'cosmetic', exception: at === '@', selector: selector.trim(), include, exclude };
};

const isComment = (line) => !line || line.startsWith('!') || line.startsWith('[') || line.startsWith('# ') || line === '#';

const PURE_HOST = /^\|\|([a-z0-9.-]+)\^$/; // without ^ it is a prefix match, not a host

// Plain-host popup filters become a host list; everything else keeps its pattern.
const compactPopups = (block, allow) => {
  const hosts = new Set();
  const patterns = [];
  for (const [pattern, include, exclude, domainType] of block) {
    const pure = PURE_HOST.exec(pattern);
    const host = pure ? toAsciiHost(pure[1]) : '';
    if (host && !include.length && !exclude.length && !domainType) hosts.add(host);
    else if (pattern) patterns.push([pattern, include, exclude, domainType]);
  }
  return { hosts: [...hosts].sort(), patterns, allow: allow.filter(([p]) => p) };
};

/**
 * Converts several filter list texts into extension artefacts.
 * @param {string[]} texts
 */
export const convertLists = (texts, { domainChunk = 5000 } = {}) => {
  const stats = { network: 0, cosmetic: 0, skipped: {} };
  const skip = (reason) => {
    stats.skipped[reason] = (stats.skipped[reason] ?? 0) + 1;
  };

  const lines = texts.flatMap((t) => t.split(/\r?\n/)).map((l) => l.trim()).filter((l) => !isComment(l));

  const badfilters = new Set();
  const network = [];
  const cosmetic = [];
  for (const line of lines) {
    const c = parseCosmeticFilter(line);
    if (c) {
      if (c.kind === 'skip') skip(c.reason);
      else cosmetic.push(c);
      continue;
    }
    const n = parseNetworkFilter(line);
    if (n.kind === 'skip') {
      skip(n.reason);
      continue;
    }
    if (n.flags.has('badfilter')) {
      badfilters.add(line.replace(/[$,]badfilter/, '').replace(/\$$/, ''));
      continue;
    }
    network.push({ line, ...n });
  }

  // ---- network ----
  const pureHosts = new Set();
  const rules = [];
  const generichide = new Set();
  const seen = new Set();
  const popupBlock = [];
  const popupAllow = [];
  for (const item of network) {
    if (badfilters.has(item.line)) {
      skip('badfilter');
      continue;
    }
    if (item.flags.has('popup')) {
      const { initiatorDomains = [], excludedInitiatorDomains = [], domainType = '' } = item.condition;
      const entry = [item.pattern, initiatorDomains, excludedInitiatorDomains, domainType];
      (item.exception ? popupAllow : popupBlock).push(entry);
      if (item.flags.has('popup-only')) continue;
    }
    const pure = PURE_HOST.exec(item.pattern);
    const optionless = Object.keys(item.condition).length === 1 && item.condition.urlFilter;
    if (!item.exception && !item.important && pure && optionless) {
      const host = toAsciiHost(pure[1]);
      if (host) {
        pureHosts.add(host);
        continue;
      }
    }
    if (item.exception && item.flags.has('generichide')) {
      const host = pure ? toAsciiHost(pure[1]) : '';
      if (host) generichide.add(host);
      if (!item.flags.has('document')) continue;
    }
    let action;
    let condition = item.condition;
    let priority = PRIORITY.block;
    if (item.exception && item.flags.has('document')) {
      action = { type: 'allowAllRequests' };
      condition = { ...condition, resourceTypes: ['main_frame', 'sub_frame'] };
      delete condition.excludedResourceTypes;
      priority = PRIORITY.allow;
    } else if (item.exception) {
      action = { type: 'allow' };
      priority = PRIORITY.allow;
    } else {
      action = { type: 'block' };
      priority = item.important ? PRIORITY.important : PRIORITY.block;
    }
    const key = JSON.stringify([action.type, priority, condition]);
    if (seen.has(key)) continue;
    seen.add(key);
    rules.push({ priority, action, condition });
  }

  const hostList = [...pureHosts].sort();
  for (let i = 0; i < hostList.length; i += domainChunk) {
    rules.unshift({
      priority: PRIORITY.block,
      action: { type: 'block' },
      condition: { requestDomains: hostList.slice(i, i + domainChunk) },
    });
  }
  const dnr = rules.map((rule, index) => ({ id: index + 1, ...rule }));
  stats.network = dnr.length;
  stats.blockedHosts = hostList.length;

  // ---- cosmetic ----
  const genericExceptions = new Set(); // ##sel disabled everywhere
  const scopedExceptions = new Map(); // sel -> Set(domains)
  for (const c of cosmetic.filter((x) => x.exception)) {
    if (!c.include.length) genericExceptions.add(c.selector);
    else {
      const set = scopedExceptions.get(c.selector) ?? new Set();
      c.include.forEach((d) => set.add(d));
      scopedExceptions.set(c.selector, set);
    }
  }

  const generic = new Set();
  const specific = {}; // domain -> [[selector, excludedDomains[]]]
  const addSpecific = (domain, selector, exclude) => {
    const list = specific[domain] ?? (specific[domain] = []);
    if (!list.some(([s]) => s === selector)) list.push(exclude.length ? [selector, exclude] : [selector]);
  };
  const scoped = []; // [selector, excludedDomains[]] — generic but with exceptions: injected by the worker
  for (const c of cosmetic.filter((x) => !x.exception)) {
    if (genericExceptions.has(c.selector)) {
      skip('cosmetic-exception');
      continue;
    }
    const excepted = [...(scopedExceptions.get(c.selector) ?? [])];
    if (c.include.length) {
      for (const domain of c.include) {
        const exclude = [...c.exclude, ...excepted].filter((d) => d === domain || d.endsWith(`.${domain}`));
        if (exclude.includes(domain)) continue;
        addSpecific(domain, c.selector, exclude);
      }
    } else if (c.exclude.length || excepted.length) {
      scoped.push([c.selector, [...new Set([...c.exclude, ...excepted])]]);
    } else {
      generic.add(c.selector);
    }
  }
  stats.cosmetic = generic.size + scoped.length + Object.values(specific).reduce((n, l) => n + l.length, 0);

  return {
    dnr,
    genericCss: [...generic].sort().map((s) => `${s}{display:none!important}`).join('\n'),
    cosmeticData: { specific, scoped, generichide: [...generichide].sort() },
    popupData: compactPopups(popupBlock, popupAllow),
    stats,
  };
};
