# Snov.io Support Tools

Extensão **Chrome (Manifest V3)** para agentes de suporte da **Snov.io** enviarem dados estruturados para webhooks do **Make.com** — links de confirmação e pedidos relacionados à **Fastspring**.

**Idioma principal da documentação:** [English](../README.md). Esta página é a tradução em **português (Brasil)**.

---

## Para que serve

- **Link de confirmação:** envia email do destinatário, URL de confirmação e nome do agente para o webhook de confirmação.
- **Fastspring:** envia pedidos internos (solicitação de whitelist, atualização do email do painel de cobrança, dados de fatura), com campos adicionais quando necessário. O payload inclui sempre `reason_code` estável e o texto `reason` em **inglês** para o Make.
- **Log:** histórico na sessão do navegador com reenvio e limpeza.
- **Configurações:** cadastro de agentes (persistido localmente); o painel também abre pelo ícone de engrenagem no header.
- **Idiomas da interface:** PT (BR), EN, ES, UA — alternância cíclica pelo controle de idioma no header.

## Requisitos

- **Google Chrome** (ou navegador Chromium compatível com MV3).
- Webhooks Make ativos (URLs em `config.js`).

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions`.
2. Ative o **Modo do desenvolvedor**.
3. **Carregar sem compactação** e selecione esta pasta do projeto.

## Configuração

Edite o **`config.js`**:

- `WEBHOOK_CONFIRMATION_URL`, `WEBHOOK_FASTSPRING_URL`
- `REQUEST_TIMEOUT_MS`, `MAX_LOG_ENTRIES`, `VERSION`
- `FASTSPRING_REASON_EN` — rótulos em inglês no campo `reason` (independente do idioma da interface)

**Agentes:** cadastre nomes em **Configurações**; os formulários de Confirmação e Fastspring usam essas listas.

## Estrutura do projeto

| Caminho | Função |
|---------|--------|
| `manifest.json` | Manifesto MV3, permissões, popup, service worker |
| `popup.html` / `popup.css` / `popup.js` | Interface, formulários, log, i18n em tempo de execução |
| `i18n.js` | Textos da UI (PT / EN / ES / UA) |
| `background.js` | `POST` JSON no webhook correto conforme `payload.type` |
| `config.js` | Webhooks, timeouts, versão, `FASTSPRING_REASON_EN` |
| `PRD.md` | Especificação interna do produto (em português) |
| `translations/` | Cópias localizadas do README em inglês |
| `docs/sugestoes-e-melhorias/` | Fluxo colaborativo de sugestões (Google Docs / `.docx`) |

## Privacidade e âmbito

A extensão envia **dados operacionais** (emails, links, notas, agente) para URLs configuradas. Destina-se a **uso interno** com distribuição controlada. Não substitui obrigações de compliance da organização nos fluxos Make.

## Mais documentação

- **Requisitos do produto (PRD):** [`../PRD.md`](../PRD.md) (canónico em PT-BR); outras línguas: [`PRD-INDEX.md`](PRD-INDEX.md)
- **Sugestões e melhorias:** `docs/sugestoes-e-melhorias/README.md`
- **Índice de traduções:** [`README.md`](README.md) (esta pasta)

---

*Snov.io Support — ferramenta interna.*
