/* Süzgeç scriptlet: ubo-addEventListener-defuser — generated, do not edit */
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
  const NAME = "ubo-addEventListener-defuser";
  const ENTRIES = [[["DOMContentLoaded","run"],["kanunyolu.com.tr"],[]],[["load","checkAdblock"],["summertoons.net"],[]],[["DOMContentLoaded","adsbygoogle"],["kpsssorucevapba.com"],[]],[["load","/adblock/i"],["merlinscans.com"],[]],[["click","checkTarget"],["cehennemizle.cc","720pfilmizleme1.com","720pfilmizletir.com","1080pfilmizletir.com","720pfilmizlesene.com","videoseyred.in","hdfilmcehennem.live"],[]],[["click","popundr"],["eescobarvip.com"],[]],[["click","showPop"],["dizirix.net"],[]],[["DOMContentLoaded","/popup/i"],["ddizimag.com"],[]],[["click","window.open"],["youizleo.sbs"],[]],[["DOMContentLoaded","reklam"],["tempestmangas.com"],[]],[["DOMContentLoaded","openHiddenPopup"],["hemenfilmizle.com","unutulmazfilmizle.com","turbofilmizle.net"],[]],[["DOMContentLoaded","popupLastOpened"],["ag2m4.cfd"],[]],[["message","localStorage"],["flatscher.net","dizilla40.com","yabancidiziio.com"],[]],[["click","lastOpened"],["dizipal.website"],[]],[["click","/reklam/i"],["fullfilmcibabaizlet.com","fullfilmcibaba.nl"],[]],[["click","openPopup"],["eldermanga.com","uzaymanga.com"],[]],[["","checkAndOpenPopup"],["epikplayer.xyz"],[]],[["DOMContentLoaded","var adx ="],["dizipal.org"],[]],[["click","window.open"],["turkleak1.live","turkleak2.live","turkleak3.live","turkleak4.live","turkleak5.live","turkleak6.live","turkleak7.live","turkleak8.live","turkleak9.live","turkleak10.live","turkleak11.live","turkleak12.live","turkleak13.live","turkleak14.live","turkleak15.live","turkleak16.live","turkleak17.live","turkleak18.live","turkleak19.live","turkleak20.live","turkleak21.live","turkleak22.live","turkleak23.live","turkleak24.live","turkleak25.live","turkleak26.live","turkleak27.live","turkleak28.live","turkleak29.live","turkleak30.live"],[]],[["DOMContentLoaded","app_advert"],["turkzzersifsa3.blog","turkzzersifsa4.blog","turkzzersifsa5.blog","turkzzersifsa6.blog","turkzzersifsa7.blog","turkzzersifsa8.blog","turkzzersifsa9.blog","turkzzersifsa10.blog","turkzzersifsa11.blog","turkzzersifsa12.blog","turkzzersifsa13.blog"],[]],[["click","popUnder"],["turkzzersifsa3.blog","turkzzersifsa4.blog","turkzzersifsa5.blog","turkzzersifsa6.blog","turkzzersifsa7.blog","turkzzersifsa8.blog","turkzzersifsa9.blog","turkzzersifsa10.blog","turkzzersifsa11.blog","turkzzersifsa12.blog","turkzzersifsa13.blog"],[]],[["DOMContentLoaded","app_advert"],["turkifsalife73.lat"],[]],[["click","popUnder"],["turkifsalife73.lat"],[]],[["click","tik_sayac"],["turkifsalife73.lat"],[]],[["click","window.open"],["turkifsalar26.space","turkifsalar27.space","turkifsalar28.space","turkifsalar29.space","turkifsalar30.space","turkifsalar31.space","turkifsalar32.space","turkifsalar33.space","turkifsalar34.space","turkifsalar35.space","turkifsalar36.space","turkifsalar37.space","turkifsalar38.space","turkifsalar39.space","turkifsalar40.space","turkifsalar41.space","turkifsalar42.space","turkifsalar43.space","turkifsalar44.space","turkifsalar45.space","turkifsalar46.space","turkifsalar47.space","turkifsalar48.space","turkifsalar49.space","turkifsalar50.space","turkifsalar51.space","turkifsalar52.space","turkifsalar53.space","turkifsalar54.space","turkifsalar55.space"],[]],[["DOMContentLoaded","promoContainers"],["turkifsalar26.space","turkifsalar27.space","turkifsalar28.space","turkifsalar29.space","turkifsalar30.space","turkifsalar31.space","turkifsalar32.space","turkifsalar33.space","turkifsalar34.space","turkifsalar35.space","turkifsalar36.space","turkifsalar37.space","turkifsalar38.space","turkifsalar39.space","turkifsalar40.space","turkifsalar41.space","turkifsalar42.space","turkifsalar43.space","turkifsalar44.space","turkifsalar45.space","turkifsalar46.space","turkifsalar47.space","turkifsalar48.space","turkifsalar49.space","turkifsalar50.space","turkifsalar51.space","turkifsalar52.space","turkifsalar53.space","turkifsalar54.space","turkifsalar55.space"],[]],[["DOMContentLoaded","openPopup"],["yavasgir136.live","yavasgir137.live","yavasgir138.live","yavasgir139.live","yavasgir140.live","yavasgir141.live","yavasgir142.live","yavasgir144.live","yavasgir145.live","yavasgir146.live","yavasgir147.live","yavasgir148.live","yavasgir149.live","yavasgir150.live","yavasgir151.live","yavasgir152.live","yavasgir153.live","yavasgir154.live","yavasgir156.live","yavasgir157.live","yavasgir158.live","yavasgir159.live","yavasgir160.live","yavasgir161.live","yavasgir162.live","yavasgir163.live","yavasgir164.live","yavasgir165.live","yavasgir166.live","yavasgir167.live","yavasgir168.live","yavasgir169.live","yavasgir170.live","yavasgir171.live","yavasgir172.live","yavasgir173.live","yavasgir174.live","yavasgir175.live","yavasgir176.live","yavasgir177.live","yavasgir143.live","yavasgir155.live"],[]],[["DOMContentLoaded","openPopup"],["cimcime179.live"],[]],[["DOMContentLoaded","videotutucu"],["klasikfilmler1.cc","klasikfilmler2.cc","klasikfilmler3.cc","klasikfilmler4.cc","klasikfilmler5.cc","klasikfilmler6.cc","klasikfilmler7.cc","klasikfilmler8.cc","klasikfilmler9.cc","klasikfilmler10.cc","klasikfilmler11.cc","klasikfilmler12.cc","klasikfilmler13.cc","klasikfilmler14.cc","klasikfilmler15.cc","klasikfilmler16.cc","klasikfilmler17.cc","klasikfilmler18.cc","klasikfilmler19.cc","klasikfilmler20.cc"],[]]];
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
