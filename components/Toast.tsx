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
        'fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg animate-fade-in',
        type === 'success'
          ? 'bg-card border-green-500/30 text-green-400'
          : 'bg-card border-red-500/30 text-red-400'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="text-sm font-medium text-white">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}
