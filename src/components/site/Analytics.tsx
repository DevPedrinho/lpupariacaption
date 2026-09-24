'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { captureUtm } from '@/lib/analytics'
import { CONSENT_EVENT, CONSENT_KEY, type ConsentValue } from '@/lib/consent'
import type { SiteSettings } from '@/lib/types'

/**
 * Mensuração com Consent Mode v2.
 *
 * As tags do Google carregam sempre que houver ID configurado, mas começam em
 * modo anônimo (todo armazenamento negado). Quando o visitante aceita no
 * banner, o consentimento é atualizado e os cookies passam a ser usados. Quem
 * ignora o banner continua contando em modo agregado, sem cookie e sem
 * identificação — é o que permite ao Google Ads modelar essas conversões.
 *
 * O Meta Pixel segue o mesmo princípio com `fbq('consent', ...)`.
 *
 * Os IDs vêm do painel e entram em um script inline, por isso são limpos para
 * o conjunto de caracteres que os identificadores do Google e da Meta usam.
 */
const GRANTED = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const

const DENIED = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const

function safeId(value?: string): string {
  return (value ?? '').replace(/[^A-Za-z0-9_-]/g, '')
}

function applyConsent(value: ConsentValue) {
  const granted = value === 'accepted'
  window.gtag?.('consent', 'update', granted ? GRANTED : DENIED)
  window.fbq?.('consent', granted ? 'grant' : 'revoke')
}

export function Analytics({ settings }: { settings: SiteSettings }) {
  useEffect(() => {
    captureUtm()
    const onChange = (event: Event) => applyConsent((event as CustomEvent<ConsentValue>).detail)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  const ga4 = safeId(settings.ga4Id || process.env.NEXT_PUBLIC_GA4_ID)
  const gtm = safeId(settings.gtmId || process.env.NEXT_PUBLIC_GTM_ID)
  const pixel = safeId(settings.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID)
  const ads = safeId(settings.googleAdsId)
  const google = ga4 || ads

  if (!google && !gtm && !pixel) return null

  // Rótulos das ações de conversão do Google Ads, lidos por `track()`.
  const conversions: Record<string, string> = {}
  const whatsappLabel = safeId(settings.adsConversionWhatsapp)
  const leadLabel = safeId(settings.adsConversionLead)
  if (ads && whatsappLabel) conversions.whatsapp_click = `${ads}/${whatsappLabel}`
  if (ads && leadLabel) conversions.generate_lead = `${ads}/${leadLabel}`

  const script = [
    `window.dataLayer=window.dataLayer||[];`,
    `function gtag(){dataLayer.push(arguments);}`,
    `window.gtag=gtag;`,
    `gtag('consent','default',${JSON.stringify({ ...DENIED, wait_for_update: 500 })});`,
    `gtag('set','ads_data_redaction',true);`,
    `gtag('set','url_passthrough',true);`,
    `var uparAceito=false;try{uparAceito=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==='accepted';}catch(e){}`,
    `if(uparAceito){gtag('consent','update',${JSON.stringify(GRANTED)});}`,
    `window.uparConversions=${JSON.stringify(conversions)};`,
    gtm
      ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
        `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';` +
        `j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
        `})(window,document,'script','dataLayer','${gtm}');`
      : '',
    google
      ? `gtag('js',new Date());` +
        (ga4 ? `gtag('config','${ga4}');` : '') +
        (ads ? `gtag('config','${ads}');` : '') +
        `(function(){var s=document.createElement('script');s.async=true;` +
        `s.src='https://www.googletagmanager.com/gtag/js?id=${google}';document.head.appendChild(s);})();`
      : '',
    pixel
      ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
        `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
        `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
        `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}` +
        `(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
        `fbq('consent',uparAceito?'grant':'revoke');fbq('init','${pixel}');fbq('track','PageView');`
      : '',
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <Script id="upar-mensuracao" strategy="afterInteractive">
      {script}
    </Script>
  )
}
