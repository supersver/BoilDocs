import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSummarize } from '../hooks/useSummarize'
import type { SummaryResult } from '../types'

// ---------------------------------------------------------------------------
// Shared mock result fixture
// ---------------------------------------------------------------------------

const mockResult: SummaryResult = {
  title: 'Intersection Observer API',
  source: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
  sourceType: 'url',
  oneLiner: 'Observe element visibility asynchronously.',
  readingTime: 4,
  difficulty: 'Intermediate',
  concepts: ['Observer', 'Threshold', 'Root'],
  sections: [
    {
      title: 'Overview',
      paragraphs: ['The Intersection Observer API lets you observe visibility changes.'],
      bullets: ['Async — no layout thrash.', 'Configurable thresholds.'],
    },
  ],
  quickStart: 'new IntersectionObserver(callback, options)',
  generatedAt: '2024-01-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

vi.mock('../api/summarize', () => ({
  summarize: vi.fn(),
}))

// Pull the mocked reference after the module is mocked
import { summarize } from '../api/summarize'
const mockSummarize = vi.mocked(summarize)

// ---------------------------------------------------------------------------
// useSummarize hook
// ---------------------------------------------------------------------------

describe('useSummarize()', () => {
  beforeEach(() => {
    mockSummarize.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ── Initial state ─────────────────────────────────────────────────────────

  it('initialises with url mode', () => {
    const { result } = renderHook(() => useSummarize())
    expect(result.current.mode).toBe('url')
  })

  it('initialises with a default MDN URL value', () => {
    const { result } = renderHook(() => useSummarize())
    expect(result.current.value).toMatch(/^https?:\/\//)
  })

  it('initialises with no result, no error, not loading', () => {
    const { result } = renderHook(() => useSummarize())
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBe('')
    expect(result.current.loading).toBe(false)
  })

  it('has canSubmit true for the default URL value', () => {
    const { result } = renderHook(() => useSummarize())
    expect(result.current.canSubmit).toBe(true)
  })

  // ── Mode / value ──────────────────────────────────────────────────────────

  it('setMode changes mode', () => {
    const { result } = renderHook(() => useSummarize())
    act(() => result.current.setMode('text'))
    expect(result.current.mode).toBe('text')
  })

  it('setValue changes value', () => {
    const { result } = renderHook(() => useSummarize())
    act(() => result.current.setValue('https://docs.example.com'))
    expect(result.current.value).toBe('https://docs.example.com')
  })

  // ── canSubmit ─────────────────────────────────────────────────────────────

  describe('canSubmit', () => {
    it('is false in url mode when value is not a URL', () => {
      const { result } = renderHook(() => useSummarize())
      act(() => result.current.setValue('not-a-url'))
      expect(result.current.canSubmit).toBe(false)
    })

    it('is true in url mode when value starts with http://', () => {
      const { result } = renderHook(() => useSummarize())
      act(() => result.current.setValue('http://example.com'))
      expect(result.current.canSubmit).toBe(true)
    })

    it('is true in url mode when value starts with https://', () => {
      const { result } = renderHook(() => useSummarize())
      act(() => result.current.setValue('https://example.com'))
      expect(result.current.canSubmit).toBe(true)
    })

    it('is false in text mode when value is shorter than 80 characters', () => {
      const { result } = renderHook(() => useSummarize())
      act(() => {
        result.current.setMode('text')
        result.current.setValue('too short')
      })
      expect(result.current.canSubmit).toBe(false)
    })

    it('is true in text mode when value is at least 80 characters', () => {
      const { result } = renderHook(() => useSummarize())
      act(() => {
        result.current.setMode('text')
        result.current.setValue('a'.repeat(80))
      })
      expect(result.current.canSubmit).toBe(true)
    })
  })

  // ── handleSubmit ──────────────────────────────────────────────────────────

  describe('handleSubmit()', () => {
    it('calls summarize with the current mode and trimmed value', async () => {
      mockSummarize.mockResolvedValue(mockResult)
      const { result } = renderHook(() => useSummarize())

      act(() => result.current.setValue('https://docs.example.com  '))
      await act(async () => { await result.current.handleSubmit() })

      expect(mockSummarize).toHaveBeenCalledWith({
        type: 'url',
        value: 'https://docs.example.com',
      })
    })

    it('sets result on success', async () => {
      mockSummarize.mockResolvedValue(mockResult)
      const { result } = renderHook(() => useSummarize())

      await act(async () => { await result.current.handleSubmit() })

      expect(result.current.result).toEqual(mockResult)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('')
    })

    it('sets error string on failure', async () => {
      mockSummarize.mockRejectedValue(new Error('Network error'))
      const { result } = renderHook(() => useSummarize())

      await act(async () => { await result.current.handleSubmit() })

      expect(result.current.error).toBe('Network error')
      expect(result.current.result).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('sets a fallback error string for non-Error throws', async () => {
      mockSummarize.mockRejectedValue('plain string error')
      const { result } = renderHook(() => useSummarize())

      await act(async () => { await result.current.handleSubmit() })

      expect(result.current.error).toBe('Something went wrong.')
    })

    it('does not call summarize when canSubmit is false', async () => {
      const { result } = renderHook(() => useSummarize())
      act(() => result.current.setValue('not-a-url'))

      await act(async () => { await result.current.handleSubmit() })

      expect(mockSummarize).not.toHaveBeenCalled()
    })

    it('does not call summarize again while loading', async () => {
      let resolveFirst!: (v: SummaryResult) => void
      mockSummarize.mockReturnValue(new Promise((res) => { resolveFirst = res }))

      const { result } = renderHook(() => useSummarize())

      // Start first submission (still in-flight)
      act(() => { void result.current.handleSubmit() })
      expect(result.current.loading).toBe(true)

      // Second attempt while loading should be ignored
      await act(async () => { await result.current.handleSubmit() })
      expect(mockSummarize).toHaveBeenCalledTimes(1)

      // Resolve so the hook cleans up
      await act(async () => { resolveFirst(mockResult) })
    })
  })

  // ── dismiss / dismissError ────────────────────────────────────────────────

  describe('dismiss()', () => {
    it('clears the result', async () => {
      mockSummarize.mockResolvedValue(mockResult)
      const { result } = renderHook(() => useSummarize())
      await act(async () => { await result.current.handleSubmit() })
      expect(result.current.result).not.toBeNull()

      act(() => result.current.dismiss())
      expect(result.current.result).toBeNull()
    })
  })

  describe('dismissError()', () => {
    it('clears the error string', async () => {
      mockSummarize.mockRejectedValue(new Error('oops'))
      const { result } = renderHook(() => useSummarize())
      await act(async () => { await result.current.handleSubmit() })
      expect(result.current.error).toBeTruthy()

      act(() => result.current.dismissError())
      expect(result.current.error).toBe('')
    })
  })

  // ── copySummary ───────────────────────────────────────────────────────────

  describe('copySummary()', () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
      })
    })

    it('writes a formatted text to the clipboard', async () => {
      mockSummarize.mockResolvedValue(mockResult)
      const { result } = renderHook(() => useSummarize())
      await act(async () => { await result.current.handleSubmit() })

      await act(async () => { await result.current.copySummary() })

      const written = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
      expect(written).toContain(mockResult.title)
      expect(written).toContain(mockResult.oneLiner)
      expect(written).toContain(mockResult.sections[0].title)
    })

    it('sets copied to true then resets to false after 1500 ms', async () => {
      vi.useFakeTimers()
      mockSummarize.mockResolvedValue(mockResult)
      const { result } = renderHook(() => useSummarize())
      await act(async () => { await result.current.handleSubmit() })

      await act(async () => { await result.current.copySummary() })
      expect(result.current.copied).toBe(true)

      act(() => vi.advanceTimersByTime(1500))
      expect(result.current.copied).toBe(false)

      vi.useRealTimers()
    })

    it('does nothing when result is null', async () => {
      const { result } = renderHook(() => useSummarize())
      await act(async () => { await result.current.copySummary() })
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    })
  })
})
