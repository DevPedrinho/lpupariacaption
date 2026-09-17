import { Panel } from '@/components/admin/ui'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { Uploader } from '@/components/admin/Uploader'
import { addProductImages, prepareUpload, registerProductImages, removeProductImage, setProductCover } from '@/app/admin/actions'
import type { Product } from '@/lib/types'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const botao =
  'inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-600/70 bg-ink-900/80 px-2.5 text-xs text-ink-200 transition-colors hover:border-ink-500 hover:text-white'

/**
 * Fotos do produto. Fica fora do formulário principal: HTML não aceita form
 * dentro de form, e cada foto tem as próprias ações (capa, remover).
 *
 * A primeira imagem é a capa — aparece no catálogo e abre o carrossel.
 */
export function ProductImagesPanel({ product, uploadDisponivel }: { product: Product; uploadDisponivel: boolean }) {
  return (
    <Panel>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Fotos</h2>
          <p className="mt-1 text-sm text-ink-400">
            A primeira é a capa. O site mostra todas num carrossel, na ordem daqui.
          </p>
        </div>
        <span className="text-xs text-ink-500">{product.images.length} imagem(ns)</span>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {product.images.map((image, index) => (
          <li key={`${image.src ?? image.render}-${index}`} className="flex flex-col gap-2">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-ink-700/70 bg-ink-900">
              {image.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-3">
                  <div className="h-full w-16">
                    <MachineRender variant={image.render} gpuCount={product.gpu.quantity} compact />
                  </div>
                </div>
              )}
              {index === 0 && (
                <span className="absolute top-2 left-2 rounded-md bg-brand-500 px-2 py-0.5 text-2xs font-semibold text-ink-950">
                  Capa
                </span>
              )}
              {!image.src && (
                <span className="absolute right-2 bottom-2 rounded-md bg-ink-950/80 px-2 py-0.5 text-2xs text-ink-300">
                  Ilustração
                </span>
              )}
            </div>
            <p className="truncate text-xs text-ink-400" title={image.alt}>{image.alt}</p>
            <div className="flex gap-1.5">
              {index > 0 && (
                <form action={setProductCover}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="index" value={index} />
                  <button type="submit" className={botao} title="Usar como capa">
                    <Icon name="star" className="size-3.5" />
                    Capa
                  </button>
                </form>
              )}
              <form action={removeProductImage}>
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="index" value={index} />
                <button type="submit" className={`${botao} hover:border-critical-500/60 hover:text-critical-500`} title="Remover">
                  <Icon name="trash" className="size-3.5" />
                  Remover
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-ink-700/60 pt-5">
        <Uploader
          bucket="produtos"
          prefix={product.id}
          accept="image/jpeg,image/png,image/webp,image/avif"
          disponivel={uploadDisponivel}
          pedirLegenda
          legendaPadrao={`Foto de ${product.name}`}
          preparar={prepareUpload}
          concluir={registerProductImages}
        />
      </div>

      <form action={addProductImages} className="mt-5 grid gap-3 border-t border-ink-700/60 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <input type="hidden" name="id" value={product.id} />
        <div>
          <label htmlFor="url" className="mb-1.5 block text-xs font-medium text-ink-300">
            Ou o endereço de uma foto já publicada <span className="text-ink-500">(URL)</span>
          </label>
          <input id="url" name="url" type="url" required placeholder="https://…" className={input} />
          <input type="hidden" name="alt" value={`Foto de ${product.name}`} />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-600/70 px-4 text-sm font-medium text-ink-100 transition-colors hover:border-ink-500 hover:text-white"
        >
          <Icon name="plus" className="size-4" />
          Adicionar por URL
        </button>
      </form>
    </Panel>
  )
}
