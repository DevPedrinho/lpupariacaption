import type { Availability, FormFactor, LeadStatus, PerformanceTier, PriceMode, Product } from './types'

export const tierLabel: Record<PerformanceTier, string> = {
  essencial: 'Essencial',
  avancado: 'Avançado',
  profissional: 'Profissional',
  extremo: 'Extremo',
}

/** Posição relativa na linha — não é medição de desempenho. */
export const tierRank: Record<PerformanceTier, number> = {
  essencial: 1,
  avancado: 2,
  profissional: 3,
  extremo: 4,
}

export const formFactorLabel: Record<FormFactor, string> = {
  workstation: 'Workstation',
  desktop: 'Desktop',
  server: 'Servidor',
}

export const availabilityLabel: Record<Availability, string> = {
  in_stock: 'Pronta entrega',
  made_to_order: 'Montagem sob encomenda',
  pre_order: 'Sob encomenda',
  unavailable: 'Indisponível no momento',
}

export const leadStatusLabel: Record<LeadStatus, string> = {
  novo: 'Novo lead',
  aguardando_contato: 'Aguardando contato',
  em_atendimento: 'Em atendimento',
  qualificado: 'Qualificado',
  orcamento_enviado: 'Orçamento enviado',
  negociacao: 'Negociação',
  venda_concluida: 'Venda concluída',
  perdido: 'Perdido',
}

export const leadStatusOrder: LeadStatus[] = [
  'novo', 'aguardando_contato', 'em_atendimento', 'qualificado',
  'orcamento_enviado', 'negociacao', 'venda_concluida', 'perdido',
]

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function formatPrice(mode: PriceMode, value?: number): string {
  if (mode === 'on_request' || !value || value <= 0) return 'Sob consulta'
  if (mode === 'from') return `A partir de ${brl.format(value)}`
  return brl.format(value)
}

export function formatCapacity(gb: number): string {
  if (gb >= 1000) {
    const tb = gb / 1000
    return `${Number.isInteger(tb) ? tb : tb.toFixed(1).replace('.', ',')} TB`
  }
  return `${gb} GB`
}

export function totalStorageGb(product: Product): number {
  return product.storage.reduce((sum, drive) => sum + drive.capacityGb, 0)
}

export function storageSummary(product: Product): string {
  return product.storage.map((d) => `${formatCapacity(d.capacityGb)} ${d.kind}`).join(' + ')
}

export function totalVramGb(product: Product): number {
  return product.gpu.vramGb * product.gpu.quantity
}

export function gpuSummary(product: Product): string {
  return product.gpu.quantity > 1 ? `${product.gpu.quantity}× ${product.gpu.model}` : product.gpu.model
}

export function vramSummary(product: Product): string {
  return product.gpu.quantity > 1
    ? `${formatCapacity(totalVramGb(product))} (${product.gpu.quantity} × ${formatCapacity(product.gpu.vramGb)})`
    : formatCapacity(product.gpu.vramGb)
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}
