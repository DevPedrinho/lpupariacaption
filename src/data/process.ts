export const consultingSteps = [
  {
    title: 'Entendimento da necessidade',
    description:
      'A conversa começa pela sua operação: o que você precisa que o computador faça, quem vai usar e qual problema está tentando resolver.',
  },
  {
    title: 'Levantamento dos softwares e modelos',
    description:
      'Mapeamos os programas, plataformas e modelos envolvidos.',
  },
  {
    title: 'Dimensionamento técnico',
    description:
      'Com as informações em mãos, calculamos VRAM, memória, núcleos e armazenamento necessários — sem sobra desnecessária e sem falta que trave o projeto.',
  },
  {
    title: 'Construção da configuração',
    description:
      'Montamos a proposta de componentes, considerando compatibilidade, refrigeração, energia e o espaço que você tem disponível.',
  },
  {
    title: 'Validação da proposta',
    description:
      'Apresentamos a configuração explicando o porquê de cada escolha.',
  },
  {
    title: 'Montagem e testes',
    description:
      'O equipamento é montado pela nossa equipe e submetido a testes de estabilidade sob carga antes de sair da bancada.',
  },
  {
    title: 'Entrega e acompanhamento',
    description:
      'Entregamos configurado e continuamos disponíveis. Quem atende depois da venda é a mesma equipe que dimensionou a máquina.',
  },
] as const

/**
 * `title` é o que a home mostra: ali a seção precisa ser escaneada, não lida.
 * `description` é usada na página de consultoria, onde quem chegou já quer o
 * detalhe.
 */
export const differentials = [
  {
    icon: 'brain' as const,
    title: 'A conversa começa pela aplicação',
    description:
      'Antes de falar de peças, entendemos o que você precisa executar: quais modelos, quais programas, quantas pessoas vão usar e com que frequência.',
  },
  {
    icon: 'shield' as const,
    title: 'Quem monta é quem atende',
    description:
      'A mesma equipe dimensiona, monta, testa sob carga e atende depois da entrega.',
  },
  {
    icon: 'cpu' as const,
    title: 'Especialistas em alta performance',
    description:
      'Computadores de trabalho pesado e upgrades são a origem da UPAR.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Projetado para expandir',
    description:
      'Fonte, chassi, placa-mãe e refrigeração são escolhidos considerando o passo seguinte.',
  },
  {
    icon: 'users' as const,
    title: 'Empresas, universidades e órgãos públicos',
    description:
      'Além do dimensionamento técnico, acompanhamos as exigências formais de cada tipo de compra, incluindo a documentação necessária para processos institucionais.',
  },
  {
    icon: 'info' as const,
    title: 'Não publicamos número que não medimos',
    description:
      'Nem tokens por segundo, nem tempo de renderização, nem compatibilidade com um modelo específico.',
  },
] as const

/**
 * Seção de diagnóstico do problema na home.
 *
 * Cada item descreve um erro de dimensionamento verificável tecnicamente. Não
 * há estatística, percentual ou estudo citado: o briefing proíbe número que a
 * UPAR não tenha medido, e o argumento aqui é a explicação, não o dado.
 */
export const painPoints = [
  {
    icon: 'memory' as const,
    title: 'VRAM insuficiente',
    description:
      'O modelo não cabe na placa, o processamento escorre para a memória do sistema e a máquina engasga.',
  },
  {
    icon: 'chart' as const,
    title: 'Capacidade ociosa',
    description:
      'A placa mais cara do catálogo imobiliza dinheiro que renderia mais em memória ou armazenamento.',
  },
  {
    icon: 'layers' as const,
    title: 'Gargalo no lugar errado',
    description:
      'Uma placa forte presa a um processador fraco trabalha abaixo do que poderia. Vale o conjunto.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Sem caminho de expansão',
    description:
      'Sem chassi, fonte e placa-mãe preparados, crescer significa trocar o equipamento inteiro.',
  },
] as const

/**
 * Contraste entre comprar por ficha técnica e dimensionar pela aplicação.
 *
 * O lado esquerdo descreve uma prática de mercado, não um concorrente — não há
 * marca citada nem afirmação sobre terceiros.
 */
export const approachCompare = {
  wrong: {
    title: 'Comprar pela ficha técnica',
    subtitle: 'O caminho mais comum.',
    items: [
      'A conversa começa pela peça',
      'Vence o maior número da lista',
      'Ninguém pergunta o que você executa',
      'A expansão fica para depois',
    ],
  },
  right: {
    title: 'Dimensionar pela aplicação',
    subtitle: 'Como a UPAR trabalha.',
    items: [
      'A conversa começa pelo seu trabalho',
      'A VRAM é definida pelo modelo',
      'O conjunto é equilibrado',
      'A expansão entra no projeto',
    ],
  },
} as const

/**
 * Bloco "Resumindo", logo antes das perguntas frequentes.
 *
 * Só recapitula o que já foi afirmado acima na página. Nenhum item promete
 * prazo, resultado ou número.
 */
export const homeSummary = [
  {
    icon: 'search' as const,
    title: 'O que a UPAR faz',
    items: [
      'Dimensiona computadores e workstations a partir da sua aplicação',
      'Explica o papel de VRAM, processador, memória e armazenamento no seu caso',
      'Monta, testa sob carga e entrega configurado',
      'Atende empresas, universidades, órgãos públicos e profissionais autônomos',
    ],
  },
  {
    icon: 'layers' as const,
    title: 'Como funciona',
    items: [
      'Você responde o diagnóstico ou chama no WhatsApp',
      'Um especialista entende o que precisa ser executado',
      'A configuração é dimensionada e apresentada com a justificativa de cada escolha',
      'Ajustes antes de fechar são normais e esperados',
    ],
  },
  {
    icon: 'shield' as const,
    title: 'O que você recebe',
    items: [
      'Uma configuração proporcional à operação, sem sobra e sem falta',
      'A explicação técnica por trás de cada componente escolhido',
      'Documentação para processos de compra institucionais',
      'Suporte da mesma equipe que dimensionou e montou a máquina',
    ],
  },
] as const
