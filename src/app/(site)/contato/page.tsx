import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { LeadForm } from '@/components/forms/LeadForm'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com um especialista da UPAR AI sobre computadores, workstations e servidores para inteligência artificial.',
  alternates: { canonical: '/contato' },
}

export default async function ContactPage() {
  const repo = getRepository()
  const [settings, applications] = await Promise.all([repo.getSettings(), repo.listApplications()])
  const appIndex = applications.map(({ slug, name }) => ({ slug, name }))

  const channels = [
    settings.email && { icon: 'mail' as const, label: 'E-mail', value: settings.email },
    settings.phone && { icon: 'phone' as const, label: 'Telefone', value: settings.phone },
    (settings.addressLine || settings.city) && {
      icon: 'pin' as const,
      label: 'Endereço',
      value: [settings.addressLine, settings.city, settings.state].filter(Boolean).join(' — '),
    },
    settings.businessHours && {
      icon: 'clock' as const,
      label: 'Atendimento',
      value: settings.businessHours,
    },
  ].filter(Boolean) as { icon: 'mail' | 'phone' | 'pin' | 'clock'; label: string; value: string }[]

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Contato', path: '/contato' },
        ])}
      />

      <PageHero
        eyebrow="Contato"
        title="Fale com um especialista da UPAR"
        description="O WhatsApp costuma ser o caminho mais rápido. Se preferir, use o formulário — a equipe comercial retorna o contato."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Contato' }]}
      />

      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          <LeadForm applications={appIndex} origin="contato" />

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-7">
              <Icon name="whatsapp" className="size-6 text-[#1FA855]" />
              <h2 className="mt-4 text-lg font-semibold text-white">Atendimento pelo WhatsApp</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-300">
                Fale direto com a equipe técnica. É o canal mais rápido para dimensionamento e orçamento.
              </p>
              <WhatsAppCta context={{ kind: 'consultoria' }} size="md" className="mt-5 w-full">
                Abrir conversa
              </WhatsAppCta>
            </div>

            {channels.length > 0 && (
              <div className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-7">
                <h2 className="text-lg font-semibold text-white">Outros canais</h2>
                <dl className="mt-5 flex flex-col gap-4">
                  {channels.map((channel) => (
                    <div key={channel.label} className="flex items-start gap-3">
                      <Icon name={channel.icon} className="mt-0.5 size-4 shrink-0 text-flux-400" />
                      <div>
                        <dt className="text-xs text-ink-400">{channel.label}</dt>
                        <dd className="text-[0.9375rem] text-ink-100">{channel.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="rounded-xl border border-ink-700/70 bg-ink-880/40 p-7">
              <h2 className="text-base font-semibold text-white">Compras institucionais</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Universidades, institutos e órgãos públicos podem solicitar a documentação técnica para o
                processo de compra.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
