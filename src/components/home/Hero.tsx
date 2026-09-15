'use client'

import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { MachineRender } from '@/components/site/MachineRender'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { useSiteConfig } from '@/components/site/SiteConfig'

const TRUST = [
  'Consultoria técnica antes da proposta',
  'Configuração dimensionada pela sua aplicação',
  'Montagem e testes pela equipe UPAR',
]

const FLOATING = [
  { label: 'VRAM', value: 'até 192 GB', icon: 'memory' as const, position: 'top-[14%] -left-2 md:left-0' },
  { label: 'GPUs', value: 'até 4 placas', icon: 'gpu' as const, position: 'top-[46%] -right-1 md:-right-4' },
  { label: 'Memória', value: 'até 512 GB', icon: 'cpu' as const, position: 'bottom-[13%] left-2 md:left-4' },
]

export function Hero() {
  const settings = useSiteConfig()

  return (
    <section className="relative isolate overflow-hidden">
      {/* Camadas de fundo: malha de dados, brilho de marca e vinheta */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 grid-mesh opacity-[0.55]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[42rem] w-[72rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl animate-slow-pulse"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(55,219,154,0.32), rgba(130,208,228,0.14) 42%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 0%, transparent 30%, #05070E 100%)' }}
      />

      <div className="container-page grid items-center gap-12 pt-14 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.08fr_1fr] lg:gap-8 lg:pt-24">
        <div className="flex flex-col items-start gap-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-2xs font-medium tracking-[0.08em] text-brand-200 uppercase">
            <Icon name="spark" className="size-3.5" />
            {settings.heroBadge}
          </span>

          <h1 className="max-w-2xl text-[1.95rem] leading-[1.1] font-semibold min-[420px]:text-[2.2rem] sm:text-[2.75rem] sm:leading-[1.08] lg:text-[3.35rem]">
            Potência computacional para transformar{' '}
            <span className="text-gradient">Inteligência Artificial</span> em resultado.
          </h1>

          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-ink-300 md:text-lg">
            {settings.heroSubtitle}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/encontre-sua-configuracao" size="lg">
              Encontrar minha configuração
              <Icon name="arrowRight" />
            </ButtonLink>
            <WhatsAppCta context={{ kind: 'geral' }} size="lg">
              Falar com especialista
            </WhatsAppCta>
          </div>

          <ul className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-ink-300">
                <Icon name="check" className="size-4 shrink-0 text-flux-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-8 -z-10 rounded-full opacity-70 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(55,219,154,0.38), rgba(130,208,228,0.12) 55%, transparent 72%)',
            }}
          />
          <div className="mx-auto h-[24rem] w-[19rem] animate-rise sm:h-[30rem] sm:w-[24rem] lg:h-[34rem] lg:w-[27rem]">
            <MachineRender variant="tower-glass" gpuCount={3} />
          </div>

          {FLOATING.map((chip) => (
            <div
              key={chip.label}
              className={`absolute ${chip.position} flex items-center gap-2.5 rounded-lg border border-ink-600/70 bg-ink-900/85 px-3 py-2 shadow-lift backdrop-blur-md`}
            >
              <Icon name={chip.icon} className="size-4 text-flux-400" />
              <span className="text-2xs tracking-[0.08em] text-ink-400 uppercase">{chip.label}</span>
              <span className="text-sm font-medium text-white">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="container-page -mt-6 pb-12 text-xs text-ink-500 md:-mt-10">
        Ilustração técnica. Os limites indicados referem-se às configurações mais densas da linha — cada
        projeto é dimensionado individualmente.
      </p>
    </section>
  )
}
