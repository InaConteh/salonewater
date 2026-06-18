import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Input as ShadcnInput } from './shadcn/input'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-foreground/80">
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
