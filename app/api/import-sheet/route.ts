import { NextRequest, NextResponse } from 'next/server'
import { parseSheetCSV } from '@/lib/sheet-import'
import { getAuthenticatedUser } from '@/lib/supabase-server'

function extractSheetId(sheetUrl: string): string | null {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

function extractGid(sheetUrl: string): string | null {
  const match = sheetUrl.match(/[#&?]gid=(\d+)/)
  return match ? match[1] : null
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let sheetUrl: string | undefined

  try {
    const body = await req.json()
    sheetUrl = body.sheetUrl
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!sheetUrl) {
    return NextResponse.json({ error: 'Missing sheet URL' }, { status: 400 })
  }

  const sheetId = extractSheetId(sheetUrl)
  if (!sheetId) {
    return NextResponse.json({ error: "That doesn't look like a Google Sheets link" }, { status: 400 })
  }

  const gid = extractGid(sheetUrl)
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`

  let csvText: string
  try {
    const res = await fetch(csvUrl)
    csvText = await res.text()
    const trimmed = csvText.trim().toLowerCase()
    if (!res.ok || trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
      return NextResponse.json(
        { error: 'Couldn\'t read the sheet. Make sure it\'s shared as "Anyone with the link can view."' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch the sheet' }, { status: 500 })
  }

  const { rows, errors } = parseSheetCSV(csvText)
  return NextResponse.json({ rows, errors })
}
