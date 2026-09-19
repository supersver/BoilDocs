import { useMemo, useState } from 'react'
import { summarize } from '../api/summarize'
import type { Mode, SummaryResult } from '../types'

export function useSummarize() {
  const [mode, setMode] = useState<Mode>('url')
  const [value, setValue] = useState('https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API')
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const canSubmit = useMemo(() => {
    if (mode === 'url') return /^https?:\/\//i.test(value.trim())
    return value.trim().length >= 80
  }, [mode, value])

  async function handleSubmit() {
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    try {
      setResult(await summarize({ type: mode, value: value.trim() }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function copySummary() {
    if (!result) return
    const text = [
      result.title,
      result.oneLiner,
      ...result.sections.flatMap((section) => [
        section.title,
        ...section.paragraphs,
        ...(section.bullets ?? []),
      ]),
    ].join('\n\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function dismiss() {
    setResult(null)
  }

  function dismissError() {
    setError('')
  }

  return {
    mode,
    setMode,
    value,
    setValue,
    result,
    loading,
    error,
    copied,
    canSubmit,
    handleSubmit,
    copySummary,
    dismiss,
    dismissError,
  }
}
