'use client'

import { useEffect, useState } from 'react'
import { fetchSiteSettings, updateSiteSettings } from '@/lib/settings'
import { LinkEntry, SiteSettings } from '@/types/settings'
import { Plus, Trash2, Edit2, ExternalLink, Store, UserCheck, Loader2 } from 'lucide-react'

type ListKey = 'yupoo_sellers' | 'trusted_agents'

interface AdminTrustedLinksProps {
  onToast: (message: string, type: 'success' | 'error') => void
}

const EMPTY_ENTRY_FORM = { name: '', url: '', note: '' }

const inputClass =
  'w-full px-4 py-3 bg-paper border border-rule rounded-lg text-ink placeholder-dust focus:outline-none focus:border-accent transition-colors'

function LinkSection({
  title,
  icon,
  entries,
  saving,
  onAdd,
  onUpdate,
  onDelete,
}: {
  title: string
  icon: React.ReactNode
  entries: LinkEntry[]
  saving: boolean
  onAdd: (entry: Omit<LinkEntry, 'id'>) => void
  onUpdate: (id: string, entry: Omit<LinkEntry, 'id'>) => void
  onDelete: (id: string) => void
}) {
  const [form, setForm] = useState(EMPTY_ENTRY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  function startEdit(entry: LinkEntry) {
    setEditingId(entry.id)
    setForm({ name: entry.name, url: entry.url, note: entry.note })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_ENTRY_FORM)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.url.trim()) return

    if (editingId) {
      onUpdate(editingId, form)
    } else {
      onAdd(form)
    }
    setForm(EMPTY_ENTRY_FORM)
    setEditingId(null)
  }

  return (
    <div className="bg-linen rounded-lg border border-rule p-6 space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-serif text-lg text-ink">{title}</h2>
      </div>

      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="text-sm text-dust">None added yet.</p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-paper rounded-lg border border-rule"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-ink truncate">{entry.name}</p>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dust hover:text-accent shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>
              {entry.note && <p className="text-xs text-dust truncate">{entry.note}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => startEdit(entry)}
                className="p-2 hover:bg-accent/10 text-accent rounded-md transition-colors"
              >
                <Edit2 className="w-4 h-4" strokeWidth={1.5} />
              </button>
              {deleteConfirm === entry.id ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onDelete(entry.id); setDeleteConfirm(null) }}
                    className="px-3 py-1 bg-brick text-paper text-xs rounded-md"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1 bg-rule/40 text-ink text-xs rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(entry.id)}
                  className="p-2 hover:bg-brick/10 text-brick rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-rule">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            required
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
          <input
            required
            type="url"
            placeholder="https://..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Note (optional) — e.g. Best for shoes, Top Pick"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className={inputClass}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-paper rounded-lg text-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Save changes' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-rule/30 hover:bg-rule/50 text-ink rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default function AdminTrustedLinks({ onToast }: AdminTrustedLinksProps) {
  const [settings, setSettings] = useState<SiteSettings>({ yupoo_sellers: [], trusted_agents: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      setSettings(data)
      setLoading(false)
    })
  }, [])

  async function save(key: ListKey, entries: LinkEntry[]) {
    setSaving(true)
    const next = { ...settings, [key]: entries }
    try {
      await updateSiteSettings({ [key]: entries })
      setSettings(next)
      onToast('Saved', 'success')
    } catch (error) {
      console.error('Error saving trusted links:', error)
      onToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  function addEntry(key: ListKey, entry: Omit<LinkEntry, 'id'>) {
    save(key, [...settings[key], { ...entry, id: crypto.randomUUID() }])
  }

  function updateEntry(key: ListKey, id: string, entry: Omit<LinkEntry, 'id'>) {
    save(key, settings[key].map((e) => (e.id === id ? { ...entry, id } : e)))
  }

  function deleteEntry(key: ListKey, id: string) {
    save(key, settings[key].filter((e) => e.id !== id))
  }

  if (loading) {
    return <p className="text-dust text-sm">Loading trusted links...</p>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LinkSection
        title="Trusted Yupoo sellers"
        icon={<Store className="w-5 h-5 text-accent" strokeWidth={1.5} />}
        entries={settings.yupoo_sellers}
        saving={saving}
        onAdd={(entry) => addEntry('yupoo_sellers', entry)}
        onUpdate={(id, entry) => updateEntry('yupoo_sellers', id, entry)}
        onDelete={(id) => deleteEntry('yupoo_sellers', id)}
      />
      <LinkSection
        title="Trusted agents"
        icon={<UserCheck className="w-5 h-5 text-accent" strokeWidth={1.5} />}
        entries={settings.trusted_agents}
        saving={saving}
        onAdd={(entry) => addEntry('trusted_agents', entry)}
        onUpdate={(id, entry) => updateEntry('trusted_agents', id, entry)}
        onDelete={(id) => deleteEntry('trusted_agents', id)}
      />
    </div>
  )
}
