/* Süzgeç scriptlet: ubo-nano-sib — generated, do not edit */
(() => {
  'use strict';
  const run = function adjustSetInterval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function adjustSetInterval(source, matchCallback, matchDelay, boost) {
    var nativeSetInterval = window.setInterval;
    var matchRegexp = toRegExp(matchCallback);
    var intervalWrapper = function intervalWrapper(callback, delay) {
      if (!isValidCallback(callback)) {
        var message = `Scriptlet can't be applied because of invalid callback: '${callbackToString(callback)}'`;
        logMessage(source, message);
      } else if (matchRegexp.test(callbackToString(callback)) && isDelayMatched(matchDelay, delay)) {
        delay *= getBoostMultiplier(boost);
        hit(source);
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return nativeSetInterval.apply(window, [ callback, delay, ...args ]);
    };
    window.setInterval = intervalWrapper;
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
  function getBoostMultiplier(t) {
    var e = parseFloat(t), i = nativeIsNaN(e) || !nativeIsFinite(e) ? .05 : e;
    return i < .001 && (i = .001), i > 50 && (i = 50), i;
  }
  function isDelayMatched(a, e) {
    return shouldMatchAnyDelay(a) || e === getMatchDelay(a);
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
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function getMatchDelay(a) {
    var e = parseInt(a, 10);
    return nativeIsNaN(e) ? 1e3 : e;
  }
  function shouldMatchAnyDelay(n) {
    return "*" === n;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    adjustSetInterval.apply(this, updatedArgs);
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
  const NAME = "ubo-nano-sib";
  const ENTRIES = [[["clearInterval"],["indi-share.com"],[]],[[],["al.ly","bbf.lt","cpmlink.net","iiv.pl","ur.ly","url.gem-flash.com","zeiz.me"],[]],[[],["1ink.cc"],[]],[["myTimer","1500"],["freepdf-books.com"],[]],[["countdown","2000"],["themeslide.com"],[]],[["counter","2000"],["thememypc.net"],[]],[["","1800"],["link.tl"],[]],[["","","0"],["lnk.news","lnk.parts"],[]],[["yuidea-","*"],["gamelopte.com"],[]],[[],["soft112.com"],[]],[["timeLeft"],["goto.com.np"],[]],[[],["short-url.link"],[]],[["","","0.001"],["gold-24.net"],[]],[[],["4download.net"],[]],[["time"],["icutlink.com"],[]],[[],["s.sseluxx.com"],[]],[["clearInterval","*"],["simsdom.com"],[]],[["seconds"],["fautsy.com"],[]],[["","","0.02"],["legionjuegos.org","legionpeliculas.org","legionprogramas.org"],[]],[[],["onifile.com"],[]],[[],["link-to.net"],[]],[[],["onle.co"],[]],[[],["fstore.biz"],[]],[[],["deltabit.co"],[]],[["seconds"],["coinlyhub.com"],[]],[["/SplashScreen|BannerAd/"],["gamearter.com"],[]],[["","*","0"],["ayobelajarbareng.com","semawur.com"],[]],[[],["sfile.mobi"],[]],[[],["game-kentang.blogspot.com"],[]],[[],["shortgoo.blogspot.com"],[]],[["js-btn-skip","1000"],["doofree88.com"],[]],[[],["sfirmware.com"],[]],[[],["mobilelegends.shop"],[]],[["countdown","*","0.001"],["acdriftingpro.com"],[]],[[],["urlpay.net"],[]],[[],["underhentai.net"],[]],[["secondsLeft"],["gdl.freegogpcgames.xyz"],[]],[[],["suanoticia.online"],[]],[[],["linkconfig.com"],[]],[[],["lg-firmwares.com"],[]],[["clearInterval"],["premid.app"],[]],[[],["wallpaperaccess.com"],[]],[["skipAdSeconds","","0.02"],["novelgames.com"],[]],[["adv","*"],["3bmeteo.com"],[]]];
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
