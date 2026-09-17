'use client'

import { useEffect, useRef, useState } from 'react'
import { useSiteConfig } from '@/components/site/SiteConfig'

/**
 * Foto de alguém da equipe, cadastrada no painel.
 *
 * Enquanto não houver arquivo, mostra a marca — nunca foto de banco de
 * imagens nem pessoa gerada: o visitante entenderia como funcionário real.
 *
 * O `onError` sozinho não resolve: o HTML vem do servidor, então a imagem
 * costuma falhar antes de o React hidratar e o evento se perde. A verificação
 * no primeiro render olha o estado do elemento, que é o que sobra depois de
 * o erro já ter acontecido.
 */
export function ConsultantPhoto({ className = '' }: { className?: string }) {
  const settings = useSiteConfig()
  const configurada = settings.consultantPhotoUrl?.trim()
  const [falhou, setFalhou] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) setFalhou(true)
  }, [configurada])

  const photo = falhou ? '' : configurada

  return (
    <figure className={`m-0 flex flex-col gap-3 ${className}`}>
      {photo ? (
        <img
          ref={imgRef}
          src={photo}
          alt={
            settings.consultantName
              ? `${settings.consultantName}, da equipe da UPAR`
              : 'Especialista da equipe da UPAR'
          }
          onError={() => setFalhou(true)}
          className="aspect-4/5 w-full rounded-2xl object-cover sm:aspect-square lg:aspect-4/5"
        />
      ) : (
        <div className="flex aspect-4/5 w-full items-center justify-center rounded-2xl border border-ink-700/70 bg-ink-850 sm:aspect-square lg:aspect-4/5">
          <img src="/marca/upar-negativo.svg" alt="" aria-hidden="true" className="w-1/2 opacity-25" />
        </div>
      )}

      {photo && settings.consultantName ? (
        <figcaption className="flex flex-col gap-0.5">
          <span className="font-medium text-white">{settings.consultantName}</span>
          {settings.consultantRole ? <span className="text-sm text-ink-400">{settings.consultantRole}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
