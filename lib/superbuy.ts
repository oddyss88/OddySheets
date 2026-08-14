const DEFAULT_PARTNER_CODE = 'wtUaaD'

interface ParsedItem {
  platform: string
  id: string
}

// Only platforms we've confirmed the affiliate link format for. Add more
// once confirmed — guessing a wrong platform code produces a link that
// silently earns no commission.
function extractFromMarketplaceUrl(url: URL): ParsedItem | null {
  if (url.hostname.includes('weidian.com')) {
    const itemId = url.searchParams.get('itemId')
    if (itemId) return { platform: 'WD', id: itemId }
  }
  return null
}

export function extractPlatformAndId(rawUrl: string): ParsedItem | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }

  if (url.hostname.includes('superbuy.com')) {
    const platform = url.searchParams.get('platform')
    const id = url.searchParams.get('id')
    if (platform && id) return { platform, id }

    const wrappedUrl = url.searchParams.get('url')
    if (wrappedUrl) {
      try {
        return extractFromMarketplaceUrl(new URL(wrappedUrl))
      } catch {
        return null
      }
    }
    return null
  }

  return extractFromMarketplaceUrl(url)
}

export function toAffiliateLink(
  rawUrl: string,
  partnerCode: string = DEFAULT_PARTNER_CODE
): { url: string; converted: boolean } {
  const parsed = extractPlatformAndId(rawUrl)
  if (!parsed) return { url: rawUrl, converted: false }

  const affiliateUrl = `https://www.superbuy.com/en/page/buy/?platform=${parsed.platform}&id=${parsed.id}&partnercode=${partnerCode}`
  return { url: affiliateUrl, converted: true }
}

// The Superbuy buy-page is behind a Cloudflare bot challenge and can't be
// scraped server-side. The original marketplace page (e.g. weidian.com)
// isn't, so image scraping targets that instead.
export function toMarketplaceUrl(rawUrl: string): string | null {
  const parsed = extractPlatformAndId(rawUrl)
  if (!parsed) return null

  if (parsed.platform === 'WD') {
    return `https://weidian.com/item.html?itemId=${parsed.id}`
  }

  return null
}
