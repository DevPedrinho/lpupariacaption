'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { MAX_COMPARE, useCompare } from '@/components/site/CompareProvider'
import { cn } from '@/lib/cn'
import {
  availabilityLabel, formatCapacity, formatPrice, formFactorLabel, gpuSummary, storageSummary,
  tierLabel, totalStorageGb, totalVramGb, vramSummary,
} from '@/lib/format'
import type { Application, Product, SiteSettings } from '@/lib/types'

type Row = {
  label: string
  render: (product: Product) => string
  /** Valor numérico usado apenas para destacar o maior — não implica "melhor". */
  metric?: (product: Product) => number
  metricNote?: string
  hint?: string
}

export function ComparatorClient({
  products,
  applications,
  settings,
}: {
  products: Product[]
  applications: Application[]
  settings: SiteSettings
}) {
  const { slugs, toggle, remove, clear, isFull } = useCompare()
  const [pickerOpen, setPickerOpen] = useState(false)

  const selected = useMemo(
    () => slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p)),
    [slugs, products],
  )

  const appName = (slug: string) => applications.find((a) => a.slug === slug)?.name ?? slug

  const rows: Row[] = [
    { label: 'Processador', render: (p) => p.cpu.model },
    {
      label: 'Núcleos e threads',
      render: (p) => `${p.cpu.cores} núcleos · ${p.cpu.threads} threads`,
      metric: (p) => p.cpu.cores,
      metricNote: 'Mais núcleos',
      hint: 'Pesa mais em ciência de dados, simulação e compilação do que em inferência de IA.',
    },
    { label: 'Placa de vídeo', render: (p) => gpuSummary(p) },
    {
      label: 'VRAM total',
      render: (p) => vramSummary(p),
      metric: (p) => totalVramGb(p),
      metricNote: 'Mais VRAM',
      hint: 'Define o tamanho do modelo e do contexto que cabem na máquina.',
    },
    {
      label: 'Memória RAM',
      render: (p) => `${formatCapacity(p.ram.capacityGb)} ${p.ram.type}`,
      metric: (p) => p.ram.capacityGb,
      metricNote: 'Mais memória',
    },
    {
      label: 'Armazenamento',
      render: (p) => storageSummary(p),
      metric: (p) => totalStorageGb(p),
      metricNote: 'Mais capacidade',
    },
    {
      label: 'GPUs suportadas pelo chassi',
      render: (p) => `${p.gpu.quantity} instalada${p.gpu.quantity > 1 ? 's' : ''} · até ${p.maxGpus}`,
      metric: (p) => p.maxGpus,
      metricNote: 'Mais posições',
    },
    { label: 'Refrigeração', render: (p) => p.cooling },
    { label: 'Fonte de alimentação', render: (p) => p.psu },
    { label: 'Rede', render: (p) => p.network },
    { label: 'Expansibilidade', render: (p) => p.expansion.join(' · ') },
    { label: 'Aplicações recomendadas', render: (p) => p.applications.map(appName).join(' · ') },
    {
      label: 'Nível estimado de desempenho',
      render: (p) => tierLabel[p.performanceTier],
      hint: 'Posição relativa dentro da linha UPAR. Não é uma medição de desempenho.',
    },
    { label: 'Formato', render: (p) => formFactorLabel[p.formFactor] },
    { label: 'Perfil de cliente', render: (p) => p.clientProfile },
    { label: 'Garantia', render: (p) => p.warranty ?? settings.warrantyPolicy },
    { label: 'Disponibilidade', render: (p) => availabilityLabel[p.availability] },
    {
      label: 'Investimento',
      render: (p) =>
        `${formatPrice(p.priceMode, p.priceBrl)}${p.isDemo && p.priceMode !== 'on_request' ? ' (demonstrativo)' : ''}`,
    },
  ]

  const available = products.filter((p) => !slugs.includes(p.slug))

  if (selected.length === 0) {
    return (
      <div className="container-page pb-20">
        <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-8 md:p-12">
          <Badge tone="flux">Nenhuma configuração selecionada</Badge>
          <h2 className="mt-4 text-2xl font-semibold text-white">Escolha até três computadores para comparar</h2>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-300">
            Selecione as configurações abaixo ou use o botão de comparação nos cards do catálogo. A seleção
            fica salva enquanto você navega pelo site.
          </p>
          <ButtonLink href="/catalogo" variant="secondary" size="md" className="mt-6">
            Ir para o catálogo
            <Icon name="arrowRight" />
          </ButtonLink>
        </div>

        <h3 className="mt-12 text-lg font-semibold text-white">Selecione a partir do catálogo</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPickerCard product={product} onAdd={() => toggle(product.slug)} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="container-page pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-300">
          Comparando {selected.length} de {MAX_COMPARE} configurações
        </p>
        <div className="flex items-center gap-2">
          {!isFull && (
            <Button variant="secondary" size="sm" onClick={() => setPickerOpen((value) => !value)}>
              <Icon name="plus" />
              Adicionar configuração
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpar comparação
          </Button>
        </div>
      </div>

      {pickerOpen && !isFull && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((product) => (
            <li key={product.id}>
              <ProductPickerCard
                product={product}
                onAdd={() => {
                  toggle(product.slug)
                  setPickerOpen(false)
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 overflow-x-auto rounded-xl border border-ink-700/70">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Comparativo técnico entre as configurações selecionadas</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 w-52 min-w-44 border-b border-ink-700/60 bg-ink-850 px-5 py-4 align-bottom text-sm font-semibold text-white"
              >
                Característica
              </th>
              {selected.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className="min-w-64 border-b border-l border-ink-700/60 bg-ink-850 px-5 py-4 align-bottom"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-20 w-16">
                        <MachineRender
                          variant={product.images[0]?.render ?? 'tower-glass'}
                          gpuCount={product.gpu.quantity}
                          compact
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        aria-label={`Remover ${product.name} da comparação`}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-ink-600/70 text-ink-400 transition-colors hover:text-white"
                      >
                        <Icon name="close" className="size-3.5" />
                      </button>
                    </div>
                    <div>
                      <Link
                        href={`/produtos/${product.slug}`}
                        className="text-base font-semibold text-white transition-colors hover:text-flux-300"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs font-normal text-ink-400">{product.tagline}</p>
                    </div>
                    <WhatsAppCta context={{ kind: 'produto', product }} size="sm" className="w-full">
                      Solicitar orçamento
                    </WhatsAppCta>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-ink-700/50">
            {rows.map((row) => {
              const values = selected.map(row.render)
              const different = new Set(values).size > 1
              const metrics = row.metric ? selected.map(row.metric) : null
              const best = metrics ? Math.max(...metrics) : null
              const bestIsUnique =
                metrics && best !== null ? metrics.filter((value) => value === best).length === 1 : false

              return (
                <tr key={row.label} className={cn(different && 'bg-brand-500/[0.035]')}>
                  <th
                    scope="row"
                    className={cn(
                      'sticky left-0 z-10 border-r border-ink-700/60 bg-ink-900 px-5 py-4 align-top font-medium',
                      different ? 'text-white' : 'text-ink-400',
                    )}
                  >
                    <span className="flex items-start gap-2">
                      {different && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-flux-400"
                        />
                      )}
                      <span>
                        {row.label}
                        {row.hint && (
                          <span className="mt-1 block text-xs font-normal text-ink-500">{row.hint}</span>
                        )}
                      </span>
                    </span>
                  </th>
                  {selected.map((product, index) => (
                    <td key={product.id} className="border-l border-ink-700/50 px-5 py-4 align-top text-ink-100">
                      {values[index]}
                      {bestIsUnique && metrics && metrics[index] === best && row.metricNote && (
                        <span className="mt-1.5 block text-2xs font-medium tracking-wide text-flux-300 uppercase">
                          {row.metricNote}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-ink-700/70 bg-ink-880/50 px-4 py-3.5 text-sm text-ink-300">
        <Icon name="info" className="mt-0.5 size-4 shrink-0 text-flux-400" />
        <p className="leading-relaxed">
          As marcações indicam apenas onde cada configuração tem o maior número em uma característica
          isolada. Elas <strong className="font-medium text-ink-100">não</strong> significam que um
          computador é melhor que outro: a escolha certa depende da aplicação, do software utilizado e do
          volume de trabalho. É exatamente isso que um especialista ajuda a definir.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-7 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Quer ajuda para decidir entre elas?</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-300">
            Envie a comparação para um especialista junto com a sua aplicação. A recomendação sai em poucos
            minutos.
          </p>
        </div>
        <WhatsAppCta
          context={{ kind: 'comparador', productNames: selected.map((product) => product.name) }}
          size="lg"
          className="shrink-0"
        >
          Enviar comparação no WhatsApp
        </WhatsAppCta>
      </div>
    </div>
  )
}

function ProductPickerCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex w-full items-center gap-4 rounded-xl border border-ink-700/70 bg-ink-880/60 p-4 text-left transition-colors hover:border-brand-500/45"
    >
      <div className="h-16 w-12 shrink-0">
        <MachineRender
          variant={product.images[0]?.render ?? 'tower-glass'}
          gpuCount={product.gpu.quantity}
          compact
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-medium text-white">{product.name}</p>
        <p className="mt-0.5 text-xs text-ink-400">
          {gpuSummary(product)} · {formatCapacity(totalVramGb(product))} VRAM
        </p>
      </div>
      <Icon name="plus" className="size-4 shrink-0 text-flux-400" />
    </button>
  )
}
