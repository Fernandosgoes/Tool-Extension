# Snov.io Support Tools

Extensión de **Chrome (Manifest V3)** para que los agentes de soporte de **Snov.io** envíen datos estructurados a webhooks de **Make.com**: enlaces de confirmación y solicitudes relacionadas con **Fastspring**.

**Documentación principal:** [English](../README.md). Esta página es la traducción al **español**.

---

## Para qué sirve

- **Enlace de confirmación:** envía el correo del destinatario, la URL de confirmación y el nombre del agente al webhook de confirmación.
- **Fastspring:** envía solicitudes internas (reactivar compra, actualizar el correo de acceso al panel de facturación, datos de factura, desbloqueo de cuenta), con campos adicionales cuando corresponde. El payload incluye siempre un `reason_code` estable y el texto `reason` en **inglés** para Make.
- **Registro:** historial en la sesión del navegador, reenvío y vaciado.
- **Ajustes:** registro de agentes (persistido localmente); el panel también se abre con el icono de engranaje del encabezado.
- **Idiomas de la interfaz:** PT (BR), EN, ES, UA — ciclo mediante el control de idioma del encabezado.

## Requisitos

- **Google Chrome** (u otro navegador Chromium compatible con MV3).
- Webhooks de Make activos (URLs en `config.js`).

## Instalación (modo desarrollador)

1. Abre `chrome://extensions`.
2. Activa el **Modo de desarrollador**.
3. **Cargar descomprimida** y selecciona esta carpeta del proyecto.

## Configuración

Edita **`config.js`**:

- `WEBHOOK_CONFIRMATION_URL`, `WEBHOOK_FASTSPRING_URL`
- `REQUEST_TIMEOUT_MS`, `MAX_LOG_ENTRIES`, `VERSION`
- `FASTSPRING_REASON_EN` — etiquetas en inglés en el campo `reason` (independientes del idioma de la UI)

**Agentes:** añade nombres en **Ajustes**; los formularios de Confirmación y Fastspring usan esas listas.

## Estructura del proyecto

| Ruta | Función |
|------|---------|
| `manifest.json` | Manifiesto MV3, permisos, popup, service worker |
| `popup.html` / `popup.css` / `popup.js` | Interfaz, formularios, registro, i18n en tiempo de ejecución |
| `i18n.js` | Cadenas de la UI (PT / EN / ES / UA) |
| `background.js` | `POST` JSON al webhook correcto según `payload.type` |
| `config.js` | Webhooks, timeouts, versión, `FASTSPRING_REASON_EN` |
| `PRD.md` | Especificación interna del producto (en portugués) |
| `translations/` | Copias localizadas del README en inglés |
| `docs/sugestoes-e-melhorias/` | Flujo colaborativo de sugerencias (Google Docs / `.docx`) |

## Privacidad y alcance

La extensión envía **datos operativos** (correos, enlaces, notas, agente) a las URLs configuradas. Está pensada para **uso interno** con distribución controlada. No sustituye las obligaciones de cumplimiento de tu organización en los escenarios de Make.

## Más documentación

- **Requisitos del producto (PRD):** canónico en portugués [`../PRD.md`](../PRD.md); traducciones: [`PRD-INDEX.md`](PRD-INDEX.md)
- **Sugerencias y mejoras:** `docs/sugestoes-e-melhorias/README.md`
- **Índice de traducciones:** [`README.md`](README.md) (esta carpeta)

---

*Snov.io Support — herramienta interna.*
