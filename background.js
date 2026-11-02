// Small hand-made lists first, then the big converted filter lists.
const RULESETS = ['privacy', 'params', 'patterns', 'ads', 'trackers', 'easylist', 'easyprivacy'];
const ALLOW_RULE_BASE = 1000;

// Show how many requests were blocked on each tab as the toolbar badge.
async function init() {
  try {
    await chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true });
    await chrome.action.setBadgeBackgroundColor({ color: '#1a73e8' });
  } catch (err) {
    console.error('Ad Shield Block Pro init failed:', err);
  }
}

// Toggles each ruleset on its own: Chrome limits how many static rules can be on at once,
// so if the big lists don't fit on a low-resource machine the smaller ones still work.
async function applyEnabled(enabled) {
  for (const id of RULESETS) {
    try {
      await chrome.declarativeNetRequest.updateEnabledRulesets(
        enabled ? { enableRulesetIds: [id] } : { disableRulesetIds: [id] }
      );
    } catch (err) {
      console.warn(`Could not ${enabled ? 'enable' : 'disable'} ruleset "${id}":`, err.message);
    }
  }
  await chrome.action.setBadgeText({ text: '' });
}

// Per-site allowlist: one dynamic "allowAllRequests" rule per paused hostname.
async function syncAllowlist(allowlist) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const addRules = allowlist.map((host, i) => ({
    id: ALLOW_RULE_BASE + i,
    priority: 100,
    action: { type: 'allowAllRequests' },
    condition: { requestDomains: [host], resourceTypes: ['main_frame', 'sub_frame'] }
  }));
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  await init();
  const { enabled = true, allowlist = [], hideCookieBanners = true } = await chrome.storage.local.get(['enabled', 'allowlist', 'hideCookieBanners']);
  await chrome.storage.local.set({ enabled, allowlist, hideCookieBanners });
  await applyEnabled(enabled);
  await syncAllowlist(allowlist);
});

// Make sure every ruleset is on after browser start / extension update (manifest defaults can be dropped
// by Chrome when the global static-rule pool is short).
chrome.runtime.onStartup.addListener(async () => {
  await init();
  const { enabled = true } = await chrome.storage.local.get('enabled');
  if (enabled) await applyEnabled(true);
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local') return;
  try {
    if (changes.enabled) await applyEnabled(changes.enabled.newValue !== false);
    if (changes.allowlist) await syncAllowlist(changes.allowlist.newValue || []);
  } catch (err) {
    console.error('Failed to apply settings:', err);
  }
});
