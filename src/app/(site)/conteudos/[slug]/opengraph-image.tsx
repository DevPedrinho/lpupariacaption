import { getRepository } from '@/lib/repository'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'Conteúdo UPAR AI'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getRepository().getArticle(slug)
  return ogImage({
    eyebrow: 'UPAR AI · Conteúdo',
    title: article?.title ?? 'Conteúdos UPAR AI',
    subtitle: article?.excerpt,
  })
}
