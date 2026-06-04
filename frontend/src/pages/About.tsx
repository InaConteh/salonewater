import { Card } from '@/components/ui'

export function About() {
  return (
    <div className="page-container max-w-3xl space-y-6 py-8">
      <h1 className="text-3xl font-bold">About CleanFlow SL</h1>
      <Card title="Our mission">
        <p className="text-body">
          CleanFlow SL helps rural communities in Sierra Leone know which water sources are
          safe, report problems quickly, and coordinate repairs — via SMS and the web.
        </p>
      </Card>
      <Card title="The problem">
        <p className="text-body">
          Many water points fail within two years of installation. CleanFlow connects
          communities, water committees, and district partners with real-time status and
          data-driven maintenance.
        </p>
      </Card>
      <Card title="Open source">
        <p className="text-body">
          The platform is MIT-licensed so NGOs and government partners can deploy and extend
          it freely.
        </p>
      </Card>
    </div>
  )
}
