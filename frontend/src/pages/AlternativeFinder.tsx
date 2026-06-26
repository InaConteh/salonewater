import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiClient, type NearbySource } from '@/services/api'
import { Badge, Button, Card, Input } from '@/components/ui'
import { ErrorState, LoadingState } from '@/components/common/LoadingState'
import { STATUS_LABELS } from '@/lib/status'

export function AlternativeFinder() {
  const [params] = useSearchParams()
  const [lat, setLat] = useState(params.get('lat') ?? '')
  const [lon, setLon] = useState(params.get('lon') ?? '')
  const [results, setResults] = useState<NearbySource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.getNearby(latitude, longitude, 5)
      setResults(data.sources)
      if (data.sources.length === 0) {
        setError('No safe (green) sources found nearby.')
      }
    } catch {
      setError('Search failed. Check coordinates and API connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const la = parseFloat(lat)
    const lo = parseFloat(lon)
    if (Number.isNaN(la) || Number.isNaN(lo)) {
      setError('Enter valid latitude and longitude.')
      return
    }
    search(la, lo)
  }

  const useGps = () => {
    if (!navigator.geolocation) {
      setError('GPS not available on this device.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude.toFixed(5)
        const lo = pos.coords.longitude.toFixed(5)
        setLat(la)
        setLon(lo)
        search(parseFloat(la), parseFloat(lo))
      },
      () => {
        setError('Could not get your location.')
        setLoading(false)
      },
    )
  }

  useEffect(() => {
    const la = params.get('lat')
    const lo = params.get('lon')
    if (la && lo) {
      search(parseFloat(la), parseFloat(lo))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-container max-w-2xl space-y-6 py-8">
      <header>
        <h1 className="text-3xl font-bold">Find safe water nearby</h1>
        <p className="mt-1 text-neutral">
          Lists the closest functional (green) sources to your location.
        </p>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Latitude"
              name="lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
            <Input
              label="Longitude"
              name="lon"
              type="number"
              step="any"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              Search
            </Button>
            <Button type="button" variant="outline" onClick={useGps} disabled={loading}>
              Use my location
            </Button>
          </div>
        </form>
      </Card>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      <ul className="space-y-3">
        {results.map((source) => (
          <li key={source.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-primary">{source.name}</h2>
                  <p className="text-sm text-neutral">{source.district}</p>
                  <Badge status="green" className="mt-2">
                    {STATUS_LABELS.green}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {source.distance_km} km away
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${source.latitude},${source.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block"
              >
                <Button size="sm" variant="outline">
                  Get directions
                </Button>
              </a>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
