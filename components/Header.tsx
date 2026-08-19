'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, Heart, Store, UserCheck, ShieldCheck } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist'

interface HeaderProps {
  showMenu?: boolean
}

const MENU_LINKS = [
  { href: '/sellers', label: 'Trusted Yupoo sellers', icon: Store },
  { href: '/agents', label: 'Trusted agents', icon: UserCheck },
  { href: '/admin', label: 'Admin panel', icon: ShieldCheck },
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
    <header className="sticky top-9 z-50 bg-paper border-b border-rule">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl text-ink">
            OddySheets
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/wishlist"
              className="relative flex items-center text-graphite hover:text-ink transition-colors"
            >
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {ids.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-accent text-paper text-[10px] rounded-full">
                  {ids.length}
                </span>
              )}
            </Link>
            {showMenu && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-1.5 text-sm text-graphite hover:text-ink transition-colors"
                >
                  <Menu className="w-4 h-4" strokeWidth={1.5} />
                  Menu
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-linen border border-rule rounded-lg overflow-hidden animate-fade-in z-[70] p-1">
                    {MENU_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-paper transition-colors text-sm text-graphite hover:text-ink"
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
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
