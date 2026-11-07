/* Süzgeç scriptlet: ubo-remove-node-text — generated, do not edit */
(() => {
  'use strict';
  const run = function removeNodeText(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeNodeText(source, nodeName, textMatch, parentSelector) {
    var {selector: selector, nodeNameMatch: nodeNameMatch, textContentMatch: textContentMatch} = parseNodeTextParams(nodeName, textMatch);
    var handleNodes = function handleNodes(nodes) {
      return nodes.forEach((function(node) {
        var shouldReplace = isTargetNode(node, nodeNameMatch, textContentMatch);
        if (shouldReplace) {
          var ALL_TEXT_PATTERN = /^[^]*$/;
          var REPLACEMENT = "";
          replaceNodeText(source, node, ALL_TEXT_PATTERN, REPLACEMENT);
        }
      }));
    };
    if (document.documentElement) {
      handleExistingNodes(selector, handleNodes, parentSelector);
    }
    observeDocumentWithTimeout((function(mutations) {
      return handleMutations(mutations, handleNodes, selector, parentSelector);
    }));
  }
  function observeDocumentWithTimeout(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
      subtree: true,
      childList: true
    }, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e4, o = new MutationObserver((function(n, o) {
      o.disconnect(), e(n, o), o.observe(document.documentElement, t);
    }));
    o.observe(document.documentElement, t), "number" == typeof n && setTimeout((function() {
      return o.disconnect();
    }), n);
  }
  function handleExistingNodes(e, n, o) {
    (o ? document.querySelectorAll(o) : [ document ]).forEach((function(o) {
      return function(o) {
        if ("#text" === e) {
          var r = nodeListToArray(o.childNodes).filter((function(e) {
            return e.nodeType === Node.TEXT_NODE;
          }));
          n(r);
        } else {
          var t = nodeListToArray(o.querySelectorAll(e));
          n(t);
        }
      }(o);
    }));
  }
  function handleMutations(n, d, e, o) {
    var t = getAddedNodes(n);
    e && o ? t.forEach((function() {
      handleExistingNodes(e, d, o);
    })) : d(t);
  }
  function replaceNodeText(e, t, n, r) {
    var {textContent: a} = t;
    if (a) {
      var i = a.replace(n, r);
      if ("SCRIPT" === t.nodeName) i = getTrustedTypesApi(e).createScript(i);
      t.textContent = i, hit(e);
    }
  }
  function isTargetNode(e, t, n) {
    var {nodeName: o, textContent: s} = e, a = o.toLowerCase();
    return null !== s && "" !== s && (t instanceof RegExp ? t.test(a) : t === a) && (n instanceof RegExp ? n.test(s) : s.includes(n));
  }
  function parseNodeTextParams(t, e) {
    var a, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, r = "/", s = !(t.startsWith(r) && t.endsWith(r)), o = s ? t : "*", h = s ? t : toRegExp(t), i = e.startsWith(r) ? toRegExp(e) : e;
    return n && (a = n.startsWith(r) ? toRegExp(n) : n), {
      selector: o,
      nodeNameMatch: h,
      textContentMatch: i,
      patternMatch: a
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
  function nodeListToArray(r) {
    for (var n = [], o = 0; o < r.length; o += 1) n.push(r[o]);
    return n;
  }
  function getAddedNodes(d) {
    for (var e = [], r = 0; r < d.length; r += 1) for (var {addedNodes: n} = d[r], o = 0; o < n.length; o += 1) e.push(n[o]);
    return e;
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
  function getTrustedTypesApi(t) {
    var r, e = null == t || null === (r = t.api) || void 0 === r ? void 0 : r.policy;
    if (e) return e;
    var n = "AGPolicy", i = window.trustedTypes, u = !!i, c = {
      HTML: "TrustedHTML",
      Script: "TrustedScript",
      ScriptURL: "TrustedScriptURL"
    };
    if (!u) return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      },
      create: function create(t, r) {
        return r;
      },
      getAttributeType: function getAttributeType() {
        return null;
      },
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e) {
        return e;
      },
      getPropertyType: function getPropertyType() {
        return null;
      },
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e) {
        return e;
      },
      isHTML: function isHTML() {
        return false;
      },
      isScript: function isScript() {
        return false;
      },
      isScriptURL: function isScriptURL() {
        return false;
      }
    };
    var o = i.createPolicy(n, {
      createHTML: function createHTML(t) {
        return t;
      },
      createScript: function createScript(t) {
        return t;
      },
      createScriptURL: function createScriptURL(t) {
        return t;
      }
    }), createHTML = function createHTML(t) {
      return o.createHTML(t);
    }, createScript = function createScript(t) {
      return o.createScript(t);
    }, createScriptURL = function createScriptURL(t) {
      return o.createScriptURL(t);
    }, create = function create(t, r) {
      switch (t) {
       case c.HTML:
        return createHTML(r);

       case c.Script:
        return createScript(r);

       case c.ScriptURL:
        return createScriptURL(r);

       default:
        return r;
      }
    }, p = i.getAttributeType.bind(i), T = i.getPropertyType.bind(i), s = i.isHTML.bind(i), a = i.isScript.bind(i), f = i.isScriptURL.bind(i);
    return {
      name: n,
      isSupported: u,
      TrustedType: c,
      createHTML: createHTML,
      createScript: createScript,
      createScriptURL: createScriptURL,
      create: create,
      getAttributeType: p,
      convertAttributeToTrusted: function convertAttributeToTrusted(t, r, e, n, i) {
        var u = p(t, r, n, i);
        return u ? create(u, e) : e;
      },
      getPropertyType: T,
      convertPropertyToTrusted: function convertPropertyToTrusted(t, r, e, n) {
        var i = T(t, r, n);
        return i ? create(i, e) : e;
      },
      isHTML: s,
      isScript: a,
      isScriptURL: f
    };
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeNodeText.apply(this, updatedArgs);
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
  const NAME = "ubo-remove-node-text";
  const ENTRIES = [[["script","ad_block"],["birsenaltuntas.com"],[]],[["script","/lastAdTime|openPopup/"],["cizgivedizi.com"],[]],[["#text","reklam_linki"],["bugunkibris.com"],[]],[["script","openRandomSite"],["efullizle.com"],[]],[["script","popUnder"],["doedaturkifsa6.blog","doedaturkifsa7.blog","doedaturkifsa8.blog","doedaturkifsa9.blog","doedaturkifsa10.blog","doedaturkifsa11.blog","doedaturkifsa12.blog","doedaturkifsa13.blog","doedaturkifsa14.blog","doedaturkifsa15.blog","doedaturkifsa16.blog","doedaturkifsa17.blog","doedaturkifsa18.blog","doedaturkifsa19.blog","doedaturkifsa20.blog","doedaturkifsa21.blog","doedaturkifsa22.blog","doedaturkifsa23.blog","doedaturkifsa24.blog","doedaturkifsa25.blog","doedaturkifsa26.blog","doedaturkifsa27.blog","doedaturkifsa28.blog","doedaturkifsa29.blog","doedaturkifsa30.blog","doedaturkifsa31.blog","doedaturkifsa32.blog","doedaturkifsa33.blog","doedaturkifsa34.blog","doedaturkifsa35.blog"],[]],[["script","LAST_POP"],["turkporoclub1.sbs","turkporoclub2.sbs","turkporoclub3.sbs","turkporoclub4.sbs","turkporoclub5.sbs","turkporoclub6.sbs","turkporoclub7.sbs","turkporoclub8.sbs","turkporoclub9.sbs","turkporoclub10.sbs","turkporoclub11.sbs","turkporoclub12.sbs","turkporoclub13.sbs","turkporoclub14.sbs","turkporoclub15.sbs","turkporoclub16.sbs","turkporoclub17.sbs","turkporoclub18.sbs","turkporoclub19.sbs","turkporoclub20.sbs","turkporoclub21.sbs","turkporoclub22.sbs","turkporoclub23.sbs","turkporoclub24.sbs","turkporoclub25.sbs","turkporoclub26.sbs","turkporoclub27.sbs","turkporoclub28.sbs","turkporoclub29.sbs","turkporoclub30.sbs"],[]],[["script","reklamAcildi"],["turkifsalife73.lat"],[]]];
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
