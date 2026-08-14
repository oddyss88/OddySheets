'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { PROMO_BANNERS } from '@/lib/promo-banners'

const ROTATE_INTERVAL_MS = 6000

export default function PromoBar() {
  const pathname = usePathname()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (PROMO_BANNERS.length <= 1) return
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % PROMO_BANNERS.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  if (pathname?.startsWith('/admin')) return null
  if (PROMO_BANNERS.length === 0) return null

  const banner = PROMO_BANNERS[index]

  return (
    <div className="sticky top-0 z-[60] h-9 flex items-center justify-center gap-2 bg-accent px-4 text-white">
      <Gift className="w-3.5 h-3.5 shrink-0" />
      <span key={banner.id} className="truncate text-xs sm:text-sm font-medium animate-fade-in">
        {banner.message} <strong>{banner.highlight}</strong>
      </span>
      <a
        href={banner.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="shrink-0 px-3 py-1 bg-dark rounded-full text-xs font-semibold hover:bg-white hover:text-accent transition-colors"
      >
        {banner.ctaLabel}
      </a>
    </div>
  )
}
