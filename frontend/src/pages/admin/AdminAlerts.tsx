import { useEffect, useState } from 'react'
import { apiClient, type Trends } from '@/services/api'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Alert, Card } from '@/components/ui'

export function AdminAlerts() {
  const [trends, setTrends] = useState<Trends | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .getTrends(30)
      .then((res) => setTrends(res.data))
      .catch(() => setError('Failed to load alerts.'))
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

  return (
    <div className="page-container space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Alerts & Warnings</h1>
        <p className="text-neutral">Predictive alerts from the risk analysis engine</p>
      </div>

      {trends?.alerts && trends.alerts.length > 0 ? (
        <div className="space-y-3">
          {trends.alerts.map((a, i) => (
            <Alert
              key={i}
              variant={
                a.type === 'contamination_or_failure'
                  ? 'danger'
                  : a.type === 'drought_risk'
                    ? 'warning'
                    : 'warning'
              }
              title={a.type.replace(/_/g, ' ').toUpperCase()}
            >
              {a.message}
            </Alert>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <p className="text-lg text-neutral mb-2">No active alerts</p>
          <p className="text-sm text-neutral-dark">
            The prediction engine will alert you when water sources show patterns requiring attention.
          </p>
        </Card>
      )}

      {trends?.risk_sources && trends.risk_sources.length > 0 && (
        <Card title="Elevated Risk Sources" className="space-y-3">
          <div className="space-y-2">
            {trends.risk_sources.map((r) => (
              <div key={r.source_id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-semibold text-primary">{r.source_name}</p>
                  <p className="text-xs text-neutral">{r.report_count_30d} report(s) in 30 days</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${r.risk_level === 'high' ? 'text-danger' : 'text-caution-yellow'}`}>
                    {r.risk_level.toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral">{r.suggested_action}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
