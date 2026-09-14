/**
 * Carga inicial do Supabase com o conteúdo de `src/data`.
 *
 *   npm run seed
 *
 * Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente
 * (ou em .env.local). O script é idempotente: usa upsert em todas as tabelas,
 * então pode ser executado novamente sem duplicar registros.
 *
 * Os leads demonstrativos NÃO são carregados — a tabela de leads deve começar
 * limpa em produção.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { applications } from '../src/data/applications'
import { articles, defaultSettings, faqs, testimonials, adminUsers } from '../src/data/content'
import { products } from '../src/data/products'

function loadEnvFile(path: string) {
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const value = match[2].replace(/^["']|["']$/g, '')
      if (value && !process.env[match[1]]) process.env[match[1]] = value
    }
  } catch {
    /* arquivo ausente: seguimos com as variáveis já exportadas */
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de rodar a carga.')
  process.exit(1)
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } })

async function step(label: string, run: () => PromiseLike<{ error: unknown }>) {
  const { error } = await run()
  if (error) {
    console.error(`  ✗ ${label}:`, (error as { message?: string }).message ?? error)
    process.exitCode = 1
    return
  }
  console.log(`  ✓ ${label}`)
}

async function main() {
  console.log(`Carregando conteúdo em ${url}\n`)

  await step(`${applications.length} aplicações`, () =>
    db.from('applications').upsert(
      applications.map((application) => ({
        slug: application.slug,
        status: application.status,
        display_order: application.order,
        payload: application,
      })),
      { onConflict: 'slug' },
    ),
  )

  await step(`${products.length} produtos`, () =>
    db.from('products').upsert(
      products.map((product) => ({
        id: product.id,
        slug: product.slug,
        status: product.status,
        featured: product.featured,
        form_factor: product.formFactor,
        performance_tier: product.performanceTier,
        gpu_vendor: product.gpu.vendor,
        gpu_quantity: product.gpu.quantity,
        vram_gb: product.gpu.vramGb,
        ram_gb: product.ram.capacityGb,
        cpu_cores: product.cpu.cores,
        storage_gb: product.storage.reduce((sum, drive) => sum + drive.capacityGb, 0),
        price_mode: product.priceMode,
        price_brl: product.priceBrl ?? null,
        availability: product.availability,
        applications: product.applications,
        payload: product,
        updated_at: product.updatedAt,
      })),
      { onConflict: 'id' },
    ),
  )

  await step(`${articles.length} artigos`, () =>
    db.from('articles').upsert(
      articles.map((article) => ({
        slug: article.slug,
        status: article.status,
        category: article.category,
        published_at: article.publishedAt,
        payload: article,
      })),
      { onConflict: 'slug' },
    ),
  )

  await step(`${testimonials.length} depoimentos`, () =>
    db.from('testimonials').upsert(
      testimonials.map((testimonial) => ({
        id: testimonial.id,
        status: testimonial.status,
        payload: testimonial,
      })),
      { onConflict: 'id' },
    ),
  )

  await step(`${faqs.length} perguntas frequentes`, () =>
    db.from('faqs').upsert(
      faqs.map((faq) => ({
        id: faq.id,
        status: faq.status,
        scope: faq.scope,
        display_order: faq.order,
        payload: faq,
      })),
      { onConflict: 'id' },
    ),
  )

  await step('configurações do site', () =>
    db.from('site_settings').upsert({ id: 1, payload: defaultSettings }, { onConflict: 'id' }),
  )

  // Perfis administrativos. `auth_uid` é preenchido depois, ao criar o usuário
  // correspondente no Supabase Auth.
  await step(`${adminUsers.length} perfis administrativos`, () =>
    db.from('admin_users').upsert(
      adminUsers.map((user) => ({
        email: user.email,
        role: user.role,
        active: user.active,
        created_at: user.createdAt,
        payload: user,
      })),
      { onConflict: 'email' },
    ),
  )

  console.log('\nCarga concluída.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
