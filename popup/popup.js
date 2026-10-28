const globalToggle = document.getElementById('global');
const statusEl = document.getElementById('status');
const hostEl = document.getElementById('host');
const pauseBtn = document.getElementById('pause');

let hostname = '';

async function render() {
  const { enabled = true, allowlist = [] } = await chrome.storage.local.get(['enabled', 'allowlist']);
  globalToggle.checked = enabled;
  const paused = allowlist.includes(hostname);
  statusEl.textContent = !enabled ? 'Protection is off' : paused ? 'Paused on this site' : 'Protection is on';
  pauseBtn.disabled = !enabled || !hostname;
  pauseBtn.textContent = paused ? 'Resume on this site' : 'Pause on this site';
}

async function init() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Without the "tabs" permission tab.url is only readable on hosts we have host access to, which we do.
    const url = tab?.url ? new URL(tab.url) : null;
    hostname = url && /^https?:$/.test(url.protocol) ? url.hostname : '';
    hostEl.textContent = hostname || 'Not available on this page';
    await render();
  } catch (err) {
    console.error('Popup init failed:', err);
  }
}

globalToggle.addEventListener('change', async () => {
  await chrome.storage.local.set({ enabled: globalToggle.checked });
  await render();
});

pauseBtn.addEventListener('click', async () => {
  const { allowlist = [] } = await chrome.storage.local.get('allowlist');
  const next = allowlist.includes(hostname) ? allowlist.filter((h) => h !== hostname) : [...allowlist, hostname];
  await chrome.storage.local.set({ allowlist: next });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) await chrome.tabs.reload(tab.id);
  await render();
});

init();
