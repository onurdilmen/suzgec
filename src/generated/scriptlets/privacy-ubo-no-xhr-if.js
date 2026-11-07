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
  const ENTRIES = [[["stella"],["nicovideo.jp"],[]],[["/i/api/1.1/flow/viewer.json"],["x.com"],[]],[["method:POST url:/logImpressions"],["docs.google.com"],[]],[["method:POST"],["endbasic.dev"],[]],[["utreon.com/pl/api/event method:POST"],["utreon.com"],[]],[["log-sdk.ksapisrv.com/rest/wd/common/log/collect method:POST"],["zhihu.com"],[]],[["method:POST"],["fingerprint.com"],["dev.fingerprint.com","docs.fingerprint.com"]],[["fingerprintjs-pro-react"],["intellischool.id"],[]],[["/VisitorAPI|AppMeasurement/"],["natgeotv.com"],[]],[["analytics/bulk-pixel"],["airtel.in"],[]],[["cmp.inmobi.com/geoip"],["dailystar.co.uk","mirror.co.uk"],[]],[["method:POST url:pfanalytics.bentasker.co.uk"],["bentasker.co.uk"],[]],[["discord.com/api/v9/science"],["discord.com"],[]],[["body:pageview method:POST"],["pooembed.eu"],[]],[["svc.webex.com/metrics"],["webex.com"],[]],[["method:POST body:/\"track\"|adblock/"],["adhs-zentrum.de"],[]]];
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
