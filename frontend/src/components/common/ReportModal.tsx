import { useState } from 'react'
import { apiClient, CAUSE_OPTIONS } from '@/services/api'
import type { WaterSource } from '@/types'
import { Button, Input, Modal, Select } from '@/components/ui'

interface ReportModalProps {
  source: WaterSource | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ReportModal({ source, open, onClose, onSuccess }: ReportModalProps) {
  const [cause, setCause] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!source) return

    setLoading(true)
    setError(null)

    try {
      await apiClient.createReport({
        source_id: source.id,
        cause_category: cause,
        reporter_phone: phone || undefined,
        notes: notes || undefined,
        auto_dispatch: true,
      })
      onSuccess?.()
      onClose()
      // Reset form
      setCause('')
      setPhone('')
      setNotes('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Report Issue: ${source?.name || 'Water Source'}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="report-form" disabled={loading || !cause}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </>
      }
    >
      <form id="report-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger border border-danger/20">
            {error}
          </div>
        )}

        <Select
          label="What is the problem?"
          name="cause"
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          required
          options={[
            { value: '', label: 'Select a reason...' },
            ...CAUSE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
          ]}
        />

        <Input
          label="Your phone number (optional)"
          name="phone"
          type="tel"
          placeholder="+232..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          hint="We may contact you for more details."
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-primary">Additional notes</label>
          <textarea
            className="w-full rounded-lg border border-neutral-light bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
            placeholder="Describe the issue in more detail..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  )
}
