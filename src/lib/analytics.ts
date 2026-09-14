'use client'

/* ============================================================================
   Camada de mensuração
   Os eventos são enviados para o dataLayer (GTM), gtag (GA4 / Google Ads) e
   fbq (Meta Pixel) quando cada ferramenta estiver configurada e o visitante
   tiver dado consentimento. A ausência de qualquer uma delas é ignorada com
   segurança — nada quebra se o ID não estiver preenchido.
   ========================================================================== */

type Params = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: Params[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export type UparEvent =
  | 'whatsapp_click'
  | 'view_item'
  | 'compare_products'
  | 'diagnostic_start'
  | 'diagnostic_step'
  | 'diagnostic_complete'
  | 'generate_lead'
  | 'filter_catalog'
  | 'form_submit'

const META_EVENT: Partial<Record<UparEvent, string>> = {
  view_item: 'ViewContent',
  generate_lead: 'Lead',
  diagnostic_complete: 'CompleteRegistration',
  whatsapp_click: 'Contact',
}

export function track(event: UparEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return
  const payload = { ...params, ...readUtm() }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...payload })

  window.gtag?.('event', event, payload)

  const metaEvent = META_EVENT[event]
  if (metaEvent) window.fbq?.('track', metaEvent, payload)
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
const UTM_STORAGE_KEY = 'upar.utm'

/** Guarda os parâmetros de campanha na primeira visita para anexá-los ao lead. */
export function captureUtm(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) found[key] = value
  }
  if (Object.keys(found).length === 0) return
  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found))
  } catch {
    /* armazenamento indisponível — seguimos sem persistir */
  }
}

export function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}
