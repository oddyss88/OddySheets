'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, ProductStatus } from '@/types/product'
import { ArrowLeft, Plus, Trash2, Edit2, LogOut, ImageIcon, Link as LinkIcon, DollarSign, Tag, FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'Hoodies', 'Jackets', 'Sweatshirts', 'Shirts', 'T-Shirts',
  'Shorts', 'Jeans', 'Pants', 'Shoes', 'Accessories', 'Cases',
  'Bags', 'Hats', 'Socks', 'Underwear', 'Watches', 'Sunglasses', 'Jewelry'
]

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'new', label: 'NEW' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'pre-order', label: 'Pre-Order' },
  { value: 'sold-out', label: 'Sold Out' }
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
  description: ''
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [])

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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      localStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
      setLoginError('')
      fetchProducts()
    } else {
      setLoginError('Wrong password')
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
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
      description: formData.description
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        if (error) throw error
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Check console.')
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      if (error) throw error
      setDeleteConfirm(null)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting:', error)
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
      description: product.description
    })
    setShowAddForm(true)
  }

  function updateFormField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">OddySheets Admin</h1>
            <p className="text-gray-400 mt-2">Enter your admin password</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
            >
              Login
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
              <h1 className="text-xl font-bold">OddySheets Dashboard</h1>
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">Total Products</p>
            <p className="text-3xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-3xl font-bold mt-1">
              {new Set(products.map(p => p.category)).size}
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <p className="text-gray-400 text-sm">NEW Items</p>
            <p className="text-3xl font-bold mt-1 text-green-400">
              {products.filter(p => p.status === 'new').length}
            </p>
          </div>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors mb-8"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        )}

        {showAddForm && (
          <div className="bg-card rounded-xl border border-white/10 p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Product Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Gucci Chateau Marmont Hoodie"
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
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
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormField('category', e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormField('status', e.target.value as ProductStatus)}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
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
                    placeholder="https://example.com/image.jpg (paste image link here)"
                    value={formData.image_url}
                    onChange={(e) => updateFormField('image_url', e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Tip: Upload images to Imgur, Postimages, or Cloudinary and paste the direct link here
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
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Available to order before stock is ready. Shipping usually starts later. (7-15 days)"
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
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
                          <img src={product.image_url} alt="" className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center">
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.status === 'new' ? 'bg-green-500/20 text-green-400' :
                          product.status === 'in-stock' ? 'bg-blue-500/20 text-blue-400' :
                          product.status === 'pre-order' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {product.status === 'new' ? 'NEW' :
                           product.status === 'in-stock' ? 'In Stock' :
                           product.status === 'pre-order' ? 'Pre-Order' : 'Sold Out'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-colors"
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
      </div>
    </div>
  )
}