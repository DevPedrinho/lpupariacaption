/**
 * Resolve a URL pública do site.
 *
 * A ordem existe para que o endereço esteja correto sem configuração manual:
 * um domínio definido explicitamente vence sempre; na ausência dele, a Vercel
 * informa o domínio estável de produção e, em pré-visualizações, o domínio
 * daquele deploy específico. O último caso é apenas o alvo pretendido.
 *
 * Isso alimenta canônicas, sitemap, robots e dados estruturados — com a URL
 * errada, os buscadores indexam endereços que não existem.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')

  // Domínio estável do ambiente de produção na Vercel (sem protocolo).
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (production) return `https://${production.replace(/\/+$/, '')}`

  // Domínio do deploy atual — usado em pré-visualizações.
  const deployment = process.env.VERCEL_URL?.trim()
  if (deployment) return `https://${deployment.replace(/\/+$/, '')}`

  return 'https://ai.upartech.com.br'
}

export const siteUrl = resolveSiteUrl()
