import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET

  if (!webhookUrl) {
    console.error('[/api/summarize] N8N_WEBHOOK_URL is not set')
    return res.status(500).json({ error: 'Server misconfiguration: webhook URL is missing' })
  }

  if (!webhookSecret) {
    console.error('[/api/summarize] N8N_WEBHOOK_SECRET is not set')
    return res.status(500).json({ error: 'Server misconfiguration: webhook secret is missing' })
  }

  let upstream: Response
  try {
    upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-workflow-secret': webhookSecret,
      },
      body: JSON.stringify(req.body),
    })
  } catch (err) {
    console.error('[/api/summarize] Failed to reach n8n:', err)
    return res.status(502).json({ error: 'Could not reach the summarization service' })
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '')
    console.error(`[/api/summarize] n8n returned ${upstream.status}:`, text)
    return res.status(upstream.status).json({
      error: `Upstream error from n8n (${upstream.status})`,
    })
  }

  const data = await upstream.json()
  return res.status(200).json(data)
}
