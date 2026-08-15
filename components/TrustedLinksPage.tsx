'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Header from '@/components/Header'
import { fetchSiteSettings } from '@/lib/settings'
import { LinkEntry } from '@/types/settings'

interface TrustedLinksPageProps {
  title: string
  blurb: string
  listKey: 'yupoo_sellers' | 'trusted_agents'
  icon: ReactNode
  emptyIcon: ReactNode
}

export default function TrustedLinksPage({ title, blurb, listKey, icon, emptyIcon }: TrustedLinksPageProps) {
  const [entries, setEntries] = useState<LinkEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSiteSettings().then((settings) => {
      setEntries(settings[listKey])
      setLoading(false)
    })
  }, [listKey])

  return (
    <main className="min-h-screen bg-dark">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wide text-muted hover:text-paper mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h1 className="font-heading uppercase tracking-wide text-2xl text-paper">{title}</h1>
        </div>
        <p className="text-muted text-sm mb-8">{blurb}</p>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-[68px] bg-card border border-line animate-pulse"
                style={{ animationDelay: `${i * 75}ms` }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            {emptyIcon}
            <p className="text-paper text-lg font-heading uppercase tracking-wide mt-4">None added yet</p>
            <p className="text-muted text-sm mt-2">Check back soon</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry, i) => (
              <li key={entry.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-5 py-4 bg-card border border-line hover:border-accent transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-heading uppercase tracking-wide text-paper group-hover:text-accent transition-colors truncate">{entry.name}</p>
                    {entry.note && (
                      <p className="text-sm text-muted truncate mt-0.5">{entry.note}</p>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
