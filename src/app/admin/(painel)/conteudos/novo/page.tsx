import { requireSession } from '@/lib/admin-session'
import { AdminHeader } from '@/components/admin/ui'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function NewArticlePage() {
  await requireSession('conteudos')
  return (
    <>
      <AdminHeader title="Novo conteúdo" description="Escreva pensando na dúvida real de quem vai comprar." />
      <ArticleForm />
    </>
  )
}
