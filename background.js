const RULESETS = ['ads', 'trackers', 'patterns', 'privacy'];
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

async function applyEnabled(enabled) {
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets(
      enabled ? { enableRulesetIds: RULESETS } : { disableRulesetIds: RULESETS }
    );
    await chrome.action.setBadgeText({ text: '' });
  } catch (err) {
    console.error('Failed to toggle rulesets:', err);
  }
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
  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
  await chrome.storage.local.set({ enabled, allowlist });
  await applyEnabled(enabled);
  await syncAllowlist(allowlist);
});

chrome.runtime.onStartup.addListener(init);

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local') return;
  try {
    if (changes.enabled) await applyEnabled(changes.enabled.newValue !== false);
    if (changes.allowlist) await syncAllowlist(changes.allowlist.newValue || []);
  } catch (err) {
    console.error('Failed to apply settings:', err);
  }
});
