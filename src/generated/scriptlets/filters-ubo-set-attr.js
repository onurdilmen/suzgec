/* Süzgeç scriptlet: ubo-set-attr — generated, do not edit */
(() => {
  'use strict';
  const run = function setAttr(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setAttr(source, selector, attr) {
    var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    if (!selector || !attr) {
      return;
    }
    var allowedValues = [ "true", "false" ];
    var shouldCopyValue = value.startsWith("[") && value.endsWith("]");
    var isValidValue = value.length === 0 || !nativeIsNaN(parseInt(value, 10)) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 32767 || allowedValues.includes(value.toLowerCase());
    if (!shouldCopyValue && !isValidValue) {
      logMessage(source, `Invalid attribute value provided: '${convertTypeToString(value)}'`);
      return;
    }
    var attributeHandler;
    if (shouldCopyValue) {
      attributeHandler = function attributeHandler(elem, attr, value) {
        var valueToCopy = elem.getAttribute(value.slice(1, -1));
        if (valueToCopy === null) {
          logMessage(source, `No element attribute found to copy value from: ${value}`);
        }
        elem.setAttribute(attr, valueToCopy);
      };
    }
    setAttributeBySelector(source, selector, attr, value, attributeHandler);
    observeDOMChanges((function() {
      return setAttributeBySelector(source, selector, attr, value, attributeHandler);
    }), true);
  }
  function setAttributeBySelector(e, t, l, o) {
    var r, c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : defaultAttributeSetter;
    try {
      r = document.querySelectorAll(t);
    } catch (l) {
      return void logMessage(e, `Failed to find elements matching selector "${t}"`);
    }
    if (r && 0 !== r.length) try {
      r.forEach((function(e) {
        return c(e, l, o);
      })), hit(e);
    } catch (t) {
      logMessage(e, `Failed to set [${l}="${o}"] to each of selected elements.`);
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
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function convertTypeToString(n) {
    return void 0 === n ? "undefined" : "object" == typeof n ? null === n ? "null" : objectToString(n) : String(n);
  }
  function defaultAttributeSetter(t, e, r) {
    return t.setAttribute(e, r);
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function throttle(n, t) {
    var r, e = false, _wrapper7 = function _wrapper() {
      for (var o = arguments.length, u = new Array(o), f = 0; f < o; f++) u[f] = arguments[f];
      e ? r = u : (n(...u), e = true, setTimeout((function() {
        e = false, r && (_wrapper7(...r), r = null);
      }), t));
    };
    return _wrapper7;
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setAttr.apply(this, updatedArgs);
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
  const NAME = "ubo-set-attr";
  const ENTRIES = [[[".player-container","data-ad","false"],["kanald.com.tr"],[]],[[".player-box","data-preroll-enabled","0"],["macboxtv29.xyz"],[]],[[":is(.watch-on-link-logo, li.post) img.ezlazyload[src^=\"data:image\"][data-ezsrc]","src","[data-ezsrc]"],["wnynewsnow.com"],[]]];
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
