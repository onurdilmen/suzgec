/* Süzgeç scriptlet: ubo-nostif — generated, do not edit */
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
  const NAME = "ubo-nostif";
  const ENTRIES = [[["adb"],["m.timesofindia.com","timesofindia.indiatimes.com"],[]],[["adBlockerDetected"],["golem.de"],[]],[["show"],["golem.de"],[]],[["InfMediafireMobileFunc","1000"],["mediafire.com"],[]],[["apstagLOADED"],["seattletimes.com"],[]],[["/Adb|moneyDetect/"],["bestgames.com","yiv.com"],[]],[["disableDeveloper"],["globalrph.com"],[]],[["Blocco","2000"],["e-glossa.it"],[]],[["tick","1000"],["pussyspace.com","pussyspace.net"],[]],[["test","0"],["webcheats.com.br"],[]],[["checkPub","6000"],["gala.fr","gentside.com","geo.fr","hbrfrance.fr","nationalgeographic.fr","ohmymag.com","serengo.net","vsd.fr"],[]],[["'0x"],["short.pe"],[]],[["document.querySelector","5000"],["updato.com"],[]],[["document.querySelectorAll","1000"],["nudecelebforum.com"],[]],[["style"],["pronpic.org"],[]],[["clientHeight"],["thewebflash.com"],[]],[["addEventListener","0"],["popularmechanics.com"],[]],[["nextFunction","2000"],["comunidadgzone.es"],[]],[["byepopup","5000"],["jellynote.com"],[]],[["additional_src","300"],["eporner.com"],[]],[["()","2000"],["pornbimbo.com"],[]],[["css_class.show"],["avoiderrors.com"],[]],[["/adbl/i"],["slate.com"],[]],[["CANG","3000"],["hdmotori.it"],[]],[["updato-overlay","500"],["updato.com"],[]],[["css_class"],["satcesc.com"],[]],[["show"],["hdbox.ws"],[]],[["()","50"],["lusthero.com"],[]],[["adb"],["youmath.it"],[]],[["show"],["todopolicia.com"],[]],[["initializeCourier","3000"],["dallasnews.com"],[]],[["redirectPage"],["lnk.news","lnk.parts"],[]],[["_0x","2000"],["efukt.com"],[]],[["ads","750"],["springfieldspringfield.co.uk"],[]],[["nextFunction","2000"],["mp3fy.com"],[]],[["nextFunction","2000"],["lebensmittelpraxis.de"],[]],[["location.href","500"],["porndoe.com"],[]],[["Adblock","5000"],["smsget.net"],[]],[["disable","200"],["smsget.net"],[]],[["CekAab","0"],["kjanime.net"],[]],[["rbm_block_active","1000"],["gioialive.it"],[]],[["innerText","2000"],["femdomtb.com"],[]],[["show()"],["classicreload.com"],[]],[["_0x"],["hotpornfile.org"],[]],[["n.trigger","1"],["chicoer.com"],[]],[["adblock"],["maxcheaters.com"],[]],[["abDetected"],["sportsplays.com"],[]],[["$"],["ebookdz.com"],[]],[["location.href"],["pornvideotop.com"],[]],[["adb","0"],["letribunaldunet.fr"],[]],[["adBlocked"],["live-tv-channels.org"],[]],[["warning","100"],["eslfast.com"],[]],[["adsbygoogle"],["ge-map-overlays.appspot.com"],[]],[["adblock_popup","500"],["freegamescasual.com"],[]],[["Adblock"],["tcpvpn.com"],[]],[["location.href","10000"],["tsubasa.im"],[]],[["keep-ads","2000"],["sholah.net","2rdroid.com"],[]],[["#rbm_block_active","1000"],["bisceglielive.it"],[]],[["google_jobrunner"],["openspeedtest.com"],[]],[["google_jobrunner"],["addtobucketlist.com"],[]],[["google_jobrunner"],["3dzip.org"],[]],[["null","4000"],["3dzip.org"],[]],[["show"],["scat.gold"],[]],[["()","2500"],["pandajogosgratis.com.br"],[]],[["myaabpfun","3000"],["5278.cc"],[]],[["()","15000"],["tonspion.de"],[]],[["showPopup"],["duplichecker.com","plagiarismchecker.co","plagiarismdetector.net","searchenginereports.net"],[]],[["adrecover"],["smallseotools.com"],[]],[["()","1000"],["linkspaid.com"],[]],[["()","2000"],["4j.com"],[]],[["document.cookie","2500"],["beeimg.com"],[]],[["window.open"],["beeimg.com"],[]],[["innerHTML"],["ftlauderdalebeachcam.com","ftlauderdalewebcam.com","juneauharborwebcam.com","keywestharborwebcam.com","kittycatcam.com","mahobeachcam.com","miamiairportcam.com","morganhillwebcam.com","njwildlifecam.com","nyharborwebcam.com","paradiseislandcam.com","pompanobeachcam.com","portbermudawebcam.com","portcanaveralwebcam.com","portevergladeswebcam.com","portmiamiwebcam.com","portnywebcam.com","portnassauwebcam.com","portstmaartenwebcam.com","portstthomaswebcam.com","porttampawebcam.com","sxmislandcam.com"],[]],[["show"],["freecoursesite.com"],[]],[["/innerHTML|AdBlock/"],["gearingcommander.com"],[]],[["checkStopBlock"],["generate.plus"],[]],[["adspot_top","1500"],["avcesar.com"],[]],[["()","1000"],["proxydocker.com"],[]],[["/offsetHeight|google|Global/"],["audiotag.info"],[]],[["an_message","500"],["tudigitale.it"],[]],[["Adblocker","10000"],["ibcomputing.com"],[]],[["timeoutChecker"],["legia.net"],[]],[["nextFunction","250"],["daizurin.com"],[]],[["bait","1"],["acapellas4u.co.uk"],[]],[["ai_adb"],["robloxscripts.com"],[]],[["checkStopBlock"],["calculate.plus"],[]],[["_0x"],["coolsoft.altervista.org"],[]],[["displayCookieWallBanner"],["gamekult.com"],[]],[["pum-open"],["streamhentaimovies.com"],[]],[["overlay","2000"],["konten.co.id"],[]],[["/adblock/i"],["diariodenavarra.es"],[]],[["Math.round","1000"],["optifine.net"],[]],[["adblock","5"],["luzernerzeitung.ch","tagblatt.ch"],[]],[["ag_adBlockerDetected"],["ableitungsrechner.net"],[]],[["n.trigger","1"],["bostonherald.com"],[]],[["null"],["alternet.org"],[]],[["nextFunction","2000"],["praxis-jugendarbeit.de"],[]],[["nextFunction","250"],["pendekarsubs.us"],[]],[["adb"],["redensarten-index.de"],[]],[["adb","6000"],["shrib.com"],[]],[["n.trigger","1"],["dailycamera.com"],[]],[["brave_load_popup"],["freecourseweb.com"],[]],[["show"],["windowcleaningforums.co.uk"],[]],[["adb"],["lesoir.be"],[]],[["adb","0"],["vladan.fr"],[]],[["nextFunction","250"],["dreamfancy.org"],[]],[["ipod"],["lne.es"],[]],[["offsetWidth"],["pornult.com"],[]],[["nextFunction","2000"],["dictionnaire-medical.net"],[]],[["/$|adBlock/"],["proplanta.de"],[]],[["adsbygoogle"],["mad4wheels.com"],[]],[["()"],["textograto.com"],[]],[["_0x"],["hackedonlinegames.com"],[]],[["nextFunction","2000"],["cle0desktop.blogspot.com"],[]],[["AdBlock"],["voyageforum.com"],[]],[["stop-scrolling"],["prad.de"],[]],[["Adv"],["chatta.it"],[]],[["nextFunction","2000"],["up-load.io"],[]],[["blockUI","2000"],["ketubanjiwa.com"],[]],[["mdpDeBlocker"],["nsfw247.to"],[]],[["/_0x|debug/"],["extremereportbot.com"],[]],[["show"],["cruisingearth.com"],[]],[["/ai_adb|_0x/"],["getintopc.com"],[]],[["nextFunction","2000"],["keysbrasil.blogspot.com"],[]],[["adBlock"],["qoshe.com"],[]],[["","1"],["lowellsun.com"],[]],[["undefined"],["ultimate-catch.eu"],[]],[["check","1"],["cpopchanelofficial.com"],[]],[["nextFunction","2000"],["hotpress.info"],[]],[["adsBlocked"],["creditcardgenerator.com"],[]],[["adb"],["electriciansforums.net"],[]],[["nextFunction","2000"],["turkleech.com"],[]],[["nextFunction"],["hl-live.de"],[]],[["blocker"],["nilopolisonline.com.br"],[]],[["blocker"],["mesquitaonline.com"],[]],[["","1"],["mamadu.pl"],[]],[["afs_ads","2000"],["yaoiotaku.com"],[]],[["nextFunction","2000"],["anibatch.me"],[]],[["bait"],["moneyhouse.ch"],[]],[["getComputedStyle","250"],["ihow.info"],[]],[["{r()","0"],["agefi.fr"],[]],[["nextFunction","2000"],["anime-i.com"],[]],[["nextFunction","450"],["cariskuy.com"],[]],[["Debug"],["yusepjaelani.blogspot.com"],[]],[["r()","0"],["letras.mus.br"],[]],[["nextFunction","250"],["rysafe.blogspot.com"],[]],[["test","100"],["eletronicabr.com"],[]],[["","1"],["dobrapogoda24.pl"],[]],[["adb"],["keralatelecom.info"],[]],[["offsetWidth"],["webcamsdolls.com"],[]],[["purple_box"],["mtlurb.com"],[]],[["checkSiteNormalLoad"],["onemanhua.com"],[]],[["0x"],["laksa19.github.io"],[]],[["","1"],["motohigh.pl"],[]],[["Detected","500"],["allindiaroundup.com"],[]],[["mdp"],["tapchipi.com"],[]],[["modal"],["vectorizer.io"],[]],[[".show","1000"],["thefastlaneforum.com"],[]],[["afterOpen"],["5flix.top"],[]],[[".show"],["trade2win.com"],[]],[["adsBlocked"],["creditcardrush.com"],[]],[["samOverlay"],["turkmmo.com"],[]],[["native"],["acdriftingpro.com"],[]],[["bADBlock"],["palermotoday.it"],[]],[["clientHeight"],["discordfastfood.com"],[]],[["location"],["thumpertalk.com"],[]],[["show"],["freegogpcgames.com"],[]],[["AdBlock"],["hmc-id.blogspot.com"],[]],[["alert"],["thelayoff.com"],[]],[["adsBlocked"],["bostoncommons.net"],[]],[["t()","0"],["dailymaverick.co.za"],[]],[["ads"],["ludigames.com"],[]],[["mdpDeBlocker"],["funzen.net"],[]],[["0x"],["javcl.com"],[]],[["adsBlocked"],["thejobsmovie.com"],[]],[["googleFC"],["lastampa.it"],[]]];
  const EXCEPTIONS = [[[".call(null)","10"],["job.mt.de","job.nw.de"]]];
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
