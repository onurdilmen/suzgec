/* Süzgeç scriptlet: trusted-replace-fetch-response — generated, do not edit */
(() => {
  'use strict';
  const run = function trustedReplaceFetchResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceFetchResponse(source) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    if (pattern === "" && replacement !== "") {
      logMessage(source, "Pattern argument should not be empty string");
      return;
    }
    var shouldLog = pattern === "" && replacement === "";
    var shouldLogContent = verbose === "true";
    var nativeRequestClone = Request.prototype.clone;
    var nativeFetch = fetch;
    var shouldReplace = false;
    var fetchData;
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      fetchData = getFetchData(args, nativeRequestClone);
      if (shouldLog) {
        logMessage(source, `fetch( ${objectToString(fetchData)} )`, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      shouldReplace = matchRequestProps(source, propsToMatch, fetchData);
      if (!shouldReplace) {
        return Reflect.apply(target, thisArg, args);
      }
      return nativeFetch.apply(null, args).then((function(response) {
        return response.clone().text().then((function(bodyText) {
          var patternRegexp = pattern === "*" ? /(\n|.)*/ : toRegExp(pattern);
          var isPatternFound = pattern === "*" || patternRegexp.test(bodyText);
          if (!isPatternFound) {
            return response;
          }
          if (shouldLogContent) {
            logMessage(source, `Original text content: ${bodyText}`);
          }
          var modifiedTextContent = bodyText.replace(patternRegexp, replacement);
          if (shouldLogContent) {
            logMessage(source, `Modified text content: ${modifiedTextContent}`);
          }
          var forgedResponse = forgeResponse(response, modifiedTextContent);
          hit(source);
          return forgedResponse;
        })).catch((function() {
          var fetchDataStr = objectToString(fetchData);
          var message = `Response body can't be converted to text: ${fetchDataStr}`;
          logMessage(source, message);
          return response;
        }));
      })).catch((function() {
        return Reflect.apply(target, thisArg, args);
      }));
    };
    var fetchHandler = {
      apply: handlerWrapper
    };
    fetch = new Proxy(fetch, fetchHandler);
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
  function getFetchData(e, t) {
    var a, c, n = {}, r = e[0];
    if (r instanceof Request) {
      var u = t.call(r), f = getRequestData(u);
      a = f.url, c = f;
    } else a = r, c = e[1];
    (n.url = a, c instanceof Object) && Object.keys(c).forEach((function(e) {
      n[e] = c[e];
    }));
    return n;
  }
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function forgeResponse(e, t) {
    var {bodyUsed: s, headers: r, ok: u, redirected: a, status: d, statusText: o, type: l, url: n} = e, v = new Response(t, {
      status: d,
      statusText: o,
      headers: r
    });
    return Object.defineProperties(v, {
      url: {
        value: n
      },
      type: {
        value: l
      },
      ok: {
        value: u
      },
      bodyUsed: {
        value: s
      },
      redirected: {
        value: a
      }
    }), v;
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
  function isValidStrPattern(e) {
    var t, n = escapeRegExp(e);
    "/" === e[0] && "/" === e[e.length - 1] && (n = e.slice(1, -1));
    try {
      t = new RegExp(n), t = !0;
    } catch (e) {
      t = false;
    }
    return t;
  }
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getRequestData(t) {
    var e = getRequestProps().map((function(e) {
      return [ e, t[e] ];
    }));
    return Object.fromEntries(e);
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceFetchResponse.apply(this, updatedArgs);
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
  const NAME = "trusted-replace-fetch-response";
  const ENTRIES = [[["/#rcmrclid=[a-zA-Z0-9]+/g","","rcm.rambler.ru"],["gazeta.press","gazeta.ru","rambler.ru"],[]]];
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
