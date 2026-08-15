'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, Heart, Store, UserCheck, ShieldCheck } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist'

interface HeaderProps {
  showMenu?: boolean
}

const MENU_LINKS = [
  { href: '/sellers', label: 'Trusted Yupoo Sellers', icon: Store },
  { href: '/agents', label: 'Trusted Agents', icon: UserCheck },
  { href: '/admin', label: 'Admin Panel', icon: ShieldCheck },
]

export default function Header({ showMenu = true }: HeaderProps) {
  const { ids } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

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
            {showMenu && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 rounded-lg transition-colors text-sm font-medium"
                >
                  <Menu className="w-4 h-4" />
                  Menu
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-white/10 rounded-xl shadow-lg overflow-hidden animate-fade-in z-[70] p-2">
                    {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-gray-300 hover:text-white"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
