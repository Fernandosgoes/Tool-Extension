# Snov.io Support Tools — Project approval brief

**Audience:** security, IT, operations, and leadership reviewing internal tooling.  
**Language:** English (canonical).  
**Product:** Chrome extension (Manifest V3) that sends **structured JSON** to **two Make.com webhooks**. Make is the only external automation platform involved; downstream actions use **Gmail modules** to send emails on behalf of the configured mailbox.

---

## 1. Executive summary

This extension is a **delivery facilitator**. It replaces repetitive manual steps (opening `support@snov.io` / `help@snov.io`, composing a new message, pasting recipient and body, sending) with **parameterized fields in the UI** and a single **Submit** action per request.

- **Two fixed Make webhooks** → **two separate Make scenarios** (workflows).
- **One scenario** handles **user confirmation links** (signup flows where platform email delivery often fails).
- **One scenario** handles **Fastspring (payment processor) support requests**, routed by request type so the correct **standardized email copy** is sent to Fastspring via Gmail.

The extension **does not** connect to Snov.io product databases, billing systems, or Fastspring admin APIs. It **does not** read sensitive internal tooling beyond what the agent types into the form. It **only** POSTs **non-secret webhook URLs** (embedded in the package) and **form-derived JSON** to trigger Make.

---

## 2. What the extension does **not** do

| Not in scope | Detail |
|--------------|--------|
| Direct Gmail / SMTP from the extension | No email protocol inside the browser; only **HTTPS POST** to Make. |
| Access to Snov.io backend or Fastspring consoles | No API keys to core products in the extension. |
| Storage of customer secrets | Agent names and form fields are local/session as designed; webhooks are not treated as secrets but are internal URLs. |
| Anything beyond triggering Make | Make owns routing, templates, and Gmail send. |

---

## 3. Make.com architecture (approved design)

### 3.1 Two webhooks, two workflows

| Webhook | Purpose | Extension `payload.type` |
|---------|---------|---------------------------|
| **Webhook A — Confirmation** | Resend or deliver **signup confirmation links** when platform email fails. | `confirmation_link` |
| **Webhook B — Fastspring** | Forward **standardized support requests** to Fastspring (via Gmail). | `fastspring_request` |

Each webhook is the entry module (**Custom webhook**) of its own Make scenario.

### 3.2 Fastspring workflow (conceptual)

As implemented in Make (aligned with operations):

1. **Webhook** — receives JSON from the extension.  
2. **Router / filter** — branches on stable field **`reason_code`** (and optionally human-readable **`reason`** in English for email bodies).  
3. **Up to four Gmail — “Send an email” modules**, each with **fixed, standardized copy** for:
   - **User whitelist** (re-enable purchase / whitelist user).  
   - **Invoice data update** (change invoice details — Fastspring performs the change; support only notifies with the agreed template).  
   - **Billing panel access email update** (email used to access the billing portal for payment methods and related settings — **Snov.io does not perform the change**; Fastspring does after receiving the request).  
   - **Account unblock (optional path)** — for users blocked under **risk / assessment** workflows due to **payment information inconsistencies**. After the user passes reassessment, support must **notify that the account was unblocked**; this branch uses the agreed confirmation template.

> **Important:** The extension only supplies **parameters** (recipient email, reason type, optional `email_from` / `email_to`, notes, agent name, timestamp). **Wording and compliance** of each Gmail module remain **owned and maintained in Make** (and in Google Drive documentation).

### 3.3 Confirmation workflow (conceptual)

1. **Webhook** — receives JSON with recipient email, confirmation URL, and agent.  
2. **Gmail (or equivalent)** — sends the **confirmation link** email using the template defined in Make.

Exact module count may differ (e.g. one Gmail module); the principle is: **one dedicated scenario** for confirmation, separate from Fastspring.

### 3.4 Single integration surface

From an **app-connection** perspective, the sensitive operational connection is **Make ↔ Gmail** (one Gmail connection used by the send modules). The extension’s only integration is **Make webhooks over HTTPS**. **Nothing else** is connected by the extension.

---

## 4. Extension UI — controls and what happens on use

### 4.1 Header (all tabs)

| Control | Action | Result |
|---------|--------|--------|
| **Language** | Cycles **PT → EN → ES → UA** | UI strings reload from `i18n.js`; **payloads to Make are unchanged** (Fastspring still sends English `reason` + stable `reason_code`). |
| **Settings (gear)** | Opens **Settings** panel | Same as selecting the Settings tab area in layout; manage **agent list** (stored locally). |
| **About (info)** | Opens modal | Shows product name, version, internal disclaimer, **Report a bug** with copyable email. **No webhook call.** |

### 4.2 Tab: **Confirm link**

| Control | Action | Result |
|---------|--------|--------|
| **Recipient email** | User types email | Validated locally (format). |
| **Confirmation link** | User pastes URL | Validated locally (URL). |
| **Agent** | User selects from dropdown | Populated from **Settings** registry. |
| **Submit** | Sends form | `POST` JSON to **Confirmation webhook** (`type: confirmation_link`, `email`, `confirmation_link`, `agent_name`, `timestamp`). On **2xx**, success notification + **Log** entry + form reset. On failure, error notification. |

### 4.3 Tab: **Fastspring**

| Step / control | Action | Result |
|----------------|--------|--------|
| **Request reason** (first step) | User selects one of four reasons | **Second step** appears (recipient email, conditional fields, agent, submit). |
| **Recipient email** | User types email | Required for all reasons. |
| **Conditional: “billing email change”** | Shows **From** / **To** emails | Required when reason is email change; included in payload as `email_from`, `email_to`. |
| **Conditional: “invoice data”** | Shows **notes** textarea | Required for invoice reason; sent as `notes`. |
| **Agent** | User selects | Same agent list as Confirmation. |
| **Submit** | Sends form | `POST` JSON to **Fastspring webhook** (`type: fastspring_request`, `reason_code`, `reason` in **English**, `email`, `agent_name`, `timestamp`, plus extras per reason). Make routes to the correct Gmail module. |

If the user clears the reason back to placeholder, the second step **hides** and fields are **cleared** (no submit until a valid reason is chosen again).

### 4.4 Tab: **Log**

| Control | Action | Result |
|---------|--------|--------|
| **List** | Read-only | Shows successful submissions this **browser session** (not persisted across full browser quit). |
| **Resend (↻)** | User clicks on a row | Re-sends the **same payload** (with new `timestamp`; Fastspring entries normalize `reason` to English again). |
| **Clear** | User clicks **Clear** | Wipes session log. **No webhook.** |

### 4.5 Tab: **Settings**

| Control | Action | Result |
|---------|--------|--------|
| **Agent name + add** | Adds agent | Saved to **localStorage**; both Confirmation and Fastspring **Agent** dropdowns refresh. |
| **Remove agent** | Removes from list | Updates storage and dropdowns. **No webhook.** |

---

## 5. Operational value (why approve)

Without the extension, each request implies **manual mailbox work** (open shared support inbox, compose, paste templates, verify recipient, send). With the extension and Make:

- **Fewer errors** (structured fields, validation).  
- **Faster throughput** for high-volume confirmation failures and Fastspring tickets.  
- **Consistent copy** (owned in Make / Drive, not retyped each time).  
- **Clear attribution** via `agent_name` in JSON for auditing in Make.

---

## 6. Reference materials (outside this repo)

Per operations practice:

- **Google Drive** holds the **full internal pack**: deployment assets, **how to publish / upload** to the **Chrome extension guide** (internal process). The steps mirror the legacy flow used for **LI Prospect Finder** (load unpacked / same internal publication pattern — follow the Drive checklist).  
- **End-user oriented READMEs** (how the tool works) exist in **four languages** in the repository:
  - English: root `README.md`  
  - Portuguese (Brazil), Spanish, Ukrainian: `translations/README.pt-BR.md`, `README.es.md`, `README.uk.md` (see `translations/README.md` for index).

Technical product specification (Portuguese): `PRD.md`.

---

## 7. Approval checklist (suggested)

- [ ] Two Make scenarios are owned and monitored; Gmail connection scoped to the intended mailbox.  
- [ ] Webhook URLs rotated if exposed beyond trusted staff.  
- [ ] Templates for Fastspring and confirmation reviewed by **Support / Legal** as needed.  
- [ ] Agents trained: extension only triggers Make; **no expectation** that the extension accesses Fastspring or billing backends directly.

---

## 8. Document control

| Item | Value |
|------|--------|
| Purpose | Internal project / security approval |
| Canonical technical README (EN) | `/README.md` |
| This brief | `/docs/project-approval/README.md` |

---

*Snov.io Support Tools — internal use only.*
