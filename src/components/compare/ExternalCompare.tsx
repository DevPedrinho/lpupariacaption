'use client'

import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'

const STEPS = [
  {
    title: 'Manda o print',
    description: 'A página do anúncio, a ficha técnica ou só a foto da configuração. Serve qualquer uma.',
  },
  {
    title: 'A gente lê a configuração',
    description: 'Conferimos o que aquela máquina entrega de verdade para o que você pretende executar.',
  },
  {
    title: 'Você recebe o comparativo',
    description: 'O que muda, o que permanece e o que a UPAR faria diferente. Com a justificativa de cada ponto.',
  },
]

/**
 * Seis pontos que a UPAR controla e que um anúncio genérico não contempla.
 *
 * O texto fala do processo da UPAR, nunca do concorrente: não há marca citada,
 * nem afirmação sobre a qualidade de quem anuncia. E não há promessa de preço
 * menor — ver a nota logo abaixo da lista, na própria página.
 */
const IMPROVEMENTS = [
  {
    icon: 'brain' as const,
    title: 'Dimensionado para a sua aplicação',
    description: 'O anúncio foi montado para um comprador genérico. A sua configuração parte do que você vai rodar.',
  },
  {
    icon: 'memory' as const,
    title: 'VRAM conferida contra o seu modelo',
    description: 'É o número que mais decide e o que menos aparece no anúncio. Conferimos antes de propor.',
  },
  {
    icon: 'layers' as const,
    title: 'Conjunto equilibrado',
    description: 'Processador, memória e armazenamento escolhidos para acompanhar a placa, não para constar na ficha.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Expansão já no projeto',
    description: 'Chassi, fonte e placa-mãe com espaço para o próximo passo, em vez de fechados no limite de hoje.',
  },
  {
    icon: 'cooling' as const,
    title: 'Montagem e teste sob carga',
    description: 'A máquina é montada pela nossa equipe e testada sob carga antes de sair da bancada.',
  },
  {
    icon: 'shield' as const,
    title: 'Suporte com quem dimensionou',
    description: 'Quem atende depois da entrega conhece a sua máquina e sabe por que cada peça está ali.',
  },
]

/**
 * Fluxo principal do comparador: o visitante chega com um anúncio que encontrou
 * na internet e a UPAR devolve o comparativo. A comparação lado a lado entre
 * configurações nossas continua logo abaixo, como ferramenta secundária.
 */
export function ExternalCompare() {
  return (
    <Section id="traga-seu-print" tone="raised">
      <div className="container-page">
        <SectionHeader
          align="center"
          eyebrow="Achou em outro site?"
          title={
            <>
              Manda o print. A gente diz{' '}
              <span className="text-gradient">o que entregamos no lugar</span>
            </>
          }
          description="Você encontrou um computador anunciado como bom para IA e quer saber se ele resolve o seu caso. É exatamente essa conversa."
        />

        {/* Como funciona, em três passos */}
        <ol className="mt-11 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6"
            >
              <span
                aria-hidden="true"
                className="inline-flex size-9 items-center justify-center rounded-full bg-brand-500/12 font-display text-sm font-semibold text-brand-300 ring-1 ring-brand-500/25 ring-inset"
              >
                {index + 1}
              </span>
              <h3 className="text-[1.0625rem] leading-snug font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-300">{step.description}</p>
            </li>
          ))}
        </ol>

        {/* O que muda comprando com a UPAR */}
        <div className="mt-14">
          <h3 className="text-center text-xl font-semibold text-white md:text-2xl">
            Seis coisas que entram no comparativo
          </h3>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMPROVEMENTS.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/60 p-5"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h4 className="text-[0.9375rem] leading-snug font-medium text-white">{item.title}</h4>
                <p className="text-sm leading-relaxed text-ink-300">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Chamada e a ressalva honesta */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <WhatsAppCta context={{ kind: 'comparativo-externo' }} size="lg">
            Falar com um consultor
          </WhatsAppCta>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-400">
            Não prometemos ser sempre mais baratos que o anúncio que você encontrou. Prometemos que você vai
            saber exatamente o que está comprando — e, se a máquina do anúncio resolver o seu caso, vamos
            dizer isso também.
          </p>
        </div>
      </div>
    </Section>
  )
}
