'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { FILTER_CATEGORIES, CATEGORIES, SortOption } from '@/lib/constants'
import { filterProducts, sortProducts } from '@/lib/product-utils'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'
import SearchBar from '@/components/SearchBar'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TrendingRow from '@/components/TrendingRow'
import ProductToolbar from '@/components/ProductToolbar'
import EmptyState from '@/components/EmptyState'

const PAGE_SIZE = 24

function HomeContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [hideSoldOut, setHideSoldOut] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

  const selectedCategory = useMemo(() => {
    if (searchParams.get('status') === 'new') return 'New'
    const category = searchParams.get('category')
    if (category && (CATEGORIES as readonly string[]).includes(category)) return category
    return 'All'
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
    fetchTrending()
  }, [])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedCategory, searchQuery, sort, hideSoldOut])

  function handleSelectCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('status')
    if (category === 'New') {
      params.set('status', 'new')
    } else if (category !== 'All') {
      params.set('category', category)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, {
      category: selectedCategory,
      searchQuery,
      hideSoldOut,
    })
    return sortProducts(filtered, sort)
  }, [products, selectedCategory, searchQuery, hideSoldOut, sort])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const gridHeading =
    selectedCategory === 'New' ? 'New Arrivals' : selectedCategory === 'All' ? 'All Products' : selectedCategory

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

  async function fetchTrending() {
    const { data, error } = await supabase.from('trending_products').select('*').limit(8)
    if (!error) setTrendingProducts(data || [])
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} products={products} />
        <CategoryFilter
          categories={[...FILTER_CATEGORIES]}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
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
            <h2 className="font-display text-xl font-bold mb-6">{gridHeading}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 bg-card hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors text-sm"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {!searchQuery && selectedCategory === 'All' && (
        <TrendingRow products={trendingProducts} />
      )}
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark" />}>
      <HomeContent />
    </Suspense>
  )
}
