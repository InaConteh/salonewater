import { Card } from '@/components/ui'

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

export function SMSGuide() {
  return (
    <div className="page-container max-w-3xl space-y-8 py-8 print:py-4">
      <header className="print:break-after-avoid">
        <h1 className="text-3xl font-bold">SMS command guide</h1>
        <p className="mt-1 text-neutral">
          Text these commands to your local CleanFlow number. English & Krio.
        </p>
      </header>

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
          <Card key={item.cmd} title={item.cmd}>
            <p>
              <span className="font-semibold">English:</span> {item.en}
            </p>
            <p className="mt-1 text-neutral-dark">
              <span className="font-semibold">Krio:</span> {item.krio}
            </p>
            <p className="mt-2 font-mono text-sm bg-bgLight rounded px-2 py-1">
              {item.example}
            </p>
            <p className="mt-2 text-sm text-neutral">
              <span className="font-semibold">Reply:</span> {item.response}
            </p>
          </Card>
        ))}
      </section>
    </div>
  )
}
