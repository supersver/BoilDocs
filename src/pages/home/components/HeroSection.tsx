import { Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="mb-12 max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1.5 text-xs text-indigo-200">
        <Sparkles className="size-3.5" /> Built for developers who hate
        digging through docs
      </div>
      <h1 className="text-5xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
        Turn 40 pages of docs into the 4 pages you actually need.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
        Paste a documentation URL or raw text. BoilDocs extracts the
        source, asks an LLM to structure the important parts, and gives
        you a practical implementation summary.
      </p>
    </div>
  )
}
