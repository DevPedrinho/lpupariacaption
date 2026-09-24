import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { FaqSection } from '@/components/home/FaqSection'
import { FinalCta } from '@/components/home/FinalCta'
import { differentials } from '@/data/process'
import { ConsultingTimeline } from '@/components/site/ConsultingTimeline'
import { breadcrumbSchema, faqSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Consultoria técnica para computadores de IA',
  description:
    'Do entendimento da necessidade à entrega: conheça o processo de dimensionamento da UPAR.',
  alternates: { canonical: '/consultoria' },
}

export default async function ConsultingPage() {
  const repo = getRepository()
  const faqs = await repo.listFaqs('consultoria')
  const generalFaqs = await repo.listFaqs('geral')
  const allFaqs = [...faqs, ...generalFaqs]

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Consultoria', path: '/consultoria' },
          ]),
          ...(allFaqs.length > 0 ? [faqSchema(allFaqs)] : []),
        ]}
      />

      <PageHero
        eyebrow="Consultoria UPAR"
        title="Converse com quem entende sua aplicação"
        description="A configuração certa não sai de uma tabela de preços."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Consultoria' }]}
        actions={
          <>
            <WhatsAppCta context={{ kind: 'consultoria' }} size="lg">
              Iniciar conversa
            </WhatsAppCta>
            <ButtonLink href="/encontre-sua-configuracao" variant="secondary" size="lg">
              Fazer o diagnóstico
            </ButtonLink>
          </>
        }
      />

      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="O processo"
            title="Sete etapas, do primeiro contato ao acompanhamento"
            description="Nenhuma delas depende de você entender de hardware. Abra a que quiser conhecer melhor."
          />

          <div className="mt-12">
            <ConsultingTimeline />
          </div>
        </div>
      </Section>

      <Section tone="raised">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            eyebrow="O que levar para a conversa"
            title="Quatro informações encurtam muito o caminho"
            description="Não precisa ter tudo definido. Quanto mais claro o cenário, mais precisa a proposta."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ul className="flex flex-col gap-3">
            {[
              {
                title: 'Quais programas e modelos você usa',
                description:
                  'É a informação mais valiosa. Ela define onde o investimento faz diferença e onde não faz.',
              },
              {
                title: 'Quantas pessoas vão usar e quando',
                description:
                  'Uso individual e uso compartilhado levam a projetos diferentes, mesmo com a mesma aplicação.',
              },
              {
                title: 'O volume de dados envolvido',
                description:
                  'Orienta memória e armazenamento, que costumam ser subdimensionados em projetos de IA.',
              },
              {
                title: 'O horizonte de crescimento',
                description:
                  'Se o uso vai crescer, fonte, chassi e plataforma são escolhidos pensando no próximo passo.',
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3.5 rounded-xl border border-ink-700/70 bg-ink-880/50 p-5">
                <Icon name="check" className="mt-1 size-4 shrink-0 text-flux-400" />
                <div>
                  <h3 className="text-[1.0625rem] font-medium text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-300">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="Compromissos"
            title="Como a UPAR trabalha"
          />
          <ul className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {differentials.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
                <Icon name={item.icon} className="size-5 text-brand-300" />
                <h3 className="text-[1.0625rem] leading-snug font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-300">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FaqSection faqs={allFaqs} />

      <FinalCta
        title="Converse com quem entende sua aplicação"
        description="Sem formulário longo e sem compromisso. Descreva a sua necessidade e a conversa técnica começa na hora."
        context={{ kind: 'consultoria' }}
        showDiagnostic
      />
    </>
  )
}
