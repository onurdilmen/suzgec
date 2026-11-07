/* Süzgeç scriptlet: ubo-acs — generated, do not edit */
(() => {
  'use strict';
  const run = function abortCurrentInlineScript(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortCurrentInlineScript(source, property, search) {
    var searchRegexp = toRegExp(search);
    var rid = randomId();
    var SRC_DATA_MARKER = "data:text/javascript;base64,";
    var getCurrentScript = function getCurrentScript() {
      if ("currentScript" in document) {
        return document.currentScript;
      }
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    };
    var ourScript = getCurrentScript();
    var abort = function abort() {
      var _scriptEl$src;
      var scriptEl = getCurrentScript();
      if (!scriptEl) {
        return;
      }
      var content = scriptEl.textContent;
      try {
        var textContentGetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").get;
        content = textContentGetter.call(scriptEl);
      } catch (e) {}
      if (content.length === 0 && typeof scriptEl.src !== "undefined" && (_scriptEl$src = scriptEl.src) !== null && _scriptEl$src !== void 0 && _scriptEl$src.startsWith(SRC_DATA_MARKER)) {
        var encodedContent = scriptEl.src.slice(SRC_DATA_MARKER.length);
        content = window.atob(encodedContent);
      }
      if (scriptEl instanceof HTMLScriptElement && content.length > 0 && scriptEl !== ourScript && searchRegexp.test(content)) {
        hit(source);
        throw new ReferenceError(rid);
      }
    };
    var _setChainPropAccess = function setChainPropAccess(owner, property) {
      var chainInfo = getPropertyInChain(owner, property);
      var {base: base, prop: prop, chain: chain} = chainInfo;
      if (base instanceof Object === false && base === null) {
        var props = property.split(".");
        var propIndex = props.indexOf(prop);
        var baseName = props[propIndex - 1];
        var message = `The scriptlet had been executed before the ${baseName} was loaded.`;
        logMessage(source, message);
        return;
      }
      if (chain) {
        interceptChainProp(owner, prop, chain, _setChainPropAccess);
        return;
      }
      var currentValue = base[prop];
      var origDescriptor = Object.getOwnPropertyDescriptor(base, prop);
      if (origDescriptor instanceof Object === false || origDescriptor.get instanceof Function === false) {
        currentValue = base[prop];
        origDescriptor = undefined;
      }
      var descriptorWrapper = Object.assign(getDescriptorAddon(), {
        currentValue: currentValue,
        get() {
          if (!this.isAbortingSuspended) {
            this.isolateCallback(abort);
          }
          if (origDescriptor instanceof Object) {
            return origDescriptor.get.call(base);
          }
          return this.currentValue;
        },
        set(newValue) {
          if (!this.isAbortingSuspended) {
            this.isolateCallback(abort);
          }
          if (origDescriptor instanceof Object) {
            origDescriptor.set.call(base, newValue);
          } else {
            this.currentValue = newValue;
          }
        }
      });
      setPropertyAccess(base, prop, {
        get() {
          return descriptorWrapper.get.call(descriptorWrapper);
        },
        set(newValue) {
          descriptorWrapper.set.call(descriptorWrapper, newValue);
        }
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
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getDescriptorAddon() {
    return {
      isAbortingSuspended: false,
      isolateCallback(r) {
        this.isAbortingSuspended = true;
        try {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), t = 1; t < e; t++) n[t - 1] = arguments[t];
          var i = r(...n);
          return this.isAbortingSuspended = !1, i;
        } catch (r) {
          var s = randomId();
          throw this.isAbortingSuspended = false, new ReferenceError(s);
        }
      }
    };
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
    abortCurrentInlineScript.apply(this, updatedArgs);
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
  const NAME = "ubo-acs";
  const ENTRIES = [[["document.getElementsByTagName","gtm.js"],["bolighub.dk"],[]],[["document.createElement","__apNoHold"],["iphoneincanada.ca"],[]],[["document.createElement","admiral"],["247sports.com","al.com","arstechnica.com","bringmethenews.com","cattime.com","cbr.com","cheatsheet.com","collider.com","comingsoon.net","crooksandliars.com","cwtv.com","dogtime.com","esportstales.com","forums.hfboards.com","freep.com","fresnobee.com","gamerant.com","gbatemp.net","golfdigest.com","grabify.link","hancinema.net","hemmings.com","howtogeek.com","ijr.com","informazionefiscale.it","inquirer.net","insider-gaming.com","knowyourmeme.com","magesypro.pro","makeuseof.com","mlive.com","money.it","motorbiscuit.com","movieweb.com","nationalreview.com","nbcnews.com","neopets.com","nofilmschool.com","nypost.com","omg.blog","order-order.com","oregonlive.com","pcwelt.de","pennlive.com","playstationlifestyle.net","pwinsider.com","savvytime.com","screenrant.com","siliconera.com","simpleflying.com","sporcle.com","stealthoptional.com","techlicious.com","technicpack.net","thedraftnetwork.com","thefashionspot.com","thegamer.com","thelayoff.com","thenerdstash.com","theprovince.com","titantv.com","topspeed.com","twinfinite.net","videogamer.com","webmail.wiki","wnd.com","worldpopulationreview.com","wral.com","wrestlezone.com","wrestlinginc.com","xda-developers.com"],[]],[["document.getElementsByTagName",".pubads"],["10tv.com","11alive.com","12news.com","12newsnow.com","13newsnow.com","13wmaz.com","5newsonline.com","9news.com","abc10.com","al.com","aol.com","apnews.com","artforum.com","artnews.com","bellinghamherald.com","billboard.com","birdsandblooms.com","calgaryherald.com","calgarysun.com","cbs19.tv","cbs8.com","chattanoogacw.com","cleveland.com","crooksandliars.com","deadline.com","dpreview.com","driving.ca","edmontonjournal.com","edmontonsun.com","familyhandyman.com","financialpost.com","firstcoastnews.com","fox43.com","fox61.com","futbin.com","goldderby.com","golfdigest.com","gulflive.com","hollywoodreporter.com","indiewire.com","kare11.com","kcentv.com","kens5.com","kgw.com","khou.com","kiiitv.com","king5.com","komonews.com","krem.com","ktvb.com","kvue.com","lehighvalleylive.com","lfpress.com","localmemphis.com","masslive.com","mlive.com","motor1.com","myfoxzone.com","nationalpost.com","nbcsports.com","news.com.au","newscentermaine.com","newswest9.com","nj.com","nydailynews.com","oregonlive.com","ottawacitizen.com","ottawasun.com","pcworld.com","pennlive.com","rd.com","robbreport.com","rollingstone.com","sherdog.com","sidereel.com","silive.com","sportico.com","superherohype.com","syracuse.com","tasteofhome.com","techcrunch.com","thehealthy.com","thv11.com","tj.news","torontosun.com","twinfinite.net","vancouversun.com","variety.com","vibe.com","wbir.com","wcnc.com","weareiowa.com","weather.com","wfaa.com","wfmynews2.com","wgrz.com","whas11.com","windsorstar.com","wkyc.com","wltx.com","wnep.com","wqad.com","wthr.com","wtol.com","wtsp.com","wusa9.com","wwd.com","wwltv.com","wzzm13.com"],[]],[["document.createElement","keen-tracking"],["mwed.jp"],[]],[["document.createElement",".js"],["liberation.fr","officedepot.fr","oui.sncf"],[]],[["document.createElement","script"],["brillen.de"],[]]];
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
