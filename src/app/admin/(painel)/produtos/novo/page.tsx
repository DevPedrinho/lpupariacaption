import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader } from '@/components/admin/ui'
import { ProductBuilder } from '@/components/admin/ProductBuilder'
import { sugestoesDeModelos } from '@/lib/product-suggestions'

export default async function NewProductPage() {
  await requireSession('produtos')
  const repo = getRepository()
  const [applications, products] = await Promise.all([repo.listApplications(true), repo.listProducts({ includeDrafts: true })])

  return (
    <>
      <AdminHeader
        title="Montar nova máquina"
        description="Escolha peça a peça. A máquina só aparece no site quando a situação for “publicado”."
      />
      <ProductBuilder applications={applications} sugestoes={sugestoesDeModelos(products)} />
    </>
  )
}
