# Contributing to Ad Shield Block Pro

Thanks for helping! Anyone can contribute: code, block-list entries, bug reports, docs, translations.

## Quick start

```bash
git clone https://github.com/mudasirahanger/ad-shield-block-pro.git
cd ad-shield-block-pro
```

1. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, select this folder.
2. Edit code, then click the reload icon on the extension card.
3. If you changed block lists, regenerate the rules first: `node tools/build-rules.js`.

## Easiest ways to contribute

- **Add an ad or tracker domain:** add it to `ADS_RAW` or `TRACKERS_RAW` in `tools/build-rules.js`, run `node tools/build-rules.js`, and commit both the script and the regenerated `rules/*.json`.
- **Report a broken site:** open an issue using the *Site broke* template with the URL and what stopped working. Most breakage is fixed by removing one rule.
- **Fix Facebook ad detection:** see `facebook.js`; test against a real feed and describe what you saw.
- **Add a cookie-banner or ad-slot selector:** edit `AD_SELECTORS` / `COOKIE_SELECTORS` in `content.js`.

## Pull request checklist

- Keep changes focused: one fix or feature per PR.
- `node tools/build-rules.js` leaves `rules/` unchanged (CI checks this).
- No new permissions without explaining why in the PR. This extension must stay privacy-first: **no analytics, no network calls, no remote code.**
- Manifest V3 only. Use `async`/`await`. No inline scripts in HTML.
- Test by loading the extension and visiting a few sites; mention what you tested.

## Code of conduct

Be respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

By contributing you agree your contributions are licensed under the [MIT License](LICENSE).
