const LADO_MAXIMO = 2000
const QUALIDADE = 0.86

/**
 * Reduz uma imagem no próprio navegador antes de enviar.
 *
 * Foto ou print de celular tem 4000+ px e 5–10 MB; o site nunca mostra acima
 * de ~1400 px e a IA lê bem em 2000 px. Reamostrar para 2000 px no lado maior
 * e recodificar em JPEG derruba o tamanho para algumas centenas de KB — é o
 * que faz o envio levar segundos em vez de minutos. PNG com transparência
 * continua PNG; GIF e arquivo pequeno passam intactos.
 */
export async function reduzirImagem(file: File): Promise<{ blob: Blob; type: string }> {
  const intacto = { blob: file, type: file.type }
  if (file.type === 'image/gif' || file.size < 400 * 1024) return intacto
  try {
    const bitmap = await createImageBitmap(file)
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height))
    const largura = Math.round(bitmap.width * escala)
    const altura = Math.round(bitmap.height * escala)
    const canvas = document.createElement('canvas')
    canvas.width = largura
    canvas.height = altura
    const ctx = canvas.getContext('2d')
    if (!ctx) return intacto
    ctx.drawImage(bitmap, 0, 0, largura, altura)
    bitmap.close()
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALIDADE))
    if (!blob || blob.size >= file.size) return intacto
    return { blob, type }
  } catch {
    return intacto
  }
}
