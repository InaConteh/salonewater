import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { STATUS_BADGE_CLASS, STATUS_LABELS } from '@/lib/status'
import type { WaterStatus } from '@/types'

export type BadgeVariant = WaterStatus | 'neutral' | 'info'

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
  const resolved = status ?? (variant as WaterStatus | undefined)
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
