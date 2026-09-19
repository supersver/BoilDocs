// Shared micro-component reused across the home page sidebar
export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.018] p-3">
      <div className="text-[10px] uppercase tracking-[.16em] text-zinc-700">
        {label}
      </div>
      <div className="mt-2 text-xs font-medium text-zinc-300">{value}</div>
    </div>
  )
}
