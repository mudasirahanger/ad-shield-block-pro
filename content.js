// Cosmetic filtering is done by content.css. This script only turns it off for
// sites the user has paused, by disabling the injected stylesheet rules.
(async () => {
  try {
    const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
    const host = location.hostname;
    const paused = !enabled || allowlist.some((h) => host === h || host.endsWith('.' + h));
    if (!paused) return;

    const style = document.createElement('style');
    style.dataset.shieldblock = 'unhide';
    // Re-show elements hidden by content.css.
    style.textContent = `
      ins.adsbygoogle, [id^="google_ads_"], [id^="div-gpt-ad"], [id^="ad-slot"], [id^="ad_slot"],
      [class~="ad-banner"], [class~="ad-container"], [class~="ad-wrapper"], [class~="advert"],
      [class~="advertisement"], [class~="sponsored-ad"], [class*="taboola"], [id*="taboola"],
      [class*="outbrain"], [data-ad-slot], [data-ad-unit], [data-google-query-id],
      iframe[src*="doubleclick.net"], iframe[src*="googlesyndication.com"],
      iframe[id^="google_ads_iframe"], a[href*="doubleclick.net/click"],
      a[href*="googleadservices.com"] { display: revert !important; }`;
    (document.head || document.documentElement).appendChild(style);
  } catch (err) {
    console.error('Ad Shield Block Pro content script error:', err);
  }
})();
