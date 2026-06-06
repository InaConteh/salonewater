import { useEffect, useMemo, useState } from 'react'
import { apiClient, type Tip } from '@/services/api'
import { Card, Input, Select } from '@/components/ui'
import { BookIcon } from '@/assets/icons'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'

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
    <div className="page-container space-y-6 py-8">
      <header>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health library</h1>
            <p className="mt-1 text-neutral">
              Practical tips for safe water, sanitation, and maintenance.
            </p>
          </div>
          <a
            href="/health-assistant"
            className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Ask AI for help
          </a>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Search tips"
          name="tip-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORIES}
        />
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <div className="grid-dashboard">
        {filtered.map((tip) => (
          <Card key={tip.id} title={tip.title}>
            <BookIcon className="mb-2 h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm text-body">{tip.message}</p>
            <p className="mt-2 text-xs uppercase text-neutral">
              {tipCategory(tip).replace('_', ' ')}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
