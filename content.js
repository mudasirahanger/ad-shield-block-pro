// Cosmetic filtering: hides leftover ad containers and (optionally) cookie-consent banners.
// Skipped entirely when protection is off or the site is paused.
const AD_SELECTORS = [
  'ins.adsbygoogle', '[id^="google_ads_"]', '[id^="div-gpt-ad"]', '[id^="ad-slot"]', '[id^="ad_slot"]',
  '[class~="ad-banner"]', '[class~="ad-container"]', '[class~="ad-wrapper"]', '[class~="advert"]',
  '[class~="advertisement"]', '[class~="sponsored-ad"]', '[class*="taboola"]', '[id*="taboola"]',
  '[class*="outbrain"]', '[data-ad-slot]', '[data-ad-unit]', '[data-google-query-id]',
  'iframe[src*="doubleclick.net"]', 'iframe[src*="googlesyndication.com"]',
  'iframe[id^="google_ads_iframe"]', 'a[href*="doubleclick.net/click"]', 'a[href*="googleadservices.com"]'
];

const COOKIE_SELECTORS = [
  '#onetrust-banner-sdk', '#onetrust-consent-sdk', '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
  '#didomi-host', '.didomi-popup-backdrop', '.fc-consent-root', '[id^="sp_message_container"]',
  '#truste-consent-track', '.truste_box_overlay', '.cc-window', '.cc-banner', '#cookie-law-info-bar',
  '#cookie-notice', '#cookieconsent', '#cookie-banner', '.cookie-banner', '#cookie-consent',
  '.cookie-consent', '#gdpr-cookie-notice', '.gdpr-banner', '#qc-cmp2-container', '.osano-cm-window',
  '#usercentrics-root', '#cmpwrapper'
];

(async () => {
  try {
    const { enabled = true, allowlist = [], hideCookieBanners = true } =
      await chrome.storage.local.get(['enabled', 'allowlist', 'hideCookieBanners']);
    const host = location.hostname;
    const paused = !enabled || allowlist.some((h) => host === h || host.endsWith('.' + h));
    if (paused) return;

    const selectors = hideCookieBanners ? [...AD_SELECTORS, ...COOKIE_SELECTORS] : AD_SELECTORS;
    const style = document.createElement('style');
    style.dataset.adShieldBlockPro = 'cosmetic';
    style.textContent = `${selectors.join(',\n')} { display: none !important; }`;
    (document.head || document.documentElement).appendChild(style);
  } catch (err) {
    console.error('Ad Shield Block Pro content script error:', err);
  }
})();
