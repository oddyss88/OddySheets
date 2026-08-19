import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface TrendingRowProps {
  products: Product[]
}

export default function TrendingRow({ products }: TrendingRowProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-rule">
      <p className="text-sm text-dust mb-1">trending this week</p>
      <h2 className="font-serif text-xl text-ink mb-6">What people are buying</h2>

      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 sm:w-72 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
