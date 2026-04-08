const CONFIG = {
  WEBHOOK_CONFIRMATION_URL: 'https://hook.us1.make.com/73ml73lfd9re85rwleyedp72gendmljg',
  WEBHOOK_FASTSPRING_URL: 'https://hook.us1.make.com/3pgd7kidmcen1nro986dw9b2u42sijtw',
  REQUEST_TIMEOUT_MS: 10000,
  MAX_LOG_ENTRIES: 100,
  VERSION: '1.0.0',

  /** Sent to webhook as `reason` (always EN). UI uses i18n `fs-reason-*` per language. */
  FASTSPRING_REASON_EN: {
    whitelist: 'Whitelist Request',
    email_change: 'Update Billing Panel Email',
    invoice_data_change: 'Update Invoice Data'
  }
};
