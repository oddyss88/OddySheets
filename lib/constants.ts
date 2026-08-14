export const CATEGORIES = [
  'Hoodies', 'Jackets', 'Sweatshirts', 'Shirts', 'T-Shirts',
  'Shorts', 'Jeans', 'Pants', 'Shoes', 'Accessories', 'Cases',
  'Bags', 'Hats', 'Socks', 'Underwear', 'Watches', 'Sunglasses', 'Jewelry',
] as const

export const STORE_CATEGORIES = ['All', ...CATEGORIES] as const

export type SortOption = 'newest' | 'price-asc' | 'price-desc'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]
