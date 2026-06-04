import { WaterDropIcon } from '@/assets/icons'
import { cn } from '@/lib/cn'
import { formatDate, STATUS_CARD_CLASS, STATUS_LABELS } from '@/lib/status'
import type { WaterSource } from '@/types'
import { Badge } from './Badge'
import { Button } from './Button'

export interface StatusCardProps {
  source: WaterSource
  onReportIssue?: (source: WaterSource) => void
  onViewHistory?: (source: WaterSource) => void
}

export function StatusCard({ source, onReportIssue, onViewHistory }: StatusCardProps) {
  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 p-4 shadow-card transition-all duration-200',
        'hover:shadow-cardHover focus-within:shadow-cardHover',
        STATUS_CARD_CLASS[source.status],
      )}
      aria-label={`${source.name}, ${STATUS_LABELS[source.status]}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
            source.status === 'green' && 'bg-success/20 text-success',
            source.status === 'yellow' && 'bg-warning/30 text-[#856404]',
            source.status === 'red' && 'bg-danger/20 text-danger',
          )}
          aria-hidden="true"
        >
          <WaterDropIcon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-primary">{source.name}</h3>
          {source.district && (
            <p className="text-sm text-neutral">{source.district}</p>
          )}
          <div className="mt-2">
            <Badge status={source.status} />
          </div>
          <p className="mt-2 text-xs text-neutral-dark">
            Updated {formatDate(source.last_updated)}
          </p>
          {source.root_cause && (
            <p className="mt-1 text-sm text-body">
              Issue: {source.root_cause.replace(/_/g, ' ')}
            </p>
          )}
        </div>
      </div>

      <div
        className={cn(
          'mt-4 flex flex-wrap gap-2 opacity-100 transition-opacity duration-200',
          'sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100',
        )}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReportIssue?.(source)}
          aria-label={`Report issue at ${source.name}`}
        >
          Report Issue
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewHistory?.(source)}
          aria-label={`View history for ${source.name}`}
        >
          View History
        </Button>
      </div>
    </article>
  )
}
