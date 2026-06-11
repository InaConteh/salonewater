import { useCallback, useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertCircle, User, MapPin } from 'lucide-react'
import { apiClient, type RepairCase, type Report } from '@/services/api'
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
    <div className="page-container space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dispatch Center</h1>
          <p className="text-neutral">Manage repair workflows and technician assignments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            📊 Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            📋 List
          </Button>
          <Button variant="outline" size="sm" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="space-y-2">
          <p className="text-xs text-neutral uppercase">Reported</p>
          <p className="text-3xl font-bold text-danger">{stats.open}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-xs text-neutral uppercase">Assigned</p>
          <p className="text-3xl font-bold text-caution-yellow">{stats.assigned}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-xs text-neutral uppercase">In Progress</p>
          <p className="text-3xl font-bold text-primary">{stats.inProgress}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-xs text-neutral uppercase">Resolved</p>
          <p className="text-3xl font-bold text-safe-green">{stats.completed}</p>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid gap-4 lg:grid-cols-4 overflow-x-auto pb-4">
          {STATUS_OPTIONS.map((statusOpt) => {
            const Icon = statusOpt.icon
            const casesInStatus = groupedByStatus[statusOpt.value] || []
            return (
              <div key={statusOpt.value} className="min-w-[300px] space-y-3 bg-bgLight rounded-lg p-4">
                <div className="flex items-center gap-2 pb-3 border-b">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{statusOpt.label}</h3>
                  <span className="ml-auto text-xs font-bold bg-primary text-white px-2 py-1 rounded">
                    {casesInStatus.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {casesInStatus.length === 0 ? (
                    <div className="text-center py-8 text-neutral opacity-50">
                      No cases
                    </div>
                  ) : (
                    casesInStatus.map((c) => (
                      <DispatchCard
                        key={c.id}
                        case={c}
                        onEdit={() => {
                          openEdit(c)
                          setSelectedCase(c)
                        }}
                        onView={() => setSelectedCase(c)}
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
                              ? 'danger'
                              : c.status === 'assigned'
                                ? 'warning'
                                : c.status === 'in_progress'
                                  ? 'primary'
                                  : 'safe'
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
                          onClick={() => {
                            openEdit(c)
                            setSelectedCase(c)
                          }}
                        >
                          Edit
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

      {/* Edit Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              Edit Case {selectedCase.id.slice(0, 8)}…
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

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedCase(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={save}>
                Save Changes
              </Button>
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
  onEdit,
  onView,
}: {
  case: CaseWithReport
  onEdit: () => void
  onView: () => void
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow bg-white"
      onClick={onView}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-primary truncate">
              {c.report?.source_name || 'Unknown Source'}
            </p>
            <p className="text-xs text-neutral">{c.report?.district}</p>
          </div>
          <Badge
            variant={
              c.status === 'open'
                ? 'danger'
                : c.status === 'assigned'
                  ? 'warning'
                  : c.status === 'in_progress'
                    ? 'primary'
                    : 'safe'
            }
            className="text-xs"
          >
            {STATUS_OPTIONS.find((o) => o.value === c.status)?.label}
          </Badge>
        </div>

        {c.assigned_team && (
          <p className="text-xs text-neutral-dark flex items-center gap-1">
            <User className="h-3 w-3" />
            {c.assigned_team}
          </p>
        )}

        {c.eta && (
          <p className="text-xs text-neutral-dark flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ETA: {formatDate(c.eta)}
          </p>
        )}

        {c.notes && (
          <p className="text-xs italic text-neutral line-clamp-2">"{c.notes}"</p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          Edit
        </Button>
      </div>
    </Card>
  )
}
