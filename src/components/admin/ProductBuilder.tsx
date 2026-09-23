'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { saveProduct } from '@/app/admin/actions'
import { cn } from '@/lib/cn'
import { availabilityLabel, formFactorLabel, formatCapacity, tierLabel } from '@/lib/format'
import type {
  Application, Availability, FormFactor, GpuVendor, PerformanceTier, PriceMode, Product, PublishStatus,
  StorageDrive,
} from '@/lib/types'

/* ----------------------------------------------------------------------------
 * Monte a máquina: cadastro de produto passo a passo.
 *
 * Em vez de um formulário longo com campos de texto "um item por linha", o
 * admin escolhe peça a peça, como num configurador de loja: cartões para o
 * que tem poucas opções, botões de valor para o que tem números comuns,
 * campo livre só onde não há como prever. O resumo à direita mostra a máquina
 * tomando forma e o que ainda falta.
 *
 * O servidor não mudou: tudo vira os mesmos campos que `saveProduct` já lê,
 * através de inputs escondidos. Se este componente quebrar, o dado continua
 * no mesmo formato.
 * -------------------------------------------------------------------------- */

type Build = {
  id: string
  name: string
  slug: string
  tagline: string
  summary: string
  clientProfile: string
  formFactor: FormFactor
  performanceTier: PerformanceTier
  applications: string[]
  cpuVendor: 'AMD' | 'Intel'
  cpuModel: string
  cpuCores: number
  cpuThreads: number
  gpuVendor: GpuVendor
  gpuModel: string
  gpuQuantity: number
  gpuVram: number
  gpuNote: string
  maxGpus: number
  ramCapacity: number
  ramType: string
  ramMax: number
  storage: StorageDrive[]
  cooling: string
  psu: string
  network: string
  chassis: string
  expansion: string[]
  priceMode: PriceMode
  priceBrl: number
  leadTime: string
  warranty: string
  services: string[]
  availability: Availability
  status: PublishStatus
  featured: boolean
  customizable: boolean
  isDemo: boolean
  seoTitle: string
  seoDescription: string
}

const STEPS = [
  { key: 'identidade', label: 'Identidade', icon: 'edit' },
  { key: 'cpu', label: 'Processador', icon: 'cpu' },
  { key: 'gpu', label: 'Placa de vídeo', icon: 'gpu' },
  { key: 'ram', label: 'Memória', icon: 'memory' },
  { key: 'storage', label: 'Armazenamento', icon: 'storage' },
  { key: 'estrutura', label: 'Estrutura', icon: 'cooling' },
  { key: 'extras', label: 'Expansão e serviços', icon: 'upgrade' },
  { key: 'comercial', label: 'Comercial', icon: 'chart' },
  { key: 'publicacao', label: 'Publicação', icon: 'spark' },
] as const satisfies readonly { key: string; label: string; icon: IconName }[]

type StepKey = (typeof STEPS)[number]['key']

const VRAM_PRESETS = [8, 12, 16, 24, 32, 48, 80, 96]
const RAM_PRESETS = [16, 32, 64, 128, 192, 256, 512]
const DRIVE_PRESETS = [500, 1000, 2000, 4000, 8000]
const PSU_PRESETS = ['750 W', '850 W', '1000 W', '1200 W', '1600 W', '2000 W']
const COOLING_PRESETS = ['Refrigeração a ar', 'Water cooler AIO 240 mm', 'Water cooler AIO 360 mm', 'Refrigeração líquida customizada']
const NETWORK_PRESETS = ['1 GbE', '2.5 GbE', '10 GbE', '2.5 GbE + Wi-Fi 6E', '10 GbE + Wi-Fi 7']
const RAM_TYPES = ['DDR4', 'DDR5', 'DDR5 ECC', 'DDR5 RDIMM ECC']

function inicial(product?: Product): Build {
  const cpuVendor: Build['cpuVendor'] = /intel|xeon|core/i.test(product?.cpu.model ?? '') ? 'Intel' : 'AMD'
  return {
    id: product?.id ?? '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    tagline: product?.tagline ?? '',
    summary: product?.summary ?? '',
    clientProfile: product?.clientProfile ?? '',
    formFactor: product?.formFactor ?? 'workstation',
    performanceTier: product?.performanceTier ?? 'avancado',
    applications: product?.applications ?? [],
    cpuVendor,
    cpuModel: product?.cpu.model ?? '',
    cpuCores: product?.cpu.cores ?? 16,
    cpuThreads: product?.cpu.threads ?? 32,
    gpuVendor: product?.gpu.vendor ?? 'NVIDIA',
    gpuModel: product?.gpu.model ?? '',
    gpuQuantity: product?.gpu.quantity ?? 1,
    gpuVram: product?.gpu.vramGb ?? 0,
    gpuNote: product?.gpu.note ?? '',
    maxGpus: product?.maxGpus ?? 1,
    ramCapacity: product?.ram.capacityGb ?? 0,
    ramType: product?.ram.type ?? 'DDR5',
    ramMax: product?.ram.maxGb ?? 0,
    storage: product?.storage ?? [],
    cooling: product?.cooling ?? '',
    psu: product?.psu ?? '',
    network: product?.network ?? '',
    chassis: product?.chassis ?? '',
    expansion: product?.expansion ?? [],
    priceMode: product?.priceMode ?? 'on_request',
    priceBrl: product?.priceBrl ?? 0,
    leadTime: product?.leadTime ?? '',
    warranty: product?.warranty ?? '',
    services: product?.services ?? [],
    availability: product?.availability ?? 'made_to_order',
    status: product?.status ?? 'draft',
    featured: product?.featured ?? false,
    customizable: product?.customizable ?? true,
    isDemo: product?.isDemo ?? false,
    seoTitle: product?.seoTitle ?? '',
    seoDescription: product?.seoDescription ?? '',
  }
}

/** O que cada etapa exige para contar como concluída. */
function pendencias(b: Build): Record<StepKey, string[]> {
  return {
    identidade: [
      ...(b.name.trim() ? [] : ['nome']),
      ...(b.tagline.trim() ? [] : ['chamada curta']),
      ...(b.applications.length ? [] : ['ao menos uma aplicação']),
    ],
    cpu: [...(b.cpuModel.trim() ? [] : ['modelo do processador']), ...(b.cpuCores > 0 ? [] : ['núcleos'])],
    gpu: [...(b.gpuModel.trim() ? [] : ['modelo da placa']), ...(b.gpuVram > 0 ? [] : ['VRAM'])],
    ram: b.ramCapacity > 0 ? [] : ['capacidade da memória'],
    storage: b.storage.length > 0 ? [] : ['ao menos um disco'],
    estrutura: [...(b.cooling ? [] : ['refrigeração']), ...(b.psu ? [] : ['fonte'])],
    extras: [],
    comercial: b.priceMode !== 'on_request' && !(b.priceBrl > 0) ? ['valor em R$'] : [],
    publicacao: b.status === 'published' && !b.summary.trim() ? ['resumo comercial para publicar'] : [],
  }
}

/** Ordem de grandeza da máquina, só para o resumo do painel. Não vai para o site. */
function potencia(b: Build): { nivel: number; sugestao: PerformanceTier } {
  const vram = b.gpuVram * Math.max(1, b.gpuQuantity)
  let pontos = 0
  if (vram >= 16) pontos += 1
  if (vram >= 32) pontos += 1
  if (vram >= 64) pontos += 1
  if (vram >= 128) pontos += 1
  if (b.ramCapacity >= 64) pontos += 1
  if (b.ramCapacity >= 192) pontos += 1
  if (b.gpuQuantity >= 2) pontos += 1
  if (b.cpuCores >= 24) pontos += 1
  const sugestao: PerformanceTier = pontos >= 6 ? 'extremo' : pontos >= 4 ? 'profissional' : pontos >= 2 ? 'avancado' : 'essencial'
  return { nivel: Math.min(8, pontos), sugestao }
}

/* ------------------------------ Peças de UI -------------------------------- */

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const area =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

/*
 * Grupo com título. Não é <label>: um label em volta de vários botões dá o
 * texto do título ao primeiro botão como nome acessível, e o leitor de tela
 * anuncia "Aplicações recomendadas" em vez do nome da aplicação.
 */
function Campo({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="group" aria-label={label} className={cn('block', className)}>
      <span className="mb-1.5 block text-xs font-medium text-ink-300">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </div>
  )
}

function Cartoes<T extends string>({
  opcoes,
  valor,
  onChange,
  colunas = 3,
}: {
  opcoes: { value: T; label: string; description?: string; icon?: IconName }[]
  valor: T
  onChange: (v: T) => void
  colunas?: 2 | 3 | 4
}) {
  return (
    <div className={cn('grid gap-2.5', colunas === 2 && 'sm:grid-cols-2', colunas === 3 && 'sm:grid-cols-3', colunas === 4 && 'grid-cols-2 sm:grid-cols-4')}>
      {opcoes.map((op) => {
        const ativo = op.value === valor
        return (
          <button
            key={op.value}
            type="button"
            onClick={() => onChange(op.value)}
            aria-pressed={ativo}
            className={cn(
              'flex min-h-16 flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition-all',
              ativo
                ? 'border-brand-500 bg-brand-500/12 ring-1 ring-brand-500/40'
                : 'border-ink-700/70 bg-ink-900/50 hover:border-ink-500 hover:bg-ink-850',
            )}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                {op.icon && <Icon name={op.icon} className={cn('size-4', ativo ? 'text-brand-300' : 'text-ink-400')} />}
                {op.label}
              </span>
              {ativo && <Icon name="check" className="size-4 shrink-0 text-brand-300" />}
            </span>
            {op.description && <span className="text-xs leading-relaxed text-ink-400">{op.description}</span>}
          </button>
        )
      })}
    </div>
  )
}

/** Valores prontos em botões + "outro" para digitar. */
function Valores({
  presets,
  valor,
  onChange,
  formatar = (v) => String(v),
  unidade,
}: {
  presets: number[]
  valor: number
  onChange: (v: number) => void
  formatar?: (v: number) => string
  unidade?: string
}) {
  const custom = valor > 0 && !presets.includes(valor)
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-pressed={valor === p}
          className={cn(
            'h-10 rounded-lg border px-3.5 text-sm font-medium transition-colors',
            valor === p ? 'border-brand-500 bg-brand-500/12 text-white' : 'border-ink-600/70 bg-ink-900/50 text-ink-200 hover:border-ink-500',
          )}
        >
          {formatar(p)}
        </button>
      ))}
      <span className="flex items-center gap-1.5">
        <input
          type="number"
          min={0}
          value={custom ? valor : ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder="outro"
          className={cn(input, 'w-24')}
        />
        {unidade && <span className="text-xs text-ink-400">{unidade}</span>}
      </span>
    </div>
  )
}

function Textos({ presets, valor, onChange, placeholder }: { presets: string[]; valor: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={valor === p}
            className={cn(
              'h-9 rounded-full border px-3.5 text-sm transition-colors',
              valor === p ? 'border-brand-500 bg-brand-500/12 text-white' : 'border-ink-600/70 bg-ink-900/50 text-ink-200 hover:border-ink-500',
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <input value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={input} />
    </div>
  )
}

function Contador({ valor, onChange, min = 1, max = 16 }: { valor: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="inline-flex h-10 items-center rounded-lg border border-ink-600/70 bg-ink-900/70">
      <button type="button" onClick={() => onChange(Math.max(min, valor - 1))} aria-label="Diminuir" className="inline-flex h-full w-10 items-center justify-center text-ink-300 hover:text-white">
        <Icon name="minus" className="size-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-white">{valor}</span>
      <button type="button" onClick={() => onChange(Math.min(max, valor + 1))} aria-label="Aumentar" className="inline-flex h-full w-10 items-center justify-center text-ink-300 hover:text-white">
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  )
}

/** Lista de itens curtos: digita, Enter, vira chip. Substitui o "um por linha". */
function Itens({ itens, onChange, placeholder, sugestoes = [] }: { itens: string[]; onChange: (v: string[]) => void; placeholder: string; sugestoes?: string[] }) {
  const [texto, setTexto] = useState('')
  const adicionar = (v: string) => {
    const limpo = v.trim()
    if (!limpo || itens.includes(limpo)) return
    onChange([...itens, limpo])
    setTexto('')
  }
  return (
    <div className="flex flex-col gap-2.5">
      {itens.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {itens.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/35 bg-brand-500/10 py-1 pr-1.5 pl-3 text-sm text-brand-100">
              {item}
              <button type="button" onClick={() => onChange(itens.filter((i) => i !== item))} aria-label={`Remover ${item}`} className="inline-flex size-5 items-center justify-center rounded-full hover:bg-brand-500/25">
                <Icon name="close" className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              adicionar(texto)
            }
          }}
          placeholder={placeholder}
          className={input}
        />
        <button type="button" onClick={() => adicionar(texto)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 text-sm text-ink-200 hover:border-ink-500 hover:text-white">
          <Icon name="plus" className="size-4" />
          Adicionar
        </button>
      </div>
      {sugestoes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sugestoes.filter((s) => !itens.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => adicionar(s)} className="rounded-full border border-dashed border-ink-600/70 px-2.5 py-0.5 text-xs text-ink-400 hover:border-ink-400 hover:text-ink-200">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------- Builder ---------------------------------- */

export function ProductBuilder({
  product,
  applications,
  sugestoes,
}: {
  product?: Product
  applications: Application[]
  /** Modelos já cadastrados em outros produtos, para autocompletar. */
  sugestoes: { cpus: string[]; gpus: string[] }
}) {
  const [b, setB] = useState<Build>(() => inicial(product))
  const [etapa, setEtapa] = useState<StepKey>('identidade')
  const [tentouSalvar, setTentouSalvar] = useState(false)

  const set = <K extends keyof Build>(k: K, v: Build[K]) => setB((atual) => ({ ...atual, [k]: v }))
  const falta = useMemo(() => pendencias(b), [b])
  const concluidas = STEPS.filter((s) => falta[s.key].length === 0).length
  const progresso = Math.round((concluidas / STEPS.length) * 100)
  const { nivel, sugestao } = potencia(b)
  const indice = STEPS.findIndex((s) => s.key === etapa)
  const bloqueios = (['identidade', 'cpu', 'gpu', 'ram', 'storage'] as StepKey[]).flatMap((k) => falta[k])
  const podeSalvar = bloqueios.length === 0

  const totalVram = b.gpuVram * Math.max(1, b.gpuQuantity)
  const totalDisco = b.storage.reduce((t, d) => t + d.capacityGb, 0)

  const irPara = (k: StepKey) => {
    setEtapa(k)
    document.getElementById('builder-topo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <form
      action={saveProduct}
      onSubmit={(e) => {
        setTentouSalvar(true)
        if (!podeSalvar) {
          e.preventDefault()
          irPara(STEPS.find((s) => falta[s.key].length > 0)?.key ?? 'identidade')
        }
      }}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
    >
      {/* ------------------------ Campos que o servidor lê ------------------------ */}
      <input type="hidden" name="id" value={b.id} />
      <input type="hidden" name="name" value={b.name} />
      <input type="hidden" name="slug" value={b.slug} />
      <input type="hidden" name="tagline" value={b.tagline} />
      <input type="hidden" name="summary" value={b.summary} />
      <input type="hidden" name="clientProfile" value={b.clientProfile} />
      <input type="hidden" name="formFactor" value={b.formFactor} />
      <input type="hidden" name="performanceTier" value={b.performanceTier} />
      {b.applications.map((slug) => (
        <input key={slug} type="hidden" name="applications" value={slug} />
      ))}
      <input type="hidden" name="cpuModel" value={b.cpuModel} />
      <input type="hidden" name="cpuCores" value={b.cpuCores} />
      <input type="hidden" name="cpuThreads" value={b.cpuThreads} />
      <input type="hidden" name="gpuVendor" value={b.gpuVendor} />
      <input type="hidden" name="gpuModel" value={b.gpuModel} />
      <input type="hidden" name="gpuQuantity" value={b.gpuQuantity} />
      <input type="hidden" name="gpuVram" value={b.gpuVram} />
      <input type="hidden" name="gpuNote" value={b.gpuNote} />
      <input type="hidden" name="maxGpus" value={Math.max(b.maxGpus, b.gpuQuantity)} />
      <input type="hidden" name="ramCapacity" value={b.ramCapacity} />
      <input type="hidden" name="ramType" value={b.ramType} />
      <input type="hidden" name="ramMax" value={b.ramMax || ''} />
      <input type="hidden" name="storage" value={b.storage.map((d) => [d.kind, d.capacityGb, d.purpose ?? ''].join(' | ')).join('\n')} />
      <input type="hidden" name="cooling" value={b.cooling} />
      <input type="hidden" name="psu" value={b.psu} />
      <input type="hidden" name="network" value={b.network} />
      <input type="hidden" name="chassis" value={b.chassis} />
      <input type="hidden" name="expansion" value={b.expansion.join('\n')} />
      <input type="hidden" name="priceMode" value={b.priceMode} />
      <input type="hidden" name="priceBrl" value={b.priceMode === 'on_request' ? '' : b.priceBrl || ''} />
      <input type="hidden" name="leadTime" value={b.leadTime} />
      <input type="hidden" name="warranty" value={b.warranty} />
      <input type="hidden" name="services" value={b.services.join('\n')} />
      <input type="hidden" name="availability" value={b.availability} />
      <input type="hidden" name="status" value={b.status} />
      {b.featured && <input type="hidden" name="featured" value="on" />}
      {b.customizable && <input type="hidden" name="customizable" value="on" />}
      {b.isDemo && <input type="hidden" name="isDemo" value="on" />}
      <input type="hidden" name="seoTitle" value={b.seoTitle} />
      <input type="hidden" name="seoDescription" value={b.seoDescription} />

      {/* ------------------------------- Etapas --------------------------------- */}
      <div id="builder-topo" className="min-w-0 scroll-mt-24">
        <ol className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => {
            const ok = falta[s.key].length === 0
            const ativa = s.key === etapa
            return (
              <li key={s.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => irPara(s.key)}
                  aria-current={ativa ? 'step' : undefined}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors',
                    ativa
                      ? 'border-brand-500 bg-brand-500/12 text-white'
                      : ok
                        ? 'border-brand-500/30 text-brand-200 hover:border-brand-400'
                        : 'border-ink-700/70 text-ink-300 hover:border-ink-500 hover:text-white',
                  )}
                >
                  <span className={cn('inline-flex size-5 items-center justify-center rounded-full text-2xs', ok ? 'bg-brand-500 text-ink-950' : 'bg-ink-800 text-ink-300')}>
                    {ok ? <Icon name="check" className="size-3" /> : i + 1}
                  </span>
                  {s.label}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-4 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
              <Icon name={STEPS[indice].icon} className="size-5" />
            </span>
            <div>
              <p className="text-2xs tracking-[0.12em] text-ink-400 uppercase">Etapa {indice + 1} de {STEPS.length}</p>
              <h2 className="text-lg font-semibold text-white">{STEPS[indice].label}</h2>
            </div>
          </div>

          {etapa === 'identidade' && (
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Campo label="Nome da máquina" className="md:col-span-2">
                  <input value={b.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex.: UPAR AI Atlas 191" className={input} autoFocus />
                </Campo>
                <Campo label="Chamada curta" hint="Uma frase. Aparece no card e no topo da página." className="md:col-span-2">
                  <input value={b.tagline} onChange={(e) => set('tagline', e.target.value)} maxLength={140} placeholder="Ex.: 48 GB de VRAM profissional em um equipamento expansível." className={input} />
                </Campo>
              </div>
              <Campo label="Formato">
                <Cartoes
                  valor={b.formFactor}
                  onChange={(v) => set('formFactor', v)}
                  opcoes={[
                    { value: 'workstation', label: formFactorLabel.workstation, icon: 'cpu', description: 'Torre de alto desempenho para uso profissional.' },
                    { value: 'desktop', label: formFactorLabel.desktop, icon: 'cube', description: 'Formato de mesa, mais compacto.' },
                    { value: 'server', label: formFactorLabel.server, icon: 'server', description: 'Rack ou torre para vários usuários.' },
                  ]}
                />
              </Campo>
              <Campo label="Aplicações recomendadas" hint="Escolha as que essa máquina atende bem. Alimentam os filtros do catálogo.">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {applications.map((app) => {
                    const ativo = b.applications.includes(app.slug)
                    return (
                      <button
                        key={app.slug}
                        type="button"
                        onClick={() => set('applications', ativo ? b.applications.filter((s) => s !== app.slug) : [...b.applications, app.slug])}
                        aria-pressed={ativo}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                          ativo ? 'border-brand-500 bg-brand-500/12 text-white' : 'border-ink-700/70 bg-ink-900/50 text-ink-200 hover:border-ink-500',
                        )}
                      >
                        <Icon name={app.icon as IconName} className={cn('size-4 shrink-0', ativo ? 'text-brand-300' : 'text-ink-400')} />
                        <span className="truncate">{app.name}</span>
                        {ativo && <Icon name="check" className="ml-auto size-4 shrink-0 text-brand-300" />}
                      </button>
                    )
                  })}
                </div>
              </Campo>
            </div>
          )}

          {etapa === 'cpu' && (
            <div className="flex flex-col gap-5">
              <Campo label="Fabricante">
                <Cartoes colunas={2} valor={b.cpuVendor} onChange={(v) => set('cpuVendor', v)} opcoes={[{ value: 'AMD', label: 'AMD', icon: 'cpu', description: 'Ryzen, Threadripper, EPYC' }, { value: 'Intel', label: 'Intel', icon: 'cpu', description: 'Core, Xeon' }]} />
              </Campo>
              <Campo label="Modelo" hint="Só o nome. Ex.: Ryzen Threadripper PRO 7975WX.">
                <input list="cpus-cadastradas" value={b.cpuModel} onChange={(e) => set('cpuModel', e.target.value)} maxLength={60} placeholder="Digite ou escolha um já cadastrado" className={input} />
                <datalist id="cpus-cadastradas">{sugestoes.cpus.map((c) => <option key={c} value={c} />)}</datalist>
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Núcleos">
                  <Contador valor={b.cpuCores} onChange={(v) => set('cpuCores', v)} min={2} max={192} />
                </Campo>
                <Campo label="Threads" hint="Em geral o dobro dos núcleos.">
                  <div className="flex items-center gap-2">
                    <Contador valor={b.cpuThreads} onChange={(v) => set('cpuThreads', v)} min={2} max={384} />
                    <button type="button" onClick={() => set('cpuThreads', b.cpuCores * 2)} className="text-xs text-flux-300 underline underline-offset-2 hover:text-flux-200">
                      2× núcleos
                    </button>
                  </div>
                </Campo>
              </div>
            </div>
          )}

          {etapa === 'gpu' && (
            <div className="flex flex-col gap-5">
              <Campo label="Fabricante">
                <Cartoes valor={b.gpuVendor} onChange={(v) => set('gpuVendor', v)} opcoes={[{ value: 'NVIDIA', label: 'NVIDIA', icon: 'gpu', description: 'GeForce RTX, RTX Ada, L40S' }, { value: 'AMD', label: 'AMD', icon: 'gpu', description: 'Radeon, Instinct' }, { value: 'Intel', label: 'Intel', icon: 'gpu', description: 'Arc' }]} />
              </Campo>
              <Campo label="Modelo" hint="Só o nome do modelo, curto. Detalhe vai na observação.">
                <input list="gpus-cadastradas" value={b.gpuModel} onChange={(e) => set('gpuModel', e.target.value.slice(0, 40))} maxLength={40} placeholder="Ex.: RTX A6000" className={input} />
                <datalist id="gpus-cadastradas">{sugestoes.gpus.map((g) => <option key={g} value={g} />)}</datalist>
              </Campo>
              <Campo label="VRAM por placa">
                <Valores presets={VRAM_PRESETS} valor={b.gpuVram} onChange={(v) => set('gpuVram', v)} formatar={(v) => `${v} GB`} unidade="GB" />
              </Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Quantidade de placas">
                  <Contador valor={b.gpuQuantity} onChange={(v) => set('gpuQuantity', v)} min={1} max={8} />
                </Campo>
                <Campo label="Máximo que o chassi suporta">
                  <Contador valor={Math.max(b.maxGpus, b.gpuQuantity)} onChange={(v) => set('maxGpus', v)} min={b.gpuQuantity} max={8} />
                </Campo>
              </div>
              {totalVram > 0 && (
                <p className="rounded-lg border border-brand-500/30 bg-brand-500/8 px-4 py-2.5 text-sm text-brand-200">
                  VRAM total: <strong>{formatCapacity(totalVram)}</strong>{b.gpuQuantity > 1 ? ` (${b.gpuQuantity} × ${b.gpuVram} GB)` : ''}
                </p>
              )}
              <Campo label="Observação" hint="Opcional. Ex.: memória GDDR6 com ECC, refrigeração blower.">
                <input value={b.gpuNote} onChange={(e) => set('gpuNote', e.target.value.slice(0, 200))} maxLength={200} className={input} />
              </Campo>
            </div>
          )}

          {etapa === 'ram' && (
            <div className="flex flex-col gap-5">
              <Campo label="Capacidade">
                <Valores presets={RAM_PRESETS} valor={b.ramCapacity} onChange={(v) => set('ramCapacity', v)} formatar={(v) => formatCapacity(v)} unidade="GB" />
              </Campo>
              <Campo label="Tipo">
                <Textos presets={RAM_TYPES} valor={b.ramType} onChange={(v) => set('ramType', v)} placeholder="Ou digite" />
              </Campo>
              <Campo label="Expansão máxima" hint="Até quanto a placa-mãe aceita. Deixe 0 para não informar.">
                <Valores presets={[128, 256, 512, 1024, 2048]} valor={b.ramMax} onChange={(v) => set('ramMax', v)} formatar={(v) => formatCapacity(v)} unidade="GB" />
              </Campo>
            </div>
          )}

          {etapa === 'storage' && (
            <div className="flex flex-col gap-4">
              {b.storage.length === 0 && <p className="text-sm text-ink-400">Nenhum disco ainda. Adicione o primeiro abaixo.</p>}
              <ul className="flex flex-col gap-3">
                {b.storage.map((d, i) => (
                  <li key={i} className="grid gap-3 rounded-lg border border-ink-700/70 bg-ink-900/50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-end">
                    <Campo label="Tipo">
                      <div className="flex gap-1.5">
                        {(['NVMe', 'SSD SATA', 'HDD'] as const).map((k) => (
                          <button key={k} type="button" onClick={() => set('storage', b.storage.map((x, j) => (j === i ? { ...x, kind: k } : x)))} aria-pressed={d.kind === k} className={cn('h-10 rounded-lg border px-3 text-sm', d.kind === k ? 'border-brand-500 bg-brand-500/12 text-white' : 'border-ink-600/70 text-ink-200 hover:border-ink-500')}>
                            {k}
                          </button>
                        ))}
                      </div>
                    </Campo>
                    <Campo label="Capacidade">
                      <Valores presets={DRIVE_PRESETS} valor={d.capacityGb} onChange={(v) => set('storage', b.storage.map((x, j) => (j === i ? { ...x, capacityGb: v } : x)))} formatar={(v) => formatCapacity(v)} unidade="GB" />
                    </Campo>
                    <button type="button" onClick={() => set('storage', b.storage.filter((_, j) => j !== i))} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-600/70 px-3 text-sm text-ink-300 hover:border-critical-500/60 hover:text-critical-500">
                      <Icon name="trash" className="size-4" />
                      Remover
                    </button>
                    <Campo label="Finalidade" hint="Opcional. Ex.: Sistema e modelos, Dados." className="sm:col-span-3">
                      <input value={d.purpose ?? ''} onChange={(e) => set('storage', b.storage.map((x, j) => (j === i ? { ...x, purpose: e.target.value || undefined } : x)))} className={input} />
                    </Campo>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => set('storage', [...b.storage, { kind: 'NVMe', capacityGb: 2000, purpose: b.storage.length === 0 ? 'Sistema e modelos' : undefined }])} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg border border-dashed border-brand-500/50 px-4 text-sm font-medium text-brand-200 hover:bg-brand-500/8">
                <Icon name="plus" className="size-4" />
                Adicionar disco
              </button>
              {totalDisco > 0 && <p className="text-sm text-ink-300">Total: <strong className="text-white">{formatCapacity(totalDisco)}</strong></p>}
            </div>
          )}

          {etapa === 'estrutura' && (
            <div className="flex flex-col gap-5">
              <Campo label="Refrigeração">
                <Textos presets={COOLING_PRESETS} valor={b.cooling} onChange={(v) => set('cooling', v)} placeholder="Ou descreva" />
              </Campo>
              <Campo label="Fonte de alimentação" hint="Potência e, se quiser, certificação. Ex.: 1600 W 80 Plus Platinum.">
                <Textos presets={PSU_PRESETS} valor={b.psu} onChange={(v) => set('psu', v)} placeholder="Ou descreva" />
              </Campo>
              <Campo label="Rede e conectividade">
                <Textos presets={NETWORK_PRESETS} valor={b.network} onChange={(v) => set('network', v)} placeholder="Ou descreva" />
              </Campo>
              <Campo label="Gabinete" hint="Opcional.">
                <input value={b.chassis} onChange={(e) => set('chassis', e.target.value)} placeholder="Ex.: Torre full, painel de vidro, filtros removíveis" className={input} />
              </Campo>
            </div>
          )}

          {etapa === 'extras' && (
            <div className="flex flex-col gap-5">
              <Campo label="Possibilidades de expansão" hint="Digite e aperte Enter. Ex.: Segunda placa de vídeo.">
                <Itens itens={b.expansion} onChange={(v) => set('expansion', v)} placeholder="Ex.: Memória até 256 GB" sugestoes={['Segunda placa de vídeo', 'Memória até 256 GB', 'Mais 2 discos NVMe', 'Placa de rede 10 GbE']} />
              </Campo>
              <Campo label="Serviços inclusos" hint="O que vai junto com a máquina.">
                <Itens itens={b.services} onChange={(v) => set('services', v)} placeholder="Ex.: Sistema e drivers instalados" sugestoes={['Montagem e testes de estabilidade', 'Sistema e drivers instalados', 'Ambiente de IA configurado', 'Suporte remoto pós-entrega']} />
              </Campo>
              <Campo label="Perfil de cliente" hint="Para quem é. Aparece em “Em resumo” na página do produto.">
                <input value={b.clientProfile} onChange={(e) => set('clientProfile', e.target.value)} placeholder="Ex.: Times de pesquisa que treinam modelos próprios" className={input} />
              </Campo>
            </div>
          )}

          {etapa === 'comercial' && (
            <div className="flex flex-col gap-5">
              <Campo label="Como mostrar o preço">
                <Cartoes
                  valor={b.priceMode}
                  onChange={(v) => set('priceMode', v)}
                  opcoes={[
                    { value: 'displayed', label: 'Preço exibido', description: 'Mostra o valor fechado.' },
                    { value: 'from', label: 'A partir de', description: 'Mostra o valor inicial.' },
                    { value: 'on_request', label: 'Sob consulta', description: 'Não mostra valor.' },
                  ]}
                />
              </Campo>
              {b.priceMode !== 'on_request' && (
                <Campo label="Valor (R$)">
                  <input type="number" min={0} step={100} value={b.priceBrl || ''} onChange={(e) => set('priceBrl', Number(e.target.value) || 0)} className={cn(input, 'max-w-xs')} />
                </Campo>
              )}
              <Campo label="Disponibilidade">
                <Cartoes colunas={4} valor={b.availability} onChange={(v) => set('availability', v)} opcoes={(['in_stock', 'made_to_order', 'pre_order', 'unavailable'] as const).map((v) => ({ value: v, label: availabilityLabel[v] }))} />
              </Campo>
              <div className="grid gap-4 md:grid-cols-2">
                <Campo label="Prazo informado" hint="Opcional. Ex.: Montagem em até 15 dias úteis.">
                  <input value={b.leadTime} onChange={(e) => set('leadTime', e.target.value)} className={input} />
                </Campo>
                <Campo label="Garantia específica" hint="Vazio usa a política geral (12 a 60 meses).">
                  <input value={b.warranty} onChange={(e) => set('warranty', e.target.value)} placeholder="Ex.: 36 meses" className={input} />
                </Campo>
              </div>
            </div>
          )}

          {etapa === 'publicacao' && (
            <div className="flex flex-col gap-5">
              <Campo label="Resumo comercial" hint="Dois ou três parágrafos curtos. Obrigatório para publicar.">
                <textarea value={b.summary} onChange={(e) => set('summary', e.target.value)} rows={4} className={area} />
              </Campo>
              <Campo label="Nível de desempenho" hint={`Sugestão pelo que foi montado: ${tierLabel[sugestao]}.`}>
                <Cartoes colunas={4} valor={b.performanceTier} onChange={(v) => set('performanceTier', v)} opcoes={(['essencial', 'avancado', 'profissional', 'extremo'] as const).map((v) => ({ value: v, label: tierLabel[v] }))} />
              </Campo>
              <Campo label="Situação">
                <Cartoes colunas={2} valor={b.status} onChange={(v) => set('status', v)} opcoes={[{ value: 'draft', label: 'Rascunho', description: 'Só o painel vê.' }, { value: 'published', label: 'Publicado', description: 'Aparece no catálogo.' }]} />
              </Campo>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {(
                  [
                    ['featured', 'Destacar na home'],
                    ['customizable', 'Permite personalização'],
                    ['isDemo', 'Dado demonstrativo'],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-ink-700/70 px-3 py-2.5 text-sm text-ink-200">
                    <input type="checkbox" checked={b[k]} onChange={(e) => set(k, e.target.checked)} className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500" />
                    {label}
                  </label>
                ))}
              </div>
              <details className="rounded-lg border border-ink-700/70 p-4">
                <summary className="cursor-pointer text-sm font-medium text-ink-200">SEO e endereço (opcional)</summary>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Campo label="Slug (URL)" hint="Vazio gera a partir do nome.">
                    <input value={b.slug} onChange={(e) => set('slug', e.target.value)} className={input} />
                  </Campo>
                  <Campo label="Título para SEO">
                    <input value={b.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} className={input} />
                  </Campo>
                  <Campo label="Descrição para SEO" className="md:col-span-2">
                    <input value={b.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} className={input} />
                  </Campo>
                </div>
              </details>
            </div>
          )}

          {falta[etapa].length > 0 && (
            <p className="mt-5 text-xs text-caution-500">Falta nesta etapa: {falta[etapa].join(', ')}.</p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-ink-700/60 pt-5">
            <button type="button" onClick={() => indice > 0 && irPara(STEPS[indice - 1].key)} disabled={indice === 0} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-600/70 px-3.5 text-sm text-ink-200 hover:border-ink-500 hover:text-white disabled:invisible">
              <Icon name="arrowLeft" className="size-4" />
              Anterior
            </button>
            {indice < STEPS.length - 1 ? (
              <button type="button" onClick={() => irPara(STEPS[indice + 1].key)} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-500 px-4 text-sm font-medium text-ink-950 hover:bg-brand-400">
                Próxima etapa
                <Icon name="arrowRight" className="size-4" />
              </button>
            ) : (
              <SubmitButton size="md">{b.status === 'published' ? 'Salvar e publicar' : 'Salvar rascunho'}</SubmitButton>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------- Resumo --------------------------------- */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Sua máquina</h2>
            <span className="text-xs text-ink-400">{concluidas}/{STEPS.length} etapas</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
            <div className="h-full rounded-full bg-linear-to-r from-brand-500 to-flux-400 transition-all duration-500" style={{ width: `${progresso}%` }} />
          </div>

          <p className="mt-4 truncate text-base font-semibold text-white">{b.name || 'Sem nome ainda'}</p>
          <p className="text-xs text-ink-400">{formFactorLabel[b.formFactor]} · {tierLabel[b.performanceTier]}</p>

          <dl className="mt-4 flex flex-col gap-2 text-sm">
            {(
              [
                ['cpu', 'Processador', b.cpuModel ? `${b.cpuModel} · ${b.cpuCores}C/${b.cpuThreads}T` : ''],
                ['gpu', 'Placa', b.gpuModel ? `${b.gpuQuantity > 1 ? `${b.gpuQuantity}× ` : ''}${b.gpuModel}` : ''],
                ['memory', 'VRAM', totalVram ? formatCapacity(totalVram) : ''],
                ['cpu', 'RAM', b.ramCapacity ? `${formatCapacity(b.ramCapacity)} ${b.ramType}` : ''],
                ['storage', 'Disco', totalDisco ? `${formatCapacity(totalDisco)} em ${b.storage.length} unidade${b.storage.length > 1 ? 's' : ''}` : ''],
                ['cooling', 'Refrigeração', b.cooling],
                ['power', 'Fonte', b.psu],
              ] as [IconName, string, string][]
            ).map(([icon, label, valor]) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon name={icon} className={cn('mt-0.5 size-4 shrink-0', valor ? 'text-brand-300' : 'text-ink-600')} />
                <div className="min-w-0">
                  <dt className="text-2xs tracking-[0.08em] text-ink-500 uppercase">{label}</dt>
                  <dd className={cn('truncate', valor ? 'text-ink-100' : 'text-ink-600')} title={valor || undefined}>{valor || '—'}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-ink-700/60 pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-400">Potência da montagem</span>
              <span className="font-medium text-brand-200">{tierLabel[sugestao]}</span>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className={cn('h-2 flex-1 rounded-sm transition-colors', i < nivel ? 'bg-brand-500' : 'bg-ink-800')} />
              ))}
            </div>
            {sugestao !== b.performanceTier && (
              <button type="button" onClick={() => set('performanceTier', sugestao)} className="mt-2 text-xs text-flux-300 underline underline-offset-2 hover:text-flux-200">
                Usar “{tierLabel[sugestao]}” como nível
              </button>
            )}
            <p className="mt-1.5 text-2xs text-ink-500">Estimativa interna, só para orientar o nível. Não aparece no site.</p>
          </div>

          {bloqueios.length > 0 ? (
            <p className={cn('mt-4 text-xs leading-relaxed', tentouSalvar ? 'text-critical-500' : 'text-ink-400')}>
              Para salvar falta: {bloqueios.join(', ')}.
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-brand-200">
              <Icon name="check" className="size-3.5" />
              Pronto para salvar
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <SubmitButton size="md" className="w-full">{b.status === 'published' ? 'Salvar e publicar' : 'Salvar rascunho'}</SubmitButton>
            <Link href="/admin/produtos" className="text-center text-xs text-ink-400 hover:text-white">Cancelar</Link>
            {product && (
              <Link href={`/produtos/${product.slug}`} target="_blank" className="text-center text-xs text-flux-300 hover:text-flux-200">
                Ver no site ↗
              </Link>
            )}
          </div>
        </div>
      </aside>
    </form>
  )
}
