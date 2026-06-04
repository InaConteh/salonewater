import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KpiCards } from '@/components/common/KpiCards'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Alert, Badge, Button, Card, Select } from '@/components/ui'
import { apiClient, type Kpis, type Report, type Trends } from '@/services/api'
import { formatDate } from '@/lib/status'

export function AdminDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [trends, setTrends] = useState<Trends | null>(null)
  const [district, setDistrict] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      apiClient.getKpis(),
      apiClient.getReports(),
      apiClient.getTrends(30),
    ])
      .then(([k, r, t]) => {
        setKpis(k.data)
        setReports(r.data.reports.slice(0, 8))
        setTrends(t.data)
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  const filteredReports = district
    ? reports
    : reports

  return (
    <div className="page-container space-y-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-neutral">Live overview of water security</p>
        </div>
        <Select
          label="Filter district"
          name="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          options={[
            { value: '', label: 'All districts' },
            { value: 'Kambia', label: 'Kambia' },
            { value: 'Bo', label: 'Bo' },
          ]}

        />
      </div>

      <KpiCards kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent reports" subtitle="Latest community issues">
          {filteredReports.length === 0 ? (
            <p className="text-sm text-neutral">No reports yet.</p>
          ) : (
            <ul className="divide-y">
              {filteredReports.map((r) => (
                <li key={r.id} className="flex justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-medium">{r.cause_category.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-neutral">Source {r.source_id.slice(0, 8)}…</p>
                  </div>
                  <span className="text-xs text-neutral">{formatDate(r.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/dispatch" className="mt-3 inline-block text-sm font-semibold text-primary">
            Open dispatch →
          </Link>
        </Card>

        <Card title="Urgent alerts" subtitle="From prediction engine">
          {trends?.alerts?.length ? (
            <ul className="space-y-2">
              {trends.alerts.slice(0, 5).map((a, i) => (
                <li key={i}>
                  <Alert variant="warning">{a.message}</Alert>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral">No active alerts.</p>
          )}
          <Link to="/admin/analytics" className="mt-3 inline-block">
            <Button size="sm" variant="outline">
              View analytics
            </Button>
          </Link>
        </Card>
      </div>

      {trends?.risk_sources && trends.risk_sources.length > 0 && (
        <Card title="High-risk sources">
          <ul className="space-y-2">
            {trends.risk_sources.slice(0, 5).map((r) => (
              <li
                key={r.source_id}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span className="font-medium">{r.source_name}</span>
                <Badge status={r.risk_level === 'high' ? 'red' : 'yellow'}>
                  {r.report_count_30d} reports
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
