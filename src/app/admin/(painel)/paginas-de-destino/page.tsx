import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { carregar } from '@/lib/admin-carregar'
import { defaultSettings } from '@/data/content'
import { LANDING_LABELS, LANDING_SLUGS, defaultLandingPages } from '@/data/landing'
import { AdminHeader, AvisoCarregamento, AvisoGravacao, Panel } from '@/components/admin/ui'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Icon } from '@/components/ui/Icon'
import { saveLandingPages } from '../../actions'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const area =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

function Row({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block">
        <span className="text-xs font-medium text-ink-300">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-ink-500">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

export default async function LandingPagesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('configuracoes')
  const { salvo, erro } = await searchParams
  const { dados, falhas } = await carregar(
    { settings: getRepository().getSettings() },
    { settings: defaultSettings },
    { settings: 'Páginas de destino' },
  )
  const pages = dados.settings.landingPages ?? defaultLandingPages

  return (
    <>
      <AdminHeader
        title="Páginas de destino"
        description="Uma página por público, para os anúncios. Sem menu e com dois caminhos: WhatsApp ou formulário. Só escreva vantagem que a UPAR cumpre sempre."
      />

      <AvisoCarregamento falhas={falhas} className="mb-5" />
      <AvisoGravacao erro={erro} className="mb-5" />

      {salvo && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Páginas salvas. Os anúncios já apontam para o texto novo.
          </p>
        </Panel>
      )}

      <form action={saveLandingPages} className="flex flex-col gap-5">
        {LANDING_SLUGS.map((slug) => {
          const copy = pages[slug] ?? defaultLandingPages[slug]
          return (
            <Panel key={slug}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-white">{LANDING_LABELS[slug]}</h2>
                <a
                  href={`/lp/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-flux-300 hover:text-white"
                >
                  Abrir /lp/{slug}
                  <Icon name="external" className="size-3.5" />
                </a>
              </div>
              <div className="grid gap-4">
                <Row id={`${slug}.eyebrow`} label="Selo acima do título">
                  <input id={`${slug}.eyebrow`} name={`${slug}.eyebrow`} defaultValue={copy.eyebrow} className={input} />
                </Row>
                <Row id={`${slug}.title`} label="Título (H1)" hint="É o que o anúncio promete. Curto e específico.">
                  <input id={`${slug}.title`} name={`${slug}.title`} defaultValue={copy.title} className={input} />
                </Row>
                <Row id={`${slug}.subtitle`} label="Subtítulo">
                  <textarea id={`${slug}.subtitle`} name={`${slug}.subtitle`} rows={2} defaultValue={copy.subtitle} className={area} />
                </Row>
                <Row id={`${slug}.bullets`} label="Vantagens" hint="Uma por linha, até seis. Só o que é verdade sempre.">
                  <textarea id={`${slug}.bullets`} name={`${slug}.bullets`} rows={5} defaultValue={copy.bullets.join('\n')} className={area} />
                </Row>
                <div className="grid gap-4 md:grid-cols-2">
                  <Row id={`${slug}.ctaLabel`} label="Texto do botão do WhatsApp">
                    <input id={`${slug}.ctaLabel`} name={`${slug}.ctaLabel`} defaultValue={copy.ctaLabel} className={input} />
                  </Row>
                  <Row id={`${slug}.note`} label="Observação abaixo dos botões" hint="Opcional.">
                    <input id={`${slug}.note`} name={`${slug}.note`} defaultValue={copy.note ?? ''} className={input} />
                  </Row>
                </div>
              </div>
            </Panel>
          )
        })}

        <div>
          <SubmitButton>Salvar páginas</SubmitButton>
        </div>
      </form>
    </>
  )
}
