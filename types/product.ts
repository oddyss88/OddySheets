export type ProductStatus = 'new' | 'in-stock' | 'pre-order' | 'sold-out'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  image_url: string
  affiliate_link: string
  status: ProductStatus
  description: string
  created_at: string
}