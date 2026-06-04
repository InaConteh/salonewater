import { useCallback, useEffect, useState } from 'react'
import { apiClient, type RepairCase } from '@/services/api'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Modal, Select } from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { formatDate } from '@/lib/status'

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

const TEAMS = [
  'Western Response Unit',
  'Northern Field Team',
  'Eastern Maintenance Crew',
  'Southern Rapid Response',
]

export function DispatchCenter() {
  const { showToast } = useToast()
  const [cases, setCases] = useState<RepairCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editCase, setEditCase] = useState<RepairCase | null>(null)
  const [team, setTeam] = useState('')
  const [status, setStatus] = useState('open')
  const [eta, setEta] = useState('')
  const [notes, setNotes] = useState('')

  const load = useCallback(() => {
    apiClient
      .getDispatch()
      .then((res) => setCases(res.data.repair_cases))
      .catch(() => setError('Failed to load repair cases.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openEdit = (c: RepairCase) => {
    setEditCase(c)
    setTeam(c.assigned_team ?? '')
    setStatus(c.status)
    setEta(c.eta ? c.eta.slice(0, 16) : '')
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
      showToast('Case updated', 'success')
      setEditCase(null)
      load()
    } catch {
      showToast('Update failed', 'danger')
    }
  }

  if (loading) return <LoadingState />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  const openCases = cases.filter((c) => c.status !== 'completed')

  return (
    <div className="page-container space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">Dispatch center</h1>
        <p className="text-neutral">{openCases.length} open / in progress</p>
      </header>

      <div className="space-y-3">
        {cases.length === 0 ? (
          <Card>
            <p className="text-neutral">No repair cases yet.</p>
          </Card>
        ) : (
          cases.map((c) => (
            <Card key={c.id} padding="sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-primary">
                    Case {c.id.slice(0, 8)}…
                  </p>
                  <p className="text-sm text-neutral">
                    Team: {c.assigned_team ?? 'Unassigned'}
                  </p>
                  <p className="text-sm text-neutral">
                    ETA: {c.eta ? formatDate(c.eta) : 'Not set'}
                  </p>
                  {c.notes && <p className="mt-1 text-sm">{c.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{c.status.replace('_', ' ')}</Badge>
                  <Button size="sm" onClick={() => openEdit(c)}>
                    Update
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={!!editCase}
        onClose={() => setEditCase(null)}
        title="Update repair case"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditCase(null)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Assigned team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            options={[
              { value: '', label: 'Select team…' },
              ...TEAMS.map((t) => ({ value: t, label: t })),
            ]}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Input
            label="ETA"
            type="datetime-local"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
          />
          <Input
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
