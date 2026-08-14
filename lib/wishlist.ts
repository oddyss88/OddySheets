'use client'

import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'oddysheets_wishlist'

function readWishlist(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeWishlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event('wishlist-change'))
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(readWishlist())
    const onChange = () => setIds(readWishlist())
    window.addEventListener('wishlist-change', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('wishlist-change', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const isWishlisted = useCallback((id: string) => ids.includes(id), [ids])

  const toggleWishlist = useCallback((id: string) => {
    const current = readWishlist()
    const next = current.includes(id)
      ? current.filter(existing => existing !== id)
      : [...current, id]
    writeWishlist(next)
    setIds(next)
  }, [])

  return { ids, isWishlisted, toggleWishlist }
}
