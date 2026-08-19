import { Product, ProductStatus } from '@/types/product'
import { SortOption } from '@/lib/constants'

export const STATUS_COLORS: Record<ProductStatus, string> = {
  new: 'text-accent2',
  'in-stock': 'text-dust',
  'pre-order': 'text-dust',
  'sold-out': 'text-brick',
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  new: 'new',
  'in-stock': 'in stock',
  'pre-order': 'pre-order',
  'sold-out': 'sold out',
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
