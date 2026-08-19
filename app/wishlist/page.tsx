'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { useWishlist } from '@/lib/wishlist'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [ids])

  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-2xl text-ink mb-8">Your wishlist</h1>

        {loading ? (
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 border-b border-rule animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <Heart className="w-10 h-10 text-rule mx-auto mb-4" strokeWidth={1.25} />
            <p className="font-serif text-lg text-ink">Your wishlist is empty</p>
            <p className="text-dust text-sm mt-2 mb-6">
              Tap the heart on any product to save it here
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors text-sm"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
