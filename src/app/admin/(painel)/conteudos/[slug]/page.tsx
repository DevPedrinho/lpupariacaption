import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader } from '@/components/admin/ui'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireSession('conteudos')
  const { slug } = await params
  const article = await getRepository().getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <AdminHeader title={article.title} description="Edição de conteúdo publicado." />
      <ArticleForm article={article} />
    </>
  )
}
