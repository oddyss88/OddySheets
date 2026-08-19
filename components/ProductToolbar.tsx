import { SortOption, SORT_OPTIONS } from '@/lib/constants'
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-rule pt-3">
      <p className="text-sm text-dust">
        {resultCount} {resultCount === 1 ? 'item' : 'items'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onHideSoldOutChange(!hideSoldOut)}
          className={cn(
            'text-sm transition-colors',
            hideSoldOut ? 'text-accent' : 'text-dust hover:text-ink'
          )}
        >
          Hide sold out
        </button>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 bg-linen border border-rule rounded-lg text-sm text-ink appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
