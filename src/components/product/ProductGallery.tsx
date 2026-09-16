'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { cn } from '@/lib/cn'
import type { ProductImage } from '@/lib/types'

/**
 * Carrossel de fotos do produto.
 *
 * Foto real (`src`) quando a UPAR cadastrou; senão a ilustração vetorial.
 * Navega por setas, teclado, arraste no toque e miniaturas. O zoom abre a
 * mesma imagem em tela cheia, com as mesmas setas.
 */
export function ProductGallery({
  images,
  gpuCount,
  productName,
}: {
  images: ProductImage[]
  gpuCount: number
  productName: string
}) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = images.length
  const current = images[active] ?? images[0]

  const go = useCallback(
    (delta: number) => {
      if (total < 2) return
      setActive((index) => (index + delta + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (!zoomed) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false)
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoomed, go])

  if (!current) return null

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
    touchStartX.current = null
    // Arraste curto é toque; só troca de foto com um gesto claro.
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1)
  }

  const temFoto = Boolean(current.src)

  return (
    <div className="flex flex-col gap-3">
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label={`Fotos de ${productName}`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(1)
          if (event.key === 'ArrowLeft') go(-1)
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="group relative isolate aspect-4/3 overflow-hidden rounded-2xl border border-ink-700/70 bg-linear-to-b from-ink-850 to-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60"
      >
        {temFoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="h-full w-full object-contain"
            draggable={false}
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 opacity-50 grid-mesh [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />
            <div className="mx-auto h-full w-56 py-6 sm:w-72">
              <MachineRender variant={current.render} gpuCount={gpuCount} />
            </div>
          </>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-600/70 bg-ink-950/75 text-ink-100 backdrop-blur-md transition-colors hover:border-ink-400 hover:text-white"
            >
              <Icon name="arrowLeft" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-600/70 bg-ink-950/75 text-ink-100 backdrop-blur-md transition-colors hover:border-ink-400 hover:text-white"
            >
              <Icon name="arrowRight" className="size-4" />
            </button>

            <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5" aria-hidden="true">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === active ? 'w-5 bg-brand-400' : 'w-1.5 bg-ink-400/70',
                  )}
                />
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-2 rounded-lg border border-ink-600/70 bg-ink-950/75 px-3 py-2 text-sm text-ink-100 backdrop-blur-md transition-colors hover:border-ink-400 hover:text-white"
        >
          <Icon name="search" className="size-4" />
          Ampliar
        </button>

        <p className="absolute top-3.5 left-3.5 rounded-md bg-ink-950/70 px-2 py-1 text-xs text-ink-300 backdrop-blur-md">
          {total > 1 ? `${active + 1} / ${total}` : temFoto ? 'Foto' : 'Ilustração técnica'}
        </p>
      </div>

      {total > 1 && (
        <ul className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((image, index) => (
            <li key={`${image.src ?? image.render}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active}
                aria-label={`Ver foto ${index + 1}: ${image.alt}`}
                className={cn(
                  'flex h-18 w-24 items-center justify-center overflow-hidden rounded-lg border bg-ink-900 transition-colors',
                  index === active ? 'border-brand-500' : 'border-ink-700/70 hover:border-ink-500',
                )}
              >
                {image.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.src} alt="" className="h-full w-full object-cover" draggable={false} />
                ) : (
                  <div className="h-14 w-10">
                    <MachineRender variant={image.render} gpuCount={gpuCount} compact />
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {(current.caption || !temFoto) && (
        <p className="text-xs leading-relaxed text-ink-500">
          {current.caption ??
            'Imagem ilustrativa do equipamento. As fotos reais são publicadas pela UPAR.'}
        </p>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada — ${productName}`}
          className="fixed inset-0 z-80 flex items-center justify-center bg-ink-950/94 p-4 backdrop-blur-md"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            aria-label="Fechar visualização ampliada"
            onClick={() => setZoomed(false)}
            className="absolute inset-0"
          />
          <div className="relative flex max-h-full w-full max-w-5xl flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute -top-2 right-0 z-10 inline-flex size-10 items-center justify-center rounded-lg border border-ink-600/70 bg-ink-900/90 text-ink-100 transition-colors hover:text-white"
              aria-label="Fechar"
            >
              <Icon name="close" className="size-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute top-1/2 left-0 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-600/70 bg-ink-900/90 text-ink-100 hover:text-white"
                >
                  <Icon name="arrowLeft" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima foto"
                  className="absolute top-1/2 right-0 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-600/70 bg-ink-900/90 text-ink-100 hover:text-white"
                >
                  <Icon name="arrowRight" className="size-5" />
                </button>
              </>
            )}

            <div className="flex h-[78vh] w-full items-center justify-center">
              {temFoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.alt} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="h-full w-full max-w-md">
                  <MachineRender variant={current.render} gpuCount={gpuCount} />
                </div>
              )}
            </div>
            <p className="mt-3 text-center text-sm text-ink-300">
              {total > 1 ? `${active + 1} / ${total} · ` : ''}
              {current.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
