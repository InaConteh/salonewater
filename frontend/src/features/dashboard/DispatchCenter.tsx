import { useCallback, useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertCircle, User, MapPin, RefreshCw } from 'lucide-react'
import { apiClient, type RepairCase, type Report } from '@/services/api'
import { cn } from '@/lib/cn'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Select } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate } from '@/lib/status'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Reported', icon: AlertCircle },
  { value: 'assigned', label: 'Assigned', icon: User },
  { value: 'in_progress', label: 'In Progress', icon: Clock },
  { value: 'completed', label: 'Resolved', icon: CheckCircle },
]

const TEAMS = [
  'Western Response Unit',
  'Northern Field Team',
  'Eastern Maintenance Crew',
  'Southern Rapid Response',
]

interface CaseWithReport extends RepairCase {
  report?: Report
}

export function DispatchCenter() {
  const { showToast } = useToast()
  const [cases, setCases] = useState<CaseWithReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editCase, setEditCase] = useState<CaseWithReport | null>(null)
  const [selectedCase, setSelectedCase] = useState<CaseWithReport | null>(null)
  const [team, setTeam] = useState('')
  const [status, setStatus] = useState('open')
  const [eta, setEta] = useState('')
  const [notes, setNotes] = useState('')
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view')

  const load = useCallback(async () => {
    try {
      const [casesRes, reportsRes] = await Promise.all([
        apiClient.getDispatch(),
        apiClient.getReports(),
      ])
      
      const reportsMap = new Map(reportsRes.data.reports.map((r) => [r.id, r]))
      const enrichedCases = casesRes.data.repair_cases.map((c) => ({
        ...c,
        report: reportsMap.get(c.report_id || ''),
      }))
      
      setCases(enrichedCases)
      setError(null)
    } catch {
      setError('Failed to load dispatch data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openEdit = (c: CaseWithReport) => {
    setEditCase(c)
    setTeam(c.assigned_team ?? '')
    setStatus(c.status)
    setEta(c.eta ? new Date(c.eta).toISOString().slice(0, 16) : '')
    setNotes(c.notes ?? '')
    setSelectedCase(c)
    setModalMode('edit')
  }

  const openView = (c: CaseWithReport) => {
    setSelectedCase(c)
    setModalMode('view')
  }

  const save = async () => {
    if (!editCase) return
    try {
      await apiClient.updateDispatch(editCase.id, {
        assigned_team: team,
        status,
        eta: eta ? new Date(eta).toISOString() : undefined,
        notes,
      })
      showToast('Case updated successfully', 'success')
      setEditCase(null)
      setSelectedCase(null)
      load()
    } catch {
      showToast('Update failed', 'danger', 'Dispatch Update')
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

  // Group cases by status for kanban view
  const groupedByStatus = STATUS_OPTIONS.reduce(
    (acc, opt) => ({
      ...acc,
      [opt.value]: cases.filter((c) => c.status === opt.value),
    }),
    {} as Record<string, CaseWithReport[]>
  )

  const stats = {
    open: groupedByStatus['open']?.length || 0,
    assigned: groupedByStatus['assigned']?.length || 0,
    inProgress: groupedByStatus['in_progress']?.length || 0,
    completed: groupedByStatus['completed']?.length || 0,
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-3xl shadow-soft-xl border border-slate-100">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Dispatch Center</h1>
          <p className="text-slate-500 font-medium mt-1">
             Coordination hub for {cases.length} active maintenance workflows
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  viewMode === 'kanban' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Table
              </button>
           </div>
           <Button variant="outline" size="sm" onClick={load} className="rounded-xl font-bold h-10 border-slate-200">
             <RefreshCw className="h-4 w-4 mr-2" />
             Sync
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Reported', val: stats.open, color: 'text-destructive', bg: 'bg-destructive/5', border: 'border-destructive/10' },
          { label: 'Assigned', val: stats.assigned, color: 'text-warning', bg: 'bg-warning/5', border: 'border-warning/10' },
          { label: 'In Progress', val: stats.inProgress, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
          { label: 'Resolved', val: stats.completed, color: 'text-success', bg: 'bg-success/5', border: 'border-success/10' },
        ].map((s, i) => (
          <Card key={i} className={cn("p-6 border-none shadow-soft-xl relative overflow-hidden group", s.bg)}>
            <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -translate-y-12 translate-x-12 rounded-full", s.color.replace('text', 'bg'))}></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 relative z-10">{s.label}</p>
            <p className={cn("text-4xl font-black relative z-10", s.color)}>{s.val}</p>
          </Card>
        ))}
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid gap-6 lg:grid-cols-4 overflow-x-auto pb-4">
          {STATUS_OPTIONS.map((statusOpt) => {
            const Icon = statusOpt.icon
            const casesInStatus = groupedByStatus[statusOpt.value] || []
            return (
              <div key={statusOpt.value} className="min-w-[320px] space-y-4 bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                       <Icon className="h-4 w-4 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">{statusOpt.label}</h3>
                  </div>
                  <Badge className="bg-slate-200 text-slate-600 border-none font-bold">
                    {casesInStatus.length}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {casesInStatus.length === 0 ? (
                    <div className="text-center py-12 bg-white/40 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Empty</p>
                    </div>
                  ) : (
                    casesInStatus.map((c) => (
                      <DispatchCard
                        key={c.id}
                        case={c}
                        onAssign={() => openEdit(c)}
                        onViewDetails={() => openView(c)}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {cases.length === 0 ? (
            <Card>
              <p className="text-neutral text-center py-8">No repair cases yet.</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-bgLight">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Case ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Source</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Assigned Team</th>
                    <th className="px-4 py-3 text-left font-semibold">ETA</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-bgLight">
                      <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{c.report?.source_name || 'Unknown'}</p>
                          <p className="text-xs text-neutral">{c.report?.district}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            c.status === 'open'
                              ? 'destructive'
                              : c.status === 'assigned'
                                ? 'outline'
                                : c.status === 'in_progress'
                                  ? 'default'
                                  : 'secondary'
                          }
                        >
                          {STATUS_OPTIONS.find((o) => o.value === c.status)?.label || c.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-neutral">{c.assigned_team || '—'}</td>
                      <td className="px-4 py-3 text-xs">
                        {c.eta ? formatDate(c.eta) : '—'}
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openView(c)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openEdit(c)}
                        >
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {modalMode === 'view' ? 'Case Details' : 'Assign & Update Case'} {selectedCase.id.slice(0, 8)}…
            </h2>

            {selectedCase.report && (
              <Card className="bg-bgLight space-y-2">
                <p className="font-semibold text-primary">{selectedCase.report.source_name}</p>
                <p className="text-sm text-neutral">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {selectedCase.report.district}
                </p>
                <p className="text-sm text-neutral">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  {selectedCase.report.cause_category?.replace(/_/g, ' ')}
                </p>
                {selectedCase.report.message && (
                  <p className="text-sm italic text-neutral-dark">"{selectedCase.report.message}"</p>
                )}
              </Card>
            )}

            {modalMode === 'view' ? (
              /* View Mode */
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral uppercase mb-1">Status</p>
                  <Badge
                    variant={
                      selectedCase.status === 'open'
                        ? 'destructive'
                        : selectedCase.status === 'assigned'
                          ? 'outline'
                          : selectedCase.status === 'in_progress'
                            ? 'default'
                            : 'secondary'
                    }
                  >
                    {STATUS_OPTIONS.find((o) => o.value === selectedCase.status)?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral uppercase mb-1">Assigned Team</p>
                  <p className="text-sm font-medium">{selectedCase.assigned_team || 'Unassigned'}</p>
                </div>
                {selectedCase.eta && (
                  <div>
                    <p className="text-xs text-neutral uppercase mb-1">ETA</p>
                    <p className="text-sm font-medium">{formatDate(selectedCase.eta)}</p>
                  </div>
                )}
                {selectedCase.notes && (
                  <div>
                    <p className="text-xs text-neutral uppercase mb-1">Notes</p>
                    <p className="text-sm text-neutral-dark">{selectedCase.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-3">
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={STATUS_OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                />

                <Select
                  label="Assigned Team"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  options={[
                    { value: '', label: 'Unassigned' },
                    ...TEAMS.map((t) => ({ value: t, label: t })),
                  ]}
                />

                <Input
                  label="ETA (Estimated Time of Arrival)"
                  type="datetime-local"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-neutral mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add progress notes, findings, or next steps..."
                    className="p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none h-24"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedCase(null)}>
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {modalMode === 'edit' && (
                <Button variant="default" onClick={save}>
                  Save Changes
                </Button>
              )}
              {modalMode === 'view' && (
                <Button variant="default" onClick={() => openEdit(selectedCase)}>
                  Edit Assignment
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Dispatch Card Component
function DispatchCard({
  case: c,
  onAssign,
  onViewDetails,
}: {
  case: CaseWithReport
  onAssign: () => void
  onViewDetails: () => void
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-soft-2xl transition-all bg-white border-none shadow-soft-xl p-5 group relative overflow-hidden"
      onClick={onViewDetails}
    >
      <div className="space-y-4 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-slate-900 text-sm truncate leading-tight group-hover:text-primary transition-colors">
              {c.report?.source_name || 'Unknown Source'}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{c.report?.district}</p>
          </div>
        </div>

        <div className="space-y-2">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <div className="h-5 w-5 rounded bg-slate-50 flex items-center justify-center">
                 <User className="h-3 w-3 text-slate-400" />
              </div>
              {c.assigned_team || 'Unassigned'}
           </div>

           {c.eta && (
             <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <div className="h-5 w-5 rounded bg-slate-50 flex items-center justify-center">
                   <Clock className="h-3 w-3 text-slate-400" />
                </div>
                ETA: {formatDate(c.eta)}
             </div>
           )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-bold h-9 text-[10px] border-slate-200"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails()
            }}
          >
            Details
          </Button>
          <Button
            variant="default"
            className="flex-1 rounded-xl font-bold h-9 text-[10px]"
            onClick={(e) => {
              e.stopPropagation()
              onAssign()
            }}
          >
            Assign
          </Button>
        </div>
      </div>
    </Card>
  )
}
