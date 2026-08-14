import { supabase } from './supabase'
import { SiteSettings } from '@/types/settings'

const EMPTY_SETTINGS: SiteSettings = { yupoo_sellers: [], trusted_agents: [] }

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('yupoo_sellers, trusted_agents')
    .eq('id', 1)
    .single()

  if (error || !data) return EMPTY_SETTINGS

  return {
    yupoo_sellers: data.yupoo_sellers ?? [],
    trusted_agents: data.trusted_agents ?? [],
  }
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) throw error
}
