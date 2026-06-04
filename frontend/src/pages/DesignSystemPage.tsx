import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  StatusCard,
} from '@/components/ui'
import { useToast } from '@/contexts/ToastContext'
import { SAMPLE_SOURCES } from '@/data/sampleSources'
import type { WaterSource } from '@/types'

export function DesignSystemPage() {
  const { showToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [district, setDistrict] = useState('')

  const handleReport = (source: WaterSource) => {
    showToast(`Report flow for ${source.name} (Phase 5)`, 'warning', 'Report Issue')
  }

  const handleHistory = (source: WaterSource) => {
    showToast(`History for ${source.name} (Phase 5)`, 'info', 'View History')
  }

  return (
    <div className="page-container space-y-10 py-8">
      <header>
        <h1 className="text-3xl font-bold">Design System</h1>
        <p className="mt-2 max-w-2xl text-neutral-dark">
          Phase 4 component library — CleanFlow SL colors, typography, and accessible UI
          patterns.
        </p>
      </header>

      <section aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className="mb-4 text-2xl font-bold">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="mb-4 text-2xl font-bold">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge status="green" />
          <Badge status="yellow" />
          <Badge status="red" />
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="mb-4 text-2xl font-bold">
          Forms
        </h2>
        <Card className="max-w-xl">
          <div className="space-y-4">
            <Input
              label="Search water source"
              name="search"
              placeholder="e.g. Kambia borehole"
              hint="Use simple place names"
            />
            <Select
              label="District"
              name="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={[
                { value: '', label: 'Select district…' },
                { value: 'kambia', label: 'Kambia' },
                { value: 'bo', label: 'Bo' },
                { value: 'bombali', label: 'Bombali' },
              ]}
            />
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>
        </Card>
      </section>

      <section aria-labelledby="alerts-heading">
        <h2 id="alerts-heading" className="mb-4 text-2xl font-bold">
          Alerts & Toasts
        </h2>
        <div className="space-y-3 max-w-xl">
          <Alert variant="info" title="Info">
            Water committee meeting Thursday at 10am.
          </Alert>
          <Alert variant="success" title="Safe">
            Bo Market handpump tested safe today.
          </Alert>
          <Button variant="outline" onClick={() => showToast('Toast notification example', 'success')}>
            Show toast
          </Button>
        </div>
      </section>

      <section aria-labelledby="status-cards-heading">
        <h2 id="status-cards-heading" className="mb-4 text-2xl font-bold">
          Status Cards
        </h2>
        <div className="grid-dashboard">
          {SAMPLE_SOURCES.map((source) => (
            <StatusCard
              key={source.id}
              source={source}
              onReportIssue={handleReport}
              onViewHistory={handleHistory}
            />
          ))}
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Report water issue"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false)
                showToast('Report submitted (demo)', 'success')
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <p className="text-neutral-dark">
          Select a cause: drought, broken pump, dry well, contamination, overuse, or seasonal.
        </p>
      </Modal>
    </div>
  )
}
