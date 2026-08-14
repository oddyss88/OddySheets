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

export function parseCSVLine(line: string): string[] {
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

export function parseCSVRows(csv: string): { header: string[]; records: Record<string, string>[] } {
  const lines = csv.split(/\r?\n/).filter(line => line.trim().length > 0)
  if (lines.length === 0) return { header: [], records: [] }

  const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const records = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const record: Record<string, string> = {}
    header.forEach((col, idx) => {
      record[col] = (values[idx] ?? '').trim()
    })
    return record
  })

  return { header, records }
}

export function parseProductsCSV(csv: string): { rows: ParsedProductRow[]; errors: string[] } {
  const { header, records } = parseCSVRows(csv)
  if (header.length === 0) return { rows: [], errors: ['CSV is empty'] }

  const missing = REQUIRED_COLUMNS.filter(col => !header.includes(col))
  if (missing.length > 0) {
    return { rows: [], errors: [`Missing required column(s): ${missing.join(', ')}`] }
  }

  const rows: ParsedProductRow[] = []
  const errors: string[] = []

  records.forEach((record, i) => {
    const rowNum = i + 2

    if (!record.name || !record.affiliate_link) {
      errors.push(`Row ${rowNum}: missing name or affiliate_link — skipped`)
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

    rows.push({
      name: record.name,
      price,
      category: record.category || 'Hoodies',
      image_url: record.image_url || '',
      affiliate_link: record.affiliate_link,
      status,
      description: record.description || '',
    })
  })

  return { rows, errors }
}
