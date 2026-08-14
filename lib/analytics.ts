import { supabase } from './supabase'

export function logProductClick(productId: string) {
  supabase
    .from('product_clicks')
    .insert({ product_id: productId })
    .then(({ error }) => {
      if (error) console.error('Failed to log click:', error)
    })
}
