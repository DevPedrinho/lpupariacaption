import type { Application } from '@/lib/types'

/**
 * Conteúdo editorial das soluções por aplicação.
 * Editável pelo painel administrativo (tabela `applications`).
 */
export const applications: Application[] = [
  {
    slug: 'llms-locais',
    name: 'Modelos de linguagem e LLMs locais',
    icon: 'brain',
    short: 'Rodar assistentes, copilotos e modelos de linguagem dentro da sua própria infraestrutura.',
    intro:
      'Executar um modelo de linguagem localmente significa manter prompts, documentos e respostas dentro da sua rede.',
    whoFor: [
      'Empresas que querem um assistente interno treinado no próprio conteúdo',
      'Times jurídicos, financeiros e de saúde com restrição de envio de dados para fora',
      'Startups que precisam controlar custo por token em volume alto',
      'Desenvolvedores criando agentes e integrações sobre modelos abertos',
    ],
    challenges: [
      {
        title: 'O modelo precisa caber na VRAM',
        description:
          'Quando o modelo não cabe na memória da placa de vídeo, parte do processamento vai para a memória do sistema e a resposta fica lenta.',
      },
      {
        title: 'Contexto longo consome memória extra',
        description:
          'Além do modelo, o histórico da conversa e os documentos anexados ocupam VRAM.',
      },
      {
        title: 'Vários usuários ao mesmo tempo',
        description:
          'Atender uma equipe inteira é diferente de atender uma pessoa.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 5, why: 'Define o tamanho do modelo que você consegue executar e o tamanho do contexto.' },
      { component: 'GPU', weight: 5, why: 'É onde o modelo efetivamente roda. A arquitetura influencia a velocidade de resposta.' },
      { component: 'RAM', weight: 3, why: 'Necessária para carregar modelos, indexar documentos e sustentar a camada de aplicação.' },
      { component: 'CPU', weight: 2, why: 'Coordena a aplicação, o pré-processamento e a busca em bases vetoriais.' },
      { component: 'Armazenamento', weight: 3, why: 'Modelos ocupam dezenas a centenas de gigabytes e precisam de leitura rápida no carregamento.' },
    ],
    recommendedTiers: ['avancado', 'profissional', 'extremo'],
    expansion: [
      'Adicionar uma segunda GPU para ampliar a VRAM total disponível',
      'Ampliar memória do sistema para bases de conhecimento maiores',
      'Incluir armazenamento dedicado para o repositório de modelos',
    ],
    status: 'published',
    order: 1,
    seoTitle: 'Computadores para rodar LLMs localmente | UPAR AI',
    seoDescription:
      'Workstations dimensionadas para executar modelos de linguagem na sua própria infraestrutura, com a VRAM adequada ao modelo que você pretende usar.',
  },
  {
    slug: 'machine-learning',
    name: 'Machine learning',
    icon: 'chart',
    short: 'Treinar, validar e colocar modelos em produção com ciclos de experimentação mais curtos.',
    intro:
      'Em machine learning o gargalo raramente está em um único componente.',
    whoFor: [
      'Times de dados que hoje esperam horas por um treinamento',
      'Startups que precisam iterar rápido antes de escalar na nuvem',
      'Consultorias que atendem vários clientes com modelos próprios',
    ],
    challenges: [
      {
        title: 'Preparação de dados é trabalho de CPU e memória',
        description:
          'Limpeza, junções e engenharia de atributos acontecem antes da GPU entrar em ação.',
      },
      {
        title: 'Experimentação exige repetição',
        description:
          'Cada ajuste de hiperparâmetro é um novo treinamento. Ganhos por ciclo se multiplicam ao longo do projeto.',
      },
      {
        title: 'Conjuntos de dados crescem rápido',
        description:
          'O volume que hoje cabe no disco local pode dobrar no próximo trimestre.',
      },
    ],
    components: [
      { component: 'GPU', weight: 4, why: 'Acelera o treinamento de modelos que suportam processamento paralelo.' },
      { component: 'RAM', weight: 4, why: 'Sustenta conjuntos de dados em memória durante a preparação e a validação.' },
      { component: 'CPU', weight: 4, why: 'Responsável pela engenharia de atributos e por algoritmos que não usam GPU.' },
      { component: 'Armazenamento', weight: 4, why: 'Leitura rápida evita que a GPU fique ociosa esperando dados.' },
      { component: 'VRAM', weight: 3, why: 'Determina o tamanho do lote e a complexidade do modelo em treinamento.' },
    ],
    recommendedTiers: ['avancado', 'profissional'],
    expansion: [
      'Ampliar memória do sistema conforme o volume de dados cresce',
      'Adicionar armazenamento NVMe dedicado para conjuntos de dados ativos',
      'Incluir GPU adicional para treinamentos paralelos',
    ],
    status: 'published',
    order: 2,
    seoTitle: 'Workstations para machine learning | UPAR AI',
    seoDescription:
      'Computadores dimensionados para treinar e validar modelos de machine learning com ciclos de experimentação mais curtos.',
  },
  {
    slug: 'deep-learning',
    name: 'Deep learning',
    icon: 'layers',
    short: 'Treinar e ajustar redes neurais profundas com estabilidade para longas execuções.',
    intro:
      'Treinamento de redes profundas é uma carga contínua e pesada.',
    whoFor: [
      'Laboratórios e centros de pesquisa',
      'Times que fazem ajuste fino de modelos abertos',
      'Empresas com modelos proprietários em desenvolvimento contínuo',
    ],
    challenges: [
      {
        title: 'VRAM limita o tamanho do lote',
        description:
          'Lotes maiores tendem a estabilizar o treinamento. Quando a VRAM é curta, é preciso reduzir o lote e aceitar ciclos mais longos.',
      },
      {
        title: 'Cargas longas exigem estabilidade térmica',
        description:
          'Uma máquina que aquece demais reduz a frequência de operação e o treinamento demora mais do que deveria.',
      },
      {
        title: 'Comunicação entre múltiplas GPUs',
        description:
          'Ao usar mais de uma placa, a forma como elas trocam dados influencia o ganho real obtido com a segunda GPU.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 5, why: 'Define o tamanho do modelo e do lote que cabem em cada passo de treinamento.' },
      { component: 'GPU', weight: 5, why: 'Executa a maior parte do cálculo do treinamento.' },
      { component: 'RAM', weight: 4, why: 'Alimenta a GPU com dados e sustenta o pipeline de pré-processamento.' },
      { component: 'Armazenamento', weight: 4, why: 'Evita ociosidade da GPU durante a leitura dos conjuntos de treino.' },
      { component: 'CPU', weight: 3, why: 'Coordena o carregamento de dados e a orquestração do treinamento.' },
    ],
    recommendedTiers: ['profissional', 'extremo'],
    expansion: [
      'Estrutura preparada para receber GPUs adicionais',
      'Fonte e refrigeração dimensionadas para a expansão planejada',
      'Rede de alta velocidade para integrar com armazenamento compartilhado',
    ],
    status: 'published',
    order: 3,
    seoTitle: 'Computadores para deep learning | UPAR AI',
    seoDescription:
      'Workstations e servidores para treinamento de redes neurais profundas, com refrigeração e fonte dimensionadas para cargas contínuas.',
  },
  {
    slug: 'ciencia-de-dados',
    name: 'Ciência e análise de dados',
    icon: 'chart',
    short: 'Processar grandes volumes, rodar consultas pesadas e sustentar análises em memória.',
    intro:
      'Análise de dados é uma carga dominada por CPU, memória e velocidade de disco.',
    whoFor: [
      'Analistas e cientistas de dados',
      'Áreas de BI que processam bases extensas localmente',
      'Times financeiros e atuariais com modelos pesados',
    ],
    challenges: [
      {
        title: 'Bases maiores que a memória disponível',
        description:
          'Quando o conjunto não cabe na RAM, o sistema passa a usar o disco e o desempenho cai de forma acentuada.',
      },
      {
        title: 'Operações que não usam GPU',
        description:
          'Boa parte das bibliotecas de análise depende de núcleos de CPU.',
      },
      {
        title: 'Leitura e escrita constantes',
        description: 'Arquivos grandes exigem armazenamento rápido para não travar o fluxo de trabalho.',
      },
    ],
    components: [
      { component: 'RAM', weight: 5, why: 'Permite manter conjuntos inteiros em memória durante a análise.' },
      { component: 'CPU', weight: 5, why: 'Executa a maior parte das transformações e agregações.' },
      { component: 'Armazenamento', weight: 4, why: 'Leitura rápida reduz o tempo de carga de bases extensas.' },
      { component: 'GPU', weight: 2, why: 'Útil quando há bibliotecas aceleradas ou etapas de modelagem.' },
      { component: 'VRAM', weight: 2, why: 'Relevante apenas nas etapas que envolvem modelos.' },
    ],
    recommendedTiers: ['essencial', 'avancado', 'profissional'],
    expansion: [
      'Ampliação de memória do sistema em etapas',
      'Inclusão de volumes NVMe adicionais',
      'Adição de GPU quando o time avançar para modelagem',
    ],
    status: 'published',
    order: 4,
    seoTitle: 'Computadores para ciência de dados | UPAR AI',
    seoDescription:
      'Máquinas dimensionadas para análise de grandes volumes de dados, com foco em memória, núcleos de CPU e armazenamento rápido.',
  },
  {
    slug: 'geracao-de-imagens',
    name: 'Geração de imagens com IA',
    icon: 'image',
    short: 'Produzir imagens em escala, com controle criativo e sem depender de créditos externos.',
    intro:
      'Geração de imagens é uma carga intensa e repetitiva de GPU.',
    whoFor: [
      'Agências e estúdios de criação',
      'E-commerces que produzem catálogo visual em volume',
      'Times de marketing com produção interna contínua',
    ],
    challenges: [
      {
        title: 'Resolução alta consome VRAM rapidamente',
        description:
          'Aumentar a resolução ou trabalhar com refinamentos encadeados eleva o consumo de memória da placa de vídeo.',
      },
      {
        title: 'Fluxos encadeados exigem folga',
        description:
          'Pipelines com múltiplos modelos carregados ao mesmo tempo precisam de VRAM além do modelo principal.',
      },
      {
        title: 'Produção em lote é carga contínua',
        description: 'Gerar centenas de imagens por dia mantém a GPU sob uso constante e exige boa refrigeração.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 5, why: 'Determina a resolução e a complexidade do fluxo de geração.' },
      { component: 'GPU', weight: 5, why: 'Executa a geração propriamente dita.' },
      { component: 'Armazenamento', weight: 3, why: 'Bibliotecas de modelos e saídas em alta resolução ocupam muito espaço.' },
      { component: 'RAM', weight: 3, why: 'Sustenta a aplicação, o pré-processamento e a troca de modelos.' },
      { component: 'CPU', weight: 2, why: 'Coordena o fluxo e o tratamento posterior das imagens.' },
    ],
    recommendedTiers: ['avancado', 'profissional'],
    expansion: [
      'Segunda GPU para paralelizar a produção em lote',
      'Armazenamento adicional para bibliotecas de modelos e entregas',
    ],
    status: 'published',
    order: 5,
    seoTitle: 'Computadores para geração de imagens com IA | UPAR AI',
    seoDescription:
      'Workstations com VRAM dimensionada para geração de imagens em alta resolução e produção criativa em escala.',
  },
  {
    slug: 'geracao-de-video',
    name: 'Geração e edição de vídeo',
    icon: 'video',
    short: 'Unir edição profissional, efeitos e geração de vídeo por IA na mesma máquina.',
    intro:
      'Produção de vídeo combina duas cargas diferentes: a edição em tempo real, que depende de armazenamento rápido e memória, e a geração por IA, que depende fortemente da placa de vídeo.',
    whoFor: [
      'Produtoras e estúdios de pós-produção',
      'Criadores que trabalham com material em alta resolução',
      'Times de conteúdo com produção generativa',
    ],
    challenges: [
      {
        title: 'Material bruto ocupa muito espaço',
        description: 'Projetos em alta resolução exigem volumes rápidos e capacidade generosa para cache e entregas.',
      },
      {
        title: 'Pré-visualização fluida depende de memória',
        description: 'Linhas do tempo complexas com camadas e efeitos consomem RAM de forma significativa.',
      },
      {
        title: 'Geração por IA disputa a mesma GPU',
        description: 'Quando a geração e a edição acontecem no mesmo equipamento, a folga de VRAM evita interrupções.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 4, why: 'Necessária para efeitos, composição e modelos generativos de vídeo.' },
      { component: 'GPU', weight: 5, why: 'Acelera codificação, efeitos e geração.' },
      { component: 'Armazenamento', weight: 5, why: 'Velocidade e capacidade definem a fluidez da edição.' },
      { component: 'RAM', weight: 4, why: 'Sustenta projetos extensos e pré-visualização em tempo real.' },
      { component: 'CPU', weight: 4, why: 'Participa da codificação e do processamento de camadas.' },
    ],
    recommendedTiers: ['avancado', 'profissional', 'extremo'],
    expansion: [
      'Volumes de armazenamento adicionais por projeto',
      'Ampliação de memória para linhas do tempo mais complexas',
      'Placa de captura ou rede de alta velocidade para fluxo compartilhado',
    ],
    status: 'published',
    order: 6,
    seoTitle: 'Computadores para edição e geração de vídeo com IA | UPAR AI',
    seoDescription:
      'Workstations para pós-produção em alta resolução e geração de vídeo por inteligência artificial.',
  },
  {
    slug: 'visao-computacional',
    name: 'Visão computacional',
    icon: 'eye',
    short: 'Detecção, inspeção e análise de imagem em tempo real, do treinamento à operação.',
    intro:
      'Projetos de visão computacional têm duas fases com necessidades distintas: treinar o modelo com um conjunto de imagens e depois executá-lo sobre câmeras ou lotes de arquivos.',
    whoFor: [
      'Indústrias com inspeção visual e controle de qualidade',
      'Integradores de segurança e monitoramento',
      'Times de pesquisa aplicada em imagem',
    ],
    challenges: [
      {
        title: 'Múltiplas fontes ao mesmo tempo',
        description: 'Cada câmera adicional soma carga de decodificação e inferência.',
      },
      {
        title: 'Conjuntos de imagens são pesados',
        description: 'Treinar com milhares de imagens exige leitura rápida e espaço adequado.',
      },
      {
        title: 'Latência importa na operação',
        description: 'Aplicações em linha de produção precisam de resposta previsível, não apenas média alta.',
      },
    ],
    components: [
      { component: 'GPU', weight: 5, why: 'Executa inferência e treinamento dos modelos de imagem.' },
      { component: 'VRAM', weight: 4, why: 'Permite modelos maiores e mais fluxos simultâneos.' },
      { component: 'CPU', weight: 4, why: 'Responsável pela decodificação de vídeo e pelo pré-processamento.' },
      { component: 'Armazenamento', weight: 4, why: 'Sustenta conjuntos de imagens e gravações.' },
      { component: 'Rede', weight: 3, why: 'Integra câmeras e sistemas de aquisição.' },
    ],
    recommendedTiers: ['avancado', 'profissional'],
    expansion: [
      'GPU adicional para ampliar o número de fluxos simultâneos',
      'Rede de maior velocidade para aquisição',
      'Armazenamento dedicado a gravações e conjuntos de treino',
    ],
    status: 'published',
    order: 7,
    seoTitle: 'Computadores para visão computacional | UPAR AI',
    seoDescription:
      'Máquinas para treinamento e execução de modelos de visão computacional com múltiplas fontes simultâneas.',
  },
  {
    slug: 'automacao-empresarial',
    name: 'Automação empresarial com IA',
    icon: 'bolt',
    short: 'Agentes, integrações e automações rodando de forma contínua na estrutura da empresa.',
    intro:
      'Automação com IA costuma começar pequena e crescer rápido.',
    whoFor: [
      'Agências de automação e integradores',
      'Empresas com processos internos apoiados por agentes',
      'Times de operações que processam documentos em volume',
    ],
    challenges: [
      {
        title: 'Execução contínua, não eventual',
        description: 'Automação roda o dia inteiro. Estabilidade e refrigeração pesam mais do que pico de desempenho.',
      },
      {
        title: 'Vários processos concorrentes',
        description: 'Filas, integrações e modelos disputam os mesmos recursos e exigem folga de memória.',
      },
      {
        title: 'Crescimento imprevisível',
        description: 'O volume de automações tende a aumentar. Planejar expansão evita interrupção do serviço.',
      },
    ],
    components: [
      { component: 'RAM', weight: 4, why: 'Sustenta múltiplos serviços e filas em execução simultânea.' },
      { component: 'CPU', weight: 4, why: 'Coordena integrações, APIs e processamento de documentos.' },
      { component: 'VRAM', weight: 4, why: 'Define quais modelos podem ficar carregados em memória de forma permanente.' },
      { component: 'GPU', weight: 4, why: 'Executa os modelos usados pelos agentes.' },
      { component: 'Armazenamento', weight: 3, why: 'Guarda bases, logs e documentos processados.' },
    ],
    recommendedTiers: ['avancado', 'profissional'],
    expansion: [
      'Ampliação de memória conforme novas automações entram em produção',
      'GPU adicional para manter mais modelos carregados',
      'Migração para formato de servidor quando o uso se tornar crítico',
    ],
    status: 'published',
    order: 8,
    seoTitle: 'Infraestrutura para automação empresarial com IA | UPAR AI',
    seoDescription:
      'Computadores e servidores para executar agentes e automações de IA de forma contínua na infraestrutura da empresa.',
  },
  {
    slug: 'renderizacao-3d',
    name: 'Renderização 3D',
    icon: 'cube',
    short: 'Modelagem fluida e renderização final sem disputar recursos com o restante do projeto.',
    intro:
      'Em renderização, a placa de vídeo determina o tempo de cálculo e a VRAM determina o tamanho da cena que cabe na memória.',
    whoFor: [
      'Estúdios de arquitetura e visualização',
      'Designers de produto e times de engenharia',
      'Produtoras com pipeline 3D',
    ],
    challenges: [
      {
        title: 'Cenas grandes precisam caber na VRAM',
        description: 'Quando a cena não cabe, o render pode falhar ou recorrer à memória do sistema, ficando mais lento.',
      },
      {
        title: 'Modelagem e render competem entre si',
        description: 'Renderizar enquanto se continua modelando exige folga de recursos para manter a viewport fluida.',
      },
      {
        title: 'Bibliotecas de assets ocupam espaço',
        description: 'Texturas e modelos acumulam volume e exigem armazenamento rápido.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 5, why: 'Determina o tamanho e a complexidade da cena que pode ser renderizada.' },
      { component: 'GPU', weight: 5, why: 'Executa o cálculo do render e sustenta a viewport.' },
      { component: 'CPU', weight: 3, why: 'Participa da simulação, do baking e de renderizadores híbridos.' },
      { component: 'RAM', weight: 4, why: 'Necessária para montar a cena antes do envio para a GPU.' },
      { component: 'Armazenamento', weight: 3, why: 'Sustenta bibliotecas de assets e saídas em alta resolução.' },
    ],
    recommendedTiers: ['avancado', 'profissional', 'extremo'],
    expansion: [
      'Segunda GPU para reduzir o tempo de render final',
      'Ampliação de memória para cenas mais densas',
    ],
    status: 'published',
    order: 9,
    seoTitle: 'Workstations para renderização 3D | UPAR AI',
    seoDescription: 'Computadores com VRAM e refrigeração dimensionadas para renderização 3D profissional.',
  },
  {
    slug: 'engenharia-simulacoes',
    name: 'Engenharia e simulações',
    icon: 'flask',
    short: 'CAD, CAE e simulações numéricas com estabilidade para projetos extensos.',
    intro:
      'Simulações de engenharia costumam depender fortemente de núcleos de CPU e de memória, com a GPU atuando na visualização e em solvers específicos.',
    whoFor: [
      'Escritórios de engenharia e projetos industriais',
      'Times de P&D com análise estrutural, térmica ou de fluidos',
      'Universidades com laboratórios de simulação',
    ],
    challenges: [
      {
        title: 'Cada software tem seu gargalo',
        description:
          'Alguns solvers escalam com núcleos, outros com frequência, outros com GPU.',
      },
      {
        title: 'Malhas refinadas consomem memória',
        description: 'Aumentar a precisão da malha eleva rapidamente o uso de RAM.',
      },
      {
        title: 'Análises longas exigem estabilidade',
        description: 'Simulações de horas não podem ser interrompidas por instabilidade térmica ou de energia.',
      },
    ],
    components: [
      { component: 'CPU', weight: 5, why: 'A maior parte dos solvers depende diretamente dos núcleos de processamento.' },
      { component: 'RAM', weight: 5, why: 'Malhas refinadas e modelos complexos exigem grande volume de memória.' },
      { component: 'Armazenamento', weight: 3, why: 'Resultados de simulação geram arquivos extensos.' },
      { component: 'GPU', weight: 3, why: 'Sustenta a visualização e solvers acelerados por GPU.' },
      { component: 'VRAM', weight: 2, why: 'Relevante em visualização de modelos densos e solvers específicos.' },
    ],
    recommendedTiers: ['avancado', 'profissional', 'extremo'],
    expansion: ['Ampliação de memória do sistema', 'Armazenamento adicional para resultados', 'Rede para cluster de cálculo'],
    status: 'published',
    order: 10,
    seoTitle: 'Workstations para engenharia e simulação | UPAR AI',
    seoDescription: 'Computadores dimensionados para CAD, CAE e simulações numéricas de longa duração.',
  },
  {
    slug: 'desenvolvimento-de-software',
    name: 'Desenvolvimento de software',
    icon: 'code',
    short: 'Ambientes locais, contêineres e assistentes de código rodando sem travar o fluxo.',
    intro:
      'O desenvolvimento moderno mantém muitas coisas abertas ao mesmo tempo: editor, contêineres, bancos, testes e, cada vez mais, um modelo de IA assistindo o código.',
    whoFor: [
      'Times de engenharia de software',
      'Desenvolvedores que rodam modelos de código localmente',
      'Empresas que padronizam estações de desenvolvimento',
    ],
    challenges: [
      {
        title: 'Muitos processos simultâneos',
        description: 'Contêineres, bancos e serviços auxiliares consomem memória de forma constante.',
      },
      {
        title: 'Compilações longas',
        description: 'Projetos grandes se beneficiam diretamente de mais núcleos de CPU.',
      },
      {
        title: 'Assistentes locais precisam de VRAM',
        description: 'Rodar um modelo de código na própria máquina exige memória de vídeo reservada para isso.',
      },
    ],
    components: [
      { component: 'RAM', weight: 5, why: 'Sustenta ambiente, contêineres e ferramentas simultaneamente.' },
      { component: 'CPU', weight: 4, why: 'Determina o tempo de compilação e execução de testes.' },
      { component: 'Armazenamento', weight: 4, why: 'Velocidade de disco afeta diretamente build e indexação.' },
      { component: 'VRAM', weight: 3, why: 'Necessária quando há assistente de código executando localmente.' },
      { component: 'GPU', weight: 3, why: 'Usada por modelos locais e por testes de aplicações com IA.' },
    ],
    recommendedTiers: ['essencial', 'avancado'],
    expansion: ['Ampliação de memória', 'Inclusão de GPU com mais VRAM para modelos locais'],
    status: 'published',
    order: 11,
    seoTitle: 'Computadores para desenvolvimento de software com IA | UPAR AI',
    seoDescription:
      'Estações de desenvolvimento com folga de memória para contêineres, testes e assistentes de código locais.',
  },
  {
    slug: 'pesquisa-academica',
    name: 'Pesquisa acadêmica',
    icon: 'flask',
    short: 'Laboratórios e grupos de pesquisa com equipamento compartilhado e documentação para compra.',
    intro:
      'Projetos acadêmicos têm uma particularidade: além do dimensionamento técnico, existe um processo de compra com exigências formais.',
    whoFor: [
      'Universidades e institutos federais',
      'Grupos de pesquisa com verba de projeto',
      'Laboratórios com equipamento compartilhado entre pesquisadores',
    ],
    challenges: [
      {
        title: 'Equipamento compartilhado',
        description: 'Vários pesquisadores usando a mesma máquina exige planejamento de memória e organização de acesso.',
      },
      {
        title: 'Especificação para processo de compra',
        description:
          'A configuração precisa ser descrita de forma técnica e comparável, atendendo às exigências do processo.',
      },
      {
        title: 'Vida útil longa',
        description: 'O equipamento precisa continuar relevante ao longo de vários anos de projeto.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 4, why: 'Define quais modelos o grupo conseguirá estudar e reproduzir.' },
      { component: 'GPU', weight: 4, why: 'Base dos experimentos com aprendizado de máquina.' },
      { component: 'RAM', weight: 4, why: 'Permite uso simultâneo por mais de um pesquisador.' },
      { component: 'Armazenamento', weight: 4, why: 'Conjuntos de dados de pesquisa exigem capacidade e organização.' },
      { component: 'CPU', weight: 3, why: 'Sustenta pré-processamento e cargas que não usam GPU.' },
    ],
    recommendedTiers: ['avancado', 'profissional', 'extremo'],
    expansion: [
      'Estrutura preparada para GPUs adicionais conforme novas etapas do projeto',
      'Ampliação de memória e armazenamento ao longo da vida útil',
    ],
    status: 'published',
    order: 12,
    seoTitle: 'Computadores para pesquisa acadêmica em IA | UPAR AI',
    seoDescription:
      'Equipamentos para laboratórios e grupos de pesquisa, com apoio técnico na especificação para processos de compra.',
  },
  {
    slug: 'servidores-ia',
    name: 'Servidores e infraestrutura de IA',
    icon: 'server',
    short: 'Infraestrutura compartilhada para atender times inteiros com IA na rede da empresa.',
    intro:
      'Quando a IA deixa de ser um experimento e passa a ser serviço interno, o equipamento sai da mesa e vai para o rack.',
    whoFor: [
      'Empresas com times usando IA de forma simultânea',
      'Organizações com exigência de dados em infraestrutura própria',
      'Provedores de serviço que hospedam modelos para clientes',
    ],
    challenges: [
      {
        title: 'Atendimento simultâneo',
        description: 'O dimensionamento deixa de ser por usuário e passa a ser por requisições concorrentes.',
      },
      {
        title: 'Energia e refrigeração do ambiente',
        description: 'A sala precisa suportar o consumo e a dissipação do equipamento.',
      },
      {
        title: 'Integração com a rede existente',
        description: 'Autenticação, segmentação e velocidade de rede fazem parte do projeto.',
      },
    ],
    components: [
      { component: 'VRAM', weight: 5, why: 'Determina quantos modelos ficam disponíveis simultaneamente.' },
      { component: 'GPU', weight: 5, why: 'Núcleo do serviço de inferência ou treinamento compartilhado.' },
      { component: 'Rede', weight: 4, why: 'Sustenta o acesso simultâneo de vários usuários e sistemas.' },
      { component: 'RAM', weight: 4, why: 'Suporta orquestração, filas e múltiplos serviços.' },
      { component: 'Armazenamento', weight: 4, why: 'Repositório de modelos, dados e registros de uso.' },
    ],
    recommendedTiers: ['profissional', 'extremo'],
    expansion: [
      'Adição de GPUs conforme a demanda interna cresce',
      'Ampliação de armazenamento e rede',
      'Evolução para mais de um nó de processamento',
    ],
    status: 'published',
    order: 13,
    seoTitle: 'Servidores de IA para empresas | UPAR AI',
    seoDescription:
      'Infraestrutura de IA para uso compartilhado dentro da empresa, com dimensionamento de energia, refrigeração e rede.',
  },
]

export const applicationBySlug = (slug: string) => applications.find((a) => a.slug === slug)
