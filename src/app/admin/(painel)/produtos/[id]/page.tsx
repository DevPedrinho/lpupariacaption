import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader } from '@/components/admin/ui'
import { ProductForm } from '@/components/admin/ProductForm'
import { formatDateTime } from '@/lib/format'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession('produtos')
  const { id } = await params
  const repo = getRepository()
  const [products, applications] = await Promise.all([
    repo.listProducts({ includeDrafts: true }),
    repo.listApplications(true),
  ])
  const product = products.find((item) => item.id === id)
  if (!product) notFound()

  return (
    <>
      <AdminHeader
        title={product.name}
        description={`Última alteração em ${formatDateTime(product.updatedAt)}.`}
      />
      <ProductForm product={product} applications={applications} />
    </>
  )
}
