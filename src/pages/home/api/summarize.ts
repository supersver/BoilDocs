import type { SummarizeRequest, SummaryResult } from '../types'
import { createMockSummary } from '../../../lib/mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export async function summarize(request: SummarizeRequest): Promise<SummaryResult> {
  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return createMockSummary(request)
  }

  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json() as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore parse errors — keep the generic message
    }
    throw new Error(message)
  }

  const payload = await response.json() as SummaryResult | { data: SummaryResult }
  return 'data' in payload ? payload.data : payload
}
