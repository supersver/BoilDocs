import { Check, Clipboard } from 'lucide-react'
import { Stat } from '../../../components/elements/Stat'
import type { SummaryResult } from '../types'

interface SummaryViewProps {
  result: SummaryResult
  copied: boolean
  onBack: () => void
  onCopy: () => void
}

export function SummaryView({ result, copied, onBack, onCopy }: SummaryViewProps) {
  return (
    <section>
      {/* Toolbar */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs text-zinc-500 transition hover:text-white"
        >
          ← New summary
        </button>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Clipboard className="size-3.5" />
          )}
          {copied ? 'Copied' : 'Copy summary'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="h-fit space-y-5 lg:sticky lg:top-6">
          <div>
            <div className="text-[10px] uppercase tracking-[.2em] text-zinc-600">
              Source
            </div>
            <a
              href={result.sourceType === 'url' ? result.source : undefined}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-words text-xs leading-5 text-zinc-400 hover:text-white"
            >
              {result.source}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Read" value={`${result.readingTime} min`} />
            <Stat label="Level" value={result.difficulty} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[.2em] text-zinc-600">
              Concepts
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-white/8 bg-white/[0.025] px-2.5 py-1 text-[11px] text-zinc-500"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Article body */}
        <article className="max-w-3xl">
          <div className="border-b border-white/10 pb-8">
            <div className="mb-3 text-xs uppercase tracking-[.18em] text-indigo-300">
              Documentation summary
            </div>
            <h1 className="text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
              {result.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              {result.oneLiner}
            </p>
          </div>

          <div className="space-y-12 pt-10">
            {result.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <div className="mt-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex gap-3 text-sm leading-6 text-zinc-400"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-600" />
                        {bullet}
                      </div>
                    ))}
                  </div>
                )}
                {section.code && (
                  <pre className="mt-5 overflow-x-auto rounded-xl border border-white/8 bg-black/30 p-4 text-xs leading-6 text-zinc-300">
                    <code>{section.code}</code>
                  </pre>
                )}
              </section>
            ))}
          </div>

          {result.quickStart && (
            <div className="mt-12 rounded-2xl border border-indigo-300/10 bg-indigo-300/[0.04] p-5">
              <div className="text-xs font-medium text-indigo-100">
                Quick mental model
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {result.quickStart}
              </p>
            </div>
          )}

          {result.caveats?.length ? (
            <div className="mt-4 text-xs text-zinc-600">
              {result.caveats.join(' · ')}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  )
}
