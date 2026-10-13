importScripts('config.js');

const TIMEOUT_MS = CONFIG.REQUEST_TIMEOUT_MS;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'sendWebhook') return false;

  const payload = message.payload;
  const ACCOUNTS_TYPES = ['delete_account', 'cancel_plan', 'cancel_linkedin_automation', 'confirmation_link'];
  const webhookUrl = ACCOUNTS_TYPES.includes(payload.type)
    ? CONFIG.WEBHOOK_ACCOUNTS_URL
    : CONFIG.WEBHOOK_FASTSPRING_URL;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(() => {
      sendResponse({ success: true });
    })
    .catch(err => {
      clearTimeout(timeoutId);
      const errorMsg = err.name === 'AbortError'
        ? 'Timeout: servidor não respondeu em 10s.'
        : `Falha ao enviar: ${err.message}`;
      sendResponse({ success: false, error: errorMsg });
    });

  return true;
});

// Mostra/oculta o painel dentro da página; ele só fecha pelo X ou clicando no ícone de novo.
function togglePanel(extensionUrl) {
  const ID = 'webhook-tool-panel';
  const existing = document.getElementById(ID);
  if (existing) {
    existing.remove();
    return;
  }
  const frame = document.createElement('iframe');
  frame.id = ID;
  frame.src = extensionUrl;
  frame.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'width:436px',
    'height:min(640px,calc(100vh - 24px))', 'border:0', 'border-radius:12px',
    'box-shadow:0 8px 32px rgba(0,0,0,.3)', 'z-index:2147483647',
    'background:transparent', 'color-scheme:normal'
  ].join(';');
  document.documentElement.appendChild(frame);
  window.addEventListener('message', function onMsg(e) {
    if (e.source === frame.contentWindow && e.data && e.data.type === 'webhooktool-close-panel') {
      frame.remove();
      window.removeEventListener('message', onMsg);
    }
  });
}

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: togglePanel,
    args: [chrome.runtime.getURL('popup.html')]
  }).catch(() => {});
});
