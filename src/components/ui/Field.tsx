'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3.5 py-2.5 text-[0.9375rem] text-ink-50 ' +
  'placeholder:text-ink-400 transition-colors hover:border-ink-500 focus:border-brand-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500/35 disabled:opacity-50'

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
  className?: string
}) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ')
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink-200">
        {label}
        {required ? <span className="ml-1 text-critical-500">*</span> : null}
      </label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-ink-400">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-critical-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(control, className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }: ComponentPropsWithoutRef<'select'>) {
  return (
    <select className={cn(control, 'appearance-none bg-[right_0.85rem_center] pr-9', className)} {...props}>
      {children}
    </select>
  )
}

export function Checkbox({
  label,
  className,
  ...props
}: { label: ReactNode } & ComponentPropsWithoutRef<'input'>) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-2.5 text-sm text-ink-200', className)}>
      <input
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-xs border border-ink-500 bg-ink-900 accent-brand-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
