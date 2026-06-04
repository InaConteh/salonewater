import { useEffect, useState } from 'react'
import { apiClient, type Kpis, type Trends } from '@/services/api'
import { KpiCards } from '@/components/common/KpiCards'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Button, Card, Input } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

export function Analytics() {
  const token = useAuthStore((s) => s.token)
  const [days, setDays] = useState('30')
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [trends, setTrends] = useState<Trends | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    const d = parseInt(days, 10) || 30
    Promise.all([apiClient.getKpis(), apiClient.getTrends(d)])
      .then(([k, t]) => {
        setKpis(k.data)
        setTrends(t.data)
      })
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const maxCause = trends
    ? Math.max(...Object.values(trends.by_cause), 1)
    : 1

  const exportJson = () => {
    if (!trends) return
    const blob = new Blob([JSON.stringify(trends, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleanflow-trends-${days}d.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCsv = () => {
    const url = apiClient.getTrendsCsvUrl(parseInt(days, 10) || 30)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleanflow-trends-${days}d.csv`
    if (token) {
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.blob())
        .then((blob) => {
          a.href = URL.createObjectURL(blob)
          a.click()
        })
    } else {
      a.click()
    }
  }

  if (loading) return <LoadingState />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="page-container space-y-8 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
          <p className="text-neutral">Trends and exports</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            label="Days"
            name="days"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-24"
          />
          <Button className="self-end" onClick={load}>
            Apply
          </Button>
        </div>
      </header>

      <KpiCards kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Reports by cause">
          {trends && Object.keys(trends.by_cause).length > 0 ? (
            <ul className="space-y-3">
              {Object.entries(trends.by_cause).map(([cause, count]) => (
                <li key={cause}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize">{cause.replace(/_/g, ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-light">
                    <div
                      className="h-3 rounded-full bg-primary"
                      style={{ width: `${(count / maxCause) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral">No reports in this period.</p>
          )}
        </Card>

        <Card title="Status distribution">
          {kpis && (
            <ul className="space-y-4">
              {[
                { label: 'Safe', count: kpis.status_green, color: 'bg-success' },
                { label: 'Caution', count: kpis.status_yellow, color: 'bg-warning' },
                { label: 'Unsafe', count: kpis.status_red, color: 'bg-danger' },
              ].map((row) => (
                <li key={row.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{row.label}</span>
                    <span>{row.count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-light">
                    <div
                      className={`h-3 rounded-full ${row.color}`}
                      style={{
                        width: `${
                          kpis.total_sources
                            ? (row.count / kpis.total_sources) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={exportCsv}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={exportJson}>
          Export JSON
        </Button>
      </div>
    </div>
  )
}
