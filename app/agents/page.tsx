import type { Metadata } from 'next'
import { UserCheck } from 'lucide-react'
import TrustedLinksPage from '@/components/TrustedLinksPage'

export const metadata: Metadata = {
  title: 'Trusted Agents | OddySheets',
  description: 'Shipping agents vetted and recommended by OddySheets.',
}

export default function AgentsPage() {
  return (
    <TrustedLinksPage
      title="Trusted Agents"
      blurb="Vetted by us, updated regularly — these are the shipping agents we recommend for a smooth experience."
      listKey="trusted_agents"
      icon={<UserCheck className="w-6 h-6 text-accent" />}
      emptyIcon={<UserCheck className="w-14 h-14 text-line mx-auto" strokeWidth={1.5} />}
    />
  )
}
