import { ShoppingBag, Search } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  variant: 'no-products' | 'no-results' | 'filtered-category'
  category?: string
}

export default function EmptyState({ variant, category }: EmptyStateProps) {
  if (variant === 'no-results') {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Search className="w-10 h-10 text-rule mx-auto mb-4" strokeWidth={1.25} />
        <p className="font-serif text-lg text-ink">No matches found</p>
        <p className="text-dust text-sm mt-2">
          Try a different search or category filter
        </p>
      </div>
    )
  }

  if (variant === 'filtered-category') {
    return (
      <div className="text-center py-20 animate-fade-in">
        <ShoppingBag className="w-10 h-10 text-rule mx-auto mb-4" strokeWidth={1.25} />
        <p className="font-serif text-lg text-ink">
          {category === 'New' ? 'No new arrivals right now' : `No drops in ${category} yet`}
        </p>
        <p className="text-dust text-sm mt-2">
          Check back soon — new items are added regularly
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <ShoppingBag className="w-10 h-10 text-rule mx-auto mb-4" strokeWidth={1.25} />
      <p className="font-serif text-lg text-ink">No drops yet</p>
      <p className="text-dust text-sm mt-2 mb-6">
        The catalog is empty — add your first product to get started
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors text-sm"
      >
        Go to admin
      </Link>
    </div>
  )
}
