import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { listArticleImages, midiaDisponivel } from '@/lib/article-media'
import { AdminHeader, AvisoGravacao, Panel } from '@/components/admin/ui'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { ArticleMediaPanel } from '@/components/admin/ArticleMediaPanel'
import { Icon } from '@/components/ui/Icon'

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('conteudos')
  const [{ slug }, { salvo, erro }] = await Promise.all([params, searchParams])
  const [article, media] = await Promise.all([getRepository().getArticle(slug), listArticleImages(slug)])
  if (!article) notFound()

  return (
    <>
      <AdminHeader title={article.title} description="Edição de conteúdo publicado." />

      <AvisoGravacao erro={erro} className="mb-5" />
      {salvo === 'midia' && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Imagens atualizadas. Copie o trecho e cole no conteúdo.
          </p>
        </Panel>
      )}

      <div className="mb-5">
        <ArticleMediaPanel slug={article.slug} media={media} disponivel={midiaDisponivel} />
      </div>

      <ArticleForm article={article} />
    </>
  )
}
