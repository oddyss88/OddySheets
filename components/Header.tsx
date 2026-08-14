'use client'

import Link from 'next/link'
import { ShoppingBag, ExternalLink, Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist'

interface HeaderProps {
  showAdmin?: boolean
}

export default function Header({ showAdmin = true }: HeaderProps) {
  const { ids } = useWishlist()

  return (
    <header className="sticky top-9 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ShoppingBag className="w-8 h-8 text-accent group-hover:scale-105 transition-transform" />
            <span className="font-display text-2xl font-bold tracking-tight">OddySheets</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
            >
              <Heart className="w-5 h-5" />
              {ids.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full">
                  {ids.length}
                </span>
              )}
            </Link>
            {showAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
