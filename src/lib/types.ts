/* ============================================================================
   UPAR AI — Modelo de domínio
   Todos os textos comerciais e especificações vêm destes tipos, para que o
   painel administrativo possa editá-los sem tocar em código.
   ========================================================================== */

export type PriceMode = 'displayed' | 'from' | 'on_request'
export type Availability = 'in_stock' | 'made_to_order' | 'pre_order' | 'unavailable'
export type FormFactor = 'workstation' | 'desktop' | 'server'
export type PerformanceTier = 'essencial' | 'avancado' | 'profissional' | 'extremo'
export type GpuVendor = 'NVIDIA' | 'AMD' | 'Intel'
export type PublishStatus = 'published' | 'draft'

export interface ProductImage {
  /** Identificador do render vetorial usado enquanto não há fotografia real. */
  render: 'tower-glass' | 'tower-mesh' | 'rack-2u' | 'desktop-compact' | 'component-gpu' | 'component-board'
  alt: string
  caption?: string
  /** Preenchido pelo painel quando houver fotografia real (Supabase Storage). */
  src?: string
}

export interface CpuSpec {
  model: string
  cores: number
  threads: number
  note?: string
}

export interface GpuSpec {
  vendor: GpuVendor
  model: string
  quantity: number
  vramGb: number
  note?: string
}

export interface RamSpec {
  capacityGb: number
  type: string
  slotsUsed?: number
  slotsTotal?: number
  maxGb?: number
}

export interface StorageDrive {
  kind: 'NVMe' | 'SSD SATA' | 'HDD'
  capacityGb: number
  purpose?: string
}

export interface Explainer {
  icon:
    | 'cpu' | 'gpu' | 'memory' | 'storage' | 'cooling' | 'power' | 'network' | 'upgrade'
  title: string
  /** O que está instalado nesta máquina. */
  spec: string
  /** Por que isso importa para a aplicação do cliente, em linguagem acessível. */
  role: string
}

export interface Capability {
  icon: 'brain' | 'image' | 'video' | 'chart' | 'layers' | 'eye' | 'cube' | 'code' | 'server'
  title: string
  description: string
}

/**
 * Benchmarks só aparecem no site quando cadastrados E marcados como validados
 * pela equipe da UPAR. Nunca são gerados automaticamente.
 */
export interface Benchmark {
  label: string
  value: string
  context?: string
  source: string
  validated: boolean
  measuredAt?: string
}

export interface Highlight {
  title: string
  description: string
}

export interface Product {
  id: string
  slug: string
  name: string
  formFactor: FormFactor
  performanceTier: PerformanceTier
  tagline: string
  summary: string
  /** Slugs de `Application`. */
  applications: string[]
  clientProfile: string

  cpu: CpuSpec
  gpu: GpuSpec
  maxGpus: number
  ram: RamSpec
  storage: StorageDrive[]
  cooling: string
  psu: string
  network: string
  chassis?: string

  expansion: string[]
  highlights: Highlight[]
  explainers: Explainer[]
  capabilities: Capability[]
  benchmarks: Benchmark[]

  priceMode: PriceMode
  priceBrl?: number
  availability: Availability
  leadTime?: string
  warranty?: string
  services: string[]

  customizable: boolean
  images: ProductImage[]
  relatedSlugs: string[]

  status: PublishStatus
  featured: boolean
  /** Conteúdo demonstrativo — deve ser substituído por dados reais da UPAR. */
  isDemo: boolean
  seoTitle?: string
  seoDescription?: string
  updatedAt: string
}

export interface ApplicationComponentWeight {
  component: 'GPU' | 'VRAM' | 'CPU' | 'RAM' | 'Armazenamento' | 'Rede'
  /** 1 a 5 — peso relativo do componente para esta aplicação. */
  weight: number
  why: string
}

export interface Application {
  slug: string
  name: string
  icon: Capability['icon'] | 'flask' | 'bolt' | 'users'
  short: string
  intro: string
  whoFor: string[]
  challenges: { title: string; description: string }[]
  components: ApplicationComponentWeight[]
  recommendedTiers: PerformanceTier[]
  expansion: string[]
  status: PublishStatus
  order: number
  seoTitle?: string
  seoDescription?: string
}

export interface Article {
  slug: string
  title: string
  category: 'Guia' | 'Comparativo' | 'IA local' | 'Estudo de caso' | 'Glossário' | 'Empresas'
  excerpt: string
  /** Markdown simplificado (##, ###, parágrafos, listas). */
  body: string
  readingMinutes: number
  author: string
  publishedAt: string
  status: PublishStatus
  isDemo: boolean
  seoTitle?: string
  seoDescription?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  organization: string
  segment: string
  status: PublishStatus
  isDemo: boolean
}

export interface Faq {
  id: string
  question: string
  answer: string
  scope: 'home' | 'produto' | 'consultoria' | 'geral'
  order: number
  status: PublishStatus
}

export interface CategoryComparison {
  tier: PerformanceTier
  name: string
  positioning: string
  typicalGpu: string
  typicalVram: string
  typicalRam: string
  bestFor: string
  notFor: string
}

/* ---------------------------------- Leads --------------------------------- */

export type LeadStatus =
  | 'novo'
  | 'aguardando_contato'
  | 'em_atendimento'
  | 'qualificado'
  | 'orcamento_enviado'
  | 'negociacao'
  | 'venda_concluida'
  | 'perdido'

export type LeadOrigin = 'diagnostico' | 'produto' | 'comparador' | 'contato' | 'consultoria' | 'catalogo'

export interface DiagnosticAnswers {
  application?: string
  tools?: string
  localExecution?: string
  workloadType?: string
  users?: string
  dataVolume?: string
  budget?: string
  expansion?: string
  deadline?: string
  buyerType?: string
}

export interface Lead {
  id: string
  createdAt: string
  name: string
  company?: string
  phone: string
  email?: string
  city?: string
  state?: string
  application?: string
  productSlug?: string
  comparedSlugs?: string[]
  diagnostic?: DiagnosticAnswers
  recommendedTier?: PerformanceTier
  budgetRange?: string
  purchaseWindow?: string
  origin: LeadOrigin
  originPath?: string
  utm?: Record<string, string>
  message?: string
  status: LeadStatus
  owner?: string
  notes?: string
}

/* -------------------------- Usuários e auditoria --------------------------- */

export type AdminRole = 'administrador' | 'gestor_comercial' | 'editor_conteudo' | 'consultor_vendas'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  active: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  at: string
  actor: string
  action: string
  entity: string
  detail?: string
}

/* ------------------------------ Configurações ------------------------------ */

export interface SiteSettings {
  whatsappNumber: string
  whatsappGreeting: string
  companyName: string
  legalName?: string
  cnpj?: string
  email?: string
  phone?: string
  addressLine?: string
  city?: string
  state?: string
  businessHours?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  aboutHistory: string
  aboutStructure: string
  aboutExpertise: string
  warrantyPolicy: string
  seoTitle: string
  seoDescription: string
  ga4Id?: string
  gtmId?: string
  metaPixelId?: string
  googleAdsId?: string
  /** Campos que ainda aguardam informação real da UPAR. */
  pendingRealData: string[]
}
