import { Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center gap-2 text-accent text-sm font-medium mb-4 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Curated fashion finds</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-2xl animate-fade-in">
          Premium drops, hand-picked for you
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-xl animate-fade-in">
          Discover curated streetwear and designer-inspired pieces. Each find links straight to Superbuy — no middleman.
        </p>
      </div>
    </section>
  )
}
