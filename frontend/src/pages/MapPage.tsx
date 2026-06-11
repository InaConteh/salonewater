import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapComponent } from '@/features/map/MapComponent'
import { apiClient } from '@/services/api'
import type { WaterSource } from '@/types'
import { Input, Select } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { ReportModal } from '@/components/common/ReportModal'

export function MapPage() {
  const [searchParams] = useSearchParams()
  const [sources, setSources] = useState<WaterSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [district, setDistrict] = useState('')
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const [reportingSource, setReportingSource] = useState<WaterSource | null>(null)

  useEffect(() => {
    apiClient
      .getSources()
      .then((res) => setSources(res.data.sources))
      .catch(() => setError('Could not load water sources. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  const districts = useMemo(() => {
    const set = new Set(sources.map((s) => s.district).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [sources])

  if (loading) return <LoadingState label="Loading map" />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="page-container space-y-4 py-6">
      <header>
        <h1 className="text-3xl font-bold">Water source map</h1>
        <p className="mt-1 text-neutral">
          Green = safe · Yellow = caution · Red = unsafe or down
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Search"
          name="map-search"
          placeholder="Name, district, or source ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="District"
          name="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          options={[
            { value: '', label: 'All districts' },
            ...districts.map((d) => ({ value: d, label: d })),
          ]}
        />
      </div>

      <MapComponent
        sources={sources}
        districtFilter={district || undefined}
        searchQuery={search}
        onReportIssue={setReportingSource}
      />

      <ReportModal
        open={!!reportingSource}
        source={reportingSource}
        onClose={() => setReportingSource(null)}
        onSuccess={() => {
          // Optionally refresh sources to show updated status
          apiClient.getSources().then((res) => setSources(res.data.sources))
        }}
      />
      <p className="text-sm text-neutral">
        Showing {sources.filter((s) => {
          if (district && s.district?.toLowerCase() !== district.toLowerCase()) return false
          if (search) {
            const q = search.toLowerCase()
            return (
              s.name.toLowerCase().includes(q) ||
              s.id.includes(q) ||
              s.district?.toLowerCase().includes(q)
            )
          }
          return true
        }).length}{' '}
        of {sources.length} sources
      </p>
    </div>
  )
}
