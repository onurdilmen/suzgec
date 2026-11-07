/*
 * Pure matching helpers for the generated filter data (cosmetic + popup).
 * ES module: imported by the service worker and by node tests.
 */

/** host, then each parent domain: a.b.example.com → [a.b.example.com, b.example.com, example.com, com] */
export const hostChain = (host) => {
  const labels = String(host ?? "")
    .toLowerCase()
    .split(".")
    .filter(Boolean);
  return labels.map((_, i) => labels.slice(i).join("."));
};

const inDomainList = (host, list) => {
  if (!list?.length) return false;
  const chain = new Set(hostChain(host));
  return list.some((d) => chain.has(d));
};

/** Selectors from the lists that apply to a document on `host`. */
export const selectorsForHost = (host, data) => {
  if (!host || !data) return [];
  const out = new Set();
  for (const domain of hostChain(host)) {
    for (const [selector, exclude] of data.specific?.[domain] ?? []) {
      if (!inDomainList(host, exclude)) out.add(selector);
    }
  }
  for (const [selector, exclude] of data.scoped ?? []) {
    if (!inDomainList(host, exclude)) out.add(selector);
  }
  return [...out];
};

export const isGenericHideHost = (host, data) =>
  inDomainList(host, data?.generichide);

/** One rule per selector: an invalid selector then only drops itself, not the whole sheet. */
export const cssFor = (selectors) =>
  selectors.map((s) => `${s}{display:none!important}`).join("\n");

const escapeRegExp = (text) => text.replace(/[.+?${}()|[\]\\/]/g, "\\$&");

/** Adblock URL pattern → RegExp (same semantics as DNR urlFilter). */
export const compilePattern = (pattern) => {
  let source = String(pattern);
  let prefix = "";
  let suffix = "";
  if (source.startsWith("||")) {
    prefix = "^[a-z][a-z0-9+.-]*://([^/?#]*\\.)?";
    source = source.slice(2);
  } else if (source.startsWith("|")) {
    prefix = "^";
    source = source.slice(1);
  }
  if (source.endsWith("|")) {
    suffix = "$";
    source = source.slice(0, -1);
  }
  const body = source
    .split("*")
    .map((part) =>
      part.split("^").map(escapeRegExp).join("(?:[^a-zA-Z0-9_.%-]|$)"),
    )
    .join(".*");
  return new RegExp(prefix + body + suffix, "i");
};

const thirdPartyOk = (
  domainType,
  targetHost,
  sourceSite,
  registrableDomain,
) => {
  if (!domainType) return true;
  const third = registrableDomain(targetHost) !== sourceSite;
  return domainType === "thirdParty" ? third : !third;
};

/**
 * Builds a matcher for popup/popunder destinations.
 * @param {{hosts:string[], patterns:Array, allow:Array}} data
 * @param {(host:string)=>string} registrableDomain
 */
export const createPopupMatcher = (data, registrableDomain) => {
  const hosts = new Set(data?.hosts ?? []);
  const compile = (list) =>
    (list ?? []).flatMap(([pattern, include, exclude, domainType]) => {
      try {
        return [{ re: compilePattern(pattern), include, exclude, domainType }];
      } catch {
        return [];
      }
    });
  const block = compile(data?.patterns);
  const allow = compile(data?.allow);

  const applies = (rule, url, targetHost, sourceHost) =>
    (!rule.include?.length || inDomainList(sourceHost, rule.include)) &&
    !inDomainList(sourceHost, rule.exclude) &&
    thirdPartyOk(
      rule.domainType,
      targetHost,
      registrableDomain(sourceHost),
      registrableDomain,
    ) &&
    rule.re.test(url);

  /** @returns {string|null} why the popup should be closed, or null */
  return (url, sourceHost) => {
    let target;
    try {
      target = new URL(url);
    } catch {
      return null;
    }
    if (target.protocol !== "http:" && target.protocol !== "https:")
      return null;
    const targetHost = target.hostname.toLowerCase();
    if (allow.some((rule) => applies(rule, url, targetHost, sourceHost)))
      return null;
    if (hostChain(targetHost).some((h) => hosts.has(h))) return "popup-list";
    if (block.some((rule) => applies(rule, url, targetHost, sourceHost)))
      return "popup-list";
    return null;
  };
};
