/* Süzgeç scriptlet: ubo-remove-class — generated, do not edit */
(() => {
  'use strict';
  const run = function removeClass(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeClass(source, classNames, selector) {
    var applying = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "asap stay";
    if (!classNames) {
      return;
    }
    classNames = classNames.split(/\s*\|\s*/);
    var selectors = [];
    if (!selector) {
      selectors = classNames.map((function(className) {
        return `.${className}`;
      }));
    }
    var removeClassHandler = function removeClassHandler() {
      var nodes = new Set;
      if (selector) {
        var foundNodes = [];
        try {
          foundNodes = [].slice.call(document.querySelectorAll(selector));
        } catch (e) {
          logMessage(source, `Invalid selector arg: '${selector}'`);
        }
        foundNodes.forEach((function(n) {
          return nodes.add(n);
        }));
      } else if (selectors.length > 0) {
        selectors.forEach((function(s) {
          var elements = document.querySelectorAll(s);
          for (var i = 0; i < elements.length; i += 1) {
            var element = elements[i];
            nodes.add(element);
          }
        }));
      }
      var removed = false;
      nodes.forEach((function(node) {
        classNames.forEach((function(className) {
          if (node.classList.contains(className)) {
            node.classList.remove(className);
            removed = true;
          }
        }));
      }));
      if (removed) {
        hit(source);
      }
    };
    var CLASS_ATTR_NAME = [ "class" ];
    var flags = parseFlags(applying);
    var run = function run() {
      removeClassHandler();
      if (!flags.hasFlag(flags.STAY)) {
        return;
      }
      observeDOMChanges(removeClassHandler, true, CLASS_ATTR_NAME);
    };
    if (flags.hasFlag(flags.ASAP)) {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", removeClassHandler, {
          once: true
        });
      } else {
        removeClassHandler();
      }
    }
    if (document.readyState !== "complete" && flags.hasFlag(flags.COMPLETE)) {
      window.addEventListener("load", run, {
        once: true
      });
    } else if (flags.hasFlag(flags.STAY)) {
      if (!applying.includes(" ")) {
        removeClassHandler();
      }
      observeDOMChanges(removeClassHandler, true, CLASS_ATTR_NAME);
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
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function observeDOMChanges(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = new MutationObserver(throttle((function() {
      disconnect(), t(), connect();
    }), 20)), connect = function connect() {
      n.length > 0 ? i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e,
        attributeFilter: n
      }) : i.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: e
      });
    }, disconnect = function disconnect() {
      i.disconnect();
    };
    connect();
  }
  function parseFlags(t) {
    var e = "asap", n = "complete", a = "stay", r = new Set([ e, n, a ]), s = new Set(t.trim().split(" ").filter((function(t) {
      return r.has(t);
    })));
    return {
      ASAP: e,
      COMPLETE: n,
      STAY: a,
      hasFlag: function hasFlag(t) {
        return s.has(t);
      }
    };
  }
  function throttle(n, t) {
    var r, e = false, _wrapper5 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper5(...r), r = null);
      }), t));
    };
    return _wrapper5;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    removeClass.apply(this, updatedArgs);
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
  const NAME = "ubo-remove-class";
  const ENTRIES = [[["yildiz-pageskin","body"],["sinefilmizlesem.com"],[]]];
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
