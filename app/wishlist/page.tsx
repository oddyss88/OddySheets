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
    <main className="min-h-screen bg-dark">
      <Header showAdmin={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-bold mb-8">Your Wishlist</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl h-[420px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <Heart className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-300 text-lg font-medium">Your wishlist is empty</p>
            <p className="text-gray-600 text-sm mt-2 mb-6">
              Tap the heart on any product to save it here
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 rounded-xl font-medium transition-colors text-sm"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
