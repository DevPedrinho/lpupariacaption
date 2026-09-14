'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { captureUtm } from '@/lib/analytics'
import { CONSENT_EVENT, readConsent, type ConsentValue } from '@/lib/consent'
import type { SiteSettings } from '@/lib/types'

/**
 * Carrega GA4, GTM e Meta Pixel apenas quando os IDs estiverem configurados
 * e o visitante tiver aceitado os cookies de medição.
 */
export function Analytics({ settings }: { settings: SiteSettings }) {
  const [consent, setConsent] = useState<ConsentValue>(null)

  useEffect(() => {
    captureUtm()
    setConsent(readConsent())
    const onChange = (event: Event) => setConsent((event as CustomEvent<ConsentValue>).detail)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  if (consent !== 'accepted') return null

  const ga4 = settings.ga4Id || process.env.NEXT_PUBLIC_GA4_ID
  const gtm = settings.gtmId || process.env.NEXT_PUBLIC_GTM_ID
  const pixel = settings.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID
  const ads = settings.googleAdsId

  return (
    <>
      {gtm ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      ) : null}

      {ga4 || ads ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4 || ads}`}
            strategy="afterInteractive"
          />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${ga4 ? `gtag('config', '${ga4}');` : ''}
${ads ? `gtag('config', '${ads}');` : ''}`}
          </Script>
        </>
      ) : null}

      {pixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
    </>
  )
}
