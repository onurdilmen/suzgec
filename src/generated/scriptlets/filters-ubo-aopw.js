/* Süzgeç scriptlet: ubo-aopw — generated, do not edit */
(() => {
  'use strict';
  const run = function abortOnPropertyWrite(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnPropertyWrite(source, property) {
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
        set: abort
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
    abortOnPropertyWrite.apply(this, updatedArgs);
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
  const NAME = "ubo-aopw";
  const ENTRIES = [[["SZAdBlockDetection"],["sueddeutsche.de"],[]],[["_sp_"],["autobytel.com","cesoirtv.com","huffingtonpost.co.uk","huffingtonpost.com","moviefone.com","playboy.de"],[]],[["_sp_"],["car.com","codeproject.com","familyhandyman.com","goldderby.com","headlinepolitics.com","html.net","indiewire.com","marmiton.org","mymotherlode.com","nypost.com","realgm.com","tvline.com","wwd.com"],[]],[["yafaIt"],["eurogamer.net","rockpapershotgun.com","vg247.com"],[]],[["Fingerprint2"],["dfiles.eu","downsub.com","j.gs","macserial.com","microify.com","minecraft-forum.net","solidfiles.com","thepiratebay.org","uptobox.com"],[]],[["_sp_"],["bordertelegraph.com","bournemouthecho.co.uk","dailyecho.co.uk","dorsetecho.co.uk","eveningtimes.co.uk","guardian-series.co.uk","heraldscotland.com","iwcp.co.uk","lancashiretelegraph.co.uk","oxfordmail.co.uk","salisburyjournal.co.uk","theargus.co.uk","thetelegraphandargus.co.uk","yorkpress.co.uk"],[]],[["_sp_"],["wunderground.com"],[]],[["adcashMacros"],["mp4upload.com"],[]],[["openLity"],["at.wetter.com"],[]],[["ad_abblock_ad"],["powerthesaurus.org"],[]],[["cticodes"],["imgadult.com","imgdrive.net","imgtaxi.com","imgwallet.com"],[]],[["imgadbpops"],["imgadult.com","imgdrive.net","imgtaxi.com","imgwallet.com"],[]],[["__NA"],["hdpornt.com"],[]],[["ads_priv"],["4tube.com"],[]],[["ab_detected"],["mp3cut.net"],[]],[["ads_priv"],["pornerbros.com"],[]],[["t4PP"],["mcfucker.com"],[]],[["sc_adv_out"],["taroot-rangi.com"],[]],[["pURL"],["mangoporn.net"],[]],[["AdBlockDetectorWorkaround"],["xiaopan.co"],[]],[["__htapop"],["realgfporn.com"],[]],[["adcashMacros"],["mitly.us"],[]],[["atOptions"],["mitly.us"],[]],[["Fingerprint2"],["pic-upload.de"],[]],[["popzone"],["empflix.com"],[]],[["__htapop"],["linkrex.net"],[]],[["Fingerprint2"],["oke.io"],[]],[["encodeURIComponent"],["freeviewmovies.com"],[]],[["encodeURIComponent"],["badjojo.com"],[]],[["encodeURIComponent"],["boysfood.com"],[]],[["stagedPopUnder"],["sextingforum.net"],[]],[["Fingerprint2"],["dz4link.com"],[]],[["Fingerprint2"],["imgclick.net"],[]],[["tiPopAction"],["befap.com"],[]],[["ExoLoader"],["cumlouder.com"],[]],[["hidekeep"],["arlinadzgn.com","idntheme.com"],[]],[["ShowAdbblock"],["pronpic.org"],[]],[["ExoLoader"],["chyoa.com"],[]],[["Fingerprint2"],["downloadpirate.com"],[]],[["EPeventFire"],["eporner.com"],[]],[["adBlockDetected"],["theralphretort.com"],[]],[["segs_pop"],["peliculasmx.net"],[]],[["adcashMacros"],["shrt10.com"],[]],[["$getWin"],["geo.fr"],[]],[["xhr.prototype.realSend"],["cbc.ca"],[]],[["btoa"],["igg-games.com"],[]],[["encodeURIComponent"],["pornhost.com"],[]],[["adsBlocked"],["zigforums.com"],[]],[["Fingerprint2"],["spycock.com"],[]],[["Fingerprint2"],["ausfile.com"],[]],[["SubmitDownload1"],["ausfile.com"],[]],[["getIfc"],["hotpornfile.org"],[]],[["adBlockRunning"],["donnaglamour.it"],[]],[["Fingerprint2"],["xrivonet.info"],[]],[["atOptions"],["payskip.org"],[]],[["adBlockDetected"],["seselah.com"],[]],[["open"],["rmdown.com"],[]],[["Aloader"],["pornvideospass.com"],[]],[["bindall"],["pornvideospass.com"],[]],[["decodeURIComponent"],["holavid.com"],[]],[["KillAdBlock"],["svipvids.com"],[]],[["checkAdBlocker"],["chd4.com"],[]],[["deployads"],["namemc.com"],[]],[["adBlockDetected"],["bollywoodshaadis.com"],[]],[["close_screen"],["hawtcelebs.com"],[]],[["adBlockDetected"],["practicequiz.com","wapkiz.com"],[]],[["adBlockDetected"],["pianokafe.com"],[]],[["mockingbird"],["canadianunderwriter.ca"],[]],[["adBlockDetected"],["apritos.com","bsierad.com","diminimalis.com","eksporimpor.com","jadijuara.com","kicaunews.com","palapanews.com","ridvanmau.com"],[]],[["checkAds"],["creativebusybee.com"],[]],[["adBlockDetected"],["yeutienganh.com"],[]],[["check"],["ohorse.com"],[]],[["adBlockDetected"],["aalah.me","academiadelmotor.es","aiailah.com","almursi.com","altebwsneno.blogspot.com","ambonkita.com","androidspill.com","aplus.my.id","arrisalah-jakarta.com","babyjimaditya.com","bbyhaber.com","beritabangka.com","beritasulteng.com","bestsellerforaday.com","bintangplus.com","bitco.world","br.nacaodamusica.com","bracontece.com.br","dicariguru.com","fairforexbrokers.com","foguinhogames.net","formasyonhaber.net","fullvoyeur.com","healbot.dpm15.net","indofirmware.site","hagalil.com","latribunadelpaisvasco.com","line-stickers.com","luxurydreamhomes.net","m5g.it","miltonfriedmancores.org","minutolivre.com","oportaln10.com.br","pedroinnecco.com","philippinenmagazin.de","piazzagallura.org","pornflixhd.com","safehomefarm.com","synoniemboek.com","techacrobat.com"],[]],[["adBlockDetected"],["elizabeth-mitchell.org"],[]],[["downloadJSAtOnload"],["gsm1x.xyz"],[]],[["ReactAds"],["mrdeepfakes.com"],[]],[["phtData"],["mrdeepfakes.com"],[]],[["phtData"],["donk69.com","hotdreamsxxx.com"],[]],[["killAdBlock"],["puzzlefry.com"],[]],[["adBlocker"],["theglobeandmail.com"],[]],[["Ha"],["mtlblog.com","narcity.com"],[]],[["spot"],["thepiratebay10.org"],[]],[["smrtSB"],["legionprogramas.org"],[]],[["smrtSP"],["legionprogramas.org"],[]],[["adBlockDetected"],["mongri.net"],[]],[["ads_priv"],["uflash.tv"],[]],[["spot"],["jizzbunker.com","xxxdan.com"],[]],[["hidekeep"],["problogbooster.com"],[]],[["document.getElementsByClassName"],["moonquill.com"],[]],[["ABD"],["macrotrends.net"],[]],[["mfbDetect"],["myfreeblack.com"],[]],[["atOptions"],["imgdawgknuttz.com"],[]],[["smrtSB"],["pastepvp.org","programasvirtualespc.net"],[]],[["adBlockDetected"],["svapo.it"],[]],[["adBlockDetected"],["papalah.com"],[]],[["ai_adb_overlay"],["mysostech.com"],[]],[["showMsgAb"],["filesharing.io"],[]],[["downloadJSAtOnload"],["softwarecrackguru.com"],[]],[["wutimeBotPattern"],["dreamdth.com"],[]],[["popup_ads"],["acefile.co"],[]],[["adblockerpopup"],["beautypackaging.com"],[]],[["downloadJSAtOnload"],["hotgameplus.com"],[]],[["adblockCheck"],["puhutv.com"],[]],[["cancelAdBlocker"],["oranhightech.com"],[]],[["Fingerprint2"],["tusfiles.com"],[]],[["adblock"],["mad4wheels.com"],[]],[["ExoSupport"],["allporncomic.com"],[]],[["adBlockDetected"],["pipocamoderna.com.br"],[]],[["mobilePop"],["m.viptube.com"],[]],[["adBlockDetected"],["space.tribuntekno.com"],[]],[["mdp_deblocker"],["godmods.com"],[]],[["adBlockDetected"],["lampungway.com"],[]],[["showModal"],["winit.heatworld.com"],[]],[["ai_adb_overlay"],["medihelp.life"],[]],[["ai_adb_overlay"],["camchickscaps.com"],[]],[["ABD"],["investmentwatchblog.com"],[]],[["KillAdBlock"],["jnovels.com"],[]],[["_sp_"],["lapresse.ca"],[]],[["daCheckManager"],["shop123.com.tw"],[]],[["Fingerprint2"],["hexupload.net"],[]],[["adcashMacros"],["ebook3000.com","longfiles.com"],[]],[["backgroundBanner"],["boyfriendtv.com"],[]],[["Fingerprint2"],["iir.ai"],[]],[["adBlockDetected"],["notiziemusica.it"],[]],[["ai_front"],["abogadosrosarinos.com","aptisweb.com","avene-hebergement.com","caesarjaco.co.id","https-xhamster.com","skybap.shop"],[]]];
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
