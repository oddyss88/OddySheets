import { NextRequest, NextResponse } from 'next/server'
import { fetchProductImage } from '@/lib/scrape'
import { getAuthenticatedUser } from '@/lib/supabase-server'

const ALLOWED_HOSTS = ['superbuy.com', 'www.superbuy.com', 'weidian.com']

function isAllowedHost(rawUrl: string): boolean {
  try {
    const { hostname } = new URL(rawUrl)
    return ALLOWED_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let url: string | undefined

  try {
    const body = await req.json()
    url = body.url
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  if (!isAllowedHost(url)) {
    return NextResponse.json({ error: 'URL host not allowed' }, { status: 400 })
  }

  const image_url = await fetchProductImage(url)
  return NextResponse.json({ image_url })
}
