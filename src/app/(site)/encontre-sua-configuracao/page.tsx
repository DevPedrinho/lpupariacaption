import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { DiagnosticWizard } from '@/components/diagnostic/DiagnosticWizard'
import { normalizeQuestions } from '@/lib/diagnostic'
import { PageHero } from '@/components/site/PageHero'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbSchema } from '@/lib/schema'
import { Icon } from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: 'Encontre sua configuração',
  description:
    'Cinco perguntas rápidas sobre a sua aplicação e a UPAR AI indica a categoria de computador compatível, com até três configurações relacionadas.',
  alternates: { canonical: '/encontre-sua-configuracao' },
}

const STEPS = [
  { icon: 'sliders' as const, label: 'Cinco perguntas objetivas', detail: 'Leva menos de um minuto.' },
  { icon: 'spark' as const, label: 'Categoria indicada', detail: 'Com até três equipamentos relacionados.' },
  { icon: 'whatsapp' as const, label: 'Validação com especialista', detail: 'A recomendação é conferida antes da proposta.' },
]

export default async function DiagnosticPage() {
  const repo = getRepository()
  const [products, applications, settings] = await Promise.all([
    repo.listProducts(),
    repo.listApplications(),
    repo.getSettings(),
  ])
  const questions = normalizeQuestions(settings.diagnosticQuestions)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', path: '/' },
          { name: 'Encontre sua configuração', path: '/encontre-sua-configuracao' },
        ])}
      />
      <PageHero
        eyebrow="Diagnóstico"
        title="Encontre a configuração certa para a sua aplicação"
        description="Responder é rápido e não gera compromisso. No final você recebe uma categoria indicada, até três configurações relacionadas e a opção de enviar tudo para um especialista."
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Encontre sua configuração' }]}
      >
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.label}
              className="flex items-start gap-3 rounded-xl border border-ink-700/70 bg-ink-880/50 p-4"
            >
              <Icon name={step.icon} className="mt-0.5 size-5 shrink-0 text-flux-400" />
              <div>
                <p className="text-[0.9375rem] font-medium text-white">{step.label}</p>
                <p className="mt-0.5 text-sm text-ink-400">{step.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </PageHero>

      <div className="pt-12">
        <DiagnosticWizard products={products} applications={applications} questions={questions} />
      </div>
    </>
  )
}
