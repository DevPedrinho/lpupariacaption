import type { DiagnosticQuestion } from '@/lib/types'

export const OUTRO_LABEL = 'Outro'
export const QUESTION_COUNT = 5
export const OPTION_COUNT = 4

/**
 * Template padrão do diagnóstico: cinco perguntas, quatro escolhas cada e a
 * quinta escolha "Outro", em que o cliente escreve.
 *
 * O peso de cada opção alimenta a categoria indicada no fim. Não há número
 * que a UPAR não tenha medido aqui: é só uma ordem de grandeza de esforço
 * computacional, e o texto do resultado diz que precisa de validação.
 */
export const DEFAULT_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    title: 'Qual será a principal aplicação?',
    help: 'Se houver mais de uma, escolha a que ocupa mais tempo do seu dia.',
    options: [
      { label: 'Rodar modelos de IA (LLMs) localmente', weight: 1 },
      { label: 'Gerar imagens ou vídeo', weight: 1 },
      { label: 'Treinar ou ajustar modelos', weight: 2 },
      { label: 'Análise e ciência de dados', weight: 0 },
    ],
    allowOther: true,
  },
  {
    title: 'Quantas pessoas vão usar o equipamento?',
    options: [
      { label: 'Só eu', weight: 0 },
      { label: '2 a 3 pessoas', weight: 0 },
      { label: '4 a 10 pessoas', weight: 1 },
      { label: 'Mais de 10 pessoas', weight: 2 },
    ],
    allowOther: true,
  },
  {
    title: 'Você vai treinar, ajustar ou só executar modelos?',
    options: [
      { label: 'Só executar modelos prontos', weight: 0 },
      { label: 'Ajustar modelos (fine-tuning)', weight: 1 },
      { label: 'Treinar modelos do zero', weight: 2 },
      { label: 'Ainda não sei', weight: 0 },
    ],
    allowOther: true,
  },
  {
    title: 'Quanto de dados precisa ficar no equipamento?',
    help: 'O que precisa estar disponível na máquina, não o arquivo histórico.',
    options: [
      { label: 'Até 500 GB', weight: 0 },
      { label: '500 GB a 2 TB', weight: 0 },
      { label: '2 TB a 10 TB', weight: 1 },
      { label: 'Acima de 10 TB', weight: 2 },
    ],
    allowOther: true,
  },
  {
    title: 'Existe uma faixa de investimento definida?',
    help: 'Ajuda a indicar o caminho mais eficiente. Não é um compromisso.',
    options: [
      { label: 'Até R$ 25 mil', weight: 0 },
      { label: 'R$ 25 mil a R$ 50 mil', weight: 0 },
      { label: 'R$ 50 mil a R$ 100 mil', weight: 1 },
      { label: 'Acima de R$ 100 mil', weight: 2 },
    ],
    allowOther: true,
  },
]
