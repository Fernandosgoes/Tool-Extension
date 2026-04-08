# Snov.io Support Tools

Chrome extension (**Manifest V3**) for **Snov.io** support agents to send structured payloads to **Make.com** webhooks—confirmation links and **Fastspring**-related requests.

**Translations:** [Português (Brasil)](translations/README.pt-BR.md) · [Español](translations/README.es.md) · [Українська](translations/README.uk.md) · [Index](translations/README.md)

---

## What it does

- **Confirmation link:** sends recipient email, confirmation URL, and agent name to the confirmation webhook.
- **Fastspring:** sends internal requests (whitelist request, billing panel email update, invoice data) with extra fields when required. Payload always includes stable `reason_code` and English `reason` text for Make.
- **Log:** session history of successful submissions, resend and clear actions.
- **Settings:** agent registry (persisted locally); settings panel also opens from the header gear icon.
- **UI languages:** PT (BR), EN, ES, UA—cycle via the header language control.

## Requirements

- **Google Chrome** (or another Chromium browser that supports MV3 extensions).
- Active Make webhooks (URLs in `config.js`).

## Install (developer mode)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this project folder.

## Configuration

Edit **`config.js`**:

- `WEBHOOK_CONFIRMATION_URL`, `WEBHOOK_FASTSPRING_URL`
- `REQUEST_TIMEOUT_MS`, `MAX_LOG_ENTRIES`, `VERSION`
- `FASTSPRING_REASON_EN` — English labels sent in the `reason` field (independent of UI language)

**Agents:** add names under **Settings**; the Confirmation and Fastspring forms use those dropdowns.

## Project layout

| Path | Role |
|------|------|
| `manifest.json` | MV3 manifest, permissions, popup, service worker |
| `popup.html` / `popup.css` / `popup.js` | UI, forms, log, runtime i18n |
| `i18n.js` | UI strings (PT / EN / ES / UA) |
| `background.js` | `POST` JSON to the correct webhook by `payload.type` |
| `config.js` | Webhooks, timeouts, version, `FASTSPRING_REASON_EN` |
| `PRD.md` | Internal product spec (Portuguese) |
| `translations/` | Localized copies of this README |
| `docs/sugestoes-e-melhorias/` | Collaborative suggestions workflow (Google Docs / `.docx`) |

## Privacy & scope

The extension sends **operational data** (emails, links, notes, agent id) to configured URLs. Built for **internal use** with controlled distribution. It does not replace your org’s compliance obligations for downstream Make scenarios.

## More docs

- **Project / security approval (Make, Gmail, full UI behavior):** [`docs/project-approval/README.md`](docs/project-approval/README.md)
- **Product requirements (PRD):** canonical Portuguese [`PRD.md`](PRD.md); translations EN / ES / UA + index: [`translations/PRD-INDEX.md`](translations/PRD-INDEX.md)
- **Suggestions & improvements:** `docs/sugestoes-e-melhorias/README.md`

---

*Snov.io Support — internal tooling.*
