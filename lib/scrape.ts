const FETCH_TIMEOUT_MS = 8000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    })
    clearTimeout(timeout)

    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function fetchOgImage(url: string): Promise<string | null> {
  const html = await fetchHtml(url)
  if (!html) return null

  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)

  return match ? match[1] : null
}

// Weidian's page is a client-rendered SPA with no og:image tag, but the
// server-rendered HTML does include a small preview thumbnail under the
// "first-img" class — stripping its downscale query params yields the
// full-resolution product photo.
export async function fetchWeidianImage(itemUrl: string): Promise<string | null> {
  const html = await fetchHtml(itemUrl)
  if (!html) return null

  const match = html.match(/<img class="first-img" src="([^"]+)"/)
  if (!match) return null

  return match[1].split('?')[0]
}

export async function fetchProductImage(marketplaceUrl: string): Promise<string | null> {
  try {
    const { hostname } = new URL(marketplaceUrl)
    if (hostname.includes('weidian.com')) {
      return fetchWeidianImage(marketplaceUrl)
    }
    return fetchOgImage(marketplaceUrl)
  } catch {
    return null
  }
}
