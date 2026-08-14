import type { Metadata } from 'next'
import { getProductById } from '@/lib/queries'
import ProductDetail from '@/components/ProductDetail'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id)

  if (!product) {
    return { title: 'Product not found | OddySheets' }
  }

  const description =
    product.description || `${product.name} — $${product.price.toFixed(2)} — curated by OddySheets`

  return {
    title: `${product.name} | OddySheets`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : undefined,
    },
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail id={params.id} />
}
