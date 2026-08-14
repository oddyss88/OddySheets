export interface PromoBanner {
  id: string
  message: string
  highlight: string
  ctaLabel: string
  url: string
}

// Add more entries here to rotate additional affiliate programs into the bar.
export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'superbuy',
    message: 'Sign up to Superbuy — get',
    highlight: '$86 in coupons',
    ctaLabel: 'Sign Up',
    url: 'https://www.superbuy.com/en/page/login?partnercode=wtUaaD&type=register',
  },
]
