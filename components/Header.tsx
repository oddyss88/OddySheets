'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, Heart, Store, UserCheck, ShieldCheck, ExternalLink } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist'
import { fetchSiteSettings } from '@/lib/settings'
import { LinkEntry } from '@/types/settings'

interface HeaderProps {
  showMenu?: boolean
}

function LinkList({ entries }: { entries: LinkEntry[] }) {
  if (entries.length === 0) {
    return <p className="px-3 py-2 text-xs text-gray-500">None added yet</p>
  }

  return (
    <ul className="space-y-0.5">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium truncate group-hover:text-accent transition-colors">
                {entry.name}
              </span>
              {entry.note && (
                <span className="block text-xs text-gray-500 truncate">{entry.note}</span>
              )}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Header({ showMenu = true }: HeaderProps) {
  const { ids } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [sellers, setSellers] = useState<LinkEntry[]>([])
  const [agents, setAgents] = useState<LinkEntry[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen || loaded) return
    fetchSiteSettings().then((settings) => {
      setSellers(settings.yupoo_sellers)
      setAgents(settings.trusted_agents)
      setLoaded(true)
    })
  }, [menuOpen, loaded])

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
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-white/10 rounded-xl shadow-lg overflow-hidden animate-fade-in z-[70]">
                    <div className="p-3 border-b border-white/5">
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <Store className="w-3.5 h-3.5" />
                        Trusted Yupoo Sellers
                      </div>
                      {!loaded ? (
                        <p className="px-3 py-2 text-xs text-gray-500">Loading...</p>
                      ) : (
                        <LinkList entries={sellers} />
                      )}
                    </div>

                    <div className="p-3 border-b border-white/5">
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        <UserCheck className="w-3.5 h-3.5" />
                        Trusted Agents
                      </div>
                      {!loaded ? (
                        <p className="px-3 py-2 text-xs text-gray-500">Loading...</p>
                      ) : (
                        <LinkList entries={agents} />
                      )}
                    </div>

                    <div className="p-3">
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-gray-300"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    </div>
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
