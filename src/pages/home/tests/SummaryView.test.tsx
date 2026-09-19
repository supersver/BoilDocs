import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SummaryView } from '../components/SummaryView'
import type { SummaryResult } from '../types'

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const baseResult: SummaryResult = {
  title: 'Intersection Observer API',
  source: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
  sourceType: 'url',
  oneLiner: 'Asynchronously observe element visibility without causing layout thrash.',
  readingTime: 4,
  difficulty: 'Intermediate',
  concepts: ['Observer', 'Threshold', 'Root margin'],
  sections: [
    {
      title: 'Overview',
      paragraphs: ['The IO API lets you observe visibility changes asynchronously.'],
      bullets: ['No layout thrash.', 'Configurable thresholds.'],
    },
    {
      title: 'Usage',
      paragraphs: ['Create an observer and pass a callback.'],
      code: 'const io = new IntersectionObserver(cb)',
    },
  ],
  quickStart: 'new IntersectionObserver(callback, options)',
  caveats: ['Only works in browsers that support it.'],
  generatedAt: '2024-01-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// SummaryView component
// ---------------------------------------------------------------------------

describe('<SummaryView />', () => {
  // ── Title / one-liner ──────────────────────────────────────────────────────

  it('renders the title', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1, name: baseResult.title })).toBeInTheDocument()
  })

  it('renders the oneLiner', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText(baseResult.oneLiner)).toBeInTheDocument()
  })

  // ── Metadata sidebar ───────────────────────────────────────────────────────

  it('renders readingTime', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('4 min')).toBeInTheDocument()
  })

  it('renders difficulty', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
  })

  it('renders all concepts as tags', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    for (const concept of baseResult.concepts) {
      expect(screen.getByText(concept)).toBeInTheDocument()
    }
  })

  // ── Source link ────────────────────────────────────────────────────────────

  it('renders the source as a link for url sourceType', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    const link = screen.getByRole('link', { name: baseResult.source })
    expect(link).toHaveAttribute('href', baseResult.source)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders the source without an href for text sourceType', () => {
    const textResult: SummaryResult = { ...baseResult, sourceType: 'text', source: 'Pasted documentation' }
    render(<SummaryView result={textResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    // <a href={undefined}> has no href attribute so it is not exposed as a
    // "link" role in the accessibility tree. Query by text and check the DOM.
    const anchor = screen.getByText('Pasted documentation').closest('a')
    expect(anchor).toBeInTheDocument()
    expect(anchor).not.toHaveAttribute('href')
  })

  // ── Sections ───────────────────────────────────────────────────────────────

  it('renders section headings', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    for (const section of baseResult.sections) {
      expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument()
    }
  })

  it('renders section paragraphs', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(
      screen.getByText('The IO API lets you observe visibility changes asynchronously.'),
    ).toBeInTheDocument()
  })

  it('renders bullet points when present', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('No layout thrash.')).toBeInTheDocument()
    expect(screen.getByText('Configurable thresholds.')).toBeInTheDocument()
  })

  it('renders a code block when section.code is set', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('const io = new IntersectionObserver(cb)')).toBeInTheDocument()
  })

  // ── Quick start ────────────────────────────────────────────────────────────

  it('renders the quickStart block when provided', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('Quick mental model')).toBeInTheDocument()
    expect(screen.getByText(baseResult.quickStart!)).toBeInTheDocument()
  })

  it('does not render the quickStart block when absent', () => {
    const noQS: SummaryResult = { ...baseResult, quickStart: undefined }
    render(<SummaryView result={noQS} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.queryByText('Quick mental model')).not.toBeInTheDocument()
  })

  // ── Caveats ────────────────────────────────────────────────────────────────

  it('renders caveats joined by " · "', () => {
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText(/Only works in browsers that support it\./)).toBeInTheDocument()
  })

  it('does not render the caveats line when array is empty', () => {
    const noCaveats: SummaryResult = { ...baseResult, caveats: [] }
    render(<SummaryView result={noCaveats} copied={false} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.queryByText(/Only works/)).not.toBeInTheDocument()
  })

  // ── Toolbar buttons ────────────────────────────────────────────────────────

  it('calls onBack when "← New summary" is clicked', () => {
    const onBack = vi.fn()
    render(<SummaryView result={baseResult} copied={false} onBack={onBack} onCopy={vi.fn()} />)
    fireEvent.click(screen.getByText('← New summary'))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('calls onCopy when "Copy summary" is clicked', () => {
    const onCopy = vi.fn()
    render(<SummaryView result={baseResult} copied={false} onBack={vi.fn()} onCopy={onCopy} />)
    fireEvent.click(screen.getByText('Copy summary'))
    expect(onCopy).toHaveBeenCalledTimes(1)
  })

  it('shows "Copied" label when copied is true', () => {
    render(<SummaryView result={baseResult} copied={true} onBack={vi.fn()} onCopy={vi.fn()} />)
    expect(screen.getByText('Copied')).toBeInTheDocument()
    expect(screen.queryByText('Copy summary')).not.toBeInTheDocument()
  })
})
