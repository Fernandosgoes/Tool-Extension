# Webhook Tool

A Chrome extension (**Manifest V3**) that turns a few clicks into structured webhook calls. Point it at a **Make** or **n8n** scenario and your team can trigger standardized, professional emails and customer follow-ups straight from the browser, with no copy-pasting between systems.

## Why it exists

Follow-ups are repetitive and easy to get wrong when written by hand. This tool lets an agent fill a short form, pick a reason from a dropdown and send. The automation behind the webhook takes care of the rest: building the email from your template, routing it, and logging it. Every message goes out consistent and on-brand.

## Features

- **Ready-made request forms:** confirmation link, billing/payment-provider requests and account actions, each sending a clean JSON payload with a stable `reason_code` plus an English `reason` label for easy routing in your automation.
- **Floating panel that stays open:** click the toolbar icon and the panel opens inside the page. It does not close when you click elsewhere, so you can copy values from one place and paste them into the form. Close it with the **X** or by clicking the icon again.
- **Session log:** history of successful submissions, with resend and clear actions.
- **Agent registry:** keep a list of agent names stored locally in the browser and pick them from dropdowns.
- **Multilingual UI:** Portuguese (BR), English, Spanish and Ukrainian, switchable from the header.
- **Resilient sending:** request timeout and clear error messages when a webhook fails.

## How it works

```
Agent fills form -> extension POSTs JSON -> Make / n8n webhook -> email template -> recipient
```

The service worker picks the target webhook from the payload `type` and sends a `POST` with a JSON body.

## Install (developer mode)

1. Copy `config.example.js` to `config.js` and fill in your webhook URLs.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. If your webhook is not on `hook.us1.make.com`, add its host to `host_permissions` in `manifest.json`.

## Configuration

Everything lives in `config.js` (git-ignored, so your URLs stay private):

- `WEBHOOK_CONFIRMATION_URL`, `WEBHOOK_FASTSPRING_URL`, `WEBHOOK_ACCOUNTS_URL`
- `REQUEST_TIMEOUT_MS`, `MAX_LOG_ENTRIES`, `VERSION`
- `*_REASON_EN`: English labels sent in the `reason` field, independent of the UI language

## Project layout

| Path | Role |
|------|------|
| `manifest.json` | MV3 manifest, permissions, service worker |
| `popup.html` / `popup.css` / `popup.js` | UI, forms, log, runtime i18n |
| `i18n.js` | UI strings (PT / EN / ES / UA) |
| `background.js` | Opens the floating panel and `POST`s JSON to the right webhook |
| `config.example.js` | Template for `config.js` |

## Privacy

The extension sends the data you enter (emails, links, notes, agent name) only to the webhook URLs you configure. Nothing is sent anywhere else, and settings are stored locally in the browser.
