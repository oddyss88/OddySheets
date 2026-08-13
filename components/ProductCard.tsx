import { Product } from '@/types/product'
import { ExternalLink, Tag } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const statusColors = {
    'new': 'bg-green-500/20 text-green-400 border-green-500/30',
    'in-stock': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'pre-order': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'sold-out': 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const statusLabels = {
    'new': 'NEW',
    'in-stock': 'In Stock',
    'pre-order': 'Pre-Order',
    'sold-out': 'Sold Out'
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
      <div className="relative aspect-square bg-gray-900 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Tag className="w-12 h-12" />
          </div>
        )}
        {product.status === 'new' && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-black text-xs font-bold rounded">
            NEW
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[product.status]}`}>
            {statusLabels[product.status]}
          </span>
        </div>

        {product.description && (
          <p className="text-gray-400 text-xs line-clamp-2">
            {product.description}
          </p>
        )}

        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          Buy
        </a>
      </div>
    </div>
  )
}