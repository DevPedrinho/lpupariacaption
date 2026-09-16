import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { Testimonials } from '@/components/home/Testimonials'
import { FinalCta } from '@/components/home/FinalCta'
import { breadcrumbSchema, organizationSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Sobre a UPAR',
  description:
    'Especialização em computadores de alta performance, upgrades e soluções personalizadas, agora aplicada a projetos de inteligência artificial.',
  alternates: { canonical: '/sobre' },
}

export default async function AboutPage() {
  const repo = getRepository()
  const [settings, testimonials] = await Promise.all([repo.getSettings(), repo.listTestimonials()])

  const blocks = [
    { icon: 'cpu' as const, title: 'Nossa origem', text: settings.aboutHistory },
    { icon: 'brain' as const, title: 'Como trabalhamos', text: settings.aboutExpertise },
    { icon: 'shield' as const, title: 'Estrutura e atendimento', text: settings.aboutStructure },
  ]

  const segments = [
    'Empresas implementando inteligência artificial',
    'Startups e times de produto',
    'Profissionais de machine learning e ciência de dados',
    'Agências de automação e tecnologia',
    'Engenharia, arquitetura e renderização',
    'Produtoras de vídeo e conteúdo generativo',
    'Universidades, laboratórios e centros de pesquisa',
    'Órgãos públicos e instituições de ensino',
  ]

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(settings),
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Sobre a UPAR', path: '/sobre' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Sobre a UPAR"
        title="Especialização em alta performance, aplicada à inteligência artificial"
        description="A UPAR construiu sua experiência montando computadores para trabalho pesado e executando upgrades em máquinas exigentes."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Sobre a UPAR' }]}
      />

      <Section>
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            {blocks.map((block) => (
              <article key={block.title} className="flex flex-col gap-4 rounded-xl border border-ink-700/70 bg-ink-880/60 p-7">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                  <Icon name={block.icon} className="size-5" />
                </span>
                <h2 className="text-lg font-semibold text-white">{block.title}</h2>
                <p className="text-[0.9375rem] leading-relaxed text-ink-300">{block.text}</p>
              </article>
            ))}
          </div>

          <DemoNotice className="mt-8 max-w-3xl">
            Esta página usa <strong>textos editáveis pelo painel administrativo</strong>. Números
            institucionais — tempo de mercado, quantidade de clientes atendidos, tamanho da equipe — não são
            exibidos porque ainda não foram informados pela UPAR. Assim que forem cadastrados, aparecem aqui.
          </DemoNotice>
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="Quem atendemos"
            title="Perfis que chegam até a UPAR"
            description="A necessidade muda bastante entre eles — o método de dimensionamento, não."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {segments.map((segment) => (
              <li
                key={segment}
                className="flex items-start gap-2.5 rounded-lg border border-ink-700/70 bg-ink-880/50 px-4 py-3.5 text-[0.9375rem] text-ink-200"
              >
                <Icon name="check" className="mt-1 size-4 shrink-0 text-flux-400" />
                {segment}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeader eyebrow="Serviços e garantias" title="O que acompanha cada equipamento" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-7">
              <h3 className="text-lg font-semibold text-white">Serviços</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  'Dimensionamento técnico a partir da aplicação',
                  'Montagem realizada pela equipe da UPAR',
                  'Testes de estabilidade sob carga antes da entrega',
                  'Instalação do sistema e do ambiente de trabalho',
                  'Orientação inicial de uso',
                  'Suporte com a equipe que montou o equipamento',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-200">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-flux-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-7">
              <h3 className="text-lg font-semibold text-white">Garantia</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-300">{settings.warrantyPolicy}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-400">
                As condições específicas variam conforme os componentes da configuração. Solicite as
                condições aplicáveis ao equipamento que você está avaliando.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Testimonials testimonials={testimonials} />

      <FinalCta
        title="Vamos conversar sobre o seu projeto?"
        description="Descreva a sua aplicação e receba um dimensionamento técnico proporcional à sua operação."
        context={{ kind: 'consultoria' }}
      />
    </>
  )
}
