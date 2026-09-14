import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Section({
  children,
  className,
  id,
  tone = 'dark',
}: {
  children: ReactNode
  className?: string
  id?: string
  tone?: 'dark' | 'light' | 'raised'
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-18 md:py-24',
        tone === 'light' && 'surface-light',
        tone === 'raised' && 'bg-ink-900',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3.5',
        align === 'center' && 'items-center text-center',
        align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            'text-2xs font-semibold uppercase tracking-[0.16em]',
            tone === 'light' ? 'text-brand-600' : 'text-flux-300',
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-[1.75rem] leading-[1.15] font-semibold md:text-[2.35rem]">{title}</h2>
      {description ? (
        <p className={cn('text-[1.0625rem] leading-relaxed', tone === 'light' ? 'text-ink-600' : 'text-ink-300')}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
