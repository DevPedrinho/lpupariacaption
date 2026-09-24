'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { readConsent, writeConsent, type ConsentValue } from '@/lib/consent'
import { Button } from '@/components/ui/Button'

/** Banner de consentimento. Antes do aceite, a mensuração roda sem cookies (Consent Mode v2). */
export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentValue>('accepted')

  useEffect(() => {
    setConsent(readConsent())
  }, [])

  if (consent !== null) return null

  const decide = (value: 'accepted' | 'essential') => {
    writeConsent(value)
    setConsent(value)
  }

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed inset-x-3 bottom-3 z-50 rounded-xl border border-ink-600/70 bg-ink-900/97 p-5 shadow-lift backdrop-blur-xl md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md"
    >
      <h2 className="text-base font-semibold text-white">Cookies e privacidade</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">
        Usamos cookies essenciais para o funcionamento do site e, com a sua autorização, cookies de
        medição para entender como as páginas são usadas. Você pode escolher agora e mudar depois na{' '}
        <Link href="/politica-de-privacidade" className="text-flux-300 underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button size="sm" onClick={() => decide('accepted')} className="sm:flex-1">
          Aceitar todos
        </Button>
        <Button variant="secondary" size="sm" onClick={() => decide('essential')} className="sm:flex-1">
          Apenas essenciais
        </Button>
      </div>
    </div>
  )
}
