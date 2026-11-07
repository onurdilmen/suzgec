/* Süzgeç scriptlet: ubo-prevent-fetch — generated, do not edit */
(() => {
  'use strict';
  const run = function preventFetch(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventFetch(source, propsToMatch) {
    var responseBody = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "emptyObj";
    var responseConfig = arguments.length > 3 ? arguments[3] : undefined;
    if (typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var INVALID_RESPONSE_VALUE_MARKER = null;
    var getInvalidResponseConfigMessage = function getInvalidResponseConfigMessage(value) {
      return `Invalid responseConfig parameter: '${value}'`;
    };
    var nativeRequestClone = Request.prototype.clone;
    var strResponseBody;
    if (responseBody === "" || responseBody === "emptyObj") {
      strResponseBody = "{}";
    } else if (responseBody === "emptyArr") {
      strResponseBody = "[]";
    } else if (responseBody === "emptyStr") {
      strResponseBody = "";
    } else if (responseBody === "true" || responseBody.match(/^length:\d+(?:-\d+)?$/)) {
      strResponseBody = generateRandomResponse(responseBody);
    } else {
      logMessage(source, `Invalid responseBody parameter: '${responseBody}'`);
      return;
    }
    var parsedResponseConfig = parseResponseConfig(responseConfig, (function(invalidValue) {
      return logMessage(source, getInvalidResponseConfigMessage(invalidValue));
    }));
    if (parsedResponseConfig === INVALID_RESPONSE_VALUE_MARKER) {
      return;
    }
    var EXTENSION_SCHEMES = [ "chrome-extension:", "moz-extension:", "ms-browser-extension:", "safari-web-extension:" ];
    var isExtensionScheme = function isExtensionScheme(url) {
      return EXTENSION_SCHEMES.some((function(scheme) {
        return url.startsWith(scheme);
      }));
    };
    var getResponseType = function getResponseType(request) {
      try {
        var {mode: mode} = request;
        if (mode === undefined || mode === "cors" || mode === "no-cors") {
          var fetchURL = new URL(request.url);
          if (fetchURL.origin === document.location.origin) {
            return "basic";
          }
          return mode === "no-cors" ? "opaque" : "cors";
        }
      } catch (error) {
        logMessage(source, `Could not determine response type: ${error}`);
      }
      return undefined;
    };
    var handlerWrapper = async function handlerWrapper(target, thisArg, args) {
      var shouldPrevent = false;
      var fetchData = getFetchData(args, nativeRequestClone);
      if (typeof propsToMatch === "undefined") {
        logMessage(source, `fetch( ${objectToString(fetchData)} )`, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      shouldPrevent = matchRequestProps(source, propsToMatch, fetchData);
      if (shouldPrevent) {
        hit(source);
        var resolvedResponseConfig = {};
        try {
          resolvedResponseConfig = getResolvedResponseConfig(parsedResponseConfig, getResponseType(fetchData));
          var origResponse = await Reflect.apply(target, thisArg, args);
          if (!origResponse.ok || isExtensionScheme(origResponse.url)) {
            return createResponse({
              body: strResponseBody,
              ok: resolvedResponseConfig.ok,
              redirected: resolvedResponseConfig.redirected,
              requestUrl: fetchData.url,
              status: resolvedResponseConfig.status,
              statusText: resolvedResponseConfig.statusText,
              type: resolvedResponseConfig.type
            });
          }
          return modifyResponse(origResponse, {
            body: strResponseBody,
            ok: resolvedResponseConfig.ok,
            redirected: resolvedResponseConfig.redirected,
            status: resolvedResponseConfig.status,
            statusText: resolvedResponseConfig.statusText,
            type: resolvedResponseConfig.type
          });
        } catch (ex) {
          return createResponse({
            body: strResponseBody,
            ok: resolvedResponseConfig.ok,
            redirected: resolvedResponseConfig.redirected,
            requestUrl: fetchData.url,
            status: resolvedResponseConfig.status,
            statusText: resolvedResponseConfig.statusText,
            type: resolvedResponseConfig.type
          });
        }
      }
      return Reflect.apply(target, thisArg, args);
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
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function createResponse() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
      body: "{}"
    }, t = void 0 === e.body ? "{}" : e.body, s = getFilteredResponseDefaults(e.type), o = void 0 === s.body ? t : s.body, d = e.status;
    void 0 === d && (d = void 0 === s.status ? 200 : s.status);
    var r = e.statusText;
    void 0 === r && (r = void 0 === s.statusText ? "OK" : s.statusText);
    var a = e.ok;
    void 0 === a && (a = void 0 === e.status && void 0 === s.ok || isSuccessResponseStatus(d));
    var i = void 0 !== e.redirected && e.redirected, n = void 0 === e.type ? "basic" : e.type, u = s.url;
    void 0 === u && (u = void 0 === e.requestUrl ? "" : e.requestUrl);
    var v = void 0 !== s.body, y = e.headers;
    v ? y = {} : void 0 === y && (y = {
      "Content-Length": null === t ? "0" : String((new TextEncoder).encode(t).length)
    });
    var l = getSafeResponseStatus(d), p = new Response(o, {
      headers: y,
      status: l < 200 ? 200 : l,
      statusText: r
    });
    return defineReadonlyResponseProps(p, {
      body: o,
      ok: a,
      redirected: i,
      status: d,
      statusText: r,
      type: n,
      url: u
    }), p;
  }
  function copyResponseHeaders(n) {
    var e = {};
    return null == n || n.forEach((function(n, o) {
      e[o] = n;
    })), e;
  }
  function defineReadonlyResponseProps(e, t) {
    var u = {};
    void 0 !== t.body && null === t.body && null !== e.body && (u.body = {
      value: null
    }), void 0 !== t.status && e.status !== t.status && (u.status = {
      value: t.status
    }), void 0 !== t.statusText && e.statusText !== t.statusText && (u.statusText = {
      value: t.statusText
    }), void 0 !== t.url && e.url !== t.url && (u.url = {
      value: t.url
    }), void 0 !== t.type && e.type !== t.type && (u.type = {
      value: t.type
    }), void 0 !== t.ok && e.ok !== t.ok && (u.ok = {
      value: t.ok
    }), void 0 !== t.redirected && e.redirected !== t.redirected && (u.redirected = {
      value: t.redirected
    }), Object.keys(u).length > 0 && Object.defineProperties(e, u);
  }
  function getFilteredResponseDefaults(e) {
    return "opaque" !== e && "error" !== e && "opaqueredirect" !== e ? {} : {
      body: null,
      ok: false,
      status: 0,
      statusText: "",
      url: ""
    };
  }
  function getResolvedResponseConfig(e, n) {
    var o = {};
    return void 0 !== n && (o.type = n), null == e ? o : Object.assign(o, e);
  }
  function getSafeResponseStatus(e) {
    return "number" == typeof e && e >= 0 && e <= 599 ? e : 200;
  }
  function isSuccessResponseStatus(s) {
    return s >= 200 && s <= 299;
  }
  function isValidResponseStatus(e) {
    return "number" == typeof e && Number.isFinite(e) && Math.floor(e) === e && e >= 0 && e <= 599;
  }
  function modifyResponse(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
      body: "{}"
    }, s = void 0 === t.body ? "{}" : t.body, o = void 0 === t.type ? e.type : t.type, d = getFilteredResponseDefaults(o), a = void 0 === d.body ? s : d.body, i = t.status;
    void 0 === i && (i = void 0 === d.status ? e.status : d.status);
    var r = t.statusText;
    void 0 === r && (r = void 0 === d.statusText ? e.statusText : d.statusText);
    var u = t.ok;
    void 0 === u && (u = void 0 === t.status && void 0 === d.ok ? e.ok : isSuccessResponseStatus(i));
    var v = void 0 === t.redirected ? e.redirected : t.redirected, n = d.url;
    void 0 === n && (n = e.url);
    var y = void 0 !== d.body ? {} : copyResponseHeaders(null == e ? void 0 : e.headers), p = getSafeResponseStatus(i), l = new Response(a, {
      status: p < 200 ? 200 : p,
      statusText: r,
      headers: y
    });
    return defineReadonlyResponseProps(l, {
      body: a,
      ok: u,
      redirected: v,
      status: i,
      statusText: r,
      type: o,
      url: n
    }), l;
  }
  function parseResponseConfig(e, t) {
    var reportInvalid = function reportInvalid() {
      return "function" == typeof t && t(e), null;
    }, r = new Set([ "basic", "cors", "error", "opaque", "opaqueredirect" ]), n = new Set([ "", "OK", "Continue", "Not Found" ]);
    if (void 0 !== e) {
      if (r.has(e)) return {
        type: e
      };
      var s, i = e.trim();
      if (!i.startsWith("{") || !i.endsWith("}")) return reportInvalid();
      try {
        s = JSON.parse(i);
      } catch (e) {
        return reportInvalid();
      }
      if (!s || Array.isArray(s) || "object" != typeof s) return reportInvalid();
      for (var o = {}, a = Object.keys(s), f = 0; f < a.length; f += 1) {
        var u = a[f], p = s[u];
        if ("ok" !== u && "redirected" !== u || "boolean" != typeof p) {
          if ("status" === u && isValidResponseStatus(p)) o[u] = p; else if ("statusText" === u && "string" == typeof p && n.has(p)) o[u] = p; else {
            if ("type" !== u || "string" != typeof p || !r.has(p)) return reportInvalid();
            o[u] = p;
          }
        } else o[u] = p;
      }
      return o;
    }
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
  function generateRandomResponse(e) {
    return generateResponseContent(e, false);
  }
  function generateResponseContent(r, t) {
    if (!r) return "";
    if ("true" === r) return Math.random().toString(36).slice(2).padEnd(10, "0").slice(0, 10);
    if ("emptyObj" === r) return "{}";
    if ("emptyArr" === r) return "[]";
    if ("emptyStr" === r) return "";
    if (r.startsWith("war:") || r.startsWith("join:")) return "";
    for (var e, n = /length:(\d+)(?:-(\d+))?/g, i = null; null !== (e = n.exec(r)); ) i = e;
    if (i) {
      var u = getNumberFromString(i[1]), l = i[2] ? getNumberFromString(i[2]) : u;
      if (null === u || null === l || !nativeIsFinite(u) || !nativeIsFinite(l)) return null;
      var a = u, f = l;
      if (a > f) {
        var g = a;
        a = f, f = g;
      }
      if (f > 5e5) return null;
      var o = getRandomIntInclusive(a, f), s = r.replace(/length:\d+(?:-\d+)?/g, "").trim();
      if (s) {
        return "";
      }
      return getRandomStrByLength(o);
    }
    return t ? r : "";
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function getRandomIntInclusive(t, n) {
    return t = Math.ceil(t), n = Math.floor(n), Math.floor(Math.random() * (n - t + 1) + t);
  }
  function getRandomStrByLength(r) {
    for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=~", n = [], o = 0; o < r; o += 1) n.push(t.charAt(Math.floor(76 * Math.random())));
    return n.join("");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventFetch.apply(this, updatedArgs);
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
  const NAME = "ubo-prevent-fetch";
  const ENTRIES = [[["llvpn.com/tag.min.js"],["dramadizilerim.com"],[]],[["/agead2\\.googlesyndication\\.com|googleadservices\\.com/"],["gecmisi.com.tr"],[]],[["pagead2.googlesyndication.com"],["dentalilan.com"],[]],[["pagead2.googlesyndication.com"],["bafrahaber.com"],[]],[["https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"],["raindropteamfan.com"],[]],[["/assets/js/prebid"],["sozcu.com.tr"],[]],[["www3.doubleclick.net"],["bikifi.com"],[]],[["pagead2.googlesyndication.com"],["ogznet.com"],[]],[["pagead2.googlesyndication.com"],["discordsunucu.com"],[]],[["pagead2.googlesyndication.com"],["boxofficeturkiye.com"],[]],[["pagead2.googlesyndication.com"],["nedir.org"],[]],[["pagead2.googlesyndication.com"],["puhutv.com"],[]],[["doubleclick.net"],["puhutv.com"],[]]];
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
