import type { Metadata } from 'next'
import { Fraunces, Work_Sans } from 'next/font/google'
import PromoBar from '@/components/PromoBar'
import './globals.css'

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
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
      <body
        className={`${workSans.variable} ${fraunces.variable} font-sans bg-paper text-graphite min-h-screen`}
      >
        <PromoBar />
        {children}
      </body>
    </html>
  )
}
