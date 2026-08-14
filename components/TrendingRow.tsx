import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { TrendingUp } from 'lucide-react'

interface TrendingRowProps {
  products: Product[]
}

export default function TrendingRow({ products }: TrendingRowProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="font-display text-xl font-bold">Trending This Week</h2>
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
