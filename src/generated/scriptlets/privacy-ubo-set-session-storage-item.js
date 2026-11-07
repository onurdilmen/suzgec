/* Süzgeç scriptlet: ubo-set-session-storage-item — generated, do not edit */
(() => {
  'use strict';
  const run = function setSessionStorageItem(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function setSessionStorageItem(source, key, value) {
    if (typeof key === "undefined") {
      logMessage(source, "Item key should be specified.");
      return;
    }
    var validValue;
    try {
      validValue = getLimitedStorageItemValue(value);
    } catch (_unused) {
      logMessage(source, `Invalid storage item value: '${value}'`);
      return;
    }
    var {sessionStorage: sessionStorage} = window;
    if (validValue === "$remove$") {
      removeStorageItem(source, sessionStorage, key);
    } else {
      setStorageItem(source, sessionStorage, key, validValue);
    }
    hit(source);
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
  function nativeIsNaN(N) {
    return (Number.isNaN || window.isNaN)(N);
  }
  function setStorageItem(e, t, s, a) {
    try {
      t.setItem(s, a);
    } catch (t) {
      var o = `Unable to set storage item due to: ${t.message}`;
      logMessage(e, o);
    }
  }
  function removeStorageItem(e, t, o) {
    try {
      if (o.startsWith("/") && (o.endsWith("/") || o.endsWith("/i")) && isValidStrPattern(o)) {
        var r = toRegExp(o);
        Object.keys(t).forEach((function(e) {
          r.test(e) && t.removeItem(e);
        }));
      } else t.removeItem(o);
    } catch (t) {
      var s = `Unable to remove storage item due to: ${t.message}`;
      logMessage(e, s);
    }
  }
  function getLimitedStorageItemValue(e) {
    if ("string" != typeof e) throw new Error("Invalid value");
    var r;
    if (new Set([ "undefined", "false", "true", "null", "", "yes", "no", "on", "off", "accept", "accepted", "reject", "rejected", "allowed", "denied", "forbidden", "forever" ]).has(e.toLowerCase())) r = e; else if ("emptyArr" === e) r = "[]"; else if ("emptyObj" === e) r = "{}"; else if (/^\d+$/.test(e)) {
      if (r = parseFloat(e), nativeIsNaN(r)) throw new Error("Invalid value");
      if (Math.abs(r) > 32767) throw new Error("Invalid value");
    } else {
      if ("$remove$" !== e) throw new Error("Invalid value");
      r = "$remove$";
    }
    return r;
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
  function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  var updatedArgs = args ? [].concat(source).concat(args) : [ source ];
  try {
    setSessionStorageItem.apply(this, updatedArgs);
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
  const NAME = "ubo-set-session-storage-item";
  const ENTRIES = [[["_cX_S","$remove$"],["elconfidencial.com","journaldemontreal.com"],[]],[["CBSNEWS.features.fms-params","$remove$"],["cbsnews.com"],[]],[["/^ph_phc/","$remove$"],["darntough.com"],[]],[["/^ph_phc_/","$remove$"],["healf.com"],[]],[["nxt_is_incognito","false"],["advocate-news.com","akronnewsreporter.com","bocopreps.com","bostonherald.com","broomfieldenterprise.com","brushnewstribune.com","buffzone.com","burlington-record.com","canoncitydailyrecord.com","chicagotribune.com","chicoer.com","coloradodaily.com","coloradohometownweekly.com","courant.com","dailybreeze.com","dailybulletin.com","dailycamera.com","dailydemocrat.com","dailyfreeman.com","dailylocal.com","dailynews.com","dailypress.com","dailytribune.com","delcotimes.com","denverpost.com","eastbaytimes.com","eastbaytimes.com","eptrail.com","excelsiorcalifornia.com","fortmorgantimes.com","greeleytribune.com","journal-advocate.com","julesburgadvocate.com","lamarledger.com","lowellsun.com","macombdaily.com","mainlinemedianews.com","marinij.com","mcall.com","mendocinobeacon.com","mercurynews.com","mercurynews.com","montereyherald.com","morningjournal.com","nashobavalleyvoice.com","news-herald.com","nydailynews.com","ocregister.com","oneidadispatch.com","orlandosentinel.com","orovillemr.com","paradisepost.com","pasadenastarnews.com","pilotonline.com","pottsmerc.com","pressandguide.com","pressenterprise.com","presstelegram.com","readingeagle.com","record-bee.com","redbluffdailynews.com","redlandsdailyfacts.com","reporterherald.com","sandiegouniontribune.com","santacruzsentinel.com","saratogian.com","sbsun.com","sentinelandenterprise.com","sgvtribune.com","siliconvalley.com","southplattesentinel.com","sun-sentinel.com","themorningsun.com","thenewsherald.com","theoaklandpress.com","thereporter.com","thereporteronline.com","times-standard.com","timescall.com","timesherald.com","timesheraldonline.com","trentonian.com","troyrecord.com","twincities.com","ukiahdailyjournal.com","voicenews.com","whittierdailynews.com","willitsnews.com"],[]],[["/previous/","$remove$"],["laurelberninteriors.com"],[]],[["VR-INJECTOR-INSTANCES-MAP","$remove$"],["abs-cbn.com"],[]]];
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
