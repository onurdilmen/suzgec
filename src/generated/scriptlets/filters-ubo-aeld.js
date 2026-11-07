/* Süzgeç scriptlet: ubo-aeld — generated, do not edit */
(() => {
  'use strict';
  const run = function preventAddEventListener(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventAddEventListener(source, typeSearch, listenerSearch, additionalArgName, additionalArgValue, noProtect) {
    var typeSearchRegexp = toRegExp(typeSearch);
    var listenerSearchRegexp = toRegExp(listenerSearch);
    var elementToMatch;
    if (additionalArgName) {
      if (additionalArgName !== "elements") {
        logMessage(source, `Invalid "additionalArgName": ${additionalArgName}\nOnly "elements" is supported.`);
        return;
      }
      if (!additionalArgValue) {
        logMessage(source, '"additionalArgValue" is required.');
        return;
      }
      elementToMatch = additionalArgValue;
    }
    var elementMatches = function elementMatches(element) {
      if (elementToMatch === undefined) {
        return true;
      }
      if (elementToMatch === "window") {
        return element === window;
      }
      if (elementToMatch === "document") {
        return element === document;
      }
      if (element && element.matches && element.matches(elementToMatch)) {
        return true;
      }
      return false;
    };
    var nativeAddEventListener = window.EventTarget.prototype.addEventListener;
    var nativeToString = Function.prototype.toString;
    function addEventListenerWrapper(type, listener) {
      var _this$constructor;
      var shouldPrevent = false;
      if (validateType(type) && validateListener(listener)) {
        shouldPrevent = typeSearchRegexp.test(type.toString()) && listenerSearchRegexp.test(listenerToString(listener, nativeToString)) && elementMatches(this);
      }
      if (shouldPrevent) {
        hit(source);
        return undefined;
      }
      var context = this;
      if (this && ((_this$constructor = this.constructor) === null || _this$constructor === void 0 ? void 0 : _this$constructor.name) === "Window" && this !== window) {
        context = window;
      }
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      return nativeAddEventListener.apply(context, [ type, listener, ...args ]);
    }
    if (noProtect === "true") {
      window.EventTarget.prototype.addEventListener = addEventListenerWrapper;
    } else {
      var descriptor = {
        configurable: true,
        set: function set() {},
        get: function get() {
          return addEventListenerWrapper;
        }
      };
      Object.defineProperty(window.EventTarget.prototype, "addEventListener", descriptor);
      Object.defineProperty(window, "addEventListener", descriptor);
      Object.defineProperty(document, "addEventListener", descriptor);
    }
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
  function validateType(n) {
    return null != n;
  }
  function validateListener(n) {
    return void 0 !== n && ("function" == typeof n || "object" == typeof n && null !== n && "handleEvent" in n && "function" == typeof n.handleEvent);
  }
  function listenerToString(n, t) {
    return "function" == typeof n ? t.call(n) : t.call(n.handleEvent);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventAddEventListener.apply(this, updatedArgs);
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
  const NAME = "ubo-aeld";
  const ENTRIES = [[["load","Object"],["newser.com"],[]],[["load","hard_block"],["sport1.de"],[]],[["","adb"],["timesofindia.indiatimes.com"],[]],[["click","showNotice"],["skidrowreloaded.com"],[]],[["click","ClickHandler"],["mediafire.com"],[]],[["load","IsAdblockRequest"],["mediafire.com"],[]],[["load","onload"],["kingofdown.com"],[]],[["load","(!o)"],["bibme.org","citationmachine.net"],[]],[["load","(!i)"],["easybib.com"],[]],[["","Adblock"],["badtaste.it"],[]],[["","open"],["gotporn.com"],[]],[["click","exopop"],["realgfporn.com"],[]],[["/^(?:load|click)$/","popMagic"],["realgfporn.com"],[]],[["getexoloader"],["vikiporn.com"],[]],[["","pop"],["pornhd.com"],[]],[["load","creativeLoaded-"],["pussyspace.com","pussyspace.net"],[]],[["/^load[A-Za-z]{12,}/"],["pussyspace.com","pussyspace.net"],[]],[["","/exo"],["empflix.com"],[]],[["getexoloader"],["tnaflix.com"],[]],[["","_blank"],["cpmlink.net"],[]],[["mousedown","preventDefault"],["short.pe"],[]],[["getexoloader"],["pornomico.com"],[]],[["click","preventDefault"],["bs.to"],[]],[["load","2000"],["generacionretro.net"],[]],[["load","adb"],["ma-x.org"],[]],[["","'0x"],["xmovies08.org"],[]],[["/DOMContentLoaded|load/","y.readyState"],["globaldjmix.com"],[]],[["","_0x"],["vermangasporno.com"],[]],[["","_blank"],["bdsmstreak.com"],[]],[["/error|canplay/","(t)"],["zazzybabes.com"],[]],[["load","hblocked"],["haaretz.co.il","haaretz.com"],[]],[["","/adbl/i"],["slate.com"],[]],[["error","","elements","[src]"],["slate.com"],[]],[["DOMContentLoaded","adlinkfly"],["megalinks.info"],[]],[["getexoloader"],["yourlust.com"],[]],[["DOMContentLoaded","adlinkfly"],["megapastes.com"],[]],[["load","2000"],["nuevos-mu.ucoz.com"],[]],[["","0x"],["cine.to"],[]],[["/^(?:click|mousedown)$/","popunder"],["videoszoofiliahd.com"],[]],[["DOMContentLoaded","preventExit"],["xxxtubezoo.com","zooredtube.com"],[]],[["/^(?:click|mousedown)$/","_0x"],["ancensored.com"],[]],[["click","preventDefault"],["efukt.com"],[]],[["mouseup","_blank"],["uii.io"],[]],[["click","pop_under"],["porndoe.com"],[]],[["load","onload"],["radiotormentamx.com"],[]],[["load","adverts-top-container"],["acienciasgalilei.com"],[]],[["load","2000"],["mimaletamusical.blogspot.com"],[]],[["getexoloader"],["hotpornfile.org"],[]],[["","Date"],["playrust.io"],[]],[["/^(?:click|mousedown)$/","_0x"],["mp3fiber.com"],[]],[["load","nextFunction"],["mp3fiber.com"],[]],[["load","2000"],["visionias.net"],[]],[["/^(?:click|mousedown)$/","_0x"],["xrivonet.info"],[]],[["DOMContentLoaded","&nbsp"],["payskip.org"],[]],[["","_0x"],["imgtorrnt.in"],[]],[["click","read_cookie"],["short-url.link"],[]],[["","midRoll"],["tubedupe.com"],[]],[["","_blank"],["cutpaid.com"],[]],[["load","onload"],["quelleestladifference.fr"],[]],[["load","nextFunction"],["schrauben-normen.de"],[]],[["load","onload"],["ad-itech.blogspot.com"],[]],[["load","nextFunction"],["avengerinator.blogspot.com"],[]],[["load","isBlanketFound"],["fatgirlskinny.net"],[]],[["load","showModal"],["canaltdt.es"],[]],[["click","trigger"],["oncehelp.com"],[]],[["mouseout","clientWidth"],["smallseotools.com"],[]],[["","_0x"],["picbaron.com"],[]],[["DOMContentLoaded","adlinkfly"],["mega-mkv.com","mkv-pastes.com"],[]],[["DOMContentLoaded","shortener"],["mega-mkv.com"],[]],[["load","autoRecov"],["macwelt.de","pcwelt.de"],[]],[["popstate","noPop"],["allmomsex.com","allnewindianporn.com","analxxxvideo.com","animalextremesex.com","anime3d.xyz","animefuckmovies.com","animepornfilm.com","animesexbar.com","animesexclip.com","animexxxsex.com","animexxxfilms.com","anysex.club","apetube.asia","asianfuckmovies.com","asianfucktube.com","asianporn.sexy","asiansexcilps.com","beeg.fund","beegvideoz.com","bestasiansex.pro","bravotube.asia","brutalanimalsfuck.com","candyteenporn.com","daddyfuckmovies.com","desifuckonline.com","exclusiveasianporn.com","exteenporn.com","fantasticporn.net","fantasticyoungporn.com","fineasiansex.com","firstasianpussy.com","freeindiansextube.com","freepornasians.com","freerealvideo.com","fuck-beeg.com","fuck-xnxx.com","fuckfuq.com","fuckundies.com","gojapaneseporn.com","golderotica.com","goodyoungsex.com","goyoungporn.com","hardxxxmoms.com","hdvintagetube.com","hentaiporn.me","hentaisexfilms.com","hentaisexuality.com","hot-teens-movies.mobi","hotanimepornvideos.com","hotanimevideos.com","hotasianpussysex.com","hotjapaneseshows.com","hotmaturetube.com","hotmilfs.pro","hotorientalporn.com","hotpornyoung.com","hotxxxjapanese.com","hotxxxpussy.com","indiafree.net","indianpornvideo.online","japanpornclip.com","japanesetube.video","japansex.me","japanesexxxporn.com","japansporno.com","japanxxx.asia","japanxxxworld.com","keezmovies.surf","lingeriefuckvideo.com","liveanimalporn.zooo.club","madhentaitube.com","megahentaitube.com","megajapanesesex.com","megajapantube.com","milfxxxpussy.com","momsextube.pro","momxxxass.com","monkeyanimalporn.com","moviexxx.mobi","newanimeporn.com","newjapanesexxx.com","nicematureporn.com","nudeplayboygirls.com","originalindianporn.com","originalteentube.com","pig-fuck.com","plainasianporn.com","popularasianxxx.com","pornanimetube.com","pornasians.pro","pornhat.asia","pornjapanesesex.com","pornvintage.tv","primeanimesex.com","realjapansex.com","realmomsex.com","redsexhub.com","retroporn.world","retrosexfilms.com","sex-free-movies.com","sexanimesex.com","sexanimetube.com","sexjapantube.com","sexmomvideos.com","sexteenxxxtube.com","sexxxanimal.com","sexyoungtube.com","sexyvintageporn.com","spicyvintageporn.com","sunporno.club","tabooanime.club","teenextrem.com","teenfucksex.com","teenhost.net","teensexass.com","tnaflix.asia","totalfuckmovies.com","totalmaturefuck.com","txxx.asia","voyeurpornsex.com","warmteensex.com","wetasiancreampie.com","wildhentaitube.com","wowyoungsex.com","xhamster-art.com","xmovie.pro","xnudevideos.com","xnxxjapon.com","xvide.me","xxxanimefuck.com","xxxanimevideos.com","xxxanimemovies.com","xxxhentaimovies.com","xxxhothub.com","xxxjapaneseporntube.com","xxxlargeporn.com","xxxmomz.com","xxxpornmilf.com","xxxpussyclips.com","xxxpussysextube.com","xxxretrofuck.com","xxxsex.pro","xxxsexyjapanese.com","xxxteenyporn.com","xxxvideo.asia","xxxyoungtv.com","youjizzz.club","youngpussyfuck.com"],[]],[["load","onload"],["unlockapk.com"],[]],[["/^(?:click|mousedown)$/","ppu"],["bayimg.com"],[]],[["load","onload"],["mobdi3ips.com"],[]],[["click","native code"],["celeb.gate.cc"],[]],[["click","_blank"],["kinoger.re"],[]],[["load","onload"],["socks24.org"],[]],[["click","popundr"],["masterplayer.xyz"],[]],[["click"],["porndex.com"],[]],[["DOMContentLoaded","compupaste"],["compucalitv.com"],[]],[["load","nextFunction"],["link-to.net"],[]],[["load","nextFunction"],["hanimesubth.com"],[]],[["load","nextFunction"],["gsmturkey.net"],[]],[["DOMContentLoaded","/adblock/i"],["diariodenavarra.es"],[]],[["getexoloader"],["watchfreexxx.net"],[]],[["load","2000"],["b3infoarena.in"],[]],[["load","onload"],["interviewgig.com"],[]],[["load","2000"],["lurdchinexgist.blogspot.com"],[]],[["load","2000"],["thefreedommatrix.blogspot.com"],[]],[["","_0x"],["letmejerk.com","letmejerk2.com","letmejerk3.com","letmejerk4.com","letmejerk5.com","letmejerk6.com","letmejerk7.com"],[]],[["load","PrivateMode"],["pennlive.com"],[]],[["scroll","_0x"],["beautypageants.indiatimes.com"],[]],[["load","2000"],["hentai-vl.blogspot.com"],[]],[["load","2000"],["projetomotog.blogspot.com"],[]],[["load","2000"],["ktmx.pro"],[]],[["DOMContentLoaded","checkVPN"],["01fmovies.com"],[]],[["load","2000"],["lirik3satu.blogspot.com"],[]],[["load","2000"],["marketmovers.it"],[]],[["load","2000"],["pharmaguideline.com"],[]],[["","pop"],["cle0desktop.blogspot.com"],[]],[["","\\"],["lnk2.cc"],[]],[["popstate"],["fullhdxxx.com"],[]],[["getexoloader"],["vintageporntubes.com"],[]],[["click","my_inter_listen"],["gosexpod.com"],[]],[["","window.open"],["tubepornclassic.com"],[]],[["/^(click|mousedown|mousemove|touchstart|touchend|touchmove)/","system.popunder"],["flashingjungle.com"],[]],[["getexoloader"],["angelgals.com"],[]],[["getexoloader"],["babesexy.com"],[]],[["load","appendChild"],["otakukan.com"],[]],[["load","onload"],["javaguides.net"],[]],[["","bi()"],["xcafe.com"],[]],[["load","2000"],["mixloads.com"],[]],[["load","onload"],["almohtarif-tech.net"],[]],[["load","2000"],["interssh.com"],[]],[["","checkTarget"],["imagehaha.com","imagenpic.com","imageshimage.com","imagetwist.com"],[]],[["load","2000"],["freesoftpdfdownload.blogspot.com"],[]],[["load","adb"],["lavozdegalicia.es"],[]],[["","adb"],["drrtyr.mx"],[]],[["load","2000"],["myadslink.com"],[]],[["timeupdate"],["web.de"],[]],[["load","nextFunction"],["adshrink.it"],[]],[["scroll","getElementById"],["news18.com"],[]],[["load","2000"],["blackavelic.com"],[]],[["load","undefined"],["thelanb.com"],[]],[["DOMContentLoaded","scriptwz_url"],["softwaredescargas.com"],[]],[["load","0x"],["cracking-dz.com"],[]],[["load","nextFunction"],["presentation-ppt.com"],[]],[["load","onload"],["devoloperxda.blogspot.com"],[]],[["adblockActivated"],["gazzetta.it"],[]],[["","show"],["dziennikbaltycki.pl","dzienniklodzki.pl","dziennikpolski24.pl","dziennikzachodni.pl","echodnia.eu","expressbydgoski.pl","expressilustrowany.pl","gazetakrakowska.pl","gazetalubuska.pl","gazetawroclawska.pl","gk24.pl","gloswielkopolski.pl","gol24.pl","gp24.pl","gra.pl","gs24.pl","kurierlubelski.pl","motofakty.pl","naszemiasto.pl","nowiny24.pl","nowosci.com.pl","nto.pl","polskatimes.pl","pomorska.pl","poranny.pl","sportowy24.pl","strefaagro.pl","strefabiznesu.pl","stronakobiet.pl","telemagazyn.pl","to.com.pl","wspolczesna.pl"],[]],[["/.?/","popMagic"],["onemanhua.com"],[]],[["load","nextFunction"],["mangacanblog.com"],[]],[["load","onload"],["zwergenstadt.com"],[]],[["","ads"],["dr-farfar.com"],[]],[["click","interstitial"],["boyfriendtv.com"],[]],[["load","antiblock"],["brandstofprijzen.info"],[]],[["load",".appendChild"],["iir.ai"],[]],[["load","nextFunction"],["pekalongan-cits.blogspot.com"],[]],[["","_0x"],["dlapk4all.com"],[]],[["load","nextFunction"],["4tymode.win"],[]],[["DOMContentLoaded","AdBlock"],["qpython.club"],[]],[["mouseleave","NativeDisplayAdID"],["marketbeat.com"],[]],[["mouseover","event.triggered"],["hentaipornpics.net"],[]],[["DOMContentLoaded","fullscreenEnabled"],["z13.web.core.windows.net"],[]],[["beforeunload","/[Ww]orker/"],["web.core.windows.net"],[]],[["mousemove","loadSecret"],["ondigitalocean.app"],[]],[["click","/event_callback=function\\(\\){window\\.location=t\\.getAttribute\\(\"href\"\\)/"],["cbc.ca"],[]],[["click","","elements",".dropdown-menu a[href]"],["dukeofed.org"],[]],[["load","dataset.ready","elements","script[src^=\"https://www.googletagmanager.com/gtag/js?id=\"]"],["proxyorb.com"],[]]];
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
