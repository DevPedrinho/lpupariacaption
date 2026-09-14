import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader } from '@/components/admin/ui'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  await requireSession('produtos')
  const applications = await getRepository().listApplications(true)

  return (
    <>
      <AdminHeader
        title="Novo produto"
        description="Cadastre a configuração. Ela só aparece no site quando a situação for alterada para “publicado”."
      />
      <ProductForm applications={applications} />
    </>
  )
}
