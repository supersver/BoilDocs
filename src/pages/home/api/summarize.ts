import type { SummarizeRequest, SummaryResult } from '../types'
import { createMockSummary } from '../../../lib/mock'

const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

export async function summarize(request: SummarizeRequest): Promise<SummaryResult> {
  if (!webhookUrl) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return createMockSummary(request)
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`n8n returned ${response.status}`)
  }

  const payload = await response.json() as SummaryResult | { data: SummaryResult }
  return 'data' in payload ? payload.data : payload
}
