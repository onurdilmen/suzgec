/* Süzgeç scriptlet: ubo-set-constant — generated, do not edit */
(() => {
  'use strict';
  const run = function setConstant(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setConstant(source, property, value) {
    var stack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var valueWrapper = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var setProxyTrap = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var uboAliases = [ "set-constant.js", "ubo-set-constant.js", "set.js", "ubo-set.js", "ubo-set-constant", "ubo-set" ];
    if (uboAliases.includes(source.name)) {
      if (stack.length !== 1 && !getNumberFromString(stack)) {
        valueWrapper = stack;
      }
      stack = undefined;
    }
    if (!property) {
      return;
    }
    var isProxyTrapSet = false;
    var emptyArr = noopArray();
    var emptyObj = noopObject();
    var constantValue;
    if (value === "undefined") {
      constantValue = undefined;
    } else if (value === "false") {
      constantValue = false;
    } else if (value === "true") {
      constantValue = true;
    } else if (value === "null") {
      constantValue = null;
    } else if (value === "emptyArr") {
      constantValue = emptyArr;
    } else if (value === "emptyObj") {
      constantValue = emptyObj;
    } else if (value === "noopFunc") {
      constantValue = noopFunc;
    } else if (value === "noopCallbackFunc") {
      constantValue = noopCallbackFunc;
    } else if (value === "trueFunc") {
      constantValue = trueFunc;
    } else if (value === "falseFunc") {
      constantValue = falseFunc;
    } else if (value === "throwFunc") {
      constantValue = throwFunc;
    } else if (value === "noopPromiseResolve") {
      constantValue = noopPromiseResolve;
    } else if (value === "noopPromiseReject") {
      constantValue = noopPromiseReject;
    } else if (/^\d+$/.test(value)) {
      constantValue = parseFloat(value);
      if (nativeIsNaN(constantValue)) {
        return;
      }
      if (Math.abs(constantValue) > 32767) {
        return;
      }
    } else if (value === "-1") {
      constantValue = -1;
    } else if (value === "") {
      constantValue = "";
    } else if (value === "yes") {
      constantValue = "yes";
    } else if (value === "no") {
      constantValue = "no";
    } else {
      return;
    }
    var valueWrapperNames = [ "asFunction", "asCallback", "asResolved", "asRejected" ];
    if (valueWrapperNames.includes(valueWrapper)) {
      var valueWrappersMap = {
        asFunction(v) {
          return function() {
            return v;
          };
        },
        asCallback(v) {
          return function() {
            return function() {
              return v;
            };
          };
        },
        asResolved(v) {
          return Promise.resolve(v);
        },
        asRejected(v) {
          return Promise.reject(v);
        }
      };
      constantValue = valueWrappersMap[valueWrapper](constantValue);
    }
    var canceled = false;
    var mustCancel = function mustCancel(value) {
      if (canceled) {
        return canceled;
      }
      canceled = value !== undefined && constantValue !== undefined && typeof value !== typeof constantValue && value !== null;
      return canceled;
    };
    var trapProp = function trapProp(base, prop, configurable, handler) {
      if (!handler.init(base[prop])) {
        return false;
      }
      var origDescriptor = Object.getOwnPropertyDescriptor(base, prop);
      var prevSetter;
      if (origDescriptor instanceof Object) {
        if (!origDescriptor.configurable) {
          var message = `Property '${prop}' is not configurable`;
          logMessage(source, message);
          return false;
        }
        if (base[prop]) {
          base[prop] = constantValue;
        }
        if (origDescriptor.set instanceof Function) {
          prevSetter = origDescriptor.set;
        }
      }
      Object.defineProperty(base, prop, {
        configurable: configurable,
        get() {
          return handler.get();
        },
        set(a) {
          if (prevSetter !== undefined) {
            prevSetter(a);
          }
          if (a instanceof Object) {
            var propertiesToCheck = property.split(".").slice(1);
            if (setProxyTrap && !isProxyTrapSet) {
              isProxyTrapSet = true;
              a = new Proxy(a, {
                get: function get(target, propertyKey, val) {
                  propertiesToCheck.reduce((function(object, currentProp, index, array) {
                    var currentObj = object === null || object === void 0 ? void 0 : object[currentProp];
                    if (index === array.length - 1 && currentObj !== constantValue) {
                      object[currentProp] = constantValue;
                    }
                    return currentObj || object;
                  }), target);
                  return Reflect.get(target, propertyKey, val);
                }
              });
            }
          }
          handler.set(a);
        }
      });
      return true;
    };
    var setChainPropAccess = createSetChainPropAccessor({
      source: source,
      stack: stack,
      mustCancel: mustCancel,
      trapProp: trapProp,
      getConstantValue: function getConstantValue() {
        return constantValue;
      },
      setConstantValue: function setConstantValue(v) {
        constantValue = v;
      }
    });
    setChainPropAccess(window, property);
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
  function createSetChainPropAccessor(t) {
    var {source: e, stack: r, mustCancel: i, trapProp: n, getConstantValue: a, setConstantValue: s} = t, _setChainPropAccess2 = function _setChainPropAccess(t, c) {
      var o = getPropertyInChain(t, c), {base: u, prop: d, chain: f} = o, h = {
        factValue: void 0,
        init(t) {
          return this.factValue = t, true;
        },
        get() {
          return this.factValue;
        },
        set(t) {
          this.factValue !== t && (this.factValue = t, t instanceof Object && _setChainPropAccess2(t, f));
        }
      }, l = {
        factValue: void 0,
        descriptorAddon: getDescriptorAddon(),
        init(t) {
          return !i(t) && (this.factValue = t, true);
        },
        get() {
          if (!r) return hit(e), a();
          if (!this.descriptorAddon.isAbortingSuspended) {
            this.descriptorAddon.isAbortingSuspended = true;
            var t = false;
            try {
              t = matchStackTrace(r, (new Error).stack || "");
            } catch (t) {
              return this.descriptorAddon.isAbortingSuspended = false, this.factValue;
            }
            if (this.descriptorAddon.isAbortingSuspended = false, t) return hit(e), a();
          }
          return this.factValue;
        },
        set(t) {
          i(t) ? s(t) : this.factValue = t;
        }
      };
      if (f) {
        if (void 0 === u || null !== u[d]) {
          (u instanceof Object || "object" == typeof u) && isEmptyObject(u) && n(u, d, true, h);
          var p = t[d];
          (p instanceof Object || "object" == typeof p && null !== p) && _setChainPropAccess2(p, f), 
          n(u, d, true, h);
        } else n(u, d, true, h);
      } else n(u, d, false, l);
    };
    return _setChainPropAccess2;
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopFunc() {}
  function noopCallbackFunc() {
    return noopFunc;
  }
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function shouldAbortInlineOrInjectedScript(t, i) {
    var r = "inlineScript", n = "injectedScript", isInlineScript = function isInlineScript(t) {
      return t.includes(r);
    }, isInjectedScript = function isInjectedScript(t) {
      return t.includes(n);
    };
    if (!isInlineScript(t) && !isInjectedScript(t)) return false;
    var e = window.location.href, s = e.indexOf("#");
    -1 !== s && (e = e.slice(0, s));
    var c = i.split("\n").slice(2).map((function(t) {
      return t.trim();
    })).map((function(t) {
      var i, s = /(.*?@)?(\S+)(:\d+)(:\d+)\)?$/.exec(t);
      if (s) {
        var c, l, a = s[2], u = s[3], o = s[4];
        if (null !== (c = a) && void 0 !== c && c.startsWith("(") && (a = a.slice(1)), null !== (l = a) && void 0 !== l && l.startsWith("<anonymous>")) {
          var d;
          a = n;
          var f = void 0 !== s[1] ? s[1].slice(0, -1) : t.slice(0, s.index).trim();
          null !== (d = f) && void 0 !== d && d.startsWith("at") && (f = f.slice(2).trim()), 
          i = `${f} ${a}${u}${o}`.trim();
        } else i = a === e ? `${r}${u}${o}`.trim() : `${a}${u}${o}`.trim();
      } else i = t;
      return i;
    }));
    if (c) for (var l = 0; l < c.length; l += 1) {
      if (isInlineScript(t) && c[l].startsWith(r) && c[l].match(toRegExp(t))) return true;
      if (isInjectedScript(t) && c[l].startsWith(n) && c[l].match(toRegExp(t))) return true;
    }
    return false;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
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
  function backupRegExpValues() {
    try {
      for (var r = [], e = 1; e < 10; e += 1) {
        var a = `$${e}`;
        if (!RegExp[a]) break;
        r.push(RegExp[a]);
      }
      return r;
    } catch (r) {
      return [];
    }
  }
  function restoreRegExpValues(e) {
    if (e.length) try {
      var r = "";
      r = 1 === e.length ? `(${e[0]})` : e.reduce((function(e, r, t) {
        return 1 === t ? `(${e}),(${r})` : `${e},(${r})`;
      }));
      var t = new RegExp(r);
      e.toString().replace(t, "");
    } catch (e) {
      var n = `Failed to restore RegExp values: ${e}`;
      console.log(n);
    }
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
  function matchStackTrace(e, t) {
    if (!e || "" === e) return true;
    var r = backupRegExpValues();
    if (shouldAbortInlineOrInjectedScript(e, t)) return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), 
    true;
    var n = toRegExp(e), a = t.split("\n").slice(2).map((function(e) {
      return e.trim();
    })).join("\n");
    return r.length && r[0] !== RegExp.$1 && restoreRegExpValues(r), getNativeRegexpTest().call(n, a);
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setConstant.apply(this, updatedArgs);
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
  const NAME = "ubo-set-constant";
  const ENTRIES = [[["adblock.check","noopFunc"],["teknop.net","ozgunbilgi.com"],[]],[["adBlockDetected","noopFunc"],["merlinscans.com"],[]],[["App.detectAdBlock","noopFunc"],["haber3.com"],[]],[["canRunAds","true"],["promy.pro"],[]],[["adblock.check","noopFunc"],["beceriksizler.net"],[]],[["eyeOfErstream.detectedBloke","falseFunc"],["exxen.com"],[]],[["tie.ad_blocker_disallow_images_placeholder","undefined"],["tgyama.com"],[]],[["eazy_ad_unblocker_msg_var",""],["uzaymanga.com"],[]],[["detector_active","true"],["wheel-size.com.tr"],[]],[["adblock_active","false"],["karnaval.com"],[]],[["adBlockRunning","false"],["mangaship.net"],[]],[["adBlockRunning","false"],["mangaship.com"],[]],[["adb","false"],["miuitr.info"],[]],[["maari","noopFunc"],["puhutv.com"],[]],[["adBlockEnabled","false"],["puhutv.com"],[]],[["kan_vars.adblock","undefined"],["coinotag.com"],[]],[["adblockCheckUrl",""],["kanald.com.tr"],[]],[["adservice","{}"],["kanald.com.tr"],[]],[["canRunAds","true"],["iddaaorantahmin.com"],[]],[["jQuery.adblock","false"],["oyungibi.com"],[]],[["koddostu_com_adblock_yok","null"],["turkdenizcileri.com","bilgalem.blogspot.com"],[]],[["jQuery.adblock","false"],["veterinerhekimleri.com"],[]],[["adblock","false"],["klavyeanaliz.org"],[]],[["puShown","true"],["www.filmoley.cc","onlinefilmizlee.com","hdfilmcixx.com","filmcus.org","safirfilm.vip","onlinedizi.sbs","sinemakolix.net","zerotik.com","filmifullizlet.com","filmseyretizlet.net","sinemadafilmizle.net","hdfilm.us","erotikjam.com","erotikkizle.com","kelebekfilmm1.com","tekparthdfilmizle.cc","yavuzfilmm.com","sinekolikk.com","kuzufilmizle1.com","yabancidizivip.com","ediziizle.com","filmcusx.com","cristal.guru","vizyon18tv.com","korkuseli.com","sinemadafilmizle.org","erotikfimm.com","erotikgo.com","fullhdfilmcenneti.pro","filmgo1.com","puffytr.com","dizimore.com","dizirex.com","turkifsa.xyz","royalfilmizle.com","sinetiktok.com","uzaymanga.com","filmifullizle.online","sinemakolik.org","filmerotixxx.com","filmfc.com","filmizletv18.com","onlinefilmizle.site","playerzz.xyz","filmjr.org","asfilmizle.com","filmhe.com","hdfilmizle.org","tafdi4.com","elzemfilm.org","tafdi3.com","hdfilmizle.in","diziyou.co","dizimag.eu","bumfilmizle1.com","1080hdfilmizle.com","yabancidizibax.com","sinemangoo.org","sexfilmleriizle.com","geziforumu.com","efendim.xyz","dizipaltv.net","fluffcore.com","hdfilmcehennemizle.com","netfullfilmizle3.com","arrowizle.com","filmcus.com","sinemakolik.net","zarize.com","burdenfly.com","zzerotik.com","sinemafilmizle.net","filmkuzusu1.com","sinemadelisi.com","erotikfilmtube.com","pornoanne.com","diziboxx.com","turkaliz.com","vkfilmizle.net","shirl.club","turkcealtyazilipornom.com","hdfilmizletv.net","sinemaizle.co","hdfilmcehennem.live","efullizle.com","asyafanatiklerim.com","volsex.com"],[]],[["isShow","true"],["tekfullfilmizle5.com"],[]],[["Object.prototype.isAdMonetizationDisabled","true"],["sporx.com"],[]],[["app.ads","{}"],["filmizlehdizle.com","fullfilmizlesene.net"],[]],[["wpsaData","undefined"],["filmmodu.co"],[]],[["AdmostClient","noopFunc"],["arsiv.mackolik.com"],[]],[["loadPlayerAds","trueFunc"],["nefisyemektarifleri.com"],[]],[["loadPlayerAds","trueFunc"],["izlesene.com"],[]],[["wpsaData","undefined"],["asyawatch.com"],[]],[["volumeClearInterval","0"],["tranimeci.com"],[]],[["clicked","true"],["turkanime.co"],[]],[["adSearchTitle",""],["forum.donanimhaber.com"],[]],[["HBiddings.vastUrl",""],["atv.com.tr"],[]],[["wpsaData","undefined"],["dizipal12.site","dizipal13.site","dizipal14.site","dizipal15.site","dizipal16.site","dizipal17.site","dizipal19.site","dizipal21.site","dizipal22.site","dizipal23.site","dizipal24.site","dizipal25.site","dizipal26.site","dizipal27.site","dizipal28.site"],[]],[["initOpen","undefined"],["contentx.me"],[]],[["rg","noopFunc"],["edebiyatdefteri.com"],[]],[["Object.prototype.video_ads","noopFunc"],["belgeselizlesene.com"],[]],[["Object.prototype.ads_enable","false"],["belgeselizlesene.com"],[]],[["td_ad_background_click_link",""],["technopat.net"],[]],[["start","1"],["aydindenge.com.tr"],[]],[["popup","noopFunc"],["diziall.com"],[]],[["__DRAMAFLIX_NO_ADS__","true"],["dramaflix.cc"],[]],[["HTMLAnchorElement.prototype.click","noopFunc"],["cdnvexo.site"],[]],[["jwSetup.advertising","undefined"],["vidlax.xyz"],[]],[["window.config.adv.enabled","0"],["pages.dev","hudsonlegalblog.com","selcuk-sports.com"],[]],[["manset_adv_imp","noopFunc"],["sondakika.com"],[]],[["popupShown","true"],["filmdizibox.com","guzelfilm.com","tranimaci.com"],[]],[["adsConfig","{}"],["da95848c82c933d2.click"],[]],[["td_ad_background_click_link",""],["pchocasi.com.tr"],[]],[["PopBanner","undefined"],["yeniasya.com.tr"],[]],[["config.adv","{}"],["buenosairesideal.com","pllsfored.co"],[]],[["ads","{}"],["domplayer.org"],[]],[["config.advertisement.enabled","false"],["zeustv204.com","zeustv205.com","zeustv206.com","zeustv207.com","zeustv208.com","zeustv209.com","zeustv210.com","zeustv211.com","zeustv212.com","zeustv213.com","zeustv214.com","zeustv215.com","zeustv216.com","zeustv217.com","zeustv218.com","zeustv219.com","zeustv220.com","zeustv221.com","zeustv222.com","zeustv223.com","zeustv224.com","zeustv225.com","zeustv226.com","zeustv227.com","zeustv228.com","zeustv229.com","zeustv230.com","zeustv231.com","zeustv232.com","zeustv233.com","zeustv234.com","zeustv235.com","zeustv236.com","zeustv237.com","zeustv238.com","zeustv239.com","zeustv240.com","zeustv241.com","zeustv242.com","zeustv243.com","zeustv244.com","zeustv245.com","zeustv246.com","zeustv247.com","zeustv248.com","zeustv249.com","zeustv250.com","zeustv251.com","zeustv252.com","zeustv253.com","zeustv254.com"],[]],[["config.adv.enabled","false"],["bosssports326.com","bosssports327.com","bosssports328.com","bosssports329.com","bosssports330.com","bosssports331.com","bosssports332.com","bosssports333.com","bosssports334.com","bosssports335.com","bosssports336.com","bosssports337.com","bosssports338.com","bosssports339.com","bosssports340.com","bosssports341.com","bosssports342.com","bosssports343.com","bosssports344.com","bosssports345.com"],[]],[["config.adv.enabled","0"],["betivotv156.com","betivotv157.com","betivotv158.com","betivotv159.com","betivotv160.com","betivotv161.com","betivotv162.com","betivotv163.com","betivotv164.com","betivotv165.com","betivotv166.com"],[]],[["window.advertisement.states.activate","false"],["goley90canlitv3003.site","goley90canlitv3004.site","goley90canlitv3005.site","goley90canlitv3006.site","goley90canlitv3007.site","goley90canlitv3008.site","goley90canlitv3009.site","goley90canlitv3010.site","goley90canlitv3011.site","goley90canlitv3012.site","goley90canlitv3013.site","goley90canlitv3014.site","goley90canlitv3015.site","goley90canlitv3016.site","goley90canlitv3017.site","goley90canlitv3018.site","goley90canlitv3019.site","goley90canlitv3020.site","goley90canlitv3021.site","goley90canlitv3022.site"],[]],[["config.advertisement.enabled","false"],["macizlevip741.sbs","macizlevip742.sbs","macizlevip743.sbs","macizlevip744.sbs","macizlevip745.sbs","macizlevip746.sbs","macizlevip747.sbs","macizlevip748.sbs","macizlevip749.sbs","macizlevip750.sbs","macizlevip751.sbs","macizlevip752.sbs","macizlevip753.sbs","macizlevip754.sbs","macizlevip755.sbs","macizlevip756.sbs","macizlevip757.sbs","macizlevip758.sbs","macizlevip759.sbs","macizlevip760.sbs"],[]],[["window.config.adv.enabled","0"],["beintvcanliizle52.com","beintvcanliizle53.com","beintvcanliizle54.com","beintvcanliizle55.com","beintvcanliizle56.com","beintvcanliizle57.com","beintvcanliizle58.com","beintvcanliizle59.com","beintvcanliizle60.com","beintvcanliizle61.com","beintvcanliizle62.com","beintvcanliizle63.com","beintvcanliizle64.com","beintvcanliizle65.com","beintvcanliizle66.com","beintvcanliizle67.com","beintvcanliizle68.com","beintvcanliizle69.com","beintvcanliizle70.com","beintvcanliizle71.com"],[]],[["puShown","true"],["canlimacizlemax667.top"],[]],[["puShown","true"],["hdselcuksports420.top","hdselcuksports421.top","hdselcuksports422.top","hdselcuksports423.top","hdselcuksports424.top","hdselcuksports425.top","hdselcuksports426.top","hdselcuksports427.top","hdselcuksports428.top","hdselcuksports429.top","hdselcuksports430.top","hdselcuksports431.top","hdselcuksports432.top","hdselcuksports433.top","hdselcuksports434.top","hdselcuksports435.top","hdselcuksports436.top","hdselcuksports437.top","hdselcuksports438.top","hdselcuksports439.top","hdselcuksports440.top","hdselcuksports441.top","hdselcuksports442.top","hdselcuksports443.top","hdselcuksports444.top","hdselcuksports445.top","hdselcuksports446.top","hdselcuksports447.top","hdselcuksports448.top","hdselcuksports449.top","hdselcuksports450.top","hdselcuksports451.top","hdselcuksports452.top","hdselcuksports453.top","hdselcuksports454.top","hdselcuksports455.top","hdselcuksports456.top","hdselcuksports457.top","hdselcuksports458.top","hdselcuksports459.top","hdselcuksports460.top","hdselcuksports461.top","hdselcuksports462.top","hdselcuksports463.top","hdselcuksports464.top","hdselcuksports465.top","hdselcuksports466.top","hdselcuksports467.top","hdselcuksports468.top","hdselcuksports469.top","hdselcuksports470.top","hdselcuksports471.top","hdselcuksports472.top"],[]],[["puShown","true"],["sporcafe74.top"],[]],[["window.config.adv.enabled","0"],["justintvsh.baby","dmlstechnology.com","justintvde.com","justin-tv.org","inattvgiris.pro"],[]],[["puShown","true"],["justintvizle550.top","justintvizle551.top","justintvizle552.top","justintvizle553.top","justintvizle554.top","justintvizle555.top","justintvizle556.top","justintvizle557.top","justintvizle558.top","justintvizle559.top","justintvizle560.top","justintvizle561.top","justintvizle562.top","justintvizle563.top","justintvizle564.top","justintvizle565.top","justintvizle566.top","justintvizle567.top","justintvizle568.top","justintvizle569.top"],[]],[["window.config.adv.enabled","0"],["t24giris2.cfd"],[]],[["puShown","true"],["taraftariummdeneme.blogspot.com","justintvx30.blogspot.com","justintvxx10.blogspot.com","inattv-taraftarium24-macizle.blogspot.com","canli-mac-izle-taraftarium24-izle.blogspot.com","justintvgiris.blogspot.com","sportboss-macizlesbs.blogspot.com","taraftarium402.blogspot.com","macicanliizle.sbs","taraftarium24canli-macizlesene.blogspot.com","taraftarium24hdgiris1.blogspot.com","selcukspor-taraftarium24canliizle1.blogspot.com","taraftariumxx.cfd"],[]],[["window.config.adv.enabled","0"],["hayrirsds24.cfd"],[]],[["player.vroll","noopFunc"],["diziyou.one"],[]],[["config.advertisement.enabled","false"],["cinque.668a396e58bcbc27.click"],[]],[["getFrontVideo","noopFunc"],["tvboff10.com","tvboff11.com","tvboff12.com","tvboff13.com","tvboff14.com","tvboff15.com","tvboff16.com","tvboff17.com","tvboff18.com","tvboff19.com","tvboff20.com"],[]],[["reklamsayisi","1"],["filmizlehdfilm.com","hdfilmizlesene.org","sinema.cx"],[]],[["__dizipalPreroll","undefined"],["dizipal3.com.tr","dizipal4.com.tr","dizipal5.com.tr","dizipal6.com.tr","dizipal7.com.tr","dizipal8.com.tr","dizipal9.com.tr","dizipal10.com.tr","dizipal11.com.tr","dizipal12.com.tr","dizipal13.com.tr","dizipal14.com.tr","dizipal15.com.tr","dizipal16.com.tr","dizipal17.com.tr","dizipal18.com.tr","dizipal19.com.tr","dizipal20.com.tr"],[]],[["isShow","true"],["webteizle3.xyz","webteizle4.xyz","webteizle5.xyz","webteizle6.xyz","webteizle7.xyz","webteizle8.xyz","webteizle9.xyz","webteizle10.xyz"],[]],[["config.adv","{}"],["trgoals1495.xyz","trgoals1496.xyz","trgoals1497.xyz","trgoals1498.xyz","trgoals1499.xyz","trgoals1500.xyz","trgoals1501.xyz","trgoals1502.xyz","trgoals1503.xyz","trgoals1504.xyz","trgoals1505.xyz","trgoals1506.xyz","trgoals1507.xyz","trgoals1508.xyz","trgoals1509.xyz","trgoals1510.xyz","trgoals1511.xyz","trgoals1512.xyz","trgoals1513.xyz","trgoals1514.xyz","trgoals1515.xyz","trgoals1516.xyz","trgoals1517.xyz","trgoals1518.xyz","trgoals1519.xyz","trgoals1520.xyz","trgoals1521.xyz","trgoals1522.xyz","trgoals1523.xyz","trgoals1524.xyz","trgoals1525.xyz","trgoals1526.xyz","trgoals1527.xyz","trgoals1528.xyz","trgoals1529.xyz","trgoals1530.xyz","trgoals1531.xyz","trgoals1532.xyz","trgoals1533.xyz","trgoals1534.xyz","trgoals1535.xyz","trgoals1536.xyz","trgoals1537.xyz","trgoals1538.xyz","trgoals1539.xyz","trgoals1540.xyz","trgoals1541.xyz","trgoals1542.xyz","trgoals1543.xyz"],[]],[["isShow","true"],["trgoals1495.xyz","trgoals1496.xyz","trgoals1497.xyz","trgoals1498.xyz","trgoals1499.xyz","trgoals1500.xyz","trgoals1501.xyz","trgoals1502.xyz","trgoals1503.xyz","trgoals1504.xyz","trgoals1505.xyz","trgoals1506.xyz","trgoals1507.xyz","trgoals1508.xyz","trgoals1509.xyz","trgoals1510.xyz","trgoals1511.xyz","trgoals1512.xyz","trgoals1513.xyz","trgoals1514.xyz","trgoals1515.xyz","trgoals1516.xyz","trgoals1517.xyz","trgoals1518.xyz","trgoals1519.xyz","trgoals1520.xyz","trgoals1521.xyz","trgoals1522.xyz","trgoals1523.xyz","trgoals1524.xyz","trgoals1525.xyz","trgoals1526.xyz","trgoals1527.xyz","trgoals1528.xyz","trgoals1529.xyz","trgoals1530.xyz","trgoals1531.xyz","trgoals1532.xyz","trgoals1533.xyz","trgoals1534.xyz","trgoals1535.xyz","trgoals1536.xyz","trgoals1537.xyz","trgoals1538.xyz","trgoals1539.xyz","trgoals1540.xyz","trgoals1541.xyz","trgoals1542.xyz","trgoals1543.xyz"],[]],[["video_shown","1"],["trgoals183.top"],[]],[["puShown","true"],["trgoals183.top"],[]],[["puShown","true"],["inattvizle486.top"],[]],[["puShown","true"],["www.papazsports1027.pro","www.papazsports1028.pro","www.papazsports1029.pro","www.papazsports1030.pro"],[]],[["Object.prototype.adReinsertion.homad.enabled","false"],["n-tv.de","rtl.de"],[]],[["UOLPD","{}"],["biologianet.com"],[]],[["UOLPD.dataLayer","{}"],["biologianet.com"],[]],[["__configuredDFPTags","{}"],["biologianet.com"],[]]];
  const EXCEPTIONS = [[["pp_adblock_is_off","trueFunc"],["dziennikbaltycki.pl","dzienniklodzki.pl","dziennikpolski24.pl","dziennikzachodni.pl","echodnia.eu","expressbydgoski.pl","expressilustrowany.pl","gazetakrakowska.pl","gazetalubuska.pl","gazetawroclawska.pl","gk24.pl","gloswielkopolski.pl","gol24.pl","gp24.pl","gra.pl","gs24.pl","kurierlubelski.pl","motofakty.pl","naszemiasto.pl","nowiny24.pl","nowosci.com.pl","nto.pl","polskatimes.pl","pomorska.pl","poranny.pl","sportowy24.pl","strefaagro.pl","strefabiznesu.pl","stronakobiet.pl","telemagazyn.pl","to.com.pl","wspolczesna.pl"]]];
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
