import { getRepository } from '@/lib/repository'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'Configuração UPAR AI'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getRepository().getProduct(slug)
  return ogImage({
    eyebrow: 'UPAR AI · Configuração',
    title: product?.name ?? 'Configuração UPAR AI',
    subtitle: product?.tagline,
  })
}
