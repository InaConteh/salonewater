import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  apiClient,
  CAUSE_OPTIONS,
  STATUS_OPTIONS,
} from '@/services/api'
import type { WaterSource, WaterStatus } from '@/types'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Modal, Select } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate, STATUS_LABELS } from '@/lib/status'

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
    const payload = {
      name: form.name,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
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
    <div className="page-container space-y-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Water sources</h1>
        <Button onClick={openCreate}>Add source</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          name="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[{ value: '', label: 'All' }, ...STATUS_OPTIONS]}
        />
        <Select
          label="District"
          name="district-filter"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          options={[
            { value: '', label: 'All' },
            ...districts.map((d) => ({ value: d, label: d })),
          ]}
        />
      </div>

      <Card padding="sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-neutral">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">District</th>
                <th className="py-2 pr-4">Last updated</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-neutral-light/80">
                  <td className="py-3 pr-4 font-medium">{s.name}</td>
                  <td className="py-3 pr-4">
                    <Badge status={s.status}>{STATUS_LABELS[s.status]}</Badge>
                  </td>
                  <td className="py-3 pr-4">{s.district ?? '—'}</td>
                  <td className="py-3 pr-4 text-neutral">{formatDate(s.last_updated)}</td>
                  <td className="py-3 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(s)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
            <Button variant="danger" onClick={confirmDelete}>
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
