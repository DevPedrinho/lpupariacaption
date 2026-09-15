export const consultingSteps = [
  {
    title: 'Entendimento da necessidade',
    description:
      'A conversa começa pela sua operação: o que você precisa que o computador faça, quem vai usar e qual problema está tentando resolver.',
  },
  {
    title: 'Levantamento dos softwares e modelos',
    description:
      'Mapeamos os programas, plataformas e modelos envolvidos. É essa lista que define onde o investimento faz diferença real.',
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
      'Apresentamos a configuração explicando o porquê de cada escolha. Ajustes nesta etapa são normais e bem-vindos.',
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

export const localAiBenefits = [
  {
    icon: 'lock' as const,
    title: 'Seus dados permanecem na sua infraestrutura',
    description:
      'Prompts, documentos e resultados não saem da sua rede. Não há termo de uso de terceiro definindo o que pode ser feito com o que você processa, nem dúvida sobre onde o dado ficou armazenado. Para áreas com exigência contratual ou regulatória, isso costuma deixar de ser vantagem e virar o critério decisivo.',
  },
  {
    icon: 'chart' as const,
    title: 'Custo previsível, sem medidor rodando',
    description:
      'O investimento acontece uma vez, e a partir daí o custo por requisição é zero. Isso muda completamente a conta de quem usa IA de forma constante: em vez de uma fatura que cresce junto com a adoção interna, a equipe pode experimentar à vontade sem ninguém vigiando o medidor.',
  },
  {
    icon: 'bolt' as const,
    title: 'Resposta imediata, sem fila',
    description:
      'O processamento acontece ao lado de quem trabalha. Sem latência de rede, sem limite de requisições por minuto e sem fila em horário de pico. Para trabalho iterativo — onde se ajusta o prompt, roda de novo e compara — essa diferença aparece no ritmo do dia inteiro, não só no cronômetro.',
  },
  {
    icon: 'sliders' as const,
    title: 'Controle total sobre modelos e versões',
    description:
      'Você decide qual modelo usar, quando atualizar e como ajustá-lo ao seu conteúdo. Nada muda sem que você autorize — um modelo não é descontinuado nem alterado no meio do seu projeto porque o fornecedor decidiu assim, e o resultado de hoje continua reproduzível amanhã.',
  },
  {
    icon: 'users' as const,
    title: 'Disponível para o time inteiro',
    description:
      'Um equipamento bem dimensionado atende várias pessoas pela rede interna, sem custo adicional por usuário. Quantas pessoas cabem ao mesmo tempo depende da VRAM e do modelo em uso — é uma das primeiras contas que a consultoria faz, porque atender uma equipe é bem diferente de atender uma pessoa.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Cresce junto com a operação',
    description:
      'Memória, armazenamento e placas de vídeo podem ser ampliados conforme a demanda aumenta, preservando o que já foi investido. É por isso que o chassi e a fonte são dimensionados na compra pensando no passo seguinte, mesmo quando esse passo ainda não tem data.',
  },
] as const

export const differentials = [
  {
    icon: 'brain' as const,
    title: 'A conversa começa pela aplicação',
    description:
      'Antes de falar de peças, entendemos o que você precisa executar: quais modelos, quais programas, quantas pessoas vão usar e com que frequência. É essa lista que transforma uma recomendação em dimensionamento. Sem ela, qualquer configuração é palpite — por mais cara que seja.',
  },
  {
    icon: 'shield' as const,
    title: 'Quem monta é quem atende',
    description:
      'A mesma equipe dimensiona, monta, testa sob carga e atende depois da entrega. Quando você liga com um problema, não precisa explicar a máquina do zero para alguém que nunca a viu: quem atende tem o histórico da configuração e sabe por que cada componente foi escolhido.',
  },
  {
    icon: 'cpu' as const,
    title: 'Especialização em alta performance',
    description:
      'Computadores de trabalho pesado e upgrades são a origem da UPAR, não uma linha aberta às pressas por causa da inteligência artificial. O que mudou foi o tipo de pergunta que chega — antes renderização e simulação, agora também modelos e inferência. A especialidade em dimensionar máquinas que trabalham no limite é a mesma.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Projeto pensado para expandir',
    description:
      'Fonte, chassi, placa-mãe e refrigeração são escolhidos considerando o passo seguinte, não apenas a necessidade de hoje. Isso custa pouco na montagem inicial e é a diferença entre acrescentar uma placa quando a demanda crescer ou ter que trocar o equipamento inteiro.',
  },
  {
    icon: 'users' as const,
    title: 'Atendimento para empresas e instituições',
    description:
      'Além do dimensionamento técnico, acompanhamos as exigências formais de cada tipo de compra: documentação para processos licitatórios, dados cadastrais para empenho e o que mais o seu setor de compras exigir. Informe o tipo de comprador no primeiro contato para que o atendimento já comece no formato certo.',
  },
  {
    icon: 'info' as const,
    title: 'Transparência sobre o que não sabemos',
    description:
      'Não publicamos número de desempenho que não tenhamos medido — nem tokens por segundo, nem tempo de renderização, nem compatibilidade com um modelo específico. Quando a resposta depende de teste, dizemos que depende de teste. É menos vendedor, e evita que você compre com base em uma promessa que ninguém verificou.',
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
    title: 'VRAM insuficiente para o modelo',
    description:
      'É o erro mais caro e o menos visível na hora da compra. Se o modelo não cabe na memória da placa de vídeo, parte do processamento passa para a memória do sistema e o desempenho cai de forma perceptível — a máquina liga, abre tudo e mesmo assim não entrega o que se esperava dela. Placas vendidas sob o mesmo nome comercial podem trazer quantidades diferentes de VRAM.',
  },
  {
    icon: 'chart' as const,
    title: 'Capacidade que você paga e não usa',
    description:
      'O oposto acontece com a mesma frequência. Comprar a placa mais cara do catálogo sem saber o que vai rodar imobiliza dinheiro em capacidade ociosa — dinheiro que faria mais diferença em memória, em armazenamento rápido ou em uma segunda máquina para a equipe.',
  },
  {
    icon: 'layers' as const,
    title: 'Gargalo no componente errado',
    description:
      'Uma placa de vídeo forte presa a um processador, a uma quantidade de memória ou a um armazenamento que não a acompanham trabalha abaixo do que poderia. O desempenho de uma máquina de IA é definido pelo conjunto, não pela peça mais cara da lista.',
  },
  {
    icon: 'upgrade' as const,
    title: 'Nenhum caminho de expansão',
    description:
      'Um equipamento sem espaço físico, fonte ou placa-mãe preparados para crescer obriga a trocar tudo quando a demanda aumentar. Planejar a expansão no momento da compra custa pouco; descobrir que ela não existe custa o equipamento inteiro.',
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
    subtitle: 'O caminho mais comum, e o que mais gera arrependimento.',
    items: [
      {
        title: 'A conversa começa pela peça',
        description:
          'O primeiro assunto é qual placa de vídeo cabe no orçamento. A aplicação que vai rodar na máquina entra depois — quando entra.',
      },
      {
        title: 'O maior número vence',
        description:
          'A escolha recai sobre o componente com a especificação mais alta da lista, sem verificar se é ali que está o seu gargalo.',
      },
      {
        title: 'Ninguém pergunta o que você vai executar',
        description:
          'Sem saber os modelos, os programas e o volume de trabalho, não há como dimensionar. O que sobra é palpite embalado como recomendação.',
      },
      {
        title: 'A expansão fica para depois',
        description:
          'O equipamento é fechado no limite exato do que foi pedido. Quando a demanda cresce, a única resposta possível é comprar outro.',
      },
    ],
  },
  right: {
    title: 'Dimensionar pela aplicação',
    subtitle: 'Como a UPAR trabalha, antes de qualquer proposta.',
    items: [
      {
        title: 'A conversa começa pelo seu trabalho',
        description:
          'Quais modelos, quais programas, quantas pessoas e com que frequência. É essa lista que determina a configuração — não o contrário.',
      },
      {
        title: 'A VRAM é definida pelo modelo',
        description:
          'O tamanho do modelo que você pretende executar define a memória de vídeo necessária. Esse número vem antes da marca e antes do preço.',
      },
      {
        title: 'O conjunto é equilibrado',
        description:
          'Processador, memória, armazenamento e refrigeração são escolhidos para acompanhar a placa, não para constar bem na ficha técnica.',
      },
      {
        title: 'A expansão entra no projeto',
        description:
          'Cada configuração informa o que pode crescer depois: memória, armazenamento e, quando o chassi e a fonte permitem, placas adicionais.',
      },
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
