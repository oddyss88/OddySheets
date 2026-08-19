'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Product } from '@/types/product'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  products?: Product[]
}

export default function SearchBar({ value, onChange, products = [] }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const suggestions =
    focused && value.trim().length > 0
      ? products.filter(p => p.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
      : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dust" strokeWidth={1.5} />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        className="w-full pl-10 pr-4 py-2.5 bg-linen border border-rule rounded-lg text-ink placeholder-dust focus:outline-none focus:border-accent transition-colors"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-40 top-full mt-1 w-full bg-linen border border-rule rounded-lg overflow-hidden">
          {suggestions.map(product => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                setFocused(false)
                onChange('')
                router.push(`/product/${product.id}`)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-paper/60 transition-colors text-left border-b border-rule last:border-b-0 group"
            >
              <div className="w-9 h-9 rounded-md bg-paper overflow-hidden shrink-0">
                {product.image_url && (
                  <img src={product.image_url} alt="" className="w-full h-full object-contain" />
                )}
              </div>
              <span className="flex-1 text-sm text-ink truncate group-hover:text-accent transition-colors">{product.name}</span>
              <span className="text-sm text-dust">${product.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
