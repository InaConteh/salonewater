import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookIcon, SunCloudIcon, WaterDropIcon, WrenchIcon } from '@/assets/icons'
import { KpiCards } from '@/components/common/KpiCards'
import { Button, Card, Input } from '@/components/ui'
import { apiClient, type Kpis } from '@/services/api'

export function Home() {
  const navigate = useNavigate()
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [kpiLoading, setKpiLoading] = useState(true)
  const [sourceId, setSourceId] = useState('')

  useEffect(() => {
    apiClient
      .getKpis()
      .then((res) => setKpis(res.data))
      .catch(() => setKpis(null))
      .finally(() => setKpiLoading(false))
  }, [])

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (sourceId.trim()) {
      navigate(`/map?search=${encodeURIComponent(sourceId.trim())}`)
    }
  }

  return (
    <div className="page-container">
      <section className="py-10 text-center sm:py-14">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Clean water security for every community
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-dark">
          Real-time water source status, SMS alerts, and repair dispatch for rural
          Sierra Leone — accessible on any phone.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/map">
            <Button size="lg">View map</Button>
          </Link>
          <Link to="/find-water">
            <Button size="lg" variant="outline">
              Find safe water
            </Button>
          </Link>
          <Link to="/health">
            <Button size="lg" variant="ghost">
              Health library
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-10 max-w-xl mx-auto">
        <form onSubmit={handleStatusSearch}>
          <Input
            label="Quick source lookup"
            name="source-id"
            placeholder="Source name or ID"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            hint="Opens the map filtered to your search"
          />
          <Button type="submit" className="mt-3" disabled={!sourceId.trim()}>
            Search on map
          </Button>
        </form>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-center">National snapshot</h2>
        <KpiCards kpis={kpis} loading={kpiLoading} />
      </section>

      <section className="grid-dashboard pb-16">
        <Card title="Water Quality" subtitle="Green / Yellow / Red status">
          <WaterDropIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <Link to="/map" className="text-sm font-semibold text-primary hover:underline">
            Open map →
          </Link>
        </Card>
        <Card title="Maintenance" subtitle="Repair dispatch">
          <WrenchIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <Link to="/sms-guide" className="text-sm font-semibold text-primary hover:underline">
            SMS commands →
          </Link>
        </Card>
        <Card title="Warnings" subtitle="Drought & contamination">
          <SunCloudIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <Link to="/map" className="text-sm font-semibold text-primary hover:underline">
            View alerts on map →
          </Link>
        </Card>
        <Card title="Education" subtitle="Health tips">
          <BookIcon className="mb-2 h-10 w-10 text-primary" aria-hidden="true" />
          <Link to="/health" className="text-sm font-semibold text-primary hover:underline">
            Browse library →
          </Link>
        </Card>
      </section>
    </div>
  )
}
