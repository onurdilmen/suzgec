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
  const ENTRIES = [[["jQuery","cookie"],["motherless.com"],[]],[["showAds"],["golem.de"],[]],[["open"],["skidrowreloaded.com"],[]],[["$","_sp_._networkListenerData"],["faz.net"],[]],[["$","window.open"],["dailyuploads.net"],[]],[["$","samInitDetection"],["androidrepublic.org"],[]],[["$","lobster"],["wetter.com"],[]],[["$","AdBlocker"],["zonebourse.com"],[]],[["addEventListener","displayMessage"],["aofsoru.com"],[]],[["jQuery","TestAdBlock"],["imgdrive.net","imgwallet.com"],[]],[["document.getElementById","document.write"],["imgadult.com","imgdrive.net","imgtaxi.com","imgwallet.com"],[]],[["onload","open"],["alrincon.com"],[]],[["$","Adblock"],["vortez.net"],[]],[["ExoLoader"],["pornxs.com"],[]],[["puShown","/doOpen|popundr/"],["mangoporn.net"],[]],[["$","serve"],["ah-me.com"],[]],[["document.createElement","script"],["realgfporn.com"],[]],[["$","ltvModal"],["luxuretv.com"],[]],[["ExoLoader"],["hentaipulse.com"],[]],[["$","window.open"],["nitroflare.com"],[]],[["pop3","window.open"],["nitroflare.com"],[]],[["jQuery","ready"],["planetsuzy.org"],[]],[["setTimeout","1000"],["onlinetv.planetfools.com"],[]],[["ExoLoader"],["newsextv.com"],[]],[["ExoLoader"],["anyporn.com"],[]],[["decodeURI","decodeURIComponent"],["cpmlink.net"],[]],[["ExoLoader"],["eroprofile.com"],[]],[["__ADX_URL_U"],["feet9.com"],[]],[["atob","tabunder"],["short.pe"],[]],[["RegExp","POSTBACK_PIXEL"],["short.pe"],[]],[["document.getElementById","undefined"],["deepbrid.com"],[]],[["document.querySelectorAll","popMagic"],["hardcoreluv.com","pezporn.com"],[]],[["ab1","ab2"],["haxmaps.com"],[]],[["btoa","BOOTLOADER_LOADED"],["birdsandblooms.com","bombshellbling.com","dorkly.com","dryscalpgone.com","eclypsia.com","familyhandyman.com","gala.fr","gentlemansgazette.com","homeschoolgiveaways.com","hotbeautyhealth.com","ketoconnect.net","mom4real.com","mynaturalfamily.com","oneessentialcommunity.com","pageflutter.com","printablecrush.com","psychologyjunkie.com","skinnyms.com","skintagsgone.com","stayglam.com","tasteandtellblog.com","thecelticblog.com","thecozyapron.com","theendlessmeal.com","thehappierhomemaker.com","thelovenerds.com","yellowblissroad.com"],[]],[["awm","location"],["minecraftraffle.com"],[]],[["__ads"],["vintage-erotica-forum.com"],[]],[["setTimeout","____POP"],["vintage-erotica-forum.com"],[]],[["is_noadblock","window.location"],["siamfishing.com"],[]],[["$","AdBlockUtil"],["haaretz.co.il","haaretz.com"],[]],[["$","show"],["farmeramania.de"],[]],[["setTimeout","document.querySelector"],["mangafreak.me"],[]],[["jQuery","document.cookie"],["crazyshit.com"],[]],[["document.getElementById","adblock"],["anonymousemail.me"],[]],[["btoa"],["wkyc.com"],[]],[["$","blockAds"],["hotcopper.com.au"],[]],[["document.getElementById","try"],["youmath.it"],[]],[["atob","tabunder"],["coinfaucet.io"],[]],[["$","userAgent"],["nulledteam.com"],[]],[["decodeURI","decodeURIComponent"],["turbobit.net"],[]],[["document.getElementById","adblocker"],["nzbstars.com"],[]],[["azar","redirect"],["vixenless.com"],[]],[["$","azar"],["bestialitytaboo.tv","bestialitysextaboo.com","mujeresdesnudas.club"],[]],[["Math.floor","hilltop"],["hdbraze.com"],[]],[["document.createElement","script"],["fapdig.com"],[]],[["$","azar"],["videos1002.com"],[]],[["addEventListener","document.createElement"],["igg-games.com"],[]],[["readCookieDelit"],["camwhoresbay.com"],[]],[["atob","decodeURI"],["anon-v.com"],[]],[["onload"],["anon-v.com"],[]],[["atob","decodeURIComponent"],["fullywatchonline.com"],[]],[["$","html"],["dailyfreebits.com"],[]],[["__htapop"],["naughtymachinima.com"],[]],[["decodeURI","decodeURIComponent"],["xrares.com"],[]],[["document.getElementById","testadblock"],["undeniable.info"],[]],[["document.addEventListener","google_ad_client"],["klartext-ne.de"],[]],[["document.getElementById","overlayBtn"],["moviejones.de"],[]],[["document.getElementById","ads"],["tennisactu.net"],[]],[["String.fromCharCode","decodeURIComponent"],["thehiddenbay.com"],[]],[["$","adblockDetected"],["thurrott.com"],[]],[["atob","decodeURIComponent"],["converto.io"],[]],[["eval","replace"],["scrapywar.com"],[]],[["jQuery","AdBlock"],["andiim3.com"],[]],[["setTimeout","iframeTestTimeMS"],["kompas.com"],[]],[["setTimeout","runInIframe"],["namemc.com"],[]],[["Math.floor","iframeTestTimeMS"],["pockettactics.com"],[]],[["Math","='\\x"],["tribunnews.com"],[]],[["document.createElement","onerror"],["camgirlfap.com"],[]],[["jQuery","dismissAdBlock"],["vinylcollective.com"],[]],[["crakPopInParams"],["caminspector.net","camporn.tube","camwhorescloud.com","camwhorespy.com","camwhoria.com","camvideos.org"],[]],[["onload","onclick"],["caminspector.net","camporn.tube","camwhorescloud.com","camwhoreshd.com","camwhorespy.com","camvideos.org"],[]],[["document.getElementById","banner"],["guitarnick.com"],[]],[["document.getElementById","blocker_div"],["homebooster.de","newhome.de"],[]],[["document.getElementById","onscroll"],["porconocer.com"],[]],[["$","#DontBloxMyAdZ"],["scamalot.com"],[]],[["$","#pageWrapper"],["beautypackaging.com","coatingsworld.com","contractpharma.com","happi.com","inkworldmagazine.com","labelandnarrowweb.com","mpo-mag.com","nutraceuticalsworld.com","odtmag.com","printedelectronicsnow.com"],[]],[["$","banner"],["savevideo.me"],[]],[["document.getElementById","adpbtest"],["situsberita2terbaru.blogspot.com"],[]],[["$","initDetection"],["syracusefan.com"],[]],[["document.getElementById","alert"],["argio-logic.net"],[]],[["document.getElementById","undefined"],["appstore-discounts.com"],[]],[["addEventListener","nextFunction"],["4download.net"],[]],[["document.createElement","onerror"],["scat.gold"],[]],[["addEventListener","nextFunction"],["globalssh.net"],[]],[["onload"],["camgirlbay.net"],[]],[["$","adblock"],["sms-receive.net"],[]],[["$","gandalfads"],["3dprintersforum.co.uk"],[]],[["String.fromCharCode","atob"],["xpaja.net"],[]],[["document.getElementById","undefined"],["xianzhenyuan.cn"],[]],[["document.getElementsByTagName","script"],["mrdeepfakes.com"],[]],[["puShown","/doOpen|popundr/"],["celebritymovieblog.com"],[]],[["eval","replace"],["freecoursesite.com"],[]],[["puShown","/doOpen|popundr/"],["fuckundies.com"],[]],[["document.getElementById","undefined"],["k511.me"],[]],[["String.prototype.charCodeAt","tabunder"],["milfzr.com"],[]],[["$","adBlockChecker"],["wemakesites.net"],[]],[["document.createElement","script"],["pandamovies.pw"],[]],[["puShown","/doOpen|popundr/"],["pandamovies.pw"],[]],[["$","urlForPopup"],["alimaniacky.cz"],[]],[["document.getElementById","undefined"],["dozarte.com"],[]],[["document.addEventListener","click"],["za.gl"],[]],[["document.getElementById","overlay"],["za.gl"],[]],[["setInterval","location"],["za.gl"],[]],[["document.getElementById","undefined"],["getfreesmsnumber.com"],[]],[["decodeURI","decodeURIComponent"],["footballstream.tv","mlbstream.tv","nbastream.tv","nflstream.tv"],[]],[["decodeURI","decodeURIComponent"],["bdsmporn.cc","cocoporn.net","dirtyporn.cc","faperplace.com","freeadultvideos.cc","freepornstream.cc","generalpornmovies.com","kinkyporn.cc","moviesxxx.cc","movstube.net","onlinefetishporn.cc","peetube.cc","pornonline.cc","porntube18.cc","streamextreme.cc","streamporn.cc","videoxxx.cc","watchporn.cc","x24.video","xxxonline.cc","xxxonlinefree.com"],[]],[["$",".height"],["tvguia.es"],[]],[["document.documentElement","break;case $."],["6hiidude.gold"],[]],[["spr"],["hackstore.me"],[]],[["document.oncontextmenu"],["drivelinks.me","hackshort.me"],[]],[["document.onmousedown"],["drivelinks.me","hackshort.me"],[]],[["document.oncontextmenu"],["freeserverhostingweb.club","me-encantas.com","mexicogob.com","noticiascripto.site","tanfacil.net","tecnoaldia.net","todoandroid.live"],[]],[["document.onkeydown"],["freeserverhostingweb.club","me-encantas.com","mexicogob.com","noticiascripto.site","tanfacil.net","tecnoaldia.net","todoandroid.live"],[]],[["document.onmousedown"],["freeserverhostingweb.club","me-encantas.com","mexicogob.com","noticiascripto.site","tanfacil.net","tecnoaldia.net","todoandroid.live"],[]],[["setTimeout","admc"],["atomtt.com"],[]],[["atob","decodeURIComponent"],["skpb.live"],[]],[["document.cookie","setOCookie"],["urlgalleries.net"],[]],[["document.addEventListener","initBCPopunder"],["cambro.tv"],[]],[["document.getElementById","adblockinfo"],["dz4up1.com"],[]],[["atob","encodeURIComponent"],["ciudadgamer.com"],[]],[["JSON","_0x"],["ovagames.com"],[]],[["document.createElement","onerror"],["fr.streamon-sport.ru","hoca4u.com"],[]],[["$","adblocker"],["go.bucketforms.com"],[]],[["document.createElement","document.head.appendChild"],["mz-web.de"],[]],[["setTimeout","bait.css"],["m.kuku.lu"],[]],[["document.createElement","script"],["watchfreexxx.net"],[]],[["RegExp","'0x"],["macrotrends.net"],[]],[["document.createElement","__esModule"],["lippycorn.com"],[]],[["Math","break"],["720pxmovies.blogspot.com"],[]],[["document.getElementById","alert"],["typinggames.zone"],[]],[["document.getElementById","adblock"],["auto-data.net"],[]],[["document.createElement","l.parentNode.insertBefore(s"],["imgdawgknuttz.com"],[]],[["document.getElementById","block"],["ratemyteachers.com"],[]],[["document.getElementById","send"],["notebookcheck-ru.com"],[]],[["document.addEventListener","nextFunction"],["fc.lc","fc-lc.com"],[]],[["document.getElementById","undefined"],["fstore.biz"],[]],[["document.write","iframe"],["hdtube.porn"],[]],[["Date","='\\x"],["barefeetonthedashboard.com","bargainbriana.com","betterbuttchallenge.com","bike-urious.com","blwideas.com","eartheclipse.com","entertainment-focus.com","fanatik.com.tr","foreverconscious.com","foreversparkly.com","getdatgadget.com","goodnewsnetwork.org","greenarrowtv.com","hbculifestyle.com","heysigmund.com","hodgepodgehippie.com","homestratosphere.com","indesignskills.com","katiescucina.com","knowyourphrase.com","letsworkremotely.com","lizs-early-learning-spot.com","ledauphine.com","leprogres.fr","milliyet.com.tr","mjsbigblog.com","pinoyrecipe.net","prepared-housewives.com","redcarpet-fashionawards.com","republicain-lorrain.fr","savespendsplurge.com","savingadvice.com","shutupandgo.travel","spring.org.uk","stevivor.com","tamaratattles.com","tastefullyeclectic.com","theavtimes.com","thechroniclesofhome.com","thisisourbliss.com","tinyqualityhomes.org","turtleboysports.com","ultimateninjablazingx.com","universfreebox.com","utahsweetsavings.com","vgamerz.com","wheatbellyblog.com","yummytummyaarthi.com"],[]],[["document.head.appendChild","='\\x"],["barefeetonthedashboard.com","bargainbriana.com","betterbuttchallenge.com","bike-urious.com","blwideas.com","eartheclipse.com","entertainment-focus.com","fanatik.com.tr","foreverconscious.com","foreversparkly.com","getdatgadget.com","goodnewsnetwork.org","greenarrowtv.com","hbculifestyle.com","heysigmund.com","hodgepodgehippie.com","homestratosphere.com","indesignskills.com","katiescucina.com","knowyourphrase.com","letsworkremotely.com","lizs-early-learning-spot.com","ledauphine.com","leprogres.fr","milliyet.com.tr","mjsbigblog.com","pinoyrecipe.net","prepared-housewives.com","redcarpet-fashionawards.com","republicain-lorrain.fr","savespendsplurge.com","savingadvice.com","shutupandgo.travel","spring.org.uk","stevivor.com","tamaratattles.com","tastefullyeclectic.com","theavtimes.com","thechroniclesofhome.com","thisisourbliss.com","tinyqualityhomes.org","turtleboysports.com","ultimateninjablazingx.com","universfreebox.com","utahsweetsavings.com","vgamerz.com","wheatbellyblog.com","yummytummyaarthi.com"],[]],[["$","show"],["dreamdth.com"],[]],[["btoa","href"],["seireshd.com"],[]],[["enlace"],["pivigames.blog"],[]],[["document.addEventListener","Popup"],["playpaste.com"],[]],[["document.getElementsByTagName","appendChild"],["thecrazytourist.com"],[]],[["Math.random","Exoloader"],["pornult.com"],[]],[["jQuery","undefined"],["izzylaif.com"],[]],[["document.createElement","script"],["tusfiles.com"],[]],[["$","AdBlock"],["gamefront.com"],[]],[["Promise","overlay"],["washingtonpost.com"],[]],[["document.createElement","overlay"],["washingtonpost.com"],[]],[["decodeURI","decodeURIComponent"],["gonzoporn.cc","onlinexxx.cc","tvporn.cc"],[]],[["document.getElementById","for-variations"],["samash.com"],[]],[["Math.random","zonefile"],["arcadeprehacks.com"],[]],[["document.createElement","pop"],["iporntv.net"],[]],[["document.createElement","script"],["readcomicsonline.ru"],[]],[["decodeURI","decodeURIComponent"],["0xxx.ws"],[]],[["$","AdBlock"],["interfans.org"],[]],[["$","adblock"],["reverso.net"],[]],[["String.prototype.charAt"],["yuvutu.com"],[]],[["encodeURIComponent","XMLHttpRequest"],["exey.io"],[]],[["disableItToContinue"],["exey.io"],[]],[["adver"],["pornclassic.tube","tubepornclassic.com"],[]],[["document.createElement","tcpusher"],["tubepornclassic.com"],[]],[["document.querySelectorAll","popMagic"],["pussyspot.net","wildpictures.net"],[]],[["loadTool","popping"],["angelgals.com","nakedbabes.club"],[]],[["loadTool","popping"],["sexybabes.club"],[]],[["loadTool","popping"],["cherrynudes.com"],[]],[["loadTool","popping"],["hegreartnudes.com"],[]],[["loadTool","popping"],["doseofporn.com"],[]],[["document.getElementById","undefined"],["devdrive.cloud"],[]],[["document.getElementById","adsrefresh"],["secretsdujeu.com"],[]],[["document.createElement","l.parentNode.insertBefore(s"],["leechall.com"],[]],[["$","modal"],["buffstreamz.com"],[]],[["jQuery","fuckAdBlock"],["megagames.com"],[]],[["jQuery","adblock"],["technews.tw"],[]],[["document.getElementsByTagName","script"],["imagetwist.com"],[]],[["decodeURI","decodeURIComponent"],["freesoftpdfdownload.blogspot.com"],[]],[["Math.round","zonefile"],["officegamespot.com"],[]],[["jQuery","ai_adb"],["parzibyte.me"],[]],[["document.head.appendChild","='\\x"],["closermag.fr"],[]],[["$","setTimeout"],["softwaresblue.com"],[]],[["getCookie"],["kino-zeit.de"],[]],[["jQuery","adblocker"],["jotapov.com"],[]],[["$","MutationObserver"],["ligainsider.de"],[]],[["Math","'0x"],["investmentwatchblog.com"],[]],[["$","Math.random"],["fangraphs.com"],[]],[["googlefc"],["listenonrepeat.com"],[]],[["$","detected"],["xiaomi-miui.gr"],[]],[["document.getElementById","undefined"],["upzone.cc"],[]],[["$","offsetHeight"],["photovoltaikforum.com"],[]],[["document.getElementById","length"],["soy502.com"],[]],[["document.getElementById","adblock"],["seeitworks.com"],[]],[["document.createElement","adblock"],["vttpi.com"],[]],[["Math","'0x"],["insidermonkey.com"],[]],[["$","undefined"],["pakkotoisto.com"],[]],[["globalThis","break;case"],["upstream.to"],[]],[["$","btoa"],["osxinfo.net"],[]],[["document.onclick","popunder"],["kordramass.com","kshowsubindo.org","senimovie.co"],[]],[["eval","AdBlock"],["orirom.com","romfirmware.com"],[]],[["$","onload"],["tvchoicemagazine.co.uk"],[]],[["$","show"],["dloady.com"],[]],[["jQuery","popunder"],["pornfactors.com"],[]],[["addEventListener","nextFunction"],["debgen.fr"],[]],[["_pop"],["cuatrolatastv.blogspot.com"],[]],[["Math","'\\x"],["grid.id"],[]],[["document.querySelectorAll","adConfig"],["javnew.net"],[]],[["addEventListener","google_ad_client"],["okulsoru.com"],[]],[["document.querySelector","XF"],["fellowsfilm.com"],[]],[["$","hide"],["netaffiliation.com"],[]],[["$","show"],["jacquieetmichelelite.com"],[]],[["$","modal"],["yepi.com"],[]],[["$",".test"],["spaziogames.it"],[]],[["$","show"],["hostingunlock.com"],[]],[["jQuery","ai_adb"],["fotografareindigitale.com"],[]],[["$","AdBlock"],["nirjonmela.com"],[]],[["$","blocker"],["tiz-cycling-live.io"],[]],[["Math","XMLHttpRequest"],["iir.ai"],[]],[["addEventListener","google_ad_client"],["onlinetutorium.com"],[]],[["onload","adblock"],["cryptonetos.ru"],[]],[["document.createElement","adblock"],["almezoryae.com"],[]],[["document.createElement","a.adm"],["theregister.co.uk"],[]],[["document.getElementById","adblock"],["gogodl.com"],[]],[["addEventListener","ADBLOCK"],["wojtekczytawh40k.blogspot.com"],[]],[["decodeURI","decodeURIComponent"],["files.im"],[]],[["jQuery","click"],["pharmaceutical-technology.com"],[]],[["jQuery","ai_adb"],["theouterhaven.net","watchallchannels.com","wikipekes.com"],[]],[["decodeURIComponent","ai_"],["semuanyabola.com"],[]],[["$","AdBlock"],["turkmmo.com"],[]],[["addEventListener","nextFunction"],["jumpmanclubbrasil.com.br"],[]],[["String.fromCharCode","shift"],["urlpay.net"],[]],[["$","show"],["hwreload.it"],[]],[["addEventListener","nextFunction"],["cheatglobal.com"],[]],[["document.createElement","adblock"],["arabic-robot.blogspot.com"],[]],[["document.createElement","adblock"],["downloadsoft.net"],[]],[["atob","_0x"],["azmovies.to"],[]],[["document.getElementById","block"],["isminiunuttum.com"],[]],[["jQuery","ai_adb"],["androgamer.org"],[]],[["$","zendplace"],["hentaipornpics.net"],[]],[["eval","replace"],["aquariumgays.com"],[]],[["$","adblock"],["vz.lt"],[]],[["$","ads"],["faucetdump.com"],[]],[["addEventListener","nextFunction"],["hd-tch.com"],[]],[["addEventListener","blocker"],["2kspecialist.net"],[]],[["addEventListener","Blocker"],["digit77.com"],[]],[["addEventListener","blocker"],["kutubistan.blogspot.com","softdroid4u.blogspot.com"],[]],[["addEventListener","AdBlocker"],["gudangfirmwere.com"],[]],[["addEventListener","blocker"],["gbadamud.blogspot.com"],[]],[["document.addEventListener","adsBlocked"],["javtiful.com"],[]],[["String.fromCharCode","shift"],["javtiful.com"],[]],[["addEventListener","-0x"],["javtiful.com"],[]],[["fetch","_0x","/^data:/"],["abogadosrosarinos.com","aptisweb.com","avene-hebergement.com","caesarjaco.co.id","https-xhamster.com","skybap.shop"],[]],[["document.createElement",".onerror"],["strand-co.com"],[]],[["String.prototype.toLowerCase","Contract"],["igualdad.iaa.csic.es"],[]],[["atob","Uint8Array"],["webrick.com"],[]],[["atob","new"],["pentest.blog"],[]],[["atob","new Function(atob("],["crimsonav.com","ngsingleissues.nationalgeographic.com"],[]],[["WebSocket","event.data"],["adrissa.com.co","americansoda.co.uk","casteloforte.com.br","centerfabril.com.br","forqueen.cz","joinusonline.net","jollibee.com.vn","kitapsan.com.tr","mebelinovdom.com","ojworld.it","qualityrental.com","szaszmotorshop.hu","tvojstyl.sk","up-shop.org","yairalon.com.br"],[]],[["open","executeCode"],["weightlossdiet.top"],[]],[["KeenTracking"],["unito.life"],[]]];
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
