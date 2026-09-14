import type { DiagnosticAnswers, PerformanceTier, Product } from './types'
import { tierRank } from './format'
import { totalStorageGb, totalVramGb } from './format'

export type QuestionKey = keyof DiagnosticAnswers

export type Question = {
  key: QuestionKey
  title: string
  help?: string
  /** `application` usa a lista de aplicações cadastradas; os demais usam `options`. */
  kind: 'application' | 'single' | 'text'
  options?: { value: string; label: string; description?: string }[]
  placeholder?: string
  optional?: boolean
}

export const questions: Question[] = [
  {
    key: 'application',
    kind: 'application',
    title: 'Qual será a principal aplicação?',
    help: 'Se houver mais de uma, escolha a que ocupa mais tempo do seu dia.',
  },
  {
    key: 'tools',
    kind: 'text',
    title: 'Quais programas, plataformas ou modelos serão utilizados?',
    help: 'Pode ser uma lista simples. Esta é a informação que mais ajuda no dimensionamento.',
    placeholder: 'Ex.: PyTorch, Ollama, ComfyUI, DaVinci Resolve, SolidWorks, Power BI…',
    optional: true,
  },
  {
    key: 'localExecution',
    kind: 'single',
    title: 'A IA será executada localmente?',
    options: [
      { value: 'Sim, obrigatoriamente local', label: 'Sim, obrigatoriamente', description: 'Os dados não podem sair da nossa infraestrutura.' },
      { value: 'Sim, preferencialmente local', label: 'Sim, de preferência', description: 'Queremos reduzir dependência e custo de nuvem.' },
      { value: 'Modelo híbrido', label: 'Modelo híbrido', description: 'Local no dia a dia, nuvem nos picos.' },
      { value: 'Ainda não sei', label: 'Ainda não sei', description: 'Preciso de orientação sobre isso.' },
    ],
  },
  {
    key: 'workloadType',
    kind: 'single',
    title: 'Você pretende treinar, ajustar ou apenas executar modelos?',
    options: [
      { value: 'Apenas executar modelos prontos', label: 'Apenas executar', description: 'Usar modelos já treinados.' },
      { value: 'Ajuste fino de modelos', label: 'Ajustar (fine-tuning)', description: 'Adaptar modelos existentes ao nosso contexto.' },
      { value: 'Treinar modelos do zero', label: 'Treinar do zero', description: 'Desenvolver modelos próprios.' },
      { value: 'Ainda não sei', label: 'Ainda não sei' },
    ],
  },
  {
    key: 'users',
    kind: 'single',
    title: 'Quantas pessoas utilizarão a solução?',
    options: [
      { value: 'Apenas eu', label: 'Apenas eu' },
      { value: '2 a 3 pessoas', label: '2 a 3 pessoas' },
      { value: '4 a 10 pessoas', label: '4 a 10 pessoas' },
      { value: 'Mais de 10 pessoas', label: 'Mais de 10 pessoas' },
    ],
  },
  {
    key: 'dataVolume',
    kind: 'single',
    title: 'Qual o volume aproximado de dados?',
    help: 'Considere o que precisa ficar disponível no equipamento, não o arquivo histórico.',
    options: [
      { value: 'Até 500 GB', label: 'Até 500 GB' },
      { value: '500 GB a 2 TB', label: '500 GB a 2 TB' },
      { value: '2 TB a 10 TB', label: '2 TB a 10 TB' },
      { value: 'Acima de 10 TB', label: 'Acima de 10 TB' },
      { value: 'Ainda não sei', label: 'Ainda não sei' },
    ],
  },
  {
    key: 'budget',
    kind: 'single',
    title: 'Existe uma faixa de investimento definida?',
    help: 'Isso ajuda a indicar o caminho mais eficiente. Não é um compromisso.',
    options: [
      { value: 'Até R$ 25.000', label: 'Até R$ 25 mil' },
      { value: 'R$ 25.000 a R$ 50.000', label: 'R$ 25 mil a R$ 50 mil' },
      { value: 'R$ 50.000 a R$ 100.000', label: 'R$ 50 mil a R$ 100 mil' },
      { value: 'Acima de R$ 100.000', label: 'Acima de R$ 100 mil' },
      { value: 'Ainda não definida', label: 'Ainda não definida' },
    ],
  },
  {
    key: 'expansion',
    kind: 'single',
    title: 'Há necessidade de expansão futura?',
    options: [
      { value: 'Sim, expansão planejada', label: 'Sim, já está no plano', description: 'Pretendemos ampliar em pouco tempo.' },
      { value: 'Talvez, dependendo do resultado', label: 'Talvez', description: 'Depende de como o projeto evoluir.' },
      { value: 'Não, configuração definitiva', label: 'Não', description: 'A configuração atende o escopo previsto.' },
    ],
  },
  {
    key: 'deadline',
    kind: 'single',
    title: 'Quando o equipamento precisa estar disponível?',
    options: [
      { value: 'O quanto antes', label: 'O quanto antes' },
      { value: 'Próximos 30 dias', label: 'Próximos 30 dias' },
      { value: 'Em até 90 dias', label: 'Em até 90 dias' },
      { value: 'Sem prazo definido', label: 'Sem prazo definido' },
    ],
  },
  {
    key: 'buyerType',
    kind: 'single',
    title: 'A compra será feita por qual perfil?',
    help: 'Cada perfil tem um processo diferente. Saber disso agora agiliza o atendimento.',
    options: [
      { value: 'Pessoa física', label: 'Pessoa física' },
      { value: 'Empresa', label: 'Empresa' },
      { value: 'Universidade ou órgão público', label: 'Universidade ou órgão público' },
      { value: 'Ainda não definido', label: 'Ainda não definido' },
    ],
  },
]

export const TIER_SUMMARY: Record<PerformanceTier, { headline: string; rationale: string }> = {
  essencial: {
    headline: 'Categoria Essencial',
    rationale:
      'Pelo que você descreveu, uma configuração de entrada bem dimensionada já atende — com espaço para ampliar memória e armazenamento conforme o uso crescer.',
  },
  avancado: {
    headline: 'Categoria Avançado',
    rationale:
      'O seu cenário pede folga em VRAM e memória para o uso diário, mantendo a possibilidade de adicionar uma segunda placa de vídeo mais adiante.',
  },
  profissional: {
    headline: 'Categoria Profissional',
    rationale:
      'Cargas longas, modelos maiores ou uso compartilhado justificam uma plataforma profissional, com memória mais robusta e estabilidade para execuções contínuas.',
  },
  extremo: {
    headline: 'Categoria Extremo',
    rationale:
      'O volume e o tipo de trabalho descritos apontam para alta densidade de placas de vídeo — capacidade próxima da nuvem, dentro da sua própria infraestrutura.',
  },
}

/** Traduz as respostas em uma categoria indicada. É um ponto de partida, não um veredito. */
export function recommendTier(answers: DiagnosticAnswers): PerformanceTier {
  let score = 1

  if (answers.workloadType === 'Ajuste fino de modelos') score += 1
  if (answers.workloadType === 'Treinar modelos do zero') score += 2

  if (answers.users === '4 a 10 pessoas') score += 1
  if (answers.users === 'Mais de 10 pessoas') score += 2

  if (answers.dataVolume === '2 TB a 10 TB') score += 0.5
  if (answers.dataVolume === 'Acima de 10 TB') score += 1

  if (answers.localExecution === 'Sim, obrigatoriamente local') score += 0.5
  if (answers.expansion === 'Sim, expansão planejada') score += 0.5

  const heavyApplications = ['deep-learning', 'servidores-ia', 'llms-locais', 'geracao-de-video', 'renderizacao-3d']
  if (answers.application && heavyApplications.includes(answers.application)) score += 0.5

  // A faixa de investimento limita o topo da indicação, mas não a rebaixa sozinha.
  if (answers.budget === 'Até R$ 25.000') score = Math.min(score, 1.4)
  if (answers.budget === 'R$ 25.000 a R$ 50.000') score = Math.min(score, 2.4)
  if (answers.budget === 'R$ 50.000 a R$ 100.000') score = Math.min(score, 3.4)

  if (score >= 3.5) return 'extremo'
  if (score >= 2.5) return 'profissional'
  if (score >= 1.5) return 'avancado'
  return 'essencial'
}

/** Ordena o catálogo pela aderência às respostas e devolve até três opções. */
export function recommendProducts(
  products: Product[],
  answers: DiagnosticAnswers,
  tier: PerformanceTier,
): Product[] {
  const scored = products.map((product) => {
    let score = 0

    if (answers.application && product.applications.includes(answers.application)) score += 5

    const distance = Math.abs(tierRank[product.performanceTier] - tierRank[tier])
    score += Math.max(0, 4 - distance * 2)

    if (answers.expansion === 'Sim, expansão planejada' && product.maxGpus > product.gpu.quantity) score += 1.5

    if (answers.dataVolume === 'Acima de 10 TB' && totalStorageGb(product) >= 16000) score += 1.5
    else if (answers.dataVolume === '2 TB a 10 TB' && totalStorageGb(product) >= 8000) score += 1

    if (answers.users === 'Mais de 10 pessoas' && product.formFactor === 'server') score += 2
    if (answers.users === 'Apenas eu' && product.formFactor === 'server') score -= 2

    if (answers.workloadType === 'Treinar modelos do zero' && totalVramGb(product) >= 48) score += 1.5

    if (product.availability === 'unavailable') score -= 3
    if (answers.deadline === 'O quanto antes' && product.availability === 'in_stock') score += 1

    return { product, score }
  })

  return scored
    .sort((a, b) => b.score - a.score || totalVramGb(a.product) - totalVramGb(b.product))
    .filter((entry) => entry.score > 0)
    .slice(0, 3)
    .map((entry) => entry.product)
}

export function budgetToRange(answers: DiagnosticAnswers): string | undefined {
  return answers.budget && answers.budget !== 'Ainda não definida' ? answers.budget : undefined
}
