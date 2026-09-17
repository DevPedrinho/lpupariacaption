import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRepository } from '@/lib/repository'
import { Badge } from '@/components/ui/Badge'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { ProductBuyBox } from '@/components/product/ProductBuyBox'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductStickyCta } from '@/components/product/ProductStickyCta'
import { ProductCard } from '@/components/catalog/ProductCard'
import { FinalCta } from '@/components/home/FinalCta'
import { FaqSection } from '@/components/home/FaqSection'
import { breadcrumbSchema, productSchema } from '@/lib/schema'
import {
  availabilityLabel, formatCapacity, formFactorLabel, gpuSummary, storageSummary, tierLabel,
  totalVramGb, vramSummary,
} from '@/lib/format'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const products = await getRepository().listProducts()
    return products.map((product) => ({ slug: product.slug }))
  } catch (error) {
    // Se a origem de dados estiver indisponível no build, as páginas passam a
    // ser renderizadas sob demanda em vez de derrubar o deploy inteiro.
    console.warn('generateStaticParams (produtos) indisponível:', error)
    return []
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getRepository().getProduct(slug)
  if (!product) return { title: 'Configuração não encontrada' }
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.summary.slice(0, 155),
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: { title: product.seoTitle ?? product.name, description: product.summary },
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const repo = getRepository()
  const product = await repo.getProduct(slug)
  if (!product || product.status !== 'published') notFound()

  const [settings, applications, allProducts, faqs] = await Promise.all([
    repo.getSettings(),
    repo.listApplications(),
    repo.listProducts(),
    repo.listFaqs('produto'),
  ])

  const appIndex = applications.map(({ slug: s, name }) => ({ slug: s, name }))
  const productApps = applications.filter((app) => product.applications.includes(app.slug))
  const primaryApplication = productApps[0]?.name

  const related = product.relatedSlugs
    .map((relatedSlug) => allProducts.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const validatedBenchmarks = product.benchmarks.filter((benchmark) => benchmark.validated)

  const fullSpecs: { group: string; rows: { label: string; value: string }[] }[] = [
    {
      group: 'Processamento',
      rows: [
        { label: 'Processador', value: product.cpu.model },
        { label: 'Núcleos e threads', value: `${product.cpu.cores} núcleos · ${product.cpu.threads} threads` },
        ...(product.cpu.note ? [{ label: 'Observação', value: product.cpu.note }] : []),
      ],
    },
    {
      group: 'Placa de vídeo',
      rows: [
        { label: 'Modelo', value: gpuSummary(product) },
        { label: 'Fabricante', value: product.gpu.vendor },
        { label: 'VRAM', value: vramSummary(product) },
        { label: 'Placas suportadas pelo chassi', value: `Até ${product.maxGpus}` },
        ...(product.gpu.note ? [{ label: 'Observação', value: product.gpu.note }] : []),
      ],
    },
    {
      group: 'Memória e armazenamento',
      rows: [
        {
          label: 'Memória RAM',
          value: `${formatCapacity(product.ram.capacityGb)} ${product.ram.type}${
            product.ram.slotsTotal ? ` (${product.ram.slotsUsed}/${product.ram.slotsTotal} slots)` : ''
          }`,
        },
        ...(product.ram.maxGb
          ? [{ label: 'Expansão de memória', value: `Até ${formatCapacity(product.ram.maxGb)}` }]
          : []),
        ...product.storage.map((drive) => ({
          label: drive.purpose ?? 'Armazenamento',
          value: `${formatCapacity(drive.capacityGb)} ${drive.kind}`,
        })),
      ],
    },
    {
      group: 'Estrutura',
      rows: [
        { label: 'Refrigeração', value: product.cooling },
        { label: 'Fonte de alimentação', value: product.psu },
        { label: 'Rede e conectividade', value: product.network },
        ...(product.chassis ? [{ label: 'Gabinete', value: product.chassis }] : []),
      ],
    },
    {
      group: 'Comercial',
      rows: [
        { label: 'Formato', value: formFactorLabel[product.formFactor] },
        { label: 'Nível de desempenho', value: tierLabel[product.performanceTier] },
        { label: 'Disponibilidade', value: availabilityLabel[product.availability] },
        { label: 'Perfil de cliente', value: product.clientProfile },
      ],
    },
  ]

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, settings),
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Catálogo', path: '/catalogo' },
            { name: product.name, path: `/produtos/${product.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={`${formFactorLabel[product.formFactor]} · ${tierLabel[product.performanceTier]}`}
        title={product.name}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Catálogo', href: '/catalogo' },
          { label: product.name },
        ]}
      />

      <Section className="pt-10 pb-12 md:pt-12">
        <div className="container-page grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} gpuCount={product.gpu.quantity} productName={product.name} />
          </div>
          <ProductBuyBox product={product} applicationName={primaryApplication} />
        </div>
      </Section>

      {/* ------------------------------- Resumo ---------------------------------- */}
      <Section id="resumo" tone="raised" className="py-12 md:py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <p className="text-2xs font-semibold tracking-[0.14em] text-brand-300 uppercase">Em resumo</p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-200">{product.summary}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-2xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Para quem é</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-200">{product.clientProfile}</p>
            </div>
            {productApps.length > 0 && (
              <div>
                <p className="text-2xs font-semibold tracking-[0.14em] text-ink-400 uppercase">Aplicações</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {productApps.slice(0, 4).map((application) => (
                    <li key={application.slug}>
                      <Link
                        href={`/solucoes/${application.slug}`}
                        className="inline-flex rounded-full border border-ink-600/70 px-3 py-1 text-sm text-ink-100 transition-colors hover:border-brand-500/50 hover:text-white"
                      >
                        {application.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href="#configuracao"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-flux-300 hover:text-flux-400"
            >
              Ver a configuração completa
              <Icon name="chevronDown" className="size-4" />
            </a>
          </div>
        </div>
      </Section>

      {product.isDemo && (
        <div className="container-page pb-10">
          <DemoNotice>
            Esta é uma <strong>configuração demonstrativa</strong>, criada para validar a experiência do
            site. Especificações, disponibilidade e valores serão substituídos pelo catálogo real da UPAR
            através do painel administrativo.
          </DemoNotice>
        </div>
      )}

      {/* -------------------------- Entenda esta máquina ------------------------- */}
      <Section id="entenda">
        <div className="container-page">
          <SectionHeader
            eyebrow="Entenda esta máquina"
            title="O que cada componente faz — e por que ele está aqui"
            description="Não é preciso dominar hardware para tomar uma boa decisão."
          />

          <ul className="mt-11 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {product.explainers.slice(0, 3).map((explainer) => (
              <li
                key={explainer.title}
                className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                  <Icon name={explainer.icon as IconName} className="size-5" />
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-medium text-white">{explainer.title}</h3>
                  <p className="mt-1 text-sm font-medium text-flux-300">{explainer.spec}</p>
                </div>
                <p className="text-sm leading-relaxed text-ink-300">{explainer.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------- O que este computador consegue fazer ----------------- */}
      <Section id="capacidades">
        <div className="container-page">
          <SectionHeader
            eyebrow="Aplicações práticas"
            title="O que este computador consegue fazer?"
            description="Cenários de uso compatíveis com esta configuração."
          />

          <ul className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.capabilities.slice(0, 3).map((capability) => (
              <li
                key={capability.title}
                className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-6"
              >
                <Icon name={capability.icon as IconName} className="size-5 text-flux-400" />
                <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{capability.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{capability.description}</p>
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-3xl text-sm leading-relaxed text-ink-400">
            A UPAR não publica velocidade de resposta, tempo de renderização ou compatibilidade com modelos
            específicos sem ter medido. Quando existir medição validada pela equipe técnica, ela aparece
            nesta página com o contexto do teste.
          </p>
        </div>
      </Section>

      {/* ----------------------------- Benchmarks -------------------------------- */}
      {validatedBenchmarks.length > 0 && (
        <Section id="medicoes" tone="raised">
          <div className="container-page">
            <SectionHeader
              eyebrow="Medições validadas"
              title="Resultados medidos pela equipe técnica da UPAR"
              description="Todos os números abaixo foram obtidos em teste interno, com o contexto descrito."
            />
            <ul className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {validatedBenchmarks.map((benchmark) => (
                <li key={benchmark.label} className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
                  <p className="text-sm text-ink-400">{benchmark.label}</p>
                  <p className="mt-1.5 text-2xl font-semibold text-white">{benchmark.value}</p>
                  {benchmark.context && <p className="mt-2 text-sm text-ink-300">{benchmark.context}</p>}
                  <p className="mt-3 text-xs text-ink-500">
                    Fonte: {benchmark.source}
                    {benchmark.measuredAt ? ` · ${benchmark.measuredAt}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* ------------------------ Configuração completa -------------------------- */}
      <Section id="configuracao" tone="raised">
        <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeader eyebrow="Ficha técnica" title="Configuração completa" />
            {product.highlights.length > 0 && (
              <ul className="mt-8 flex flex-col gap-4">
                {product.highlights.map((highlight) => (
                  <li key={highlight.title} className="flex gap-3">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-flux-400" />
                    <div>
                      <h3 className="text-[0.9375rem] font-medium text-white">{highlight.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-300">{highlight.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {fullSpecs.map((group) => (
              <div key={group.group} className="overflow-hidden rounded-xl border border-ink-700/70">
                <h3 className="border-b border-ink-700/60 bg-ink-850 px-5 py-3 text-sm font-semibold text-white">
                  {group.group}
                </h3>
                <dl className="divide-y divide-ink-700/50">
                  {group.rows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:gap-6">
                      <dt className="shrink-0 text-sm text-ink-400 sm:w-56">{row.label}</dt>
                      <dd className="text-sm text-ink-100">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------- Aplicações, expansão, garantia ---------------------- */}
      <Section id="indicacoes">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
            <h2 className="text-lg font-semibold text-white">Aplicações recomendadas</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Esta configuração foi dimensionada considerando as seguintes aplicações.
            </p>
            <ul className="mt-5 flex flex-col gap-2">
              {productApps.map((application) => (
                <li key={application.slug}>
                  <Link
                    href={`/solucoes/${application.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-ink-700/60 px-3.5 py-2.5 text-sm text-ink-100 transition-colors hover:border-brand-500/45 hover:text-white"
                  >
                    {application.name}
                    <Icon name="arrowRight" className="size-4 text-ink-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
            <h2 className="text-lg font-semibold text-white">Possibilidades de expansão</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              O que pode ser ampliado sem trocar o equipamento.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {product.expansion.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-ink-200">
                  <Icon name="upgrade" className="mt-0.5 size-4 shrink-0 text-flux-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
            <h2 className="text-lg font-semibold text-white">Garantia e serviços</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {product.services.map((service) => (
                <li key={service} className="flex gap-2.5 text-sm text-ink-200">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-flux-400" />
                  {service}
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-ink-700/60 pt-4">
              <h3 className="text-sm font-medium text-white">Garantia</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                {product.warranty ?? settings.warrantyPolicy}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------- Comparação com outras configurações ----------------- */}
      {/* -------------------------- Produtos relacionados ------------------------ */}
      {related.length > 0 && (
        <Section id="relacionados">
          <div className="container-page">
            <SectionHeader eyebrow="Também vale avaliar" title="Configurações relacionadas" />
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 2).map((item) => (
                <ProductCard key={item.id} product={item} applications={appIndex} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <FaqSection faqs={faqs} />

      <FinalCta
        title="Esta configuração atende o que você precisa executar?"
        description="Envie a sua aplicação para um especialista. Em poucos minutos você recebe uma validação técnica — ou uma alternativa mais adequada."
        context={{ kind: 'produto', product, application: primaryApplication }}
      />

      <ProductStickyCta product={product} applicationName={primaryApplication} />
      <div aria-hidden="true" className="h-16" />
    </>
  )
}
