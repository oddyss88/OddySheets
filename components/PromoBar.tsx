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
    <div className="sticky top-0 z-[60] h-9 flex items-center justify-center gap-2 bg-ink px-4 text-paper">
      <Gift className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
      <span key={banner.id} className="truncate text-xs sm:text-sm animate-fade-in">
        {banner.message} <strong className="font-medium">{banner.highlight}</strong>
      </span>
      <a
        href={banner.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="shrink-0 text-xs underline underline-offset-2 decoration-paper/40 hover:decoration-paper transition-colors"
      >
        {banner.ctaLabel}
      </a>
    </div>
  )
}
