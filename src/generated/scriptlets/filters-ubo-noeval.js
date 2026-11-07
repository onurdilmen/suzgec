/* Süzgeç scriptlet: ubo-noeval — generated, do not edit */
(() => {
  'use strict';
  const run = function noeval(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function noeval(source) {
    window.eval = function evalWrapper(s) {
      hit(source);
      logMessage(source, `AdGuard has prevented eval:\n${s}`, true);
    }.bind();
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
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    noeval.apply(this, updatedArgs);
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
  const NAME = "ubo-noeval";
  const ENTRIES = [[[],["youjizz.com"],[]],[[],["bigtitsxxxsex.com"],[]],[[],["watchmygf.me"],[]],[[],["imgclick.net"],[]],[[],["met.bz"],[]],[[],["vidoza.net"],[]],[[],["nudecelebforum.com"],[]],[[],["1xxx-tube.com","asssex-hd.com","bigcockfreetube.com","bigdickwishes.com","enjoyfuck.com","freemomstube.com","fuckmonstercock.com","gobigtitsporn.com","gofetishsex.com","hard-tubesex.com","hd-analporn.com","hiddencamstube.com","kissmaturestube.com","lesbianfantasyxxx.com","modporntube.com","pornexpanse.com","pornokeep.com","pussytubeebony.com","tubesex.me","vintagesexpass.com","voyeur-pornvideos.com","voyeurspyporn.com","voyeurxxxfree.com","xxxtubenote.com","yummysextubes.com"],[]],[[],["uii.io"],[]],[[],["duellinksmeta.com"],[]],[[],["picbaron.com"],[]],[[],["latribunadelpaisvasco.com"],[]],[[],["fc.lc"],[]],[[],["444.coffee"],[]],[[],["up-load.io"],[]],[[],["xxx-image.com"],[]],[[],["arcadepunks.com"],[]],[[],["perfectmomsporn.com"],[]],[[],["tubexxxone.com"],[]],[[],["fuskator.com"],[]]];
  const EXCEPTIONS = [[null,["uii.io"]]];
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
