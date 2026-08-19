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
    <div className="relative bg-linen border border-rule rounded-lg overflow-hidden hover:border-accent transition-colors flex flex-col h-full animate-fade-in">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-paper overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-6"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rule">
              <Tag className="w-12 h-12" strokeWidth={1.25} />
            </div>
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
            'absolute top-3 left-3 p-2 rounded-full transition-colors',
            wishlisted ? 'bg-accent text-paper' : 'bg-paper/90 text-graphite hover:text-ink'
          )}
        >
          <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} strokeWidth={1.5} />
        </button>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg text-ink leading-snug line-clamp-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-ink tabular-nums">${product.price.toFixed(2)}</span>
          {product.status !== 'in-stock' && <ProductStatusBadge status={product.status} />}
        </div>

        {product.description && (
          <p className="text-xs text-dust line-clamp-2">{product.description}</p>
        )}

        {showBuyButton && (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => logProductClick(product.id)}
            className="mt-auto flex items-center justify-center py-2.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors text-sm font-medium"
          >
            Buy
          </a>
        )}
      </div>
    </div>
  )
}
