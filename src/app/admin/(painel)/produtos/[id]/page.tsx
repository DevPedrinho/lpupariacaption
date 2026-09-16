import { notFound } from 'next/navigation'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { uploadDisponivel } from '@/lib/product-images'
import { AdminHeader, AvisoGravacao, Panel } from '@/components/admin/ui'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductImagesPanel } from '@/components/admin/ProductImagesPanel'
import { Icon } from '@/components/ui/Icon'
import { formatDateTime } from '@/lib/format'

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('produtos')
  const [{ id }, { salvo, erro }] = await Promise.all([params, searchParams])
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

      <AvisoGravacao erro={erro} className="mb-5" />
      {salvo === 'imagens' && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Fotos atualizadas. O site já mostra a nova ordem.
          </p>
        </Panel>
      )}

      <div className="mb-5">
        <ProductImagesPanel product={product} uploadDisponivel={uploadDisponivel} />
      </div>

      <ProductForm product={product} applications={applications} />
    </>
  )
}
