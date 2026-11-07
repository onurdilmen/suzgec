/*
 * Normalises every list line to AdGuard syntax (uBO → AdG via agtree) and sorts it
 * into the layer that will execute it.
 */
import { RuleGenerator, RuleParser } from '@adguard/agtree';
import { RuleConverter } from '@adguard/agtree/converter';
import { scriptlets } from '@adguard/scriptlets';
import { toAsciiHost } from './convert.mjs';

const unquote = (value) => {
  const text = String(value ?? '').trim();
  const quote = text[0];
  if ((quote === "'" || quote === '"') && text.at(-1) === quote) {
    return text.slice(1, -1).replace(new RegExp(`\\\\${quote}`, 'g'), quote);
  }
  return text;
};

const domainsOf = (node) => {
  const include = [];
  const exclude = [];
  for (const d of node.domains?.children ?? []) {
    const host = toAsciiHost(d.value);
    if (!host) continue;
    (d.exception ? exclude : include).push(host);
  }
  const unusable = (node.domains?.children?.length ?? 0) > 0 && !include.length && !exclude.length;
  return { include, exclude, unusable };
};

const bodyAfterSeparator = (text, separator) => {
  const index = text.indexOf(separator);
  return index < 0 ? '' : text.slice(index + separator.length).trim();
};

const knownScriptlet = new Map();
const isKnownScriptlet = (name) => {
  if (!knownScriptlet.has(name)) knownScriptlet.set(name, typeof scriptlets.getScriptletFunction(name) === 'function');
  return knownScriptlet.get(name);
};

// uBO trusted scriptlets agtree leaves as `ubo-…` but AdGuard ships natively. Their
// third argument (URL pattern) is what AdGuard's propsToMatch treats as `url` by default.
const UBO_ALIASES = Object.freeze({
  'trusted-replace-xhr-response': 'trusted-replace-xhr-response',
  'trusted-replace-fetch-response': 'trusted-replace-fetch-response',
  'trusted-rpfr': 'trusted-replace-fetch-response',
  'trusted-rpxr': 'trusted-replace-xhr-response',
  'trusted-set': 'trusted-set-constant',
});

export const resolveScriptlet = (name) => {
  if (!name) return null;
  if (isKnownScriptlet(name)) return name;
  const alias = UBO_ALIASES[name.replace(/^ubo-/, '').replace(/\.js$/, '')];
  return alias && isKnownScriptlet(alias) ? alias : null;
};

/**
 * @returns {{ network: string[], cosmetic: string[], scriptlets: Array, extcss: Array, stats: Record<string, number> }}
 */
export const classifyLines = (lines) => {
  const out = { network: [], cosmetic: [], scriptlets: [], extcss: [], stats: {} };
  const count = (key) => {
    out.stats[key] = (out.stats[key] ?? 0) + 1;
  };

  for (const line of lines) {
    if (!line || line.startsWith('!') || line.startsWith('[') || line === '#' || line.startsWith('# ')) continue;
    let nodes;
    try {
      const parsed = RuleParser.parse(line);
      if (parsed.category === 'Comment' || parsed.category === 'Empty') continue;
      if (parsed.category === 'Invalid') {
        count('invalid');
        continue;
      }
      nodes = RuleConverter.convertToAdg(parsed).result;
    } catch {
      count('unparsable');
      continue;
    }

    for (const node of nodes) {
      const text = RuleGenerator.generate(node);
      if (node.category === 'Network') {
        out.network.push(text);
        continue;
      }
      if (node.category !== 'Cosmetic') {
        count(`other:${node.category}`);
        continue;
      }
      const { include, exclude, unusable } = domainsOf(node);
      if (unusable) {
        count('domain-unusable');
        continue;
      }
      const separator = node.separator?.value ?? '';
      const exception = Boolean(node.exception);

      switch (node.type) {
        case 'ElementHidingRule': {
          if (separator === '##' || separator === '#@#') out.cosmetic.push(text);
          else {
            const selector = bodyAfterSeparator(text, separator);
            out.extcss.push({ css: `${selector} { display: none !important; }`, include, exclude, exception });
          }
          break;
        }
        case 'CssInjectionRule': {
          out.extcss.push({ css: bodyAfterSeparator(text, separator), include, exclude, exception });
          break;
        }
        case 'ScriptletInjectionRule': {
          const params = node.body?.children?.[0]?.children ?? [];
          const [nameValue, ...argValues] = params.map((p) => unquote(p?.value));
          if (exception) {
            out.scriptlets.push({ name: nameValue ? (resolveScriptlet(nameValue) ?? nameValue) : '', args: argValues, include, exclude, exception });
            break;
          }
          // Like uBO, never run a scriptlet on every site: only host-scoped ones.
          if (!include.length) {
            count('scriptlet-generic');
            break;
          }
          const resolved = resolveScriptlet(nameValue);
          if (!resolved) {
            count('scriptlet-unknown');
            break;
          }
          out.scriptlets.push({ name: resolved, args: argValues, include, exclude, exception });
          break;
        }
        default:
          // HTML filtering ($$) and raw JS (#%#) cannot run safely/at all under MV3.
          count(`skip:${node.type}`);
      }
    }
  }
  return out;
};
