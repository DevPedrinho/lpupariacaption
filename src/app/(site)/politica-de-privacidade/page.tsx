import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { Markdown } from '@/components/site/Markdown'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a UPAR AI coleta, usa e protege os dados pessoais informados no site.',
  alternates: { canonical: '/politica-de-privacidade' },
  robots: { index: false, follow: true },
}

export default async function PrivacyPage() {
  const settings = await getRepository().getSettings()

  const body = `## Quem é o controlador dos dados

${settings.legalName || settings.companyName}${settings.cnpj ? `, inscrita no CNPJ ${settings.cnpj}` : ''}, é a controladora dos dados pessoais tratados neste site, nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais).

## Quais dados coletamos

Coletamos apenas o que você nos informa de forma ativa e o mínimo necessário para o funcionamento do site:

- **Dados de contato** informados nos formulários: nome, telefone, e-mail, empresa ou instituição, cidade e estado.
- **Dados sobre a sua necessidade**: respostas do diagnóstico, aplicação pretendida, faixa de investimento e prazo.
- **Dados de navegação**: página de origem, parâmetros de campanha (UTM) e, mediante o seu consentimento, dados de medição de audiência.

## Para que usamos esses dados

- Responder à sua solicitação e apresentar uma recomendação técnica.
- Elaborar propostas comerciais.
- Entender como o site é utilizado e melhorar o conteúdo apresentado.

Não vendemos dados pessoais e não os compartilhamos com terceiros para finalidades publicitárias próprias deles.

## Base legal

O tratamento se apoia no seu consentimento, quando você marca a autorização no formulário, e no legítimo interesse para responder a solicitações comerciais que você mesmo iniciou.

## Cookies

Cookies essenciais garantem o funcionamento básico do site e são sempre utilizados. Cookies de medição só são ativados após o seu aceite no banner de consentimento. Você pode alterar a sua escolha a qualquer momento limpando os dados do site no seu navegador.

## Compartilhamento

Podemos utilizar fornecedores de tecnologia para hospedagem, banco de dados e medição de audiência. Esses fornecedores tratam os dados exclusivamente em nosso nome e conforme as nossas instruções.

## Por quanto tempo guardamos

Mantemos os dados enquanto durar o relacionamento comercial e pelo prazo necessário ao cumprimento de obrigações legais.

## Seus direitos

Você pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, bem como revogar o consentimento. Para isso, entre em contato pelos canais informados na página de contato.

## Alterações

Esta política pode ser atualizada. A versão vigente é sempre a publicada nesta página.`

  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Política de Privacidade"
        description="Transparência sobre quais dados o site coleta, por que coleta e o que você pode fazer a respeito."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Política de Privacidade' }]}
      />
      <Section>
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <DemoNotice className="mb-8">
              Texto <strong>preliminar</strong>, elaborado a partir da estrutura exigida pela LGPD. Precisa
              ser revisado pelo jurídico da UPAR e complementado com CNPJ, endereço e canal do encarregado de
              dados antes da publicação.
            </DemoNotice>
            <Markdown source={body} />
          </div>
        </div>
      </Section>
    </>
  )
}
