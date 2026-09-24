import type { LandingCopy, LandingSlug } from '@/lib/types'

/**
 * Páginas de destino das campanhas. Uma por público, com texto editável no
 * painel. Nenhum número, prazo ou promessa que a UPAR não tenha confirmado:
 * as vantagens listadas são as que a empresa informou que cumpre sempre.
 */
export const LANDING_SLUGS: LandingSlug[] = ['empresas', 'universidades', 'fortaleza']

export const LANDING_LABELS: Record<LandingSlug, string> = {
  empresas: 'Empresas',
  universidades: 'Universidades e pesquisa',
  fortaleza: 'Fortaleza',
}

export const defaultLandingPages: Record<LandingSlug, LandingCopy> = {
  empresas: {
    eyebrow: 'Workstations para IA · Empresas',
    title: 'Workstation para IA dimensionada para o que a sua empresa vai rodar',
    subtitle:
      'Consultoria técnica gratuita antes da proposta. Você diz quais modelos e programas usa; a UPAR entrega a configuração na medida, montada e testada.',
    bullets: [
      'Consultoria técnica gratuita antes de qualquer proposta',
      'Em até 21x sem juros no cartão',
      'Garantia de 12 a 60 meses, conforme o produto',
      'Recompra dos itens quando você fizer upgrade',
    ],
    ctaLabel: 'Falar com um especialista',
    note: 'Atendemos todo o Brasil, com entrega por transportadora.',
  },
  universidades: {
    eyebrow: 'Workstations para IA · Universidades e pesquisa',
    title: 'Estação de trabalho para pesquisa em IA, com a documentação que o processo de compra exige',
    subtitle:
      'Memória com correção de erro, espaço para mais placas e especificação técnica comparável. A mesma equipe dimensiona, monta e atende o laboratório depois.',
    bullets: [
      'Especificação técnica detalhada para licitação e compra institucional',
      'Plataformas com memória ECC e expansão para mais placas de vídeo',
      'Garantia de 12 a 60 meses, conforme o produto',
      'Suporte da equipe que montou a máquina',
    ],
    ctaLabel: 'Pedir especificação técnica',
    note: 'Atendemos universidades, institutos e órgãos públicos em todo o Brasil.',
  },
  fortaleza: {
    eyebrow: 'Workstations para IA · Fortaleza',
    title: 'Computador para IA montado em Fortaleza, com preventiva gratuita',
    subtitle:
      'Loja física e equipe técnica na cidade. Quem compra em Fortaleza tem manutenção preventiva gratuita de 1 a 5 anos, conforme o produto.',
    bullets: [
      'Preventiva gratuita de 1 a 5 anos para clientes de Fortaleza',
      'Consultoria técnica gratuita, na loja ou pelo WhatsApp',
      'Em até 21x sem juros no cartão',
      'Garantia de 12 a 60 meses, conforme o produto',
    ],
    ctaLabel: 'Falar com a loja',
    note: 'Visite a loja ou fale pelo WhatsApp. Retirada na loja ou entrega na cidade.',
  },
}
