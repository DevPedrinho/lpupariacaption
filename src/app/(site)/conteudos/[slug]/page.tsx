import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRepository } from '@/lib/repository'
import { Badge } from '@/components/ui/Badge'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { Markdown } from '@/components/site/Markdown'
import { FinalCta } from '@/components/home/FinalCta'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { formatDate } from '@/lib/format'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const articles = await getRepository().listArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const article = await getRepository().getArticle(slug)
  if (!article) return { title: 'Conteúdo não encontrado' }
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    alternates: { canonical: `/conteudos/${article.slug}` },
    openGraph: { type: 'article', title: article.title, description: article.excerpt },
  }
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params
  const repo = getRepository()
  const article = await repo.getArticle(slug)
  if (!article || article.status !== 'published') notFound()

  const [settings, all] = await Promise.all([repo.getSettings(), repo.listArticles()])
  const others = all.filter((item) => item.slug !== article.slug).slice(0, 3)

  return (
    <>
      <JsonLd
        data={[
          articleSchema(article, settings),
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Conteúdos', path: '/conteudos' },
            { name: article.title, path: `/conteudos/${article.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Conteúdos', href: '/conteudos' },
          { label: article.title },
        ]}
      >
        <p className="mt-7 text-sm text-ink-400">
          {article.author} · {formatDate(article.publishedAt)} · {article.readingMinutes} min de leitura
        </p>
      </PageHero>

      <Section>
        <div className="container-page">
          <article className="mx-auto max-w-3xl">
            {article.isDemo && (
              <DemoNotice className="mb-8">
                Conteúdo <strong>demonstrativo</strong>, escrito para validar a estrutura editorial. Pode ser
                editado ou substituído pelo painel administrativo.
              </DemoNotice>
            )}
            <Markdown source={article.body} />
          </article>
        </div>
      </Section>

      {others.length > 0 && (
        <Section tone="raised">
          <div className="container-page">
            <h2 className="text-xl font-semibold text-white">Continue lendo</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/conteudos/${item.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5 transition-colors hover:border-brand-500/45"
                  >
                    <Badge tone="neutral">{item.category}</Badge>
                    <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{item.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-flux-300">
                      Ler
                      <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <FinalCta context={{ kind: 'consultoria' }} />
    </>
  )
}
