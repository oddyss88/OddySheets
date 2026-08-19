import Link from 'next/link'
import { Product } from '@/types/product'
import ProductStatusBadge from '@/components/ProductStatusBadge'
import { Tag, Heart } from 'lucide-react'
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
  showBuyButton = true,
}: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="flex items-center gap-4 py-4 border-b border-rule group animate-fade-in">
      <Link href={`/product/${product.id}`} className="shrink-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linen overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rule">
              <Tag className="w-6 h-6" strokeWidth={1.5} />
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-lg text-ink truncate hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm text-ink tabular-nums shrink-0">${product.price.toFixed(2)}</span>
        </div>

        {product.description && (
          <p className="text-xs text-dust truncate mt-0.5">{product.description}</p>
        )}

        {product.status !== 'in-stock' && (
          <div className="mt-1.5">
            <ProductStatusBadge status={product.status} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {showBuyButton && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn('transition-colors', wishlisted ? 'text-accent' : 'text-dust hover:text-ink')}
          >
            <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} strokeWidth={1.5} />
          </button>
        )}

        {showBuyButton && (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => logProductClick(product.id)}
            className="text-sm font-medium text-accent hover:underline whitespace-nowrap"
          >
            Buy
          </a>
        )}
      </div>
    </div>
  )
}
