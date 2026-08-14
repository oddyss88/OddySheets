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
        <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-300 text-lg font-medium">No matches found</p>
        <p className="text-gray-600 text-sm mt-2">
          Try a different search or category filter
        </p>
      </div>
    )
  }

  if (variant === 'filtered-category') {
    return (
      <div className="text-center py-20 animate-fade-in">
        <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p className="text-gray-300 text-lg font-medium">No drops in {category} yet</p>
        <p className="text-gray-600 text-sm mt-2">
          Check back soon — new items are added regularly
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-20 animate-fade-in">
      <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
      <p className="text-gray-300 text-lg font-medium">No drops yet</p>
      <p className="text-gray-600 text-sm mt-2 mb-6">
        The catalog is empty — add your first product to get started
      </p>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 rounded-xl font-medium transition-colors text-sm"
      >
        Go to Admin
      </Link>
    </div>
  )
}
