import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputCard } from '../components/InputCard'
import type { Mode } from '../types'

// ---------------------------------------------------------------------------
// Default props factory
// ---------------------------------------------------------------------------

function makeProps(overrides: Partial<Parameters<typeof InputCard>[0]> = {}) {
  return {
    mode: 'url' as Mode,
    value: 'https://docs.example.com',
    loading: false,
    error: '',
    canSubmit: true,
    onModeChange: vi.fn(),
    onValueChange: vi.fn(),
    onSubmit: vi.fn(),
    onDismissError: vi.fn(),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// InputCard component
// ---------------------------------------------------------------------------

describe('<InputCard />', () => {
  // ── Tab switcher ───────────────────────────────────────────────────────────

  describe('tab switcher', () => {
    it('renders both tab buttons', () => {
      render(<InputCard {...makeProps()} />)
      expect(screen.getByText('Documentation URL')).toBeInTheDocument()
      expect(screen.getByText('Paste text')).toBeInTheDocument()
    })

    it('calls onModeChange("text") when the Paste text tab is clicked', () => {
      const onModeChange = vi.fn()
      render(<InputCard {...makeProps({ onModeChange })} />)
      fireEvent.click(screen.getByText('Paste text'))
      expect(onModeChange).toHaveBeenCalledWith('text')
    })

    it('calls onModeChange("url") when the Documentation URL tab is clicked', () => {
      const onModeChange = vi.fn()
      render(<InputCard {...makeProps({ mode: 'text', onModeChange })} />)
      fireEvent.click(screen.getByText('Documentation URL'))
      expect(onModeChange).toHaveBeenCalledWith('url')
    })
  })

  // ── Textarea ───────────────────────────────────────────────────────────────

  describe('textarea', () => {
    it('shows the URL placeholder in url mode', () => {
      render(<InputCard {...makeProps()} />)
      expect(screen.getByPlaceholderText(/https:\/\/docs\.example\.com/i)).toBeInTheDocument()
    })

    it('shows the paste placeholder in text mode', () => {
      render(<InputCard {...makeProps({ mode: 'text', value: '' })} />)
      expect(screen.getByPlaceholderText(/paste the documentation/i)).toBeInTheDocument()
    })

    it('reflects the value prop', () => {
      render(<InputCard {...makeProps({ value: 'https://example.com' })} />)
      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument()
    })

    it('calls onValueChange when the textarea changes', () => {
      const onValueChange = vi.fn()
      render(<InputCard {...makeProps({ onValueChange })} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://new.com' } })
      expect(onValueChange).toHaveBeenCalledWith('https://new.com')
    })
  })

  // ── Label ──────────────────────────────────────────────────────────────────

  describe('field label', () => {
    it('shows "Source URL" in url mode', () => {
      render(<InputCard {...makeProps()} />)
      expect(screen.getByText('Source URL')).toBeInTheDocument()
    })

    it('shows "Documentation text" in text mode', () => {
      render(<InputCard {...makeProps({ mode: 'text' })} />)
      expect(screen.getByText('Documentation text')).toBeInTheDocument()
    })
  })

  // ── Submit button ──────────────────────────────────────────────────────────

  describe('submit button', () => {
    it('renders "Summarize docs" when not loading', () => {
      render(<InputCard {...makeProps()} />)
      expect(screen.getByRole('button', { name: /summarize docs/i })).toBeInTheDocument()
    })

    it('renders "Summarizing…" when loading', () => {
      render(<InputCard {...makeProps({ loading: true })} />)
      expect(screen.getByRole('button', { name: /summarizing/i })).toBeInTheDocument()
    })

    it('is disabled when canSubmit is false', () => {
      render(<InputCard {...makeProps({ canSubmit: false })} />)
      expect(screen.getByRole('button', { name: /summarize docs/i })).toBeDisabled()
    })

    it('is disabled when loading is true', () => {
      render(<InputCard {...makeProps({ loading: true })} />)
      expect(screen.getByRole('button', { name: /summarizing/i })).toBeDisabled()
    })

    it('calls onSubmit when clicked and not disabled', () => {
      const onSubmit = vi.fn()
      render(<InputCard {...makeProps({ onSubmit })} />)
      fireEvent.click(screen.getByRole('button', { name: /summarize docs/i }))
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })
  })

  // ── Error banner ───────────────────────────────────────────────────────────

  describe('error banner', () => {
    it('is not shown when error is empty', () => {
      render(<InputCard {...makeProps({ error: '' })} />)
      expect(screen.queryByText(/n8n returned/i)).not.toBeInTheDocument()
    })

    it('is shown when error is set', () => {
      render(<InputCard {...makeProps({ error: 'n8n returned 502' })} />)
      expect(screen.getByText(/n8n returned 502/i)).toBeInTheDocument()
    })
  })

  // ── Character count hint ───────────────────────────────────────────────────

  describe('character count hint', () => {
    it('shows character count in text mode', () => {
      render(<InputCard {...makeProps({ mode: 'text', value: 'hello world' })} />)
      expect(screen.getByText(/11 characters/i)).toBeInTheDocument()
    })

    it('shows the MVP hint in url mode', () => {
      render(<InputCard {...makeProps()} />)
      expect(screen.getByText(/public html docs work best/i)).toBeInTheDocument()
    })
  })
})
