#!/usr/bin/env node
// Converts Adblock-Plus-syntax filter lists (EasyList, EasyPrivacy, ...) into Chrome
// declarativeNetRequest static rules.
//
//   node tools/convert-filters.js <out.json> <list1.txt> [list2.txt ...]
//
// Supported: ||domain^ / |http / plain substrings, * and ^ wildcards, @@ exceptions,
// $third-party, $domain=, resource-type options (and ~negations), $match-case,
// $important, @@...$document. Everything else (cosmetic filters, regex filters,
// $csp, $redirect, $removeparam, $popup, scriptlets ...) is skipped and counted.
const fs = require('fs');

const TYPE_MAP = {
  script: 'script', image: 'image', stylesheet: 'stylesheet', css: 'stylesheet', object: 'object',
  xmlhttprequest: 'xmlhttprequest', xhr: 'xmlhttprequest', subdocument: 'sub_frame', frame: 'sub_frame',
  ping: 'ping', media: 'media', font: 'font', websocket: 'websocket', other: 'other'
};
const ALL_TYPES = ['sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'media', 'websocket', 'other'];
const IGNORED_OPTS = new Set(['first-party', '1p', 'all']);
const UNSUPPORTED = /^(csp|redirect|redirect-rule|rewrite|removeparam|queryprune|replace|popup|popunder|generichide|ghide|elemhide|specifichide|shide|inline-script|inline-font|header|permissions|referrerpolicy|denyallow|to|from|method|badfilter|empty|mp4|cname|app|ehide)\b/;

const skipped = {};
const skip = (why) => { skipped[why] = (skipped[why] || 0) + 1; return null; };

function parseLine(raw) {
  let line = raw.trim();
  if (!line || line[0] === '!' || line[0] === '[') return null;
  if (/#[@?$%]?#|#@?\$#|\+js\(/.test(line) || line.includes('##')) return skip('cosmetic');

  let exception = false;
  if (line.startsWith('@@')) { exception = true; line = line.slice(2); }

  let pattern = line, optStr = '';
  const dollar = line.lastIndexOf('$');
  if (dollar !== -1 && !/\/$/.test(line.slice(0, dollar + 1)) ) {
    pattern = line.slice(0, dollar);
    optStr = line.slice(dollar + 1);
  } else if (dollar !== -1) {
    pattern = line.slice(0, dollar);
    optStr = line.slice(dollar + 1);
  }

  if (pattern.length > 1 && pattern.startsWith('/') && pattern.endsWith('/')) return skip('regex');
  if (/[^\x20-\x7e]/.test(pattern)) return skip('non-ascii');

  const cond = {};
  const include = new Set();
  const exclude = new Set();
  let important = false;
  let docException = false;

  for (const opt of optStr ? optStr.split(',') : []) {
    const o = opt.trim();
    if (!o) continue;
    const neg = o[0] === '~';
    const name = (neg ? o.slice(1) : o).toLowerCase();
    if (name === 'third-party' || name === '3p') { cond.domainType = neg ? 'firstParty' : 'thirdParty'; continue; }
    if (name === 'match-case') { cond.isUrlFilterCaseSensitive = true; continue; }
    if (name === 'important') { important = true; continue; }
    if (name === 'document' || name === 'doc') { if (exception && !neg) { docException = true; continue; } return skip('document-option'); }
    if (name.startsWith('domain=')) {
      const inc = [], exc = [];
      for (const d of name.slice(7).split('|')) {
        if (!d || d.includes('*') || d.includes('/')) return skip('domain-option');
        (d[0] === '~' ? exc : inc).push(d[0] === '~' ? d.slice(1) : d);
      }
      if (inc.length) cond.initiatorDomains = inc;
      if (exc.length) cond.excludedInitiatorDomains = exc;
      continue;
    }
    if (TYPE_MAP[name]) { (neg ? exclude : include).add(TYPE_MAP[name]); continue; }
    if (IGNORED_OPTS.has(name)) continue;
    if (UNSUPPORTED.test(name)) return skip('unsupported-option');
    return skip('unknown-option');
  }

  if (!pattern || /^[|*^.\/]*$/.test(pattern)) {
    if (!docException) return skip('empty-pattern');
  }
  if (pattern.startsWith('||*')) return skip('bad-pattern');
  // Trailing "|" anchors are valid; a leading "http:"/"https:" scheme with | is fine too.

  if (docException) {
    // @@||site.com^$document -> turn the whole site off
    const m = pattern.match(/^\|\|([a-z0-9.-]+)\^?$/i);
    if (!m) return skip('document-pattern');
    return { priority: 4, action: { type: 'allowAllRequests' }, condition: { requestDomains: [m[1].toLowerCase()], resourceTypes: ['main_frame', 'sub_frame'] } };
  }

  if (include.size) cond.resourceTypes = [...include];
  else if (exclude.size) cond.resourceTypes = ALL_TYPES.filter((t) => !exclude.has(t));
  // else: DNR default (everything except main_frame) matches ABP default.

  cond.urlFilter = pattern;
  if (cond.isUrlFilterCaseSensitive !== true) delete cond.isUrlFilterCaseSensitive;

  return {
    priority: exception ? 2 : important ? 3 : 1,
    action: { type: exception ? 'allow' : 'block' },
    condition: cond
  };
}

const [out, ...lists] = process.argv.slice(2);
if (!out || !lists.length) { console.error('usage: convert-filters.js <out.json> <list.txt>...'); process.exit(1); }

const seen = new Set();
const rules = [];
let lines = 0;
for (const file of lists) {
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    lines++;
    const r = parseLine(raw);
    if (!r) continue;
    const key = JSON.stringify(r);
    if (seen.has(key)) continue;
    seen.add(key);
    rules.push(r);
  }
}
rules.forEach((r, i) => { r.id = i + 1; });
fs.writeFileSync(out, JSON.stringify(rules));
const blocks = rules.filter((r) => r.action.type === 'block').length;
console.log(`${out}: ${rules.length} rules (${blocks} block, ${rules.length - blocks} allow) from ${lines} lines`);
console.log('skipped:', JSON.stringify(skipped));
