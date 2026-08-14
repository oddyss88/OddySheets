'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, ProductStatus } from '@/types/product'
import { CATEGORIES } from '@/lib/constants'
import { parseProductsCSV } from '@/lib/csv'
import { SheetRow } from '@/lib/sheet-import'
import ProductCard from '@/components/ProductCard'
import ProductStatusBadge from '@/components/ProductStatusBadge'
import Toast from '@/components/Toast'
import AdminTrustedLinks from '@/components/AdminTrustedLinks'
import {
  ArrowLeft, Plus, Trash2, Edit2, LogOut, ImageIcon,
  Link as LinkIcon, DollarSign, Tag, FileText, AlertCircle, Eye, Upload,
  FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2, Package, ListChecks,
} from 'lucide-react'
import Link from 'next/link'

interface ImportRow extends SheetRow {
  include: boolean
  imageFetching: boolean
}

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'new', label: 'NEW' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'pre-order', label: 'Pre-Order' },
  { value: 'sold-out', label: 'Sold Out' },
]

interface FormData {
  name: string
  price: string
  category: string
  image_url: string
  affiliate_link: string
  status: ProductStatus
  description: string
}

const EMPTY_FORM: FormData = {
  name: '',
  price: '',
  category: 'Hoodies',
  image_url: '',
  affiliate_link: '',
  status: 'new',
  description: '',
}

interface ToastState {
  message: string
  type: 'success' | 'error'
}

const inputClass =
  'w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-accent transition-colors'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'links'>('products')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSubmitting, setLoginSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [csvImporting, setCsvImporting] = useState(false)
  const [showSheetImport, setShowSheetImport] = useState(false)
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetFetching, setSheetFetching] = useState(false)
  const [sheetImporting, setSheetImporting] = useState(false)
  const [sheetRows, setSheetRows] = useState<ImportRow[]>([])
  const [sheetErrors, setSheetErrors] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      if (session) fetchProducts()
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      if (session) fetchProducts()
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const previewProduct = useMemo((): Product | null => {
    if (!formData.name && !formData.price) return null
    return {
      id: editingProduct?.id || 'preview',
      name: formData.name || 'Product Name',
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image_url: formData.image_url,
      affiliate_link: formData.affiliate_link || '#',
      status: formData.status,
      description: formData.description,
      created_at: editingProduct?.created_at || new Date().toISOString(),
    }
  }, [formData, editingProduct])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoginSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoginSubmitting(false)
    if (error) {
      setLoginError('Wrong email or password')
    } else {
      setPassword('')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setEmail('')
    setPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url,
      affiliate_link: formData.affiliate_link,
      status: formData.status,
      description: formData.description,
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
        setToast({ message: 'Product updated successfully', type: 'success' })
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        if (error) throw error
        setToast({ message: 'Product added successfully', type: 'success' })
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      setToast({ message: 'Failed to save product', type: 'error' })
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setDeleteConfirm(null)
      setToast({ message: 'Product deleted', type: 'success' })
      fetchProducts()
    } catch (error) {
      console.error('Error deleting:', error)
      setToast({ message: 'Failed to delete product', type: 'error' })
    }
  }

  async function handleCsvImport() {
    const { rows, errors } = parseProductsCSV(csvText)

    if (rows.length === 0) {
      setToast({ message: errors[0] || 'No valid rows found in CSV', type: 'error' })
      return
    }

    setCsvImporting(true)
    try {
      const { error } = await supabase.from('products').insert(rows)
      if (error) throw error

      setToast({
        message: `Imported ${rows.length} product${rows.length === 1 ? '' : 's'}${
          errors.length ? ` (${errors.length} row${errors.length === 1 ? '' : 's'} skipped)` : ''
        }`,
        type: 'success',
      })
      setCsvText('')
      setShowCsvImport(false)
      fetchProducts()
    } catch (error) {
      console.error('Error importing CSV:', error)
      setToast({ message: 'Failed to import CSV', type: 'error' })
    } finally {
      setCsvImporting(false)
    }
  }

  async function authHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return session ? { Authorization: `Bearer ${session.access_token}` } : {}
  }

  async function fetchRowImage(index: number, url: string) {
    setSheetRows(prev => prev.map((r, i) => (i === index ? { ...r, imageFetching: true } : r)))
    try {
      const res = await fetch('/api/fetch-product-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setSheetRows(prev =>
        prev.map((r, i) =>
          i === index ? { ...r, image_url: data.image_url || '', imageFetching: false } : r
        )
      )
    } catch {
      setSheetRows(prev => prev.map((r, i) => (i === index ? { ...r, imageFetching: false } : r)))
    }
  }

  async function fetchImagesForRows(rows: ImportRow[]) {
    const needsImage = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => !row.image_url && row.scrapeUrl)

    const CONCURRENCY = 3
    for (let i = 0; i < needsImage.length; i += CONCURRENCY) {
      const batch = needsImage.slice(i, i + CONCURRENCY)
      await Promise.all(batch.map(({ row, index }) => fetchRowImage(index, row.scrapeUrl!)))
    }
  }

  async function handleFetchSheet() {
    setSheetFetching(true)
    setSheetRows([])
    setSheetErrors([])
    try {
      const res = await fetch('/api/import-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
        body: JSON.stringify({ sheetUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        setToast({ message: data.error || 'Failed to read sheet', type: 'error' })
        return
      }

      const rows: ImportRow[] = (data.rows as SheetRow[]).map(r => ({
        ...r,
        include: true,
        imageFetching: false,
      }))
      setSheetRows(rows)
      setSheetErrors(data.errors || [])
      fetchImagesForRows(rows)
    } catch (error) {
      console.error('Error fetching sheet:', error)
      setToast({ message: 'Failed to reach the import service', type: 'error' })
    } finally {
      setSheetFetching(false)
    }
  }

  function toggleRowInclude(index: number) {
    setSheetRows(prev => prev.map((r, i) => (i === index ? { ...r, include: !r.include } : r)))
  }

  async function handleImportSheetRows() {
    const selected = sheetRows.filter(r => r.include)
    if (selected.length === 0) {
      setToast({ message: 'No rows selected', type: 'error' })
      return
    }

    setSheetImporting(true)
    try {
      const { error } = await supabase.from('products').insert(
        selected.map(r => ({
          name: r.name,
          price: r.price,
          category: r.category,
          image_url: r.image_url,
          affiliate_link: r.affiliateLink,
          status: r.status,
          description: r.description,
        }))
      )
      if (error) throw error

      setToast({
        message: `Imported ${selected.length} product${selected.length === 1 ? '' : 's'}`,
        type: 'success',
      })
      setSheetRows([])
      setSheetUrl('')
      setShowSheetImport(false)
      fetchProducts()
    } catch (error) {
      console.error('Error importing sheet rows:', error)
      setToast({ message: 'Failed to import products', type: 'error' })
    } finally {
      setSheetImporting(false)
    }
  }

  function resetForm() {
    setFormData(EMPTY_FORM)
    setShowAddForm(false)
    setEditingProduct(null)
  }

  function startEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      affiliate_link: product.affiliate_link,
      status: product.status,
      description: product.description,
    })
    setShowAddForm(true)
  }

  function updateFormField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl border border-white/10 p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold">OddySheets Admin</h1>
            <p className="text-gray-400 mt-2">Enter your admin password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              autoComplete="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-xl font-medium transition-colors"
            >
              {loginSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-display text-xl font-bold">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-accent text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'links'
                ? 'border-accent text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <ListChecks className="w-4 h-4" />
            Trusted Links
          </button>
        </div>

        {activeTab === 'links' && (
          <AdminTrustedLinks onToast={(message, type) => setToast({ message, type })} />
        )}

        {activeTab === 'products' && (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="font-display text-3xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="font-display text-3xl font-bold mt-1">
              {new Set(products.map(p => p.category)).size}
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">NEW Items</p>
            <p className="font-display text-3xl font-bold mt-1 text-green-400">
              {products.filter(p => p.status === 'new').length}
            </p>
          </div>
        </div>

        {!showAddForm && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
            <button
              onClick={() => setShowCsvImport(v => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
            >
              <Upload className="w-5 h-5" />
              Bulk Import (CSV)
            </button>
            <button
              onClick={() => setShowSheetImport(v => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Import from Sheet
            </button>
          </div>
        )}

        {showCsvImport && !showAddForm && (
          <div className="bg-card rounded-xl border border-white/10 p-6 mb-8 animate-fade-in space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold mb-1">Bulk Import (CSV)</h2>
              <p className="text-sm text-gray-500">
                First row must be a header with column names. Required: <code className="text-gray-400">name, price, category, affiliate_link</code>.
                Optional: <code className="text-gray-400">image_url, status, description</code>. One row per line.
              </p>
            </div>
            <textarea
              rows={8}
              placeholder={'name,price,category,affiliate_link,image_url,status,description\nGucci Hoodie,65.00,Hoodies,https://superbuy.com/...,https://...jpg,new,Runs true to size'}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className={`${inputClass} font-mono text-xs resize-none`}
            />
            <div className="flex gap-3">
              <button
                onClick={handleCsvImport}
                disabled={csvImporting || !csvText.trim()}
                className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-xl font-medium transition-colors"
              >
                {csvImporting ? 'Importing...' : 'Import'}
              </button>
              <button
                onClick={() => { setShowCsvImport(false); setCsvText('') }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showSheetImport && !showAddForm && (
          <div className="bg-card rounded-xl border border-white/10 p-6 mb-8 animate-fade-in space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold mb-1">Import from Google Sheet</h2>
              <p className="text-sm text-gray-500">
                Sheet must be shared as &quot;Anyone with the link can view.&quot; Required columns:{' '}
                <code className="text-gray-400">name, price, category, link</code>. Optional:{' '}
                <code className="text-gray-400">image_url, status, description</code>.{' '}
                <code className="text-gray-400">link</code> can be a Superbuy or Weidian product link —
                it&apos;s converted to your affiliate link automatically when possible. Missing images
                are fetched from the product page automatically.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={handleFetchSheet}
                disabled={sheetFetching || !sheetUrl.trim()}
                className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-xl font-medium transition-colors whitespace-nowrap"
              >
                {sheetFetching ? 'Fetching...' : 'Fetch Preview'}
              </button>
            </div>

            {sheetErrors.length > 0 && (
              <div className="text-xs text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 space-y-1">
                {sheetErrors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}

            {sheetRows.length > 0 && (
              <div className="space-y-4">
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-card">
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3"></th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Image</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Price</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Category</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Affiliate Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sheetRows.map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={row.include}
                                onChange={() => toggleRowInclude(i)}
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-4 py-3">
                              {row.imageFetching ? (
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                                </div>
                              ) : row.image_url ? (
                                <img src={row.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-gray-600" />
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm max-w-[200px] truncate">{row.name}</td>
                            <td className="px-4 py-3 text-sm">${row.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-400">{row.category}</td>
                            <td className="px-4 py-3">
                              {row.linkConverted ? (
                                <span className="flex items-center gap-1.5 text-xs text-green-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Affiliate link
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Check link
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleImportSheetRows}
                    disabled={sheetImporting || sheetRows.every(r => !r.include)}
                    className="px-6 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 rounded-xl font-medium transition-colors"
                  >
                    {sheetImporting
                      ? 'Importing...'
                      : `Import ${sheetRows.filter(r => r.include).length} Selected`}
                  </button>
                  <button
                    onClick={() => { setShowSheetImport(false); setSheetRows([]); setSheetUrl('') }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showAddForm && (
          <div className="bg-card rounded-xl border border-white/10 p-6 mb-8 animate-fade-in">
            <h2 className="font-display text-xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Product Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Gucci Chateau Marmont Hoodie"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Price (USD)
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="65.00"
                      value={formData.price}
                      onChange={(e) => updateFormField('price', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormField('category', e.target.value)}
                      className={inputClass}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormField('status', e.target.value as ProductStatus)}
                      className={inputClass}
                    >
                      {STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => updateFormField('image_url', e.target.value)}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500">
                      Upload to Imgur, Postimages, or Cloudinary and paste the direct link
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Superbuy Affiliate Link
                    </label>
                    <input
                      required
                      type="url"
                      placeholder="https://www.superbuy.com/..."
                      value={formData.affiliate_link}
                      onChange={(e) => updateFormField('affiliate_link', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Description (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Shipping info, sizing notes, etc."
                      value={formData.description}
                      onChange={(e) => updateFormField('description', e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent hover:bg-accent/90 rounded-xl font-medium transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div>
                <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                  <Eye className="w-4 h-4" />
                  Live Preview
                </div>
                {previewProduct ? (
                  <div className="max-w-sm">
                    <ProductCard product={previewProduct} showBuyButton={false} />
                  </div>
                ) : (
                  <div className="max-w-sm bg-card rounded-xl border border-dashed border-white/10 p-8 text-center text-gray-600">
                    <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Start typing to see a preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No products yet. Click &quot;Add Product&quot; to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium max-w-xs truncate">{product.name}</td>
                      <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/10 rounded text-xs">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <ProductStatusBadge status={product.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 hover:bg-accent/20 text-accent rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 bg-white/10 text-xs rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
