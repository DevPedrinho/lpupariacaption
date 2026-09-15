import { z } from 'zod'

const phoneRegex = /^[\d\s()+-]{10,20}$/

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe o seu nome').max(120),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  phone: z.string().trim().regex(phoneRegex, 'Informe um telefone válido com DDD'),
  email: z.email('Informe um e-mail válido').optional().or(z.literal('')),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  state: z.string().trim().max(2).optional().or(z.literal('')),
  application: z.string().trim().max(120).optional(),
  productSlug: z.string().trim().max(160).optional(),
  comparedSlugs: z.array(z.string().max(160)).max(3).optional(),
  diagnostic: z
    .object({
      application: z.string().max(200).optional(),
      tools: z.string().max(600).optional(),
      localExecution: z.string().max(200).optional(),
      workloadType: z.string().max(200).optional(),
      users: z.string().max(200).optional(),
      dataVolume: z.string().max(200).optional(),
      budget: z.string().max(200).optional(),
      expansion: z.string().max(200).optional(),
      deadline: z.string().max(200).optional(),
      buyerType: z.string().max(200).optional(),
    })
    .optional(),
  recommendedTier: z.enum(['essencial', 'avancado', 'profissional', 'extremo']).optional(),
  budgetRange: z.string().max(120).optional(),
  purchaseWindow: z.string().max(120).optional(),
  origin: z.enum(['diagnostico', 'produto', 'comparativo', 'contato', 'consultoria', 'catalogo']),
  originPath: z.string().max(300).optional(),
  utm: z.record(z.string().max(60), z.string().max(300)).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { error: 'É necessário autorizar o contato para enviar' }),
})

export type LeadInput = z.infer<typeof leadSchema>
