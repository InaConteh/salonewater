import { cn } from '@/lib/utils'
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from './shadcn/button'

interface ButtonProps extends ShadcnButtonProps {
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  className,
  variant,
  loading,
  fullWidth,
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Map old variants to new ones if necessary
  const v = (variant as string) === 'danger' ? 'destructive' : variant

  return (
    <ShadcnButton
      className={cn(fullWidth && "w-full", className)}
      variant={v as any}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </ShadcnButton>
  )
}
