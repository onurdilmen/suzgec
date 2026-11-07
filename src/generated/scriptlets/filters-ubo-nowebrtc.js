/* Süzgeç scriptlet: ubo-nowebrtc — generated, do not edit */
(() => {
  'use strict';
  const run = function nowebrtc(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function nowebrtc(source) {
    var propertyName = "";
    if (window.RTCPeerConnection) {
      propertyName = "RTCPeerConnection";
    } else if (window.webkitRTCPeerConnection) {
      propertyName = "webkitRTCPeerConnection";
    }
    if (propertyName === "") {
      return;
    }
    var rtcReplacement = function rtcReplacement(config) {
      var message = `Document tried to create an RTCPeerConnection: ${convertRtcConfigToString(config)}`;
      logMessage(source, message);
      hit(source);
    };
    rtcReplacement.prototype = {
      close: noopFunc,
      createDataChannel: noopFunc,
      createOffer: noopFunc,
      setRemoteDescription: noopFunc
    };
    var rtc = window[propertyName];
    window[propertyName] = rtcReplacement;
    if (rtc.prototype) {
      rtc.prototype.createDataChannel = function(a, b) {
        return {
          close: noopFunc,
          send: noopFunc
        };
      }.bind(null);
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
  function noopFunc() {}
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function convertRtcConfigToString(e) {
    var t = "undefined";
    if (null === e) t = "null"; else if (e instanceof Object) {
      var r = "iceServers", n = "urls";
      Object.prototype.hasOwnProperty.call(e, r) && e[r] && Object.prototype.hasOwnProperty.call(e[r][0], n) && e[r][0][n] && (t = e[r][0][n].toString());
    }
    return t;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    nowebrtc.apply(this, updatedArgs);
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
  const NAME = "ubo-nowebrtc";
  const ENTRIES = [[[],["bonstreams.net","convertinmp4.com","ddlvalley.me","fluvore.com","oceanoffgames.com","skidrowcrack.com","uptobox.com"],[]],[[],["srt.am"],[]],[[],["1fichier.com"],[]],[[],["planetfools.com"],[]],[[],["cpmlink.net"],[]],[[],["short.pe"],[]],[[],["wizhdsports.fi"],[]],[[],["peliculasmx.net"],[]],[[],["animeid.tv"],[]],[[],["coinfaucet.io","freecardano.com","freenem.com"],[]],[[],["gtaall.com"],[]],[[],["uii.io"],[]],[[],["mimaletamusical.blogspot.com"],[]],[[],["xrivonet.info"],[]],[[],["onhockey.tv","web.livecricket.is"],[]],[[],["startseite.to"],[]],[[],["kinoger.to"],[]],[[],["blizzboygames.net"],[]],[[],["software-on.com"],[]],[[],["modsbase.com"],[]],[[],["f1livegp.net"],[]],[[],["zimabdko.com"],[]],[[],["aii.sh"],[]],[[],["buffstreamz.com"],[]],[[],["ex-foary.com"],[]]];
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
