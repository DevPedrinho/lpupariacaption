import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { Markdown } from '@/components/site/Markdown'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Condições de uso do site da UPAR AI.',
  alternates: { canonical: '/termos-de-uso' },
  robots: { index: false, follow: true },
}

export default async function TermsPage() {
  const settings = await getRepository().getSettings()

  const body = `## Aceite

Ao navegar neste site você concorda com estas condições. Se não concordar, recomendamos não utilizá-lo.

## Finalidade do site

Este site apresenta configurações de computadores, workstations e servidores e oferece ferramentas de apoio à decisão, como o diagnóstico e o comparador. Ele não realiza vendas online: todo atendimento comercial acontece por meio de contato direto com a equipe da ${settings.companyName}.

## Natureza das informações técnicas

As configurações exibidas são pontos de partida e podem ser ajustadas. As indicações do diagnóstico e do comparador são orientativas e **precisam ser validadas por um especialista** antes de qualquer decisão de compra.

Não publicamos medições de desempenho que não tenham sido realizadas e validadas pela nossa equipe técnica. Quando um número de desempenho aparece no site, ele vem acompanhado do contexto do teste.

## Preços e disponibilidade

Valores e disponibilidade podem mudar sem aviso, inclusive em função da variação de preço dos componentes. Configurações marcadas como "sob consulta" têm o investimento informado apenas na proposta comercial.

## Propriedade intelectual

Marca, textos, imagens e demais elementos deste site pertencem à ${settings.legalName || settings.companyName} ou aos seus respectivos titulares. É vedada a reprodução sem autorização.

## Links e serviços de terceiros

O site direciona o atendimento para o WhatsApp e pode utilizar ferramentas de medição de terceiros. O uso desses serviços está sujeito às políticas dos respectivos fornecedores.

## Limitação de responsabilidade

A ${settings.companyName} não se responsabiliza por decisões tomadas exclusivamente a partir das informações orientativas do site, sem a validação técnica prevista no processo de consultoria.

## Foro e alterações

Estes termos podem ser atualizados a qualquer momento. Aplica-se a legislação brasileira.`

  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Termos de Uso"
        description="Condições que regem a utilização deste site e o alcance das informações técnicas publicadas."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Termos de Uso' }]}
      />
      <Section>
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <DemoNotice className="mb-8">
              Texto <strong>preliminar</strong>. Precisa de revisão jurídica e da indicação do foro antes da
              publicação.
            </DemoNotice>
            <Markdown source={body} />
          </div>
        </div>
      </Section>
    </>
  )
}
