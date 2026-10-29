// Facebook serves its ads from its own domain, so network rules can't touch them.
// This script finds the visible "Sponsored" label anywhere on the page and hides the ad it belongs to:
//   - a feed post (the outermost [role="article"] around the label), or
//   - a right-column ad box (the biggest narrow ancestor that holds ad links but not the contacts list).
// Facebook scrambles its markup, so detection uses rendered text (innerText ignores the decoy letters
// it hides with CSS) instead of class names. Skipped when protection is off or the site is paused.
(async () => {
  try {
    const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
    const host = location.hostname;
    if (!enabled || allowlist.some((h) => host === h || host.endsWith('.' + h))) return;

    const HIDDEN = 'data-adshield-hidden';
    const style = document.createElement('style');
    style.textContent = `[${HIDDEN}] { display: none !important; }`;
    (document.head || document.documentElement).appendChild(style);

    // Cheap pre-filter: scrambled labels still contain the letters of "Sponsored" in order.
    const MAYBE = /s.*p.*o.*n.*s.*o.*r.*e.*d/i;
    const SIDEBAR_STOP = /Contacts|Birthdays|Group conversations/;

    const isLabel = (el) => {
      const t = el.innerText?.trim();
      return t === 'Sponsored' || t === 'Sponsored ·' || t === 'Paid partnership';
    };

    function adContainer(label) {
      // Feed post: outermost article that contains the label.
      let article = label.closest('[role="article"]');
      if (article) {
        while (article.parentElement?.closest('[role="article"]')) article = article.parentElement.closest('[role="article"]');
        return article;
      }
      // Right column: climb while the box stays narrow and doesn't swallow the contacts list.
      let best = null;
      for (let node = label; node && node !== document.body; node = node.parentElement) {
        const width = node.getBoundingClientRect().width;
        if (width > 480 || SIDEBAR_STOP.test(node.innerText || '')) break;
        if (node.querySelector('a[href]')) best = node;
      }
      return best;
    }

    function scan(root) {
      const candidates = root.querySelectorAll('span, a, h2, h3, div[aria-label="Sponsored"]');
      for (const el of candidates) {
        if (el.children.length > 14) continue;
        const quickText = el.textContent || '';
        if (quickText.length > 90 || !MAYBE.test(quickText)) continue;
        if (!(el.getAttribute('aria-label') === 'Sponsored' || isLabel(el))) continue;
        const box = adContainer(el);
        if (box && !box.hasAttribute(HIDDEN)) box.setAttribute(HIDDEN, '');
      }
      // Stable fallback: the "Why am I seeing this ad" link Facebook attaches to ads.
      for (const a of root.querySelectorAll('a[href*="/ads/about"]')) {
        const box = adContainer(a);
        if (box && !box.hasAttribute(HIDDEN)) box.setAttribute(HIDDEN, '');
      }
    }

    let queued = false;
    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan(document.body);
      });
    }

    scan(document.body);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  } catch (err) {
    console.error('Ad Shield Block Pro (Facebook) error:', err);
  }
})();
