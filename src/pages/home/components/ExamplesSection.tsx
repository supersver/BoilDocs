import { ChevronRight } from 'lucide-react'
import type { Mode } from '../types'

const EXAMPLES: string[] = [
  'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
  'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/',
]

interface ExamplesSectionProps {
  onSelect: (example: string, mode: Mode) => void
}

export function ExamplesSection({ onSelect }: ExamplesSectionProps) {
  return (
    <div className="mt-8">
      <div className="mb-3 text-[11px] uppercase tracking-[.18em] text-zinc-600">
        Try an example
      </div>
      <div className="space-y-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            onClick={() => onSelect(example, 'url')}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/[0.025]"
          >
            <ChevronRight className="size-3.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400" />
            <span className="truncate text-xs text-zinc-500 group-hover:text-zinc-300">
              {example}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
