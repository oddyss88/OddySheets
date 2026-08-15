import type { Metadata } from 'next'
import { Archivo, Oswald, Bebas_Neue, IBM_Plex_Mono } from 'next/font/google'
import PromoBar from '@/components/PromoBar'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
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
        className={`${archivo.variable} ${oswald.variable} ${bebasNeue.variable} ${plexMono.variable} font-sans bg-dark text-ink min-h-screen`}
      >
        <PromoBar />
        {children}
      </body>
    </html>
  )
}
