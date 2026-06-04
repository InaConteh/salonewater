import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  hint?: string
  error?: string
}

export function Select({
  label,
  options,
  hint,
  error,
  id,
  className,
  required,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="mb-1.5 block text-base font-semibold text-body">
        {label}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
      <select
        id={selectId}
        required={required}
        aria-invalid={!!error}
        className={cn(
          'w-full appearance-none rounded-lg border-2 border-neutral-light bg-surface px-4 py-3 text-base text-body',
          'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25',
          error && 'border-danger',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="mt-1.5 text-sm text-neutral">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
