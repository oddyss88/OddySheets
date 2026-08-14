import { ProductStatus } from '@/types/product'

export interface ParsedProductRow {
  name: string
  price: number
  category: string
  image_url: string
  affiliate_link: string
  status: ProductStatus
  description: string
}

const REQUIRED_COLUMNS = ['name', 'price', 'category', 'affiliate_link'] as const
const VALID_STATUSES: ProductStatus[] = ['new', 'in-stock', 'pre-order', 'sold-out']

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function parseProductsCSV(csv: string): { rows: ParsedProductRow[]; errors: string[] } {
  const lines = csv.split(/\r?\n/).filter(line => line.trim().length > 0)
  if (lines.length === 0) return { rows: [], errors: ['CSV is empty'] }

  const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const missing = REQUIRED_COLUMNS.filter(col => !header.includes(col))
  if (missing.length > 0) {
    return { rows: [], errors: [`Missing required column(s): ${missing.join(', ')}`] }
  }

  const rows: ParsedProductRow[] = []
  const errors: string[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const record: Record<string, string> = {}
    header.forEach((col, idx) => {
      record[col] = (values[idx] ?? '').trim()
    })

    if (!record.name || !record.affiliate_link) {
      errors.push(`Row ${i + 1}: missing name or affiliate_link — skipped`)
      continue
    }

    const price = parseFloat(record.price)
    if (isNaN(price)) {
      errors.push(`Row ${i + 1}: invalid price "${record.price}" — skipped`)
      continue
    }

    const status = VALID_STATUSES.includes(record.status as ProductStatus)
      ? (record.status as ProductStatus)
      : 'new'

    rows.push({
      name: record.name,
      price,
      category: record.category || 'Hoodies',
      image_url: record.image_url || '',
      affiliate_link: record.affiliate_link,
      status,
      description: record.description || '',
    })
  }

  return { rows, errors }
}
