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
        'fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 bg-card border animate-fade-in',
        type === 'success' ? 'border-accent2/50 text-accent2' : 'border-brick/50 text-brick'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="text-sm font-medium text-paper">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-line/40 transition-colors">
        <X className="w-4 h-4 text-muted" />
      </button>
    </div>
  )
}
