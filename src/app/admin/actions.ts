'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { mensagemDeGravacao } from '@/lib/repository/erro'
import { buildExplainers } from '@/data/product-helpers'
import { TAMANHO_MAXIMO, TIPOS_ACEITOS, uploadDisponivel, uploadProductImage } from '@/lib/product-images'
import { midiaDisponivel, removeArticleImage, uploadArticleImage } from '@/lib/article-media'
import {
  DEFAULT_DIAGNOSTIC_QUESTIONS,
  OPTION_COUNT,
  QUESTION_COUNT,
  normalizeQuestions,
  validateQuestions,
} from '@/lib/diagnostic'
import type {
  Article, DiagnosticQuestion, ProductImage, Availability, FormFactor, GpuVendor, LeadStatus, PerformanceTier, PriceMode, Product,
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

/*
 * Toda gravação do painel passa por aqui.
 *
 * Sem a chave de serviço do Supabase, o RLS recusa a escrita — e uma action
 * que lança vira a página genérica de erro do servidor, sem dizer o motivo.
 * Aqui a recusa volta para a tela de origem como aviso legível.
 *
 * O `redirect` do Next funciona lançando; não é erro do Supabase, então
 * passa reto. Qualquer outro erro também sobe: não é para esconder defeito.
 */
async function gravando(destino: string, operacao: () => Promise<void>): Promise<void> {
  let mensagem: string | null = null
  try {
    await operacao()
  } catch (erro) {
    mensagem = mensagemDeGravacao(erro)
    if (!mensagem) throw erro
    console.error('[painel] gravação recusada:', erro)
  }
  if (mensagem) redirect(`${destino}?erro=${encodeURIComponent(mensagem)}`)
}

/* --------------------------------- Leads ---------------------------------- */

async function atualizarLead(formData: FormData): Promise<void> {
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

async function salvarProduto(formData: FormData): Promise<void> {
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
      model: text(formData, 'gpuModel').slice(0, 40),
      quantity: Math.max(1, number(formData, 'gpuQuantity', 1)),
      vramGb: number(formData, 'gpuVram'),
      ...(text(formData, 'gpuNote') ? { note: text(formData, 'gpuNote').slice(0, 200) } : {}),
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

async function duplicarProduto(formData: FormData): Promise<void> {
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

async function alternarStatusDoProduto(formData: FormData): Promise<void> {
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

async function removerProduto(formData: FormData): Promise<void> {
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

async function salvarArtigo(formData: FormData): Promise<void> {
  const session = await requireSession('conteudos')
  const repo = getRepository()

  const slug = slugify(text(formData, 'slug') || text(formData, 'title'))
  const existing = await repo.getArticle(slug)

  const article: Article = {
    slug,
    title: text(formData, 'title'),
    category: (text(formData, 'category') || 'Guia') as Article['category'],
    excerpt: text(formData, 'excerpt'),
    body: String(formData.get('body') ?? '').replace(/\r\n?/g, '\n'),
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

async function salvarConfiguracoes(formData: FormData): Promise<void> {
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

/* ------------------------- Formulário do diagnóstico ----------------------- */

/**
 * Lê os campos `q{i}.title`, `q{i}.help`, `q{i}.o{j}.label`, `q{i}.o{j}.weight`
 * e `q{i}.allowOther` do form. Um problema de preenchimento volta para a tela
 * como aviso, não como página de erro.
 */
async function salvarFormularioDoDiagnostico(formData: FormData): Promise<void> {
  const session = await requireSession('configuracoes')

  const questions: DiagnosticQuestion[] = Array.from({ length: QUESTION_COUNT }, (_, i) => ({
    title: text(formData, `q${i}.title`),
    help: text(formData, `q${i}.help`) || undefined,
    options: Array.from({ length: OPTION_COUNT }, (_, j) => ({
      label: text(formData, `q${i}.o${j}.label`),
      weight: (['0', '1', '2'].includes(text(formData, `q${i}.o${j}.weight`))
        ? Number(text(formData, `q${i}.o${j}.weight`))
        : 0) as 0 | 1 | 2,
    })),
    allowOther: formData.get(`q${i}.allowOther`) === 'on',
  }))

  const problemas = validateQuestions(questions)
  if (problemas.length > 0) {
    redirect(`/admin/formulario?erro=${encodeURIComponent(problemas.join(' '))}`)
  }

  const repo = getRepository()
  await repo.updateSettings({ diagnosticQuestions: normalizeQuestions(questions) })
  await repo.log({
    actor: session.email,
    action: 'formulario.atualizado',
    entity: 'diagnostico',
    detail: questions.map((q) => q.title).join(' · '),
  })

  revalidatePath('/encontre-sua-configuracao')
  redirect('/admin/formulario?salvo=1')
}

async function restaurarFormularioDoDiagnostico(): Promise<void> {
  const session = await requireSession('configuracoes')
  const repo = getRepository()
  await repo.updateSettings({ diagnosticQuestions: DEFAULT_DIAGNOSTIC_QUESTIONS })
  await repo.log({
    actor: session.email,
    action: 'formulario.restaurado',
    entity: 'diagnostico',
  })
  revalidatePath('/encontre-sua-configuracao')
  redirect('/admin/formulario?salvo=1')
}

/* ---------------------------- Imagens do produto --------------------------- */

async function produtoOuNada(id: string) {
  const repo = getRepository()
  const product = (await repo.listProducts({ includeDrafts: true })).find((item) => item.id === id)
  return { repo, product }
}

/**
 * Aceita arquivos (campo `files`, vários) e/ou uma URL (`url`). A legenda
 * (`alt`) vale para todos os arquivos do envio; quem quiser uma por foto
 * manda uma por vez. Fotos entram depois das existentes; a capa é a primeira.
 */
async function adicionarImagensDoProduto(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const id = text(formData, 'id')
  const { repo, product } = await produtoOuNada(id)
  if (!product) return

  const alt = text(formData, 'alt') || `Foto de ${product.name}`
  const novas: ProductImage[] = []
  const recusadas: string[] = []

  const url = text(formData, 'url')
  if (url) {
    if (/^https?:\/\//i.test(url)) novas.push({ render: 'tower-glass', alt, src: url })
    else recusadas.push('a URL precisa começar com http:// ou https://')
  }

  const arquivos = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (arquivos.length > 0 && !uploadDisponivel) {
    recusadas.push('envio de arquivo precisa da SUPABASE_SERVICE_ROLE_KEY; use o campo de URL')
  } else {
    for (const arquivo of arquivos.slice(0, 10)) {
      if (!TIPOS_ACEITOS.includes(arquivo.type)) {
        recusadas.push(`${arquivo.name}: use JPG, PNG, WebP ou AVIF`)
        continue
      }
      if (arquivo.size > TAMANHO_MAXIMO) {
        recusadas.push(`${arquivo.name}: acima de 8 MB`)
        continue
      }
      const src = await uploadProductImage(product.id, arquivo)
      if (src) novas.push({ render: 'tower-glass', alt, src })
      else recusadas.push(`${arquivo.name}: o envio falhou`)
    }
  }

  if (novas.length > 0) {
    await repo.upsertProduct({ ...product, images: [...product.images, ...novas], updatedAt: new Date().toISOString() })
    await repo.log({
      actor: session.email,
      action: 'produto.imagens.adicionadas',
      entity: `produto:${product.slug}`,
      detail: `${novas.length} imagem(ns)`,
    })
    revalidatePath(`/produtos/${product.slug}`)
    revalidatePath('/catalogo')
    revalidatePath('/')
  }

  if (recusadas.length > 0) {
    redirect(`/admin/produtos/${id}?erro=${encodeURIComponent(recusadas.join('; '))}`)
  }
  redirect(`/admin/produtos/${id}?salvo=imagens`)
}

async function removerImagemDoProduto(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const id = text(formData, 'id')
  const index = number(formData, 'index', -1)
  const { repo, product } = await produtoOuNada(id)
  if (!product || index < 0 || index >= product.images.length) return

  const images = product.images.filter((_, i) => i !== index)
  // Um produto sem imagem nenhuma perde o render do catálogo; deixa a ilustração.
  if (images.length === 0) images.push({ render: 'tower-glass', alt: product.name })

  await repo.upsertProduct({ ...product, images, updatedAt: new Date().toISOString() })
  await repo.log({ actor: session.email, action: 'produto.imagem.removida', entity: `produto:${product.slug}` })
  revalidatePath(`/produtos/${product.slug}`)
  revalidatePath('/catalogo')
  revalidatePath('/')
  redirect(`/admin/produtos/${id}?salvo=imagens`)
}

async function definirCapaDoProduto(formData: FormData): Promise<void> {
  const session = await requireSession('produtos')
  const id = text(formData, 'id')
  const index = number(formData, 'index', -1)
  const { repo, product } = await produtoOuNada(id)
  if (!product || index <= 0 || index >= product.images.length) return

  const images = [product.images[index], ...product.images.filter((_, i) => i !== index)]
  await repo.upsertProduct({ ...product, images, updatedAt: new Date().toISOString() })
  await repo.log({ actor: session.email, action: 'produto.capa.definida', entity: `produto:${product.slug}` })
  revalidatePath(`/produtos/${product.slug}`)
  revalidatePath('/catalogo')
  revalidatePath('/')
  redirect(`/admin/produtos/${id}?salvo=imagens`)
}

/* ---------------------------- Mídia dos conteúdos -------------------------- */

async function enviarMidiaDoArtigo(formData: FormData): Promise<void> {
  const session = await requireSession('conteudos')
  const slug = slugify(text(formData, 'slug'))
  if (!slug) return
  if (!midiaDisponivel) {
    redirect(`/admin/conteudos/${slug}?erro=${encodeURIComponent('O envio de imagens precisa da SUPABASE_SERVICE_ROLE_KEY.')}`)
  }

  const arquivos = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  let enviadas = 0
  const recusadas: string[] = []
  for (const arquivo of arquivos.slice(0, 10)) {
    const url = await uploadArticleImage(slug, arquivo)
    if (url) enviadas += 1
    else recusadas.push(`${arquivo.name}: use JPG, PNG, WebP ou GIF até 8 MB`)
  }

  if (enviadas > 0) {
    await getRepository().log({
      actor: session.email,
      action: 'artigo.imagens.enviadas',
      entity: `artigo:${slug}`,
      detail: `${enviadas} imagem(ns)`,
    })
  }
  if (recusadas.length > 0) {
    redirect(`/admin/conteudos/${slug}?erro=${encodeURIComponent(recusadas.join('; '))}`)
  }
  redirect(`/admin/conteudos/${slug}?salvo=midia`)
}

async function removerMidiaDoArtigo(formData: FormData): Promise<void> {
  const session = await requireSession('conteudos')
  const slug = slugify(text(formData, 'slug'))
  const name = text(formData, 'name')
  if (!slug || !name) return
  const ok = await removeArticleImage(slug, name)
  if (ok) {
    await getRepository().log({ actor: session.email, action: 'artigo.imagem.removida', entity: `artigo:${slug}`, detail: name })
  }
  redirect(`/admin/conteudos/${slug}?salvo=midia`)
}

/* ------------------------- Actions expostas aos forms ------------------------- */

export async function updateLead(formData: FormData): Promise<void> {
  return gravando('/admin/leads', () => atualizarLead(formData))
}
export async function saveProduct(formData: FormData): Promise<void> {
  return gravando('/admin/produtos', () => salvarProduto(formData))
}
export async function duplicateProduct(formData: FormData): Promise<void> {
  return gravando('/admin/produtos', () => duplicarProduto(formData))
}
export async function toggleProductStatus(formData: FormData): Promise<void> {
  return gravando('/admin/produtos', () => alternarStatusDoProduto(formData))
}
export async function removeProduct(formData: FormData): Promise<void> {
  return gravando('/admin/produtos', () => removerProduto(formData))
}
export async function saveArticle(formData: FormData): Promise<void> {
  return gravando('/admin/conteudos', () => salvarArtigo(formData))
}
export async function saveSettings(formData: FormData): Promise<void> {
  return gravando('/admin/configuracoes', () => salvarConfiguracoes(formData))
}
export async function saveDiagnosticForm(formData: FormData): Promise<void> {
  return gravando('/admin/formulario', () => salvarFormularioDoDiagnostico(formData))
}
export async function restoreDiagnosticForm(): Promise<void> {
  return gravando('/admin/formulario', () => restaurarFormularioDoDiagnostico())
}
export async function addProductImages(formData: FormData): Promise<void> {
  return gravando(`/admin/produtos/${text(formData, 'id')}`, () => adicionarImagensDoProduto(formData))
}
export async function removeProductImage(formData: FormData): Promise<void> {
  return gravando(`/admin/produtos/${text(formData, 'id')}`, () => removerImagemDoProduto(formData))
}
export async function setProductCover(formData: FormData): Promise<void> {
  return gravando(`/admin/produtos/${text(formData, 'id')}`, () => definirCapaDoProduto(formData))
}
export async function uploadArticleMedia(formData: FormData): Promise<void> {
  return gravando(`/admin/conteudos/${slugify(text(formData, 'slug'))}`, () => enviarMidiaDoArtigo(formData))
}
export async function removeArticleMedia(formData: FormData): Promise<void> {
  return gravando(`/admin/conteudos/${slugify(text(formData, 'slug'))}`, () => removerMidiaDoArtigo(formData))
}
