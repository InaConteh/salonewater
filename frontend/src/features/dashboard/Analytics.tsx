import { useEffect, useState } from 'react'
import { Download, TrendingUp, BarChart3, PieChart } from 'lucide-react'
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

  const maxMaintType = trends?.maintenance_stats
    ? Math.max(...Object.values(trends.maintenance_stats.by_type), 1)
    : 1

  const maxDistrict = kpis?.district_distribution
    ? Math.max(...Object.values(kpis.district_distribution), 1)
    : 1

  const exportJson = () => {
    if (!trends) return
    const blob = new Blob([JSON.stringify(trends, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
<<<<<<< HEAD
    a.download = `cleanflow-trends-${days}d.json`
=======
    a.download = `salonewaterwatch-trends-${days}d.json`
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCsv = () => {
    const url = apiClient.getTrendsCsvUrl(parseInt(days, 10) || 30)
    const a = document.createElement('a')
    a.href = url
<<<<<<< HEAD
    a.download = `cleanflow-trends-${days}d.csv`
=======
    a.download = `salonewaterwatch-trends-${days}d.csv`
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
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
        <ErrorState message={error} onRetry={load} />
      </div>
    )
  }

  return (
    <div className="page-container space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Data & Analytics</h1>
          <p className="text-neutral">Water security trends and statistics</p>
        </div>
        <div className="flex gap-2 items-end">
          <Input
            label="Period (days)"
            name="days"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-32"
          />
          <Button onClick={load}>Apply</Button>
        </div>
      </div>

      {/* KPIs */}
      <KpiCards kpis={kpis} />

      {/* Main Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* District Distribution */}
        <Card className="space-y-4 border-none shadow-soft-xl bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="font-black text-lg text-slate-900">District Distribution</h3>
          </div>
          {kpis && Object.keys(kpis.district_distribution).length > 0 ? (
            <ul className="space-y-4 pt-2">
              {Object.entries(kpis.district_distribution)
                .sort(([, a], [, b]) => b - a)
                .map(([district, count]) => (
                  <li key={district}>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-700">{district}</span>
                      <span className="text-xs font-black text-primary">
                        {count} sources
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${(count / maxDistrict) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-400 text-center py-12 font-medium italic">No district data available.</p>
          )}
        </Card>

        {/* Reports by Cause */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Reports by Cause</h3>
          </div>
          {trends && Object.keys(trends.by_cause).length > 0 ? (
            <ul className="space-y-3">
              {Object.entries(trends.by_cause)
                .sort(([, a], [, b]) => b - a)
                .map(([cause, count]) => (
                  <li key={cause}>
                    <div className="mb-2 flex justify-between items-center">
                      <span className="font-medium text-sm">{cause.replace(/_/g, ' ')}</span>
                      <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {count}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-bgLight overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
                        style={{ width: `${(count / maxCause) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral text-center py-8">No data available.</p>
          )}
        </Card>

        {/* Status Distribution */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Water Sources by Status</h3>
          </div>
          {kpis && (
            <ul className="space-y-3">
              {[
                { label: 'Safe', count: kpis.status_green, color: 'bg-safe-green', icon: '🟢' },
                { label: 'Caution', count: kpis.status_yellow, color: 'bg-caution-yellow', icon: '🟡' },
                { label: 'Unsafe', count: kpis.status_red, color: 'bg-danger', icon: '🔴' },
              ].map((row) => (
                <li key={row.label}>
                  <div className="mb-2 flex justify-between items-center">
                    <span className="font-medium text-sm">
                      {row.icon} {row.label}
                    </span>
                    <span className="text-sm font-semibold">
                      {row.count} / {kpis.total_sources} ({
                        kpis.total_sources ? ((row.count / kpis.total_sources) * 100).toFixed(1) : 0
                      }%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-bgLight overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${row.color} transition-all`}
                      style={{
                        width: `${
                          kpis.total_sources ? (row.count / kpis.total_sources) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Maintenance stats */}
        <Card className="space-y-4 border-none shadow-soft-xl bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-black text-lg text-slate-900">Maintenance Activity (Period)</h3>
          </div>
          {trends?.maintenance_stats && trends.maintenance_stats.total > 0 ? (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Completed</p>
                    <p className="text-2xl font-black text-emerald-700">{trends.maintenance_stats.by_status['completed'] || 0}</p>
                 </div>
                 <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[10px] uppercase font-black text-amber-600 tracking-wider">Scheduled</p>
                    <p className="text-2xl font-black text-amber-700">{trends.maintenance_stats.by_status['scheduled'] || 0}</p>
                 </div>
              </div>

              <ul className="space-y-4">
                {Object.entries(trends.maintenance_stats.by_type)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => (
                    <li key={type}>
                      <div className="mb-2 flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-700">{type}</span>
                        <span className="text-xs font-black text-emerald-600">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(count / maxMaintType) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-12 font-medium italic">No maintenance activity recorded in this period.</p>
          )}
        </Card>
      </div>

      {/* High-Risk Sources */}
      {trends?.risk_sources && trends.risk_sources.length > 0 && (
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b">
            <TrendingUp className="h-5 w-5 text-danger" />
            <h3 className="font-bold text-lg">High-Risk Water Sources (Last {days} days)</h3>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {trends.risk_sources.slice(0, 10).map((source) => (
              <div
                key={source.source_id}
                className="flex items-center justify-between border border-outline rounded-lg p-3 hover:bg-bgLight transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-primary">{source.source_name}</p>
                  <p className="text-xs text-neutral">{source.report_count_30d} reports in 30 days</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded-lg text-sm font-bold bg-danger/10 text-danger">
                    {source.risk_level === 'high' ? '🔴 High' : '🟡 Medium'}
                  </div>
                  {source.suggested_action && (
                    <p className="text-xs text-neutral mt-1">{source.suggested_action}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Section */}
      <Card className="space-y-4">
        <h3 className="font-bold text-lg">Export Data</h3>
        <p className="text-sm text-neutral">
          Download trends and statistics for external analysis or reporting.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportCsv}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={exportJson}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </Card>
    </div>
  )
}
