'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import {
  BUDGET_BANDS, applyFilters, countActive, emptyFilters, ramOptions, sortProducts,
  storageOptions, vramOptions, type FilterKey, type FilterState, type SortKey, SORT_OPTIONS,
} from '@/lib/catalog-filters'
import { availabilityLabel, formFactorLabel, tierLabel } from '@/lib/format'
import type { Application, Product } from '@/lib/types'
import { FilterGroup, type Option } from './FilterGroup'
import { ProductCard } from './ProductCard'

const GROUP_LABEL: Record<FilterKey, string> = {
  aplicacao: 'Aplicação',
  investimento: 'Investimento',
  fabricanteGpu: 'Fabricante da GPU',
  modeloGpu: 'Modelo da GPU',
  vram: 'VRAM',
  ram: 'Memória RAM',
  processador: 'Processador',
  armazenamento: 'Armazenamento',
  gpus: 'Quantidade de GPUs',
  formato: 'Formato',
  desempenho: 'Nível de desempenho',
  disponibilidade: 'Disponibilidade',
}

function parseFilters(params: URLSearchParams): FilterState {
  const state: FilterState = { ...emptyFilters, aplicacao: [], investimento: [], fabricanteGpu: [], modeloGpu: [], vram: [], ram: [], processador: [], armazenamento: [], gpus: [], formato: [], desempenho: [], disponibilidade: [], busca: '' }
  for (const key of Object.keys(GROUP_LABEL) as FilterKey[]) {
    const raw = params.get(key)
    if (raw) state[key] = raw.split(',').filter(Boolean)
  }
  // Compatibilidade com os atalhos usados no rodapé
  const formFactor = params.get('formFactor')
  if (formFactor) state.formato = [formFactor]
  state.busca = params.get('busca') ?? ''
  return state
}

function serialize(filters: FilterState, sort: SortKey): string {
  const params = new URLSearchParams()
  for (const key of Object.keys(GROUP_LABEL) as FilterKey[]) {
    if (filters[key].length) params.set(key, filters[key].join(','))
  }
  if (filters.busca.trim()) params.set('busca', filters.busca.trim())
  if (sort !== 'relevancia') params.set('ordem', sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function CatalogBrowser({
  products,
  applications,
}: {
  products: Product[]
  applications: Application[]
}) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(() => parseFilters(new URLSearchParams(searchParams.toString())))
  const [sort, setSort] = useState<SortKey>(() => (searchParams.get('ordem') as SortKey) ?? 'relevancia')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const appIndex = useMemo(() => applications.map(({ slug, name }) => ({ slug, name })), [applications])

  const options = useMemo(() => {
    const countBy = (predicate: (product: Product) => boolean) => products.filter(predicate).length
    const gpuModels = Array.from(new Set(products.map((p) => p.gpu.model))).sort()
    const vendors = Array.from(new Set(products.map((p) => p.gpu.vendor)))

    return {
      aplicacao: applications
        .map<Option>((app) => ({
          value: app.slug,
          label: app.name,
          count: countBy((p) => p.applications.includes(app.slug)),
        }))
        .filter((option) => (option.count ?? 0) > 0),
      investimento: Object.entries(BUDGET_BANDS).map<Option>(([value, band]) => ({ value, label: band.label })),
      fabricanteGpu: vendors.map<Option>((vendor) => ({
        value: vendor,
        label: vendor,
        count: countBy((p) => p.gpu.vendor === vendor),
      })),
      modeloGpu: gpuModels.map<Option>((model) => ({
        value: model,
        label: model,
        count: countBy((p) => p.gpu.model === model),
      })),
      vram: vramOptions(),
      ram: ramOptions(),
      processador: [
        { value: 'amd', label: 'AMD' },
        { value: 'intel', label: 'Intel' },
        { value: '16', label: '16 núcleos ou mais' },
        { value: '24', label: '24 núcleos ou mais' },
        { value: '32', label: '32 núcleos ou mais' },
      ] as Option[],
      armazenamento: storageOptions(),
      gpus: [
        { value: '1', label: '1 placa' },
        { value: '2', label: '2 placas' },
        { value: '3', label: '3 placas' },
        { value: '4+', label: '4 placas ou mais' },
      ] as Option[],
      formato: (['workstation', 'desktop', 'server'] as const).map<Option>((value) => ({
        value,
        label: formFactorLabel[value],
        count: countBy((p) => p.formFactor === value),
      })),
      desempenho: (['essencial', 'avancado', 'profissional', 'extremo'] as const).map<Option>((value) => ({
        value,
        label: tierLabel[value],
        count: countBy((p) => p.performanceTier === value),
      })),
      disponibilidade: (['in_stock', 'made_to_order', 'pre_order', 'unavailable'] as const)
        .map<Option>((value) => ({
          value,
          label: availabilityLabel[value],
          count: countBy((p) => p.availability === value),
        }))
        .filter((option) => (option.count ?? 0) > 0),
    }
  }, [products, applications])

  const results = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort])
  const activeCount = countActive(filters)

  // Mantém a URL compartilhável sem provocar nova renderização do servidor.
  useEffect(() => {
    const query = serialize(filters, sort)
    window.history.replaceState(null, '', `${window.location.pathname}${query}`)
  }, [filters, sort])

  useEffect(() => {
    if (activeCount === 0) return
    const timer = window.setTimeout(() => {
      track('filter_catalog', { filtros: serialize(filters, sort), resultados: results.length })
    }, 800)
    return () => window.clearTimeout(timer)
  }, [filters, sort, results.length, activeCount])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const toggle = (key: FilterKey, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }))
  }

  const clearAll = () => setFilters({ ...emptyFilters })

  const activeChips = (Object.keys(GROUP_LABEL) as FilterKey[]).flatMap((key) =>
    filters[key].map((value) => ({
      key,
      value,
      label: options[key].find((option) => option.value === value)?.label ?? value,
    })),
  )

  /*
   * Filtros rápidos na barra: os três que um comprador não técnico entende
   * de primeira (aplicação, nível e formato). O resto — VRAM, RAM, modelo da
   * placa… — continua disponível em "Mais filtros", sem ocupar a tela.
   */
  const rapidos: FilterKey[] = ['aplicacao', 'desempenho', 'formato']
  const avancadosAtivos = (Object.keys(GROUP_LABEL) as FilterKey[])
    .filter((key) => !rapidos.includes(key))
    .reduce((total, key) => total + filters[key].length, 0)

  const Chip = ({
    active,
    onClick,
    children,
    count,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
    count?: number
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors',
        active
          ? 'border-brand-500 bg-brand-500/12 text-white'
          : 'border-ink-600/70 bg-ink-900/50 text-ink-200 hover:border-ink-500 hover:text-white',
      )}
    >
      {children}
      {typeof count === 'number' && <span className={cn('text-xs', active ? 'text-brand-300' : 'text-ink-500')}>{count}</span>}
    </button>
  )

  const panel = (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-ink-700/60 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon name="sliders" className="size-4 text-flux-400" />
          Filtros
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-ink-300 transition-colors hover:text-white"
          >
            Limpar tudo
          </button>
        )}
      </div>

      <FilterGroup title={GROUP_LABEL.aplicacao} options={options.aplicacao} selected={filters.aplicacao} onToggle={(v) => toggle('aplicacao', v)} defaultOpen />
      <FilterGroup title={GROUP_LABEL.vram} options={options.vram} selected={filters.vram} onToggle={(v) => toggle('vram', v)} defaultOpen hint="Considera a soma da memória de todas as placas de vídeo da configuração." />
      <FilterGroup title={GROUP_LABEL.investimento} options={options.investimento} selected={filters.investimento} onToggle={(v) => toggle('investimento', v)} />
      <FilterGroup title={GROUP_LABEL.fabricanteGpu} options={options.fabricanteGpu} selected={filters.fabricanteGpu} onToggle={(v) => toggle('fabricanteGpu', v)} />
      <FilterGroup title={GROUP_LABEL.modeloGpu} options={options.modeloGpu} selected={filters.modeloGpu} onToggle={(v) => toggle('modeloGpu', v)} />
      <FilterGroup title={GROUP_LABEL.gpus} options={options.gpus} selected={filters.gpus} onToggle={(v) => toggle('gpus', v)} />
      <FilterGroup title={GROUP_LABEL.ram} options={options.ram} selected={filters.ram} onToggle={(v) => toggle('ram', v)} />
      <FilterGroup title={GROUP_LABEL.processador} options={options.processador} selected={filters.processador} onToggle={(v) => toggle('processador', v)} />
      <FilterGroup title={GROUP_LABEL.armazenamento} options={options.armazenamento} selected={filters.armazenamento} onToggle={(v) => toggle('armazenamento', v)} hint="Soma da capacidade de todas as unidades instaladas." />
      <FilterGroup title={GROUP_LABEL.formato} options={options.formato} selected={filters.formato} onToggle={(v) => toggle('formato', v)} />
      <FilterGroup title={GROUP_LABEL.desempenho} options={options.desempenho} selected={filters.desempenho} onToggle={(v) => toggle('desempenho', v)} />
      <FilterGroup title={GROUP_LABEL.disponibilidade} options={options.disponibilidade} selected={filters.disponibilidade} onToggle={(v) => toggle('disponibilidade', v)} />
    </div>
  )

  return (
    <div className="container-page pb-20">
      <div className="min-w-0">
        {/* Busca, ordem e o acesso aos filtros técnicos numa linha só. */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={filters.busca}
              onChange={(event) => setFilters((current) => ({ ...current, busca: event.target.value }))}
              placeholder="Buscar por nome ou placa de vídeo"
              aria-label="Buscar no catálogo"
              className="h-11 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 pr-3 pl-9 text-[0.9375rem] text-ink-50 placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/35 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:shrink-0">
            <label className="sr-only" htmlFor="ordenacao">Ordenar catálogo</label>
            <select
              id="ordenacao"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-11 min-w-0 rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/35 focus:outline-none sm:w-44"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Button variant="secondary" size="md" onClick={() => setDrawerOpen(true)} className="justify-center">
              <Icon name="sliders" />
              Mais filtros{avancadosAtivos > 0 ? ` (${avancadosAtivos})` : ''}
            </Button>
          </div>
        </div>

        {/* Aplicação: uma fileira rolável de chips, sem quebrar em coluna. */}
        <div className="mt-4 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2">
            <Chip active={filters.aplicacao.length === 0} onClick={() => setFilters((c) => ({ ...c, aplicacao: [] }))}>
              Todas as aplicações
            </Chip>
            {options.aplicacao.map((option) => (
              <Chip
                key={option.value}
                active={filters.aplicacao.includes(option.value)}
                onClick={() => toggle('aplicacao', option.value)}
                count={option.count}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Nível e formato: poucos valores, cabem em chips que quebram linha. */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-[0.08em] text-ink-400 uppercase">Nível</span>
            {options.desempenho.map((option) => (
              <Chip key={option.value} active={filters.desempenho.includes(option.value)} onClick={() => toggle('desempenho', option.value)}>
                {option.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs tracking-[0.08em] text-ink-400 uppercase">Formato</span>
            {options.formato.map((option) => (
              <Chip key={option.value} active={filters.formato.includes(option.value)} onClick={() => toggle('formato', option.value)}>
                {option.label}
              </Chip>
            ))}
          </div>
        </div>

        {activeChips.some((chip) => !rapidos.includes(chip.key)) && (
          <ul className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips
              .filter((chip) => !rapidos.includes(chip.key))
              .map((chip) => (
                <li key={`${chip.key}-${chip.value}`}>
                  <button
                    type="button"
                    onClick={() => toggle(chip.key, chip.value)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-flux-400/35 bg-flux-500/10 py-1 pr-2 pl-3 text-sm text-flux-200 transition-colors hover:bg-flux-500/18"
                  >
                    <span className="text-2xs text-flux-300/80 uppercase">{GROUP_LABEL[chip.key]}</span>
                    {chip.label}
                    <Icon name="close" className="size-3.5" />
                    <span className="sr-only">Remover filtro</span>
                  </button>
                </li>
              ))}
          </ul>
        )}

        {activeCount > 0 && (
          <p className="mt-3">
            <button type="button" onClick={clearAll} className="text-sm text-ink-300 underline underline-offset-4 hover:text-white">
              Limpar todos os filtros
            </button>
          </p>
        )}

        <p className="mt-5 text-sm text-ink-400" aria-live="polite">
          {results.length === 0
            ? 'Nenhuma configuração corresponde a esses filtros'
            : `${results.length} ${results.length === 1 ? 'configuração encontrada' : 'configurações encontradas'}`}
        </p>

        {results.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} applications={appIndex} />
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-start gap-5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-8">
            <Badge tone="flux">Nada encontrado com esses critérios</Badge>
            <p className="max-w-lg text-[0.9375rem] leading-relaxed text-ink-300">
              Grande parte dos equipamentos é montada sob medida e não aparece no catálogo. Descreva o que
              você precisa executar e montamos a configuração.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <WhatsAppCta context={{ kind: 'catalogo' }} size="md">
                Descrever minha necessidade
              </WhatsAppCta>
              <Button variant="secondary" size="md" onClick={clearAll}>
                Limpar filtros
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-start gap-4 rounded-xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-7 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Ainda em dúvida sobre qual configuração escolher?</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-300">
              Dois minutos de diagnóstico indicam uma categoria compatível e até três equipamentos relacionados.
            </p>
          </div>
          <ButtonLink href="/encontre-sua-configuracao" size="md" className="shrink-0">
            Encontrar minha configuração
            <Icon name="arrowRight" />
          </ButtonLink>
        </div>
      </div>

      {/* Painel completo de filtros (gaveta lateral) */}
      <div
        hidden={!drawerOpen}
        className="fixed inset-0 z-60"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros do catálogo"
      >
        <button
          type="button"
          aria-label="Fechar filtros"
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        />
        <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-ink-900 shadow-lift">
          <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-4">
            <h2 className="text-base font-semibold text-white">Todos os filtros</h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-200"
              aria-label="Fechar filtros"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">{panel}</div>
          <div className="border-t border-ink-700/60 p-4">
            <Button size="lg" className="w-full" onClick={() => setDrawerOpen(false)}>
              Ver {results.length} {results.length === 1 ? 'configuração' : 'configurações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
