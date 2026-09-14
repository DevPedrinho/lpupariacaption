'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({
  items,
  tone = 'dark',
  className,
}: {
  items: AccordionItem[]
  tone?: 'dark' | 'light'
  className?: string
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null)
  const light = tone === 'light'

  return (
    <div className={cn('divide-y', light ? 'divide-ink-200' : 'divide-ink-700/70', className)}>
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                className={cn(
                  'flex w-full items-center justify-between gap-4 py-5 text-left text-[1.0625rem] font-medium transition-colors',
                  light ? 'text-ink-900 hover:text-brand-600' : 'text-white hover:text-flux-300',
                )}
              >
                <span>{item.question}</span>
                <Icon
                  name="chevronDown"
                  className={cn(
                    'size-5 shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180',
                    light ? 'text-ink-500' : 'text-ink-400',
                  )}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              hidden={!isOpen}
              className={cn('pb-5 pr-10 text-[0.9375rem] leading-relaxed', light ? 'text-ink-600' : 'text-ink-300')}
            >
              {item.answer}
            </div>
          </div>
        )
      })}
    </div>
  )
}
