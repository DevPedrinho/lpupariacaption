'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Checkbox, Field, Input } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { ProductCard } from '@/components/catalog/ProductCard'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { track, readUtm } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { OUTRO_LABEL, TIER_SUMMARY, recommendProducts, recommendTier } from '@/lib/diagnostic'
import { tierLabel } from '@/lib/format'
import type { Application, DiagnosticAnswers, DiagnosticQuestion, PerformanceTier, Product } from '@/lib/types'

type Contact = {
  name: string
  company: string
  phone: string
  email: string
  city: string
  state: string
  consent: boolean
}

const emptyContact: Contact = {
  name: '', company: '', phone: '', email: '', city: '', state: '', consent: false,
}

export function DiagnosticWizard({
  products,
  applications,
  questions,
}: {
  products: Product[]
  applications: Application[]
  /** Template editável no painel: cinco perguntas, quatro opções e "Outro". */
  questions: DiagnosticQuestion[]
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<DiagnosticAnswers>({})
  /*
   * "Outro" é uma escolha com campo livre. Guardamos separado quais perguntas
   * estão em "Outro" porque a resposta em si é o texto digitado — e um texto
   * vazio ainda precisa manter o botão marcado enquanto a pessoa escreve.
   */
  const [outros, setOutros] = useState<Record<string, boolean>>({})
  const [contact, setContact] = useState<Contact>(emptyContact)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const startedRef = useRef(false)
  const topRef = useRef<HTMLDivElement>(null)

  const totalSteps = questions.length + 1
  const appIndex = useMemo(() => applications.map(({ slug, name }) => ({ slug, name })), [applications])

  const tier: PerformanceTier = useMemo(() => recommendTier(questions, answers), [questions, answers])
  const recommended = useMemo(() => recommendProducts(products, tier), [products, tier])

  // A primeira pergunta do template é a aplicação; é o que o lead mostra no painel.
  const applicationLabel = questions[0] ? answers[questions[0].title]?.trim() || undefined : undefined

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const begin = () => {
    if (!startedRef.current) {
      startedRef.current = true
      track('diagnostic_start')
    }
  }

  const chooseOption = (title: string, label: string) => {
    begin()
    setOutros((current) => ({ ...current, [title]: false }))
    setAnswers((current) => ({ ...current, [title]: label }))
  }

  const chooseOther = (title: string) => {
    begin()
    setOutros((current) => ({ ...current, [title]: true }))
    setAnswers((current) => ({ ...current, [title]: '' }))
  }

  const typeOther = (title: string, value: string) => {
    setAnswers((current) => ({ ...current, [title]: value }))
  }

  const goNext = () => {
    begin()
    track('diagnostic_step', { etapa: step + 1, total: totalSteps })
    setStep((current) => Math.min(current + 1, totalSteps - 1))
    scrollToTop()
  }

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0))
    scrollToTop()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors: Record<string, string> = {}
    if (contact.name.trim().length < 2) nextErrors.name = 'Informe o seu nome'
    if (!/^[\d\s()+-]{10,20}$/.test(contact.phone.trim())) nextErrors.phone = 'Informe um telefone com DDD'
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      nextErrors.email = 'Informe um e-mail válido'
    }
    if (!contact.consent) nextErrors.consent = 'É necessário autorizar o contato'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          application: applicationLabel,
          diagnostic: Object.fromEntries(
            Object.entries(answers)
              .map(([title, answer]) => [title, answer.trim()])
              .filter(([, answer]) => answer),
          ),
          recommendedTier: tier,
          productSlug: recommended[0]?.slug,
          origin: 'diagnostico',
          originPath: window.location.pathname,
          utm: readUtm(),
        }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string
          fieldErrors?: Record<string, string>
        }
        if (body.fieldErrors) setErrors(body.fieldErrors)
        setSubmitError(body.error ?? 'Não foi possível registrar agora.')
        return
      }

      track('diagnostic_complete', { categoria: tierLabel[tier], aplicacao: applicationLabel })
      track('generate_lead', { origem: 'diagnostico', categoria: tierLabel[tier] })
      setFinished(true)
      scrollToTop()
    } catch {
      setSubmitError('Falha de conexão. Tente novamente ou fale com um especialista pelo WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ----------------------------- Tela de resultado ---------------------------- */
  if (finished) {
    return (
      <div ref={topRef} className="container-page scroll-mt-28 pb-20">
        <div className="rounded-2xl border border-ink-700/70 bg-linear-to-br from-ink-880 to-ink-900 p-7 md:p-10">
          <Badge tone="positive">
            <Icon name="check" className="size-3" />
            Diagnóstico concluído
          </Badge>

          <h2 className="mt-5 text-[1.75rem] leading-tight font-semibold md:text-[2.25rem]">
            {TIER_SUMMARY[tier].headline}
          </h2>
          <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-300">
            {TIER_SUMMARY[tier].rationale}
          </p>

          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-caution-500/30 bg-caution-500/8 px-4 py-3.5 text-sm text-[#F0C560]">
            <Icon name="info" className="mt-0.5 size-4 shrink-0" />
            <p className="leading-relaxed">
              Esta indicação é um <strong>ponto de partida gerado a partir das suas respostas</strong>. Ela
              precisa ser validada por um especialista, que vai confirmar se os modelos e programas que você
              usa realmente rodam bem nesta categoria.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta
              context={{ kind: 'diagnostico', answers, recommendation: tierLabel[tier] }}
              size="lg"
            >
              Enviar diagnóstico no WhatsApp
            </WhatsAppCta>
            <ButtonLink href="/catalogo" variant="secondary" size="lg">
              Ver catálogo completo
            </ButtonLink>
          </div>
        </div>

        {recommended.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-white">
              Configurações relacionadas ao seu perfil
            </h3>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-300">
              Selecionamos até três equipamentos compatíveis com as suas respostas. Você pode compará-los
              lado a lado antes de conversar com um especialista.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} applications={appIndex} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-xl border border-ink-700/70 bg-ink-880/50 p-6">
          <h3 className="text-base font-semibold text-white">Resumo das suas respostas</h3>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {questions.map((question) =>
              answers[question.title]?.trim() ? (
                <div key={question.title}>
                  <dt className="text-xs text-ink-400">{question.title}</dt>
                  <dd className="mt-0.5 text-sm text-ink-100">{answers[question.title]}</dd>
                </div>
              ) : null,
            )}
          </dl>
          <button
            type="button"
            onClick={() => {
              setFinished(false)
              setStep(0)
              scrollToTop()
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-flux-300 transition-colors hover:text-flux-400"
          >
            <Icon name="arrowLeft" className="size-4" />
            Refazer o diagnóstico
          </button>
        </section>
      </div>
    )
  }

  /* --------------------------------- Wizard ---------------------------------- */
  const isContactStep = step === questions.length
  const question = questions[step]
  const emOutro = !isContactStep && Boolean(outros[question.title])
  const answered = isContactStep || Boolean(answers[question.title]?.trim())

  return (
    <div ref={topRef} className="container-page scroll-mt-28 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4 text-sm text-ink-400">
          <span>
            Etapa {step + 1} de {totalSteps}
          </span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={step + 1}
          aria-label="Progresso do diagnóstico"
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-800"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-500 to-flux-400 transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <div className="mt-9 rounded-2xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-9">
          {isContactStep ? (
            <form onSubmit={submit} noValidate>
              <h2 className="text-2xl leading-tight font-semibold">Para quem enviamos a recomendação?</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-300">
                Com estes dados um especialista consegue validar a indicação e preparar um orçamento
                proporcional à sua operação.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Nome" required error={errors.name}>
                  {(props) => (
                    <Input
                      {...props}
                      value={contact.name}
                      onChange={(event) => setContact((c) => ({ ...c, name: event.target.value }))}
                      autoComplete="name"
                      placeholder="Como devemos chamar você"
                    />
                  )}
                </Field>

                <Field label="Telefone / WhatsApp" required error={errors.phone}>
                  {(props) => (
                    <Input
                      {...props}
                      value={contact.phone}
                      onChange={(event) => setContact((c) => ({ ...c, phone: event.target.value }))}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(00) 00000-0000"
                    />
                  )}
                </Field>

                <Field label="Empresa ou instituição" error={errors.company}>
                  {(props) => (
                    <Input
                      {...props}
                      value={contact.company}
                      onChange={(event) => setContact((c) => ({ ...c, company: event.target.value }))}
                      autoComplete="organization"
                      placeholder="Opcional"
                    />
                  )}
                </Field>

                <Field label="E-mail" error={errors.email}>
                  {(props) => (
                    <Input
                      {...props}
                      type="email"
                      value={contact.email}
                      onChange={(event) => setContact((c) => ({ ...c, email: event.target.value }))}
                      autoComplete="email"
                      placeholder="Opcional"
                    />
                  )}
                </Field>

                <Field label="Cidade" error={errors.city}>
                  {(props) => (
                    <Input
                      {...props}
                      value={contact.city}
                      onChange={(event) => setContact((c) => ({ ...c, city: event.target.value }))}
                      autoComplete="address-level2"
                      placeholder="Opcional"
                    />
                  )}
                </Field>

                <Field label="Estado (UF)" error={errors.state}>
                  {(props) => (
                    <Input
                      {...props}
                      value={contact.state}
                      onChange={(event) =>
                        setContact((c) => ({ ...c, state: event.target.value.toUpperCase().slice(0, 2) }))
                      }
                      maxLength={2}
                      placeholder="Opcional"
                    />
                  )}
                </Field>
              </div>

              <div className="mt-6">
                <Checkbox
                  checked={contact.consent}
                  onChange={(event) => setContact((c) => ({ ...c, consent: event.target.checked }))}
                  label={
                    <>
                      Autorizo a UPAR a entrar em contato sobre esta solicitação e concordo com a{' '}
                      <Link
                        href="/politica-de-privacidade"
                        className="text-flux-300 underline underline-offset-2"
                        target="_blank"
                      >
                        Política de Privacidade
                      </Link>
                      .
                    </>
                  }
                />
                {errors.consent && (
                  <p className="mt-1.5 text-xs text-critical-500" role="alert">
                    {errors.consent}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="mt-4 rounded-lg border border-critical-500/30 bg-critical-500/8 px-4 py-3 text-sm text-critical-500" role="alert">
                  {submitError}
                </p>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="ghost" size="md" onClick={goBack}>
                  <Icon name="arrowLeft" />
                  Voltar
                </Button>
                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? 'Registrando…' : 'Ver minha recomendação'}
                  {!submitting && <Icon name="arrowRight" />}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl leading-tight font-semibold">{question.title}</h2>
              {question.help && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-300">{question.help}</p>}

              <div className="mt-7">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {question.options.map((option) => (
                    <li key={option.label}>
                      <OptionButton
                        selected={!emOutro && answers[question.title] === option.label}
                        label={option.label}
                        onSelect={() => chooseOption(question.title, option.label)}
                      />
                    </li>
                  ))}
                  {question.allowOther && (
                    <li>
                      <OptionButton
                        selected={emOutro}
                        label={OUTRO_LABEL}
                        description="Escreva a sua resposta"
                        onSelect={() => chooseOther(question.title)}
                      />
                    </li>
                  )}
                </ul>

                {emOutro && (
                  <div className="mt-4">
                    <Field label="Qual?" required>
                      {(props) => (
                        <Input
                          {...props}
                          autoFocus
                          value={answers[question.title] ?? ''}
                          onChange={(event) => typeOther(question.title, event.target.value)}
                          maxLength={200}
                          placeholder="Conte em poucas palavras"
                        />
                      )}
                    </Field>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  className={cn(step === 0 && 'invisible')}
                >
                  <Icon name="arrowLeft" />
                  Voltar
                </Button>

                <div className="flex items-center gap-3">
                  <Button type="button" size="lg" onClick={goNext} disabled={!answered}>
                    Continuar
                    <Icon name="arrowRight" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          Prefere conversar direto?{' '}
          <WhatsAppCta context={{ kind: 'consultoria' }} variant="ghost" size="sm" hideIcon className="px-1 underline underline-offset-4">
            Fale com um especialista
          </WhatsAppCta>
        </p>
      </div>
    </div>
  )
}

function OptionButton({
  selected,
  label,
  description,
  onSelect,
}: {
  selected: boolean
  label: string
  description?: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex h-full w-full flex-col gap-1.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-200',
        selected
          ? 'border-brand-500 bg-brand-500/12 ring-1 ring-brand-500/40'
          : 'border-ink-700/70 bg-ink-900/50 hover:border-ink-500 hover:bg-ink-850',
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span className={cn('text-[0.9375rem] font-medium', selected ? 'text-white' : 'text-ink-100')}>
          {label}
        </span>
        {selected && <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-300" />}
      </span>
      {description && <span className="text-sm leading-relaxed text-ink-400">{description}</span>}
    </button>
  )
}
