/* Süzgeç scriptlet: ubo-m3u-prune — generated, do not edit */
(() => {
  'use strict';
  const run = function m3uPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function m3uPrune(source, propsToRemove) {
    var urlToMatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (typeof Reflect === "undefined" || typeof fetch === "undefined" || typeof Proxy === "undefined" || typeof Response === "undefined") {
      return;
    }
    var shouldPruneResponse = false;
    var shouldLogContent = verbose === "true";
    var urlMatchRegexp = toRegExp(urlToMatch);
    var SEGMENT_MARKER = "#";
    var AD_MARKER = {
      ASSET: "#EXT-X-ASSET:",
      CUE: "#EXT-X-CUE:",
      CUE_IN: "#EXT-X-CUE-IN",
      DISCONTINUITY: "#EXT-X-DISCONTINUITY",
      EXTINF: "#EXTINF",
      EXTM3U: "#EXTM3U",
      SCTE35: "#EXT-X-SCTE35:"
    };
    var COMCAST_AD_MARKER = {
      AD: "-AD-",
      VAST: "-VAST-",
      VMAP_AD: "-VMAP-AD-",
      VMAP_AD_BREAK: "#EXT-X-VMAP-AD-BREAK:"
    };
    var TAGS_ALLOWLIST = [ "#EXT-X-TARGETDURATION", "#EXT-X-MEDIA-SEQUENCE", "#EXT-X-DISCONTINUITY-SEQUENCE", "#EXT-X-ENDLIST", "#EXT-X-PLAYLIST-TYPE", "#EXT-X-I-FRAMES-ONLY", "#EXT-X-MEDIA", "#EXT-X-STREAM-INF", "#EXT-X-I-FRAME-STREAM-INF", "#EXT-X-SESSION-DATA", "#EXT-X-SESSION-KEY", "#EXT-X-INDEPENDENT-SEGMENTS", "#EXT-X-START" ];
    var isAllowedTag = function isAllowedTag(str) {
      return TAGS_ALLOWLIST.some((function(el) {
        return str.startsWith(el);
      }));
    };
    var _pruneExtinfFromVmapBlock = function pruneExtinfFromVmapBlock(lines, i) {
      var array = lines.slice();
      var index = i;
      if (array[index].includes(AD_MARKER.EXTINF)) {
        array[index] = undefined;
        index += 1;
        if (array[index].includes(AD_MARKER.DISCONTINUITY)) {
          array[index] = undefined;
          index += 1;
          var prunedExtinf = _pruneExtinfFromVmapBlock(array, index);
          array = prunedExtinf.array;
          index = prunedExtinf.index;
        }
      }
      return {
        array: array,
        index: index
      };
    };
    var pruneVmapBlock = function pruneVmapBlock(lines) {
      var array = lines.slice();
      for (var i = 0; i < array.length - 1; i += 1) {
        if (array[i].includes(COMCAST_AD_MARKER.VMAP_AD) || array[i].includes(COMCAST_AD_MARKER.VAST) || array[i].includes(COMCAST_AD_MARKER.AD)) {
          array[i] = undefined;
          if (array[i + 1].includes(AD_MARKER.EXTINF)) {
            i += 1;
            var prunedExtinf = _pruneExtinfFromVmapBlock(array, i);
            array = prunedExtinf.array;
            i = prunedExtinf.index - 1;
          }
        }
      }
      return array;
    };
    var pruneSpliceoutBlock = function pruneSpliceoutBlock(line, index, array) {
      if (!line.startsWith(AD_MARKER.CUE)) {
        return line;
      }
      line = undefined;
      index += 1;
      if (array[index].startsWith(AD_MARKER.ASSET)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.SCTE35)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.CUE_IN)) {
        array[index] = undefined;
        index += 1;
      }
      if (array[index].startsWith(AD_MARKER.SCTE35)) {
        array[index] = undefined;
      }
      return line;
    };
    var removeM3ULineRegexp = toRegExp(propsToRemove);
    var pruneInfBlock = function pruneInfBlock(line, index, array) {
      if (!line.startsWith(AD_MARKER.EXTINF)) {
        return line;
      }
      if (!removeM3ULineRegexp.test(array[index + 1])) {
        return line;
      }
      if (!isAllowedTag(array[index])) {
        array[index] = undefined;
      }
      index += 1;
      if (!isAllowedTag(array[index])) {
        array[index] = undefined;
      }
      index += 1;
      if (array[index].startsWith(AD_MARKER.DISCONTINUITY)) {
        array[index] = undefined;
      }
      return line;
    };
    var pruneSegments = function pruneSegments(lines) {
      for (var i = 0; i < lines.length - 1; i += 1) {
        var _lines$i;
        if ((_lines$i = lines[i]) !== null && _lines$i !== void 0 && _lines$i.startsWith(SEGMENT_MARKER) && removeM3ULineRegexp.test(lines[i])) {
          var segmentName = lines[i].substring(0, lines[i].indexOf(":"));
          if (!segmentName) {
            return lines;
          }
          lines[i] = undefined;
          i += 1;
          for (var j = i; j < lines.length; j += 1) {
            if (!lines[j].includes(segmentName) && !isAllowedTag(lines[j])) {
              lines[j] = undefined;
            } else {
              i = j - 1;
              break;
            }
          }
        }
      }
      return lines;
    };
    var isM3U = function isM3U(text) {
      if (typeof text === "string") {
        var trimmedText = text.trim();
        return trimmedText.startsWith(AD_MARKER.EXTM3U) || trimmedText.startsWith(COMCAST_AD_MARKER.VMAP_AD_BREAK);
      }
      return false;
    };
    var isPruningNeeded = function isPruningNeeded(text, regexp) {
      return isM3U(text) && regexp.test(text);
    };
    var pruneM3U = function pruneM3U(text) {
      if (shouldLogContent) {
        logMessage(source, `Original M3U content:\n${text}`);
      }
      var lines = text.split(/\r?\n/);
      if (text.includes(COMCAST_AD_MARKER.VMAP_AD_BREAK)) {
        lines = pruneVmapBlock(lines);
        lines = lines.filter((function(l) {
          return !!l;
        })).join("\n");
        if (shouldLogContent) {
          logMessage(source, `Modified M3U content:\n${lines}`);
        }
        return lines;
      }
      lines = pruneSegments(lines);
      lines = lines.map((function(line, index, array) {
        if (typeof line === "undefined") {
          return line;
        }
        line = pruneSpliceoutBlock(line, index, array);
        if (typeof line !== "undefined") {
          line = pruneInfBlock(line, index, array);
        }
        return line;
      })).filter((function(l) {
        return !!l;
      })).join("\n");
      if (shouldLogContent) {
        logMessage(source, `Modified M3U content:\n${lines}`);
      }
      return lines;
    };
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;
    var xhrData;
    var openWrapper = function openWrapper(target, thisArg, args) {
      xhrData = getXhrData.apply(null, args);
      if (matchRequestProps(source, urlToMatch, xhrData)) {
        thisArg.shouldBePruned = true;
      }
      if (thisArg.shouldBePruned) {
        thisArg.collectedHeaders = [];
        var setRequestHeaderWrapper = function setRequestHeaderWrapper(target, thisArg, args) {
          thisArg.collectedHeaders.push(args);
          return Reflect.apply(target, thisArg, args);
        };
        var setRequestHeaderHandler = {
          apply: setRequestHeaderWrapper
        };
        thisArg.setRequestHeader = new Proxy(thisArg.setRequestHeader, setRequestHeaderHandler);
      }
      return Reflect.apply(target, thisArg, args);
    };
    var sendWrapper = function sendWrapper(target, thisArg, args) {
      var allowedResponseTypeValues = [ "", "text" ];
      if (!thisArg.shouldBePruned || !allowedResponseTypeValues.includes(thisArg.responseType)) {
        return Reflect.apply(target, thisArg, args);
      }
      var forgedRequest = new XMLHttpRequest;
      forgedRequest.addEventListener("readystatechange", (function() {
        if (forgedRequest.readyState !== 4) {
          return;
        }
        var {readyState: readyState, response: response, responseText: responseText, responseURL: responseURL, responseXML: responseXML, status: status, statusText: statusText} = forgedRequest;
        var content = responseText || response;
        if (typeof content !== "string") {
          return;
        }
        if (!propsToRemove) {
          if (isM3U(response)) {
            var message = `XMLHttpRequest.open() URL: ${responseURL}\nresponse: ${response}`;
            logMessage(source, message);
          }
        } else {
          shouldPruneResponse = isPruningNeeded(response, removeM3ULineRegexp);
        }
        var responseContent = shouldPruneResponse ? pruneM3U(response) : response;
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
        setTimeout((function() {
          var stateEvent = new Event("readystatechange");
          thisArg.dispatchEvent(stateEvent);
          var loadEvent = new Event("load");
          thisArg.dispatchEvent(loadEvent);
          var loadEndEvent = new Event("loadend");
          thisArg.dispatchEvent(loadEndEvent);
        }), 1);
        hit(source);
      }));
      nativeOpen.apply(forgedRequest, [ xhrData.method, xhrData.url ]);
      thisArg.collectedHeaders.forEach((function(header) {
        var name = header[0];
        var value = header[1];
        forgedRequest.setRequestHeader(name, value);
      }));
      thisArg.collectedHeaders = [];
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
    var nativeFetch = window.fetch;
    var fetchWrapper = async function fetchWrapper(target, thisArg, args) {
      var fetchURL = args[0] instanceof Request ? args[0].url : args[0];
      if (typeof fetchURL !== "string" || fetchURL.length === 0) {
        return Reflect.apply(target, thisArg, args);
      }
      if (urlMatchRegexp.test(fetchURL)) {
        var response = await nativeFetch(...args);
        var clonedResponse = response.clone();
        var responseText = await response.text();
        if (!propsToRemove && isM3U(responseText)) {
          var message = `fetch URL: ${fetchURL}\nresponse text: ${responseText}`;
          logMessage(source, message);
          return clonedResponse;
        }
        if (isPruningNeeded(responseText, removeM3ULineRegexp)) {
          var prunedText = pruneM3U(responseText);
          hit(source);
          return new Response(prunedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
        return clonedResponse;
      }
      return Reflect.apply(target, thisArg, args);
    };
    var fetchHandler = {
      apply: fetchWrapper
    };
    window.fetch = new Proxy(window.fetch, fetchHandler);
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
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    m3uPrune.apply(this, updatedArgs);
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
  const NAME = "ubo-m3u-prune";
  const ENTRIES = [[["/cdn\\.net\\/.*\\/ad\\//","/daioncdn\\.net\\/.*\\.m3u8/"],["ahaber.com.tr","tv8bucuk.com","tabii.com","trtizle.com","ntv.com.tr","tlctv.com.tr","dmax.com.tr","haberturk.com","bloomberght.com","aspor.com.tr","atv.com.tr","beyaztv.com.tr","kanal7.com","kanald.com.tr","showtv.com.tr","startv.com.tr","teve2.com.tr","tv8.com.tr"],[]]];
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
