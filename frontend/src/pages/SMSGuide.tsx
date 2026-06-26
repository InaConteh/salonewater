import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { apiClient, type Report } from '@/services/api'
import { formatDate, getStatusColor } from '@/lib/status'
import { useAuthStore } from '@/store/authStore'

const COMMANDS = [
  {
    cmd: 'STATUS [ID]',
    en: 'Check if a water source is safe today.',
    krio: 'Chek if wata de safe today.',
    example: 'STATUS b6e2b05e-6ebb-4711-a24c-77565a4df36a',
    response: '🟢 Bo Market Handpump: GREEN. Cause: none.',
  },
  {
    cmd: 'CAUSE [ID] [CODE]',
    en: 'Report an issue (codes 1–6).',
    krio: 'Report problem wit wata.',
    example: 'CAUSE [ID] 4',
    response: '🔴 Report saved. Thank you!',
  },
  {
    cmd: 'NEARBY [AREA]',
    en: 'List safe sources in a district.',
    krio: 'Show safe wata near you.',
    example: 'NEARBY Kambia',
    response: 'Nearby safe: Bo Market Handpump…',
  },
  {
    cmd: 'NEARBY [LAT] [LON]',
    en: 'Find safe sources by GPS coordinates.',
    krio: 'Find safe wata by location.',
    example: 'NEARBY 8.5 -11.5',
    response: 'Nearby safe: name (2.3km)…',
  },
  {
    cmd: 'TIPS',
    en: 'Random health or maintenance tip.',
    krio: 'Get one health tip.',
    example: 'TIPS',
    response: '💡 Boil or filter water before drinking.',
  },
]

const CAUSE_CODES = [
  { code: '1', name: 'Drought' },
  { code: '2', name: 'Broken pump' },
  { code: '3', name: 'Dry well' },
  { code: '4', name: 'Contamination' },
  { code: '5', name: 'Overuse' },
  { code: '6', name: 'Seasonal' },
]

function LiveReportFeed() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const res = await apiClient.getReports()
      setReports(res.data.reports.slice(0, 10))
    } catch (err) {
      console.error('Failed to fetch reports', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
    const interval = setInterval(fetchReports, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-bold text-lg">24/7 Live Feed</h3>
        </div>
        <Badge variant="info">Live</Badge>
      </div>

      {loading && reports.length === 0 ? (
        <div className="py-10 text-center text-neutral italic">Connecting to feed...</div>
      ) : reports.length === 0 ? (
        <div className="py-10 text-center text-neutral italic">No recent reports.</div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
          {reports.map((r) => (
            <div key={r.id} className="flex gap-3 pb-3 border-b border-neutral-light last:border-b-0">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: getStatusColor(r.status || '') }}
              >
                {r.status === 'danger' ? (
                  <AlertCircle className="h-4 w-4 text-white" />
                ) : r.status === 'warning' ? (
                  <Clock className="h-4 w-4 text-white" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{r.source_name}</p>
                <p className="text-xs text-neutral">
                  {r.cause_category?.replace(/_/g, ' ')} • {r.district}
                </p>
                <p className="text-[10px] text-neutral-dark mt-1">{formatDate(r.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function SMSGuide() {
  const { role } = useAuthStore()
  const isAdmin = role === 'admin'

  return (
    <div className="page-container py-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">SMS command guide</h1>
          <p className="mt-1 text-neutral">
<<<<<<< HEAD
            Text these commands to your local CleanFlow number. English & Krio.
=======
            Text these commands to your local Salone Water Watch number. English & Krio.
>>>>>>> origin/rename-salone-water-watch-6798015821729430602
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Go to Admin Dashboard
            </Button>
          </Link>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-bold">Cause codes</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {CAUSE_CODES.map((c) => (
                <li key={c.code} className="rounded-lg border bg-surface px-3 py-2 text-sm">
                  <strong>{c.code}</strong> — {c.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">Commands</h2>
            {COMMANDS.map((item) => (
              <Card key={item.cmd}>
                <h3 className="font-mono text-blue-600 font-bold mb-2">{item.cmd}</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">English:</span> {item.en}
                  </p>
                  <p className="text-sm text-neutral-dark">
                    <span className="font-semibold">Krio:</span> {item.krio}
                  </p>
                </div>
                <div className="mt-3 bg-bgLight rounded p-2">
                  <p className="text-xs font-mono text-neutral">Example: {item.example}</p>
                </div>
                <p className="mt-2 text-xs text-neutral">
                  <span className="font-semibold">Reply:</span> {item.response}
                </p>
              </Card>
            ))}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <LiveReportFeed />
          </div>
        </aside>
      </div>
    </div>
  )
}
