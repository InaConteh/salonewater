import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

const paddingClass = {
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-light/80 bg-surface shadow-card',
        className,
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className={cn('border-b border-neutral-light/80', paddingClass[padding], 'pb-3')}>
          {title && <h3 className="text-lg font-bold text-primary">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-neutral">{subtitle}</p>}
        </div>
      )}
      <div className={cn(!title && !subtitle && paddingClass[padding])}>{children}</div>
      {footer && (
        <div
          className={cn(
            'border-t border-neutral-light/80 bg-bgLight/50',
            paddingClass[padding],
          )}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
