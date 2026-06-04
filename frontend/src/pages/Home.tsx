import { Link } from 'react-router-dom'
import { BookIcon, SunCloudIcon, WaterDropIcon, WrenchIcon } from '@/assets/icons'
import { Button, Card } from '@/components/ui'

export function Home() {
  return (
    <div className="page-container">
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Clean water security for every community
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-dark">
          Real-time water source status, SMS alerts, and repair dispatch for rural Sierra
          Leone — accessible on any phone.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/design-system">
            <Button size="lg">Explore Design System</Button>
          </Link>
          <Link to="/admin">
            <Button size="lg" variant="outline">
              Admin Portal
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid-dashboard pb-16">
        <Card title="Water Quality" subtitle="Green / Yellow / Red status at a glance">
          <WaterDropIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <p className="text-sm text-neutral">
            Know if your local source is safe before you drink.
          </p>
        </Card>
        <Card title="Maintenance" subtitle="Proactive pump care">
          <WrenchIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <p className="text-sm text-neutral">
            Schedule repairs and track technician dispatch.
          </p>
        </Card>
        <Card title="Warnings" subtitle="Drought & contamination alerts">
          <SunCloudIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <p className="text-sm text-neutral">
            SMS warnings help communities prepare ahead.
          </p>
        </Card>
        <Card title="Education" subtitle="Health tips via SMS & web">
          <BookIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <p className="text-sm text-neutral">
            Simple guidance for safe water handling.
          </p>
        </Card>
      </section>
    </div>
  )
}
