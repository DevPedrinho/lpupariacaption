import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'brand' | 'flux' | 'neutral' | 'positive' | 'caution' | 'neural' | 'demo'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/12 text-brand-200 ring-brand-500/30',
  flux: 'bg-flux-400/12 text-flux-300 ring-flux-400/30',
  neural: 'bg-neural-500/14 text-neural-400 ring-neural-500/30',
  neutral: 'bg-white/6 text-ink-200 ring-white/12',
  positive: 'bg-positive-500/12 text-[#5FD9A4] ring-positive-500/30',
  caution: 'bg-caution-500/12 text-[#F0C560] ring-caution-500/30',
  demo: 'bg-caution-500/10 text-[#F0C560] ring-caution-500/35',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.08em] ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
