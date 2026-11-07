/* Süzgeç scriptlet: ubo-no-window-open-if — generated, do not edit */
(() => {
  'use strict';
  const run = function preventWindowOpen(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventWindowOpen(source) {
    var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "*";
    var delay = arguments.length > 2 ? arguments[2] : undefined;
    var replacement = arguments.length > 3 ? arguments[3] : undefined;
    var nativeOpen = window.open;
    var isNewSyntax = match !== "0" && match !== "1";
    var combineArgs = function combineArgs(url, args) {
      if (args && args.length > 0) {
        return `${url} ${args.join(" ")}`;
      }
      return url;
    };
    var oldOpenWrapper = function oldOpenWrapper(str) {
      match = Number(match) > 0;
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (!isValidStrPattern(delay)) {
        logMessage(source, `Invalid parameter: ${delay}`);
        return nativeOpen.apply(window, [ str, ...args ]);
      }
      var searchRegexp = toRegExp(delay);
      var argsToCheck = combineArgs(str, args);
      if (match !== searchRegexp.test(argsToCheck)) {
        return nativeOpen.apply(window, [ str, ...args ]);
      }
      hit(source);
      return handleOldReplacement(replacement);
    };
    var newOpenWrapper = function newOpenWrapper(url) {
      var shouldLog = replacement && replacement.includes("log");
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      if (shouldLog) {
        var argsStr = args && args.length > 0 ? `, ${args.join(", ")}` : "";
        var message = `${url}${argsStr}`;
        logMessage(source, message, true);
        hit(source);
      }
      var shouldPrevent = false;
      if (match === "*") {
        shouldPrevent = true;
      } else if (isValidMatchStr(match)) {
        var {isInvertedMatch: isInvertedMatch, matchRegexp: matchRegexp} = parseMatchArg(match);
        var argsToCheck = combineArgs(url, args);
        shouldPrevent = matchRegexp.test(argsToCheck) !== isInvertedMatch;
      } else {
        logMessage(source, `Invalid parameter: ${match}`);
        shouldPrevent = false;
      }
      if (shouldPrevent) {
        var parsedDelay = parseInt(delay, 10);
        var result;
        if (nativeIsNaN(parsedDelay)) {
          result = noopNull();
        } else {
          var decoyArgs = {
            replacement: replacement,
            url: url,
            delay: parsedDelay
          };
          var decoy = createDecoy(decoyArgs);
          var popup = decoy.contentWindow;
          if (typeof popup === "object" && popup !== null) {
            Object.defineProperty(popup, "closed", {
              value: false
            });
            Object.defineProperty(popup, "opener", {
              value: window
            });
            Object.defineProperty(popup, "frameElement", {
              value: null
            });
          } else {
            var nativeGetter = decoy.contentWindow && decoy.contentWindow.get;
            Object.defineProperty(decoy, "contentWindow", {
              get: getPreventGetter(nativeGetter)
            });
            popup = decoy.contentWindow;
          }
          result = popup;
        }
        hit(source);
        return result;
      }
      return nativeOpen.apply(window, [ url, ...args ]);
    };
    window.open = isNewSyntax ? newOpenWrapper : oldOpenWrapper;
    window.open.toString = nativeOpen.toString.bind(nativeOpen);
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
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
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
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function parseMatchArg(t) {
    var e = !!t && (null == t ? void 0 : t.startsWith("!")), a = e ? t.slice(1) : t;
    return {
      isInvertedMatch: e,
      matchRegexp: toRegExp(a),
      matchValue: a
    };
  }
  function handleOldReplacement(e) {
    var n;
    if (e) {
      if ("trueFunc" === e) n = trueFunc; else if (e.includes("=")) {
        if (e.startsWith("{") && e.endsWith("}")) {
          var t = e.slice(1, -1), u = substringBefore(t, "=");
          "noopFunc" === substringAfter(t, "=") && ((n = {})[u] = noopFunc);
        }
      }
    } else n = noopFunc;
    return n;
  }
  function createDecoy(e) {
    var t, r = function(e) {
      return e.Object = "data", e.Iframe = "src", e;
    }({}), {replacement: n, url: o, delay: a} = e;
    t = "obj" === n ? "object" : "iframe";
    var i = document.createElement(t);
    return i instanceof HTMLObjectElement ? i[r.Object] = o : i instanceof HTMLIFrameElement && (i[r.Iframe] = o), 
    i.style.setProperty("height", "1px", "important"), i.style.setProperty("position", "fixed", "important"), 
    i.style.setProperty("top", "-1px", "important"), i.style.setProperty("width", "1px", "important"), 
    document.body.appendChild(i), setTimeout((function() {
      return i.remove();
    }), 1e3 * a), i;
  }
  function getPreventGetter(n) {
    return function(t, e) {
      return (!e || "closed" !== e) && ("function" == typeof n ? noopFunc : e && t[e]);
    };
  }
  function noopNull() {
    return null;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function substringBefore(r, n) {
    if (!r || false) return r;
    var e = r.indexOf(n);
    return e < 0 ? r : r.substring(0, e);
  }
  function substringAfter(n, r) {
    if (!n) return n;
    var t = n.indexOf(r);
    return t < 0 ? "" : n.substring(t + r.length);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventWindowOpen.apply(this, updatedArgs);
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
  const NAME = "ubo-no-window-open-if";
  const ENTRIES = [[[],["elzemfilm.org"],[]],[[],["movietube32.xyz","turkerotikfilm.com"],[]],[[],["izleorg3.org"],[]],[["bit.ly"],["pchocasi.com.tr"],[]],[[],["youtubemp3.us"],[]],[[],["plusizle.com","filmkuzusu.vip","hboxcdn.xyz","keplersociety.com","vegoltv981.com","sierato.com","dizigom.love","cehennemizle.cc","cdnvexo.site","bingozade.com","ifsaciturksex99.site","99turkifsaizle.site","trkifsalariz.site","escobarvip.blog","dizipal.website","videojs.online","epikplayer.xyz","animeler.me","player.filmizle.in","tranimaci.com","izlekolik.org"],[]],[["_blank"],["cizgivedizi.com"],[]],[["_blank"],["azginkizlar.com"],[]],[["","1"],["player01.cfd"],[]],[[],["eldermanga.com","uzaymanga.com"],[]],[[],["kodamantv21.com"],[]],[[],["primeembedpanel.com"],[]],[[],["hdselcuksports420.top","hdselcuksports421.top","hdselcuksports422.top","hdselcuksports423.top","hdselcuksports424.top","hdselcuksports425.top","hdselcuksports426.top","hdselcuksports427.top","hdselcuksports428.top","hdselcuksports429.top","hdselcuksports430.top","hdselcuksports431.top","hdselcuksports432.top","hdselcuksports433.top","hdselcuksports434.top","hdselcuksports435.top","hdselcuksports436.top","hdselcuksports437.top","hdselcuksports438.top","hdselcuksports439.top","hdselcuksports440.top","hdselcuksports441.top","hdselcuksports442.top","hdselcuksports443.top","hdselcuksports444.top","hdselcuksports445.top","hdselcuksports446.top","hdselcuksports447.top","hdselcuksports448.top","hdselcuksports449.top","hdselcuksports450.top","hdselcuksports451.top","hdselcuksports452.top","hdselcuksports453.top","hdselcuksports454.top","hdselcuksports455.top","hdselcuksports456.top","hdselcuksports457.top","hdselcuksports458.top","hdselcuksports459.top","hdselcuksports460.top","hdselcuksports461.top","hdselcuksports462.top","hdselcuksports463.top","hdselcuksports464.top","hdselcuksports465.top","hdselcuksports466.top","hdselcuksports467.top","hdselcuksports468.top","hdselcuksports469.top","hdselcuksports470.top","hdselcuksports471.top","hdselcuksports472.top"],[]],[[],["hdselcuksports368.top"],[]],[[],["justintvizle550.top","justintvizle551.top","justintvizle552.top","justintvizle553.top","justintvizle554.top","justintvizle555.top","justintvizle556.top","justintvizle557.top","justintvizle558.top","justintvizle559.top","justintvizle560.top","justintvizle561.top","justintvizle562.top","justintvizle563.top","justintvizle564.top","justintvizle565.top","justintvizle566.top","justintvizle567.top","justintvizle568.top","justintvizle569.top"],[]],[[],["hdfilmcehennemi27.org"],[]],[[],["inattvizle486.top"],[]]];
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
