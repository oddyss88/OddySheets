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
    <main className="min-h-screen bg-paper">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-dust hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to shop
        </Link>

        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h1 className="font-serif text-2xl text-ink">{title}</h1>
        </div>
        <p className="text-dust text-sm mb-8">{blurb}</p>

        {loading ? (
          <div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-[68px] border-b border-rule animate-pulse"
                style={{ animationDelay: `${i * 75}ms` }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            {emptyIcon}
            <p className="font-serif text-lg text-ink mt-4">None added yet</p>
            <p className="text-dust text-sm mt-2">Check back soon</p>
          </div>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id} className="animate-fade-in border-b border-rule">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 py-4 group"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-lg text-ink group-hover:text-accent transition-colors truncate">{entry.name}</p>
                    {entry.note && (
                      <p className="text-sm text-dust truncate mt-0.5">{entry.note}</p>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-dust shrink-0" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
