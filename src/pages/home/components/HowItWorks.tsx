const STEPS = [
  ['01', 'Extract', 'n8n fetches the source and strips navigation noise.'],
  ['02', 'Structure', 'The model turns raw docs into a predictable schema.'],
  ['03', 'Explain', "The UI presents the result like a senior engineer's notes."],
] as const

export function HowItWorks() {
  return (
    <div className="mt-16 grid gap-3 sm:grid-cols-3">
      {STEPS.map(([number, title, text]) => (
        <div
          key={number}
          className="rounded-xl border border-white/8 bg-white/[0.018] p-4"
        >
          <div className="text-[10px] tracking-[.2em] text-zinc-700">
            {number}
          </div>
          <div className="mt-5 text-sm font-medium text-zinc-200">{title}</div>
          <p className="mt-1.5 text-xs leading-5 text-zinc-600">{text}</p>
        </div>
      ))}
    </div>
  )
}
