import { X } from 'lucide-react'

interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
      <span>{message}</span>
      <button onClick={onDismiss}>
        <X className="size-4" />
      </button>
    </div>
  )
}
