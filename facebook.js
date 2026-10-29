// Facebook serves its ads from its own domain, so network rules can't touch them.
// This script hides "Sponsored" posts in the feed and the "Sponsored" box in the right column.
// Facebook changes its markup often and scrambles class names, so detection relies on
// visible text / stable attributes rather than classes. Skipped when paused or turned off.
(async () => {
  try {
    const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
    const host = location.hostname;
    if (!enabled || allowlist.some((h) => host === h || host.endsWith('.' + h))) return;

    const HIDDEN = 'data-adshield-hidden';
    const style = document.createElement('style');
    style.textContent = `[${HIDDEN}] { display: none !important; }`;
    (document.head || document.documentElement).appendChild(style);

    const isSponsoredLabel = (el) => {
      const label = (el.getAttribute('aria-label') || '').trim();
      if (label === 'Sponsored') return true;
      // innerText ignores letters Facebook hides with CSS to defeat text matching.
      return el.children.length < 8 && el.innerText?.trim() === 'Sponsored';
    };

    const hide = (el) => el.setAttribute(HIDDEN, '');

    // Feed: each direct child of [role="feed"] is a post. Hide the ones labelled Sponsored.
    function scanFeed() {
      for (const feed of document.querySelectorAll('[role="feed"]')) {
        for (const post of feed.children) {
          if (post.hasAttribute(HIDDEN) || post.dataset.adshieldChecked === post.innerHTML.length + '') continue;
          const hasLabel =
            post.querySelector('a[href*="/ads/about"], [aria-label="Sponsored"]') ||
            [...post.querySelectorAll('a[role="link"], span')].slice(0, 60).some(isSponsoredLabel);
          post.dataset.adshieldChecked = post.innerHTML.length + '';
          if (hasLabel) hide(post);
        }
      }
    }

    // Right column: find the "Sponsored" heading and hide the smallest ancestor that also holds the ad links.
    function scanSidebar() {
      for (const side of document.querySelectorAll('[role="complementary"]')) {
        for (const node of side.querySelectorAll('h3, h2, span')) {
          if (node.hasAttribute(HIDDEN) || node.children.length > 3 || !isSponsoredLabel(node)) continue;
          let box = node;
          while (box.parentElement && box.parentElement !== side && !box.querySelector('a[href]')) box = box.parentElement;
          // Never hide a container that also holds the contacts list.
          if (box !== side && !box.querySelector('[aria-label="Contacts"], [aria-label="Contacts" i]')) hide(box);
        }
      }
    }

    let queued = false;
    function scan() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scanFeed();
        scanSidebar();
      });
    }

    scan();
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  } catch (err) {
    console.error('Ad Shield Block Pro (Facebook) error:', err);
  }
})();
