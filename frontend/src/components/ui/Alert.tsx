import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { AlertVariant } from '@/types'

const variantClass: Record<AlertVariant, string> = {
  info: 'border-primary/30 bg-primary-light text-primary',
  success: 'border-success/30 bg-success-light text-success-dark',
  warning: 'border-warning/40 bg-warning-light text-[#856404]',
  danger: 'border-danger/30 bg-danger-light text-danger-dark',
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  onDismiss?: () => void
}

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
  role = 'status',
  ...props
}: AlertProps) {
  return (
    <div
      role={role}
      className={cn(
        'flex gap-3 rounded-lg border-2 px-4 py-3',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold">{title}</p>}
        <div className={cn('text-sm', title && 'mt-1')}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 self-start rounded p-1 font-bold opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          &times;
        </button>
      )}
    </div>
  )
}
