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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        {resultCount} {resultCount === 1 ? 'item' : 'items'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onHideSoldOutChange(!hideSoldOut)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border',
            hideSoldOut
              ? 'bg-accent/20 text-accent border-accent/30'
              : 'bg-card text-gray-400 border-white/10 hover:text-white hover:border-white/20'
          )}
        >
          <EyeOff className="w-4 h-4" />
          Hide sold out
        </button>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-4 py-2 bg-card border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
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
