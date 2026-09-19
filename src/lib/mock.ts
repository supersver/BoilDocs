import type { SummaryResult } from '../pages/home/types'

export function createMockSummary(input: { type: 'url' | 'text'; value: string }): SummaryResult {
  const fallbackTitle = input.type === 'url'
    ? new URL(input.value).hostname.replace(/^www\./, '')
    : 'Pasted documentation'

  return {
    title: fallbackTitle,
    source: input.value,
    sourceType: input.type,
    oneLiner: 'A practical summary generated from the supplied documentation, organized for fast developer comprehension.',
    readingTime: 4,
    difficulty: 'Intermediate',
    concepts: ['Core API', 'Configuration', 'Request flow', 'Examples'],
    sections: [
      {
        title: 'What this documentation covers',
        paragraphs: [
          'This section explains the main purpose of the documentation and the problem the underlying tool or API is intended to solve.',
          'For the production workflow, n8n fetches and normalizes the source before sending the cleaned content to the selected language model.'
        ],
        bullets: [
          'Identify the core primitive first.',
          'Understand required setup before optional configuration.',
          'Use the quickstart to validate the smallest successful path.'
        ]
      },
      {
        title: 'Key concepts',
        paragraphs: ['The important pieces fit into a simple request → processing → response flow. Keep the mental model small and expand into advanced configuration only when needed.'],
        bullets: [
          'Inputs define what the system receives.',
          'The core API performs the main operation.',
          'Configuration changes behavior without changing the basic flow.'
        ]
      },
      {
        title: 'Quickstart',
        paragraphs: ['Start with the smallest working example, verify the response, then layer in production concerns such as authentication, retries, caching, and observability.'],
        code: 'curl https://example.com/api \\\n  -H "Authorization: Bearer $TOKEN"'
      },
      {
        title: 'Things to watch',
        paragraphs: ['The summarizer intentionally surfaces caveats separately so implementation details do not get lost inside the high-level overview.'],
        bullets: [
          'Required credentials and environment variables.',
          'Rate limits and payload size constraints.',
          'Version-specific behavior and deprecated APIs.'
        ]
      }
    ],
    quickStart: 'Read the overview → scan the concepts → copy the minimal example → return to the source only for edge cases.',
    caveats: ['Mock mode is active until DOCS_N8N_WEBHOOK_URL is configured.'],
    generatedAt: new Date().toISOString(),
  }
}
