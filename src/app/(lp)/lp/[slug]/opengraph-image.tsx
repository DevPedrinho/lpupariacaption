import { getRepository } from '@/lib/repository'
import { defaultLandingPages } from '@/data/landing'
import type { LandingSlug } from '@/lib/types'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'UPAR AI'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const settings = await getRepository().getSettings()
  const copy = settings.landingPages?.[slug as LandingSlug] ?? defaultLandingPages[slug as LandingSlug]
  return ogImage({ title: copy?.title ?? 'UPAR AI', subtitle: copy?.subtitle })
}
