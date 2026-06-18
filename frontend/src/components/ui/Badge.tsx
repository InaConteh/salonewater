import { cn } from '@/lib/utils'
import { Badge as ShadcnBadge } from './shadcn/badge'

interface BadgeProps {
  status?: 'green' | 'yellow' | 'red'
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'info'
  children?: React.ReactNode
  className?: string
}

export function Badge({ status, variant = 'default', children, className }: BadgeProps) {
  let v: any = variant
  let text = children

  if (status === 'green') {
    v = 'success'
    text = text || 'Safe'
  } else if (status === 'yellow') {
    v = 'warning'
    text = text || 'Warning'
  } else if (status === 'red') {
    v = 'destructive'
    text = text || 'Danger'
  } else if (variant === 'info') {
    v = 'secondary'
  }

  return (
    <ShadcnBadge variant={v} className={cn('px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold', className)}>
      {text}
    </ShadcnBadge>
  )
}
