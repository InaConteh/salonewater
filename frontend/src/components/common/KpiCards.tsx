import { Card } from '@/components/ui'
import type { Kpis } from '@/services/api'

interface KpiCardsProps {
  kpis: Kpis | null
  loading?: boolean
}

export function KpiCards({ kpis, loading }: KpiCardsProps) {
  if (loading) {
    return (
      <div className="grid-dashboard">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-neutral-light" />
        ))}
      </div>
    )
  }

  if (!kpis) return null

  const items = [
    { label: 'Total sources', value: kpis.total_sources, color: 'text-primary' },
    { label: 'Safe (green)', value: kpis.status_green, color: 'text-success' },
    { label: 'Caution (yellow)', value: kpis.status_yellow, color: 'text-warning' },
    { label: 'Unsafe (red)', value: kpis.status_red, color: 'text-danger' },
    { label: 'Reports (30 days)', value: kpis.reports_last_30_days, color: 'text-body' },
    { label: 'Open repairs', value: kpis.open_repair_cases, color: 'text-primary' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm font-medium text-neutral">{item.label}</p>
          <p className={`mt-1 text-3xl font-bold ${item.color}`}>{item.value}</p>
        </Card>
      ))}
    </div>
  )
}
