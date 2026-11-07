/* Süzgeç scriptlet: trusted-set-constant — generated, do not edit */
(() => {
  'use strict';
  const run = function trustedSetConstant(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function trustedSetConstant(source, property, value, stack) {
    if (!property) {
      return;
    }
    var constantValue;
    try {
      constantValue = inferValue(value);
    } catch (e) {
      logMessage(source, e);
      return;
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
        base[prop] = constantValue;
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
  function inferValue(r) {
    if ("undefined" !== r) {
      if ("false" === r) return false;
      if ("true" === r) return true;
      if ("null" === r) return null;
      if ("NaN" === r) return NaN;
      if (r.startsWith("/") && r.endsWith("/")) return toRegExp(r);
      var e = Number(r);
      if (!nativeIsNaN(e)) {
        if (Math.abs(e) > 32767) throw new Error("number values bigger than 32767 are not allowed");
        return e;
      }
      try {
        var t = JSON.parse(r);
        if (t instanceof Object || "string" == typeof t) return t;
      } catch (e) {
        return r;
      }
      return r;
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
    var {source: e, stack: r, mustCancel: i, trapProp: n, getConstantValue: a, setConstantValue: s} = t, _setChainPropAccess3 = function _setChainPropAccess(t, c) {
      var o = getPropertyInChain(t, c), {base: u, prop: d, chain: f} = o, h = {
        factValue: void 0,
        init(t) {
          return this.factValue = t, true;
        },
        get() {
          return this.factValue;
        },
        set(t) {
          this.factValue !== t && (this.factValue = t, t instanceof Object && _setChainPropAccess3(t, f));
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
          (p instanceof Object || "object" == typeof p && null !== p) && _setChainPropAccess3(p, f), 
          n(u, d, true, h);
        } else n(u, d, true, h);
      } else n(u, d, false, l);
    };
    return _setChainPropAccess3;
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
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isEmptyObject(t) {
    return 0 === Object.keys(t).length && !t.prototype;
  }
  function getNativeRegexpTest() {
    var t = Object.getOwnPropertyDescriptor(RegExp.prototype, "test"), e = null == t ? void 0 : t.value;
    if (t && "function" == typeof t.value) return e;
    throw new Error("RegExp.prototype.test is not a function");
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
    trustedSetConstant.apply(this, updatedArgs);
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
  const NAME = "trusted-set-constant";
  const ENTRIES = [[["_omapp.scripts.geolocation","{\"value\": {\"status\":\"loaded\",\"object\":null,\"data\":{\"country\":{\"shortName\":\"\",\"longName\":\"\"},\"administrative_area_level_1\":{\"shortName\":\"\",\"longName\":\"\"},\"administrative_area_level_2\":{\"shortName\":\"\",\"longName\":\"\"},\"locality\":{\"shortName\":\"\",\"longName\":\"\"},\"original\":{\"ip\":\"\",\"ip_decimal\":null,\"country\":\"\",\"country_eu\":false,\"country_iso\":\"\",\"city\":\"\",\"latitude\":null,\"longitude\":null,\"user_agent\":{\"product\":\"\",\"version\":\"\",\"comment\":\"\",\"raw_value\":\"\"},\"zip_code\":\"\",\"time_zone\":\"\"}},\"error\":\"\"}}"],["seclore.com"],[]],[["HSBC","json:{\"SITE\":{},\"DCS\":{},\"PAGE\":{}}"],["expatexplorer.hsbc.com"],[]],[["getUserConsentStatus","json:{\"dailymotion\":true}","as","function"],["funradio.fr"],[]]];
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
