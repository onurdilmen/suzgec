/* Süzgeç scriptlet: ubo-nosiif — generated, do not edit */
(() => {
  'use strict';
  const run = function preventSetInterval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventSetInterval(source, matchCallback, matchDelay) {
    var shouldLog = typeof matchCallback === "undefined" && typeof matchDelay === "undefined";
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      var callback = args[0];
      var delay = args[1];
      var shouldPrevent = false;
      if (shouldLog) {
        hit(source);
        logMessage(source, `setInterval(${callbackToString(callback)}, ${delay})`, true);
      } else {
        shouldPrevent = isPreventionNeeded({
          callback: callback,
          delay: delay,
          matchCallback: matchCallback,
          matchDelay: matchDelay
        });
      }
      if (shouldPrevent) {
        hit(source);
        args[0] = noopFunc;
      }
      return target.apply(thisArg, args);
    };
    var setIntervalHandler = {
      apply: handlerWrapper
    };
    window.setInterval = new Proxy(window.setInterval, setIntervalHandler);
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
  function noopFunc() {}
  function isPreventionNeeded(a) {
    var {callback: e, delay: t, matchCallback: l, matchDelay: r} = a;
    if (!isValidCallback(e)) return false;
    if (!isValidMatchStr(l) || r && !isValidMatchNumber(r)) return false;
    var {isInvertedMatch: c, matchRegexp: i} = parseMatchArg(l), {isInvertedDelayMatch: n, delayMatch: s, delayMinMatch: d, delayMaxMatch: h, isDelayRange: M} = parseDelayArg(r), y = parseRawDelay(t), v = callbackToString(e);
    return M || null !== s ? l ? i.test(v) !== c && isPreventDelayMatched(M, d, h, s, n, y) : isPreventDelayMatched(M, d, h, s, n, y) : i.test(v) !== c;
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
  function parseDelayArg(a) {
    var l = null == a ? void 0 : a.startsWith("!"), e = l ? a.slice(1) : a, n = e ? e.indexOf("-") : -1;
    if (-1 !== n) {
      var t = e.slice(0, n), i = e.slice(n + 1), s = "" === t ? null : parseFloat(t), M = "" === i ? null : parseFloat(i), u = "" === t || null !== s && !nativeIsNaN(s), c = "" === i || null !== M && !nativeIsNaN(M);
      return u && c && (null !== s || null !== M) ? {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: s,
        delayMaxMatch: M,
        isDelayRange: true
      } : {
        isInvertedDelayMatch: l,
        delayMatch: null,
        delayMinMatch: null,
        delayMaxMatch: null,
        isDelayRange: true
      };
    }
    var r = parseInt(e, 10);
    return {
      isInvertedDelayMatch: l,
      delayMatch: nativeIsNaN(r) ? null : r,
      delayMinMatch: null,
      delayMaxMatch: null,
      isDelayRange: false
    };
  }
  function isPreventDelayMatched(l, n, u, e, t, r) {
    return l ? (null !== n || null !== u) && "number" == typeof r && ((null === n || r >= n) && (null === u || r <= u)) !== t : null === e || r === e !== t;
  }
  function isValidCallback(n) {
    return "function" == typeof n || "string" == typeof n;
  }
  function callbackToString(t) {
    if ("function" == typeof t) return Function.prototype.toString.call(t);
    try {
      return String(t);
    } catch (n) {
      return Object.prototype.toString.call(t);
    }
  }
  function isValidMatchStr(t) {
    var i = t;
    return null != t && t.startsWith("!") && (i = t.slice(1)), isValidStrPattern(i);
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
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function isValidMatchNumber(a) {
    var e = a;
    null != a && a.startsWith("!") && (e = a.slice(1));
    var i = e.indexOf("-");
    if (-1 !== i) {
      var t = e.slice(0, i), s = e.slice(i + 1), n = "" === t || !nativeIsNaN(parseFloat(t)) && nativeIsFinite(parseFloat(t)), r = "" === s || !nativeIsNaN(parseFloat(s)) && nativeIsFinite(parseFloat(s));
      return !(!n || !r || "" === t && "" === s);
    }
    var l = parseFloat(e);
    return !nativeIsNaN(l) && nativeIsFinite(l);
  }
  function parseRawDelay(a) {
    var e = Math.floor(parseInt(a, 10));
    return "number" != typeof e || nativeIsNaN(e) ? a : e;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventSetInterval.apply(this, updatedArgs);
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
  const NAME = "ubo-nosiif";
  const ENTRIES = [[["fireEvent","500"],["tvtoday.de"],[]],[["header_menu_abvs","10000"],["vaughn.live"],[]],[["adb"],["economictimes.indiatimes.com"],[]],[["readyState"],["frprn.com"],[]],[["adblockerModal","1000"],["hulkshare.com"],[]],[["user=null","1000"],["faucetcrypto.com"],[]],[["_checkBait"],["giveawayoftheday.com"],[]],[["()","5000"],["uploadbox.io"],[]],[["_$","12345"],["myjest.com"],[]],[["()","5000"],["megafile.io"],[]],[[".append","1000"],["4shared.com"],[]],[["onAdVideoStart"],["crunchyroll.com"],[]],[["/_0x|debug/"],["extremereportbot.com"],[]],[["complete","50"],["tubepornclassic.com"],[]],[["document.readyState"],["tubepornclassic.com"],[]],[["0x"],["mangalist.org"],[]],[["adblocker"],["techmuzz.com"],[]],[["iframe"],["lecourrier-du-soir.com"],[]],[["visibility","1000"],["forex-trnd.com"],[]],[["adsbygoogle"],["thgss.com"],[]],[["visibility","1000"],["vidlii.com"],[]],[["0x"],["javcl.com"],[]],[["innerHTML"],["premid.app"],[]],[["setInterval"],["businessinsider.com"],[]]];
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
