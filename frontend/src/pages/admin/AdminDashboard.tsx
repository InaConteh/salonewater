import { Alert, Card } from '@/components/ui'
import { SAMPLE_SOURCES } from '@/data/sampleSources'
import { STATUS_LABELS } from '@/lib/status'

export function AdminDashboard() {
  const counts = SAMPLE_SOURCES.reduce(
    (acc, s) => {
      acc[s.status] += 1
      return acc
    },
    { green: 0, yellow: 0, red: 0 },
  )

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
      <p className="mt-1 text-neutral">Phase 4 shell — full features in Phase 5.</p>

      <div className="mt-6 grid-dashboard">
        <Card title="Safe sources">
          <p className="text-3xl font-bold text-success">{counts.green}</p>
          <p className="text-sm text-neutral">{STATUS_LABELS.green}</p>
        </Card>
        <Card title="Caution">
          <p className="text-3xl font-bold text-warning">{counts.yellow}</p>
          <p className="text-sm text-neutral">{STATUS_LABELS.yellow}</p>
        </Card>
        <Card title="Unsafe / down">
          <p className="text-3xl font-bold text-danger">{counts.red}</p>
          <p className="text-sm text-neutral">{STATUS_LABELS.red}</p>
        </Card>
      </div>

      <Alert variant="info" title="Coming in Phase 5" className="mt-6 max-w-2xl">
        Live map, API integration, authentication, and dispatch workflows will connect here.
      </Alert>
    </div>
  )
}
