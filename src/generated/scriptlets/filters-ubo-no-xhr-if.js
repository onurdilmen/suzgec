/* Süzgeç scriptlet: ubo-no-xhr-if — generated, do not edit */
(() => {
  'use strict';
  const run = function preventXHR(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventXHR(source, propsToMatch, directive) {
    createPreventXhrCore(source, propsToMatch, false, directive);
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
  function objectToString(t) {
    return t && "object" == typeof t ? isEmptyObject(t) ? "{}" : Object.entries(t).map((function(t) {
      var n = t[0], e = t[1], o = e;
      return e instanceof Object && (o = `{ ${objectToString(e)} }`), `${n}:"${o}"`;
    })).join(" ") : String(t);
  }
  function createPreventXhrCore(e, t, r, n) {
    if ("undefined" != typeof Proxy) {
      var a = window.XMLHttpRequest.prototype.open, s = window.XMLHttpRequest.prototype.getResponseHeader, o = window.XMLHttpRequest.prototype.getAllResponseHeaders, p = new Map, l = new Map, i = {
        apply: function apply(r, n, a) {
          var s = getXhrData.apply(null, a);
          if (void 0 === t ? (logMessage(e, `xhr( ${objectToString(s)} )`, true), hit(e)) : matchRequestProps(e, t, s) && ("function" == typeof n.onreadystatechange && (s.shouldFireFirstStage = true), 
          p.set(n, s)), p.has(n) && !l.has(n)) {
            l.set(n, []);
            var o = {
              apply: function apply(e, t, r) {
                var n = l.get(t);
                return n && n.push(r), Reflect.apply(e, t, r);
              }
            };
            n.setRequestHeader = new Proxy(n.setRequestHeader, o);
          }
          return Reflect.apply(r, n, a);
        }
      }, u = {
        apply: function apply(t, s, o) {
          if (!p.has(s)) return Reflect.apply(t, s, o);
          var i, u = p.get(s), d = s.responseType, v = "", f = "", y = true;
          if ("blob" === d) v = new Blob, y = false; else if ("arraybuffer" === d) v = new ArrayBuffer(0), 
          y = false; else if ("document" === d) v = (new DOMParser).parseFromString("", "text/html"), 
          i = v, y = false; else if ("json" === d) {
            var c = "{}";
            if (n) {
              var g = generateResponseContent(n);
              null !== g ? c = g : logMessage(e, `Invalid randomize parameter: '${n}'`);
            }
            y = false;
            try {
              v = JSON.parse(c);
            } catch (e) {
              v = null;
            }
          } else if (n) {
            var w = generateResponseContent(n);
            null !== w ? (v = w, f = w) : logMessage(e, `Invalid randomize parameter: '${n}'`);
          }
          var R = new XMLHttpRequest, transitionReadyState = function transitionReadyState(t) {
            if (2 === t) {
              var {responseURL: r} = R;
              Object.defineProperties(s, {
                responseURL: {
                  value: r || u.url,
                  writable: false
                }
              });
            }
            if (4 === t) {
              var {responseXML: n} = R, a = {
                readyState: {
                  value: 4,
                  writable: false
                },
                statusText: {
                  value: "OK",
                  writable: false
                },
                responseXML: {
                  value: void 0 !== i ? i : n,
                  writable: false
                },
                status: {
                  value: 200,
                  writable: false
                },
                response: {
                  value: v,
                  writable: false
                }
              };
              y && (a.responseText = {
                value: f,
                writable: false
              }), Object.defineProperties(s, a), hit(e);
            } else Object.defineProperty(s, "readyState", {
              value: t,
              writable: true,
              configurable: true
            });
            var o = new Event("readystatechange");
            s.dispatchEvent(o);
          };
          R.addEventListener("readystatechange", (function() {
            p.get(s).shouldFireFirstStage && transitionReadyState(1);
            var e = new ProgressEvent("loadstart");
            s.dispatchEvent(e), transitionReadyState(2), transitionReadyState(3);
            var t = new ProgressEvent("progress");
            s.dispatchEvent(t), transitionReadyState(4);
          })), setTimeout((function() {
            var e = new ProgressEvent("load");
            s.dispatchEvent(e);
            var t = new ProgressEvent("loadend");
            s.dispatchEvent(t);
          }), 1), a.apply(R, [ u.method, u.url ]), (l.get(s) || []).forEach((function(e) {
            var t = e[0], r = e[1];
            R.setRequestHeader(t, r);
          }));
        }
      }, d = {
        apply: function apply(e, t, r) {
          var n = l.get(t);
          if (!n) return s.apply(t, r);
          if (!n.length) return null;
          var a = r[0].toLowerCase(), o = n.find((function(e) {
            return e[0].toLowerCase() === a;
          }));
          return o ? o[1] : null;
        }
      }, v = {
        apply: function apply(e, t) {
          var r = l.get(t);
          return r ? r.length ? r.map((function(e) {
            var t = e[0], r = e[1];
            return `${t.toLowerCase()}: ${r}`;
          })).join("\r\n") : "" : o.call(t);
        }
      };
      XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, i), XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, u), 
      XMLHttpRequest.prototype.getResponseHeader = new Proxy(XMLHttpRequest.prototype.getResponseHeader, d), 
      XMLHttpRequest.prototype.getAllResponseHeaders = new Proxy(XMLHttpRequest.prototype.getAllResponseHeaders, v);
    }
  }
  function generateResponseContent(r, t) {
    if (!r) return "";
    if ("true" === r) return Math.random().toString(36).slice(2).padEnd(10, "0").slice(0, 10);
    if ("emptyObj" === r) return "{}";
    if ("emptyArr" === r) return "[]";
    if ("emptyStr" === r) return "";
    if (r.startsWith("war:") || r.startsWith("join:")) return "";
    for (var e, n = /length:(\d+)(?:-(\d+))?/g, i = null; null !== (e = n.exec(r)); ) i = e;
    if (i) {
      var u = getNumberFromString(i[1]), l = i[2] ? getNumberFromString(i[2]) : u;
      if (null === u || null === l || !nativeIsFinite(u) || !nativeIsFinite(l)) return null;
      var a = u, f = l;
      if (a > f) {
        var g = a;
        a = f, f = g;
      }
      if (f > 5e5) return null;
      var o = getRandomIntInclusive(a, f), s = r.replace(/length:\d+(?:-\d+)?/g, "").trim();
      if (s) {
        return "";
      }
      return getRandomStrByLength(o);
    }
    return "";
  }
  function matchRequestProps(e, t, r) {
    if ("" === t || "*" === t) return true;
    var a, s = parseMatchProps(t);
    if (isValidParsedData(s)) {
      var n = getMatchPropsData(s);
      a = Object.keys(n).every((function(e) {
        var t = n[e], a = r[e];
        return Object.prototype.hasOwnProperty.call(r, e) && "string" == typeof a && (null == t ? void 0 : t.test(a));
      }));
    } else logMessage(e, `Invalid parameter: ${t}`), a = false;
    return a;
  }
  function getXhrData(r, t, a, e, n) {
    return {
      method: r,
      url: t,
      async: a,
      user: e,
      password: n
    };
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
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
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function nativeIsFinite(i) {
    return (Number.isFinite || window.isFinite)(i);
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function parseMatchProps(e) {
    var r = {};
    return e.split(" ").forEach((function(e) {
      var n = e.indexOf(":"), i = e.slice(0, n);
      if (function(e) {
        return getRequestProps().includes(e);
      }(i)) {
        var s = e.slice(n + 1);
        r[i] = s;
      } else r.url = e;
    })), r;
  }
  function isValidParsedData(t) {
    return Object.values(t).every((function(t) {
      return isValidStrPattern(t);
    }));
  }
  function getMatchPropsData(t) {
    var a = {};
    return Object.keys(t).forEach((function(c) {
      a[c] = toRegExp(t[c]);
    })), a;
  }
  function getRequestProps() {
    return [ "url", "method", "headers", "body", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "mode" ];
  }
  function getRandomIntInclusive(t, n) {
    return t = Math.ceil(t), n = Math.floor(n), Math.floor(Math.random() * (n - t + 1) + t);
  }
  function getRandomStrByLength(r) {
    for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=~", n = [], o = 0; o < r; o += 1) n.push(t.charAt(Math.floor(76 * Math.random())));
    return n.join("");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventXHR.apply(this, updatedArgs);
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
  const NAME = "ubo-no-xhr-if";
  const ENTRIES = [[["pagead2.googlesyndication.com"],["forumchess.com.tr"],[]],[["/advert.js"],["kuponuna476.top","kuponuna477.top","kuponuna478.top","kuponuna479.top","kuponuna480.top","kuponuna481.top","kuponuna482.top","kuponuna483.top","kuponuna484.top","kuponuna485.top","kuponuna486.top","kuponuna487.top","kuponuna488.top","kuponuna489.top","kuponuna490.top","kuponuna491.top","kuponuna492.top","kuponuna493.top","kuponuna494.top","kuponuna495.top","kuponuna496.top","kuponuna497.top","kuponuna498.top","kuponuna499.top","kuponuna500.top","kuponuna501.top","kuponuna502.top","kuponuna503.top","kuponuna504.top","kuponuna505.top","kuponuna506.top","kuponuna507.top","kuponuna508.top","kuponuna509.top","kuponuna510.top","kuponuna511.top","kuponuna512.top","kuponuna513.top","kuponuna514.top","kuponuna515.top","kuponuna516.top","kuponuna517.top","kuponuna518.top","kuponuna519.top","kuponuna520.top","kuponuna521.top","kuponuna522.top","kuponuna523.top","kuponuna524.top","kuponuna525.top","kuponuna526.top","kuponuna527.top","kuponuna528.top","kuponuna529.top","kuponuna530.top","kuponuna531.top","kuponuna532.top","kuponuna533.top","kuponuna534.top","kuponuna535.top","kuponuna536.top","kuponuna537.top","kuponuna538.top","kuponuna539.top","kuponuna540.top","kuponuna541.top","kuponuna542.top","kuponuna543.top","kuponuna544.top","kuponuna545.top","kuponuna546.top","kuponuna547.top","kuponuna548.top","kuponuna549.top","kuponuna550.top","kuponuna551.top","kuponuna552.top","kuponuna553.top","kuponuna554.top","kuponuna555.top","kuponuna556.top","kuponuna557.top","kuponuna558.top","kuponuna559.top","kuponuna560.top","kuponuna561.top","kuponuna562.top","kuponuna563.top","kuponuna564.top","kuponuna565.top","kuponuna566.top","kuponuna567.top","kuponuna568.top","kuponuna569.top"],[]],[["static.doubleclick.net/instream/ad_status.js"],["mangawt.com"],[]],[["pagead2.googlesyndication.com"],["uzaymanga.com"],[]],[["spotxchange.com"],["tv8.com.tr"],[]],[["/hlktrpl.cfd\\/\\w+.xml/"],["hlktrpl.cfd"],[]],[["request=adb"],["handelsblatt.com"],[]],[["doubleclick"],["moviepilot.de"],[]],[["googlesyndication"],["sankaku.app"],[]],[["/enthusiastgaming|googleoptimize|googletagmanager/"],["thesimsresource.com"],[]],[["/doubleclick|googlesyndication/"],["gnomio.com"],[]],[["/adnxs.com|onetag-sys.com|teads.tv|google-analytics.com|rubiconproject.com|casalemedia.com/"],["youmath.it"],[]],[["ad_"],["frkn64modding.com"],[]],[["/googlesyndication|outbrain/"],["zigforums.com"],[]],[["googlesyndication"],["ge-map-overlays.appspot.com"],[]],[["doubleclick"],["3dzip.org"],[]],[["ads"],["gearingcommander.com"],[]],[["svonm"],["vox.de"],[]],[["/\\/VisitorAPI\\.js|\\/AppMeasurement\\.js/"],["nationalgeographic.fr"],[]],[["doubleclick","length:10"],["s0ft4pc.com"],[]],[["damoh"],["golem.de"],[]],[["svonm"],["cinema.de"],[]],[["homad-global-configs"],["wetter.de"],[]],[["/youboranqs01|spotx|springserve/"],["rakuten.tv"],[]],[["adsbygoogle"],["hausbau-forum.de"],[]],[["googlesyndication"],["freegogpcgames.com"],[]],[["mobileanalytics"],["viu.com"],[]],[["cloudflare.com/cdn-cgi/trace"],["myair2.resmed.com"],[]],[["cloudflare.com/cdn-cgi/trace"],["travelerdoor.com"],[]],[["doubleclick"],["meteoetradar.com"],[]],[["/recommendations."],["azby.fmworld.net"],[]],[["/api/analytics"],["unrealengine.com"],[]],[["api"],["wco.tv"],[]],[["doubleclick"],["gala.fr","geo.fr","voici.fr"],[]],[["lr-ingest.io"],["dark-gaming.com"],[]],[["/gtm.js"],["securegames.iwin.com"],[]],[["/froloa.js"],["virginmediatelevision.ie"],[]],[["1.1.1.1/cdn-cgi/trace"],["myair.resmed.com"],[]],[["live.streamtheworld.com/partnerIds"],["player.amperwave.net"],[]],[["ads.viralize.tv"],["abs-cbn.com"],[]]];
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
