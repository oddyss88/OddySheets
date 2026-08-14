import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { Flame } from 'lucide-react'

interface FeaturedRowProps {
  products: Product[]
}

export default function FeaturedRow({ products }: FeaturedRowProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-5 h-5 text-green-400" />
        <h2 className="font-display text-xl font-bold">New Drops</h2>
        <span className="text-gray-500 text-sm">({products.length})</span>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 sm:w-72 snap-start animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <ProductCard product={product} variant="featured" />
          </div>
        ))}
      </div>
    </section>
  )
}
