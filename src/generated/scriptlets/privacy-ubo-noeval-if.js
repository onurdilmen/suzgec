/* Süzgeç scriptlet: ubo-noeval-if — generated, do not edit */
(() => {
  'use strict';
  const run = function preventEvalIf(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventEvalIf(source, search) {
    var searchRegexp = toRegExp(search);
    var nativeEval = window.eval;
    window.eval = function(payload) {
      if (!searchRegexp.test(payload.toString())) {
        return nativeEval.call(window, payload);
      }
      hit(source);
      return undefined;
    }.bind(window);
    window.eval.toString = nativeEval.toString.bind(nativeEval);
  }
  function toRegExp(e) {
    var r = e || "", t = "/";
    if ("" === r) return new RegExp(".?");
    var n, i, s = r.lastIndexOf(t), a = r.substring(s + 1), g = r.substring(0, s + 1), u = (i = a, 
    (n = g).startsWith(t) && n.endsWith(t) && !n.endsWith("\\/") && function(e) {
      if (!e) return false;
      try {
        return new RegExp("", e), !0;
      } catch (e) {
        return false;
      }
    }(i) ? i : "");
    if (r.startsWith(t) && r.endsWith(t) || u) return new RegExp((u ? g : r).slice(1, -1), u);
    var c = r.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(c);
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventEvalIf.apply(this, updatedArgs);
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
  const NAME = "ubo-noeval-if";
  const ENTRIES = [[["/07c225f3\\.online|content-loader\\.com|css-load\\.com|html-load\\.com/"],["meconomynews.com","brandbrief.co.kr","motorgraph.com","topstarnews.net"],[]]];
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
