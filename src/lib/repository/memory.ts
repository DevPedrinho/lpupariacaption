import { applications } from '@/data/applications'
import { adminUsers, articles, defaultSettings, faqs, initialAuditLogs, testimonials } from '@/data/content'
import { demoLeads } from '@/data/leads'
import { products } from '@/data/products'
import type {
  AdminUser, Application, Article, AuditLog, Faq, Lead, Product, SiteSettings, Testimonial,
} from '@/lib/types'
import type { ProductQuery, Repository } from './types'

type Db = {
  products: Product[]
  applications: Application[]
  articles: Article[]
  testimonials: Testimonial[]
  faqs: Faq[]
  leads: Lead[]
  settings: SiteSettings
  users: AdminUser[]
  logs: AuditLog[]
}

/**
 * Estado em memória preservado entre recargas do servidor de desenvolvimento.
 * Em produção com Supabase configurado esta implementação não é usada.
 */
const globalStore = globalThis as unknown as { __uparDb?: Db }

function createDb(): Db {
  return {
    products: structuredClone(products),
    applications: structuredClone(applications),
    articles: structuredClone(articles),
    testimonials: structuredClone(testimonials),
    faqs: structuredClone(faqs),
    leads: structuredClone(demoLeads),
    settings: structuredClone(defaultSettings),
    users: structuredClone(adminUsers),
    logs: structuredClone(initialAuditLogs),
  }
}

function db(): Db {
  if (!globalStore.__uparDb) globalStore.__uparDb = createDb()
  return globalStore.__uparDb
}

export class MemoryRepository implements Repository {
  readonly kind = 'memory' as const

  async listProducts(query: ProductQuery = {}): Promise<Product[]> {
    let list = db().products
    if (!query.includeDrafts) list = list.filter((p) => p.status === 'published')
    if (query.application) list = list.filter((p) => p.applications.includes(query.application!))
    if (query.featured) list = list.filter((p) => p.featured)
    return structuredClone(list)
  }

  async getProduct(slug: string) {
    return structuredClone(db().products.find((p) => p.slug === slug) ?? null)
  }

  async upsertProduct(product: Product) {
    const list = db().products
    const index = list.findIndex((p) => p.id === product.id)
    const next = { ...product, updatedAt: new Date().toISOString() }
    if (index >= 0) list[index] = next
    else list.unshift(next)
    return structuredClone(next)
  }

  async deleteProduct(id: string) {
    const store = db()
    store.products = store.products.filter((p) => p.id !== id)
  }

  async listApplications(includeDrafts = false) {
    const list = db().applications.filter((a) => includeDrafts || a.status === 'published')
    return structuredClone(list.sort((a, b) => a.order - b.order))
  }

  async getApplication(slug: string) {
    return structuredClone(db().applications.find((a) => a.slug === slug) ?? null)
  }

  async listArticles(includeDrafts = false) {
    const list = db().articles.filter((a) => includeDrafts || a.status === 'published')
    return structuredClone(list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)))
  }

  async getArticle(slug: string) {
    return structuredClone(db().articles.find((a) => a.slug === slug) ?? null)
  }

  async upsertArticle(article: Article) {
    const list = db().articles
    const index = list.findIndex((a) => a.slug === article.slug)
    if (index >= 0) list[index] = article
    else list.unshift(article)
    return structuredClone(article)
  }

  async listTestimonials(includeDrafts = false) {
    return structuredClone(db().testimonials.filter((t) => includeDrafts || t.status === 'published'))
  }

  async listFaqs(scope?: Faq['scope']) {
    const list = db()
      .faqs.filter((f) => f.status === 'published' && (!scope || f.scope === scope))
      .sort((a, b) => a.order - b.order)
    return structuredClone(list)
  }

  async listLeads() {
    return structuredClone(db().leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }

  async createLead(input: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: Lead['status'] }) {
    const lead: Lead = {
      ...input,
      id: `l-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: input.status ?? 'novo',
    }
    db().leads.unshift(lead)
    return structuredClone(lead)
  }

  async updateLead(id: string, patch: Partial<Lead>) {
    const list = db().leads
    const index = list.findIndex((l) => l.id === id)
    if (index < 0) return null
    list[index] = { ...list[index], ...patch, id, createdAt: list[index].createdAt }
    return structuredClone(list[index])
  }

  async getSettings() {
    return structuredClone(db().settings)
  }

  async updateSettings(patch: Partial<SiteSettings>) {
    const store = db()
    store.settings = { ...store.settings, ...patch }
    return structuredClone(store.settings)
  }

  async listUsers() {
    return structuredClone(db().users)
  }

  async listAuditLogs(limit = 50) {
    return structuredClone(db().logs.slice(0, limit))
  }

  async log(entry: Omit<AuditLog, 'id' | 'at'>) {
    db().logs.unshift({
      ...entry,
      id: `a-${Date.now().toString(36)}`,
      at: new Date().toISOString(),
    })
  }
}
