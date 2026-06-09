import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, TrendingDown, TrendingUp, Activity, CheckCircle, Clock } from 'lucide-react'
import { KpiCards } from '@/components/common/KpiCards'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Alert, Badge, Button, Card, Select } from '@/components/ui'
import { apiClient, type Kpis, type Report, type Trends } from '@/services/api'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/status'

export function AdminDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [trends, setTrends] = useState<Trends | null>(null)
  const [district, setDistrict] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const [k, r, t] = await Promise.all([
        apiClient.getKpis(),
        apiClient.getReports(),
        apiClient.getTrends(30),
      ])
      setKpis(k.data)
      setReports(r.data.reports || [])
      setTrends(t.data)
      setError(null)
    } catch {
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading) return <LoadingState />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    )
  }

  const criticalReports = reports.filter((r) => r.status === 'danger').slice(0, 5)
  const warningReports = reports.filter((r) => r.status === 'warning').slice(0, 5)
  const recentReports = reports.slice(0, 10)

  return (
    <div className="page-container space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Command Center</h1>
          <p className="text-neutral">Real-time water security monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            {autoRefresh ? 'Live' : 'Paused'}
          </Button>
          <Button variant="secondary" size="sm" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <KpiCards kpis={kpis} />

      {/* Critical Alerts Section */}
      {criticalReports.length > 0 && (
        <div className="rounded-lg border-l-4 border-danger bg-danger/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-danger">🚨 Critical Issues ({criticalReports.length})</h3>
              <p className="text-sm text-neutral mt-1">
                Immediate attention required for these water sources.
              </p>
              <div className="mt-3 space-y-2">
                {criticalReports.slice(0, 3).map((r) => (
                  <div key={r.id} className="text-sm">
                    <span className="font-medium">{r.source_name || r.source_id}</span>
                    <span className="text-neutral ml-2">• {r.cause_category?.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
              <Link to="/admin/reports" className="mt-3 inline-block text-sm font-semibold text-danger hover:underline">
                View all critical issues →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Report Feed */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">Live Report Feed</h3>
                  <p className="text-xs text-neutral">Latest community reports ({reports.length} total)</p>
                </div>
              </div>
            </div>

            {recentReports.length === 0 ? (
              <p className="text-sm text-neutral py-6">No reports yet.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {recentReports.map((r, idx) => (
                  <div
                    key={r.id}
                    className="flex gap-3 pb-3 border-b last:border-b-0 hover:bg-bgLight p-2 -mx-2 px-2 rounded transition"
                  >
                    {/* Status Indicator */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(r.status)}`}>
                      {r.status === 'danger' ? (
                        <AlertCircle className="h-5 w-5 text-white" />
                      ) : r.status === 'warning' ? (
                        <Clock className="h-5 w-5 text-white" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Report Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-primary truncate">
                            {r.source_name || r.source_id}
                          </p>
                          <p className="text-xs text-neutral">
                            {r.cause_category?.replace(/_/g, ' ')} • {r.district}
                          </p>
                        </div>
                        <Badge variant={r.status as any} className="flex-shrink-0">
                          {getStatusLabel(r.status)}
                        </Badge>
                      </div>
                      {r.message && (
                        <p className="text-xs text-neutral-dark mt-1 italic">"{r.message}"</p>
                      )}
                      <p className="text-xs text-neutral mt-1">{formatDate(r.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/admin/reports"
              className="mt-4 pt-4 border-t inline-block text-sm font-semibold text-primary hover:underline"
            >
              View all {reports.length} reports →
            </Link>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Status Summary */}
          <Card className="space-y-3">
            <h3 className="font-bold">Status Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-danger"></div>
                  Critical
                </span>
                <span className="font-bold text-danger">{criticalReports.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-caution-yellow"></div>
                  Warning
                </span>
                <span className="font-bold text-caution-yellow">
                  {warningReports.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-safe-green"></div>
                  Safe
                </span>
                <span className="font-bold text-safe-green">
                  {reports.filter((r) => r.status === 'safe').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="space-y-2">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <Link to="/admin/reports">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                📋 View All Reports
              </Button>
            </Link>
            <Link to="/admin/dispatch">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                🚗 Dispatch Center
              </Button>
            </Link>
            <Link to="/admin/sources">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                💧 Source Management
              </Button>
            </Link>
            <Link to="/admin/alerts">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                ⚠️ Alerts & Warnings
              </Button>
            </Link>
          </Card>

          {/* Alerts from Prediction Engine */}
          {trends?.alerts && trends.alerts.length > 0 && (
            <Card className="space-y-3">
              <h3 className="font-bold">Prediction Alerts</h3>
              <div className="space-y-2">
                {trends.alerts.slice(0, 3).map((a, i) => (
                  <Alert key={i} variant="warning" className="text-xs">
                    {a.message}
                  </Alert>
                ))}
              </div>
              {trends.alerts.length > 3 && (
                <Link to="/admin/alerts" className="text-xs text-primary hover:underline">
                  View all {trends.alerts.length} alerts →
                </Link>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
