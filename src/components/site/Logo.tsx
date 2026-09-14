import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Marca provisória. Substituir pelo logotipo oficial da UPAR em SVG
 * (versões clara e escura) assim que o arquivo de identidade for fornecido.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="UPAR AI — página inicial"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span className="relative inline-flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-brand-500 to-flux-500 shadow-[0_6px_20px_-8px_rgb(31_107_255/0.9)]">
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" aria-hidden="true">
          <path
            d="M6 5.5v7.2A6 6 0 0 0 18 12.7V5.5"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <circle cx="6" cy="18.5" r="1.9" fill="currentColor" />
          <circle cx="18" cy="18.5" r="1.9" fill="currentColor" />
          <path d="M6 18.5h12" stroke="currentColor" strokeWidth="1.6" opacity="0.65" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[1.15rem] leading-none font-semibold tracking-tight text-white">
          UPAR<span className="ml-1 text-flux-400">AI</span>
        </span>
      )}
    </Link>
  )
}
