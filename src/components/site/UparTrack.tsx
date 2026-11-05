/**
 * Rastreador Upar (SGI): guarda de onde o visitante veio (utm, gclid, fbclid),
 * põe um código curto (UP-UAI-XXXXXX) na mensagem de todo link de WhatsApp
 * e manda visita e clique pro SGI. É assim que o lead que chega no Klip é
 * ligado à página e ao anúncio que o trouxe.
 *
 * Script comum (não next/script) para o rastreador ler os próprios atributos.
 */
const SGI = 'https://sistema.uparcomputadores.com.br'

export function UparTrack() {
  return (
    <script
      src={`${SGI}/upar-track.js`}
      data-endpoint={`${SGI}/api/pub/marketing/track`}
      data-seg="UAI"
      defer
    />
  )
}
