import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface TrendingRowProps {
  products: Product[]
}

export default function TrendingRow({ products }: TrendingRowProps) {
  if (products.length === 0) return null

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 border-t border-rule">
      <p className="text-sm text-dust mb-1">trending this week</p>
      <h2 className="font-serif text-xl text-ink mb-2">What people are buying</h2>

      <div>
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
