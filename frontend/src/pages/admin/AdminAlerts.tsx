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
      <h1 className="text-2xl font-bold text-primary">Alerts & warnings</h1>
      {trends?.alerts?.length ? (
        <ul className="space-y-3">
          {trends.alerts.map((a, i) => (
            <li key={i}>
              <Alert variant="warning" title={a.type.replace(/_/g, ' ')}>
                {a.message}
              </Alert>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <p className="text-neutral">No active alerts from the prediction engine.</p>
        </Card>
      )}
      {trends?.risk_sources && trends.risk_sources.length > 0 && (
        <Card title="Elevated risk sources">
          <ul className="space-y-2 text-sm">
            {trends.risk_sources.map((r) => (
              <li key={r.source_id} className="flex justify-between border-b py-2">
                <span>{r.source_name}</span>
                <span className="font-semibold">{r.suggested_action}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
