# BoilDocs

> Turn technical documentation into concise, structured, and actionable notes for developers.

BoilDocs is a developer-focused documentation summarizer built with **React, TypeScript, Vite, Tailwind CSS, n8n, and OpenRouter**.

Paste a documentation URL or raw documentation, and BoilDocs processes the content and turns it into a structured summary containing key concepts, important sections, quick-start information, code examples, caveats, difficulty, and estimated reading time.

The frontend and automation layer are intentionally separated: the React application handles the user experience, while n8n handles documentation processing and AI-powered summarization.

---

## Features

- Summarize documentation from a URL
- Summarize pasted documentation text
- Extract important concepts
- Generate structured documentation sections
- Generate quick-start guidance
- Extract useful code examples
- Highlight caveats and important considerations
- Estimate reading time
- Classify documentation difficulty
- Return predictable structured JSON
- React + TypeScript frontend
- Tailwind CSS UI
- n8n automation backend
- OpenRouter LLM integration
- Free-model support through OpenRouter
- Mock-data fallback for frontend development

---

## Why BoilDocs?

Developer documentation can contain a lot of useful information, but finding the important parts often requires reading through large pages first.

BoilDocs focuses on reducing that initial reading overhead by extracting the information developers typically need when learning or evaluating a technology.

```text
Long Documentation
        ↓
     BoilDocs
        ↓
Structured Developer Notes
```

## Architecture

```
┌──────────────────────────────────────┐
│       React + TypeScript             │
│          + Tailwind CSS              │
└──────────────────┬───────────────────┘
                   │
                   │ POST
                   │ { type, value }
                   ▼
          ┌───────────────────┐
          │    n8n Webhook    │
          └─────────┬─────────┘
                    │
             ┌──────┴───────┐
             │              │
             ▼              ▼
      Documentation      Pasted Text
            URL               │
             │                │
             ▼                │
      Fetch Documentation     │
             │                │
             ▼                │
       Extract / Clean        │
             │                │
             └───────┬────────┘
                     ▼
              Prepare Content
                     │
                     ▼
              LLM Summarization
                     │
                     ▼
              Validate Response
                     │
                     ▼
             Respond to Webhook
                     │
                     ▼
                 React UI
```