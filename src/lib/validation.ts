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
  // Título da pergunta -> resposta. As perguntas são editáveis, então o
  // formato é livre; o tamanho é o limite.
  diagnostic: z
    .record(z.string().max(200), z.string().max(600))
    .refine((value) => Object.keys(value).length <= 12, { message: 'Diagnóstico com respostas demais' })
    .optional(),
  recommendedTier: z.enum(['essencial', 'avancado', 'profissional', 'extremo']).optional(),
  budgetRange: z.string().max(120).optional(),
  purchaseWindow: z.string().max(120).optional(),
  origin: z.enum(['diagnostico', 'produto', 'comparativo', 'contato', 'consultoria', 'catalogo', 'landing']),
  originPath: z.string().max(300).optional(),
  utm: z.record(z.string().max(60), z.string().max(300)).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, { error: 'É necessário autorizar o contato para enviar' }),
})

export type LeadInput = z.infer<typeof leadSchema>
