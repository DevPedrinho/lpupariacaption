import type { MetadataRoute } from 'next'
import { getRepository } from '@/lib/repository'
import { siteUrl as base } from '@/lib/site-url'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/solucoes`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/comparativo`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/encontre-sua-configuracao`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/consultoria`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/conteudos`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/sobre`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/garantia`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/contato`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  try {
    const repo = getRepository()
    const [products, applications, articles] = await Promise.all([
      repo.listProducts(),
      repo.listApplications(),
      repo.listArticles(),
    ])

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
  } catch (error) {
    // Um sitemap com as rotas fixas é melhor do que um deploy interrompido.
    console.warn('sitemap: origem de dados indisponível, publicando apenas as rotas fixas:', error)
    return staticRoutes
  }
}
