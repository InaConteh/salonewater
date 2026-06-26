import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Search, Edit, Trash2, MapPin, Activity, Droplets } from 'lucide-react'
import {
  apiClient,
  CAUSE_OPTIONS,
  STATUS_OPTIONS,
} from '@/services/api'
import type { WaterSource, WaterStatus } from '@/types'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Modal, Select } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate, getStatusLabel } from '@/lib/status'
import { cn } from '@/lib/utils'

const emptyForm = {
  name: '',
  latitude: '',
  longitude: '',
  district: '',
  status: 'green' as WaterStatus,
  description: '',
  root_cause: '',
}

export function SourceManagement() {
  const { showToast } = useToast()
  const [sources, setSources] = useState<WaterSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<WaterSource | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<WaterSource | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    apiClient
      .getSources()
      .then((res) => setSources(res.data.sources))
      .catch(() => setError('Failed to load sources.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const districts = useMemo(() => {
    const set = new Set(sources.map((s) => s.district).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [sources])

  const filtered = sources.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false
    if (districtFilter && s.district !== districtFilter) return false
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (source: WaterSource) => {
    setEditing(source)
    setForm({
      name: source.name,
      latitude: String(source.latitude),
      longitude: String(source.longitude),
      district: source.district ?? '',
      status: source.status,
      description: source.description ?? '',
      root_cause: source.root_cause ?? '',
    })
    setModalOpen(true)
  }

  const save = async () => {
    const lat = parseFloat(form.latitude)
    const lon = parseFloat(form.longitude)

    if (isNaN(lat) || isNaN(lon)) {
      showToast('Latitude and longitude must be valid numbers', 'danger')
      return
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      showToast('Invalid coordinates range', 'danger')
      return
    }

    const payload = {
      name: form.name,
      latitude: lat,
      longitude: lon,
      district: form.district || undefined,
      status: form.status,
      description: form.description || undefined,
      root_cause: form.root_cause || undefined,
    }
    try {
      if (editing) {
        await apiClient.updateSource(editing.id, payload)
        showToast('Source updated', 'success')
      } else {
        await apiClient.createSource(payload)
        showToast('Source created', 'success')
      }
      setModalOpen(false)
      load()
    } catch {
      showToast('Save failed — check login and fields', 'danger')
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.deleteSource(deleteTarget.id)
      showToast('Source deleted', 'success')
      setDeleteTarget(null)
      load()
    } catch {
      showToast('Delete failed', 'danger')
    }
  }

  if (loading && sources.length === 0) return <LoadingState />
  if (error && sources.length === 0) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-3xl shadow-soft-xl border border-slate-100">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Source Asset Manager</h1>
          <p className="text-slate-500 font-medium mt-1">
             Inventory management for {sources.length} community water assets
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl font-bold h-12 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5 mr-2" />
          Register New Source
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-soft-xl p-6 bg-white">
        <div className="grid gap-6 md:grid-cols-12 items-end">
           <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by asset name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 placeholder:text-slate-400 font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
           </div>
           <div className="md:col-span-3">
              <Select
                label="Asset Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
              />
           </div>
           <div className="md:col-span-3">
              <Select
                label="District Scope"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Districts' },
                  ...districts.map((d) => ({ value: d, label: d })),
                ]}
              />
           </div>
        </div>
      </Card>

      {/* Grid Display */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {filtered.map((s) => (
            <Card key={s.id} className="border-none shadow-soft-xl bg-white p-6 hover:shadow-soft-2xl transition-all group relative overflow-hidden">
               <div className={cn(
                 "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -translate-y-16 translate-x-16 rounded-full",
                 s.status === 'red' ? "bg-destructive" :
                 s.status === 'yellow' ? "bg-warning" : "bg-success"
               )}></div>

               <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Droplets className={cn(
                       "h-6 w-6",
                       s.status === 'red' ? "text-destructive" :
                       s.status === 'yellow' ? "text-warning" : "text-success"
                     )} />
                  </div>
                  <div className="flex gap-1">
                     <Button variant="ghost" size="icon" onClick={() => openEdit(s)} className="h-8 w-8 rounded-lg hover:bg-slate-100">
                        <Edit className="h-4 w-4 text-slate-400" />
                     </Button>
                     <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(s)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{s.name}</h4>
                    <Badge variant={s.status === 'red' ? 'destructive' : s.status === 'yellow' ? 'outline' : 'secondary'} className="mt-2 text-[10px] uppercase font-black px-2">
                       {getStatusLabel(s.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {s.district || 'Unknown District'}
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Activity className="h-3.5 w-3.5" />
                        Updated {formatDate(s.last_updated)}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                     <p className="text-xs text-slate-400 font-medium line-clamp-2 min-h-[2.5rem]">
                        {s.description || 'No additional description provided for this water source asset.'}
                     </p>
                  </div>
               </div>
            </Card>
         ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit source' : 'Add source'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as WaterStatus })
            }
            options={STATUS_OPTIONS}
          />
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            required
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            required
          />
          <Input
            label="District"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
          <Select
            label="Root cause"
            value={form.root_cause}
            onChange={(e) => setForm({ ...form, root_cause: e.target.value })}
            options={[{ value: '', label: 'None' }, ...CAUSE_OPTIONS]}
          />
          <div className="sm:col-span-2">
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete source?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Remove <strong>{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
