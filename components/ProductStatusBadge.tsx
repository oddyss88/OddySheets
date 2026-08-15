import { ProductStatus } from '@/types/product'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/product-utils'
import { cn } from '@/lib/utils'

interface ProductStatusBadgeProps {
  status: ProductStatus
  className?: string
}

export default function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-1 text-[10px] font-mono uppercase tracking-wide border',
        STATUS_COLORS[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
