// Downloads the latest EasyList / EasyPrivacy and regenerates rules/easylist.json and rules/easyprivacy.json.
// Run: node tools/update-lists.js
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const LISTS = {
  easylist: 'https://easylist.to/easylist/easylist.txt',
  easyprivacy: 'https://easylist.to/easylist/easyprivacy.txt'
};

(async () => {
  // Downloaded lists are untrusted data: keep them in their own temp dir and only ever read them as text.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'filter-lists-'));
  for (const [name, url] of Object.entries(LISTS)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const file = path.join(dir, `${name}.txt`);
    fs.writeFileSync(file, await res.text());
    execFileSync('node', [path.join(__dirname, 'convert-filters.js'), path.join(__dirname, '..', 'rules', `${name}.json`), file], { stdio: 'inherit' });
  }
  fs.rmSync(dir, { recursive: true, force: true });
})().catch((err) => { console.error(err); process.exit(1); });
