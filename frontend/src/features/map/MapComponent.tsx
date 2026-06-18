import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import type { WaterSource } from '@/types'
import { STATUS_LABELS } from '@/lib/status'
import { Badge, Button } from '@/components/ui'
import { DEFAULT_ZOOM, SIERRA_LEONE_CENTER, statusMarkerIcon } from './mapUtils'

interface MapComponentProps {
  sources: WaterSource[]
  districtFilter?: string
  searchQuery?: string
  onReportIssue?: (source: WaterSource) => void
}

function FlyToSearch({
  sources,
  searchQuery,
}: {
  sources: WaterSource[]
  searchQuery?: string
}) {
  const map = useMap()
  const match = useMemo(() => {
    if (!searchQuery?.trim()) return null
    const q = searchQuery.toLowerCase()
    return sources.find(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.district?.toLowerCase().includes(q),
    )
  }, [sources, searchQuery])

  useEffect(() => {
    if (match) {
      map.flyTo([match.latitude, match.longitude], 12, { duration: 1 })
    }
  }, [match, map])

  return null
}

export function MapComponent({
  sources,
  districtFilter,
  searchQuery,
  onReportIssue,
}: MapComponentProps) {
  const filtered = useMemo(() => {
    let list = sources
    if (districtFilter) {
      list = list.filter(
        (s) => s.district?.toLowerCase() === districtFilter.toLowerCase(),
      )
    }
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.district?.toLowerCase().includes(q),
      )
    }
    return list
  }, [sources, districtFilter, searchQuery])

  const greenAlternatives = (current: WaterSource) =>
    sources.filter((s) => s.status === 'green' && s.id !== current.id).slice(0, 2)

  return (
    <MapContainer
      center={SIERRA_LEONE_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-[min(70vh,560px)] w-full rounded-xl z-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSearch sources={sources} searchQuery={searchQuery} />
      {filtered.map((source) => (
        <Marker
          key={source.id}
          position={[source.latitude, source.longitude]}
          icon={statusMarkerIcon(source.status)}
        >
          <Popup>
            <div className="min-w-[200px] space-y-2">
              <p className="font-bold text-primary">{source.name}</p>
              <Badge status={source.status}>{STATUS_LABELS[source.status]}</Badge>
              {source.root_cause && (
                <p className="text-sm">
                  Issue: {source.root_cause.replace(/_/g, ' ')}
                </p>
              )}
              {source.district && (
                <p className="text-xs text-neutral">{source.district}</p>
              )}
              {source.status !== 'green' && (
                <div className="border-t pt-2">
                  <p className="text-xs font-semibold">Nearest safe sources:</p>
                  {greenAlternatives(source).length === 0 ? (
                    <p className="text-xs text-neutral">None listed nearby</p>
                  ) : (
                    <ul className="mt-1 text-xs">
                      {greenAlternatives(source).map((alt) => (
                        <li key={alt.id}>{alt.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  size="sm"
                  variant="default"
                  className="w-full"
                  onClick={() => onReportIssue?.(source)}
                >
                  Report an issue
                </Button>
                <Link to={`/find-water?lat=${source.latitude}&lon=${source.longitude}`} className="w-full">
                  <Button size="sm" variant="outline" className="w-full">
                    Find alternatives
                  </Button>
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
