import { Product, ProductStatus } from '@/types/product'
import { SortOption } from '@/lib/constants'

export const STATUS_COLORS: Record<ProductStatus, string> = {
  new: 'bg-accent2/10 text-accent2 border-accent2/40',
  'in-stock': 'bg-accent/10 text-accent border-accent/40',
  'pre-order': 'bg-line/40 text-muted border-line',
  'sold-out': 'bg-brick/10 text-brick border-brick/40',
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  new: 'NEW',
  'in-stock': 'In Stock',
  'pre-order': 'Pre-Order',
  'sold-out': 'Sold Out',
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }
}

export function filterProducts(
  products: Product[],
  options: {
    category?: string
    searchQuery?: string
    hideSoldOut?: boolean
  }
): Product[] {
  let filtered = products

  if (options.hideSoldOut) {
    filtered = filtered.filter(p => p.status !== 'sold-out')
  }

  if (options.category === 'New') {
    filtered = filtered.filter(p => p.status === 'new')
  } else if (options.category && options.category !== 'All') {
    filtered = filtered.filter(p => p.category === options.category)
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query))
  }

  return filtered
}
