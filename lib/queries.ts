import { supabase } from './supabase'
import { Product } from '@/types/product'

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error || !data) return null
  return data
}

export async function getAllProductIds(): Promise<{ id: string; created_at: string }[]> {
  const { data } = await supabase.from('products').select('id, created_at')
  return data || []
}
