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
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
            selected === category
              ? 'bg-accent text-white'
              : 'bg-card text-gray-400 hover:text-white hover:bg-white/10'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}