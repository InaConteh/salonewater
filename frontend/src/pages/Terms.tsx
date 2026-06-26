import { Card } from '@/components/ui'

export function Terms() {
  return (
    <div className="page-container max-w-3xl space-y-6 py-8">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <Card title="MIT License">
        <p className="text-sm text-body">
          Salone Water Watch is provided under the MIT License. You may use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the software, subject to
          the license conditions included in the repository.
        </p>
        <p className="mt-3 text-sm text-neutral">
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND.
        </p>
      </Card>
      <Card title="Water safety disclaimer">
        <p className="text-sm text-body">
          Status indicators are based on community reports and inspections. Always follow
          local health guidance. When in doubt, boil or treat water before drinking.
        </p>
      </Card>
    </div>
  )
}
