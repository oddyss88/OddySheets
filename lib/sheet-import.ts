import { ProductStatus } from '@/types/product'
import { parseCSVRows } from './csv'
import { toAffiliateLink, toMarketplaceUrl } from './superbuy'

export interface SheetRow {
  name: string
  price: number
  category: string
  description: string
  status: ProductStatus
  sourceLink: string
  affiliateLink: string
  linkConverted: boolean
  scrapeUrl: string | null
  image_url: string
}

const REQUIRED_COLUMNS = ['name', 'price', 'category', 'link']
const VALID_STATUSES: ProductStatus[] = ['new', 'in-stock', 'pre-order', 'sold-out']

export function parseSheetCSV(csv: string): { rows: SheetRow[]; errors: string[] } {
  const { header, records } = parseCSVRows(csv)
  if (header.length === 0) return { rows: [], errors: ['Sheet is empty'] }

  const missing = REQUIRED_COLUMNS.filter(col => !header.includes(col))
  if (missing.length > 0) {
    return { rows: [], errors: [`Missing required column(s): ${missing.join(', ')}`] }
  }

  const rows: SheetRow[] = []
  const errors: string[] = []

  records.forEach((record, i) => {
    const rowNum = i + 2

    if (!record.name || !record.link) {
      errors.push(`Row ${rowNum}: missing name or link — skipped`)
      return
    }

    const price = parseFloat(record.price)
    if (isNaN(price)) {
      errors.push(`Row ${rowNum}: invalid price "${record.price}" — skipped`)
      return
    }

    const status = VALID_STATUSES.includes(record.status as ProductStatus)
      ? (record.status as ProductStatus)
      : 'new'

    const { url: affiliateLink, converted } = toAffiliateLink(record.link)

    rows.push({
      name: record.name,
      price,
      category: record.category || 'Hoodies',
      description: record.description || '',
      status,
      sourceLink: record.link,
      affiliateLink,
      linkConverted: converted,
      scrapeUrl: toMarketplaceUrl(record.link),
      image_url: record.image_url || '',
    })
  })

  return { rows, errors }
}
