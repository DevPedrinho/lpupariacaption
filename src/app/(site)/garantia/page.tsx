import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { Markdown } from '@/components/site/Markdown'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'

export const metadata: Metadata = {
  title: 'Política de Garantia',
  description: 'Prazos, cobertura e como acionar a garantia dos computadores, workstations e servidores da UPAR.',
  alternates: { canonical: '/garantia' },
}

/**
 * A política é escrita em cima do que a UPAR informou: 12 a 60 meses conforme
 * o produto, com o prazo exato na proposta e na nota fiscal. Nada aqui promete
 * tempo de resposta ou de reparo — esses números não foram medidos.
 */
export default async function WarrantyPage() {
  const settings = await getRepository().getSettings()
  const empresa = settings.legalName || settings.companyName

  const body = `## Prazo de garantia

Os equipamentos da UPAR têm garantia contratual de **12 a 60 meses, conforme o produto**. O prazo exato de cada configuração é informado na proposta comercial e na nota fiscal, e vale a partir da data de entrega.

Essa garantia contratual se soma à garantia legal de 90 dias prevista no Código de Defesa do Consumidor (art. 26) — ela não a substitui nem a reduz.

## O que a garantia cobre

- Defeitos de fabricação dos componentes fornecidos pela UPAR.
- Falhas de montagem, conexão ou configuração feitas pela nossa equipe.
- Instabilidade do sistema causada por incompatibilidade entre peças escolhidas por nós.

Durante o prazo, a UPAR repara ou substitui o componente com defeito sem custo de peça ou mão de obra. Se o componente exato não estiver mais disponível, a substituição é por equivalente ou superior, com o seu aceite.

## O que a garantia não cobre

- Danos por mau uso, queda, transporte inadequado, líquidos, poeira excessiva, oscilação ou falta de energia e descarga elétrica.
- Abertura, alteração ou reparo por terceiros, e remoção de lacres ou etiquetas de identificação.
- Peças de desgaste natural (pasta térmica, filtros, baterias) e limpeza de rotina.
- Problemas de software, sistema operacional, drivers, licenças, modelos ou dados. Dados não são cobertos: mantenha cópia de segurança.
- Componentes fornecidos pelo cliente e instalados a pedido dele.
- Uso fora das especificações informadas na proposta, como overclock não homologado pela UPAR.

## Como acionar

1. Fale com a UPAR pelo WhatsApp${settings.phone ? ` ou pelo telefone ${settings.phone}` : ''}, informando o número da nota fiscal e descrevendo o problema. Uma foto ou vídeo ajuda no diagnóstico.
2. Nossa equipe técnica faz uma primeira análise remota. Muitos casos se resolvem sem deslocamento.
3. Se for necessário, combinamos a entrega do equipamento${settings.addressLine ? ` na nossa loja (${settings.addressLine}${settings.city ? `, ${settings.city}` : ''})` : ''} ou o envio por transportadora. Dentro da garantia, o frete de retorno após o reparo é por conta da UPAR.
4. Ao final, você recebe o equipamento testado, com o registro do que foi feito.

## Suporte depois da garantia

Encerrado o prazo, a UPAR continua atendendo: diagnóstico, reparo e upgrade são orçados caso a caso. Quem atende é a mesma equipe que dimensionou e montou a máquina.

## Responsável

${empresa}${settings.cnpj ? `, CNPJ ${settings.cnpj}` : ''}${settings.stateRegistration ? `, I.E. ${settings.stateRegistration}` : ''}${settings.addressLine ? `, ${settings.addressLine}` : ''}${settings.city ? ` — ${settings.city}${settings.state ? `/${settings.state}` : ''}` : ''}.`

  return (
    <>
      <PageHero
        eyebrow="Garantia"
        title="Política de Garantia"
        description="Prazos, cobertura e como acionar. O prazo exato de cada configuração está na proposta e na nota fiscal."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Política de Garantia' }]}
      />
      <Section>
        <div className="container-page">
          <article className="mx-auto max-w-3xl">
            <Markdown source={body} />
            <div className="mt-10 rounded-xl border border-ink-700/70 bg-ink-880/60 p-6">
              <p className="text-[0.9375rem] text-ink-200">Precisa acionar a garantia ou tirar uma dúvida?</p>
              <div className="mt-4">
                <WhatsAppCta context={{ kind: 'geral' }} size="md">
                  Falar com a UPAR
                </WhatsAppCta>
              </div>
            </div>
          </article>
        </div>
      </Section>
    </>
  )
}
