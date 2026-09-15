import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ' +
  'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none ' +
  '[&_svg]:shrink-0 active:translate-y-px'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-ink-950 hover:bg-brand-400 shadow-[0_10px_30px_-12px_rgb(55_219_154/0.5)] ' +
    'hover:shadow-[0_14px_38px_-12px_rgb(55_219_154/0.6)]',
  secondary:
    'bg-ink-800/70 text-ink-50 border border-ink-600/70 hover:bg-ink-700/80 hover:border-ink-500',
  ghost: 'text-ink-200 hover:text-white hover:bg-white/6',
  whatsapp: 'bg-[#1FA855] text-white hover:bg-[#199247] shadow-[0_10px_30px_-14px_rgb(31_168_85/0.9)]',
  light: 'bg-ink-900 text-white hover:bg-ink-800',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm [&_svg]:size-4',
  md: 'h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.05rem]',
  lg: 'h-13 px-6 text-base [&_svg]:size-5',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  external,
  ...props
}: CommonProps & { href: string; external?: boolean } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'href' | 'className' | 'children'
  >) {
  const classes = cn(base, variants[variant], sizes[size], className)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  )
}
