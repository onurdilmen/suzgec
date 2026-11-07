/* Süzgeç scriptlet: ubo-remove-cookie — generated, do not edit */
(() => {
  'use strict';
  const run = function removeCookie(source, args) {
  var flag = "done";
  var uniqueIdentifier = source.uniqueId + source.name + "_" + (Array.isArray(args) ? args.join("_") : "");
  if (source.uniqueId) {
    if (Window.prototype.toString[uniqueIdentifier] === flag) {
      return;
    }
  }
  function removeCookie(source, match) {
    var matchRegexp = toRegExp(match);
    var removeCookieFromHost = function removeCookieFromHost(cookieName, hostName) {
      var cookieSpec = `${cookieName}=`;
      var domain1 = `; domain=${hostName}`;
      var domain2 = `; domain=.${hostName}`;
      var path = "; path=/";
      var expiration = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = cookieSpec + expiration;
      document.cookie = cookieSpec + domain1 + expiration;
      document.cookie = cookieSpec + domain2 + expiration;
      document.cookie = cookieSpec + path + expiration;
      document.cookie = cookieSpec + domain1 + path + expiration;
      document.cookie = cookieSpec + domain2 + path + expiration;
      hit(source);
    };
    var rmCookie = function rmCookie() {
      document.cookie.split(";").forEach((function(cookieStr) {
        var pos = cookieStr.indexOf("=");
        if (pos === -1) {
          return;
        }
        var cookieName = cookieStr.slice(0, pos).trim();
        if (!matchRegexp.test(cookieName)) {
          return;
        }
        var hostParts = document.location.hostname.split(".");
        for (var i = 0; i <= hostParts.length - 1; i += 1) {
          var hostName = hostParts.slice(i).join(".");
          if (hostName) {
            removeCookieFromHost(cookieName, hostName);
          }
        }
      }));
    };
    rmCookie();
    window.addEventListener("beforeunload", rmCookie);
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
    removeCookie.apply(this, updatedArgs);
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
  const NAME = "ubo-remove-cookie";
  const ENTRIES = [[["_ALGOLIA","when","scroll keydown"],["androidauthority.com"],[]],[["/LithiumVisitor|ValueSurveyVisitorCount|VISITOR_BEACON/"],["community.fortinet.com"],[]],[["/^(_pc|cX_)/","when","scroll keydown"],["bizjournals.com","businessinsider.de","computerbild.de"],[]],[["/_pcid|_pctx|amp_|cX|incap/","when","scroll keydown"],["elconfidencial.com","journaldemontreal.com"],[]],[["/^AMCVS?_/"],["bizjournals.com"],[]],[["disqus_unique","when","scroll keydown"],["disqus.com"],[]],[["/_shopify_(y|sa_)/","when","scroll keydown"],["ozlosleep.com"],[]],[["/ana_client_session_id|wshh_uid/"],["worldstar.com"],[]],[["fly_vid","when","scroll keydown"],["cbsnews.com"],[]],[["/^(ev|vocuser)_/","when","scroll keydown"],["diariovasco.com"],[]],[["gtagSessionId"],["lifehacker.com"],[]],[["/^_pubcid|sbgtvNonce|SUID/"],["katu.com"],[]],[["ajs_anonymous_id","when","scroll keydown"],["miro.com"],[]],[["/_HFID|mosb/"],["popularmechanics.com"],[]],[["/ppid$/"],["businessinsider.jp"],[]],[["/ph_phc|remark_lead/","when","scroll keydown"],["darntough.com"],[]],[["/incap_|s_fid/","when","scroll keydown"],["swissotel.com"],[]],[["/^_pubcid/","when","scroll keydown"],["danslescoulisses.com"],[]],[["anonymous_user_id"],["pixabay.com"],[]],[["rdsTracking","when","scroll keydown"],["redis.io"],[]],[["/^\\.(b|s|xp|ub\\.)id/","when","scroll keydown"],["galaxus.de"],[]],[["/^ig-|ph_phc_/","when","scroll keydown"],["healf.com"],[]],[["X-XAct-ID"],["terra.com.br"],[]],[["/^fosp_|orig_aid/"],["vnexpress.net"],[]],[["dvid","when","scroll keydown"],["makemytrip.com"],[]],[["device_id"],["lared.cl"],[]],[["kim-tracker-uid"],["kimbino.bg","kimbino.ro"],[]],[["/swym-|yotpo_/","when","scroll keydown"],["shoebacca.com"],[]],[["/bitmovin_analytics_uuid|sbgtvNonce|SUID/","when","scroll keydown"],["wpde.com"],[]],[["/_pk_id|hk01_annonymous_id/","when","scroll keydown"],["hk01.com"],[]],[["ga_store_user_id"],["oilprice.com"],[]],[["/^_pk_id./","when","scroll keydown"],["buildtheearth.net"],[]],[["/_sharedid|_lc2_fpi/"],["allrecipes.com"],[]],[["/__ta_|_shopify_y/","when","scroll keydown"],["bostonscally.com"],[]],[["_pkc","when","scroll keydown"],["4gamers.com.tw"],[]],[["/sstk_anonymous_id|htjs_anonymous_id/","when","scroll keydown"],["shutterstock.com"],[]],[["vmidv1"],["theverge.com"],[]],[["/sc_anonymous_id|sc_tracking_anonymous_id/","when","scroll keydown"],["soundcloud.com"],[]],[["_shopify_y","when","scroll keydown"],["mykitsch.com"],[]],[["/^_sp_id/","when","scroll keydown"],["huntress.com"],[]],[["bunsar_visitor_id","when","scroll keydown"],["flo.com.tr"],[]],[["/_vf|mantisid|pbjs_/"],["mirror.co.uk"],[]],[["/^DEVICEFP/"],["www.hoyolab.com","www.hoyoverse.com"],[]],[["/^_pk_/"],["liquipedia.net"],[]],[["_pc_private"],["thehindu.com"],[]],[["_vid_t"],["farmersjournal.ie"],[]],[["/^(_tccl_|_scc_session|fpfid)/"],["souq-design.com"],[]],[["/^AMP_/"],["abs-cbn.com"],[]],[["/_shopify_y|yotpo_pixel/","when","scroll keydown"],["edikted.com"],[]],[["/cX_P|_pc/"],["itmedia.co.jp"],[]]];
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
