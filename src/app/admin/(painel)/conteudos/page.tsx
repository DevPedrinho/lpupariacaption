import Link from 'next/link'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader, AvisoGravacao, EmptyState, Panel, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { formatDate } from '@/lib/format'

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('conteudos')
  const { salvo, erro } = await searchParams
  const repo = getRepository()
  const [articles, faqs, testimonials] = await Promise.all([
    repo.listArticles(true),
    repo.listFaqs(),
    repo.listTestimonials(true),
  ])

  return (
    <>
      <AdminHeader
        title="Conteúdos"
        description="Guias, comparativos e materiais de autoridade. Rascunhos não aparecem no site."
        actions={
          <Link
            href="/admin/conteudos/novo"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            <Icon name="plus" className="size-4" />
            Novo conteúdo
          </Link>
        }
      />

      <AvisoGravacao erro={erro} className="mb-5" />

      {salvo && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Conteúdo salvo com sucesso.
          </p>
        </Panel>
      )}

      {articles.length === 0 ? (
        <EmptyState title="Nenhum conteúdo publicado" description="Guias e comparativos ajudam o site a ser encontrado nas buscas." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              <Th>Título</Th>
              <Th className="hidden sm:table-cell">Categoria</Th>
              <Th className="hidden md:table-cell">Publicação</Th>
              <Th>Situação</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/50">
            {articles.map((article) => (
              <tr key={article.slug}>
                <Td>
                  <Link href={`/admin/conteudos/${article.slug}`} className="font-medium text-white hover:text-flux-300">
                    {article.title}
                  </Link>
                  {article.isDemo && (
                    <span className="mt-1.5 block">
                      <Badge tone="demo">Demonstrativo</Badge>
                    </span>
                  )}
                </Td>
                <Td className="hidden sm:table-cell">{article.category}</Td>
                <Td className="hidden md:table-cell text-ink-400">{formatDate(article.publishedAt)}</Td>
                <Td>
                  <Badge tone={article.status === 'published' ? 'positive' : 'neutral'}>
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="text-base font-semibold text-white">Perguntas frequentes ({faqs.length})</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
            Alimentam a home, as páginas de produto e a consultoria, além dos dados estruturados de FAQ para
            os buscadores.
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {faqs.map((faq) => (
              <li key={faq.id} className="flex items-start gap-2.5 text-sm text-ink-200">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-flux-400" />
                <span>
                  {faq.question}
                  <span className="ml-2 text-xs text-ink-500 capitalize">({faq.scope})</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <h2 className="text-base font-semibold text-white">Depoimentos ({testimonials.length})</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
            Todos os depoimentos atuais estão marcados como demonstrativos e assim aparecem no site, com
            aviso visível. Substitua por depoimentos reais com autorização de uso.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="rounded-lg border border-ink-700/60 p-3.5">
                <p className="line-clamp-2 text-sm text-ink-200">{testimonial.quote}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-ink-400">
                  {testimonial.author} — {testimonial.organization}
                  {testimonial.isDemo && <Badge tone="demo">Demo</Badge>}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}
