'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'

/**
 * Botão de envio que mostra que está salvando.
 *
 * O salvamento passa por servidor e banco; sem feedback a pessoa clica de
 * novo ou acha que travou. `useFormStatus` lê o estado do form pai.
 */
export function SubmitButton({
  children,
  pendingLabel = 'Salvando…',
  size = 'lg',
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size={size} disabled={pending} aria-busy={pending} className={className}>
      {pending ? pendingLabel : children}
    </Button>
  )
}
