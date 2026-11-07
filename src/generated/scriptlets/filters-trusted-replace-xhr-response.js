/* Süzgeç scriptlet: trusted-replace-xhr-response — generated, do not edit */
(() => {
  'use strict';
  const run = function trustedReplaceXhrResponse(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedReplaceXhrResponse(source) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var replacement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var propsToMatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var verbose = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    if (typeof Proxy === "undefined") {
      return;
    }
    if (pattern === "" && replacement !== "") {
      var message = "Pattern argument should not be empty string.";
      logMessage(source, message);
      return;
    }
    var shouldLog = pattern === "" && replacement === "";
    var shouldLogContent = verbose === "true";
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var matchedXhrRequests = new Set;
    var xhrRequestHeaders = new Map;
    var forgedRequests = new WeakMap;
    var xhrData;
    var openWrapper = function openWrapper(target, thisArg, args) {
      xhrData = getXhrData.apply(null, args);
      if (shouldLog) {
        var _message = `xhr( ${objectToString(xhrData)} )`;
        logMessage(source, _message, true);
        hit(source);
        return Reflect.apply(target, thisArg, args);
      }
      if (matchRequestProps(source, propsToMatch, xhrData)) {
        matchedXhrRequests.add(thisArg);
      }
      if (matchedXhrRequests.has(thisArg) && !xhrRequestHeaders.has(thisArg)) {
        xhrRequestHeaders.set(thisArg, []);
        var setRequestHeaderWrapper = function setRequestHeaderWrapper(target, thisArg, args) {
          var headers = xhrRequestHeaders.get(thisArg);
          if (headers) {
            headers.push(args);
          }
          return Reflect.apply(target, thisArg, args);
        };
        var setRequestHeaderHandler = {
          apply: setRequestHeaderWrapper
        };
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
        var responseHeaderWrapper = function responseHeaderWrapper(target, thisArg, args) {
          var forgedRequest = forgedRequests.get(thisArg);
          if (forgedRequest) {
            return Reflect.apply(target, forgedRequest, args);
          }
          return Reflect.apply(target, thisArg, args);
        };
        var responseHeaderHandler = {
          apply: responseHeaderWrapper
        };
        thisArg.getResponseHeader = new Proxy(thisArg.getResponseHeader, responseHeaderHandler);
        thisArg.getAllResponseHeaders = new Proxy(thisArg.getAllResponseHeaders, responseHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      if (!matchedXhrRequests.has(thisArg)) {
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.withCredentials = thisArg.withCredentials;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string") {
          return;
        }
        var patternRegexp = pattern === "*" ? /(\n|.)*/ : toRegExp(pattern);
        var isPatternFound = pattern === "*" || patternRegexp.test(content);
        var responseContent = content;
        if (isPatternFound) {
          if (shouldLogContent) {
            logMessage(source, `Original text content: ${content}`);
          }
          responseContent = content.replace(patternRegexp, replacement);
          if (shouldLogContent) {
            logMessage(source, `Modified text content: ${responseContent}`);
          }
        }
        Object.defineProperties(thisArg, {
          readyState: {
            value: readyState,
            writable: false
          },
          responseURL: {
            value: responseURL,
            writable: false
          },
          responseXML: {
            value: responseXML,
            writable: false
          },
          status: {
            value: status,
            writable: false
          },
          statusText: {
            value: statusText,
            writable: false
          },
          response: {
            value: responseContent,
            writable: false
          },
          responseText: {
            value: responseContent,
            writable: false
          }
        });
        forgedRequests.set(thisArg, forgedRequest);
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new ProgressEvent("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new ProgressEvent("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        if (isPatternFound) {
          hit(source);
        }
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url ]);
      var collectedHeaders = xhrRequestHeaders.get(thisArg) || [];
      collectedHeaders.forEach((function(header) {
        var name = header[0];
        var value = header[1];
        forgedRequest.setRequestHeader(name, value);
      }));
      xhrRequestHeaders.delete(thisArg);
      matchedXhrRequests.delete(thisArg);
      try {
        Reflect.apply(nativeSend, forgedRequest, args);
      } catch (_unused) {
        return Reflect.apply(target, thisArg, args);
      }
      return undefined;
    };
    var openHandler = {
      apply: openWrapper
    };
    var sendHandler = {
      apply: sendWrapper
    };
    XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, openHandler);
    XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, sendHandler);
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
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    trustedReplaceXhrResponse.apply(this, updatedArgs);
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
  const NAME = "trusted-replace-xhr-response";
  const ENTRIES = [[["\"adPlacements\"","\"no_ads\"","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["tv.youtube.com"],[]],[["/\"adPlacements.*?([A-Z]\"\\}|\"\\}{2,4})\\}\\],/","","/playlist\\?list=|\\/player(?:\\?.+)?$|watch\\?[tv]=/"],["www.youtube.com"],[]],[["/\"adPlacements.*?(\"adSlots\"|\"adBreakHeartbeatParams\")/gms","$1","/\\/player(?:\\?.+)?$/"],["www.youtube.com"],[]],[["/\\{\"node\":\\{\"role\":\"SEARCH_ADS\"[^\\n]+?cursor\":[^}]+\\}/g","{}","/api/graphql"],["web.facebook.com","www.facebook.com"],[]],[["/\\{\"node\":\\{\"__typename\":\"MarketplaceFeedAdStory\"[^\\n]+?\"cursor\":(?:null|\"\\{[^\\n]+?\\}\"|[^\\n]+?MarketplaceSearchFeedStoriesEdge\")\\}/g","{}","/api/graphql"],["web.facebook.com","www.facebook.com"],[]],[["/\\{\"node\":\\{\"__typename\":\"VideoHomeFeedUnitSectionComponent\"[^\\n]+?\"sponsored_data\":\\{\"ad_id\"[^\\n]+?\"cursor\":null\\}/","{}","/api/graphql"],["web.facebook.com","www.facebook.com"],[]],[["/\"enabled\":\\s*true/","\"enabled\":false","svonm.com"],["desired.de","toggo.de"],[]]];
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
