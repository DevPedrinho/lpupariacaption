import type { DiagnosticAnswers, DiagnosticOption, DiagnosticQuestion, PerformanceTier, Product } from './types'
import { tierRank, totalVramGb } from './format'
import {
  DEFAULT_DIAGNOSTIC_QUESTIONS,
  OPTION_COUNT,
  OUTRO_LABEL,
  QUESTION_COUNT,
} from '@/data/diagnostic-questions'

export { DEFAULT_DIAGNOSTIC_QUESTIONS, OPTION_COUNT, OUTRO_LABEL, QUESTION_COUNT }

function pesoValido(value: unknown): DiagnosticOption['weight'] {
  const n = Number(value)
  return n === 1 || n === 2 ? n : 0
}

/**
 * Garante que o template guardado tem a forma que o assistente espera:
 * exatamente cinco perguntas, quatro opções cada, tudo com texto.
 *
 * O que estiver faltando ou vazio cai para o padrão da mesma posição. Assim
 * uma configuração antiga (sem o campo) ou parcialmente editada nunca deixa
 * o formulário do site quebrado.
 */
export function normalizeQuestions(input: unknown): DiagnosticQuestion[] {
  const lista = Array.isArray(input) ? (input as Partial<DiagnosticQuestion>[]) : []

  return DEFAULT_DIAGNOSTIC_QUESTIONS.slice(0, QUESTION_COUNT).map((padrao, i) => {
    const q = lista[i] ?? {}
    const title = typeof q.title === 'string' && q.title.trim() ? q.title.trim() : padrao.title
    const help = typeof q.help === 'string' && q.help.trim() ? q.help.trim() : undefined
    const opcoes = Array.isArray(q.options) ? q.options : []

    const options: DiagnosticOption[] = padrao.options.slice(0, OPTION_COUNT).map((op, j) => {
      const cand = opcoes[j] as Partial<DiagnosticOption> | undefined
      const label = typeof cand?.label === 'string' && cand.label.trim() ? cand.label.trim() : op.label
      return { label, weight: pesoValido(cand?.weight ?? op.weight) }
    })

    return { title, help, options, allowOther: q.allowOther !== false }
  })
}

/** Problemas que impedem salvar o template — para o painel apontar o campo. */
export function validateQuestions(questions: DiagnosticQuestion[]): string[] {
  const problemas: string[] = []
  questions.forEach((q, i) => {
    if (!q.title.trim()) problemas.push(`Pergunta ${i + 1}: falta o texto da pergunta.`)
    q.options.forEach((op, j) => {
      if (!op.label.trim()) problemas.push(`Pergunta ${i + 1}, opção ${j + 1}: falta o texto.`)
    })
    const rotulos = new Set(q.options.map((op) => op.label.trim().toLowerCase()))
    if (rotulos.size < q.options.length) problemas.push(`Pergunta ${i + 1}: há opções repetidas.`)
    if (rotulos.has(OUTRO_LABEL.toLowerCase())) {
      problemas.push(`Pergunta ${i + 1}: "${OUTRO_LABEL}" já é a quinta escolha; não repita nas opções.`)
    }
  })
  return problemas
}

export const TIER_SUMMARY: Record<PerformanceTier, { headline: string; rationale: string }> = {
  essencial: {
    headline: 'Categoria Essencial',
    rationale:
      'Uma configuração de entrada bem dimensionada já atende, com espaço para ampliar memória e armazenamento.',
  },
  avancado: {
    headline: 'Categoria Avançado',
    rationale:
      'O seu cenário pede folga em VRAM e memória, com a possibilidade de uma segunda placa de vídeo mais adiante.',
  },
  profissional: {
    headline: 'Categoria Profissional',
    rationale:
      'Cargas longas, modelos maiores ou uso compartilhado pedem uma plataforma profissional, estável para execuções contínuas.',
  },
  extremo: {
    headline: 'Categoria Extremo',
    rationale:
      'O volume descrito aponta para alta densidade de placas de vídeo, dentro da sua própria infraestrutura.',
  },
}

/**
 * Traduz as respostas em uma categoria indicada. É um ponto de partida, não
 * um veredito: soma o peso das opções escolhidas (uma resposta "Outro" não
 * pesa) e corta em faixas. Com cinco perguntas o máximo é 10.
 */
export function recommendTier(questions: DiagnosticQuestion[], answers: DiagnosticAnswers): PerformanceTier {
  let score = 0
  for (const question of questions) {
    const resposta = answers[question.title]
    if (!resposta) continue
    const opcao = question.options.find((op) => op.label === resposta)
    if (opcao) score += opcao.weight
  }

  if (score >= 6) return 'extremo'
  if (score >= 4) return 'profissional'
  if (score >= 2) return 'avancado'
  return 'essencial'
}

/** Ordena o catálogo pela proximidade da categoria indicada e devolve até três opções. */
export function recommendProducts(products: Product[], tier: PerformanceTier): Product[] {
  const scored = products.map((product) => {
    const distance = Math.abs(tierRank[product.performanceTier] - tierRank[tier])
    let score = Math.max(0, 4 - distance * 2)
    if (product.availability === 'unavailable') score -= 3
    if (product.availability === 'in_stock') score += 0.5
    if (product.featured) score += 0.5
    return { product, score }
  })

  return scored
    .sort((a, b) => b.score - a.score || totalVramGb(a.product) - totalVramGb(b.product))
    .filter((entry) => entry.score > 0)
    .slice(0, 3)
    .map((entry) => entry.product)
}
