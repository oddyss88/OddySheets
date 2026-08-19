import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-lg border shadow-sm bg-linen animate-fade-in',
        type === 'success' ? 'border-accent2/40' : 'border-brick/40'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0 text-accent2" strokeWidth={1.5} />
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0 text-brick" strokeWidth={1.5} />
      )}
      <span className="text-sm text-ink">{message}</span>
      <button onClick={onClose} className="text-dust hover:text-ink transition-colors">
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
