/* Süzgeç scriptlet: ubo-aeld — generated, do not edit */
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
  const NAME = "ubo-aeld";
  const ENTRIES = [[["mouseup","sendClickEvent"],["search.rakuten.co.jp"],[]],[["","redirect"],["f6s.com"],[]]];
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
