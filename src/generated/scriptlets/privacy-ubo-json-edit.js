/* Süzgeç scriptlet: ubo-json-edit — generated, do not edit */
(() => {
  'use strict';
  const run = function jsonPrune(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function jsonPrune(source, propsToRemove, requiredInitialProps) {
    var stack = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var syntaxModeDetails = resolveJsonSyntaxMode(propsToRemove, mode);
    var prunePaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(propsToRemove) : [];
    var requiredPaths = syntaxModeDetails.mode === "legacy" ? getPrunePath(requiredInitialProps) : [];
    var nativeObjects = {
      nativeParse: window.JSON.parse,
      nativeStringify: window.JSON.stringify
    };
    var pruneJsonValue = function pruneJsonValue(root) {
      if (syntaxModeDetails.mode === "jsonpath") {
        return jsonPath(source, root, propsToRemove, nativeObjects, (function() {
          return hit(source);
        }), stack);
      }
      return jsonPruner(source, root, prunePaths, requiredPaths, stack, nativeObjects);
    };
    var jsonParseWrapper = function jsonParseWrapper() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var root = nativeObjects.nativeParse.apply(JSON, args);
      return pruneJsonValue(root);
    };
    jsonParseWrapper.toString = nativeObjects.nativeParse.toString.bind(nativeObjects.nativeParse);
    JSON.parse = jsonParseWrapper;
    var nativeResponseJson = Response.prototype.json;
    var responseJsonWrapper = function responseJsonWrapper() {
      var promise = nativeResponseJson.apply(this);
      return promise.then((function(obj) {
        return pruneJsonValue(obj);
      }));
    };
    if (typeof Response === "undefined") {
      return;
    }
    Response.prototype.json = responseJsonWrapper;
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
  function getWildcardPropertyInChain(r, e) {
    var a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [], t = arguments.length > 4 ? arguments[4] : void 0, o = e.indexOf(".");
    if (-1 === o) {
      if ("*" === e || "[]" === e) {
        for (var n in r) if (Object.prototype.hasOwnProperty.call(r, n)) if (void 0 !== t) {
          var s = r[n];
          "string" == typeof s && t instanceof RegExp ? t.test(s) && i.push({
            base: r,
            prop: n
          }) : s === t && i.push({
            base: r,
            prop: n
          });
        } else i.push({
          base: r,
          prop: n
        });
      } else if (void 0 !== t) {
        var p = r[e];
        "string" == typeof p && t instanceof RegExp ? t.test(p) && i.push({
          base: r,
          prop: e
        }) : r[e] === t && i.push({
          base: r,
          prop: e
        });
      } else i.push({
        base: r,
        prop: e
      });
      return i;
    }
    var c = e.slice(0, o);
    if ("[]" === c && Array.isArray(r) || "*" === c && r instanceof Object || "[-]" === c && Array.isArray(r) || "{-}" === c && r instanceof Object) {
      var f = e.slice(o + 1), y = Object.keys(r);
      if ("{-}" === c || "[-]" === c) {
        var h = Array.isArray(r) ? "array" : "object";
        return ("{-}" !== c || "object" !== h) && ("[-]" !== c || "array" !== h) || y.forEach((function(e) {
          var a = r[e];
          isKeyInObject(a, f, t) && i.push({
            base: r,
            prop: e
          });
        })), i;
      }
      y.forEach((function(e) {
        getWildcardPropertyInChain(r[e], f, a, i, t);
      }));
    }
    Array.isArray(r) && r.forEach((function(r) {
      void 0 !== r && getWildcardPropertyInChain(r, e, a, i, t);
    }));
    var d = r[c];
    return e = e.slice(o + 1), void 0 !== d && getWildcardPropertyInChain(d, e, a, i, t), 
    i;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function isPruningNeeded(n, t, r, e, a, i) {
    if (!t) return false;
    var o, {nativeStringify: u} = i, c = r.map((function(n) {
      return n.path;
    })), f = e.map((function(n) {
      return n.path;
    }));
    if (0 === c.length && f.length > 0) {
      var g = u(t);
      if (toRegExp(f.join("")).test(g)) return logMessage(n, `${window.location.hostname}\n${u(t, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
      t && "object" == typeof t && logMessage(n, t, true, false), o = false;
    }
    if (a && !matchStackTrace(a, (new Error).stack || "")) return o = false;
    for (var s, l = [ ".*.", "*.", ".*", ".[].", "[].", ".[]" ], _loop = function _loop() {
      var n = f[p], r = n.split(".").pop(), e = l.some((function(t) {
        return n.includes(t);
      })), a = getWildcardPropertyInChain(t, n, e);
      if (!a.length) return {
        v: o = false
      };
      o = !e;
      for (var i = 0; i < a.length; i += 1) {
        var u = "string" == typeof r && void 0 !== a[i].base[r];
        o = e ? u || o : u && o;
      }
    }, p = 0; p < f.length; p += 1) if (s = _loop()) return s.v;
    return o;
  }
  function jsonPruner(e, r, n, a, t, i) {
    var {nativeStringify: o} = i;
    if (0 === n.length && 0 === a.length) return logMessage(e, `${window.location.hostname}\n${o(r, null, 2)}\nStack trace:\n${(new Error).stack}`, true), 
    r && "object" == typeof r && logMessage(e, r, true, false), r;
    try {
      if (!1 === isPruningNeeded(e, r, n, a, t, i)) return r;
      n.forEach((function(n) {
        for (var a = n.path, t = n.value, i = getWildcardPropertyInChain(r, a, !0, [], t), o = i.length - 1; o >= 0; o -= 1) {
          var s = i[o];
          if (void 0 !== s && s.base) if (hit(e), Array.isArray(s.base)) try {
            var l = Number(s.prop);
            if (Number.isNaN(l)) continue;
            s.base.splice(l, 1);
          } catch (e) {
            console.error("Error while deleting array element", e);
          } else delete s.base[s.prop];
        }
      }));
    } catch (r) {
      logMessage(e, r);
    }
    return r;
  }
  function getPrunePath(t) {
    var r = ".[=].";
    if ("string" == typeof t && void 0 !== t && "" !== t) {
      var e = function(t) {
        for (var e = [], n = "", i = 0, a = false, s = false; i < t.length; ) {
          var u = t[i];
          if (a) n += u, "\\" === u ? s = !s : ("/" !== u || s || (a = false), s = false), 
          i += 1; else {
            if (" " === u || "\n" === u || "\t" === u || "\r" === u || "\f" === u || "\v" === u) {
              for (;i < t.length && /\s/.test(t[i]); ) i += 1;
              "" !== n && (e.push(n), n = "");
              continue;
            }
            if (t.startsWith(r, i)) {
              if (n += r, "/" === t[i += 5]) {
                a = true, s = false, n += "/", i += 1;
                continue;
              }
              continue;
            }
            n += u, i += 1;
          }
        }
        return "" !== n && e.push(n), e;
      }(t);
      return e.map((function(t) {
        var e = t.split(r), n = e[0], i = e[1];
        return void 0 !== i ? ("true" === i ? i = true : "false" === i ? i = false : i.startsWith("/") ? i = toRegExp(i) : "string" == typeof i && /^\d+$/.test(i) && (i = parseFloat(i)), 
        {
          path: n,
          value: i
        }) : {
          path: n
        };
      }));
    }
    return [];
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
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function isKeyInObject(t, r, e) {
    var n = r.split("."), _check3 = function _check(t, r) {
      if (null == t) return false;
      if (0 === r.length) return void 0 === e || ("string" == typeof t && e instanceof RegExp ? e.test(t) : t === e);
      var n = r[0], i = r.slice(1);
      if ("*" === n || "[]" === n) {
        if (Array.isArray(t)) return t.some((function(t) {
          return _check3(t, i);
        }));
        if ("object" == typeof t && null !== t) return Object.keys(t).some((function(r) {
          return _check3(t[r], i);
        }));
      }
      return !!Object.prototype.hasOwnProperty.call(t, n) && _check3(t[n], i);
    };
    return _check3(t, n);
  }
  function jsonPath(e, r, t, a, n) {
    var i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "", s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6], o = "$", l = ".", u = "..", p = "", c = "\\", f = ")", h = "[", v = "@", d = "contains", g = "equal", m = "exists", y = "greater_than", k = "greater_than_or_equal", P = "less_than", b = "less_than_or_equal", S = "not_equal", x = "regex", $ = [ "==", "!=", "<=", ">=", "*=", "=~", "<", ">", "=" ], C = 1e5, w = /^[A-Za-z_$][\w$]*$/;
    function isObjectLike(e) {
      return null !== e && "object" == typeof e;
    }
    function isPlainObject(e) {
      if (!isObjectLike(e) || Array.isArray(e)) return false;
      var r = Object.getPrototypeOf(e);
      return r === Object.prototype || null === r;
    }
    function isQuoteCharacter(e) {
      return "'" === e || '"' === e;
    }
    function isEscaped(e, r) {
      for (var t = 0, a = r - 1; a >= 0 && e[a] === c; ) t += 1, a -= 1;
      return t % 2 != 0;
    }
    function stripQuotes(e) {
      var r = e.trim();
      if (r.length < 2) return r;
      var t = r[0], a = r[r.length - 1];
      return isQuoteCharacter(t) && t === a ? r.slice(1, -1).split("\\'").join("'").split('\\"').join('"').split(c + c).join(c) : r;
    }
    function appendPath(e, r) {
      return "number" == typeof r || /^\d+$/.test(String(r)) ? `${e}[${r}]` : w.test(String(r)) ? `${e}.${r}` : `${e}['${String(r).replace(/'/g, "\\'")}']`;
    }
    function createCandidate(e, r, t, a) {
      return {
        key: t,
        parent: r,
        path: a,
        value: e
      };
    }
    function walkTopLevelChars(e, r) {
      for (var t = 0, a = 0, n = 0, i = null, s = 0; s < e.length; s += 1) {
        var o = e[s];
        if (i) {
          if (o !== i || isEscaped(e, s) || (i = null), r(s, false)) return;
        } else if (isQuoteCharacter(o)) {
          if (i = o, r(s, false)) return;
        } else {
          var l = true;
          if (o === h ? t += 1 : "]" === o ? t -= 1 : "{" === o ? a += 1 : "}" === o ? a -= 1 : "(" === o ? n += 1 : o === f ? n -= 1 : l = false, 
          r(s, !l && 0 === t && 0 === a && 0 === n)) return;
        }
      }
    }
    function findClosingBracket(e, r) {
      for (var t = 0, a = null, n = r; n < e.length; n += 1) {
        var i = e[n];
        if (a) i !== a || isEscaped(e, n) || (a = null); else if (isQuoteCharacter(i)) a = i; else if (i !== h) {
          if ("]" === i && 0 === (t -= 1)) return n;
        } else t += 1;
      }
      return -1;
    }
    function splitByTopLevelToken(e, r) {
      var t = [], a = p, n = new Set;
      return walkTopLevelChars(e, (function(i, s) {
        if (!n.has(i)) if (s && e.startsWith(r, i)) {
          t.push(a.trim()), a = p;
          for (var o = 1; o < r.length; o += 1) n.add(i + o);
        } else a += e[i];
      })), a !== p && t.push(a.trim()), t;
    }
    function normalizeFilterPath(e) {
      var r = e.trim();
      return r.startsWith(v) && (r = r.slice(1)), r === p ? o : r.startsWith(o) ? r : r.startsWith(l) || r.startsWith(u) || r.startsWith(h) ? `${o}${r}` : `${o}${l}${r}`;
    }
    function parseFilterExpression(e) {
      var r = e.trim();
      if (r.startsWith("(") && r.endsWith(f)) {
        for (var t = 0, a = null, n = false, i = 0; i < r.length; i += 1) {
          var s = r[i];
          if (a) s !== a || isEscaped(r, i) || (a = null); else if (isQuoteCharacter(s)) a = s; else if ("(" === s) t += 1; else if (s === f && 0 === (t -= 1)) {
            n = i === r.length - 1;
            break;
          }
        }
        n && (r = r.slice(1, -1).trim());
      }
      var u = splitByTopLevelToken(r, "||");
      if (u.length > 1) return {
        conditions: u.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "or"
      };
      var p = splitByTopLevelToken(r, "&&");
      if (p.length > 1) return {
        conditions: p.map((function(e) {
          return parseFilterExpression(e);
        })),
        operator: "and"
      };
      if (r.startsWith("!") && !r.startsWith("!=")) return {
        condition: parseFilterExpression(r.slice(1).trim()),
        operator: "not"
      };
      var c, C, w = (C = null, walkTopLevelChars(c = r, (function(e, r) {
        if (!r) return false;
        for (var t = null, a = 0; a < $.length; a += 1) {
          var n = $[a];
          c.startsWith(n, e) && (null === t || n.length > t.length) && (t = n);
        }
        return null !== t && (C = {
          index: e,
          operator: t
        }, true);
      })), C);
      if (!w) return {
        operator: m,
        selectorPath: normalizeFilterPath(r)
      };
      var W = r.slice(0, w.index).trim(), O = r.slice(w.index + w.operator.length).trim(), A = g;
      "!=" === w.operator ? A = S : "<" === w.operator ? A = P : "<=" === w.operator ? A = b : ">" === w.operator ? A = y : ">=" === w.operator ? A = k : "*=" === w.operator ? A = d : ("=~" === w.operator || "=" === w.operator && /^\/.*\/[a-z]*$/i.test(O)) && (A = x);
      var j, E, L = O.trim(), F = L === o || L.startsWith(o + l) || L.startsWith(o + h), M = L === v || L.startsWith(v + l) || L.startsWith(v + h);
      return F || M ? {
        comparisonSelectorPath: normalizeFilterPath(L),
        operator: A,
        resolveComparisonAgainstRoot: F,
        selectorPath: normalizeFilterPath(W)
      } : {
        comparisonValue: (j = O, E = j.trim(), "true" === E || "false" !== E && ("null" === E ? null : /^-?\d+(?:\.\d+)?$/.test(E) ? Number(E) : /^\/.*\/[a-z]*$/i.test(E) ? toRegExp(E) : stripQuotes(E))),
        operator: A,
        selectorPath: normalizeFilterPath(W)
      };
    }
    function parseBracketStep(e, r) {
      if ("*" === e) return {
        mode: "wildcard",
        recursive: r
      };
      if (e.startsWith("?")) return {
        filter: parseFilterExpression(e.slice(1)),
        mode: "filter",
        recursive: r
      };
      if (/^\(@\.length(?:-\d+)?\)$/.test(e)) {
        var t = e.match(/^\(@\.length(?:-(\d+))?\)$/);
        return {
          mode: "computed-index",
          recursive: r,
          subtractLength: t && t[1] ? Number(t[1]) : 0
        };
      }
      var a = function(e) {
        var r = [], t = p;
        return walkTopLevelChars(e, (function(a, n) {
          n && ":" === e[a] ? (r.push(t.trim()), t = p) : t += e[a];
        })), r.push(t.trim()), r;
      }(e);
      if (a.length > 1) {
        var n = a[0] === p ? void 0 : Number(a[0]);
        return {
          mode: "slice",
          recursive: r,
          slice: {
            end: a[1] === p ? void 0 : Number(a[1]),
            start: n,
            step: a.length > 2 && a[2] !== p ? Number(a[2]) : 1
          }
        };
      }
      var i = function(e, r) {
        var t = [], a = p;
        return walkTopLevelChars(e, (function(n, i) {
          i && e[n] === r ? (t.push(a.trim()), a = p) : a += e[n];
        })), a !== p && t.push(a.trim()), t;
      }(e, ",");
      return i.every((function(e) {
        return /^-?\d+$/.test(e);
      })) ? {
        indexes: i.map((function(e) {
          return Number(e);
        })),
        mode: "index",
        recursive: r
      } : {
        mode: "property",
        properties: i.map((function(e) {
          return r = e.trim(), /^\/.*\/[a-z]*$/i.test(r) ? toRegExp(r) : stripQuotes(r);
          var r;
        })),
        recursive: r
      };
    }
    function parseJsonPathSelector(e) {
      var r = [], t = 0;
      for (e.startsWith(o) && (t = 1); t < e.length; ) {
        var a = false;
        if (e.startsWith(u, t) ? (a = true, t += 2) : e[t] === l && (t += 1), t >= e.length) break;
        if (e[t] !== h) {
          if ("*" !== e[t]) {
            for (var n = t; n < e.length && e[n] !== l && e[n] !== h; ) n += 1;
            var i = e.slice(t, n).trim();
            i && r.push({
              mode: "property",
              properties: [ i ],
              recursive: a
            }), t = n;
          } else r.push({
            mode: "wildcard",
            recursive: a
          }), t += 1;
        } else {
          var s = findClosingBracket(e, t);
          if (-1 === s) throw new Error(`Invalid JSONPath expression: ${e}`);
          var p = e.slice(t + 1, s).trim();
          r.push(parseBracketStep(p, a)), t = s + 1;
        }
      }
      return {
        steps: r
      };
    }
    function buildAppendUpdater(e, r, t) {
      var a, n = e.trim();
      if (n.startsWith("{") || n.startsWith(h)) a = r(parseKeywordValue(n)); else {
        var i = t(n);
        if (!i || i.shouldReplaceArgument) throw new Error(`Invalid append value: ${e}`);
        a = i.constantValue;
      }
      return function(e) {
        return Array.isArray(e) ? Array.isArray(a) ? e.concat(a) : e.concat([ a ]) : isPlainObject(e) && isPlainObject(a) ? Object.assign({}, e, a) : "string" == typeof e && "string" == typeof a ? `${e}${a}` : a;
      };
    }
    function buildSetUpdater(e, r, t) {
      var a = e.trim();
      if (a.startsWith("replace(") && a.endsWith(f)) return function(e, r) {
        var t = r(e.slice(8, -1));
        if ("string" != typeof t.regex || "string" != typeof t.replacement) throw new Error('Invalid replace payload: "regex" and "replacement" must be strings');
        var a = t.regex.startsWith("/") ? toRegExp(t.regex) : new RegExp(t.regex, t.flags || p), n = parseKeywordValue(t.replacement);
        return function(e) {
          return "string" != typeof e ? e : e.replace(a, n);
        };
      }(a, r);
      var n = t(a);
      if (!n) throw new Error(`Invalid set value: ${e}`);
      return function(e) {
        return getJsonSetValue(e, n);
      };
    }
    function getChildCandidates(e) {
      if (!isObjectLike(e.value)) return [];
      if (ArrayBuffer.isView(e.value)) return [];
      for (var r = Object.keys(e.value), t = [], a = 0; a < r.length; a += 1) {
        var n = r[a];
        t.push(createCandidate(e.value[n], e.value, n, appendPath(e.path, n)));
      }
      return t;
    }
    function getRecursiveCandidates(r) {
      var t = [ r ], a = [ 0 ], n = new WeakSet;
      isObjectLike(r.value) && n.add(r.value);
      for (var i = false, s = isObjectLike(r.value) ? 1 : 0, o = getChildCandidates(r), l = 0; l < o.length; l += 1) {
        if (isObjectLike(o[l].value)) {
          if (n.has(o[l].value)) continue;
          if (n.add(o[l].value), (s += 1) >= C) {
            i = true;
            break;
          }
        }
        t.push(o[l]), a.push(1);
      }
      for (var u = 1; u < t.length && !i; ) {
        var p = a[u] + 1;
        if (p > 1e3) {
          i = true;
          break;
        }
        for (var c = getChildCandidates(t[u]), f = 0; f < c.length; f += 1) {
          if (isObjectLike(c[f].value)) {
            if (n.has(c[f].value)) continue;
            if (n.add(c[f].value), (s += 1) >= C) {
              i = true;
              break;
            }
          }
          t.push(c[f]), a.push(p);
        }
        u += 1;
      }
      return i && logMessage(e, "JSONPath recursive descent exceeded its traversal budget, results may be incomplete"), 
      t;
    }
    function resolveIndex(e, r) {
      return r < 0 ? e + r : r;
    }
    function applyDirectStep(e, r) {
      var t = [];
      if ("property" === r.mode) {
        if (!isObjectLike(e.value) || !r.properties) return t;
        for (var a = new Set, n = 0; n < r.properties.length; n += 1) {
          var i = r.properties[n];
          if (i instanceof RegExp) for (var s = Object.keys(e.value), o = 0; o < s.length; o += 1) {
            var l = s[o];
            i.lastIndex = 0, i.test(l) && !a.has(l) && (a.add(l), t.push(createCandidate(e.value[l], e.value, l, appendPath(e.path, l))));
          } else !a.has(i) && Object.prototype.hasOwnProperty.call(e.value, i) && (a.add(i), 
          t.push(createCandidate(e.value[i], e.value, i, appendPath(e.path, i))));
        }
        return t;
      }
      if ("wildcard" === r.mode) return getChildCandidates(e);
      if ("index" === r.mode) {
        if (!Array.isArray(e.value) || !r.indexes) return t;
        for (var u = 0; u < r.indexes.length; u += 1) {
          var p = resolveIndex(e.value.length, r.indexes[u]);
          p >= 0 && p < e.value.length && t.push(createCandidate(e.value[p], e.value, p, appendPath(e.path, p)));
        }
        return t;
      }
      if ("computed-index" === r.mode) {
        if (!Array.isArray(e.value)) return t;
        var c = e.value.length - (r.subtractLength || 0);
        return c >= 0 && c < e.value.length && t.push(createCandidate(e.value[c], e.value, c, appendPath(e.path, c))), 
        t;
      }
      if ("slice" === r.mode) {
        if (!Array.isArray(e.value) || !r.slice) return t;
        for (var f = function(e, r) {
          var t, a, n = [], i = void 0 === r.step ? 1 : r.step;
          if (0 === i) return n;
          if (t = void 0 === r.start ? i > 0 ? 0 : e - 1 : resolveIndex(e, r.start), a = void 0 === r.end ? i > 0 ? e : -1 : resolveIndex(e, r.end), 
          i > 0) {
            for (var s = Math.max(0, t); s < Math.min(e, a); s += i) n.push(s);
            return n;
          }
          for (var o = Math.min(e - 1, t); o > Math.max(-1, a); o += i) n.push(o);
          return n;
        }(e.value.length, r.slice), h = 0; h < f.length; h += 1) {
          var v = f[h];
          t.push(createCandidate(e.value[v], e.value, v, appendPath(e.path, v)));
        }
      }
      return t;
    }
    function evaluateSelector(e, t) {
      function matchesFilterValue(e, t) {
        if ("conditions" in t) return "and" === t.operator ? t.conditions.every((function(r) {
          return matchesFilterValue(e, r);
        })) : t.conditions.some((function(r) {
          return matchesFilterValue(e, r);
        }));
        if ("condition" in t) return !matchesFilterValue(e, t.condition);
        var a = evaluateSelector(e, parseJsonPathSelector(t.selectorPath));
        if (t.operator === m) return a.length > 0;
        var n = t.comparisonValue;
        if (t.comparisonSelectorPath) {
          var i = evaluateSelector(t.resolveComparisonAgainstRoot ? r : e, parseJsonPathSelector(t.comparisonSelectorPath));
          if (0 === i.length) return false;
          n = i[0].value;
        }
        for (var s = 0; s < a.length; s += 1) {
          var o = a[s].value;
          if (t.operator !== d) {
            if (t.operator !== x) {
              if (t.operator === g && o === n) return true;
              if (t.operator === S && o !== n) return true;
              if (t.operator === P && o < n) return true;
              if (t.operator === b && o <= n) return true;
              if (t.operator === y && o > n) return true;
              if (t.operator === k && o >= n) return true;
            } else if ("string" == typeof o && n instanceof RegExp && (n.lastIndex = 0, n.test(o))) return true;
          } else if ("string" == typeof o && o.includes(String(n))) return true;
        }
        return false;
      }
      function applyFilterStep(e, r) {
        for (var t = [], a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (Array.isArray(n.value)) for (var i = 0; i < n.value.length; i += 1) matchesFilterValue(n.value[i], r) && t.push(createCandidate(n.value[i], n.value, i, appendPath(n.path, i))); else matchesFilterValue(n.value, r) && t.push(n);
        }
        return t;
      }
      for (var a = [ createCandidate(e, null, null, o) ], n = 0; n < t.steps.length; n += 1) {
        var i = t.steps[n];
        if ("filter" === i.mode && i.filter) {
          var s = a;
          if (i.recursive) {
            s = [];
            for (var l = 0; l < a.length; l += 1) for (var u = getRecursiveCandidates(a[l]), p = 0; p < u.length; p += 1) s.push(u[p]);
          }
          a = applyFilterStep(s, i.filter);
        } else {
          for (var c = [], f = 0; f < a.length; f += 1) for (var h = a[f], v = i.recursive ? getRecursiveCandidates(h) : [ h ], $ = 0; $ < v.length; $ += 1) for (var C = applyDirectStep(v[$], i), w = 0; w < C.length; w += 1) c.push(C[w]);
          a = c;
        }
      }
      return a;
    }
    var W = false;
    function markMutated() {
      W = true;
    }
    if (!isObjectLike(r)) return r;
    var O, A = (O = a) && O.nativeParse ? O.nativeParse : JSON.parse, j = function(e) {
      return e && e.nativeStringify ? e.nativeStringify : JSON.stringify;
    }(a), E = (new Error).stack || "";
    if (i && !matchStackTrace(i, E)) return r;
    if (!t) return logMessage(e, `${window.location.hostname}\n${j(r, null, 2)}\nStack trace:\n${E}`, true), 
    logMessage(e, r, true, false), r;
    try {
      for (var L = function(e, r, t) {
        var a, n, i = function(e) {
          var r = -1, t = "remove", a = 0;
          return walkTopLevelChars(e, (function(n, i) {
            return !!i && (e.startsWith("+=", n) ? (r = n, t = "append", a = 2, !0) : "=" === e[n] && (r = n, 
            t = "set", a = 1, !0));
          })), -1 === r ? {
            mode: "remove",
            selectorPart: e.trim(),
            valuePart: p
          } : {
            mode: t,
            selectorPart: e.slice(0, r).trim(),
            valuePart: e.slice(r + a).trim()
          };
        }(e), s = function(e) {
          for (var r = [], t = e.trim(); t.startsWith("[?"); ) {
            var a = findClosingBracket(t, 0);
            if (-1 === a) break;
            var n = t.slice(1, a);
            r.push(parseFilterExpression(n.slice(1))), t = t.slice(a + 1).trim();
          }
          return {
            guards: r,
            selectorPart: t
          };
        }(i.selectorPart), c = parseJsonPathSelector((a = s.selectorPart, (n = a.trim()) === p ? o : n.startsWith(o) ? n : n.startsWith(l) || n.startsWith(h) || n.startsWith(u) ? `${o}${n}` : `${o}${l}${n}`)), f = {
          mode: i.mode
        };
        return "append" === i.mode ? f = {
          mode: "append",
          updater: buildAppendUpdater(i.valuePart, r, t)
        } : "set" === i.mode && (f = {
          mode: "set",
          updater: buildSetUpdater(i.valuePart, r, t)
        }), {
          guards: s.guards,
          mutation: f,
          selector: c
        };
      }(t, A, (function(r) {
        return parseJsonSetArgumentValue(e, r, A);
      })), F = 0; F < L.guards.length; F += 1) {
        if (0 === evaluateSelector(r, {
          steps: [ {
            filter: L.guards[F],
            mode: "filter",
            recursive: !1
          } ]
        }).length) return r;
      }
      var M = evaluateSelector(r, L.selector);
      if (s) return M.length > 0 && n && n(), r;
      if (!("remove" === L.mutation.mode || "string" == typeof e.name && e.name.startsWith("trusted-"))) return logMessage(e, "JSONPath set and append operations are allowed only in trusted scriptlets"), 
      r;
      if ("remove" === L.mutation.mode) return function(e) {
        for (var r = new Set, t = new Map, a = 0; a < e.length; a += 1) {
          var n = e[a];
          if (null !== n.parent && null !== n.key && !r.has(n.path)) if (r.add(n.path), Array.isArray(n.parent)) {
            var i = t.get(n.parent) || [];
            i.push(Number(n.key)), t.set(n.parent, i);
          } else delete n.parent[n.key], markMutated();
        }
        t.forEach((function(e, r) {
          for (var t = Array.from(new Set(e)).sort((function(e, r) {
            return r - e;
          })), a = 0; a < t.length; a += 1) {
            var n = t[a];
            n >= 0 && n < r.length && (r.splice(n, 1), markMutated());
          }
        }));
      }(M), W && n && n(), r;
      L.mutation.updater && (r = function(e, r, t) {
        for (var a = new Set, n = e, i = 0; i < r.length; i += 1) {
          var s = r[i];
          a.has(s.path) || (a.add(s.path), null !== s.parent || null !== s.key || s.path !== o ? null !== s.parent && null !== s.key && (s.parent[s.key] = t(s.parent[s.key]), 
          markMutated()) : (n = t(n), markMutated()));
        }
        return n;
      }(r, M, L.mutation.updater), W && n && n());
    } catch (r) {
      logMessage(e, `JSONPath processing failed for expression '${t}': ${r.message}`);
    }
    return r;
  }
  function resolveJsonSyntaxMode(t, r) {
    var e = "legacy", o = "jsonpath", s = "string" == typeof r ? r.trim().toLowerCase() : "";
    if (s === e || s === o) return {
      mode: s
    };
    var a = "string" == typeof t ? t.trim() : "";
    return a.startsWith("$") || a.startsWith("[?") || a.startsWith(".") ? {
      mode: o
    } : {
      mode: e
    };
  }
  function getJsonSetValue(e, t) {
    return t.shouldReplaceArgument ? "string" == typeof e ? e.replace(t.replaceRegexValue, t.constantValue) : e : t.shouldMergeJsonValue && null !== e && "object" == typeof e && !Array.isArray(e) && null !== t.constantValue && "object" == typeof t.constantValue && !Array.isArray(t.constantValue) ? Object.assign({}, e, t.constantValue) : t.constantValue;
  }
  function parseJsonSetArgumentValue(e, l, a) {
    var r, n = "json:", s = "replace:", o = "", t = false, u = false, i = false;
    if (l.startsWith(s)) {
      var c = extractRegexAndReplacement(l);
      if (!c) return logMessage(e, `Invalid argument value format: ${l}`), null;
      o = c.regexPart, i = (r = parseKeywordValue(c.replacementPart)) !== c.replacementPart, 
      t = true;
    } else if (l.startsWith(n)) try {
      var f = l.slice(n.length), p = parseKeywordValue(f);
      i = p !== f, r = a(p), u = !0;
    } catch (a) {
      return logMessage(e, `Invalid JSON argument value: ${l}`), null;
    } else {
      var m = noopArray(), d = noopObject(), g = parseKeywordValue(l);
      if (i = g !== l, "undefined" === g) r = void 0; else if ("false" === g) r = false; else if ("true" === g) r = true; else if ("null" === g) r = null; else if ("NaN" === g) r = NaN; else if ("emptyArr" === g || "[]" === g) r = m; else if ("emptyObj" === g || "{}" === g) r = d; else if ("noopFunc" === g) r = noopFunc; else if ("noopCallbackFunc" === g) r = noopCallbackFunc; else if ("trueFunc" === g) r = trueFunc; else if ("falseFunc" === g) r = falseFunc; else if ("throwFunc" === g) r = throwFunc; else if ("noopPromiseResolve" === g) r = noopPromiseResolve; else if ("noopPromiseReject" === g) r = noopPromiseReject; else if (/^-?\d+$/.test(g)) {
        if (r = parseFloat(g), nativeIsNaN(r)) return null;
      } else r = g;
    }
    return {
      constantValue: r,
      replaceRegexValue: o,
      shouldReplaceArgument: t,
      shouldMergeJsonValue: u,
      hasTimeKeywords: i
    };
  }
  function parseKeywordValue(r) {
    var e = /\$(?:currentISODate|currentDate|now)\$/g;
    if ("string" != typeof r) return r;
    if (-1 === r.search(e)) return r;
    var t = new Date;
    return r.replace(e, (function(r) {
      switch (r) {
       case "$now$":
        return t.getTime().toString();

       case "$currentDate$":
        return t.toString();

       case "$currentISODate$":
        return t.toISOString();

       default:
        return r;
      }
    }));
  }
  function noopArray() {
    return [];
  }
  function noopObject() {
    return {};
  }
  function noopCallbackFunc() {
    return noopFunc;
  }
  function noopFunc() {}
  function trueFunc() {
    return true;
  }
  function falseFunc() {
    return false;
  }
  function throwFunc() {
    throw new Error;
  }
  function noopPromiseReject() {
    return Promise.reject();
  }
  function noopPromiseResolve() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "{}", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "basic";
    if ("undefined" != typeof Response) {
      var n = new Response(e, {
        headers: {
          "Content-Length": `${e.length}`
        },
        status: 200,
        statusText: "OK"
      });
      return "opaque" === s ? Object.defineProperties(n, {
        body: {
          value: null
        },
        status: {
          value: 0
        },
        ok: {
          value: false
        },
        statusText: {
          value: ""
        },
        url: {
          value: ""
        },
        type: {
          value: s
        }
      }) : Object.defineProperties(n, {
        url: {
          value: t
        },
        type: {
          value: s
        }
      }), Promise.resolve(n);
    }
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    jsonPrune.apply(this, updatedArgs);
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
  const NAME = "ubo-json-edit";
  const ENTRIES = [[["..props.children.*[?.key==\"admiral-script\"]"],["mensjournal.com"],[]]];
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
