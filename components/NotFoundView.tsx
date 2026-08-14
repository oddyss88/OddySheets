import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'

interface NotFoundViewProps {
  title?: string
  message?: string
}

export default function NotFoundView({
  title = 'Page not found',
  message = "This page doesn't exist or may have been removed.",
}: NotFoundViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center animate-fade-in">
      <Tag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500 mb-6">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 rounded-xl font-medium transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to catalog
      </Link>
    </div>
  )
}
