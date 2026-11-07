/* Süzgeç scriptlet: ubo-prevent-refresh — generated, do not edit */
(() => {
  'use strict';
  const run = function preventRefresh(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventRefresh(source, delaySec) {
    var getMetaElements = function getMetaElements() {
      var metaNodes = [];
      try {
        metaNodes = document.querySelectorAll('meta[http-equiv="refresh" i][content]');
      } catch (e) {
        try {
          metaNodes = document.querySelectorAll('meta[http-equiv="refresh"][content]');
        } catch (e) {
          logMessage(source, e);
        }
      }
      return Array.from(metaNodes);
    };
    var getMetaContentDelay = function getMetaContentDelay(metaElements) {
      var delays = metaElements.map((function(meta) {
        var contentString = meta.getAttribute("content");
        if (contentString.length === 0) {
          return null;
        }
        var contentDelay;
        var limiterIndex = contentString.indexOf(";");
        if (limiterIndex !== -1) {
          var delaySubstring = contentString.substring(0, limiterIndex);
          contentDelay = getNumberFromString(delaySubstring);
        } else {
          contentDelay = getNumberFromString(contentString);
        }
        return contentDelay;
      })).filter((function(delay) {
        return delay !== null;
      }));
      if (!delays.length) {
        return null;
      }
      var minDelay = delays.reduce((function(a, b) {
        return Math.min(a, b);
      }));
      return minDelay;
    };
    var stop = function stop() {
      var metaElements = getMetaElements();
      if (metaElements.length === 0) {
        return;
      }
      var secondsToRun = getNumberFromString(delaySec);
      if (secondsToRun === null) {
        secondsToRun = getMetaContentDelay(metaElements);
      }
      if (secondsToRun === null) {
        return;
      }
      var delayMs = secondsToRun * 1e3;
      setTimeout((function() {
        window.stop();
        hit(source);
      }), delayMs);
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", stop, {
        once: true
      });
    } else {
      stop();
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
  function getNumberFromString(n) {
    var r = parseInt(n, 10);
    return nativeIsNaN(r) ? null : r;
  }
  function logMessage(e, o) {
    var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], a = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], {name: n, verbose: g} = e;
    if (r || g) {
      var i = console.log;
      a ? i(`${n}: ${o}`) : Array.isArray(o) ? i(`${n}:`, ...o) : i(`${n}:`, o);
    }
  }
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventRefresh.apply(this, updatedArgs);
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
  const NAME = "ubo-prevent-refresh";
  const ENTRIES = [[[],["burdurweb.com"],[]]];
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
