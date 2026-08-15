'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Package, Menu, Heart, Store, UserCheck, ShieldCheck } from 'lucide-react'
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
    <header className="sticky top-9 z-50 bg-dark border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Package className="w-6 h-6 text-accent" strokeWidth={1.75} />
            <span className="font-display text-3xl tracking-wide uppercase leading-none text-paper">
              OddySheets
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              className="relative flex items-center gap-2 px-3 py-2 border border-transparent hover:border-line transition-colors text-sm"
            >
              <Heart className="w-5 h-5" />
              {ids.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-accent2 text-dark text-[10px] font-mono font-semibold rounded-full">
                  {ids.length}
                </span>
              )}
            </Link>
            {showMenu && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-paper transition-colors text-sm font-heading uppercase tracking-wide"
                >
                  <Menu className="w-4 h-4" />
                  Menu
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-line overflow-hidden animate-fade-in z-[70] p-1.5">
                    {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-line/40 transition-colors text-sm font-heading uppercase tracking-wide text-ink hover:text-paper"
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
