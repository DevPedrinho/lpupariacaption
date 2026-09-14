'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export type Option = { value: string; label: string; count?: number }

export function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = false,
  hint,
}: {
  title: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
  defaultOpen?: boolean
  hint?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (options.length === 0) return null

  return (
    <div className="border-b border-ink-700/60 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink-100">
          {title}
          {selected.length > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-500 text-2xs font-semibold text-white">
              {selected.length}
            </span>
          )}
        </span>
        <Icon
          name="chevronDown"
          className={cn('size-4 shrink-0 text-ink-400 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      <div hidden={!open} className="mt-3.5">
        {hint && <p className="mb-2.5 text-xs leading-relaxed text-ink-400">{hint}</p>}
        <ul className="flex flex-col gap-2">
          {options.map((option) => {
            const checked = selected.includes(option.value)
            return (
              <li key={option.value}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1 text-sm transition-colors',
                    checked ? 'text-white' : 'text-ink-300 hover:text-ink-100',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option.value)}
                    className="size-4 shrink-0 cursor-pointer rounded-xs border border-ink-500 bg-ink-900 accent-brand-500"
                  />
                  <span className="flex-1">{option.label}</span>
                  {typeof option.count === 'number' && (
                    <span className="text-xs text-ink-500">{option.count}</span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
