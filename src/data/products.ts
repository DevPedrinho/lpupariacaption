import type { Capability, Highlight, Product } from '@/lib/types'
import { buildExplainers } from './product-helpers'

/* ============================================================================
   DADOS DEMONSTRATIVOS
   Todos os produtos abaixo têm `isDemo: true`. As configurações servem para
   validar a experiência de navegação, filtros, comparação e diagnóstico.
   Antes da publicação, a UPAR deve substituir por seu catálogo real.
   Nenhum benchmark foi cadastrado — a lista `benchmarks` está vazia em todos
   os produtos e só deve ser preenchida com medições validadas pela equipe.
   Os valores em `priceBrl` são DEMONSTRATIVOS e existem apenas para exercitar
   o filtro de faixa de investimento; a interface os identifica como tal.
   ========================================================================== */

const SERVICES_BASE = [
  'Montagem realizada pela equipe técnica da UPAR',
  'Testes de estabilidade sob carga antes da entrega',
  'Instalação do sistema operacional e do ambiente de trabalho',
  'Orientação inicial de uso e configuração',
  'Suporte técnico com a equipe que montou o equipamento',
]

type Draft = Omit<Product, 'explainers' | 'services' | 'benchmarks' | 'isDemo' | 'status' | 'updatedAt'> &
  Partial<Pick<Product, 'services' | 'status'>>

function make(draft: Draft): Product {
  return {
    ...draft,
    services: draft.services ?? SERVICES_BASE,
    explainers: buildExplainers(draft),
    benchmarks: [],
    status: draft.status ?? 'published',
    isDemo: true,
    updatedAt: '2026-09-01T12:00:00.000Z',
  }
}

const CAP: Record<string, Capability> = {
  llmSmall: {
    icon: 'brain',
    title: 'Executar modelos de linguagem localmente',
    description:
      'Roda assistentes e modelos abertos dentro da sua rede. A equipe da UPAR valida quais modelos cabem na VRAM desta configuração antes da compra.',
  },
  llmLarge: {
    icon: 'brain',
    title: 'Sustentar modelos de linguagem maiores',
    description:
      'A folga de VRAM amplia o tamanho de modelo e de contexto viáveis.',
  },
  imagem: {
    icon: 'image',
    title: 'Gerar imagens com IA',
    description:
      'Atende fluxos de geração e refinamento de imagem em resolução alta, incluindo produção em lote para catálogo e campanhas.',
  },
  video: {
    icon: 'video',
    title: 'Editar e gerar vídeo',
    description:
      'Sustenta edição em alta resolução com efeitos e etapas generativas, mantendo a pré-visualização fluida durante o trabalho.',
  },
  dados: {
    icon: 'chart',
    title: 'Processar grandes volumes de dados',
    description:
      'Mantém conjuntos extensos em memória durante a análise, reduzindo o tempo de leitura e transformação das bases.',
  },
  treino: {
    icon: 'layers',
    title: 'Treinar e ajustar modelos',
    description:
      'Suporta treinamento e ajuste fino com estabilidade térmica para execuções longas, sem oscilação de desempenho.',
  },
  visao: {
    icon: 'eye',
    title: 'Desenvolver visão computacional',
    description:
      'Atende desde o treinamento com conjuntos de imagens até a execução do modelo sobre câmeras ou lotes de arquivos.',
  },
  render: {
    icon: 'cube',
    title: 'Renderizar projetos complexos',
    description:
      'Cenas com geometria densa e texturas em alta resolução cabem na memória de vídeo, evitando falhas e quedas de desempenho no render.',
  },
  multi: {
    icon: 'code',
    title: 'Executar várias aplicações profissionais',
    description:
      'Mantém ambiente de desenvolvimento, contêineres, bancos e modelos ativos ao mesmo tempo sem perda de fluidez.',
  },
  servico: {
    icon: 'server',
    title: 'Servir IA para toda a equipe',
    description:
      'Preparado para operar como serviço interno, atendendo várias pessoas e sistemas simultaneamente pela rede da empresa.',
  },
}

const H = (title: string, description: string): Highlight => ({ title, description })

export const products: Product[] = [
  make({
    id: 'p-studio-16',
    slug: 'upar-ai-studio-16',
    name: 'UPAR AI Studio 16',
    formFactor: 'desktop',
    performanceTier: 'essencial',
    tagline: 'A porta de entrada consistente para trabalhar com IA localmente.',
    summary:
      'Configuração pensada para quem está começando a rodar IA na própria máquina sem abrir mão de estabilidade.',
    applications: ['desenvolvimento-de-software', 'geracao-de-imagens', 'ciencia-de-dados', 'llms-locais'],
    clientProfile:
      'Desenvolvedores, analistas e pequenos times que querem sair da nuvem e começar a executar modelos localmente.',
    cpu: { model: 'AMD Ryzen 7 9700X', cores: 8, threads: 16 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 4060 Ti 16 GB', quantity: 1, vramGb: 16 },
    maxGpus: 1,
    ram: { capacityGb: 64, type: 'DDR5', slotsUsed: 2, slotsTotal: 4, maxGb: 192 },
    storage: [
      { kind: 'NVMe', capacityGb: 1000, purpose: 'Sistema e aplicações' },
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Modelos e projetos' },
    ],
    cooling: 'Refrigeração a ar de alto desempenho, com fluxo dimensionado para uso contínuo',
    psu: 'Fonte 850 W com certificação de eficiência e cabeamento modular',
    network: 'Ethernet 2,5 Gbps integrada e Wi-Fi 6E',
    chassis: 'Gabinete de fluxo otimizado com painel frontal em malha',
    expansion: [
      'Duas posições de memória livres para ampliar até 192 GB',
      'Slots M.2 adicionais para armazenamento',
      'Fonte com folga para upgrade de placa de vídeo',
    ],
    highlights: [
      H('16 GB de VRAM no ponto de entrada', 'Mais memória de vídeo do que a maioria das máquinas nesta faixa, o que amplia bastante o que dá para executar localmente.'),
      H('Silenciosa em uso contínuo', 'Fluxo de ar projetado para manter o ruído baixo mesmo com a placa de vídeo sob carga por horas.'),
      H('Preparada para crescer', 'Memória e armazenamento podem ser ampliados sem trocar o equipamento.'),
    ],
    capabilities: [CAP.llmSmall, CAP.imagem, CAP.multi, CAP.dados],
    priceMode: 'from',
    priceBrl: 21900,
    availability: 'made_to_order',
    leadTime: 'Prazo de montagem confirmado pelo especialista',
    services: SERVICES_BASE,
    customizable: true,
    images: [
      { render: 'tower-glass', alt: 'Render ilustrativo da workstation UPAR AI Studio 16 com painel lateral em vidro' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo da placa de vídeo instalada' },
      { render: 'component-board', alt: 'Detalhe ilustrativo da placa-mãe e dos módulos de memória' },
    ],
    relatedSlugs: ['upar-ai-studio-24', 'upar-ai-lab-48'],
    featured: false,
    seoTitle: 'UPAR AI Studio 16 — computador para IA local com 16 GB de VRAM',
    seoDescription:
      'Configuração de entrada da UPAR AI para executar modelos localmente, gerar imagens e sustentar ambientes de desenvolvimento.',
  }),

  make({
    id: 'p-studio-24',
    slug: 'upar-ai-studio-24',
    name: 'UPAR AI Studio 24',
    formFactor: 'desktop',
    performanceTier: 'avancado',
    tagline: 'O equilíbrio entre VRAM, núcleos e memória para uso profissional diário.',
    summary:
      'Configuração para quem já trabalha com IA todos os dias e precisa de folga em todas as frentes.',
    applications: ['llms-locais', 'geracao-de-imagens', 'ciencia-de-dados', 'machine-learning', 'desenvolvimento-de-software'],
    clientProfile:
      'Profissionais e times pequenos que usam IA como ferramenta central de trabalho, não como experimento.',
    cpu: { model: 'AMD Ryzen 9 9950X', cores: 16, threads: 32 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 4090 24 GB', quantity: 1, vramGb: 24 },
    maxGpus: 2,
    ram: { capacityGb: 96, type: 'DDR5', slotsUsed: 2, slotsTotal: 4, maxGb: 192 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema, aplicações e modelos' },
      { kind: 'NVMe', capacityGb: 4000, purpose: 'Conjuntos de dados e entregas' },
    ],
    cooling: 'Refrigeração líquida de 360 mm com ventilação frontal dedicada às placas',
    psu: 'Fonte 1200 W modular, dimensionada para a inclusão de uma segunda placa de vídeo',
    network: 'Ethernet 10 Gbps e Wi-Fi 6E',
    chassis: 'Gabinete full tower com compartimentos separados para fonte e armazenamento',
    expansion: [
      'Segunda placa de vídeo suportada pela fonte e pelo chassi',
      'Memória expansível até 192 GB',
      'Baias adicionais para armazenamento de projeto',
    ],
    highlights: [
      H('24 GB de VRAM com 16 núcleos', 'Equilíbrio difícil de encontrar: não sacrifica a preparação de dados para privilegiar só a placa de vídeo.'),
      H('Espaço real para a segunda GPU', 'Fonte e chassi já dimensionados — a ampliação não exige trocar componentes.'),
      H('Refrigeração para cargas longas', 'Mantém desempenho estável em gerações em lote e treinamentos prolongados.'),
    ],
    capabilities: [CAP.llmSmall, CAP.imagem, CAP.dados, CAP.treino, CAP.multi],
    priceMode: 'from',
    priceBrl: 42900,
    availability: 'in_stock',
    leadTime: 'Disponibilidade confirmada pelo especialista',
    customizable: true,
    images: [
      { render: 'tower-glass', alt: 'Render ilustrativo da workstation UPAR AI Studio 24' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo da placa de vídeo de 24 GB' },
      { render: 'component-board', alt: 'Detalhe ilustrativo da plataforma e memória' },
    ],
    relatedSlugs: ['upar-ai-studio-16', 'upar-ai-lab-48', 'upar-ai-vision-32'],
    featured: true,
    seoTitle: 'UPAR AI Studio 24 — workstation com 24 GB de VRAM para IA',
    seoDescription:
      'Workstation de uso profissional diário para IA local, geração de imagens e ciência de dados, com espaço para segunda GPU.',
  }),

  make({
    id: 'p-vision-32',
    slug: 'upar-ai-vision-32',
    name: 'UPAR AI Vision 32',
    formFactor: 'workstation',
    performanceTier: 'avancado',
    tagline: 'Para quem trabalha com imagem e vídeo em volume, do bruto à entrega.',
    summary:
      'Configuração orientada a fluxos visuais pesados. Reúne 32 GB de VRAM, 128 GB de memória e 10 TB de armazenamento rápido para sustentar edição em alta resolução, geração de vídeo e projetos de visão computacional com várias fontes simultâneas.',
    applications: ['geracao-de-video', 'visao-computacional', 'geracao-de-imagens', 'renderizacao-3d'],
    clientProfile: 'Produtoras, estúdios e integradores que trabalham com imagem em movimento e inspeção visual.',
    cpu: { model: 'AMD Ryzen 9 9950X', cores: 16, threads: 32 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 5090 32 GB', quantity: 1, vramGb: 32 },
    maxGpus: 2,
    ram: { capacityGb: 128, type: 'DDR5', slotsUsed: 4, slotsTotal: 4, maxGb: 192 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema e cache de edição' },
      { kind: 'NVMe', capacityGb: 8000, purpose: 'Material bruto e projetos ativos' },
    ],
    cooling: 'Refrigeração líquida de 360 mm com controle de curva por carga',
    psu: 'Fonte 1300 W modular com folga para expansão',
    network: 'Ethernet 10 Gbps para integração com armazenamento compartilhado',
    chassis: 'Gabinete full tower com isolamento acústico',
    expansion: [
      'Segunda placa de vídeo para paralelizar render e geração',
      'Volumes adicionais de armazenamento por projeto',
      'Placa de captura ou interface de rede dedicada',
    ],
    highlights: [
      H('32 GB de VRAM', 'Folga para efeitos, composição e etapas generativas sem interromper a edição.'),
      H('10 TB de armazenamento rápido', 'Material bruto e cache no mesmo equipamento, sem depender de disco externo lento.'),
      H('Silenciosa em estúdio', 'Isolamento acústico pensado para ambientes onde o ruído atrapalha o trabalho.'),
    ],
    capabilities: [CAP.video, CAP.imagem, CAP.visao, CAP.render, CAP.llmSmall],
    priceMode: 'from',
    priceBrl: 58900,
    availability: 'made_to_order',
    customizable: true,
    images: [
      { render: 'tower-mesh', alt: 'Render ilustrativo da workstation UPAR AI Vision 32' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo da placa de vídeo de 32 GB' },
      { render: 'component-board', alt: 'Detalhe ilustrativo do armazenamento NVMe' },
    ],
    relatedSlugs: ['upar-ai-studio-24', 'upar-ai-render-pro', 'upar-ai-forge-48'],
    featured: true,
    seoTitle: 'UPAR AI Vision 32 — workstation para vídeo e visão computacional',
    seoDescription:
      'Workstation com 32 GB de VRAM e 10 TB de armazenamento rápido para edição em alta resolução, geração de vídeo e visão computacional.',
  }),

  make({
    id: 'p-lab-48',
    slug: 'upar-ai-lab-48',
    name: 'UPAR AI Lab 48',
    formFactor: 'workstation',
    performanceTier: 'avancado',
    tagline: 'Duas placas de vídeo para quem precisa de VRAM total, não de uma placa maior.',
    summary:
      'Configuração de duas placas que soma 48 GB de memória de vídeo, pensada para grupos que compartilham o mesmo equipamento ou para fluxos que executam mais de um modelo ao mesmo tempo.',
    applications: ['llms-locais', 'machine-learning', 'pesquisa-academica', 'automacao-empresarial'],
    clientProfile: 'Laboratórios, grupos de pesquisa e times que dividem uma mesma máquina entre várias pessoas.',
    cpu: { model: 'AMD Ryzen 9 9950X', cores: 16, threads: 32 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 4090 24 GB', quantity: 2, vramGb: 24 },
    maxGpus: 2,
    ram: { capacityGb: 192, type: 'DDR5', slotsUsed: 4, slotsTotal: 4 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema e ambiente' },
      { kind: 'NVMe', capacityGb: 4000, purpose: 'Repositório de modelos' },
      { kind: 'HDD', capacityGb: 8000, purpose: 'Arquivo de conjuntos de dados' },
    ],
    cooling: 'Refrigeração líquida no processador e fluxo direcionado para as duas placas',
    psu: 'Fonte 1600 W modular dimensionada para duas placas em carga simultânea',
    network: 'Ethernet 10 Gbps',
    chassis: 'Gabinete full tower com espaçamento entre placas',
    expansion: [
      'Armazenamento adicional para conjuntos de dados',
      'Rede de maior velocidade para acesso compartilhado',
      'Reorganização das placas conforme o projeto evolui',
    ],
    highlights: [
      H('48 GB de VRAM somados', 'Duas placas ampliam a memória total disponível e permitem executar modelos diferentes em paralelo.'),
      H('192 GB de memória do sistema', 'Vários pesquisadores ou processos trabalhando ao mesmo tempo sem disputa.'),
      H('Espaçamento térmico entre placas', 'Layout que evita que uma placa aqueça a outra em cargas longas.'),
    ],
    capabilities: [CAP.llmLarge, CAP.treino, CAP.dados, CAP.multi],
    priceMode: 'on_request',
    availability: 'made_to_order',
    customizable: true,
    images: [
      { render: 'tower-mesh', alt: 'Render ilustrativo da workstation UPAR AI Lab 48 com duas placas de vídeo' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo das duas placas de vídeo instaladas' },
      { render: 'component-board', alt: 'Detalhe ilustrativo dos módulos de memória' },
    ],
    relatedSlugs: ['upar-ai-studio-24', 'upar-ai-forge-48', 'upar-ai-atlas-192'],
    featured: true,
    seoTitle: 'UPAR AI Lab 48 — workstation com duas GPUs e 48 GB de VRAM',
    seoDescription:
      'Workstation com duas placas de vídeo somando 48 GB de VRAM, indicada para laboratórios e equipamentos compartilhados.',
  }),

  make({
    id: 'p-forge-48',
    slug: 'upar-ai-forge-48',
    name: 'UPAR AI Forge 48',
    formFactor: 'workstation',
    performanceTier: 'profissional',
    tagline: '48 GB em uma única placa profissional, com memória do sistema com correção de erro.',
    summary:
      'Plataforma profissional com processador de 24 núcleos, memória com correção de erro e uma placa de vídeo de 48 GB.',
    applications: ['deep-learning', 'llms-locais', 'renderizacao-3d', 'engenharia-simulacoes', 'pesquisa-academica'],
    clientProfile:
      'Times de engenharia, P&D e produção que rodam cargas longas e não podem conviver com instabilidade.',
    cpu: { model: 'AMD Ryzen Threadripper 7960X', cores: 24, threads: 48 },
    gpu: { vendor: 'NVIDIA', model: 'RTX 6000 Ada 48 GB', quantity: 1, vramGb: 48 },
    maxGpus: 3,
    ram: { capacityGb: 256, type: 'DDR5 ECC', slotsUsed: 4, slotsTotal: 8, maxGb: 1024 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema' },
      { kind: 'NVMe', capacityGb: 8000, purpose: 'Modelos e dados ativos' },
    ],
    cooling: 'Refrigeração líquida dedicada ao processador e fluxo direcionado às placas',
    psu: 'Fonte 1600 W modular preparada para até três placas de vídeo',
    network: 'Ethernet 10 Gbps dupla',
    chassis: 'Gabinete workstation com suporte a placas de dupla e tripla largura',
    expansion: [
      'Até três placas de vídeo no mesmo chassi',
      'Memória com correção de erro expansível até 1 TB',
      'Baias e slots M.2 adicionais',
    ],
    highlights: [
      H('48 GB de VRAM em uma única placa', 'Modelos grandes cabem inteiros em uma placa, sem a complexidade de dividir a carga entre duas.'),
      H('Memória com correção de erro', 'Reduz o risco de falha silenciosa em execuções que duram horas ou dias.'),
      H('24 núcleos de processamento', 'Preparação de dados e simulações não ficam limitadas pelo processador.'),
    ],
    capabilities: [CAP.llmLarge, CAP.treino, CAP.render, CAP.dados, CAP.visao],
    priceMode: 'on_request',
    availability: 'made_to_order',
    customizable: true,
    images: [
      { render: 'tower-glass', alt: 'Render ilustrativo da workstation profissional UPAR AI Forge 48' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo da placa profissional de 48 GB' },
      { render: 'component-board', alt: 'Detalhe ilustrativo da plataforma com memória ECC' },
    ],
    relatedSlugs: ['upar-ai-lab-48', 'upar-ai-atlas-192', 'upar-ai-render-pro'],
    featured: true,
    seoTitle: 'UPAR AI Forge 48 — workstation profissional com 48 GB de VRAM',
    seoDescription:
      'Workstation profissional com placa de 48 GB, 24 núcleos e memória ECC para deep learning, render e simulação.',
  }),

  make({
    id: 'p-render-pro',
    slug: 'upar-ai-render-pro',
    name: 'UPAR AI Render Pro',
    formFactor: 'workstation',
    performanceTier: 'profissional',
    tagline: 'Render, simulação e pós-produção com 48 GB de VRAM distribuídos em duas placas.',
    summary:
      'Configuração construída para pipelines visuais pesados: duas placas de vídeo permitem renderizar em uma enquanto a outra sustenta a viewport ou um fluxo generativo.',
    applications: ['renderizacao-3d', 'geracao-de-video', 'engenharia-simulacoes', 'geracao-de-imagens'],
    clientProfile: 'Estúdios de arquitetura, visualização e pós-produção com prazos apertados.',
    cpu: { model: 'Intel Xeon w7-2495X', cores: 24, threads: 48 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 4090 24 GB', quantity: 2, vramGb: 24 },
    maxGpus: 3,
    ram: { capacityGb: 256, type: 'DDR5 ECC', slotsUsed: 8, slotsTotal: 8, maxGb: 1024 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema e cache' },
      { kind: 'NVMe', capacityGb: 8000, purpose: 'Projetos e bibliotecas de assets' },
      { kind: 'HDD', capacityGb: 16000, purpose: 'Arquivo de projetos concluídos' },
    ],
    cooling: 'Refrigeração líquida de 420 mm com exaustão direcionada',
    psu: 'Fonte 1600 W modular com proteção contra oscilação',
    network: 'Ethernet 10 Gbps dupla para fluxo compartilhado',
    chassis: 'Gabinete workstation com filtros removíveis e manutenção facilitada',
    expansion: [
      'Terceira placa de vídeo suportada pelo chassi e pela fonte',
      'Armazenamento expansível por projeto',
      'Memória com correção de erro até 1 TB',
    ],
    highlights: [
      H('Duas placas trabalhando em paralelo', 'Renderize em uma enquanto continua modelando ou gerando na outra.'),
      H('26 TB de armazenamento em camadas', 'NVMe para o que está ativo, disco mecânico para o arquivo do estúdio.'),
      H('Manutenção simples', 'Filtros removíveis e acesso direto aos componentes para limpeza periódica.'),
    ],
    capabilities: [CAP.render, CAP.video, CAP.imagem, CAP.multi],
    priceMode: 'on_request',
    availability: 'made_to_order',
    customizable: true,
    images: [
      { render: 'tower-glass', alt: 'Render ilustrativo da workstation UPAR AI Render Pro' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo das duas placas de vídeo' },
      { render: 'component-board', alt: 'Detalhe ilustrativo do sistema de refrigeração' },
    ],
    relatedSlugs: ['upar-ai-vision-32', 'upar-ai-forge-48', 'upar-ai-atlas-192'],
    featured: false,
    seoTitle: 'UPAR AI Render Pro — workstation para renderização e pós-produção',
    seoDescription:
      'Workstation com duas placas de vídeo, 24 núcleos e armazenamento em camadas para render 3D e pós-produção.',
  }),

  make({
    id: 'p-atlas-192',
    slug: 'upar-ai-atlas-192',
    name: 'UPAR AI Atlas 192',
    formFactor: 'workstation',
    performanceTier: 'extremo',
    tagline: 'Quatro placas profissionais e 192 GB de VRAM em um único equipamento de mesa.',
    summary:
      'A configuração mais densa da linha de workstations. Quatro placas de 48 GB somam 192 GB de memória de vídeo, viabilizando modelos de grande porte e treinamentos que normalmente exigiriam ir para a nuvem.',
    applications: ['deep-learning', 'llms-locais', 'servidores-ia', 'pesquisa-academica', 'machine-learning'],
    clientProfile:
      'Centros de pesquisa e empresas que precisam de capacidade de nuvem dentro da própria estrutura.',
    cpu: { model: 'AMD Ryzen Threadripper PRO 7975WX', cores: 32, threads: 64 },
    gpu: { vendor: 'NVIDIA', model: 'RTX 6000 Ada 48 GB', quantity: 4, vramGb: 48 },
    maxGpus: 4,
    ram: { capacityGb: 512, type: 'DDR5 ECC Registrada', slotsUsed: 8, slotsTotal: 8, maxGb: 2048 },
    storage: [
      { kind: 'NVMe', capacityGb: 4000, purpose: 'Sistema e ambiente' },
      { kind: 'NVMe', capacityGb: 16000, purpose: 'Modelos e conjuntos de treino' },
    ],
    cooling: 'Projeto térmico dedicado com exaustão dimensionada para quatro placas em carga simultânea',
    psu: 'Duas fontes de 2000 W com distribuição balanceada de carga',
    network: 'Ethernet 10 Gbps dupla, com opção de interface de maior velocidade',
    chassis: 'Gabinete de alta densidade com ventilação frontal reforçada',
    expansion: [
      'Ampliação de memória até 2 TB',
      'Interface de rede de maior velocidade para integração com armazenamento externo',
      'Migração do projeto para formato de rack quando a operação exigir',
    ],
    highlights: [
      H('192 GB de VRAM total', 'Viabiliza modelos de grande porte sem depender de infraestrutura externa.'),
      H('Energia e térmica projetadas para a densidade', 'Duas fontes e exaustão dimensionada mantêm as quatro placas estáveis sob carga.'),
      H('32 núcleos de processamento', 'Alimenta as quatro placas com dados sem se tornar o gargalo.'),
    ],
    capabilities: [CAP.llmLarge, CAP.treino, CAP.servico, CAP.dados, CAP.visao],
    priceMode: 'on_request',
    availability: 'made_to_order',
    leadTime: 'Projeto sob encomenda — prazo definido na proposta',
    customizable: true,
    images: [
      { render: 'tower-mesh', alt: 'Render ilustrativo da workstation de alta densidade UPAR AI Atlas 192' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo das quatro placas profissionais' },
      { render: 'component-board', alt: 'Detalhe ilustrativo da plataforma de alta densidade' },
    ],
    relatedSlugs: ['upar-ai-forge-48', 'upar-ai-node-r2', 'upar-ai-lab-48'],
    featured: true,
    seoTitle: 'UPAR AI Atlas 192 — workstation com 192 GB de VRAM',
    seoDescription:
      'Workstation de alta densidade com quatro placas profissionais somando 192 GB de VRAM para deep learning e LLMs de grande porte.',
  }),

  make({
    id: 'p-node-r2',
    slug: 'upar-ai-node-r2',
    name: 'UPAR AI Node R2',
    formFactor: 'server',
    performanceTier: 'extremo',
    tagline: 'IA como serviço interno: do rack para toda a empresa.',
    summary:
      'Servidor em formato de rack para organizações que precisam oferecer IA a vários times ao mesmo tempo, mantendo os dados na própria infraestrutura.',
    applications: ['servidores-ia', 'automacao-empresarial', 'llms-locais', 'deep-learning'],
    clientProfile:
      'Empresas com uso corporativo de IA, área de TI estruturada e exigência de dados em infraestrutura própria.',
    cpu: { model: 'AMD EPYC 9354', cores: 32, threads: 64 },
    gpu: { vendor: 'NVIDIA', model: 'L40S 48 GB', quantity: 4, vramGb: 48 },
    maxGpus: 4,
    ram: { capacityGb: 512, type: 'DDR5 ECC Registrada', slotsUsed: 12, slotsTotal: 24, maxGb: 3072 },
    storage: [
      { kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema' },
      { kind: 'NVMe', capacityGb: 16000, purpose: 'Modelos e dados em produção' },
    ],
    cooling: 'Refrigeração de rack com fluxo frontal e exaustão traseira',
    psu: 'Fontes redundantes com troca a quente',
    network: 'Duas interfaces de 25 Gbps e porta dedicada de gerenciamento remoto',
    chassis: 'Chassi 2U para rack padrão de 19 polegadas',
    expansion: [
      'Ampliação de memória até 3 TB',
      'Armazenamento adicional em baias frontais',
      'Composição de mais de um nó conforme a demanda cresce',
    ],
    highlights: [
      H('Acesso simultâneo para vários times', 'Dimensionado por requisições concorrentes, não por usuário único.'),
      H('Fontes redundantes', 'Continuidade do serviço mesmo com falha de uma das fontes.'),
      H('Gerenciamento remoto', 'A equipe de TI administra o equipamento sem precisar estar fisicamente ao lado dele.'),
    ],
    capabilities: [CAP.servico, CAP.llmLarge, CAP.treino, CAP.dados],
    priceMode: 'on_request',
    availability: 'pre_order',
    leadTime: 'Projeto sob encomenda — prazo definido na proposta',
    customizable: true,
    images: [
      { render: 'rack-2u', alt: 'Render ilustrativo do servidor de rack UPAR AI Node R2' },
      { render: 'component-gpu', alt: 'Detalhe ilustrativo dos aceleradores instalados' },
      { render: 'component-board', alt: 'Detalhe ilustrativo do interior do servidor' },
    ],
    relatedSlugs: ['upar-ai-atlas-192', 'upar-ai-forge-48'],
    featured: false,
    seoTitle: 'UPAR AI Node R2 — servidor de IA para empresas',
    seoDescription:
      'Servidor 2U com quatro aceleradores e rede de 25 Gbps para oferecer IA como serviço interno na infraestrutura da empresa.',
  }),

  make({
    id: 'p-compact-16',
    slug: 'upar-ai-compact-16',
    name: 'UPAR AI Compact 16',
    formFactor: 'desktop',
    performanceTier: 'essencial',
    tagline: 'Formato reduzido para ambientes onde o espaço é limitado.',
    summary:
      'Versão compacta para escritórios, consultórios e laboratórios com pouco espaço em bancada.',
    applications: ['automacao-empresarial', 'llms-locais', 'desenvolvimento-de-software'],
    clientProfile: 'Escritórios e operações que precisam de IA local sem espaço para um equipamento grande.',
    cpu: { model: 'AMD Ryzen 7 9700X', cores: 8, threads: 16 },
    gpu: { vendor: 'NVIDIA', model: 'GeForce RTX 4060 Ti 16 GB', quantity: 1, vramGb: 16 },
    maxGpus: 1,
    ram: { capacityGb: 64, type: 'DDR5', slotsUsed: 2, slotsTotal: 2, maxGb: 96 },
    storage: [{ kind: 'NVMe', capacityGb: 2000, purpose: 'Sistema, modelos e dados' }],
    cooling: 'Refrigeração compacta com dissipador de baixo perfil e exaustão direcionada',
    psu: 'Fonte SFX de 750 W com certificação de eficiência',
    network: 'Ethernet 2,5 Gbps e Wi-Fi 6E',
    chassis: 'Gabinete compacto para bancada',
    expansion: ['Substituição do armazenamento por unidade de maior capacidade', 'Ampliação de memória até 96 GB'],
    highlights: [
      H('Cabe na bancada', 'Volume reduzido sem abrir mão dos 16 GB de VRAM.'),
      H('Operação silenciosa', 'Projetado para ficar ao lado de quem trabalha, em escritório ou consultório.'),
      H('Consumo contido', 'Adequado para operação contínua em instalações elétricas convencionais.'),
    ],
    capabilities: [CAP.llmSmall, CAP.multi, CAP.imagem],
    priceMode: 'displayed',
    priceBrl: 18900,
    availability: 'in_stock',
    customizable: true,
    images: [
      { render: 'desktop-compact', alt: 'Render ilustrativo do computador compacto UPAR AI Compact 16' },
      { render: 'component-board', alt: 'Detalhe ilustrativo do interior compacto' },
    ],
    relatedSlugs: ['upar-ai-studio-16', 'upar-ai-studio-24'],
    featured: false,
    seoTitle: 'UPAR AI Compact 16 — computador compacto para IA local',
    seoDescription:
      'Computador compacto com 16 GB de VRAM para rodar modelos de IA localmente em espaços reduzidos.',
  }),
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
