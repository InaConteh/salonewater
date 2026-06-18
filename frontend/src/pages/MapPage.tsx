import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapComponent } from '@/features/map/MapComponent'
import { apiClient } from '@/services/api'
import type { WaterSource } from '@/types'
import { Input, Select, Badge, Card } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { ReportModal } from '@/components/common/ReportModal'
import { Search, Map as MapIcon, Filter, Info } from 'lucide-react'

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

  const filteredSourcesCount = useMemo(() => {
     return sources.filter((s) => {
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
      }).length
  }, [sources, district, search])

  if (loading) return <LoadingState label="Loading map" />
  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b pt-24 pb-8 shadow-sm">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                <MapIcon className="h-4 w-4" />
                National Coverage
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Interactive Water Map</h1>
              <div className="flex items-center gap-4 mt-4">
                 <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safe</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Caution</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unsafe</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-2 rounded-xl text-sm font-bold">
                  {filteredSourcesCount} Sources Found
               </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8 space-y-6">
        {/* Controls Overlay */}
        <Card className="p-4 md:p-6 border-none shadow-soft-xl bg-white/80 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    name="map-search"
                    placeholder="Search by name, district, or borehole ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-14 bg-white rounded-2xl shadow-sm border-slate-100 focus:ring-primary/20"
                  />
               </div>
            </div>
            <div className="md:col-span-5 flex gap-4">
               <div className="relative flex-1">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Select
                    name="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    options={[
                      { value: '', label: 'All Districts' },
                      ...districts.map((d) => ({ value: d, label: d })),
                    ]}
                    className="pl-12 h-14 bg-white rounded-2xl shadow-sm border-slate-100"
                  />
               </div>
            </div>
          </div>
        </Card>

        {/* Map Container */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white h-[600px] relative">
          <MapComponent
            sources={sources}
            districtFilter={district || undefined}
            searchQuery={search}
            onReportIssue={setReportingSource}
          />

          <div className="absolute bottom-6 right-6 z-[1000] max-w-xs bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 hidden md:block">
             <div className="flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                   Click on any marker to view real-time health data, history, and to report issues for that water source.
                </p>
             </div>
          </div>
        </div>

        <ReportModal
          open={!!reportingSource}
          source={reportingSource}
          onClose={() => setReportingSource(null)}
          onSuccess={() => {
            // Optionally refresh sources to show updated status
            apiClient.getSources().then((res) => setSources(res.data.sources))
          }}
        />

        <div className="flex items-center justify-center pt-4">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Real-time data provided by the National Water Security Network
           </p>
        </div>
      </div>
    </div>
  )
}
