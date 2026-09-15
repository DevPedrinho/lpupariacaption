import type { DiagnosticAnswers, Product } from './types'

export type WhatsAppContext =
  | { kind: 'geral' }
  | { kind: 'header' }
  | { kind: 'catalogo'; filters?: string }
  | { kind: 'produto'; product: Pick<Product, 'name'>; application?: string }
  | { kind: 'comparativo' }
  | { kind: 'diagnostico'; answers: DiagnosticAnswers; recommendation?: string }
  | { kind: 'aplicacao'; application: string }
  | { kind: 'consultoria' }

const DIAGNOSTIC_LABELS: Record<keyof DiagnosticAnswers, string> = {
  application: 'Aplicação principal',
  tools: 'Programas, plataformas ou modelos',
  localExecution: 'Execução local',
  workloadType: 'Treinar, ajustar ou executar',
  users: 'Pessoas que vão utilizar',
  dataVolume: 'Volume de dados',
  budget: 'Faixa de investimento',
  expansion: 'Expansão futura',
  deadline: 'Prazo necessário',
  buyerType: 'Perfil do comprador',
}

/**
 * A mensagem muda conforme a origem do clique, para que o especialista já
 * receba a conversa com contexto.
 */
export function buildWhatsAppMessage(context: WhatsAppContext, fallbackGreeting: string): string {
  switch (context.kind) {
    case 'produto': {
      const application = context.application?.trim()
      return (
        `Olá! Estou analisando o computador ${context.product.name} no site da UPAR AI. ` +
        (application
          ? `Minha principal aplicação será ${application}. `
          : 'Ainda estou definindo qual será a minha principal aplicação. ') +
        'Gostaria de validar essa configuração com um especialista.'
      )
    }
    case 'comparativo':
      return (
        'Olá! Encontrei um computador em outro site e queria comparar com o que a UPAR entrega. ' +
        'Vou mandar o print aqui na conversa.'
      )
    case 'diagnostico': {
      const lines = (Object.keys(DIAGNOSTIC_LABELS) as (keyof DiagnosticAnswers)[])
        .filter((key) => context.answers[key])
        .map((key) => `• ${DIAGNOSTIC_LABELS[key]}: ${context.answers[key]}`)
      const recommendation = context.recommendation
        ? `\n\nCategoria indicada pelo site: ${context.recommendation}.`
        : ''
      return (
        'Olá! Finalizei o diagnóstico no site da UPAR AI. Estas são as minhas respostas:\n\n' +
        `${lines.join('\n')}${recommendation}\n\n` +
        'Gostaria de receber uma recomendação e um orçamento.'
      )
    }
    case 'aplicacao':
      return (
        `Olá! Estou avaliando computadores da UPAR AI para ${context.application}. ` +
        'Gostaria de entender qual configuração atende a minha necessidade.'
      )
    case 'catalogo':
      return context.filters
        ? `Olá! Estou no catálogo da UPAR AI filtrando por ${context.filters}. Pode me ajudar a escolher?`
        : 'Olá! Estou no catálogo da UPAR AI e gostaria de ajuda para escolher a configuração certa.'
    case 'consultoria':
      return (
        'Olá! Quero conversar com um especialista da UPAR AI sobre o dimensionamento ' +
        'de um computador para a minha aplicação de inteligência artificial.'
      )
    case 'header':
    case 'geral':
    default:
      return fallbackGreeting
  }
}

/** Monta a URL do WhatsApp já com a mensagem contextual. */
export function whatsappUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
