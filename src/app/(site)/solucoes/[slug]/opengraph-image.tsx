import { getRepository } from '@/lib/repository'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'Solução UPAR AI'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const application = await getRepository().getApplication(slug)
  return ogImage({
    eyebrow: 'UPAR AI · Solução',
    title: application?.name ?? 'Soluções UPAR AI',
    subtitle: application?.short,
  })
}
