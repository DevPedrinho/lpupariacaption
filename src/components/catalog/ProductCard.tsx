'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Icon, type IconName } from '@/components/ui/Icon'
import Image from 'next/image'
import { MachineRender } from '@/components/site/MachineRender'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { cn } from '@/lib/cn'
import {
  availabilityLabel, formatCapacity, formFactorLabel, formatPrice, gpuSummary,
  tierLabel, vramSummary,
} from '@/lib/format'
import type { Application, Product } from '@/lib/types'

const availabilityTone = {
  in_stock: 'positive',
  made_to_order: 'brand',
  pre_order: 'caution',
  unavailable: 'neutral',
} as const

export function ProductCard({
  product,
  applications,
  className,
}: {
  product: Product
  applications: Pick<Application, 'slug' | 'name'>[]
  className?: string
}) {
  const appNames = product.applications
    .map((slug) => applications.find((a) => a.slug === slug)?.name)
    .filter(Boolean) as string[]

  /*
   * Três números em blocos, não uma tabela rótulo/valor: no card a pessoa
   * compara de relance, e valor longo (modelo de placa) precisa de largura.
   */
  const specs: { icon: IconName; label: string; value: string; destaque?: boolean }[] = [
    { icon: 'gpu', label: 'Placa', value: gpuSummary(product) },
    { icon: 'memory', label: 'VRAM', value: vramSummary(product), destaque: true },
    { icon: 'cpu', label: 'RAM', value: `${formatCapacity(product.ram.capacityGb)} ${product.ram.type}` },
  ]

  return (
    <article
      className={cn(
        'group relative isolate flex flex-col overflow-hidden rounded-xl border border-ink-700/70 bg-ink-880/70 transition-colors duration-300 hover:border-ink-500/80',
        // Consulta de contêiner: o rodapé se adapta à largura do card, não da tela.
        '@container',
        className,
      )}
    >
      <div className="relative isolate overflow-hidden border-b border-ink-700/60 bg-linear-to-b from-ink-850 to-ink-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-45 grid-mesh [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />
        {product.images[0]?.src ? (
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="px-6 py-5">
            <div className="mx-auto h-44 w-36 transition-transform duration-500 group-hover:scale-[1.035]">
              <MachineRender
                variant={product.images[0]?.render ?? 'tower-glass'}
                gpuCount={product.gpu.quantity}
                compact
              />
            </div>
          </div>
        )}

        <div className="absolute top-3.5 left-3.5 flex flex-col items-start gap-1.5">
          <Badge tone="brand">{tierLabel[product.performanceTier]}</Badge>
          {product.isDemo && <Badge tone="demo">Dado demonstrativo</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-2xs tracking-[0.1em] text-ink-400 uppercase">
            <span>{formFactorLabel[product.formFactor]}</span>
            {product.customizable && (
              <>
                <span aria-hidden="true">·</span>
                <span>Personalizável</span>
              </>
            )}
          </div>
          <h3 className="line-clamp-2 text-lg leading-snug font-semibold">
            {/* Link esticado: um único link nomeado torna o card inteiro clicável
                sem criar destinos duplicados para leitores de tela. */}
            <Link
              href={`/produtos/${product.slug}`}
              className="transition-colors after:absolute after:inset-0 after:z-10 after:content-[''] hover:text-flux-300"
            >
              {product.name}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-300">{product.tagline}</p>
        </div>

        {appNames.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {appNames.slice(0, 3).map((name) => (
              <li
                key={name}
                className="rounded-md bg-white/5 px-2 py-1 text-2xs text-ink-200 ring-1 ring-white/8 ring-inset"
              >
                {name}
              </li>
            ))}
            {appNames.length > 3 && (
              <li className="rounded-md px-2 py-1 text-2xs text-ink-400">+{appNames.length - 3}</li>
            )}
          </ul>
        )}

        <dl className="grid grid-cols-3 gap-2">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className={cn(
                'flex min-w-0 flex-col gap-1 rounded-lg border px-2.5 py-2',
                spec.destaque ? 'border-brand-500/35 bg-brand-500/8' : 'border-ink-700/70 bg-ink-900/50',
              )}
            >
              <dt className="flex items-center gap-1.5 text-2xs tracking-[0.06em] text-ink-400 uppercase">
                <Icon name={spec.icon} className={cn('size-3.5', spec.destaque ? 'text-brand-300' : 'text-flux-400')} />
                {spec.label}
              </dt>
              {/* Duas linhas no máximo: um modelo escrito como frase não pode
                  esticar o card. O texto inteiro fica no title e na ficha. */}
              <dd
                title={spec.value}
                className={cn('line-clamp-2 text-[0.8125rem] leading-snug font-medium', spec.destaque ? 'text-brand-200' : 'text-white')}
              >
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-col gap-3.5 border-t border-ink-700/60 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
            <div>
              <p className="text-[1.0625rem] font-semibold text-white">
                {formatPrice(product.priceMode, product.priceBrl)}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">
                {product.isDemo && product.priceMode !== 'on_request'
                  ? 'Valor demonstrativo — confirmado pelo especialista'
                  : 'Valor confirmado pelo especialista'}
              </p>
            </div>
            <Badge tone={availabilityTone[product.availability]}>
              {availabilityLabel[product.availability]}
            </Badge>
          </div>

          {/*
            Um botão principal e o WhatsApp como atalho quadrado ao lado. Dois
            botões de texto lado a lado não cabiam no celular, e "Analisar" e
            "Solicitar" competiam entre si.
          */}
          <div className="flex gap-2">
            <Link
              href={`/produtos/${product.slug}`}
              className="relative z-20 inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-[0.9375rem] font-medium text-ink-950 transition-colors hover:bg-brand-400"
            >
              Ver configuração
              <Icon name="arrowRight" className="size-4" />
            </Link>
            <WhatsAppCta
              context={{ kind: 'produto', product, application: appNames[0] }}
              size="md"
              className="relative z-20 w-11 shrink-0 px-0"
              aria-label={`Pedir orçamento de ${product.name} no WhatsApp`}
            >
              <span className="sr-only">Pedir orçamento no WhatsApp</span>
            </WhatsAppCta>
          </div>
        </div>
      </div>
    </article>
  )
}
