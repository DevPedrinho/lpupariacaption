/**
 * Lead do site -> contato + card no Klip (funil "Vendas - Pedro", etapa "Lead Entrada").
 * O mesmo fluxo da landing da workstation. Sem `KLIP_API_TOKEN` na Vercel, não faz nada.
 */
const API = 'https://api.wts.chat'
const STEP = process.env.KLIP_STEP_ID || '582534ce-31ed-4e27-8558-95f3b86a658f' // Vendas - Pedro > Lead Entrada
const RESP = process.env.KLIP_RESP_ID || '2bf72260-2d9b-4e1d-b7b0-3f924b2539bd' // Pedro Gledson
const TAG_PAGO = 'ORIGEM • Anúncio'
const TAG_SITE = 'ORIGEM • Site' // lead do site que não veio de anúncio

const NOME_ORIGEM: Record<string, string> = {
  diagnostico: 'Diagnóstico',
  produto: 'Produto',
  comparativo: 'Comparativo',
  contato: 'Contato',
  consultoria: 'Consultoria',
  catalogo: 'Catálogo',
  landing: 'Página de campanha',
}

export type LeadKlip = {
  name: string
  company?: string
  phone: string
  email?: string
  city?: string
  state?: string
  application?: string
  productSlug?: string
  budgetRange?: string
  purchaseWindow?: string
  origin: string
  originPath?: string
  utm?: Record<string, string>
  message?: string
  diagnostic?: Record<string, string>
}

export const klipConfigurado = () => Boolean(process.env.KLIP_API_TOKEN)

async function klip(path: string, init: RequestInit = {}) {
  const r = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.KLIP_API_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
  })
  const txt = await r.text()
  let j: { id?: string } | null = null
  try {
    j = JSON.parse(txt)
  } catch {
    /* resposta sem JSON */
  }
  return { ok: r.ok, status: r.status, j, txt }
}

async function acharContato(fone: string) {
  // com e sem o 9 depois do DDD (o WhatsApp às vezes guarda sem)
  const v = [fone]
  if (fone.length === 13) v.push(fone.slice(0, 4) + fone.slice(5))
  if (fone.length === 12) v.push(fone.slice(0, 4) + '9' + fone.slice(4))
  for (const f of v) {
    const r = await klip(`/core/v1/contact/phonenumber/${f}`)
    if (r.ok && r.j?.id) return r.j.id
  }
  return null
}

export async function enviarLeadKlip(l: LeadKlip): Promise<string | null> {
  if (!klipConfigurado()) return null
  let fone = l.phone.replace(/\D/g, '')
  if (fone.length === 10 || fone.length === 11) fone = '55' + fone
  if (fone.length < 12 || fone.length > 13) throw new Error('telefone inválido')

  const u = l.utm || {}
  const pago = Boolean(u.gclid || u.gbraid || u.wbraid || u.fbclid || /cpc|ppc|paid|ads/i.test(u.utm_medium || ''))
  const canal = u.gclid || u.gbraid || u.wbraid ? 'Google Ads' : u.fbclid ? 'Meta Ads' : u.utm_source ? `${u.utm_source}${u.utm_medium ? ' / ' + u.utm_medium : ''}` : 'Site (direto ou orgânico)'
  const up = /^UP-[A-Z0-9]{2,6}-[A-Z0-9]{4,10}$/.test(u.up_ref || '') ? u.up_ref : ''
  const tag = pago ? TAG_PAGO : TAG_SITE
  const onde = NOME_ORIGEM[l.origin] || l.origin
  const quando = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })

  let contato = await acharContato(fone)
  if (!contato) {
    const c = await klip('/core/v1/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: l.company ? `${l.name} (${l.company})` : l.name,
        phoneNumber: fone,
        tagNames: [tag],
        annotation: `Lead do site uparcomputadores.com.br (${onde}, ${canal}) em ${quando}.${up ? ` Código ${up}.` : ''}`,
      }),
    })
    if (!c.ok || !c.j?.id) throw new Error(`contato ${c.status} ${c.txt.slice(0, 200)}`)
    contato = c.j.id
  }

  const respostas = Object.entries(l.diagnostic || {}).map(([p, r]) => `${p}: ${r}`)
  const linhas = [
    `Formulário: ${onde}${l.originPath ? ` (${l.originPath})` : ''}`,
    `Nome: ${l.name}`,
    l.company && `Empresa: ${l.company}`,
    `WhatsApp: +${fone}`,
    l.email && `E-mail: ${l.email}`,
    (l.city || l.state) && `Cidade: ${[l.city, l.state].filter(Boolean).join(' / ')}`,
    l.productSlug && `Produto: ${l.productSlug}`,
    l.application && `Uso: ${l.application}`,
    l.budgetRange && `Orçamento: ${l.budgetRange}`,
    l.purchaseWindow && `Compra: ${l.purchaseWindow}`,
    l.message && `Mensagem: ${l.message}`,
    ...(respostas.length ? ['', 'Diagnóstico:', ...respostas] : []),
    '',
    `Origem: ${canal}`,
    up && `Código: ${up}`,
    u.utm_campaign && `Campanha: ${u.utm_campaign}`,
    u.utm_term && `Palavra-chave: ${u.utm_term}`,
    u.utm_content && `Anúncio: ${u.utm_content}`,
    u.gclid && `gclid: ${u.gclid}`,
  ].filter((v): v is string => typeof v === 'string')

  const meta: Record<string, string> = { origem: canal, pagina: 'site', formulario: l.origin }
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) if (u[k]) meta[k] = u[k].slice(0, 200)
  if (up) meta.ref = up

  const card = await klip('/crm/v2/panel/card', {
    method: 'POST',
    body: JSON.stringify({
      stepId: STEP,
      title: `${pago ? canal : 'Site'} · ${onde}: ${l.name}${l.company ? ' (' + l.company + ')' : ''}`,
      description: linhas.join('\n'),
      responsibleUserId: RESP,
      tagNames: [tag],
      contactIds: [contato],
      metadata: meta,
    }),
  })
  if (!card.ok) throw new Error(`card ${card.status} ${card.txt.slice(0, 200)}`)
  return card.j?.id || null
}
