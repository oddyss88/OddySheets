import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'px-3.5 py-2 border text-xs font-heading uppercase tracking-wide whitespace-nowrap transition-colors',
            selected === category
              ? 'bg-accent border-accent text-paper'
              : 'bg-card border-line text-muted hover:text-paper hover:border-muted'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
