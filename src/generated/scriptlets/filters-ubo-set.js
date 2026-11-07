/* Süzgeç scriptlet: ubo-set — generated, do not edit */
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
  const NAME = "ubo-set";
  const ENTRIES = [[["ytInitialPlayerResponse.playerAds","undefined"],["m.youtube.com","music.youtube.com","tv.youtube.com","www.youtube.com","youtubekids.com","youtube-nocookie.com"],[]],[["ytInitialPlayerResponse.adPlacements","undefined"],["m.youtube.com","music.youtube.com","tv.youtube.com","www.youtube.com","youtubekids.com","youtube-nocookie.com"],[]],[["ytInitialPlayerResponse.adSlots","undefined"],["m.youtube.com","music.youtube.com","tv.youtube.com","www.youtube.com","youtubekids.com","youtube-nocookie.com"],[]],[["playerResponse.adPlacements","undefined"],["m.youtube.com","music.youtube.com","tv.youtube.com","www.youtube.com","youtubekids.com","youtube-nocookie.com"],[]],[["nsShowMaxCount","0"],["timesofindia.indiatimes.com"],[]],[["objVc.interstitial_web",""],["economictimes.indiatimes.com"],[]],[["_ml_ads_ns","null"],["motherless.com"],[]],[["_sp_.config","undefined"],["sueddeutsche.de"],[]],[["AdController","noopFunc"],["wiwo.de"],[]],[["Object.prototype.hideAds","true"],["sankakucomplex.com"],[]],[["Object.prototype._getSalesHouseConfigurations","noopFunc"],["player.glomex.com","merkur.de","tz.de"],[]],[["flashvars.adv_pre_src",""],["watchmygf.me"],[]],[["adsEnabled","true"],["pornerbros.com"],[]],[["String.prototype.charAt","trueFunc"],["porn.com"],[]],[["ad_blocker","false"],["tune.pk"],[]],[["blockAdBlock","true"],["noticias.gospelmais.com.br"],[]],[["VikiPlayer.prototype.pingAbFactor","noopFunc"],["viki.com"],[]],[["player.options.disableAds","true"],["viki.com"],[]],[["blurred","false"],["mitly.us"],[]],[["flashvars.adv_pre_vast",""],["sleazyneasy.com"],[]],[["flashvars.adv_pre_vast_alt",""],["sleazyneasy.com"],[]],[["x_width","1"],["sleazyneasy.com"],[]],[["_site_ads_ns","true"],["pornsocket.com"],[]],[["luxuretv.config",""],["luxuretv.com"],[]],[["registerLazyExo","noopFunc"],["pussyspace.com","pussyspace.net"],[]],[["Object.prototype.AdOverlay","noopFunc"],["porndig.com"],[]],[["tkn_popunder","null"],["porndig.com"],[]],[["can_run_ads","true"],["webcheats.com.br"],[]],[["adsBlockerDetector","noopFunc"],["ceesty.com","gestyy.com"],[]],[["globalThis","null"],["ceesty.com","corneey.com","destyy.com","festyy.com","gestyy.com","sh.st"],[]],[["adblock","false"],["angrybirdsnest.com"],[]],[["__ads","true"],["planetsuzy.org"],[]],[["adblock","false"],["zrozz.com"],[]],[["FlixPop.isPopGloballyEnabled","falseFunc"],["empflix.com"],[]],[["blurred","false"],["linkrex.net","linx.cc"],[]],[["blurred","false"],["oke.io"],[]],[["isAdBlockActive","false"],["freeviewmovies.com"],[]],[["$.magnificPopup.open","noopFunc"],["watchmygf.me"],[]],[["adsenseadBlock","noopFunc"],["deepbrid.com"],[]],[["blurred","false"],["dz4link.com"],[]],[["adblockSuspected","false"],["webnovel.com"],[]],[["blurred","false"],["linclik.com"],[]],[["disasterpingu","false"],["schwaebische.de"],[]],[["adblock","false"],["clix4btc.com"],[]],[["App.views.adsView.adblock","false"],["8tracks.com"],[]],[["flashvars.adv_pause_html",""],["3movs.com"],[]],[["$.fx.off","true"],["revealname.com"],[]],[["console.clear","noopFunc"],["alphaporno.com"],[]],[["adBlockEnabled","false"],["golfchannel.com"],[]],[["puShown","true"],["gamcore.com","porcore.com","porngames.tv","69games.xxx"],[]],[["showAds","true"],["haaretz.co.il","haaretz.com"],[]],[["adblock","false"],["4tests.com"],[]],[["console.clear","noopFunc"],["porngem.com"],[]],[["cxStartDetectionProcess","noopFunc"],["foxsports.com.au"],[]],[["isAdBlocked","false"],["thesimsresource.com"],[]],[["blurred","false"],["shrt10.com"],[]],[["__NEXT_DATA__.props.clientConfigSettings.videoAds","undefined"],["nba.com"],[]],[["_ctrl_vt.blocked.ad_script","false"],["ctrl.blog"],[]],[["blockAdBlock","noopFunc"],["sportlife.es"],[]],[["caca","noopFunc"],["finofilipino.org"],[]],[["page_params.holiday_promo","true"],["you-porn.com","youporngay.com"],[]],[["page_params.holiday_promo","true"],["9908ww.com","adelaidepawnbroker.com","bztube.com","hotovs.com","insuredhome.org","nudegista.com","pornluck.com","vidd.se"],[]],[["sp_ad","true"],["ojogos.com.br"],[]],[["blurred","false"],["loptelink.com"],[]],[["adsBlocked","false"],["powforums.com"],[]],[["_sp_.msg.displayMessage","noopFunc"],["usgamer.net"],[]],[["isAdBlockActive","false"],["filehorse.com"],[]],[["CaptchmeState.adb","undefined"],["freebitcoin.win"],[]],[["CaptchmeState.adb","undefined"],["e-monsite.com"],[]],[["CaptchmeState.adb","undefined"],["coindice.win"],[]],[["$.magnificPopup.open","noopFunc"],["transparentcalifornia.com"],[]],[["UhasAB","false"],["freiepresse.de"],[]],[["blurred","false"],["cut-fly.com"],[]],[["blurred","false"],["linkfinal.com"],[]],[["adblockcheck","false"],["hotpornfile.org"],[]],[["adsBlocked","false"],["supforums.com"],[]],[["_pop","noopFunc"],["mp3fiber.com"],[]],[["CnnXt.Event.fire","noopFunc"],["chicoer.com"],[]],[["_ti_update_user","noopFunc"],["suedkurier.de"],[]],[["blurred","false"],["payskip.org"],[]],[["frg","1"],["pornve.com"],[]],[["CnnXt.Event.fire","noopFunc"],["dailybreeze.com","dailybulletin.com","dailynews.com","delcotimes.com","eastbaytimes.com","macombdaily.com","ocregister.com","pasadenastarnews.com","pe.com","presstelegram.com","redlandsdailyfacts.com","reviewjournal.com","santacruzsentinel.com","saratogian.com","sentinelandenterprise.com","sgvtribune.com","tampabay.com","times-standard.com","theoaklandpress.com","trentonian.com","twincities.com","whittierdailynews.com"],[]],[["ads","true"],["marie-claire.es"],[]],[["GNCA_Ad_Support","true"],["globalnews.ca"],[]],[["cxStartDetectionProcess","noopFunc"],["canberratimes.com.au"],[]],[["blurred","false"],["cutpaid.com"],[]],[["Date.now","noopFunc"],["drinksmixer.com","leitesculinaria.com"],[]],[["jQuery.adblock","1"],["fupa.net"],[]],[["isAdBlockActive","false"],["guidetnt.com"],[]],[["isAdBlockActive","false"],["sp-today.com"],[]],[["VMG.Components.Adblock","false"],["browardpalmbeach.com","dallasobserver.com","houstonpress.com","miaminewtimes.com","phoenixnewtimes.com","westword.com"],[]],[["check_adblock","true"],["masteranime.tv"],[]],[["blurred","false"],["linkjust.com"],[]],[["adblockDetector","trueFunc"],["nowtv.com.tr"],[]],[["hasPoped","true"],["caminspector.net","camwhoreshd.com","camgoddess.tv"],[]],[["flashvars.protect_block",""],["cwtvembeds.com"],[]],[["flashvars.video_click_url","undefined"],["cwtvembeds.com"],[]],[["jQuery.adblock","false"],["mediapason.it"],[]],[["blurred","false"],["leechpremium.link"],[]],[["google_jobrunner","true"],["jeshoots.com"],[]],[["blurred","false"],["icutlink.com"],[]],[["sec","0"],["icutlink.com"],[]],[["blurred","false"],["oncehelp.com"],[]],[["ads","true"],["gamezhero.com"],[]],[["gadb","false"],["flashplayer.fullstacks.net"],[]],[["checkadBlock","noopFunc"],["temp-mail.org"],[]],[["jQuery.adblock","false"],["linkspaid.com"],[]],[["cmnnrunads","true"],["comnuan.com"],[]],[["showAds","true"],["a-o.ninja","anime-odcinki.pl"],[]],[["adBlocker","false"],["veedi.com"],[]],[["adblock","false"],["goltelevision.com"],[]],[["StileApp.somecontrols.adBlockDetected","noopFunc"],["stiletv.it"],[]],[["google_tag_data","noopFunc"],["hqtv.biz"],[]],[["noAdBlock","true"],["liveuamap.com"],[]],[["adsOk","true"],["audycje.tokfm.pl"],[]],[["blurred","false"],["rgl.vn"],[]],[["blurred","false"],["reqlinks.net"],[]],[["check","true"],["shush.se"],[]],[["isal","true"],["allkpop.com"],[]],[["document.hidden","true"],["za.gl"],[]],[["blurred","false"],["bitlk.com"],[]],[["awm","true"],["pickcrackpasswords.blogspot.com"],[]],[["blurred","false"],["qlinks.eu"],[]],[["blurred","false"],["link.3dmili.com"],[]],[["adblockEnabled","false"],["kfrfansub.com"],[]],[["is_adblocked","false"],["illicoporno.com"],[]],[["blurred","false"],["short-fly.com"],[]],[["pogo.intermission.staticAdIntermissionPeriod","0"],["pogo.com"],[]],[["SubmitDownload1","noopFunc"],["cloudvideo.tv"],[]],[["t","0"],["legionjuegos.org","legionpeliculas.org","legionprogramas.org"],[]],[["blurred","false"],["foxseotools.com"],[]],[["ckaduMobilePop","noopFunc"],["16honeys.com"],[]],[["tieneAdblock","0"],["elespanol.com"],[]],[["adsAreBlocked","false"],["remodelista.com"],[]],[["adblock","false"],["news-und-nachrichten.de"],[]],[["Math.pow","noopFunc"],["audiofanzine.com"],[]],[["runAdBlocker","false"],["developerinsider.co"],[]],[["blurred","false"],["link.turkdown.com"],[]],[["Adblock","false"],["thehindu.com"],[]],[["flashvars.logo_url",""],["cambro.tv"],[]],[["flashvars.logo_text",""],["cambro.tv"],[]],[["nlf.custom.userCapabilities","false"],["nibelungen-kurier.de"],[]],[["adblock","false"],["laradiobbs.net"],[]],[["count","0"],["adfoc.us"],[]],[["LoadThisScript","true"],["pianetamountainbike.it"],[]],[["is_adblocked","false"],["lavoixdux.com"],[]],[["showPremLite","true"],["barchart.com"],[]],[["closeBlockerModal","false"],["modelisme.com","parasportontario.ca","prescottenews.com"],[]],[["adblock","false"],["urlaubspartner.net"],[]],[["CnnXt.Event.fire","noopFunc"],["bostonherald.com"],[]],[["adBlockDetector.isEnabled","falseFunc"],["nrj-play.fr"],[]],[["areAdsDisplayed","true"],["hackingwithreact.com"],[]],[["gkAdsWerbung","true"],["gutekueche.at"],[]],[["pop_target","null"],["peekvids.com","playvids.com","pornflip.com"],[]],[["adblockEnabled","false"],["thuglink.com"],[]],[["is_banner","true"],["redensarten-index.de"],[]],[["adblock","false"],["produktion.de"],[]],[["$easyadvtblock","false"],["vw-page.com"],[]],[["CnnXt.Event.fire","noopFunc"],["dailycamera.com"],[]],[["blurred","false"],["fc.lc"],[]],[["is_adblocked","false"],["tonpornodujour.com"],[]],[["show_dfp_preroll","false"],["viz.com"],[]],[["show_youtube_preroll","false"],["viz.com"],[]],[["blurred","false"],["fstore.biz"],[]],[["doads","true"],["0rechner.de"],[]],[["jsUnda","noopFunc"],["configspc.com"],[]],[["CnnXt.Event.fire","noopFunc"],["sbsun.com"],[]],[["jQuery.adblock","false"],["tuotromedico.com"],[]],[["AlobaidiDetectAdBlock","true"],["japgay.com"],[]],[["Advertisement","1"],["mega-debrid.eu"],[]],[["adBlockDetected","false"],["dreamdth.com"],[]],[["pr_okvalida","true"],["diaridegirona.cat","diariodeibiza.es","diariodemallorca.es","diarioinformacion.com","eldia.es","emporda.info","farodevigo.es","laopinioncoruna.es","laopiniondemalaga.es","laopiniondemurcia.es","laopiniondezamora.es","laprovincia.es","levante-emv.com","mallorcazeitung.es","regio7.cat","superdeporte.es"],[]],[["$.ajax","trueFunc"],["playpaste.com"],[]],[["CnnXt.Event.fire","noopFunc"],["dailydemocrat.com","montereyherald.com","orovillemr.com","record-bee.com","redbluffdailynews.com","reporterherald.com","thereporter.com","timescall.com","timesheraldonline.com","ukiahdailyjournal.com"],[]],[["google_jobrunner","true"],["techhx.com"],[]],[["CnnXt.Event.fire","noopFunc"],["dailylocal.com"],[]],[["cnbc.canShowAds","true"],["cnbc.com"],[]],[["firefaucet","true"],["firefaucet.win"],[]],[["flashvars.adv_pre_vast",""],["smutr.com"],[]],[["flashvars.popunder_url","undefined"],["smutr.com"],[]],[["blockAdBlock","true"],["techperiod.com"],[]],[["blurred","false"],["cuts-url.com","eio.io","exe.app"],[]],[["blurred","false"],["exey.io"],[]],[["blurred","false"],["exeo.app"],[]],[["flashvars.adv_pause_html",""],["bravoerotica.net"],[]],[["flashvars.adv_start_html",""],["bravoerotica.net"],[]],[["adv","true"],["fullhdxxx.com"],[]],[["prerollMain","undefined"],["pornclassic.tube","tubepornclassic.com"],[]],[["ads","true"],["flashgirlgames.com","onlinesudoku.games"],[]],[["canRunAds","true"],["etonline.com"],[]],[["Fingerprint2","true"],["coinlyhub.com"],[]],[["blurred","false"],["coinlyhub.com"],[]],[["blurred","false"],["adsafelink.com"],[]],[["blurred","false"],["aii.sh"],[]],[["dclm_ajax_var.disclaimer_redirect_url",""],["home-made-videos.com"],[]],[["ads","true"],["mpg.football"],[]],[["gadb","false"],["cloudapps.herokuapp.com"],[]],[["adBlockDetected","true"],["produsat.com"],[]],[["jQuery.adblock","false"],["neoteo.com"],[]],[["blockAdBlock","trueFunc"],["12thman.com","acusports.com","atlantic10.com","auburntigers.com","baylorbears.com","bceagles.com","bgsufalcons.com","big12sports.com","bigten.org","bradleybraves.com","butlersports.com","cmumavericks.com","conferenceusa.com","cyclones.com","dartmouthsports.com","daytonflyers.com","dbupatriots.com","dbusports.com","denverpioneers.com","fduknights.com","fgcuathletics.com","fightinghawks.com","fightingillini.com","floridagators.com","friars.com","friscofighters.com","gamecocksonline.com","goarmywestpoint.com","gobison.com","goblueraiders.com","gobobcats.com","gocards.com","gocreighton.com","godeacs.com","goexplorers.com","goetbutigers.com","gofrogs.com","gogriffs.com","gogriz.com","golobos.com","gomarquette.com","gopack.com","gophersports.com","goprincetontigers.com","gopsusports.com","goracers.com","goshockers.com","goterriers.com","gotigersgo.com","gousfbulls.com","govandals.com","gowyo.com","goxavier.com","gozags.com","gozips.com","griffinathletics.com","guhoyas.com","gwusports.com","hailstate.com","hamptonpirates.com","hawaiiathletics.com","hokiesports.com","huskers.com","icgaels.com","iuhoosiers.com","jsugamecocksports.com","longbeachstate.com","loyolaramblers.com","lrtrojans.com","lsusports.net","morrisvillemustangs.com","msuspartans.com","muleriderathletics.com","mutigers.com","navysports.com","nevadawolfpack.com","niuhuskies.com","nkunorse.com","nuhuskies.com","nusports.com","okstate.com","olemisssports.com","omavs.com","ovcsports.com","owlsports.com","purduesports.com","redstormsports.com","richmondspiders.com","sfajacks.com","shupirates.com","siusalukis.com","smcgaels.com","smumustangs.com","soconsports.com","soonersports.com","themw.com","tulsahurricane.com","txst.com","txstatebobcats.com","ubbulls.com","ucfknights.com","ucirvinesports.com","uconnhuskies.com","uhcougars.com","uicflames.com","umterps.com","uncwsports.com","unipanthers.com","unlvrebels.com","uoflsports.com","usdtoreros.com","utahstateaggies.com","utepathletics.com","utrockets.com","uvmathletics.com","uwbadgers.com","villanova.com","wkusports.com","wmubroncos.com","woffordterriers.com","1pack1goal.com","bcuathletics.com","bubraves.com","goblackbears.com","golightsgo.com","gomcpanthers.com","goutsa.com","mercerbears.com","pirateblue.com","pirateblue.net","pirateblue.org","quinnipiacbobcats.com","towsontigers.com","tribeathletics.com","tribeclub.com","utepminermaniacs.com","utepminers.com","wkutickets.com","aopathletics.org","atlantichockeyonline.com","bigsouthnetwork.com","bigsouthsports.com","chawomenshockey.com","dbupatriots.org","drakerelays.org","ecac.org","ecacsports.com","emueagles.com","emugameday.com","gculopes.com","godrakebulldog.com","godrakebulldogs.com","godrakebulldogs.net","goeags.com","goislander.com","goislanders.com","gojacks.com","gomacsports.com","gseagles.com","hubison.com","iowaconference.com","ksuowls.com","lonestarconference.org","mascac.org","midwestconference.org","mountaineast.org","niu-pack.com","niuhuskies.com","nulakers.ca","oswegolakers.com","ovcdigitalnetwork.com","pacersports.com","rmacsports.org","rollrivers.com","samfordsports.com","uncpbraves.com","usfdons.com","wiacsports.com","alaskananooks.com","broncathleticfund.com","cameronaggies.com","columbiacougars.com","etownbluejays.com","gobadgers.ca","golancers.ca","gometrostate.com","gothunderbirds.ca","kentstatesports.com","lehighsports.com","lopers.com","lycoathletics.com","lycomingathletics.com","maraudersports.com","mauiinvitational.com","msumavericks.com","nauathletics.com","nueagles.com","nwusports.com","oceanbreezenyc.org","patriotathleticfund.com","pittband.com","principiaathletics.com","roadrunnersathletics.com","sidearmsocial.com","snhupenmen.com","stablerarena.com","stoutbluedevils.com","uwlathletics.com","yumacs.com","collegefootballplayoff.com","csurams.com","cubuffs.com","gobearcats.com","gohuskies.com","mgoblue.com","osubeavers.com","pittsburghpanthers.com","rolltide.com","texassports.com","thesundevils.com","uclabruins.com","wvuathletics.com","wvusports.com","arizonawildcats.com","calbears.com","cuse.com","georgiadogs.com","goducks.com","goheels.com","gostanford.com","insidekstatesports.com","insidekstatesports.info","insidekstatesports.net","insidekstatesports.org","k-stateathletics.com","k-statefootball.net","k-statefootball.org","k-statesports.com","k-statesports.net","k-statesports.org","k-statewomenshoops.com","k-statewomenshoops.net","k-statewomenshoops.org","kstateathletics.com","kstatefootball.net","kstatefootball.org","kstatesports.com","kstatewomenshoops.com","kstatewomenshoops.net","kstatewomenshoops.org","ksuathletics.com","ksusports.com","scarletknights.com","showdownforrelief.com","syracusecrunch.com","texastech.com","theacc.com","ukathletics.com","usctrojans.com","utahutes.com","utsports.com","wsucougars.com"],[]],[["google_jobrunner","true"],["karanapk.com"],[]],[["ezstandalone.enabled","true"],["fangraphs.com"],[]],[["jQuery.adblock","false"],["phoneswiki.com"],[]],[["foundation.adPlayer.bitmovin","{}"],["stern.de","geo.de","brigitte.de","schoener-wohnen.de"],[]],[["weltConfig.switches.videoAdBlockBlocker","false"],["welt.de"],[]],[["window.__gv_org_tfa","undefined"],["tvspielfilm.de","tvtoday.de","chip.de","focus.de","fitforfun.de"],[]],[["getHomadConfig","noopFunc"],["player.rtl2.de"],[]],[["adblock","false"],["cinemaxxl.de"],[]],[["showAds","true"],["shortgoo.blogspot.com"],[]],[["ab","false"],["planetaminecraft.com"],[]],[["blurred","false"],["cybertechng.com"],[]],[["go_popup","{}"],["cybertechng.com"],[]],[["adblockEnabled","false"],["voipreview.org"],[]],[["noBlocker","true"],["lapresse.ca"],[]],[["adsbygoogle","null"],["kolyoom.com"],[]],[["jQuery.adblock","false"],["celebmix.com"],[]],[["jQuery.adblock","false"],["myneobuxportal.com"],[]],[["fabActive","false"],["negumo.com"],[]],[["gWkbAdVert","true"],["games.wkb.jp"],[]],[["noblock","true"],["games.wkb.jp"],[]],[["jsUnda","noopFunc"],["uptobox.com","uptostream.com"],[]],[["adblock","false"],["bladesalvador.com"],[]],[["is_adblocked","false"],["jacquieetmichel.net"],[]],[["adBlockDetected","noopFunc"],["fruitlab.com"],[]],[["adBlockEnabled","false"],["stream.nbcsports.com"],[]],[["detectAdblock","noopFunc"],["hausbau-forum.de"],[]],[["adsLoadable","true"],["fake-it.ws"],[]],[["blurred","false"],["cutdl.xyz"],[]],[["ASSetCookieAds","null"],["laksa19.github.io"],[]],[["letShowAds","true"],["1shortlink.com"],[]],[["ulp_noadb","true"],["u-s-news.com"],[]],[["Object.prototype.adblock_detected","false"],["luscious.net"],[]],[["blurred","false"],["iir.ai"],[]],[["blockAdBlock","trueFunc"],["vidlii.com"],[]],[["adsbygoogle.loaded","true"],["vidlii.com"],[]],[["xxSetting.adBlockerDetection","false"],["cdn77.org"],[]],[["blurred","false"],["shorteet.com"],[]],[["open","undefined"],["shorteet.com"],[]],[["Drupal.behaviors.adBlockerPopup","null"],["ujszo.com"],[]],[["fake_ad","true"],["newsmax.com"],[]],[["jQuery.adblock","false"],["oyungibi.com"],[]],[["adblock","false"],["tempr.email"],[]],[["koddostu_com_adblock_yok","null"],["nadidetarifler.com"],[]],[["adsbygoogle","trueFunc"],["suzylu.co.uk"],[]],[["player.ads.cuePoints","undefined"],["suzylu.co.uk"],[]],[["adBlockDetected","null"],["onworks.net"],[]],[["adsEnabled","true"],["freep.com"],[]],[["better_ads_adblock","1"],["downloadsoft.net"],[]],[["Adv_ab","false"],["newsobserver.com"],[]],[["adBlock","false"],["sunbtc.space"],[]],[["blurred","false"],["smoner.com"],[]],[["sgpbCanRunAds","true"],["testlanguages.com"],[]],[["akamaiDisableServerIpLookup","noopFunc"],["br.de"],[]],[["Object.prototype.adService.initialize","noopFunc"],["calgaryherald.com","calgarysun.com","canada.com","canoe.com","driving.ca","edmontonjournal.com","edmontonsun.com","financialpost.com","leaderpost.com","lfpress.com","montrealgazette.com","nationalpost.com","ontariofarmer.com","ottawacitizen.com","ottawasun.com","thegrowthop.com","theprovince.com","thestarphoenix.com","tj.news","torontosun.com","vancouversun.com","windsorstar.com","winnipegsun.com"],[]],[["DD_RUM.addAction","noopFunc"],["indeed.com"],[]],[["nads.createAd","trueFunc"],["pasteboard.co"],[]],[["dvtag.getTargeting","trueFunc"],["bbc.com"],[]],[["ga","noopFunc"],["clickhole.com","deadspin.com","gizmodo.com","jalopnik.com","jezebel.com","kotaku.com","lifehacker.com","splinternews.com","theinventory.com","theonion.com","theroot.com","thetakeout.com"],[]],[["huecosPBS.nstdX","null"],["los40.com"],[]],[["DTM.trackAsyncPV","noopFunc"],["as.com","caracol.com.co","los40.com"],[]],[["_satellite","{}"],["telegraph.co.uk"],[]],[["_satellite.getVisitorId","noopFunc"],["telegraph.co.uk"],[]],[["newPageViewSpeedtest","noopFunc"],["verizon.com"],[]],[["pubg.unload","noopFunc"],["humanbenchmark.com"],[]],[["generateGalleryAd","noopFunc"],["politico.com"],[]],[["mediator","noopFunc"],["officedepot.co.cr"],[]],[["Object.prototype.subscribe","noopFunc"],["officedepot.co.cr"],[]],[["Object.prototype.vjsPlayer.ads","noopFunc"],["usnews.com"],[]],[["network_user_id",""],["coolmathgames.com"],[]],[["ga","noopFunc"],["pewresearch.org"],[]],[["google.ima.OmidVerificationVendor","{}"],["video.gazzetta.it"],[]],[["Object.prototype.omidAccessModeRules","{}"],["video.gazzetta.it"],[]],[["googletag.cmd","{}"],["factable.com"],[]],[["_aps","{}"],["thedailybeast.com"],[]],[["Object.prototype.setDisableFlashAds","noopFunc"],["zee5.com"],[]],[["DD_RUM.addTiming","noopFunc"],["gala.fr","geo.fr","voici.fr"],[]],[["chameleonVideo.adDisabledRequested","true"],["gloucestershirelive.co.uk"],[]],[["AdmostClient","{}"],["arsiv.mackolik.com"],[]],[["analytics","{}"],["jacksonguitars.com"],[]],[["datalayer","[]"],["scandichotels.com"],[]],[["Object.prototype.isInitialLoadDisabled","noopFunc"],["stylist.co.uk"],[]],[["listingGoogleEETracking","noopFunc"],["nettiauto.com"],[]],[["dcsMultiTrack","noopFunc"],["thaiairways.com"],[]],[["urlStrArray","noopFunc"],["thaiairways.com"],[]],[["pa","{}"],["cerbahealthcare.it"],[]],[["Object.prototype.setConfigurations","noopFunc"],["cerbahealthcare.it"],[]],[["Object.prototype.bk_addPageCtx","noopFunc"],["tiendaenlinea.claro.com.ni"],[]],[["Object.prototype.bk_doJSTag","noopFunc"],["tiendaenlinea.claro.com.ni"],[]],[["passFingerPrint","noopFunc"],["tieba.baidu.com"],[]],[["optimizely","{}"],["fandom.com"],[]],[["optimizely.initialized","true"],["fandom.com"],[]],[["google_optimize","{}"],["grasshopper.com"],[]],[["google_optimize.get","noopFunc"],["grasshopper.com"],[]],[["_gsq","{}"],["epson.com.cn"],[]],[["_gsq.push","noopFunc"],["epson.com.cn"],[]],[["_gsDevice",""],["epson.com.cn"],[]],[["iom","{}"],["oe24.at"],[]],[["iom.c","noopFunc"],["oe24.at"],[]],[["_conv_q","{}"],["platform.autods.com"],[]],[["_conv_q.push","noopFunc"],["platform.autods.com"],[]],[["google.ima.settings.setDisableFlashAds","noopFunc"],["kcra.com","wcvb.com"],[]],[["pa","{}"],["futura-sciences.com"],[]],[["pa.privacy","{}"],["futura-sciences.com"],[]],[["populateClientData4RBA","noopFunc"],["citibank.com.sg"],[]],[["iom","{}"],["szbz.de"],[]],[["YT.ImaManager","noopFunc"],["uol.com.br"],[]],[["UOLPD","{}"],["uol.com.br"],[]],[["UOLPD.dataLayer","{}"],["uol.com.br"],[]],[["__configuredDFPTags","{}"],["uol.com.br"],[]],[["URL_VAST_YOUTUBE","{}"],["uol.com.br"],[]],[["Adman","{}"],["gazzetta.gr"],[]],[["dplus","{}"],["digicol.dpm.org.cn"],[]],[["dplus.track","noopFunc"],["digicol.dpm.org.cn"],[]],[["_satellite","{}"],["poweredbycovermore.com"],[]],[["_satellite.track","noopFunc"],["poweredbycovermore.com"],[]],[["google.ima.dai","{}"],["virginmediatelevision.ie"],[]],[["gfkS2sExtension","{}"],["larazon.es"],[]],[["gfkS2sExtension.HTML5VODExtension","noopFunc"],["larazon.es"],[]],[["AnalyticsEventTrackingJS","{}"],["waitrosecellar.com"],[]],[["AnalyticsEventTrackingJS.addToBasket","noopFunc"],["waitrosecellar.com"],[]],[["AnalyticsEventTrackingJS.trackErrorMessage","noopFunc"],["waitrosecellar.com"],[]],[["initializeslideshow","noopFunc"],["kicker.de"],[]],[["fathom","{}"],["sharpen-free-design-generator.netlify.app"],[]],[["fathom.trackGoal","noopFunc"],["sharpen-free-design-generator.netlify.app"],[]],[["Origami","{}"],["help.cashctrl.com"],[]],[["Origami.fastclick","noopFunc"],["help.cashctrl.com"],[]],[["jad","undefined"],["gry-online.pl"],[]],[["hasAdblocker","true"],["vidaextra.com"],[]],[["_satellite","{}"],["lumens.com"],[]],[["_satellite.track","noopFunc"],["lumens.com"],[]],[["Sentry","{}"],["commande.rhinov.pro"],[]],[["Sentry.init","noopFunc"],["commande.rhinov.pro"],[]],[["TRC","{}"],["tipranks.com"],[]],[["TRC._taboolaClone","[]"],["tipranks.com"],[]],[["fp","{}"],["iceland.co.uk"],[]],[["fp.t","noopFunc"],["iceland.co.uk"],[]],[["fp.s","noopFunc"],["iceland.co.uk"],[]],[["initializeNewRelic","noopFunc"],["socket.pearsoned.com"],[]],[["turnerAnalyticsObj","{}"],["tntdrama.com"],[]],[["turnerAnalyticsObj.setVideoObject4AnalyticsProperty","noopFunc"],["tntdrama.com"],[]],[["turnerAnalyticsObj.getVideoObject4AnalyticsProperty","noopFunc"],["tntdrama.com"],[]],[["Sentry","{}"],["ecom.wixapps.net"],[]],[["Sentry.init","noopFunc"],["ecom.wixapps.net"],[]],[["optimizelyDatafile","{}"],["mobile.de"],[]],[["optimizelyDatafile.featureFlags","[]"],["mobile.de"],[]],[["fingerprint","{}"],["ioe.vn"],[]],[["fingerprint.getCookie","noopFunc"],["ioe.vn"],[]],[["gform.utils","noopFunc"],["bikeportland.org"],[]],[["gform.utils.trigger","noopFunc"],["bikeportland.org"],[]],[["fingerprint","{}"],["geiriadur.ac.uk","welsh-dictionary.ac.uk"],[]],[["get_fingerprint","noopFunc"],["geiriadur.ac.uk","welsh-dictionary.ac.uk"],[]],[["moatPrebidApi","{}"],["10.com.au","10play.com.au"],[]],[["moatPrebidApi.getMoatTargetingForPage","noopFunc"],["10.com.au","10play.com.au"],[]],[["cpd_configdata","{}"],["sunshine-live.de"],[]],[["cpd_configdata.url",""],["sunshine-live.de"],[]],[["yieldlove_cmd","{}"],["whatismyip.com"],[]],[["yieldlove_cmd.push","noopFunc"],["whatismyip.com"],[]],[["dataLayer.push","noopFunc"],["myfitnesspal.com"],[]],[["_etmc","{}"],["netoff.co.jp"],[]],[["_etmc.push","noopFunc"],["netoff.co.jp"],[]],[["ShowRewards","noopFunc"],["clickjogos.com.br"],[]],[["stLight","{}"],["bristan.com"],[]],[["stLight.options","noopFunc"],["bristan.com"],[]],[["DD_RUM.addError","noopFunc"],["zillow.com"],[]],[["DD_RUM.addAction","noopFunc"],["zillow.com"],[]],[["sensorsDataAnalytic201505","{}"],["share.hntv.tv"],[]],[["sensorsDataAnalytic201505.init","noopFunc"],["share.hntv.tv"],[]],[["sensorsDataAnalytic201505.quick","noopFunc"],["share.hntv.tv"],[]],[["sensorsDataAnalytic201505.track","noopFunc"],["share.hntv.tv"],[]],[["s","{}"],["optimum.net"],[]],[["s.tl","noopFunc"],["optimum.net"],[]],[["smartech","noopFunc"],["hdfcfund.com"],[]],[["sensors","{}"],["user.guancha.cn"],[]],[["sensors.init","noopFunc"],["user.guancha.cn"],[]],[["sensors.track","noopFunc"],["sosovalue.com"],[]],[["adn","{}"],["bandyforbundet.no"],[]],[["adn.clearDivs","noopFunc"],["bandyforbundet.no"],[]],[["_vwo_code","{}"],["tatacommunications.com"],[]],[["gtag","noopFunc"],["suamusica.com.br"],[]],[["_taboola","{}"],["suamusica.com.br"],[]],[["_taboola.push","noopFunc"],["suamusica.com.br"],[]],[["sensorsDataAnalytic201505","{}"],["forum.dji.com"],[]],[["sensorsDataAnalytic201505.track","noopFunc"],["forum.dji.com"],[]],[["clicky","{}"],["macrotrends.net"],[]],[["clicky.goal","noopFunc"],["macrotrends.net"],[]],[["WURFL","{}"],["code.world"],[]],[["_sp_.config.events.onSPPMObjectReady","noopFunc"],["topgear.com"],[]],[["gtm","{}"],["eservice.directauto.com"],[]],[["gtm.trackEvent","noopFunc"],["eservice.directauto.com"],[]],[["mParticle.Identity.getCurrentUser","noopFunc"],["nbcsports.com"],[]],[["sensorsDataAnalytic201505","{}"],["unionpayintl.com"],[]],[["sensorsDataAnalytic201505.quick","noopFunc"],["unionpayintl.com"],[]],[["JSGlobals.prebidEnabled","false"],["standard.co.uk"],[]],[["elasticApm","{}"],["pruefernavi.de"],[]],[["elasticApm.init","noopFunc"],["pruefernavi.de"],[]],[["ga.sendGaEvent","noopFunc"],["17track.net"],[]],[["WURFL","{}"],["smartcharts.net"],[]],[["turnerAnalyticsObj","{}"],["trutv.com"],[]],[["turnerAnalyticsObj.setVideoObject4AnalyticsProperty","noopFunc"],["trutv.com"],[]],[["pa","{}"],["toureiffel.paris"],[]],[["adobe","{}"],["visible.com"],[]],[["MT","{}"],["hagerty.com"],[]],[["MT.track","noopFunc"],["hagerty.com"],[]],[["ClickOmniPartner","noopFunc"],["marketplace.nvidia.com"],[]],[["adex","{}"],["kino.de"],[]],[["adex.getAdexUser","noopFunc"],["kino.de"],[]],[["Adkit","noopFunc"],["9now.nine.com.au"],[]],[["Object.prototype.shouldExpectGoogleCMP","false"],["worldstar.com"],[]],[["apntag.refresh","noopFunc"],["prisjakt.no"],[]],[["pa","{}"],["campusfrance.org"],[]],[["pa.sendEvent","noopFunc"],["campusfrance.org"],[]],[["_etmc","{}"],["bluerabbitrx.com"],[]],[["_etmc.push","noopFunc"],["bluerabbitrx.com"],[]],[["Munchkin","{}"],["developer.arm.com"],[]],[["Munchkin.init","noopFunc"],["developer.arm.com"],[]],[["ttd_dom_ready","noopFunc"],["sterkinekor.com"],[]],[["ramp","undefined"],["iogames.space"],[]],[["appInfo.snowplow.trackSelfDescribingEvent","noopFunc"],["id.condenast.com"],[]],[["_vwo_code","{}"],["kb.arlo.com"],[]],[["_vwo_code.init","noopFunc"],["kb.arlo.com"],[]],[["adobePageView","noopFunc"],["tires.costco.com"],[]],[["adobeSearchBox","noopFunc"],["tires.costco.com"],[]],[["dapTracker","{}"],["livemint.com"],[]],[["dapTracker.track","noopFunc"],["livemint.com"],[]],[["newrelic","{}"],["login.asda.com"],[]],[["newrelic.setCustomAttribute","noopFunc"],["login.asda.com"],[]],[["adobePageView","noopFunc"],["tires.costco.ca"],[]],[["adobeDataLayer","{}"],["mandai.com"],[]],[["adobeDataLayer.push","noopFunc"],["mandai.com"],[]],[["Object.prototype._adsDisabled","true"],["damndelicious.net"],[]],[["utag","{}"],["brother-usa.com"],[]],[["utag.link","noopFunc"],["brother-usa.com"],[]],[["_satellite.kpCustomEvent","noopFunc"],["choose.kaiserpermanente.org"],[]],[["Object.prototype.disablecommercials","true"],["tekniikanmaailma.fi"],[]],[["Object.prototype._autoPlayOnlyWithPrerollAd","false"],["tekniikanmaailma.fi"],[]],[["Sentry","{}"],["prod.hydra.sophos.com"],[]],[["Sentry.addBreadcrumb","noopFunc"],["prod.hydra.sophos.com"],[]],[["freestar.newAdSlots","trueFunc"],["personality-database.com"],[]],[["String.prototype.allReplace","1"],["thegatewaypundit.com"],[]],[["executaGoogleAnalytics3","noopFunc"],["ebc.com.br"],[]],[["initJWPlayerMux","{}"],["conceptoweb-studio.com"],[]],[["initJWPlayerMux.utils","{}"],["conceptoweb-studio.com"],[]],[["initJWPlayerMux.utils.now","noopFunc"],["conceptoweb-studio.com"],[]],[["ambossAnalytics","{}"],["amboss.com"],[]],[["ambossAnalytics.getUserAttribution","noopFunc"],["amboss.com"],[]],[["Osano","{}"],["account.bhvr.com"],[]],[["Osano.cm","{}"],["account.bhvr.com"],[]],[["Osano.cm.addEventListener","noopFunc"],["account.bhvr.com"],[]],[["Osano.cm.removeEventListener","noopFunc"],["account.bhvr.com"],[]],[["pa","{}"],["hikvision.com"],[]],[["pa.getVisitorId","noopFunc"],["hikvision.com"],[]],[["pa.sendEvent","noopFunc"],["hikvision.com"],[]],[["googletag.setConfig","noopFunc"],["trustnet.com"],[]],[["RISKX","{}"],["book.trivago.com"],[]],[["RISKX.go","noopFunc"],["book.trivago.com"],[]],[["RISKX.setSid","noopFunc"],["book.trivago.com"],[]],[["Sentry","{}"],["ds.163.com"],[]],[["Sentry.init","noopFunc"],["ds.163.com"],[]],[["Sentry.configureScope","noopFunc"],["ds.163.com"],[]],[["baMet.register","noopFunc"],["ridge.com"],[]],[["Object.prototype.componentInScreen","noopFunc"],["hktvmall.com"],[]],[["_uxa","{}"],["northeast.aaa.com"],[]],[["_uxa.push","noopFunc"],["northeast.aaa.com"],[]],[["Sentry","{}"],["roaringapps.com"],[]],[["Sentry.onLoad","noopFunc"],["roaringapps.com"],[]]];
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
