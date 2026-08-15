import Link from 'next/link'
import { Product } from '@/types/product'
import ProductStatusBadge from '@/components/ProductStatusBadge'
import { Tag, Heart, ArrowUpRight } from 'lucide-react'
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
    <div className="relative bg-card border border-line hover:border-accent transition-colors duration-200 group flex flex-col h-full animate-fade-in">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-paper m-2 border border-line overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-3"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-line">
              <Tag className="w-12 h-12" />
            </div>
          )}
          {product.status === 'new' && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-card border border-accent2 text-accent2 text-[10px] font-mono uppercase tracking-wide -rotate-3">
              New
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
            'absolute top-4 left-4 p-1.5 border transition-colors',
            wishlisted
              ? 'bg-accent border-accent text-paper'
              : 'bg-dark/80 border-line text-ink hover:border-accent'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', wishlisted && 'fill-current')} />
        </button>
      )}

      <div className="p-4 space-y-2.5 flex flex-col flex-1">
        <Link href={`/product/${product.id}`}>
          <h3
            className={cn(
              'font-heading uppercase tracking-wide text-paper line-clamp-2 leading-tight hover:text-accent transition-colors',
              isFeatured ? 'text-base' : 'text-sm'
            )}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              'font-mono tabular-nums text-paper',
              isFeatured ? 'text-xl' : 'text-lg'
            )}
          >
            ${product.price.toFixed(2)}
          </span>
          <ProductStatusBadge status={product.status} />
        </div>

        {product.description && (
          <p className="text-muted text-xs line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {showBuyButton && (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => logProductClick(product.id)}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-accent hover:bg-accent/90 text-paper transition-colors font-heading uppercase tracking-wide text-sm mt-auto"
          >
            Buy
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}
