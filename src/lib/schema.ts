import type { Article, Faq, Product, SiteSettings } from './types'
import { availabilityLabel, gpuSummary, storageSummary, tierLabel, totalVramGb } from './format'

import { siteUrl } from './site-url'

export function organizationSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.companyName,
    legalName: settings.legalName || undefined,
    url: siteUrl,
    description: settings.seoDescription,
    ...(settings.cnpj ? { taxID: settings.cnpj } : {}),
    ...(settings.email || settings.phone
      ? {
          contactPoint: [
            {
              '@type': 'ContactPoint',
              contactType: 'sales',
              ...(settings.email ? { email: settings.email } : {}),
              ...(settings.phone ? { telephone: settings.phone } : {}),
              areaServed: 'BR',
              availableLanguage: 'pt-BR',
            },
          ],
        }
      : {}),
    ...(settings.city
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: settings.city,
            addressRegion: settings.state,
            addressCountry: 'BR',
            ...(settings.addressLine ? { streetAddress: settings.addressLine } : {}),
          },
        }
      : {}),
    sameAs: [settings.instagram, settings.linkedin, settings.youtube].filter(Boolean),
  }
}

export function websiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.companyName,
    url: siteUrl,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/catalogo?busca={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Produtos sem preço publicado são descritos com `PriceSpecification` sob
 * consulta — nunca inventamos um valor para preencher o schema.
 */
export function productSchema(product: Product, settings: SiteSettings) {
  const hasPrice = product.priceMode !== 'on_request' && Boolean(product.priceBrl && product.priceBrl > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    category: `${tierLabel[product.performanceTier]} — ${product.formFactor}`,
    brand: { '@type': 'Brand', name: settings.companyName },
    url: `${siteUrl}/produtos/${product.slug}`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Processador', value: product.cpu.model },
      { '@type': 'PropertyValue', name: 'Placa de vídeo', value: gpuSummary(product) },
      { '@type': 'PropertyValue', name: 'VRAM total', value: `${totalVramGb(product)} GB` },
      { '@type': 'PropertyValue', name: 'Memória RAM', value: `${product.ram.capacityGb} GB ${product.ram.type}` },
      { '@type': 'PropertyValue', name: 'Armazenamento', value: storageSummary(product) },
    ],
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/produtos/${product.slug}`,
      priceCurrency: 'BRL',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : product.availability === 'unavailable'
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/PreOrder',
      availabilityStarts: undefined,
      description: hasPrice ? undefined : availabilityLabel[product.availability],
      ...(hasPrice ? { price: product.priceBrl } : {}),
      seller: { '@type': 'Organization', name: settings.companyName },
    },
  }
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function articleSchema(article: Article, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    inLanguage: 'pt-BR',
    author: { '@type': 'Organization', name: settings.companyName },
    publisher: { '@type': 'Organization', name: settings.companyName },
    mainEntityOfPage: `${siteUrl}/conteudos/${article.slug}`,
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
