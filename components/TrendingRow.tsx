import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface TrendingRowProps {
  products: Product[]
}

export default function TrendingRow({ products }: TrendingRowProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-line">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-1">Ledger</p>
      <h2 className="font-heading uppercase tracking-wide text-xl text-paper mb-6">
        Trending this week
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
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
