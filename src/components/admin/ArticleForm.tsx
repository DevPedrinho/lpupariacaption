import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/admin/ui'
import { saveArticle } from '@/app/admin/actions'
import type { Article } from '@/lib/types'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const area =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

const CATEGORIES: Article['category'][] = ['Guia', 'Comparativo', 'IA local', 'Estudo de caso', 'Glossário', 'Empresas']

export function ArticleForm({ article }: { article?: Article }) {
  return (
    <form action={saveArticle} className="flex flex-col gap-5">
      <Panel>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-ink-300">Título</label>
            <input id="title" name="title" required defaultValue={article?.title} className={input} />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1.5 block text-xs font-medium text-ink-300">Slug (URL)</label>
            <input id="slug" name="slug" defaultValue={article?.slug} className={input} readOnly={Boolean(article)} />
          </div>
          <div>
            <label htmlFor="category" className="mb-1.5 block text-xs font-medium text-ink-300">Categoria</label>
            <select id="category" name="category" defaultValue={article?.category ?? 'Guia'} className={input}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="mb-1.5 block text-xs font-medium text-ink-300">Resumo</label>
            <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt} className={area} />
          </div>
          <div>
            <label htmlFor="author" className="mb-1.5 block text-xs font-medium text-ink-300">Autor</label>
            <input id="author" name="author" defaultValue={article?.author ?? 'Equipe UPAR'} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="publishedAt" className="mb-1.5 block text-xs font-medium text-ink-300">Publicação</label>
              <input id="publishedAt" name="publishedAt" type="date" defaultValue={article?.publishedAt} className={input} />
            </div>
            <div>
              <label htmlFor="readingMinutes" className="mb-1.5 block text-xs font-medium text-ink-300">Minutos</label>
              <input id="readingMinutes" name="readingMinutes" type="number" min={1} defaultValue={article?.readingMinutes ?? 5} className={input} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <label htmlFor="body" className="mb-1.5 block text-xs font-medium text-ink-300">
          Conteúdo
          <span className="mt-0.5 block text-xs font-normal leading-relaxed text-ink-500">
            <code>##</code> e <code>###</code> para títulos · <code>-</code> para listas · <code>**texto**</code>{' '}
            para negrito · <code>[texto](https://…)</code> para link · <code>![legenda](https://…)</code> numa
            linha sozinha para imagem · endereço do YouTube ou Vimeo numa linha sozinha para vídeo.
            {!article && ' Salve o conteúdo uma vez para liberar o envio de imagens.'}
          </span>
        </label>
        <textarea id="body" name="body" rows={22} defaultValue={article?.body} className={`${area} font-mono text-[0.8125rem] leading-relaxed`} />
      </Panel>

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Publicação e SEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-1.5 block text-xs font-medium text-ink-300">Situação</label>
            <select id="status" name="status" defaultValue={article?.status ?? 'draft'} className={input}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2.5 text-sm text-ink-200">
            <input type="checkbox" name="isDemo" defaultChecked={article?.isDemo} className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500" />
            Marcar como conteúdo demonstrativo
          </label>
          <div>
            <label htmlFor="seoTitle" className="mb-1.5 block text-xs font-medium text-ink-300">Título para SEO</label>
            <input id="seoTitle" name="seoTitle" defaultValue={article?.seoTitle} className={input} />
          </div>
          <div>
            <label htmlFor="seoDescription" className="mb-1.5 block text-xs font-medium text-ink-300">Descrição para SEO</label>
            <input id="seoDescription" name="seoDescription" defaultValue={article?.seoDescription} className={input} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg">Salvar conteúdo</Button>
        <Link href="/admin/conteudos" className="text-sm text-ink-300 transition-colors hover:text-white">
          Cancelar
        </Link>
        {article && (
          <Link
            href={`/conteudos/${article.slug}`}
            target="_blank"
            className="ml-auto text-sm text-flux-300 transition-colors hover:text-flux-400"
          >
            Ver no site ↗
          </Link>
        )}
      </div>
    </form>
  )
}
