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
      <main className="min-h-screen bg-dark">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-card animate-pulse border border-line" />
            <div className="space-y-4">
              <div className="h-8 bg-card animate-pulse w-3/4" />
              <div className="h-10 bg-card animate-pulse w-1/3" />
              <div className="h-24 bg-card animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-dark">
        <Header />
        <NotFoundView
          title="Product not found"
          message="This item may have been removed from the catalog."
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark pb-24 md:pb-12">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm font-mono text-muted mb-8">
          <Link href="/" className="hover:text-paper transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-muted">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-paper truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative aspect-square bg-paper border border-line overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-line">
                <Tag className="w-20 h-20" />
              </div>
            )}
            {product.status === 'new' && (
              <span className="absolute top-4 right-4 px-3 py-1.5 bg-dark border border-accent2 text-accent2 text-sm font-mono uppercase tracking-wide -rotate-3">
                New
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-accent text-sm uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="font-heading uppercase tracking-wide text-3xl sm:text-4xl leading-tight text-paper">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-6">
              <span className="font-mono tabular-nums text-4xl text-paper">${product.price.toFixed(2)}</span>
              <ProductStatusBadge status={product.status} className="text-sm px-3 py-1.5" />
            </div>

            {product.description && (
              <p className="mt-6 text-ink leading-relaxed">{product.description}</p>
            )}

            {product.status === 'pre-order' && (
              <p className="mt-4 text-accent2 text-sm bg-accent2/10 border border-accent2/40 px-4 py-3">
                Pre-order item — shipping typically starts 7–15 days after ordering.
              </p>
            )}

            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => logProductClick(product.id)}
              className="hidden md:flex items-center justify-center gap-2 w-full py-4 bg-accent hover:bg-accent/90 text-paper transition-colors font-heading uppercase tracking-wide text-lg mt-8"
            >
              Buy on Superbuy
              <ArrowUpRight className="w-5 h-5" />
            </a>

            <Link
              href="/"
              className="hidden md:flex items-center justify-center gap-2 w-full py-3 mt-3 text-muted hover:text-paper transition-colors text-sm font-mono uppercase tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to catalog
            </Link>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-line">
            <h2 className="font-heading uppercase tracking-wide text-xl text-paper mb-6">
              More from {product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-dark border-t border-line md:hidden">
        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => logProductClick(product.id)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-accent hover:bg-accent/90 text-paper transition-colors font-heading uppercase tracking-wide"
        >
          Buy on Superbuy — ${product.price.toFixed(2)}
          <ArrowUpRight className="w-5 h-5" />
        </a>
      </div>
    </main>
  )
}
