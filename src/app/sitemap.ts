import type { MetadataRoute } from 'next'
import { getRepository } from '@/lib/repository'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai.upartech.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getRepository()
  const [products, applications, articles] = await Promise.all([
    repo.listProducts(),
    repo.listApplications(),
    repo.listArticles(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/solucoes`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/comparador`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/encontre-sua-configuracao`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/consultoria`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/conteudos`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/sobre`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/contato`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  return [
    ...staticRoutes,
    ...applications.map((application) => ({
      url: `${base}/solucoes/${application.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${base}/produtos/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: `${base}/conteudos/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
