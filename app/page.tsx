'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { STORE_CATEGORIES, SortOption } from '@/lib/constants'
import { filterProducts, sortProducts } from '@/lib/product-utils'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedRow from '@/components/FeaturedRow'
import ProductToolbar from '@/components/ProductToolbar'
import EmptyState from '@/components/EmptyState'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [hideSoldOut, setHideSoldOut] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const featuredProducts = useMemo(
    () => products.filter(p => p.status === 'new').slice(0, 8),
    [products]
  )

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category: selectedCategory,
      searchQuery,
      hideSoldOut,
    })
    return sortProducts(filtered, sort)
  }, [products, selectedCategory, searchQuery, hideSoldOut, sort])

  const showFeatured =
    !loading &&
    featuredProducts.length > 0 &&
    selectedCategory === 'All' &&
    !searchQuery

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  function getEmptyVariant(): 'no-products' | 'no-results' | 'filtered-category' {
    if (products.length === 0) return 'no-products'
    if (searchQuery) return 'no-results'
    if (selectedCategory !== 'All') return 'filtered-category'
    return 'no-results'
  }

  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <Hero />

      {showFeatured && <FeaturedRow products={featuredProducts} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={[...STORE_CATEGORIES]}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        {!loading && products.length > 0 && (
          <ProductToolbar
            sort={sort}
            onSortChange={setSort}
            hideSoldOut={hideSoldOut}
            onHideSoldOutChange={setHideSoldOut}
            resultCount={filteredProducts.length}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl h-[420px] animate-pulse border border-white/5"
                style={{ animationDelay: `${i * 75}ms` }}
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState variant={getEmptyVariant()} category={selectedCategory} />
        ) : (
          <>
            {!showFeatured && (
              <h2 className="font-display text-xl font-bold mb-6">All Products</h2>
            )}
            {showFeatured && (
              <h2 className="font-display text-xl font-bold mb-6">All Products</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
