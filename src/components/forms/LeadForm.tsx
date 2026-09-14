'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { WhatsAppCta } from '@/components/site/WhatsAppCta'
import { readUtm, track } from '@/lib/analytics'
import type { Application, LeadOrigin } from '@/lib/types'

type State = {
  name: string
  company: string
  phone: string
  email: string
  city: string
  state: string
  application: string
  message: string
  consent: boolean
}

const initial: State = {
  name: '', company: '', phone: '', email: '', city: '', state: '',
  application: '', message: '', consent: false,
}

export function LeadForm({
  applications,
  origin = 'contato',
}: {
  applications: Pick<Application, 'slug' | 'name'>[]
  origin?: LeadOrigin
}) {
  const [values, setValues] = useState<State>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const update = <K extends keyof State>(key: K, value: State[K]) =>
    setValues((current) => ({ ...current, [key]: value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors: Record<string, string> = {}
    if (values.name.trim().length < 2) nextErrors.name = 'Informe o seu nome'
    if (!/^[\d\s()+-]{10,20}$/.test(values.phone.trim())) nextErrors.phone = 'Informe um telefone com DDD'
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Informe um e-mail válido'
    }
    if (!values.consent) nextErrors.consent = 'É necessário autorizar o contato'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          application: applications.find((app) => app.slug === values.application)?.name || undefined,
          origin,
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
        setSubmitError(body.error ?? 'Não foi possível enviar agora.')
        return
      }

      track('form_submit', { origem: origin })
      track('generate_lead', { origem: origin })
      setSent(true)
    } catch {
      setSubmitError('Falha de conexão. Tente novamente ou fale pelo WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-positive-500/30 bg-positive-500/8 p-7">
        <Icon name="check" className="size-6 text-[#5FD9A4]" />
        <h2 className="mt-4 text-xl font-semibold text-white">Recebemos a sua mensagem</h2>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-200">
          Um especialista vai retornar o contato. Se preferir adiantar a conversa, o WhatsApp costuma ser o
          caminho mais rápido.
        </p>
        <WhatsAppCta context={{ kind: 'consultoria' }} size="md" className="mt-5">
          Continuar no WhatsApp
        </WhatsAppCta>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-white">Fale com a nossa equipe</h2>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-300">
        Quanto mais detalhe sobre a sua aplicação, mais objetiva será a resposta.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nome" required error={errors.name}>
          {(props) => (
            <Input
              {...props}
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              autoComplete="name"
            />
          )}
        </Field>

        <Field label="Telefone / WhatsApp" required error={errors.phone}>
          {(props) => (
            <Input
              {...props}
              value={values.phone}
              onChange={(event) => update('phone', event.target.value)}
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
              value={values.company}
              onChange={(event) => update('company', event.target.value)}
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
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
              autoComplete="email"
              placeholder="Opcional"
            />
          )}
        </Field>

        <Field label="Cidade" error={errors.city}>
          {(props) => (
            <Input
              {...props}
              value={values.city}
              onChange={(event) => update('city', event.target.value)}
              autoComplete="address-level2"
              placeholder="Opcional"
            />
          )}
        </Field>

        <Field label="Estado (UF)" error={errors.state}>
          {(props) => (
            <Input
              {...props}
              value={values.state}
              onChange={(event) => update('state', event.target.value.toUpperCase().slice(0, 2))}
              maxLength={2}
              placeholder="Opcional"
            />
          )}
        </Field>

        <Field label="Aplicação principal" className="sm:col-span-2">
          {(props) => (
            <Select
              {...props}
              value={values.application}
              onChange={(event) => update('application', event.target.value)}
            >
              <option value="">Selecione, se já souber</option>
              {applications.map((application) => (
                <option key={application.slug} value={application.slug}>
                  {application.name}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Como podemos ajudar?" className="sm:col-span-2">
          {(props) => (
            <Textarea
              {...props}
              value={values.message}
              onChange={(event) => update('message', event.target.value)}
              placeholder="Descreva o que você precisa executar, quais programas usa e quantas pessoas vão utilizar o equipamento."
              rows={5}
            />
          )}
        </Field>
      </div>

      <div className="mt-6">
        <Checkbox
          checked={values.consent}
          onChange={(event) => update('consent', event.target.checked)}
          label={
            <>
              Autorizo a UPAR a entrar em contato sobre esta solicitação e concordo com a{' '}
              <Link href="/politica-de-privacidade" className="text-flux-300 underline underline-offset-2" target="_blank">
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

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar mensagem'}
        </Button>
        <WhatsAppCta context={{ kind: 'consultoria' }} variant="secondary" size="lg">
          Prefiro o WhatsApp
        </WhatsAppCta>
      </div>
    </form>
  )
}
