importScripts('config.js');

const TIMEOUT_MS = CONFIG.REQUEST_TIMEOUT_MS;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== 'sendWebhook') return false;

  const payload = message.payload;
  const webhookUrl = payload.type === 'confirmation_link'
    ? CONFIG.WEBHOOK_CONFIRMATION_URL
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
