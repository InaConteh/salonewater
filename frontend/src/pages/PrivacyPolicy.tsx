import { Card } from '@/components/ui'

export function PrivacyPolicy() {
  return (
    <div className="page-container max-w-3xl space-y-6 py-8 prose prose-neutral">
      <h1 className="text-3xl font-bold text-primary">Privacy policy</h1>
      <Card>
        <h2 className="text-lg font-bold text-primary">Data we collect</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
          <li>Phone numbers when you report issues via SMS or web</li>
          <li>Water source locations and status updates</li>
          <li>Admin login credentials (stored securely on the server)</li>
        </ul>
      </Card>
      <Card>
        <h2 className="text-lg font-bold text-primary">How we use data</h2>
        <p className="mt-2 text-sm text-body">
          Data is used only to operate water security services: status updates, maintenance
          dispatch, and aggregated analytics for partner organizations. We do not sell
          personal data.
        </p>
      </Card>
      <Card>
        <h2 className="text-lg font-bold text-primary">Retention</h2>
        <p className="mt-2 text-sm text-body">
          Reports and maintenance logs are retained for operational and audit purposes.
          Contact your water committee to request correction of inaccurate records.
        </p>
      </Card>
    </div>
  )
}
