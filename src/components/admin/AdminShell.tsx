'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ROLE_LABEL } from '@/lib/auth'
import type { NavItem } from '@/lib/admin-nav'
import type { AdminRole } from '@/lib/types'

export function AdminShell({
  items,
  user,
  onLogout,
  children,
}: {
  items: NavItem[]
  user: { name: string; email: string; role: AdminRole }
  onLogout: () => void
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav aria-label="Navegação do painel" className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              active ? 'bg-brand-500/14 text-white ring-1 ring-brand-500/30 ring-inset' : 'text-ink-300 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon name={item.icon} className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span
                aria-label={`${item.badge} aguardando`}
                className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-2xs font-semibold text-ink-950"
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-700/60 bg-ink-900 lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-700/60 px-5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-brand-500 to-flux-500">
            <svg viewBox="0 0 24 24" className="size-4.5 text-white" fill="none" aria-hidden="true">
              <path d="M6 5.5v7.2A6 6 0 0 0 18 12.7V5.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              <circle cx="6" cy="18.5" r="1.9" fill="currentColor" />
              <circle cx="18" cy="18.5" r="1.9" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-[0.95rem] leading-none font-semibold text-white">
            Painel UPAR<span className="ml-1 text-flux-400">AI</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">{nav}</div>

        <div className="border-t border-ink-700/60 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon name="external" className="size-4" />
            Ver o site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-700/60 bg-ink-950/92 px-5 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Alternar menu"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-100 lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} className="size-4" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-ink-400">{ROLE_LABEL[user.role]}</p>
            </div>
            <form action={onLogout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-600/70 px-3 py-2 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
              >
                <Icon name="logout" className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </header>

        {open && (
          <div className="border-b border-ink-700/60 bg-ink-900 p-3 lg:hidden">{nav}</div>
        )}

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
