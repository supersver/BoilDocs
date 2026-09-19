import { FileText, Globe2, LoaderCircle, WandSparkles } from 'lucide-react'
import { ErrorBanner } from '../../../components/elements/ErrorBanner'
import type { Mode } from '../types'

interface InputCardProps {
  mode: Mode
  value: string
  loading: boolean
  error: string
  canSubmit: boolean
  onModeChange: (mode: Mode) => void
  onValueChange: (value: string) => void
  onSubmit: () => void
  onDismissError: () => void
}

export function InputCard({
  mode,
  value,
  loading,
  error,
  canSubmit,
  onModeChange,
  onValueChange,
  onSubmit,
  onDismissError,
}: InputCardProps) {
  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,.38)]">
      {/* Tab switcher */}
      <div className="flex border-b border-white/10 bg-white/[0.02] p-1">
        <button
          onClick={() => onModeChange('url')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
            mode === 'url' ? 'bg-white text-zinc-950' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Globe2 className="size-4" /> Documentation URL
        </button>
        <button
          onClick={() => onModeChange('text')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
            mode === 'text' ? 'bg-white text-zinc-950' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <FileText className="size-4" /> Paste text
        </button>
      </div>

      {/* Input area */}
      <div className="p-5 sm:p-7">
        <label className="mb-3 block text-xs font-medium uppercase tracking-[.18em] text-zinc-500">
          {mode === 'url' ? 'Source URL' : 'Documentation text'}
        </label>
        <textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          rows={mode === 'url' ? 3 : 9}
          placeholder={
            mode === 'url'
              ? 'https://docs.example.com/getting-started'
              : 'Paste the documentation you want to understand...'
          }
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-400/5"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-600">
            {mode === 'url'
              ? 'Public HTML docs work best in the MVP.'
              : `${value.trim().length.toLocaleString()} characters`}
          </div>
          <button
            onClick={onSubmit}
            disabled={!canSubmit || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,255,255,.12)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <WandSparkles className="size-4" />
            )}
            {loading ? 'Summarizing…' : 'Summarize docs'}
          </button>
        </div>

        {error && (
          <ErrorBanner message={error} onDismiss={onDismissError} />
        )}
      </div>
    </div>
  )
}
