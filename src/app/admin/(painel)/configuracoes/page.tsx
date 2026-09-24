import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { carregar } from '@/lib/admin-carregar'
import { defaultSettings } from '@/data/content'
import { AdminHeader, AvisoGravacao, AvisoCarregamento, Panel } from '@/components/admin/ui'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Icon } from '@/components/ui/Icon'
import { saveSettings } from '../../actions'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const area =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

function Row({
  id,
  label,
  hint,
  children,
  full,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : undefined}>
      <label htmlFor={id} className="mb-1.5 block">
        <span className="text-xs font-medium text-ink-300">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink-500">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('configuracoes')
  const { salvo, erro } = await searchParams
  const { dados, falhas } = await carregar(
    { settings: getRepository().getSettings() },
    { settings: defaultSettings },
    { settings: 'Configurações' },
  )
  const { settings } = dados

  return (
    <>
      <AdminHeader
        title="Configurações"
        description="Dados de contato, textos da home, política de garantia, SEO e ferramentas de mensuração."
      />

      <AvisoCarregamento falhas={falhas} className="mb-5" />
      <AvisoGravacao erro={erro} className="mb-5" />

      {salvo && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Configurações salvas. As alterações já valem para o site público.
          </p>
        </Panel>
      )}

      <form action={saveSettings} className="flex flex-col gap-5">
        <Panel>
          <h2 className="mb-5 text-base font-semibold text-white">WhatsApp</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Row
              id="whatsappNumber"
              label="Número do WhatsApp"
              hint="Somente dígitos, com código do país e DDD. Exemplo: 5585999999999."
            >
              <input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsappNumber} className={input} />
            </Row>
            <Row id="whatsappGreeting" label="Mensagem padrão" hint="Usada quando não há contexto específico de página.">
              <input id="whatsappGreeting" name="whatsappGreeting" defaultValue={settings.whatsappGreeting} className={input} />
            </Row>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            As mensagens das páginas de produto, do comparativo e do diagnóstico são montadas automaticamente
            com o contexto da origem do clique.
          </p>
        </Panel>

        <Panel>
          <h2 className="mb-5 text-base font-semibold text-white">Dados da empresa</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Row id="companyName" label="Nome de exibição">
              <input id="companyName" name="companyName" defaultValue={settings.companyName} className={input} />
            </Row>
            <Row id="legalName" label="Razão social">
              <input id="legalName" name="legalName" defaultValue={settings.legalName} className={input} />
            </Row>
            <Row id="cnpj" label="CNPJ">
              <input id="cnpj" name="cnpj" defaultValue={settings.cnpj} className={input} />
            </Row>
            <Row id="stateRegistration" label="Inscrição estadual">
              <input id="stateRegistration" name="stateRegistration" defaultValue={settings.stateRegistration} className={input} />
            </Row>
            <Row id="email" label="E-mail público">
              <input id="email" name="email" type="email" defaultValue={settings.email} className={input} />
            </Row>
            <Row id="phone" label="Telefone público">
              <input id="phone" name="phone" defaultValue={settings.phone} className={input} />
            </Row>
            <Row id="businessHours" label="Horário de atendimento">
              <input id="businessHours" name="businessHours" defaultValue={settings.businessHours} className={input} />
            </Row>
            <Row id="addressLine" label="Endereço" full>
              <input id="addressLine" name="addressLine" defaultValue={settings.addressLine} className={input} />
            </Row>
            <Row id="city" label="Cidade">
              <input id="city" name="city" defaultValue={settings.city} className={input} />
            </Row>
            <Row id="state" label="Estado (UF)">
              <input id="state" name="state" maxLength={2} defaultValue={settings.state} className={input} />
            </Row>
            <Row id="instagram" label="Instagram (URL)">
              <input id="instagram" name="instagram" defaultValue={settings.instagram} className={input} />
            </Row>
            <Row id="linkedin" label="LinkedIn (URL)">
              <input id="linkedin" name="linkedin" defaultValue={settings.linkedin} className={input} />
            </Row>
            <Row id="youtube" label="YouTube (URL)">
              <input id="youtube" name="youtube" defaultValue={settings.youtube} className={input} />
            </Row>
            <Row id="facebook" label="Facebook (URL)">
              <input id="facebook" name="facebook" defaultValue={settings.facebook} className={input} />
            </Row>
            <Row id="paymentMethods" label="Formas de pagamento" hint="Uma por linha. Aparecem no rodapé.">
              <textarea id="paymentMethods" name="paymentMethods" rows={3} defaultValue={settings.paymentMethods.join('\n')} className={area} />
            </Row>
            <Row id="installmentNote" label="Parcelamento" hint="Ex.: Em até 21x sem juros. Deixe vazio para não mostrar.">
              <input id="installmentNote" name="installmentNote" defaultValue={settings.installmentNote} className={input} />
            </Row>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-5 text-base font-semibold text-white">Textos da home e institucionais</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Row id="heroBadge" label="Selo acima do título">
              <input id="heroBadge" name="heroBadge" defaultValue={settings.heroBadge} className={input} />
            </Row>
            <Row id="heroTitle" label="Título principal">
              <input id="heroTitle" name="heroTitle" defaultValue={settings.heroTitle} className={input} />
            </Row>
            <Row id="heroSubtitle" label="Subtítulo" full>
              <textarea id="heroSubtitle" name="heroSubtitle" rows={2} defaultValue={settings.heroSubtitle} className={area} />
            </Row>
            <Row id="consultantPhotoUrl" label="Foto do especialista (URL)" full>
              <input
                id="consultantPhotoUrl"
                name="consultantPhotoUrl"
                defaultValue={settings.consultantPhotoUrl}
                placeholder="/equipe/nome.jpg ou URL do Supabase Storage"
                className={input}
              />
              <p className="mt-1.5 text-2xs text-ink-400">
                Aparece no convite de consultoria da home. Enquanto estiver vazio, a seção mostra a marca no
                lugar da foto — nunca uma pessoa que não seja da equipe.
              </p>
            </Row>
            <Row id="consultantName" label="Nome de quem aparece na foto">
              <input id="consultantName" name="consultantName" defaultValue={settings.consultantName} className={input} />
            </Row>
            <Row id="consultantRole" label="Cargo de quem aparece na foto">
              <input id="consultantRole" name="consultantRole" defaultValue={settings.consultantRole} className={input} />
            </Row>
            <Row id="aboutHistory" label="História da empresa" full>
              <textarea id="aboutHistory" name="aboutHistory" rows={3} defaultValue={settings.aboutHistory} className={area} />
            </Row>
            <Row id="aboutExpertise" label="Como a UPAR trabalha" full>
              <textarea id="aboutExpertise" name="aboutExpertise" rows={3} defaultValue={settings.aboutExpertise} className={area} />
            </Row>
            <Row id="aboutStructure" label="Estrutura e atendimento" full>
              <textarea id="aboutStructure" name="aboutStructure" rows={3} defaultValue={settings.aboutStructure} className={area} />
            </Row>
            <Row id="warrantyPolicy" label="Garantia (resumo)" hint="Exibida nas páginas de produto que não têm garantia específica. A política completa fica em /garantia." full>
              <textarea id="warrantyPolicy" name="warrantyPolicy" rows={2} defaultValue={settings.warrantyPolicy} className={area} />
            </Row>
            <Row
              id="caseStudies"
              label="Casos atendidos"
              hint="Um por linha: Segmento | Título | Texto. Só publique com autorização do cliente. Vazio = a seção não aparece."
              full
            >
              <textarea
                id="caseStudies"
                name="caseStudies"
                rows={4}
                placeholder="Universidade | Laboratório de visão computacional em Fortaleza | Workstation com duas placas profissionais para treinar modelos de inspeção de imagens."
                defaultValue={settings.caseStudies.map((item) => `${item.segment} | ${item.title} | ${item.text}`).join('\n')}
                className={area}
              />
            </Row>
            <div className="md:col-span-2">
              <label className="flex items-start gap-3 text-sm text-ink-200">
                <input
                  type="checkbox"
                  name="showTestimonials"
                  defaultChecked={settings.showTestimonials}
                  className="mt-0.5 size-4 rounded border-ink-600 bg-ink-900 accent-brand-500"
                />
                <span>
                  Mostrar a seção de depoimentos na home
                  <span className="mt-0.5 block text-xs text-ink-500">
                    Desmarque enquanto só houver depoimentos demonstrativos. Anúncio não deve cair em página com aviso de demonstração.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </Panel>

        <Panel>
          <h2 className="mb-5 text-base font-semibold text-white">SEO e mensuração</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Row id="seoTitle" label="Título padrão do site" full>
              <input id="seoTitle" name="seoTitle" defaultValue={settings.seoTitle} className={input} />
            </Row>
            <Row id="seoDescription" label="Descrição padrão do site" full>
              <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={settings.seoDescription} className={area} />
            </Row>
            <Row id="ga4Id" label="Google Analytics 4">
              <input id="ga4Id" name="ga4Id" placeholder="G-XXXXXXXXXX" defaultValue={settings.ga4Id} className={input} />
            </Row>
            <Row id="gtmId" label="Google Tag Manager">
              <input id="gtmId" name="gtmId" placeholder="GTM-XXXXXXX" defaultValue={settings.gtmId} className={input} />
            </Row>
            <Row id="metaPixelId" label="Meta Pixel">
              <input id="metaPixelId" name="metaPixelId" defaultValue={settings.metaPixelId} className={input} />
            </Row>
            <Row id="googleAdsId" label="Google Ads (ID de conversão)">
              <input id="googleAdsId" name="googleAdsId" placeholder="AW-XXXXXXXXX" defaultValue={settings.googleAdsId} className={input} />
            </Row>
            <Row
              id="adsConversionWhatsapp"
              label="Rótulo de conversão: clique no WhatsApp"
              hint="Só a parte depois da barra no código da ação de conversão. Ex.: AbCdEfGhIjK-1"
            >
              <input id="adsConversionWhatsapp" name="adsConversionWhatsapp" defaultValue={settings.adsConversionWhatsapp} className={input} />
            </Row>
            <Row
              id="adsConversionLead"
              label="Rótulo de conversão: lead do formulário"
              hint="Ação de conversão separada, para o Ads distinguir formulário de WhatsApp."
            >
              <input id="adsConversionLead" name="adsConversionLead" defaultValue={settings.adsConversionLead} className={input} />
            </Row>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            As tags do Google carregam em modo anônimo (Consent Mode v2) e só usam cookies depois que o
            visitante aceita no banner. O Meta Pixel segue a mesma regra.
          </p>
        </Panel>

        <Panel>
          <h2 className="mb-2 text-base font-semibold text-white">Pendências de dados reais</h2>
          <p className="mb-4 text-sm leading-relaxed text-ink-300">
            Esta lista aparece na visão geral do painel. Remova cada linha conforme a informação real for
            cadastrada.
          </p>
          <textarea
            id="pendingRealData"
            name="pendingRealData"
            rows={12}
            defaultValue={settings.pendingRealData.join('\n')}
            className={`${area} text-[0.8125rem]`}
          />
        </Panel>

        <div>
          <SubmitButton>Salvar configurações</SubmitButton>
        </div>
      </form>
    </>
  )
}
