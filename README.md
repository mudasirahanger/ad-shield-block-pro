# Ad Shield Block Pro

A Manifest V3 Chrome extension that blocks ads and trackers and improves your privacy while browsing. Nothing is collected, stored remotely, or sent anywhere.

Version 1.0 · Developer: Mudasir Ahanger

## Features

- **Ad blocking** – blocks requests to 126 third-party ad networks (`rules/ads.json`).
- **Tracker blocking** – blocks 138 analytics and tracking domains (`rules/trackers.json`).
- **URL patterns** – blocks 19 common third-party ad-script paths (`rules/patterns.json`).
- **Privacy signals** – sends `DNT: 1` and `Sec-GPC: 1` on every request and removes the `Referer` header from third-party requests (`rules/privacy.json`).
- **Cosmetic filtering** – hides empty ad containers left behind after blocking (`content.css`).
- **Popup controls** – global on/off switch and per-site "Pause on this site". The toolbar badge shows how many requests were blocked on the current tab.

## Screenshots

| Popup (real capture, dark theme) | Page with ads vs. protected |
|---|---|
| ![Popup](store-assets/popup-real.png) | ![Without protection](store-assets/screenshot-1.png) ![With protection](store-assets/screenshot-2.png) |

The page screenshots are illustrative mockups; the popup is captured from the running extension.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Pin the Ad Shield Block Pro icon to the toolbar.

## Project layout

| Path | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (MV3) |
| `background.js` | Service worker: toggles rulesets, syncs the per-site allowlist, sets up the badge counter |
| `content.js` / `content.css` | Cosmetic ad-slot hiding; reverted on paused sites |
| `popup/` | Toolbar popup UI |
| `rules/` | Generated declarativeNetRequest rulesets |
| `tools/build-rules.js` | Source of truth for the block lists; regenerates `rules/*.json` |
| `tools/make-icons.py` | Regenerates the PNG icons |

## Customising the block lists

Edit the `ADS` or `TRACKERS` arrays in `tools/build-rules.js`, then:

```bash
node tools/build-rules.js
```

Reload the extension on `chrome://extensions`. Chrome limits static rules per extension (30,000 guaranteed), so large community lists such as EasyList need conversion to this format first.

## Testing it

- Visit a news site with ads, and compare with the extension paused. The badge number should rise on the tab.
- Check headers in DevTools → Network on any request: `Sec-GPC: 1` and `DNT: 1` should be present on outgoing requests (they are added by the network layer, so check **Request Headers** of a request in the Network panel).
- If a site breaks, click the icon and choose **Pause on this site**.

## Known limitations

- Rules are domain-based. Ads served from a site's own domain (for example YouTube video ads) are not blocked.
- Block lists are small and hand-picked, not a replacement for a full list like uBlock Origin's.
- Per-tab badge counts reset when the tab navigates.

## Privacy

Ad Shield Block Pro makes no network requests of its own and has no analytics. Its only stored data is your on/off setting and the list of sites you paused, kept in `chrome.storage.local`. See `CHROMEWEBSTORE.md` for the full privacy policy text.
