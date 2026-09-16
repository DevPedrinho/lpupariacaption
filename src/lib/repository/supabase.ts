import { SupabaseError } from './erro'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getAdminClient, getPublicClient } from '@/lib/supabase/server'
import { hasServiceRole } from '@/lib/supabase/config'
import { defaultSettings } from '@/data/content'
import type {
  AdminUser, Application, Article, AuditLog, Faq, Lead, Product, SiteSettings, Testimonial,
} from '@/lib/types'
import type { ProductQuery, Repository } from './types'

/**
 * Implementação de produção. O objeto completo de cada entidade é guardado em
 * `payload jsonb`; as colunas escalares existem para filtro e ordenação.
 * Ver `supabase/migrations/0001_init.sql`.
 */
/**
 * Converte a falha do Supabase em um `Error` de verdade antes de propagar.
 *
 * O cliente devolve um objeto simples, e `throw` de objeto simples não é
 * tratado pelas barreiras de erro do React: em vez de cair no `error.tsx` da
 * área, a requisição cai na página de erro global do Next, que não mostra
 * mensagem nenhuma. Com um `Error` nomeado, a barreira assume e a causa
 * aparece na tela.
 */
function falha(operacao: string, error: { message?: string; code?: string; hint?: string }): never {
  throw new SupabaseError(operacao, error)
}

export class SupabaseRepository implements Repository {
  readonly kind = 'supabase' as const

  private read(): SupabaseClient {
    return hasServiceRole ? getAdminClient() : getPublicClient()
  }

  private write(): SupabaseClient {
    return getAdminClient()
  }

  async listProducts(query: ProductQuery = {}): Promise<Product[]> {
    let q = this.read().from('products').select('payload').order('updated_at', { ascending: false })
    if (!query.includeDrafts) q = q.eq('status', 'published')
    if (query.featured) q = q.eq('featured', true)
    if (query.application) q = q.contains('applications', [query.application])
    const { data, error } = await q
    if (error) falha('listProducts', error)
    return (data ?? []).map((row) => row.payload as Product)
  }

  async getProduct(slug: string): Promise<Product | null> {
    const { data, error } = await this.read().from('products').select('payload').eq('slug', slug).maybeSingle()
    if (error) falha('getProduct', error)
    return (data?.payload as Product) ?? null
  }

  async upsertProduct(product: Product): Promise<Product> {
    const next: Product = { ...product, updatedAt: new Date().toISOString() }
    const { error } = await this.write()
      .from('products')
      .upsert(
        {
          id: next.id,
          slug: next.slug,
          status: next.status,
          featured: next.featured,
          form_factor: next.formFactor,
          performance_tier: next.performanceTier,
          gpu_vendor: next.gpu.vendor,
          gpu_quantity: next.gpu.quantity,
          vram_gb: next.gpu.vramGb,
          ram_gb: next.ram.capacityGb,
          cpu_cores: next.cpu.cores,
          storage_gb: next.storage.reduce((sum, d) => sum + d.capacityGb, 0),
          price_mode: next.priceMode,
          price_brl: next.priceBrl ?? null,
          availability: next.availability,
          applications: next.applications,
          payload: next,
          updated_at: next.updatedAt,
        },
        { onConflict: 'id' },
      )
    if (error) falha('upsertProduct', error)
    return next
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.write().from('products').delete().eq('id', id)
    if (error) falha('deleteProduct', error)
  }

  async listApplications(includeDrafts = false): Promise<Application[]> {
    let q = this.read().from('applications').select('payload').order('display_order')
    if (!includeDrafts) q = q.eq('status', 'published')
    const { data, error } = await q
    if (error) falha('listApplications', error)
    return (data ?? []).map((row) => row.payload as Application)
  }

  async getApplication(slug: string): Promise<Application | null> {
    const { data, error } = await this.read().from('applications').select('payload').eq('slug', slug).maybeSingle()
    if (error) falha('getApplication', error)
    return (data?.payload as Application) ?? null
  }

  async listArticles(includeDrafts = false): Promise<Article[]> {
    let q = this.read().from('articles').select('payload').order('published_at', { ascending: false })
    if (!includeDrafts) q = q.eq('status', 'published')
    const { data, error } = await q
    if (error) falha('listArticles', error)
    return (data ?? []).map((row) => row.payload as Article)
  }

  async getArticle(slug: string): Promise<Article | null> {
    const { data, error } = await this.read().from('articles').select('payload').eq('slug', slug).maybeSingle()
    if (error) falha('getArticle', error)
    return (data?.payload as Article) ?? null
  }

  async upsertArticle(article: Article): Promise<Article> {
    const { error } = await this.write()
      .from('articles')
      .upsert(
        {
          slug: article.slug,
          status: article.status,
          published_at: article.publishedAt,
          category: article.category,
          payload: article,
        },
        { onConflict: 'slug' },
      )
    if (error) falha('upsertArticle', error)
    return article
  }

  async listTestimonials(includeDrafts = false): Promise<Testimonial[]> {
    let q = this.read().from('testimonials').select('payload')
    if (!includeDrafts) q = q.eq('status', 'published')
    const { data, error } = await q
    if (error) falha('listTestimonials', error)
    return (data ?? []).map((row) => row.payload as Testimonial)
  }

  async listFaqs(scope?: Faq['scope']): Promise<Faq[]> {
    let q = this.read().from('faqs').select('payload').eq('status', 'published').order('display_order')
    if (scope) q = q.eq('scope', scope)
    const { data, error } = await q
    if (error) falha('listFaqs', error)
    return (data ?? []).map((row) => row.payload as Faq)
  }

  async listLeads(): Promise<Lead[]> {
    const { data, error } = await this.write()
      .from('leads')
      .select('payload')
      .order('created_at', { ascending: false })
    if (error) falha('listLeads', error)
    return (data ?? []).map((row) => row.payload as Lead)
  }

  async createLead(
    input: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: Lead['status'] },
  ): Promise<Lead> {
    const lead: Lead = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: input.status ?? 'novo',
    }
    const { error } = await this.write().from('leads').insert({
      id: lead.id,
      created_at: lead.createdAt,
      status: lead.status,
      origin: lead.origin,
      product_slug: lead.productSlug ?? null,
      application: lead.application ?? null,
      payload: lead,
    })
    if (error) falha('createLead', error)
    return lead
  }

  async updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
    const client = this.write()
    const { data, error } = await client.from('leads').select('payload').eq('id', id).maybeSingle()
    if (error) falha('updateLead', error)
    if (!data) return null
    const current = data.payload as Lead
    const next: Lead = { ...current, ...patch, id: current.id, createdAt: current.createdAt }
    const { error: updateError } = await client
      .from('leads')
      .update({ status: next.status, payload: next })
      .eq('id', id)
    if (updateError) throw updateError
    return next
  }

  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await this.read().from('site_settings').select('payload').eq('id', 1).maybeSingle()
    if (error) falha('getSettings', error)
    return { ...defaultSettings, ...((data?.payload as Partial<SiteSettings>) ?? {}) }
  }

  async updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings()
    const next = { ...current, ...patch }
    const { error } = await this.write()
      .from('site_settings')
      .upsert({ id: 1, payload: next }, { onConflict: 'id' })
    if (error) falha('updateSettings', error)
    return next
  }

  async listUsers(): Promise<AdminUser[]> {
    const { data, error } = await this.write().from('admin_users').select('payload')
    if (error) falha('listUsers', error)
    return (data ?? []).map((row) => row.payload as AdminUser)
  }

  async listAuditLogs(limit = 50): Promise<AuditLog[]> {
    const { data, error } = await this.write()
      .from('audit_logs')
      .select('payload')
      .order('at', { ascending: false })
      .limit(limit)
    if (error) falha('listAuditLogs', error)
    return (data ?? []).map((row) => row.payload as AuditLog)
  }

  async log(entry: Omit<AuditLog, 'id' | 'at'>): Promise<void> {
    const record: AuditLog = { ...entry, id: crypto.randomUUID(), at: new Date().toISOString() }
    await this.write().from('audit_logs').insert({ id: record.id, at: record.at, payload: record })
  }
}
