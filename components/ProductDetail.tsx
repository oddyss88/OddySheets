'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { logProductClick } from '@/lib/analytics'
import { Product } from '@/types/product'
import Header from '@/components/Header'
import ProductStatusBadge from '@/components/ProductStatusBadge'
import ProductCard from '@/components/ProductCard'
import NotFoundView from '@/components/NotFoundView'
import { ArrowLeft, ArrowUpRight, Tag, ChevronRight } from 'lucide-react'

interface ProductDetailProps {
  id: string
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return
    supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4)
      .then(({ data }) => setRelatedProducts(data || []))
  }, [product])

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
        return
      }
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-linen animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-linen animate-pulse w-3/4 rounded" />
              <div className="h-10 bg-linen animate-pulse w-1/3 rounded" />
              <div className="h-24 bg-linen animate-pulse rounded" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-paper">
        <Header />
        <NotFoundView
          title="Product not found"
          message="This item may have been removed from the catalog."
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper pb-24 md:pb-12">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-dust mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative aspect-square bg-linen rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-rule">
                <Tag className="w-16 h-16" strokeWidth={1.25} />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-dust mb-2">{product.category}</span>
            <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-ink">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl text-ink tabular-nums">${product.price.toFixed(2)}</span>
              <ProductStatusBadge status={product.status} className="text-sm" />
            </div>

            {product.description && (
              <p className="mt-6 text-graphite leading-relaxed">{product.description}</p>
            )}

            {product.status === 'pre-order' && (
              <p className="mt-4 text-sm text-graphite bg-linen rounded-lg px-4 py-3">
                Pre-order item — shipping typically starts 7–15 days after ordering.
              </p>
            )}

            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => logProductClick(product.id)}
              className="hidden md:flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors mt-8"
            >
              Buy on Superbuy
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="hidden md:flex items-center justify-center gap-2 w-full py-3 mt-3 text-dust hover:text-ink transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to catalog
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-14 pt-8 border-t border-rule">
            <h2 className="font-serif text-xl text-ink mb-2">
              More from {product.category}
            </h2>
            <div>
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-paper border-t border-rule md:hidden">
        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => logProductClick(product.id)}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors"
        >
          Buy on Superbuy — ${product.price.toFixed(2)}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  )
}
