import type { Metadata } from 'next'
import Link from 'next/link'
import { getRepository } from '@/lib/repository'
import { Badge } from '@/components/ui/Badge'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { FinalCta } from '@/components/home/FinalCta'
import { breadcrumbSchema } from '@/lib/schema'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Conteúdos: guias de hardware para IA',
  description:
    'Guias, comparativos e materiais sobre VRAM, GPUs, IA local versus nuvem, workstations para empresas e glossário de hardware para inteligência artificial.',
  alternates: { canonical: '/conteudos' },
}

export default async function ArticlesPage() {
  const articles = await getRepository().listArticles()
  const [featured, ...rest] = articles
  const hasDemo = articles.some((article) => article.isDemo)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Conteúdos', path: '/conteudos' },
        ])}
      />
      <PageHero
        eyebrow="Conteúdos"
        title="Material para decidir com segurança"
        description="Guias diretos sobre os pontos que mais geram dúvida na hora de investir em hardware para inteligência artificial — escritos para quem precisa decidir, não apenas para quem já domina o assunto."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Conteúdos' }]}
      />

      <Section>
        <div className="container-page">
          {hasDemo && (
            <DemoNotice className="mb-9 max-w-3xl">
              Os artigos abaixo são <strong>conteúdo demonstrativo</strong>, escritos para validar a
              estrutura editorial e de SEO. A UPAR pode editar, substituir ou publicar novos textos pelo
              painel administrativo.
            </DemoNotice>
          )}

          {featured && (
            <Link
              href={`/conteudos/${featured.slug}`}
              className="group grid gap-8 rounded-2xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-7 transition-colors hover:border-brand-500/45 md:grid-cols-[1.4fr_1fr] md:p-10"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand">{featured.category}</Badge>
                  <span className="text-xs text-ink-400">
                    {formatDate(featured.publishedAt)} · {featured.readingMinutes} min de leitura
                  </span>
                </div>
                <h2 className="text-[1.6rem] leading-tight font-semibold text-white md:text-[2rem]">
                  {featured.title}
                </h2>
                <p className="text-[1.0625rem] leading-relaxed text-ink-300">{featured.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[0.9375rem] font-medium text-flux-300">
                  Ler o guia completo
                  <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div
                aria-hidden="true"
                className="hidden rounded-xl border border-ink-700/60 opacity-60 grid-mesh md:block"
              />
            </Link>
          )}

          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/conteudos/${article.slug}`}
                  className="group flex h-full flex-col gap-3.5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/45"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{article.category}</Badge>
                    <span className="text-xs text-ink-400">{article.readingMinutes} min</span>
                  </div>
                  <h2 className="text-[1.125rem] leading-snug font-medium text-white">{article.title}</h2>
                  <p className="text-sm leading-relaxed text-ink-300">{article.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-flux-300">
                    Ler
                    <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta
        title="Prefere resolver a dúvida conversando?"
        description="Um especialista responde em poucos minutos sobre o que a sua aplicação realmente exige."
        context={{ kind: 'consultoria' }}
      />
    </>
  )
}
