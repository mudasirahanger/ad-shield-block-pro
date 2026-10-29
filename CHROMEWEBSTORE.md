# Chrome Web Store Listing — Ad Shield Block Pro

> Last Updated: 2026-10-28

## Store Listing

**Extension Name** [REQUIRED]
Ad Shield Block Pro

**Short Description** [REQUIRED]
Blocks ads and trackers, sends Do Not Track and Global Privacy Control signals, and collects no data.

**Detailed Description** [REQUIRED]
```
Ad Shield Block Pro blocks ads and third-party trackers on the websites you visit, so pages load cleaner and fewer companies can follow you around the web.

WHAT IT DOES
Blocks requests to well-known ad networks and tracking services.
Removes tracking parameters (such as utm_source and fbclid) from the links you open.
Hides sponsored posts and the sponsored box on Facebook.
Hides common cookie-consent banners (you can turn this off in the popup).
Hides empty ad boxes that would otherwise be left on the page.
Tells websites not to track you by sending the Do Not Track and Global Privacy Control signals.
Stops other websites from seeing which page you came from when a page loads third-party content.
Shows how many requests were blocked on the current tab right on the toolbar icon.

HOW TO USE IT
1. Install Ad Shield Block Pro. It starts protecting you immediately.
2. If a website does not work properly, click the Ad Shield Block Pro icon and choose "Pause on this site". The page reloads without blocking. Choose "Resume on this site" to turn protection back on.
3. Use the switch at the top of the popup to turn protection off or on for every site.

PRIVACY
Ad Shield Block Pro does not collect, store, or send any of your data. It has no accounts and no analytics. Your settings (the on/off switch, the cookie-banner option and the sites you paused) stay in your browser.

LIMITATIONS
Ad Shield Block Pro blocks ads and trackers that come from other companies' servers. Ads served from a website's own servers, such as video ads on some streaming sites, may still appear.

SUPPORT
Questions or a site that does not work? Contact us using the support link on this page.
```

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Blocks ads and third-party trackers on websites and sends privacy signals while you browse.

**Primary Language** [REQUIRED]
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | icons/icon-128.png |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | 🟡 Mockup | store-assets/screenshot-1.png |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | 🟡 Mockup | store-assets/screenshot-2.png |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | 🟡 Mockup | store-assets/screenshot-3.png |
| Small Promo Tile [RECOMMENDED] | 440×280 | ✅ Ready | store-assets/promo-small-440x280.png |

### Screenshot Notes
The current screenshots are illustrative mockups on a fake page. Chrome Web Store policy expects screenshots to reflect the real product, so replace them with real captures from the loaded extension before submitting.

1. A news page with ads on the left and the same page with Ad Shield Block Pro on the right, toolbar badge showing the blocked count.
2. The popup open with protection on, showing the "Pause on this site" button.
3. The popup showing "Paused on this site" with the page's ads visible again.

The icon is a simple generated placeholder (white cross on blue). Replace it with real artwork before publishing if you want a distinctive listing.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| declarativeNetRequest | permissions | Blocks requests to known ad and tracker domains, adds the Do Not Track and Global Privacy Control headers, removes the Referer header from third-party requests, and shows the per-tab blocked count on the toolbar icon. Blocking is done by the browser from fixed rules bundled with the extension; the extension never reads page traffic. |
| storage | permissions | Saves the user's on/off setting and the list of sites they chose to pause, locally in the browser. |
| `<all_urls>` | host_permissions | Ads and trackers appear on every website, so the blocking rules and header changes must apply to requests on any site. Also lets the popup show which site is currently open and lets the "Pause on this site" button work on any site. No page content is read or transmitted. |
| Content script on `*.facebook.com` | content_scripts | Hides posts and sidebar boxes labelled "Sponsored" on Facebook, which serves its ads from its own domain. Reads only the on-page labels locally; nothing is sent anywhere. |
| Content script on `http://*/*` and `https://*/*` | content_scripts | Hides empty ad containers and (optionally) cookie-consent banners on every page, except on sites the user has paused. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

The extension stores only the user's on/off setting and paused-site hostnames in local browser storage. These never leave the device and are not transmitted to the developer or anyone else. The code contains no `fetch`, XHR, analytics, or remote code.

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | — | No |
| Health info | No | No | — | No |
| Financial info | No | No | — | No |
| Authentication info | No | No | — | No |
| Personal communications | No | No | — | No |
| Location | No | No | — | No |
| Web history | No | No | — | No |
| User activity | No | No | — | No |
| Website content | No | No | — | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
TODO: host the text below at a public URL (GitHub Pages, your website, or a public Notion page) and paste the link here.

### Privacy policy text

> **Ad Shield Block Pro Privacy Policy** — effective 2026-10-28
>
> Ad Shield Block Pro does not collect, store, transmit, sell, or share any personal information or browsing data.
>
> **What the extension stores:** your on/off setting, your cookie-banner option and the list of website names you chose to pause. This is kept only in your browser's local extension storage on your device and is never sent anywhere. Uninstalling the extension deletes it.
>
> **What the extension does with web traffic:** it uses fixed filtering rules shipped inside the extension to block requests to advertising and tracking domains and to add "Do Not Track" and "Global Privacy Control" headers to your outgoing requests. It does not read, record, or transmit the pages you visit or the requests you make.
>
> **Third parties:** the extension has no analytics, no remote servers, and no third-party code.
>
> **Changes:** if this policy changes, the effective date above will be updated.
>
> **Contact:** TODO: your contact email.

## Distribution

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name** [REQUIRED]
Mudasir Ahanger

**Contact Email** [REQUIRED]
TODO (displayed publicly on the listing)

**Support URL / Email** [RECOMMENDED]
TODO

**Homepage URL** [RECOMMENDED]
TODO

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.2 | 2026-10-29 | Hides sponsored posts and sidebar ads on Facebook. | Draft |
| 1.1 | 2026-10-28 | Added tracking-parameter stripping, cookie-banner hiding (toggle in popup), open-source project files and CI. | Draft |
| 1.0 | 2026-10-28 | Initial release: ad and tracker blocking, Do Not Track / Global Privacy Control signals, Referer stripping for third-party requests, ad-slot hiding, global switch and per-site pause. | Draft |

## Review Notes

### Known Issues / Limitations
- `<all_urls>` host access is broad; reviewers may ask for the justification above. It is inherent to an ad blocker.
- First-party ads (for example YouTube video ads) are not blocked.
- Automated browser test passed on 2026-10-28 (rulesets load, ad and tracker requests blocked, DNT and Sec-GPC sent, ad slot hidden, pause rule created, no errors). Popup UI and real-site behaviour still need a manual check.
- Name: avoid implying affiliation with any brand; "Ad Shield Block Pro" has not been checked for trademark conflicts.

### Pre-publish checklist
- [ ] Load unpacked in Chrome and verify blocking and the pause button work
- [ ] Capture at least one 1280×800 screenshot
- [ ] Host the privacy policy and fill in the URL
- [ ] Fill in publisher name and contact details
- [ ] ZIP the extension excluding `tools/`, `README.md`, `CHROMEWEBSTORE.md`, and any `.git/`, `node_modules/`, `.env`

### Rejection History
None yet.
