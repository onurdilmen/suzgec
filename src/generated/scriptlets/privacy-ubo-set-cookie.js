/* Süzgeç scriptlet: ubo-set-cookie — generated, do not edit */
(() => {
  'use strict';
  const run = function setCookie(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setCookie(source, name, value) {
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "/";
    var domain = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var validValue = getLimitedCookieValue(value);
    if (validValue === null) {
      logMessage(source, `Invalid cookie value: '${validValue}'`);
      return;
    }
    if (!isValidCookiePath(path)) {
      logMessage(source, `Invalid cookie path: '${path}'`);
      return;
    }
    if (!document.location.origin.includes(domain)) {
      logMessage(source, `Cookie domain not matched by origin: '${domain}'`);
      return;
    }
    var cookieToSet = serializeCookie(name, validValue, path, domain, false);
    if (!cookieToSet) {
      logMessage(source, "Invalid cookie name or value");
      return;
    }
    hit(source);
    document.cookie = cookieToSet;
  }
  function hit(e) {
    if (e.verbose) {
      try {
        var n = console.trace.bind(console), i = "[AdGuard] ";
        "corelibs" === e.engine ? i += e.ruleText : (e.domainName && (i += `${e.domainName}`), 
        e.args ? i += `#%#//scriptlet('${e.name}', '${e.args.join("', '")}')` : i += `#%#//scriptlet('${e.name}')`), 
        n && n(i);
      } catch (e) {}
      "function" == typeof window.__debug && window.__debug(e);
    }
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function getLimitedCookieValue(e) {
    if (!e) return null;
    var n;
    if (new Set([ "true", "t", "false", "f", "yes", "y", "no", "n", "ok", "on", "off", "accept", "accepted", "notaccepted", "reject", "rejected", "allow", "allowed", "disallow", "deny", "denied", "enable", "enabled", "disable", "disabled", "necessary", "required", "hide", "hidden", "essential", "nonessential", "checked", "unchecked", "forbidden", "forever", "declined", "mandatory", "all" ]).has(e.toLowerCase())) n = e; else if ("emptyArr" === e) n = "[]"; else if ("emptyObj" === e) n = "{}"; else {
      if (!/^\d+$/.test(e)) return null;
      if (n = parseFloat(e), nativeIsNaN(n)) return null;
      if (Math.abs(n) < 0 || Math.abs(n) > 32767) return null;
    }
    return n;
  }
  function serializeCookie(e, o, i) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", t = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
    if (!t && `${o}`.includes(";") || e.includes(";")) return null;
    var r = `${e}=${t ? encodeURIComponent(o) : o}`;
    if (e.startsWith("__Host-")) return r += "; path=/; secure", n && console.debug(`Domain value: "${n}" has been ignored, because is not allowed for __Host- prefixed cookies`), 
    r;
    var s = getCookiePath(i);
    return s && (r += `; ${s}`), e.startsWith("__Secure-") && (r += "; secure"), n && (r += `; domain=${n}`), 
    r;
  }
  function isValidCookiePath(n) {
    return "/" === n || "none" === n;
  }
  function getCookiePath(t) {
    return "/" === t ? "path=/" : "";
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setCookie.apply(this, updatedArgs);
    if (source.uniqueId) {
      Object.defineProperty(Window.prototype.toString, uniqueIdentifier, {
        value: flag,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    console.log(e);
  }
};
  const NAME = "ubo-set-cookie";
  const ENTRIES = [[["GPC","1","","reload","1"],["usaa.com"],[]],[["Geo","OK"],["fandom.com"],[]],[["bitmovin_analytics_uuid","OK"],["clickorlando.com"],[]]];
  const EXCEPTIONS = [];
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
      run({ name: NAME, args, engine: 'extension', version: "2.5.1", verbose: false, domainName: host }, args);
    } catch {
      /* a failing scriptlet must never break the page */
    }
  }
})();
