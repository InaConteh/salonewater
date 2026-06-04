import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  id?: string
  rightAddon?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  id,
  className,
  rightAddon,
  required,
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-base font-semibold text-body">
        {label}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            'w-full rounded-lg border-2 border-neutral-light bg-surface px-4 py-3 text-base text-body',
            'placeholder:text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
            error && 'border-danger focus:border-danger focus:ring-danger/25',
            rightAddon ? 'pr-12' : undefined,
            className,
          )}
          {...props}
        />
        {rightAddon && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            {rightAddon}
          </div>
        )}
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-neutral">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
