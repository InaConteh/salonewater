import { cn } from '@/lib/utils'
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './shadcn/card'

interface CardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  className,
  onClick,
}: CardProps) {
  return (
    <ShadcnCard
      className={cn(onClick && 'cursor-pointer hover:border-primary/50', className)}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle className="text-xl">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !subtitle && 'pt-6')}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadcnCard>
  )
}
