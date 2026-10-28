// Generates rules/*.json from the domain lists below. Run: node tools/build-rules.js
const fs = require('fs');
const path = require('path');

const dedupe = (a) => [...new Set(a)].filter((d) => !d.includes('/'));
const ADS_RAW = [
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com', 'adservice.google.com',
  'pagead2.googlesyndication.com', 'tpc.googlesyndication.com', 'adsystem.com', 'adnxs.com',
  'adsrvr.org', 'advertising.com', 'amazon-adsystem.com', 'taboola.com', 'outbrain.com',
  'criteo.com', 'criteo.net', 'rubiconproject.com', 'pubmatic.com', 'openx.net', 'casalemedia.com',
  'indexww.com', 'smartadserver.com', 'moatads.com', 'adform.net', 'bidswitch.net', 'contextweb.com',
  'yieldmo.com', 'sharethrough.com', 'media.net', 'revcontent.com', 'mgid.com', 'zedo.com',
  'adcolony.com', 'applovin.com', 'unityads.unity3d.com', 'popads.net', 'popcash.net',
  'propellerads.com', 'exoclick.com', 'juicyads.com', 'trafficjunky.net', 'adsterra.com',
  'ad.doubleclick.net', 'serving-sys.com', 'teads.tv', 'lijit.com', 'sovrn.com', 'gumgum.com',
  'triplelift.com', '33across.com', 'adskeeper.com', 'adblade.com', 'adtech.com', 'adtechus.com',
  'advertising.amazon.com', 'bidtellect.com', 'brealtime.com', 'clickbooth.com', 'clickfuse.com',
  'cpmstar.com', 'directrev.com', 'displayads.com', 'eqads.com', 'flashtalking.com', 'gadsme.com',
  'google-analytics.l.google.com', 'ib-ibi.com', 'imrworldwide.com', 'infolinks.com', 'inskinmedia.com',
  'intentiq.com', 'kargo.com', 'kixer.com', 'liadm.com', 'mediavine.com', 'monetixads.com',
  'nativo.com', 'nend.net', 'onetag-sys.com', 'opera.com/ads', 'ox-d.com', 'pubmine.com',
  'pubnative.net', 'quantcast.com', 'revjet.com', 'richaudience.com', 'rhythmone.com',
  'smaato.net', 'smilewanted.com', 'stackadapt.com', 'synacor.com', 'tremorhub.com', 'turn.com',
  'vidazoo.com', 'vungle.com', 'yahoo-ad.com', 'adnxs-simple.com', 'admob.com', 'ads.yahoo.com',
  'advertising.yahoo.com', 'ads.linkedin.com', 'ads.pinterest.com', 'ads.tiktok.com', 'ads.reddit.com',
  'adsymptotic.com', 'ad-delivery.net', 'adhigh.net', 'admixer.net', 'bannerflow.com',
  'adspyglass.com', 'a-ads.com', 'coinzilla.com', 'bidvertiser.com', 'hilltopads.net',
  'clickadu.com', 'mondiad.com', 'richpush.co', 'evadav.com', 'monetag.com',
  '33across.com', 'spotxchange.com', 'springserve.com', 'adition.com',
  'adroll.com', 'yieldlab.net', 'inmobi.com', 'tapad.com', 'conversantmedia.com', 'undertone.com'
];

const TRACKERS_RAW = [
  'google-analytics.com', 'googletagmanager.com', 'googletagservices.com', 'analytics.google.com',
  'stats.g.doubleclick.net', 'facebook.net', 'connect.facebook.net', 'pixel.facebook.com',
  'hotjar.com', 'hotjar.io', 'fullstory.com', 'mouseflow.com', 'crazyegg.com', 'luckyorange.com',
  'segment.io', 'segment.com', 'mixpanel.com', 'amplitude.com', 'heap.io', 'heapanalytics.com',
  'quantserve.com', 'scorecardresearch.com', 'chartbeat.com', 'chartbeat.net', 'newrelic.com',
  'nr-data.net', 'branch.io', 'adjust.com', 'appsflyer.com', 'kochava.com', 'bugsnag.com',
  'sentry-cdn.com', 'omtrdc.net', 'demdex.net', 'everesttech.net', 'bluekai.com', 'krxd.net',
  'agkn.com', 'exelator.com', 'eyeota.net', 'liveramp.com', 'rlcdn.com', 'mathtag.com',
  'bounceexchange.com', 'optimizely.com', 'ads-twitter.com', 'analytics.twitter.com',
  'static.ads-twitter.com', 'analytics.tiktok.com', 'ct.pinterest.com', 'snap.licdn.com',
  'px.ads.linkedin.com', 'bat.bing.com', 'clarity.ms', 'yandex.ru/metrika', 'mc.yandex.ru',
  'outbrainimg.com', 'cdn.taboola.com', 'tiqcdn.com', 'tealiumiq.com', 'ensighten.com',
  'parsely.com', 'permutive.com', 'id5-sync.com', 'adsafeprotected.com', 'doubleverify.com',
  'zqtk.net', 'matomo.cloud', 'statcounter.com', 'histats.com', 'addthis.com', 'sharethis.com',
  'sumo.com', 'sumome.com', 'kissmetrics.com', 'woopra.com', 'clicky.com', 'getclicky.com',
  'inspectlet.com', 'smartlook.com', 'logrocket.com', 'logrocket.io', 'trackjs.com', 'rollbar.com',
  'datadoghq.com', 'rum.browser-intake-datadoghq.com', 'fast.fonts.net', 'pingdom.net', 'gemius.pl',
  'adobedtm.com', 'demandbase.com', 'bizible.com', 'marketo.net', 'mktoresp.com', 'munchkin.marketo.net',
  'eloqua.com', 'en25.com', 'intercomcdn.com', 'drift.com', 'driftt.com', 'customer.io', 'braze.com',
  'onesignal.com', 'pushwoosh.com', 'urbanairship.com', 'moengage.com', 'clevertap.com',
  'singular.net', 'tenjin.com', 'cxense.com', 'cdn.cxense.com', 'comscore.com', 'sitemeter.com',
  'tapad.com', 'adobe.demdex.net', 'tags.tiqcdn.com', 'trustarc.com', 'fingerprintjs.com',
  'fpjs.io', 'perimeterx.net', 'hscollectedforms.net', 'hsleadflows.net', 'usemessages.com',
  'ads-api.twitter.com', 'tr.snapchat.com', 'sc-static.net', 'events.reddit.com', 'alb.reddit.com',
  'analytics.yahoo.com', 'sp.analytics.yahoo.com', 'geo.yahoo.com', 'wa.yahoo.com',
  'vk.com/rtrg', 'top-fwz1.mail.ru', 'counter.yadro.ru', 'liveinternet.ru', 'rambler.ru/counter', 'pardot.com', 'hs-analytics.net', 'hsadspixel.net', 'track.hubspot.com'
];

const ADS = dedupe(ADS_RAW);
const TRACKERS = dedupe(TRACKERS_RAW);
const RESOURCE_TYPES = [
  'script', 'image', 'xmlhttprequest', 'sub_frame', 'ping', 'media', 'stylesheet', 'font', 'other'
];

function blockRules(domains) {
  // One rule per domain keeps the list easy to audit and edit.
  return domains.map((d, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: 'block' },
    condition: { requestDomains: [d], domainType: 'thirdParty', resourceTypes: RESOURCE_TYPES }
  }));
}

// Generic third-party URL patterns commonly used by ad servers.
const PATTERNS = [
  '/pagead/', '/adserver/', '/ad-server/', '/adframe.', '/adview.', '/showads.', '/banner_ads/',
  '/ads/js/', '/ads.js', '/adsbygoogle.js', '/prebid', '/gpt.js', '/gtag/js', '/fbevents.js',
  '/analytics.js', '/ga.js', '/piwik.js', '/tracking-pixel', '/track/pixel'
];

function patternRules() {
  return PATTERNS.map((p, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: p, domainType: 'thirdParty', resourceTypes: RESOURCE_TYPES }
  }));
}

// Strips well-known tracking query parameters from page loads (utm_*, fbclid, gclid, ...).
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'fbclid', 'gclid',
  'gbraid', 'wbraid', 'msclkid', 'yclid', 'dclid', 'twclid', 'ttclid', 'igshid', 'mc_eid', 'mc_cid',
  '_hsenc', '_hsmi', 'mkt_tok', 'vero_id', 'oly_enc_id', 'oly_anon_id'
];
const params = [{
  id: 1,
  priority: 1,
  action: { type: 'redirect', redirect: { transform: { queryTransform: { removeParams: TRACKING_PARAMS } } } },
  condition: {
    regexFilter: '[?&](utm_[a-z]+|fbclid|gclid|gbraid|wbraid|msclkid|yclid|dclid|twclid|ttclid|igshid|mc_eid|mc_cid|_hsenc|_hsmi|mkt_tok)=',
    resourceTypes: ['main_frame']
  }
}];

const privacy = [
  {
    id: 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        { header: 'DNT', operation: 'set', value: '1' },
        { header: 'Sec-GPC', operation: 'set', value: '1' }
      ]
    },
    condition: { resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'image', 'ping', 'other'] }
  },
  {
    // Don't leak the page you came from to third parties.
    id: 2,
    priority: 1,
    action: { type: 'modifyHeaders', requestHeaders: [{ header: 'Referer', operation: 'remove' }] },
    condition: { domainType: 'thirdParty', resourceTypes: ['script', 'image', 'xmlhttprequest', 'sub_frame', 'ping', 'other'] }
  }
];

const out = path.join(__dirname, '..', 'rules');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'ads.json'), JSON.stringify(blockRules(ADS), null, 1));
fs.writeFileSync(path.join(out, 'params.json'), JSON.stringify(params, null, 1));
fs.writeFileSync(path.join(out, 'patterns.json'), JSON.stringify(patternRules(), null, 1));
fs.writeFileSync(path.join(out, 'trackers.json'), JSON.stringify(blockRules(TRACKERS), null, 1));
fs.writeFileSync(path.join(out, 'privacy.json'), JSON.stringify(privacy, null, 1));
console.log(`ads: ${ADS.length}, trackers: ${TRACKERS.length}, patterns: ${PATTERNS.length}, privacy: ${privacy.length}`);
