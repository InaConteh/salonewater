import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Activity, CheckCircle, Clock, RefreshCw, Radio, MoreHorizontal, ArrowUpRight, TrendingUp, Info, FileText, Wrench, Droplet, BarChart3 } from 'lucide-react'
import { KpiCards } from '@/components/common/KpiCards'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card } from '@/components/ui'
import { apiClient, type Kpis, type Report, type Trends } from '@/services/api'
import { formatDate, getStatusLabel } from '@/lib/status'
import { cn } from '@/lib/utils'

export function AdminDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [trends, setTrends] = useState<Trends | null>(null)
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
  const recentReports = reports.slice(0, 10)

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between bg-white p-8 rounded-3xl shadow-soft-xl border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Badge variant="info" className="bg-primary/10 text-primary border-none py-1 px-3">
               System Active
             </Badge>
             {autoRefresh && (
               <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider animate-pulse">
                 <Radio className="h-3 w-3" /> Live
               </span>
             )}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Command Center</h1>
          <p className="text-slate-500 font-medium mt-1">Operational overview of Sierra Leone's water network</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "rounded-xl border-2 font-bold h-11 px-5",
              autoRefresh ? "border-primary text-primary" : "border-slate-200 text-slate-500"
            )}
          >
            <Activity className="h-4 w-4 mr-2" />
            {autoRefresh ? 'Stop Auto-sync' : 'Resume Auto-sync'}
          </Button>
          <Button variant="default" size="sm" onClick={fetchDashboardData} className="rounded-xl font-bold h-11 px-5 shadow-lg shadow-primary/20">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <KpiCards kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Critical Alerts Strip */}
          {criticalReports.length > 0 && (
            <div className="group relative overflow-hidden rounded-3xl bg-destructive p-6 text-white shadow-xl shadow-destructive/20 transition-all hover:shadow-2xl hover:shadow-destructive/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Critical Response Needed ({criticalReports.length})</h3>
                    <p className="text-white/80 font-medium text-sm mt-1 mb-4">
                      The following sources have reported major failures or contamination.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {criticalReports.slice(0, 3).map((r) => (
                        <div key={r.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold">
                          {r.source_name || r.source_id} • {r.district}
                        </div>
                      ))}
                      {criticalReports.length > 3 && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold">
                          +{criticalReports.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Link to="/admin/reports?status=danger">
                  <Button variant="secondary" size="sm" className="bg-white text-destructive hover:bg-white/90 rounded-xl font-bold">
                    Resolve Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Live Feed Card */}
          <Card className="border-none shadow-soft-xl bg-white overflow-hidden p-0">
             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Recent Activity Feed</h3>
                  <p className="text-sm text-slate-500 font-medium">Monitoring {reports.length} total community reports</p>
                </div>
                <Link to="/admin/reports">
                   <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 rounded-lg">
                      View Audit Log
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                   </Button>
                </Link>
             </div>

             <div className="divide-y divide-slate-50">
                {recentReports.length === 0 ? (
                  <div className="p-20 text-center">
                     <Activity className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                     <p className="text-slate-500 font-medium">No recent activity detected.</p>
                  </div>
                ) : (
                  recentReports.map((r) => (
                    <div key={r.id} className="p-6 hover:bg-slate-50/50 transition-colors flex gap-4 items-start group">
                       <div className={cn(
                         "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                         r.status === 'danger' ? "bg-destructive/10 text-destructive" :
                         r.status === 'warning' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                       )}>
                          {r.status === 'danger' ? <AlertCircle className="h-6 w-6" /> :
                           r.status === 'warning' ? <Clock className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
                       </div>

                       <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1">
                             <h4 className="font-bold text-slate-900 truncate">
                               {r.source_name || r.source_id}
                               <span className="ml-2 text-xs font-medium text-slate-400">in {r.district}</span>
                             </h4>
                             <Badge
                               variant={r.status as any}
                               className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase"
                             >
                                {getStatusLabel(r.status || '')}
                             </Badge>
                          </div>
                          <p className="text-sm text-slate-600 font-medium mb-2">
                             {r.cause_category?.replace(/_/g, ' ')}
                             {r.message && <span className="text-slate-400 italic font-normal ml-2">— "{r.message}"</span>}
                          </p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                             <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {formatDate(r.timestamp)}
                             </span>
                             <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" /> Source ID: {r.source_id}
                             </span>
                          </div>
                       </div>

                       <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                       </Button>
                    </div>
                  ))
                )}
             </div>

             {reports.length > 10 && (
                <div className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
                   <Link to="/admin/reports" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                      Show {reports.length - 10} More Reports
                   </Link>
                </div>
             )}
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">

           {/* Prediction Alerts */}
           {trends?.alerts && trends.alerts.length > 0 && (
             <Card className="border-none shadow-soft-xl bg-amber-50 overflow-hidden">
                <div className="p-6 bg-amber-100/50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                      <h3 className="font-bold text-amber-900">Predictive Insights</h3>
                   </div>
                   <Badge className="bg-amber-600 text-white border-none">AI Insight</Badge>
                </div>
                <div className="p-6 space-y-4">
                   {trends.alerts.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/60 border border-amber-200/50 text-xs font-medium text-amber-800 leading-relaxed">
                         <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                         {a.message}
                      </div>
                   ))}
                   <Link to="/admin/alerts">
                      <Button variant="outline" className="w-full border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 rounded-xl font-bold">
                         View All Predictions
                      </Button>
                   </Link>
                </div>
             </Card>
           )}

           {/* Quick Actions Grid */}
           <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/reports" className="group">
                 <Card className="p-4 border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-primary group-hover:text-white h-full text-center flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2 text-primary group-hover:text-white" />
                    <span className="text-xs font-bold">Reports</span>
                 </Card>
              </Link>
              <Link to="/admin/dispatch" className="group">
                 <Card className="p-4 border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-emerald-600 group-hover:text-white h-full text-center flex flex-col items-center justify-center">
                    <Wrench className="h-6 w-6 mb-2 text-emerald-600 group-hover:text-white" />
                    <span className="text-xs font-bold">Dispatch</span>
                 </Card>
              </Link>
              <Link to="/admin/sources" className="group">
                 <Card className="p-4 border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-blue-600 group-hover:text-white h-full text-center flex flex-col items-center justify-center">
                    <Droplet className="h-6 w-6 mb-2 text-blue-600 group-hover:text-white" />
                    <span className="text-xs font-bold">Sources</span>
                 </Card>
              </Link>
              <Link to="/admin/analytics" className="group">
                 <Card className="p-4 border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group-hover:bg-purple-600 group-hover:text-white h-full text-center flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2 text-purple-600 group-hover:text-white" />
                    <span className="text-xs font-bold">Analytics</span>
                 </Card>
              </Link>
           </div>

           {/* Status Distribution */}
           <Card className="p-6 border-none shadow-soft-xl bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Status Distribution</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Critical Issues', count: reports.filter(r => r.status === 'danger').length, color: 'bg-destructive', textColor: 'text-destructive' },
                   { label: 'Warning / Maintenance', count: reports.filter(r => r.status === 'warning').length, color: 'bg-warning', textColor: 'text-warning' },
                   { label: 'Operational / Safe', count: reports.filter(r => r.status === 'safe' || r.status === 'green').length, color: 'bg-success', textColor: 'text-success' }
                 ].map((item, i) => (
                   <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                         <span className="text-slate-500 uppercase tracking-wider">{item.label}</span>
                         <span className={item.textColor}>{item.count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div
                           className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                           style={{ width: `${Math.max(5, (item.count / reports.length) * 100)}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
