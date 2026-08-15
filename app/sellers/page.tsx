import type { Metadata } from 'next'
import { Store } from 'lucide-react'
import TrustedLinksPage from '@/components/TrustedLinksPage'

export const metadata: Metadata = {
  title: 'Trusted Yupoo Sellers | OddySheets',
  description: 'Yupoo sellers vetted and recommended by OddySheets.',
}

export default function SellersPage() {
  return (
    <TrustedLinksPage
      title="Trusted Yupoo Sellers"
      blurb="Vetted by us, updated regularly — these are the sellers we personally trust for quality and reliability."
      listKey="yupoo_sellers"
      icon={<Store className="w-6 h-6 text-accent" />}
      emptyIcon={<Store className="w-16 h-16 text-gray-700 mx-auto" />}
    />
  )
}
