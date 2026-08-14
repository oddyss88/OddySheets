export interface LinkEntry {
  id: string
  name: string
  url: string
  note: string
}

export interface SiteSettings {
  yupoo_sellers: LinkEntry[]
  trusted_agents: LinkEntry[]
}
