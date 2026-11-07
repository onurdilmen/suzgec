/* Süzgeç scriptlet: ubo-abort-on-property-read — generated, do not edit */
(() => {
  'use strict';
  const run = function abortOnPropertyRead(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnPropertyRead(source, property) {
    if (!property) {
      return;
    }
    var rid = randomId();
    var abort = function abort() {
      hit(source);
      throw new ReferenceError(rid);
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      setPropertyAccess(base, prop, {
        get: abort,
        set: function set() {}
      });
    };
    _setChainPropAccess(window, property);
    window.onerror = createOnErrorHandler(rid).bind();
  }
  function randomId() {
    return Math.random().toString(36).slice(2, 9);
  }
  function setPropertyAccess(e, r, t) {
    var c = Object.getOwnPropertyDescriptor(e, r);
    return !(c && !c.configurable) && (Object.defineProperty(e, r, t), true);
  }
  function getPropertyInChain(e, r) {
    var n = r.indexOf(".");
    if (-1 === n) return {
      base: e,
      prop: r
    };
    var i = r.slice(0, n);
    if (null === e) return {
      base: e,
      prop: i,
      chain: r
    };
    var t = e[i];
    return r = r.slice(n + 1), (e instanceof Object || "object" == typeof e) && isEmptyObject(e) || null === t ? {
      base: e,
      prop: i,
      chain: r
    } : void 0 !== t ? getPropertyInChain(t, r) : (Object.defineProperty(e, i, {
      configurable: true
    }), {
      base: e,
      prop: i,
      chain: r
    });
  }
  function createOnErrorHandler(r) {
    var n = window.onerror;
    return function(e) {
      if ("string" == typeof e && e.includes(r)) return true;
      if (n instanceof Function) {
        for (var t = arguments.length, o = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) o[i - 1] = arguments[i];
        return n.apply(window, [ e, ...o ]);
      }
      return false;
    };
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
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function interceptChainProp(t, n, e, c) {
    var i;
    try {
      i = t[n];
    } catch (t) {
      i = void 0;
    }
    Object.defineProperty(t, n, {
      get: function get() {
        return i;
      },
      set: function set(t) {
        i = t, t instanceof Object && c(t, e);
      }
    });
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    abortOnPropertyRead.apply(this, updatedArgs);
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
  const NAME = "ubo-abort-on-property-read";
  const ENTRIES = [[["adblockmesaj"],["komputerdelisi.com"],[]],[["detectedAdBlock"],["sozcu.com.tr"],[]],[["adblockmesaj"],["mangawt.com"],[]],[["detectAdBlock"],["telegramgruplari.com"],[]],[["adblockmesaj"],["gsmturkey.net"],[]],[["adblockmesaj"],["vidtekno.com"],[]],[["adsBlocked"],["kanalmaras.com"],[]],[["rTargets"],["r10.net"],[]],[["initPu"],["fullhdfilmsitesii.com","sinefilmizlesem.com","erotikgo.org","puffytr.com","filmcuss.cc","canlimacizlene.blogspot.com","filmjr2.org","balfilmizle2.org","erotizmvadisi.com","zerotiktok.com","filmzevkim.com","sinemakolix.com","erotikhoot.com","eldermanga.com","promy.pro","diziyoutv.com","guneykoresinemasi.com","jetfilmizletv.net","dizimax2.com","yenierotikfilm.xyz","diziday1.com","zipfilmizle.com","bamfilmizle.com","sinemadafilm.com","filmmoduu.com","trfilm.net","dolufilm.org","turkifsaalemi.com"],[]],[["initAd"],["hdizleplus.com","kaliteizle.com","720pizleme.cc","fullfilmizlebaba.com","superfilmgeldi.biz","supernaturalizle.com","sinemakolik.net","bettercallsaulizle.com","superfilmgeldi.net","fullhdfilmizlett1.com","fullhdfilmizleabi.com","hdfreeizle.com","hdmixfilim.com","fullhdfilmizlepala.com"],[]],[["initPop"],["hdfilmizlesen.com","filmizlehdizle.com","1080hdfilmizle.com"],[]],[["oV1"],["shirl.club","altporno.xyz"],[]],[["openPopup"],["webdramaturkey2.com","afroditscans.com"],[]],[["pop_status"],["hdmixfilim.com"],[]],[["sagAltReklamListesi"],["goodfilmizle.com"],[]],[["initDizi"],["diziyou.co"],[]],[["wpsite_clickable_data"],["technopat.net"],[]],[["open"],["pornoizle9.icu"],[]],[["initPu"],["tenshimanga.com"],[]],[["doOpen"],["hdfilmizlesene.net","filmizle.cx"],[]],[["initPu"],["milanotv61.shop"],[]],[["initPu"],["taratv51.shop"],[]],[["doOpen"],["turkifsa.porn","turkifsa1.porn","turkifsa2.porn","turkifsa3.porn","turkifsa4.porn","turkifsa5.porn","turkifsa6.porn","turkifsa7.porn","turkifsa8.porn","turkifsa9.porn","turkifsa10.porn","turkifsa11.porn","turkifsa12.porn","turkifsa13.porn","turkifsa14.porn","turkifsa15.porn","turkifsa16.porn","turkifsa17.porn","turkifsa18.porn","turkifsa19.porn","turkifsa20.porn","turkifsa21.porn","turkifsa22.porn","turkifsa23.porn","turkifsa24.porn","turkifsa25.porn","turkifsa26.porn","turkifsa27.porn","turkifsa28.porn","turkifsa29.porn"],[]],[["popns"],["hentaizm6.online","hentaizm7.online","hentaizm8.online","hentaizm9.online","hentaizm10.online","hentaizm11.online","hentaizm12.online","hentaizm13.online","hentaizm14.online","hentaizm15.online","hentaizm16.online","hentaizm17.online","hentaizm18.online","hentaizm19.online","hentaizm20.online","hentaizm21.online","hentaizm22.online","hentaizm23.online","hentaizm24.online","hentaizm25.online"],[]],[["doOpen"],["dizipalx54.com","dizipalx55.com","dizipalx56.com","dizipalx57.com","dizipalx58.com","dizipalx59.com","dizipalx60.com","dizipalx61.com","dizipalx62.com","dizipalx63.com","dizipalx64.com","dizipalx65.com","dizipalx66.com","dizipalx67.com","dizipalx68.com","dizipalx69.com","dizipalx70.com","dizipalx71.com","dizipalx72.com","dizipalx73.com"],[]]];
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
