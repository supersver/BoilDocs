# BoilDocs — Documentation Summarizer

A small developer-focused web app built with React, TypeScript, Vite and Tailwind CSS, with n8n acting as the automation/AI backend.

## Architecture

```text
React + TypeScript + Tailwind
          |
          | POST { type, value }
          v
      n8n Webhook
          |
          +--> URL -> HTTP Request -> clean HTML/text
          |
          +--> Text -> normalize input
          |
          v
      LLM summarization
          |
          v
   Structured JSON response
          |
          v
        React UI
```

The app intentionally falls back to mock data when `VITE_N8N_WEBHOOK_URL` is not configured, so the frontend can be developed independently of n8n.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Then open `http://localhost:5173`.

## n8n setup

Import `n8n/docs-summarizer.json` into an n8n instance and configure the HTTP/LLM credential details described in that workflow. The webhook accepts:

```json
{
  "type": "url",
  "value": "https://developer.mozilla.org/..."
}
```

or:

```json
{
  "type": "text",
  "value": "Documentation text..."
}
```

The workflow should return the normalized `SummaryResult` JSON shape used in `src/types.ts`.

## Production hardening

Before exposing this publicly, add request authentication, URL allow/deny rules, SSRF protection, payload limits, model/token limits, rate limiting, structured output validation, and a persistent job history. For a public product, do not fetch arbitrary private-network URLs from n8n.
