import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Edit, Trash2, Calendar, Clock, CheckCircle, Droplets } from 'lucide-react'
import { apiClient, type MaintenanceLog } from '@/services/api'
import type { WaterSource } from '@/types'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Modal, Select } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate } from '@/lib/status'
import { cn } from '@/lib/utils'

const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const TASK_TYPES = [
  'Routine Inspection',
  'Pump Lubrication',
  'Water Quality Testing',
  'Seal Replacement',
  'Well Cleaning',
  'Structural Repair',
  'Algae Removal',
]

const emptyForm = {
  source_id: '',
  task_type: TASK_TYPES[0],
  scheduled_date: new Date().toISOString().slice(0, 16),
  completion_status: 'scheduled',
  notes: '',
}

export function MaintenanceManagement() {
  const { showToast } = useToast()
  const [logs, setLogs] = useState<MaintenanceLog[]>([])
  const [sources, setSources] = useState<WaterSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MaintenanceLog | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceLog | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [logsRes, sourcesRes] = await Promise.all([
        apiClient.getMaintenanceLogs(),
        apiClient.getSources(),
      ])

      const sourcesMap = new Map(sourcesRes.data.sources.map(s => [s.id, s.name]))
      const enrichedLogs = logsRes.data.maintenance_logs.map(log => ({
        ...log,
        source_name: sourcesMap.get(log.source_id) || 'Unknown Source'
      }))

      setLogs(enrichedLogs)
      setSources(sourcesRes.data.sources)
      setError(null)
    } catch (err) {
      setError('Failed to load maintenance data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.task_type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter ? log.completion_status === statusFilter : true
      return matchesSearch && matchesStatus
    })
  }, [logs, searchTerm, statusFilter])

  const openCreate = () => {
    setEditing(null)
    setForm({
        ...emptyForm,
        source_id: sources[0]?.id || ''
    })
    setModalOpen(true)
  }

  const openEdit = (log: MaintenanceLog) => {
    setEditing(log)
    setForm({
      source_id: log.source_id,
      task_type: log.task_type,
      scheduled_date: new Date(log.scheduled_date).toISOString().slice(0, 16),
      completion_status: log.completion_status,
      notes: log.notes ?? '',
    })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.source_id) {
        showToast('Please select a water source', 'danger')
        return
    }

    const payload = {
      ...form,
      scheduled_date: new Date(form.scheduled_date).toISOString(),
    }

    try {
      if (editing) {
        await apiClient.updateMaintenanceLog(editing.id, payload)
        showToast('Maintenance log updated', 'success')
      } else {
        await apiClient.createMaintenanceLog(payload)
        showToast('Maintenance log created', 'success')
      }
      setModalOpen(false)
      loadData()
    } catch {
      showToast('Save failed', 'danger')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.deleteMaintenanceLog(deleteTarget.id)
      showToast('Log deleted', 'success')
      setDeleteTarget(null)
      loadData()
    } catch {
      showToast('Delete failed', 'danger')
    }
  }

  if (loading && logs.length === 0) return <LoadingState />
  if (error && logs.length === 0) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-3xl shadow-soft-xl border border-slate-100">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Preventative Maintenance</h1>
          <p className="text-slate-500 font-medium mt-1">
             Schedule and track routine upkeep for {sources.length} water assets
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl font-bold h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-soft-xl p-6 bg-white">
        <div className="grid gap-6 md:grid-cols-12 items-end">
           <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by source or task type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
           </div>
           <div className="md:col-span-4">
              <Select
                label="Completion Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[{ value: '', label: 'All Statuses' }, ...MAINTENANCE_STATUS_OPTIONS]}
              />
           </div>
        </div>
      </Card>

      {/* Logs Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {filteredLogs.map((log) => (
            <Card key={log.id} className="border-none shadow-soft-xl bg-white p-6 hover:shadow-soft-2xl transition-all group relative overflow-hidden">
               <div className={cn(
                 "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -translate-y-16 translate-x-16 rounded-full",
                 log.completion_status === 'completed' ? "bg-success" :
                 log.completion_status === 'cancelled' ? "bg-destructive" : "bg-primary"
               )}></div>

               <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                     {log.completion_status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                     ) : (
                        <Calendar className="h-6 w-6 text-primary" />
                     )}
                  </div>
                  <div className="flex gap-1">
                     <Button variant="ghost" size="icon" onClick={() => openEdit(log)} className="h-8 w-8 rounded-lg hover:bg-slate-100">
                        <Edit className="h-4 w-4 text-slate-400" />
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(log)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{log.task_type}</h4>
                    <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> {log.source_name}
                    </p>
                    <Badge
                        variant={log.completion_status === 'completed' ? 'secondary' : log.completion_status === 'cancelled' ? 'destructive' : 'outline'}
                        className="mt-3 text-[10px] uppercase font-black px-2"
                    >
                       {log.completion_status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        Scheduled: {formatDate(log.scheduled_date)}
                     </div>
                  </div>

                  {log.notes && (
                    <div className="pt-4 border-t border-slate-50">
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 min-h-[2.5rem]">
                            {log.notes}
                        </p>
                    </div>
                  )}
               </div>
            </Card>
         ))}

         {filteredLogs.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl shadow-soft-xl border border-dashed border-slate-200">
                <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-bold">No maintenance logs found matching your criteria.</p>
                <Button variant="ghost" onClick={() => {setSearchTerm(''); setStatusFilter('');}} className="mt-4 text-primary">
                    Clear all filters
                </Button>
            </div>
         )}
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Maintenance Task' : 'Schedule New Maintenance'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>
              {editing ? 'Update Task' : 'Schedule Task'}
            </Button>
          </>
        }
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Select
                label="Water Source"
                value={form.source_id}
                onChange={(e) => setForm({ ...form, source_id: e.target.value })}
                options={sources.map(s => ({ value: s.id, label: s.name }))}
                required
            />
          </div>
          <Select
            label="Task Type"
            value={form.task_type}
            onChange={(e) => setForm({ ...form, task_type: e.target.value })}
            options={TASK_TYPES.map(t => ({ value: t, label: t }))}
            required
          />
          <Select
            label="Status"
            value={form.completion_status}
            onChange={(e) => setForm({ ...form, completion_status: e.target.value })}
            options={MAINTENANCE_STATUS_OPTIONS}
          />
          <Input
            label="Scheduled Date & Time"
            type="datetime-local"
            value={form.scheduled_date}
            onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
            required
          />
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
            <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Details about the maintenance task, required parts, or findings..."
                className="w-full p-4 bg-slate-50 border-none rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Cancel Maintenance Task?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Keep Task
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-slate-600">
          Are you sure you want to remove the <strong>{deleteTarget?.task_type}</strong> for <strong>{deleteTarget?.source_name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
