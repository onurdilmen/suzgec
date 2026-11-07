/* Süzgeç scriptlet: ubo-aost — generated, do not edit */
(() => {
  'use strict';
  const run = function abortOnStackTrace(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function abortOnStackTrace(source, property, stack) {
    if (!property || !stack) {
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
      if (!stack.match(/^(inlineScript|injectedScript)$/) && !isValidStrPattern(stack)) {
        logMessage(source, `Invalid parameter: ${stack}`);
        return;
      }
      var descriptorWrapper = Object.assign(getDescriptorAddon(), {
        value: base[prop],
        get() {
          if (!this.isAbortingSuspended && this.isolateCallback(matchStackTrace, stack, (new Error).stack)) {
            abort();
          }
          return this.value;
        },
        set(newValue) {
          if (!this.isAbortingSuspended && this.isolateCallback(matchStackTrace, stack, (new Error).stack)) {
            abort();
          }
          this.value = newValue;
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
    abortOnStackTrace.apply(this, updatedArgs);
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
  const NAME = "ubo-aost";
  const ENTRIES = [[["String.prototype.charCodeAt","ai_"],["iptvbin.com"],[]],[["onload","inlineScript"],["lacuevadeguns.com"],[]],[["navigator.userAgent","pushiserve"],["pussyspace.com","pussyspace.net"],[]],[["document.createElement","rollexzone"],["pussyspace.com","pussyspace.net"],[]],[["document.querySelector","detect"],["videos.porndig.com"],[]],[["document.cookie","https"],["zootube1.com"],[]],[["String.prototype.charCodeAt","ai_"],["gaypornmasters.com"],[]],[["Math.round","inlineScript"],["camwhorescloud.com"],[]],[["String.prototype.charCodeAt","ai_"],["gaypornwave.com"],[]],[["String.prototype.charCodeAt","ai_"],["scubidu.eu"],[]],[["atob","inlineScript"],["watchkobestreams.info"],[]],[["document.getElementById","onLoadEvent"],["gametop.com"],[]],[["atob","inlineScript"],["imgdawgknuttz.com"],[]],[["Object","mark"],["artribune.com"],[]],[["XMLHttpRequest.prototype.open","svonm.com"],["giga.de"],[]],[["console.log","/blob|injectedScript/"],["laksa19.github.io"],[]],[["Math","inlineScript"],["pcgamez-download.com"],[]],[["encodeURIComponent","inlineScript"],["programmiedovetrovarli.it"],[]],[["String.prototype.charCodeAt","ai_"],["thesukan.net"],[]],[["Function","/bxslider|wow/"],["darumasushiantofagasta.cl"],[]],[["XMLHttpRequest","/wp-content"],["rapidkil.com.au"],[]],[["Array.prototype.indexOf","isWin"],["sport.elwatannews.com"],[]],[["History","/(^(?!.*(Function|HTMLDocument).*))/"],["cadenadial.com"],[]]];
  const EXCEPTIONS = [[["WP.prebid","onLoad"],["abczdrowie.pl"]]];
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
