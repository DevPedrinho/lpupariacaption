import type { Product } from './types'
import { totalStorageGb, totalVramGb } from './format'

export type FilterState = {
  aplicacao: string[]
  investimento: string[]
  fabricanteGpu: string[]
  modeloGpu: string[]
  vram: string[]
  ram: string[]
  processador: string[]
  armazenamento: string[]
  gpus: string[]
  formato: string[]
  desempenho: string[]
  disponibilidade: string[]
  busca: string
}

export const emptyFilters: FilterState = {
  aplicacao: [], investimento: [], fabricanteGpu: [], modeloGpu: [], vram: [], ram: [],
  processador: [], armazenamento: [], gpus: [], formato: [], desempenho: [],
  disponibilidade: [], busca: '',
}

export type FilterKey = Exclude<keyof FilterState, 'busca'>

export const BUDGET_BANDS: Record<string, { label: string; min: number; max: number }> = {
  'ate-25k': { label: 'Até R$ 25 mil', min: 0, max: 25_000 },
  '25-50k': { label: 'R$ 25 mil a R$ 50 mil', min: 25_000, max: 50_000 },
  '50-100k': { label: 'R$ 50 mil a R$ 100 mil', min: 50_000, max: 100_000 },
  'acima-100k': { label: 'Acima de R$ 100 mil', min: 100_000, max: Number.POSITIVE_INFINITY },
  consulta: { label: 'Sob consulta', min: -1, max: -1 },
}

const MIN_THRESHOLDS = {
  vram: [16, 24, 32, 48, 96, 192],
  ram: [32, 64, 96, 128, 256, 512],
  armazenamento: [1000, 2000, 4000, 8000, 16000],
} as const

export function vramOptions() {
  return MIN_THRESHOLDS.vram.map((value) => ({ value: String(value), label: `${value} GB ou mais` }))
}
export function ramOptions() {
  return MIN_THRESHOLDS.ram.map((value) => ({ value: String(value), label: `${value} GB ou mais` }))
}
export function storageOptions() {
  return MIN_THRESHOLDS.armazenamento.map((value) => ({
    value: String(value),
    label: `${value / 1000} TB ou mais`,
  }))
}

/** Aplica todos os filtros. Grupos diferentes se combinam com E, opções dentro do mesmo grupo com OU. */
export function applyFilters(products: Product[], filters: FilterState): Product[] {
  const term = filters.busca.trim().toLowerCase()

  return products.filter((product) => {
    if (filters.aplicacao.length && !filters.aplicacao.some((slug) => product.applications.includes(slug))) {
      return false
    }

    if (filters.investimento.length) {
      const isOnRequest = product.priceMode === 'on_request' || !product.priceBrl
      const matches = filters.investimento.some((key) => {
        const band = BUDGET_BANDS[key]
        if (!band) return false
        if (key === 'consulta') return isOnRequest
        if (isOnRequest) return false
        return product.priceBrl! >= band.min && product.priceBrl! < band.max
      })
      if (!matches) return false
    }

    if (filters.fabricanteGpu.length && !filters.fabricanteGpu.includes(product.gpu.vendor)) return false
    if (filters.modeloGpu.length && !filters.modeloGpu.includes(product.gpu.model)) return false

    if (filters.vram.length) {
      const total = totalVramGb(product)
      if (!filters.vram.some((value) => total >= Number(value))) return false
    }

    if (filters.ram.length && !filters.ram.some((value) => product.ram.capacityGb >= Number(value))) {
      return false
    }

    if (filters.armazenamento.length) {
      const total = totalStorageGb(product)
      if (!filters.armazenamento.some((value) => total >= Number(value))) return false
    }

    if (filters.processador.length) {
      const matches = filters.processador.some((value) => {
        if (value === 'amd' || value === 'intel') {
          return product.cpu.model.toLowerCase().includes(value)
        }
        return product.cpu.cores >= Number(value)
      })
      if (!matches) return false
    }

    if (filters.gpus.length) {
      const matches = filters.gpus.some((value) =>
        value === '4+' ? product.gpu.quantity >= 4 : product.gpu.quantity === Number(value),
      )
      if (!matches) return false
    }

    if (filters.formato.length && !filters.formato.includes(product.formFactor)) return false
    if (filters.desempenho.length && !filters.desempenho.includes(product.performanceTier)) return false
    if (filters.disponibilidade.length && !filters.disponibilidade.includes(product.availability)) return false

    if (term) {
      const haystack = [
        product.name, product.tagline, product.summary, product.cpu.model,
        product.gpu.model, product.clientProfile,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(term)) return false
    }

    return true
  })
}

export type SortKey = 'relevancia' | 'vram-desc' | 'vram-asc' | 'preco-asc' | 'nome'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevancia', label: 'Ordem sugerida' },
  { value: 'vram-desc', label: 'Mais VRAM primeiro' },
  { value: 'vram-asc', label: 'Menos VRAM primeiro' },
  { value: 'preco-asc', label: 'Menor investimento primeiro' },
  { value: 'nome', label: 'Nome (A–Z)' },
]

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const list = [...products]
  switch (key) {
    case 'vram-desc':
      return list.sort((a, b) => totalVramGb(b) - totalVramGb(a))
    case 'vram-asc':
      return list.sort((a, b) => totalVramGb(a) - totalVramGb(b))
    case 'preco-asc':
      return list.sort((a, b) => {
        const priceA = a.priceMode === 'on_request' || !a.priceBrl ? Number.POSITIVE_INFINITY : a.priceBrl
        const priceB = b.priceMode === 'on_request' || !b.priceBrl ? Number.POSITIVE_INFINITY : b.priceBrl
        return priceA - priceB
      })
    case 'nome':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    default:
      return list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || totalVramGb(a) - totalVramGb(b),
      )
  }
}

export function countActive(filters: FilterState): number {
  return (Object.keys(filters) as (keyof FilterState)[]).reduce((total, key) => {
    if (key === 'busca') return total + (filters.busca.trim() ? 1 : 0)
    return total + filters[key].length
  }, 0)
}
