'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { cn } from '@/lib/cn'
import type { ProductImage } from '@/lib/types'

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
  const current = images[active] ?? images[0]

  useEffect(() => {
    if (!zoomed) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoomed])

  if (!current) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="relative isolate overflow-hidden rounded-xl border border-ink-700/70 bg-linear-to-b from-ink-850 to-ink-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-50 grid-mesh [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div className="mx-auto h-80 w-64 py-6 sm:h-[26rem] sm:w-80">
          <MachineRender variant={current.render} gpuCount={gpuCount} />
        </div>

        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-2 rounded-lg border border-ink-600/70 bg-ink-900/85 px-3 py-2 text-sm text-ink-100 backdrop-blur-md transition-colors hover:border-ink-500 hover:text-white"
        >
          <Icon name="search" className="size-4" />
          Ampliar
        </button>

        <p className="absolute bottom-3.5 left-3.5 max-w-[55%] text-xs text-ink-500">
          Ilustração técnica
        </p>
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-2.5">
          {images.map((image, index) => (
            <li key={`${image.render}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active}
                aria-label={`Ver imagem ${index + 1}: ${image.alt}`}
                className={cn(
                  'flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border bg-ink-900 transition-colors',
                  index === active
                    ? 'border-brand-500'
                    : 'border-ink-700/70 hover:border-ink-500',
                )}
              >
                <div className="h-16 w-12">
                  <MachineRender variant={image.render} gpuCount={gpuCount} compact />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-relaxed text-ink-500">
        As imagens são representações vetoriais do equipamento. Fotografias reais dos produtos serão
        publicadas pela UPAR.
      </p>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada — ${productName}`}
          className="fixed inset-0 z-80 flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-md"
        >
          <button
            type="button"
            aria-label="Fechar visualização ampliada"
            onClick={() => setZoomed(false)}
            className="absolute inset-0"
          />
          <div className="relative flex max-h-full w-full max-w-3xl flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomed(false)}
              className="absolute -top-2 right-0 inline-flex size-10 items-center justify-center rounded-lg border border-ink-600/70 bg-ink-900/90 text-ink-100 transition-colors hover:text-white"
              aria-label="Fechar"
            >
              <Icon name="close" className="size-5" />
            </button>
            <div className="h-[70vh] w-full max-w-md">
              <MachineRender variant={current.render} gpuCount={gpuCount} />
            </div>
            <p className="mt-3 text-center text-sm text-ink-300">{current.alt}</p>
          </div>
        </div>
      )}
    </div>
  )
}
