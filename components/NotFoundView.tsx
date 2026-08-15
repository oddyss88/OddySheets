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
      <Tag className="w-14 h-14 text-line mx-auto mb-4" strokeWidth={1.5} />
      <h1 className="font-heading uppercase tracking-wide text-2xl text-paper mb-2">{title}</h1>
      <p className="text-muted mb-6">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-paper font-heading uppercase tracking-wide transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to catalog
      </Link>
    </div>
  )
}
