import Link from 'next/link'
import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { AdminHeader, EmptyState, Panel, TableWrapper, Td, Th } from '@/components/admin/ui'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { availabilityLabel, formatCapacity, formatPrice, formFactorLabel, gpuSummary, tierLabel, totalVramGb } from '@/lib/format'
import { duplicateProduct, removeProduct, toggleProductStatus } from '../../actions'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>
}) {
  await requireSession('produtos')
  const { salvo } = await searchParams
  const products = await getRepository().listProducts({ includeDrafts: true })

  return (
    <>
      <AdminHeader
        title="Produtos"
        description="Catálogo completo. Produtos em rascunho não aparecem no site público."
        actions={
          <Link
            href="/admin/produtos/novo"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            <Icon name="plus" className="size-4" />
            Novo produto
          </Link>
        }
      />

      {salvo && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Produto salvo com sucesso.
          </p>
        </Panel>
      )}

      {products.length === 0 ? (
        <EmptyState
          title="Nenhum produto cadastrado"
          description="Cadastre a primeira configuração para que ela apareça no catálogo, no comparador e no diagnóstico."
        />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th className="hidden lg:table-cell">Configuração</Th>
              <Th className="hidden md:table-cell">Preço</Th>
              <Th>Situação</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/50">
            {products.map((product) => (
              <tr key={product.id}>
                <Td>
                  <Link href={`/admin/produtos/${product.id}`} className="font-medium text-white hover:text-flux-300">
                    {product.name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-ink-400">
                    {formFactorLabel[product.formFactor]} · {tierLabel[product.performanceTier]} ·{' '}
                    {availabilityLabel[product.availability]}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {product.featured && <Badge tone="brand">Destaque</Badge>}
                    {product.isDemo && <Badge tone="demo">Demo</Badge>}
                  </span>
                </Td>
                <Td className="hidden lg:table-cell text-xs">
                  {gpuSummary(product)}
                  <span className="block text-ink-400">
                    {formatCapacity(totalVramGb(product))} VRAM · {formatCapacity(product.ram.capacityGb)} RAM ·{' '}
                    {product.cpu.cores}C
                  </span>
                </Td>
                <Td className="hidden md:table-cell">{formatPrice(product.priceMode, product.priceBrl)}</Td>
                <Td>
                  <Badge tone={product.status === 'published' ? 'positive' : 'neutral'}>
                    {product.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-300 transition-colors hover:text-white"
                      title="Editar"
                    >
                      <Icon name="edit" className="size-4" />
                      <span className="sr-only">Editar {product.name}</span>
                    </Link>

                    <form action={toggleProductStatus}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        title={product.status === 'published' ? 'Despublicar' : 'Publicar'}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-300 transition-colors hover:text-white"
                      >
                        <Icon name={product.status === 'published' ? 'minus' : 'check'} className="size-4" />
                        <span className="sr-only">
                          {product.status === 'published' ? 'Despublicar' : 'Publicar'} {product.name}
                        </span>
                      </button>
                    </form>

                    <form action={duplicateProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        title="Duplicar"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-300 transition-colors hover:text-white"
                      >
                        <Icon name="copy" className="size-4" />
                        <span className="sr-only">Duplicar {product.name}</span>
                      </button>
                    </form>

                    <form action={removeProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        title="Remover"
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/70 text-ink-300 transition-colors hover:border-critical-500/60 hover:text-critical-500"
                      >
                        <Icon name="trash" className="size-4" />
                        <span className="sr-only">Remover {product.name}</span>
                      </button>
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}
    </>
  )
}
