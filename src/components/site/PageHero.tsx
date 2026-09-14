import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

export type Crumb = { label: string; href?: string }

/** Cabeçalho padrão das páginas internas. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: Crumb[]
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink-700/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 grid-mesh opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(31,107,255,0.26), rgba(53,216,240,0.09) 45%, transparent 70%)',
        }}
      />

      <div className="container-page py-12 md:py-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Trilha de navegação" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-400">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && <Icon name="chevronRight" className="size-3.5 text-ink-600" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-ink-200">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-ink-200">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="text-2xs font-semibold tracking-[0.16em] text-flux-300 uppercase">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 text-[2rem] leading-[1.12] font-semibold md:text-[2.75rem]">{title}</h1>
            {description && (
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-300">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">{actions}</div>}
        </div>

        {children}
      </div>
    </section>
  )
}
