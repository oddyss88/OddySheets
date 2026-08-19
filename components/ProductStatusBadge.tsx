import { ProductStatus } from '@/types/product'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/product-utils'
import { cn } from '@/lib/utils'

interface ProductStatusBadgeProps {
  status: ProductStatus
  className?: string
}

export default function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  return (
    <span className={cn('text-xs', STATUS_COLORS[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  )
}
