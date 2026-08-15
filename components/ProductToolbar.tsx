import { SortOption, SORT_OPTIONS } from '@/lib/constants'
import { ArrowUpDown, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductToolbarProps {
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  hideSoldOut: boolean
  onHideSoldOutChange: (hide: boolean) => void
  resultCount: number
}

export default function ProductToolbar({
  sort,
  onSortChange,
  hideSoldOut,
  onHideSoldOutChange,
  resultCount,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line pt-3">
      <p className="text-sm font-mono text-muted">
        {resultCount} {resultCount === 1 ? 'item' : 'items'}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onHideSoldOutChange(!hideSoldOut)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-xs font-heading uppercase tracking-wide transition-colors border',
            hideSoldOut
              ? 'bg-accent/10 text-accent border-accent/50'
              : 'bg-card text-muted border-line hover:text-paper hover:border-muted'
          )}
        >
          <EyeOff className="w-3.5 h-3.5" />
          Hide sold out
        </button>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-4 py-2 bg-card border border-line text-xs font-heading uppercase tracking-wide text-paper appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
