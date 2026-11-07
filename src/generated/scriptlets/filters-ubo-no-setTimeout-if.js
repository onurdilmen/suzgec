/* Süzgeç scriptlet: ubo-no-setTimeout-if — generated, do not edit */
(() => {
  'use strict';
  const run = function preventSetTimeout(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventSetTimeout(source, matchCallback, matchDelay) {
    var shouldLog = typeof matchCallback === "undefined" && typeof matchDelay === "undefined";
    var handlerWrapper = function handlerWrapper(target, thisArg, args) {
      var callback = args[0];
      var delay = args[1];
      var shouldPrevent = false;
      if (shouldLog) {
        hit(source);
        logMessage(source, `setTimeout(${callbackToString(callback)}, ${delay})`, true);
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
    var setTimeoutHandler = {
      apply: handlerWrapper
    };
    window.setTimeout = new Proxy(window.setTimeout, setTimeoutHandler);
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
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    preventSetTimeout.apply(this, updatedArgs);
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
  const NAME = "ubo-no-setTimeout-if";
  const ENTRIES = [[["0===o.offsetLeft&&0===o.offsetTop"],["ankarakampkafasi.com","zamaninvarken.com","kriptoradar.com","bakimlikadin.net","korsanedebiyat.com","genelpara.com","azbuz.org","mustafabukulmez.com"],[]],[["/new Promise[\\s\\S]*?\"throw\"[\\s\\S]*?void 0/"],["aeroinsta.com.tr"],[]],[["adsbygoogle"],["teknoistan.com"],[]],[[".offsetHeight === 0"],["sinematurk.com"],[]],[["adBlock"],["merlinscans.com"],[]],[["adsbygoogle"],["menufiyatlari.com.tr"],[]],[["adsbygoogle"],["sosyogaraj.com.tr"],[]],[["adsbygoogle"],["teknoinfo.com.tr"],[]],[["adblockalert"],["inceleriz.com"],[]],[["AdBlock"],["sinnerclownceviri.com"],[]],[["offsetParent"],["sinnerclownceviri.com"],[]],[["ad_block_detected"],["intekno.net"],[]],[["$('body').empty().append"],["kuponuna476.top","kuponuna477.top","kuponuna478.top","kuponuna479.top","kuponuna480.top","kuponuna481.top","kuponuna482.top","kuponuna483.top","kuponuna484.top","kuponuna485.top","kuponuna486.top","kuponuna487.top","kuponuna488.top","kuponuna489.top","kuponuna490.top","kuponuna491.top","kuponuna492.top","kuponuna493.top","kuponuna494.top","kuponuna495.top","kuponuna496.top","kuponuna497.top","kuponuna498.top","kuponuna499.top","kuponuna500.top","kuponuna501.top","kuponuna502.top","kuponuna503.top","kuponuna504.top","kuponuna505.top","kuponuna506.top","kuponuna507.top","kuponuna508.top","kuponuna509.top","kuponuna510.top","kuponuna511.top","kuponuna512.top","kuponuna513.top","kuponuna514.top","kuponuna515.top","kuponuna516.top","kuponuna517.top","kuponuna518.top","kuponuna519.top","kuponuna520.top","kuponuna521.top","kuponuna522.top","kuponuna523.top","kuponuna524.top","kuponuna525.top","kuponuna526.top","kuponuna527.top","kuponuna528.top","kuponuna529.top","kuponuna530.top","kuponuna531.top","kuponuna532.top","kuponuna533.top","kuponuna534.top","kuponuna535.top","kuponuna536.top","kuponuna537.top","kuponuna538.top","kuponuna539.top","kuponuna540.top","kuponuna541.top","kuponuna542.top","kuponuna543.top","kuponuna544.top","kuponuna545.top","kuponuna546.top","kuponuna547.top","kuponuna548.top","kuponuna549.top","kuponuna550.top","kuponuna551.top","kuponuna552.top","kuponuna553.top","kuponuna554.top","kuponuna555.top","kuponuna556.top","kuponuna557.top","kuponuna558.top","kuponuna559.top","kuponuna560.top","kuponuna561.top","kuponuna562.top","kuponuna563.top","kuponuna564.top","kuponuna565.top","kuponuna566.top","kuponuna567.top","kuponuna568.top","kuponuna569.top"],[]],[["kanews-modal-adblock","5000"],["veryansintv.com"],[]],[["/div#gpt-passback|playerNew\\.dispose\\(\\)/"],["puhutv.com"],[]],[[".offsetHeight === 0"],["isgfrm.com"],[]],[["/img[\\s\\S]*?\\.gif/"],["dizigom1.tv"],[]],[["wt()","100"],["eksisozluk.com"],[]],[["jsAd"],["joymaxtr.com"],[]]];
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
