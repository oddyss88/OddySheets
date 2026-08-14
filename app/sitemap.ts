import { MetadataRoute } from 'next'
import { getAllProductIds } from '@/lib/queries'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oddy-sheets.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProductIds()

  const productEntries: MetadataRoute.Sitemap = products.map(product => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: product.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries,
  ]
}
