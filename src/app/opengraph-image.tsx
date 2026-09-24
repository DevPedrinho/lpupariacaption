import { getRepository } from '@/lib/repository'
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from '@/lib/og'

export const alt = 'UPAR AI — computadores de alta performance para inteligência artificial'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  const settings = await getRepository().getSettings()
  return ogImage({ title: settings.heroTitle, subtitle: settings.heroSubtitle })
}
