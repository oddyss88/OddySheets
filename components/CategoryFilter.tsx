import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'px-3.5 py-1.5 rounded-full border text-sm whitespace-nowrap transition-colors',
            selected === category
              ? 'border-accent text-accent'
              : 'border-rule text-dust hover:text-ink hover:border-dust'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
