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
        <Search className="w-14 h-14 text-line mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-paper text-lg font-heading uppercase tracking-wide">No matches found</p>
        <p className="text-muted text-sm mt-2">
          Try a different search or category filter
        </p>
      </div>
    )
  }

  if (variant === 'filtered-category') {
    return (
      <div className="text-center py-20 animate-fade-in">
        <ShoppingBag className="w-14 h-14 text-line mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-paper text-lg font-heading uppercase tracking-wide">
          {category === 'New' ? 'No new arrivals right now' : `No drops in ${category} yet`}
        </p>
        <p className="text-muted text-sm mt-2">
          Check back soon — new items are added regularly
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <ShoppingBag className="w-14 h-14 text-line mx-auto mb-4" strokeWidth={1.5} />
      <p className="text-paper text-lg font-heading uppercase tracking-wide">No drops yet</p>
      <p className="text-muted text-sm mt-2 mb-6">
        The catalog is empty — add your first product to get started
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-paper font-heading uppercase tracking-wide transition-colors text-sm"
      >
        Go to Admin
      </Link>
    </div>
  )
}
