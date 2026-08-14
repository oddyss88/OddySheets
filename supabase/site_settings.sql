-- Single-row settings table backing the site menu's "Trusted Yupoo Sellers"
-- and "Trusted Agents" lists. Run this once in the Supabase SQL editor.

create table if not exists site_settings (
  id smallint primary key default 1,
  yupoo_sellers jsonb not null default '[]',
  trusted_agents jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id) values (1)
  on conflict (id) do nothing;

alter table site_settings enable row level security;

create policy "Public can read site settings"
  on site_settings for select
  to anon, authenticated
  using (true);

create policy "Authenticated can update site settings"
  on site_settings for update
  to authenticated
  using (true)
  with check (true);
