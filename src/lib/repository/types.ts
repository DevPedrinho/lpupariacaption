import type {
  AdminUser, Application, Article, AuditLog, Faq, Lead, Product, SiteSettings, Testimonial,
} from '@/lib/types'

export interface ProductQuery {
  includeDrafts?: boolean
  application?: string
  featured?: boolean
}

/**
 * Contrato único de acesso a dados. Existem duas implementações:
 *  - `MemoryRepository`  → dados demonstrativos, usada quando não há Supabase configurado.
 *  - `SupabaseRepository` → produção, usando as tabelas de `supabase/migrations`.
 * Nenhum componente de página conhece a origem dos dados.
 */
export interface Repository {
  readonly kind: 'memory' | 'supabase'

  listProducts(query?: ProductQuery): Promise<Product[]>
  getProduct(slug: string): Promise<Product | null>
  upsertProduct(product: Product): Promise<Product>
  deleteProduct(id: string): Promise<void>

  listApplications(includeDrafts?: boolean): Promise<Application[]>
  getApplication(slug: string): Promise<Application | null>

  listArticles(includeDrafts?: boolean): Promise<Article[]>
  getArticle(slug: string): Promise<Article | null>
  upsertArticle(article: Article): Promise<Article>

  listTestimonials(includeDrafts?: boolean): Promise<Testimonial[]>
  listFaqs(scope?: Faq['scope']): Promise<Faq[]>

  listLeads(): Promise<Lead[]>
  createLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: Lead['status'] }): Promise<Lead>
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null>

  getSettings(): Promise<SiteSettings>
  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>

  listUsers(): Promise<AdminUser[]>
  listAuditLogs(limit?: number): Promise<AuditLog[]>
  log(entry: Omit<AuditLog, 'id' | 'at'>): Promise<void>
}
