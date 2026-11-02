# Third-party notices

## EasyList and EasyPrivacy

`rules/easylist.json` and `rules/easyprivacy.json` are machine-converted derivatives of the
[EasyList](https://easylist.to/easylist/easylist.txt) and [EasyPrivacy](https://easylist.to/easylist/easyprivacy.txt)
filter lists, converted to Chrome `declarativeNetRequest` format by `tools/convert-filters.js`.

- © the EasyList authors, https://easylist.to
- Licensed under the **Creative Commons Attribution-ShareAlike 3.0 Unported License** (CC BY-SA 3.0)
  and the **GNU General Public License v3 or later** (dual-licensed). See https://easylist.to/pages/licence.html
- Changes: cosmetic filters, regex filters and options Chrome cannot express were dropped; the remaining
  network filters were translated to JSON rules. No other modification.

These two files are therefore distributed under CC BY-SA 3.0 / GPLv3+, **not** under this project's MIT license.
The rest of the project remains MIT-licensed (see `LICENSE`).

To refresh them: `node tools/update-lists.js`.
