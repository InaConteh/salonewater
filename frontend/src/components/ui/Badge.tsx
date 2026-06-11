import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { STATUS_BADGE_CLASS, STATUS_LABELS } from '@/lib/status'
import type { WaterStatus } from '@/types'

export type BadgeVariant = WaterStatus | 'neutral' | 'info' | 'primary' | 'warning' | 'danger' | 'safe'

const neutralClass = 'bg-neutral-light text-neutral-dark border-neutral/30'
const infoClass = 'bg-primary-light text-primary border-primary/30'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children?: ReactNode
  status?: WaterStatus
}

export function Badge({
  variant,
  status,
  children,
  className,
  ...props
}: BadgeProps) {
  const resolved = status ?? (['green', 'yellow', 'red'].includes(variant as string) ? (variant as WaterStatus) : undefined)
  const label =
    children ??
    (resolved && resolved in STATUS_LABELS
      ? STATUS_LABELS[resolved as WaterStatus]
      : variant === 'info'
        ? 'Info'
        : 'Neutral')

  const styleClass =
    resolved && resolved in STATUS_BADGE_CLASS
      ? STATUS_BADGE_CLASS[resolved as WaterStatus]
      : variant === 'info'
        ? infoClass
        : variant === 'primary'
          ? 'bg-primary/20 text-primary border-primary/30'
          : variant === 'warning'
            ? 'bg-warning/30 text-[#856404] border-warning/30'
            : variant === 'danger'
              ? 'bg-danger/20 text-danger border-danger/30'
              : variant === 'safe'
                ? 'bg-success/20 text-success border-success/30'
                : neutralClass

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide',
        styleClass,
        className,
      )}
      {...props}
    >
      {label}
    </span>
  )
}
