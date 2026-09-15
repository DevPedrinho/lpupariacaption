'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { buildExplainers } from '@/data/product-helpers'
import type {
  Article, Availability, FormFactor, GpuVendor, LeadStatus, PerformanceTier, PriceMode, Product,
  PublishStatus, SiteSettings, StorageDrive,
} from '@/lib/types'

export type ActionState = { error?: string; success?: string }

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}
function number(formData: FormData, key: string, fallback = 0): number {
  const value = Number(formData.get(key))
  return Number.isFinite(value) ? value : fallback
}
function lines(formData: FormData, key: string): string[] {
  return text(formData, key)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* --------------------------------- Leads ---------------------------------- */

export async function updateLead(formData: FormData): Promise<void> {
  const session = await requireSession('leads')
  const id = text(formData, 'id')
  const status = text(formData, 'status') as LeadStatus
  const owner = text(formData, 'owner')
  const notes = text(formData, 'notes')

  const repo = getRepository()
  const updated = await repo.updateLead(id, {
    status,
    owner: owner || undefined,
    ...(formData.has('notes') ? { notes: notes || undefined } : {}),
  })

  if (updated) {
    await repo.log({
      actor: session.email,
      action: 'lead.updated',
      entity: `lead:${id}`,
      detail: `Status: ${status}${owner ? ` · Consultor: ${owner}` : ''}`,
    })
  }
  revalidatePath('/admin/leads')
  revalidatePath('/admin')
}

/* -------------------------------- Produtos -------------------------------- */

function parseStorage(formData: FormData): StorageDrive[] {
  const drives: StorageDrive[] = []
  for (const line of lines(formData, 'storage')) {
    // Formato esperado: "NVMe | 2000 | Sistema e modelos"
    const [kind, capacity, purpose] = line.split('|').map((part) => part.trim())
    const capacityGb = Number(capacity)
    if (!kind || !Number.isFinite(capacityGb)) continue
    const normalized: StorageDrive['kind'] =
      kind === 'NVMe' || kind === 'SSD SATA' || kind === 'HDD' ? kind : 'NVMe'
    drives.push({ kind: normalized, capacityGb, ...(purpose ? { purpose } : {}) })
  }
  return drives
}

export async function saveProduct(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const repo = getRepository()

  const id = text(formData, 'id') || `p-${slugify(text(formData, 'name')) || Date.now().toString(36)}`
  const existing = await repo.listProducts({ includeDrafts: true }).then((list) => list.find((p) => p.id === id))

  const storage = parseStorage(formData)
  const base = {
    cpu: {
      model: text(formData, 'cpuModel'),
      cores: number(formData, 'cpuCores'),
      threads: number(formData, 'cpuThreads'),
    },
    gpu: {
      vendor: (text(formData, 'gpuVendor') || 'NVIDIA') as GpuVendor,
      model: text(formData, 'gpuModel'),
      quantity: Math.max(1, number(formData, 'gpuQuantity', 1)),
      vramGb: number(formData, 'gpuVram'),
    },
    ram: {
      capacityGb: number(formData, 'ramCapacity'),
      type: text(formData, 'ramType') || 'DDR5',
      maxGb: number(formData, 'ramMax') || undefined,
    },
    storage: storage.length > 0 ? storage : [{ kind: 'NVMe' as const, capacityGb: 1000 }],
    cooling: text(formData, 'cooling'),
    psu: text(formData, 'psu'),
    network: text(formData, 'network'),
    maxGpus: Math.max(1, number(formData, 'maxGpus', 1)),
    expansion: lines(formData, 'expansion'),
  }

  const product: Product = {
    ...(existing ?? ({} as Product)),
    ...base,
    id,
    slug: slugify(text(formData, 'slug') || text(formData, 'name')),
    name: text(formData, 'name'),
    formFactor: (text(formData, 'formFactor') || 'workstation') as FormFactor,
    performanceTier: (text(formData, 'performanceTier') || 'avancado') as PerformanceTier,
    tagline: text(formData, 'tagline'),
    summary: text(formData, 'summary'),
    applications: formData.getAll('applications').map(String),
    clientProfile: text(formData, 'clientProfile'),
    chassis: text(formData, 'chassis') || undefined,
    highlights: existing?.highlights ?? [],
    explainers: buildExplainers(base),
    capabilities: existing?.capabilities ?? [],
    benchmarks: existing?.benchmarks ?? [],
    priceMode: (text(formData, 'priceMode') || 'on_request') as PriceMode,
    priceBrl: number(formData, 'priceBrl') || undefined,
    availability: (text(formData, 'availability') || 'made_to_order') as Availability,
    leadTime: text(formData, 'leadTime') || undefined,
    warranty: text(formData, 'warranty') || undefined,
    services: lines(formData, 'services'),
    customizable: formData.get('customizable') === 'on',
    images: existing?.images ?? [{ render: 'tower-glass', alt: text(formData, 'name') }],
    relatedSlugs: existing?.relatedSlugs ?? [],
    status: (text(formData, 'status') || 'draft') as PublishStatus,
    featured: formData.get('featured') === 'on',
    isDemo: formData.get('isDemo') === 'on',
    seoTitle: text(formData, 'seoTitle') || undefined,
    seoDescription: text(formData, 'seoDescription') || undefined,
    updatedAt: new Date().toISOString(),
  }

  await repo.upsertProduct(product)
  await repo.log({
    actor: session.email,
    action: existing ? 'produto.atualizado' : 'produto.criado',
    entity: `produto:${product.slug}`,
    detail: product.name,
  })

  revalidatePath('/admin/produtos')
  revalidatePath('/catalogo')
  revalidatePath(`/produtos/${product.slug}`)
  redirect('/admin/produtos?salvo=1')
}

export async function duplicateProduct(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const repo = getRepository()
  const id = text(formData, 'id')
  const source = (await repo.listProducts({ includeDrafts: true })).find((product) => product.id === id)
  if (!source) return

  const suffix = Date.now().toString(36).slice(-4)
  const copy: Product = {
    ...structuredClone(source),
    id: `${source.id}-copia-${suffix}`,
    slug: `${source.slug}-copia-${suffix}`,
    name: `${source.name} (cópia)`,
    status: 'draft',
    featured: false,
    updatedAt: new Date().toISOString(),
  }

  await repo.upsertProduct(copy)
  await repo.log({
    actor: session.email,
    action: 'produto.duplicado',
    entity: `produto:${copy.slug}`,
    detail: `Origem: ${source.name}`,
  })
  revalidatePath('/admin/produtos')
}

export async function toggleProductStatus(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const repo = getRepository()
  const id = text(formData, 'id')
  const product = (await repo.listProducts({ includeDrafts: true })).find((item) => item.id === id)
  if (!product) return

  const status: PublishStatus = product.status === 'published' ? 'draft' : 'published'
  await repo.upsertProduct({ ...product, status })
  await repo.log({
    actor: session.email,
    action: status === 'published' ? 'produto.publicado' : 'produto.despublicado',
    entity: `produto:${product.slug}`,
    detail: product.name,
  })
  revalidatePath('/admin/produtos')
  revalidatePath('/catalogo')
}

export async function removeProduct(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const repo = getRepository()
  const id = text(formData, 'id')
  const product = (await repo.listProducts({ includeDrafts: true })).find((item) => item.id === id)
  await repo.deleteProduct(id)
  await repo.log({
    actor: session.email,
    action: 'produto.removido',
    entity: `produto:${product?.slug ?? id}`,
    detail: product?.name,
  })
  revalidatePath('/admin/produtos')
  revalidatePath('/catalogo')
}

/* ------------------------------- Conteúdos -------------------------------- */

export async function saveArticle(formData: FormData): Promise<void> {
  const session = await requireSession('conteudos')
  const repo = getRepository()

  const slug = slugify(text(formData, 'slug') || text(formData, 'title'))
  const existing = await repo.getArticle(slug)

  const article: Article = {
    slug,
    title: text(formData, 'title'),
    category: (text(formData, 'category') || 'Guia') as Article['category'],
    excerpt: text(formData, 'excerpt'),
    body: String(formData.get('body') ?? ''),
    readingMinutes: number(formData, 'readingMinutes', 5),
    author: text(formData, 'author') || 'Equipe UPAR',
    publishedAt: text(formData, 'publishedAt') || new Date().toISOString().slice(0, 10),
    status: (text(formData, 'status') || 'draft') as PublishStatus,
    isDemo: formData.get('isDemo') === 'on',
    seoTitle: text(formData, 'seoTitle') || undefined,
    seoDescription: text(formData, 'seoDescription') || undefined,
  }

  await repo.upsertArticle(article)
  await repo.log({
    actor: session.email,
    action: existing ? 'artigo.atualizado' : 'artigo.criado',
    entity: `artigo:${slug}`,
    detail: article.title,
  })

  revalidatePath('/admin/conteudos')
  revalidatePath('/conteudos')
  revalidatePath(`/conteudos/${slug}`)
  redirect('/admin/conteudos?salvo=1')
}

/* ------------------------------ Configurações ------------------------------ */

export async function saveSettings(formData: FormData): Promise<void> {
  const session = await requireSession('configuracoes')
  const repo = getRepository()

  const patch: Partial<SiteSettings> = {
    whatsappNumber: text(formData, 'whatsappNumber'),
    whatsappGreeting: text(formData, 'whatsappGreeting'),
    companyName: text(formData, 'companyName'),
    legalName: text(formData, 'legalName'),
    cnpj: text(formData, 'cnpj'),
    email: text(formData, 'email'),
    phone: text(formData, 'phone'),
    addressLine: text(formData, 'addressLine'),
    city: text(formData, 'city'),
    state: text(formData, 'state'),
    businessHours: text(formData, 'businessHours'),
    instagram: text(formData, 'instagram'),
    linkedin: text(formData, 'linkedin'),
    youtube: text(formData, 'youtube'),
    heroTitle: text(formData, 'heroTitle'),
    heroSubtitle: text(formData, 'heroSubtitle'),
    heroBadge: text(formData, 'heroBadge'),
    consultantPhotoUrl: text(formData, 'consultantPhotoUrl'),
    consultantName: text(formData, 'consultantName'),
    consultantRole: text(formData, 'consultantRole'),
    aboutHistory: text(formData, 'aboutHistory'),
    aboutStructure: text(formData, 'aboutStructure'),
    aboutExpertise: text(formData, 'aboutExpertise'),
    warrantyPolicy: text(formData, 'warrantyPolicy'),
    seoTitle: text(formData, 'seoTitle'),
    seoDescription: text(formData, 'seoDescription'),
    ga4Id: text(formData, 'ga4Id'),
    gtmId: text(formData, 'gtmId'),
    metaPixelId: text(formData, 'metaPixelId'),
    googleAdsId: text(formData, 'googleAdsId'),
    pendingRealData: lines(formData, 'pendingRealData'),
  }

  await repo.updateSettings(patch)
  await repo.log({
    actor: session.email,
    action: 'configuracoes.atualizadas',
    entity: 'site',
    detail: `WhatsApp: ${patch.whatsappNumber}`,
  })

  revalidatePath('/', 'layout')
  redirect('/admin/configuracoes?salvo=1')
}
