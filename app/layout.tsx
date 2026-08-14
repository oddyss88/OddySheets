import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import PromoBar from '@/components/PromoBar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://oddy-sheets.vercel.app'),
  title: 'OddySheets',
  description: 'Premium fashion finds curated by Oddy',
  openGraph: {
    title: 'OddySheets',
    description: 'Premium fashion finds curated by Oddy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OddySheets',
    description: 'Premium fashion finds curated by Oddy',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable} font-sans bg-dark text-white min-h-screen`}>
        <PromoBar />
        {children}
      </body>
    </html>
  )
}
