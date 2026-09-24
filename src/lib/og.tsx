import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/**
 * Imagem de compartilhamento (Open Graph) gerada no servidor, com a mesma
 * paleta do site. Usada pela raiz e pelas páginas dinâmicas — a prévia no
 * WhatsApp e nas redes mostra o título da página, não uma imagem genérica.
 */
export function ogImage({
  title,
  subtitle,
  eyebrow = 'UPAR AI',
}: {
  title: string
  subtitle?: string
  eyebrow?: string
}) {
  const titulo = title.length > 90 ? `${title.slice(0, 87)}…` : title
  const sub = subtitle && subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #05070E 0%, #0B1219 55%, #0F1C1A 100%)',
          color: '#F4F7F6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: '#37DB9A',
              boxShadow: '0 0 32px rgba(55,219,154,0.8)',
            }}
          />
          <div style={{ fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', color: '#99EFCC' }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: titulo.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.08 }}>
            {titulo}
          </div>
          {sub ? <div style={{ fontSize: 30, lineHeight: 1.35, color: '#AEBBC2' }}>{sub}</div> : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#6E7F88' }}>
          <div>Computadores de alta performance para inteligência artificial</div>
          <div>Fortaleza · CE</div>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
