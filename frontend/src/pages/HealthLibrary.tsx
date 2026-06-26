import { useEffect, useMemo, useState } from 'react'
import { apiClient, type Tip } from '@/services/api'
import { Card, Input, Select, Button } from '@/components/ui'
import { BookIcon } from '@/assets/icons'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { value: '', label: 'All topics' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'climate', label: 'Climate resilience' },
]

/** Map API tips to categories for filtering (API uses static list). */
function tipCategory(tip: Tip): string {
  const t = tip.title.toLowerCase()
  if (t.includes('hand') || t.includes('safe')) return 'sanitation'
  if (t.includes('source') || t.includes('report')) return 'maintenance'
  return 'climate'
}

export function HealthLibrary() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    apiClient
      .getTips()
      .then((res) => setTips(res.data.tips))
      .catch(() => setError('Could not load health tips.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return tips.filter((tip) => {
      if (category && tipCategory(tip) !== category) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          tip.title.toLowerCase().includes(q) ||
          tip.message.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [tips, category, search])

  return (
    <div className="page-container space-y-8 pt-32 pb-12">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Health <span className="text-primary">Library</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          Access practical, life-saving tips for water safety, sanitation, and community infrastructure maintenance.
        </p>
      </header>

      <Card className="p-6 bg-slate-50/50 border-slate-200">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Search tips"
            name="tip-search"
            placeholder="e.g. boiling water, pump repair..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <Select
            label="Category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
            className="bg-white"
          />
        </div>
      </Card>

      <section className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Need specific advice?</h2>
            <p className="text-slate-600">Ask our AI Assistant for tailored health and maintenance guidance.</p>
          </div>
        </div>
        <Link to="/health-assistant">
          <Button size="lg" className="rounded-2xl px-8 font-bold shadow-lg shadow-primary/20">
            Ask AI Assistant
          </Button>
        </Link>
      </section>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tip) => (
            <Card key={tip.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <BookIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tip.title}</h3>
                  <p className="text-slate-600 line-clamp-3 leading-relaxed">{tip.message}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                     {tipCategory(tip)}
                   </span>
                   <Link to="#" className="text-primary text-sm font-bold hover:underline">Read more</Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && !error && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-medium">No tips found matching your criteria.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setCategory(''); }} className="mt-2 text-primary">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
