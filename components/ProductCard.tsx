import Link from 'next/link'
import { Product } from '@/types/product'
import ProductStatusBadge from '@/components/ProductStatusBadge'
import { ExternalLink, Tag, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/lib/wishlist'
import { logProductClick } from '@/lib/analytics'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'featured'
  showBuyButton?: boolean
}

export default function ProductCard({
  product,
  variant = 'default',
  showBuyButton = true,
}: ProductCardProps) {
  const isFeatured = variant === 'featured'
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <div
      className={cn(
        'relative bg-card rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 group flex flex-col h-full animate-fade-in',
        isFeatured && 'hover:shadow-accent/10'
      )}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-900 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      </Link>

      {showBuyButton && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-colors',
            wishlisted ? 'bg-accent text-white' : 'bg-black/40 text-white hover:bg-black/60'
          )}
        >
          <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
        </button>
      )}

      <div className="p-4 space-y-3 flex flex-col flex-1">
        <Link href={`/product/${product.id}`}>
          <h3
            className={cn(
              'font-semibold text-white line-clamp-2 leading-tight hover:text-accent transition-colors',
              isFeatured ? 'text-base' : 'text-sm'
            )}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className={cn('font-bold text-white', isFeatured ? 'text-2xl' : 'text-xl')}>
            ${product.price.toFixed(2)}
          </span>
          <ProductStatusBadge status={product.status} />
        </div>

        {product.description && (
          <p className="text-gray-400 text-xs line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {showBuyButton && (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => logProductClick(product.id)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium text-sm mt-auto"
          >
            <ExternalLink className="w-4 h-4" />
            Buy
          </a>
        )}
      </div>
    </div>
  )
}
