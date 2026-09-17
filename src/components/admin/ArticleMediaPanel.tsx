import { Panel } from '@/components/admin/ui'
import { Icon } from '@/components/ui/Icon'
import { CopiarTrecho } from '@/components/admin/CopiarTrecho'
import { Uploader } from '@/components/admin/Uploader'
import { prepareUpload, registerArticleImages, removeArticleMedia } from '@/app/admin/actions'
import type { ArticleMedia } from '@/lib/article-media'

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

      <div className="mt-5 border-t border-ink-700/60 pt-5">
        <Uploader
          bucket="conteudos"
          prefix={slug}
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          disponivel={disponivel}
          preparar={prepareUpload}
          concluir={registerArticleImages}
        />
      </div>
    </Panel>
  )
}
