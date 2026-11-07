/* Süzgeç scriptlet: ubo-nofab — generated, do not edit */
(() => {
  'use strict';
  const run = function preventFab(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function preventFab(source) {
    hit(source);
    var Fab = function Fab() {};
    Fab.prototype.check = noopFunc;
    Fab.prototype.clearEvent = noopFunc;
    Fab.prototype.emitEvent = noopFunc;
    Fab.prototype.on = function(a, b) {
      if (!a) {
        b();
      }
      return this;
    };
    Fab.prototype.onDetected = noopThis;
    Fab.prototype.onNotDetected = function(a) {
      a();
      return this;
    };
    Fab.prototype.setOption = noopFunc;
    Fab.prototype.options = {
      set: noopFunc,
      get: noopFunc
    };
    var fab = new Fab;
    var getSetFab = {
      get() {
        return Fab;
      },
      set() {}
    };
    var getsetfab = {
      get() {
        return fab;
      },
      set() {}
    };
    if (Object.prototype.hasOwnProperty.call(window, "FuckAdBlock")) {
      window.FuckAdBlock = Fab;
    } else {
      Object.defineProperty(window, "FuckAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "BlockAdBlock")) {
      window.BlockAdBlock = Fab;
    } else {
      Object.defineProperty(window, "BlockAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "SniffAdBlock")) {
      window.SniffAdBlock = Fab;
    } else {
      Object.defineProperty(window, "SniffAdBlock", getSetFab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "fuckAdBlock")) {
      window.fuckAdBlock = fab;
    } else {
      Object.defineProperty(window, "fuckAdBlock", getsetfab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "blockAdBlock")) {
      window.blockAdBlock = fab;
    } else {
      Object.defineProperty(window, "blockAdBlock", getsetfab);
    }
    if (Object.prototype.hasOwnProperty.call(window, "sniffAdBlock")) {
      window.sniffAdBlock = fab;
    } else {
      Object.defineProperty(window, "sniffAdBlock", getsetfab);
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
  function noopFunc() {}
  function noopThis() {
    return this;
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    preventFab.apply(this, updatedArgs);
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
  const NAME = "ubo-nofab";
  const ENTRIES = [[[],["spaste.com"],[]],[[],["motorradonline.de","zentralplus.ch"],[]],[[],["sotemnovinhas.com"],[]],[[],["mypapercraft.net"],[]],[[],["mel.fm"],[]],[[],["sataniabatch.blogspot.com"],[]],[[],["bitcoinminingforex.blogspot.com"],[]],[[],["firefaucet.win"],[]],[[],["odkrywamyzakryte.com"],[]]];
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
