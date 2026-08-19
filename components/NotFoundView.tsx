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
    <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
      <Tag className="w-10 h-10 text-rule mx-auto mb-4" strokeWidth={1.25} />
      <h1 className="font-serif text-2xl text-ink mb-2">{title}</h1>
      <p className="text-dust mb-6">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-paper rounded-lg transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
        Back to catalog
      </Link>
    </div>
  )
}
