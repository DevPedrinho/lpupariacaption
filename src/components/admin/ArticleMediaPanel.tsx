import { Panel } from '@/components/admin/ui'
import { Icon } from '@/components/ui/Icon'
import { CopiarTrecho } from '@/components/admin/CopiarTrecho'
import { removeArticleMedia, uploadArticleMedia } from '@/app/admin/actions'
import type { ArticleMedia } from '@/lib/article-media'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

/**
 * Imagens do artigo. Fica fora do formulário principal (form dentro de form
 * não existe em HTML). Cada imagem mostra o trecho pronto para colar no
 * texto, no lugar em que ela deve aparecer.
 */
export function ArticleMediaPanel({
  slug,
  media,
  disponivel,
}: {
  slug: string
  media: ArticleMedia[]
  disponivel: boolean
}) {
  return (
    <Panel>
      <h2 className="text-base font-semibold text-white">Imagens, vídeos e links no texto</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-400">
        Envie a imagem aqui, copie o trecho e cole no conteúdo onde ela deve aparecer. Para vídeo, cole o
        endereço do YouTube ou Vimeo numa linha sozinha. Para link, escreva{' '}
        <code className="text-ink-200">[texto do link](https://endereco)</code>.
      </p>

      {media.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <li key={item.name} className="flex flex-col gap-2">
              <div className="aspect-4/3 overflow-hidden rounded-lg border border-ink-700/70 bg-ink-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              </div>
              <CopiarTrecho trecho={`![Legenda da imagem](${item.url})`} />
              <form action={removeArticleMedia}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="name" value={item.name} />
                <button
                  type="submit"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-ink-600/70 px-2.5 text-xs text-ink-300 transition-colors hover:border-critical-500/60 hover:text-critical-500"
                >
                  <Icon name="trash" className="size-3.5" />
                  Remover
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={uploadArticleMedia} className="mt-5 flex flex-col gap-3 border-t border-ink-700/60 pt-5 sm:flex-row sm:items-end">
        <input type="hidden" name="slug" value={slug} />
        <div className="flex-1">
          <label htmlFor="media-files" className="mb-1.5 block text-xs font-medium text-ink-300">
            Enviar imagens <span className="text-ink-500">(JPG, PNG, WebP ou GIF, até 8 MB cada)</span>
          </label>
          <input
            id="media-files"
            name="files"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            multiple
            required
            disabled={!disponivel}
            className={`${input} h-auto py-1.5 file:mr-3 file:rounded-md file:border-0 file:bg-brand-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink-950 hover:file:bg-brand-400 disabled:opacity-50`}
          />
          {!disponivel && (
            <p className="mt-1.5 text-xs text-caution-500">
              O envio precisa da SUPABASE_SERVICE_ROLE_KEY neste ambiente. Uma imagem já publicada em outro
              endereço pode ser usada direto: <code>![legenda](https://…)</code>.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!disponivel}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-50"
        >
          <Icon name="plus" className="size-4" />
          Enviar
        </button>
      </form>
    </Panel>
  )
}
