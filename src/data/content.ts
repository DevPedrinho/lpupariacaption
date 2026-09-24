import { DEFAULT_DIAGNOSTIC_QUESTIONS } from './diagnostic-questions'
import { defaultLandingPages } from './landing'
import type { Article, CategoryComparison, Faq, Testimonial, SiteSettings, AdminUser, AuditLog } from '@/lib/types'

/* ------------------------- Comparativo de categorias ----------------------- */

export const categoryComparison: CategoryComparison[] = [
  {
    tier: 'essencial',
    name: 'Essencial',
    positioning: 'Primeiro passo para sair da nuvem e executar IA localmente.',
    typicalGpu: '1 placa de vídeo',
    typicalVram: '16 GB',
    typicalRam: '64 GB',
    bestFor: 'Desenvolvimento, geração de imagens, análise de dados e modelos de porte médio.',
    notFor: 'Treinamento de modelos grandes ou uso simultâneo por várias pessoas.',
  },
  {
    tier: 'avancado',
    name: 'Avançado',
    positioning: 'Uso profissional diário, com folga para crescer.',
    typicalGpu: '1 a 2 placas de vídeo',
    typicalVram: '24 a 48 GB',
    typicalRam: '96 a 192 GB',
    bestFor: 'IA local no dia a dia, produção de conteúdo, visão computacional e ciência de dados.',
    notFor: 'Operação compartilhada por um time inteiro de forma contínua.',
  },
  {
    tier: 'profissional',
    name: 'Profissional',
    positioning: 'Cargas críticas e execuções longas, com memória com correção de erro.',
    typicalGpu: '1 a 3 placas de vídeo',
    typicalVram: '48 GB ou mais',
    typicalRam: '256 GB ou mais',
    bestFor: 'Deep learning, renderização profissional, simulação e modelos de grande porte.',
    notFor: 'Necessidades pontuais ou orçamento de entrada.',
  },
  {
    tier: 'extremo',
    name: 'Extremo',
    positioning: 'Capacidade de nuvem dentro da sua própria estrutura.',
    typicalGpu: '4 placas de vídeo',
    typicalVram: '192 GB somados',
    typicalRam: '512 GB ou mais',
    bestFor: 'Treinamento de modelos grandes, IA como serviço interno e centros de pesquisa.',
    notFor: 'Ambientes sem infraestrutura elétrica e de refrigeração adequada.',
  },
]

/* ------------------------------- Depoimentos ------------------------------- */
/* DEMONSTRATIVOS. Substituir por depoimentos reais coletados pela UPAR.       */

export const testimonials: Testimonial[] = [
  {
    id: 't-1',
    quote:
      'Chegamos com uma ideia vaga do que precisávamos.',
    author: 'Nome do cliente',
    role: 'Cargo',
    organization: 'Organização',
    segment: 'Tecnologia',
    status: 'published',
    isDemo: true,
  },
  {
    id: 't-2',
    quote:
      'O que pesou na decisão foi a explicação clara sobre VRAM.',
    author: 'Nome do cliente',
    role: 'Cargo',
    organization: 'Organização',
    segment: 'Pesquisa',
    status: 'published',
    isDemo: true,
  },
  {
    id: 't-3',
    quote:
      'Precisávamos de documentação técnica detalhada para o processo de compra.',
    author: 'Nome do cliente',
    role: 'Cargo',
    organization: 'Organização',
    segment: 'Universidade',
    status: 'published',
    isDemo: true,
  },
]

/* --------------------------------- FAQ ------------------------------------ */

export const faqs: Faq[] = [
  {
    id: 'f-1',
    question: 'Como sei qual configuração atende a minha necessidade?',
    answer:
      'O diagnóstico "Encontre sua configuração" resolve em cinco perguntas. Um especialista valida o resultado antes da proposta.',
    scope: 'home',
    order: 1,
    status: 'published',
  },
  {
    id: 'f-2',
    question: 'Por que a VRAM é tão importante para inteligência artificial?',
    answer:
      'A VRAM é a memória da placa de vídeo. O modelo precisa caber nela para rodar com fluidez.',
    scope: 'home',
    order: 2,
    status: 'published',
  },
  {
    id: 'f-3',
    question: 'Faz sentido rodar IA localmente em vez de usar a nuvem?',
    answer:
      'Depende do uso. Localmente costuma compensar quando o volume é constante, os dados não podem sair da empresa ou o custo precisa ser previsível.',
    scope: 'home',
    order: 3,
    status: 'published',
  },
  {
    id: 'f-4',
    question: 'Consigo ampliar o equipamento depois?',
    answer:
      'Sim. Cada configuração informa o que pode ser ampliado: memória, armazenamento e, quando chassi e fonte permitem, mais placas de vídeo.',
    scope: 'home',
    order: 4,
    status: 'published',
  },
  {
    id: 'f-5',
    question: 'Vocês atendem empresas, universidades e órgãos públicos?',
    answer:
      'Sim. Acompanhamos as exigências formais de cada tipo de compra, incluindo a documentação de processos institucionais.',
    scope: 'home',
    order: 5,
    status: 'published',
  },
  {
    id: 'f-6',
    question: 'A configuração pode ser personalizada?',
    answer:
      'Sim. As configurações do catálogo são pontos de partida e são ajustadas à sua aplicação.',
    scope: 'produto',
    order: 6,
    status: 'published',
  },
  {
    id: 'f-7',
    question: 'Quanto tempo leva desde o primeiro contato até a entrega?',
    answer:
      'Varia conforme a configuração e a disponibilidade dos componentes. O prazo é informado na proposta.',
    scope: 'consultoria',
    order: 7,
    status: 'published',
  },
  {
    id: 'f-8',
    question: 'Quais são as condições de garantia e suporte?',
    answer:
      'Garantia de 12 a 60 meses, conforme o produto. As condições completas estão na política de garantia e na proposta.',
    scope: 'geral',
    order: 8,
    status: 'published',
  },
]

/* -------------------------------- Artigos ---------------------------------- */

export const articles: Article[] = [
  {
    slug: 'quanto-de-vram-eu-preciso',
    title: 'Quanta VRAM você realmente precisa para trabalhar com IA',
    category: 'Guia',
    excerpt:
      'A memória da placa de vídeo é o fator que mais limita projetos de inteligência artificial.',
    readingMinutes: 7,
    author: 'Equipe UPAR',
    publishedAt: '2026-08-12',
    status: 'published',
    isDemo: true,
    body: `## Por que a VRAM é o primeiro número a olhar

Quando um modelo de inteligência artificial é executado, ele precisa ser carregado na memória da placa de vídeo — a VRAM. Se o modelo couber ali por inteiro, o processamento acontece de forma fluida. Se não couber, parte do trabalho migra para a memória do sistema, que é bem mais lenta nesse contexto, e a diferença é perceptível imediatamente.

É por isso que, em projetos de IA, uma placa com mais memória costuma resolver mais problemas do que uma placa mais rápida com pouca memória.

## O modelo não é a única coisa que ocupa espaço

Um erro comum é calcular apenas o tamanho do modelo. Na prática, ocupam VRAM:

- O modelo carregado
- O contexto da conversa ou os documentos anexados
- As estruturas temporárias criadas durante o processamento
- Outros modelos auxiliares que o seu fluxo utilize

Por isso, dimensionar no limite exato do modelo costuma dar errado. Trabalhar com folga é o que mantém o uso confortável.

## Quando uma placa maior é melhor que duas placas

Duas placas somam a memória total disponível, mas nem todo fluxo de trabalho consegue dividir um único modelo entre elas de forma eficiente. Em geral:

- **Uma placa com mais memória** facilita executar um modelo grande de forma simples.
- **Duas placas** funcionam bem para executar modelos diferentes em paralelo, atender mais usuários ou dividir cargas independentes.

A escolha depende do que você pretende rodar. É exatamente o tipo de decisão que vale conversar antes de comprar.

## Como estimar o seu caso

Reúna três informações antes de decidir: quais modelos ou programas você pretende usar, qual o tamanho típico do contexto ou do arquivo com que trabalha, e quantas pessoas vão usar o equipamento ao mesmo tempo. Com esses três dados, a conversa técnica deixa de ser abstrata e passa a ter uma resposta objetiva.`,
    seoTitle: 'Quanta VRAM você precisa para IA — guia prático | UPAR AI',
    seoDescription:
      'Entenda o papel da VRAM em projetos de inteligência artificial e como estimar a memória de vídeo necessária para o seu caso.',
  },
  {
    slug: 'ia-local-versus-nuvem',
    title: 'IA local ou na nuvem: como decidir sem se arrepender',
    category: 'IA local',
    excerpt:
      'Não existe resposta única. Existem critérios objetivos — volume de uso, sensibilidade dos dados e previsibilidade de custo — que apontam o caminho.',
    readingMinutes: 6,
    author: 'Equipe UPAR',
    publishedAt: '2026-07-28',
    status: 'published',
    isDemo: true,
    body: `## A pergunta errada e a pergunta certa

A pergunta errada é "o que é melhor". A pergunta certa é "o que o meu uso exige".

Nuvem e infraestrutura própria resolvem problemas diferentes, e a maioria das empresas maduras usa as duas coisas. O que muda é a proporção.

## Quando a infraestrutura própria costuma fazer sentido

- **Uso constante e previsível.** Quando o consumo é contínuo, o custo variável da nuvem deixa de ser vantagem.
- **Dados que não podem sair.** Exigências contratuais, regulatórias ou de política interna costumam ser o critério decisivo.
- **Necessidade de controle.** Versões de modelo, ajustes finos e disponibilidade passam a depender de você, não de um fornecedor.
- **Latência.** Aplicações que exigem resposta imediata se beneficiam do processamento próximo de onde o dado é gerado.

## Quando a nuvem continua sendo a melhor escolha

- Picos esporádicos e experimentos curtos
- Necessidade de capacidade muito acima do uso médio, por pouco tempo
- Times ainda validando se o projeto vai adiante

## O modelo híbrido

É comum executar o dia a dia localmente e recorrer à nuvem em momentos de pico. Essa combinação costuma entregar o melhor dos dois cenários — mas exige que o equipamento local seja dimensionado para o uso real, não para o pico.

## O que levar para a conversa

Antes de decidir, levante: volume médio de uso, sensibilidade dos dados, exigência de disponibilidade e horizonte de crescimento. Com isso em mãos, a decisão deixa de ser ideológica e passa a ser técnica.`,
    seoTitle: 'IA local ou na nuvem: critérios para decidir | UPAR AI',
    seoDescription:
      'Compare execução local e nuvem para inteligência artificial usando critérios objetivos de volume, dados, custo e latência.',
  },
  {
    slug: 'cpu-gpu-ram-o-que-importa',
    title: 'CPU, GPU, VRAM, RAM e disco: o que cada peça realmente faz',
    category: 'Guia',
    excerpt:
      'Um guia direto para gestores e compradores entenderem onde o dinheiro faz diferença — e onde não faz.',
    readingMinutes: 8,
    author: 'Equipe UPAR',
    publishedAt: '2026-07-10',
    status: 'published',
    isDemo: true,
    body: `## Processador (CPU)

É o coordenador. Prepara os dados, executa as partes do trabalho que não rodam na placa de vídeo e mantém várias tarefas em andamento. Mais núcleos significam mais trabalho paralelo. Em análise de dados e simulação de engenharia, a CPU costuma ser o componente principal.

## Placa de vídeo (GPU)

É onde os modelos de IA rodam. A placa executa milhares de cálculos ao mesmo tempo, e é isso que torna viável treinar e executar modelos. Em geração de imagem, vídeo e inferência de modelos de linguagem, a GPU é o componente principal.

## VRAM

É a memória da placa de vídeo. Define o tamanho do modelo e do contexto que cabem na máquina. É o limite mais comum em projetos de IA — e o que mais gera frustração quando é subdimensionado.

## Memória RAM

É o espaço de trabalho do sistema. Sustenta bases de dados em análise, contêineres, aplicações abertas e o carregamento dos modelos. Memória curta faz o sistema recorrer ao disco, e o trabalho fica lento de um jeito difícil de diagnosticar.

## Armazenamento

Capacidade importa, mas velocidade importa tanto quanto. Modelos ocupam dezenas de gigabytes e conjuntos de dados precisam ser lidos rápido, senão a placa de vídeo fica ociosa esperando informação.

## Onde o dinheiro faz diferença

Depende da aplicação, e essa é a resposta honesta:

- **Modelos de linguagem locais:** VRAM em primeiro lugar.
- **Ciência de dados:** memória e núcleos de CPU antes da placa de vídeo.
- **Vídeo:** armazenamento rápido e memória, junto com a GPU.
- **Simulação de engenharia:** núcleos e memória, com a GPU em papel de apoio.

Comprar a peça errada é mais caro do que comprar a peça certa.`,
    seoTitle: 'CPU, GPU, VRAM, RAM e disco: o que cada componente faz | UPAR AI',
    seoDescription:
      'Guia acessível sobre o papel de cada componente em computadores para inteligência artificial e onde o investimento faz diferença.',
  },
  {
    slug: 'workstation-para-empresas-implementando-ia',
    title: 'Workstations para empresas que estão implementando IA',
    category: 'Empresas',
    excerpt:
      'O que considerar quando o equipamento deixa de ser individual e passa a atender um processo da empresa.',
    readingMinutes: 6,
    author: 'Equipe UPAR',
    publishedAt: '2026-06-22',
    status: 'published',
    isDemo: true,
    body: `## O salto do experimento para o processo

Todo projeto de IA em empresa passa por um momento de virada: o que era o computador de uma pessoa vira uma ferramenta da qual o time depende. A partir daí, os critérios de escolha mudam.

## O que passa a importar

**Continuidade.** O equipamento vai operar todos os dias, muitas horas por dia. Refrigeração e fonte deixam de ser detalhe técnico e viram requisito.

**Acesso compartilhado.** Quando mais de uma pessoa usa a mesma máquina, a memória do sistema e a organização do acesso viram parte do projeto.

**Crescimento.** O uso tende a aumentar depois que o time percebe o valor. Comprar sem prever expansão costuma gerar uma segunda compra antes do previsto.

**Governança dos dados.** Se a decisão pela infraestrutura própria veio de uma exigência de dados, a rede e o controle de acesso fazem parte do escopo.

## Perguntas para levar à conversa técnica

- Quais ferramentas e modelos o time vai usar de fato?
- Quantas pessoas acessam ao mesmo tempo, e em que horários?
- Qual o volume de dados envolvido hoje e a projeção para o próximo ano?
- Existe exigência formal sobre onde os dados podem ser processados?

Respostas objetivas a essas perguntas encurtam o projeto e evitam investimento mal direcionado.`,
    seoTitle: 'Workstations para empresas implementando IA | UPAR AI',
    seoDescription:
      'Critérios para escolher workstations quando a inteligência artificial deixa de ser experimento e vira processo da empresa.',
  },
  {
    slug: 'comparativo-gpus-para-ia',
    title: 'Como comparar placas de vídeo para IA sem cair em armadilhas',
    category: 'Comparativo',
    excerpt:
      'Número de núcleos, geração e memória contam histórias diferentes.',
    readingMinutes: 7,
    author: 'Equipe UPAR',
    publishedAt: '2026-06-05',
    status: 'published',
    isDemo: true,
    body: `## A armadilha da comparação direta

Comparar duas placas apenas pelo nome ou pela posição na linha do fabricante leva a decisões ruins para IA. Uma placa voltada a jogos pode ter excelente desempenho bruto e, ainda assim, não atender um projeto que precisa de mais memória.

## A ordem em que vale olhar

**1. Memória de vídeo.** Define o que cabe na máquina. É o primeiro corte: placas que não comportam o seu modelo saem da lista, independentemente do resto.

**2. Geração e arquitetura.** Gerações mais recentes trazem recursos que aceleram determinados tipos de cálculo. Duas placas com a mesma memória podem se comportar de forma diferente.

**3. Linha profissional ou de consumo.** Placas profissionais costumam oferecer mais memória, formatos adequados a múltiplas unidades e suporte voltado a uso corporativo. Placas de consumo entregam ótima relação de desempenho, com limites de memória e de densidade.

**4. Consumo e dissipação.** Uma placa que a sua instalação não comporta não é uma opção real. Consumo e calor definem fonte, gabinete e até o ambiente.

## Cuidado com números fora de contexto

Comparações de desempenho só fazem sentido quando a medição é feita com o mesmo modelo, a mesma configuração e a mesma versão de software. Números soltos, sem esse contexto, não sustentam uma decisão de compra.

Por isso a UPAR só publica medições realizadas e validadas pela própria equipe, sempre com o contexto do teste descrito.`,
    seoTitle: 'Como comparar GPUs para inteligência artificial | UPAR AI',
    seoDescription:
      'Aprenda a comparar placas de vídeo para IA considerando memória, arquitetura, linha do produto e consumo.',
  },
  {
    slug: 'glossario-ia-hardware',
    title: 'Glossário de IA e hardware para quem precisa decidir a compra',
    category: 'Glossário',
    excerpt:
      'Os termos que aparecem em toda proposta técnica, explicados em uma linha cada — sem jargão desnecessário.',
    readingMinutes: 5,
    author: 'Equipe UPAR',
    publishedAt: '2026-05-18',
    status: 'published',
    isDemo: true,
    body: `## Termos de hardware

**VRAM** — memória da placa de vídeo. Define o tamanho do modelo que cabe na máquina.

**ECC** — memória com correção de erro. Detecta e corrige falhas pontuais, reduzindo risco em execuções longas.

**NVMe** — padrão de armazenamento de alta velocidade, bem mais rápido que discos convencionais.

**Núcleos e threads** — unidades de processamento do processador. Mais núcleos permitem mais trabalho em paralelo.

**TDP** — indicação de quanta energia o componente dissipa em calor. Orienta o projeto de refrigeração e de fonte.

## Termos de inteligência artificial

**Inferência** — executar um modelo já treinado para obter uma resposta.

**Treinamento** — processo de ensinar o modelo a partir de dados. Muito mais pesado que a inferência.

**Ajuste fino (fine-tuning)** — adaptar um modelo já treinado ao seu contexto específico, com um esforço menor que o treinamento completo.

**Quantização** — técnica que reduz a precisão numérica do modelo para que ele ocupe menos memória, com alguma perda de qualidade.

**Contexto** — quantidade de informação que o modelo consegue considerar de uma vez. Contextos maiores consomem mais memória.

**Parâmetros** — medida do tamanho do modelo. Mais parâmetros geralmente significam mais capacidade e mais consumo de memória.

**LLM** — modelo de linguagem de grande porte, base dos assistentes e copilotos atuais.`,
    seoTitle: 'Glossário de IA e hardware | UPAR AI',
    seoDescription:
      'Glossário objetivo com os termos de hardware e inteligência artificial que aparecem em propostas técnicas.',
  },
]

/* ------------------------------ Configurações ------------------------------ */

export const defaultSettings: SiteSettings = {
  // ATENÇÃO: número de demonstração. Substituir pelo WhatsApp oficial no painel.
  whatsappNumber: '5585000000000',
  whatsappGreeting: 'Olá! Vim pelo site da UPAR AI e gostaria de falar com um especialista.',
  companyName: 'UPAR AI',
  legalName: 'UPAR COMPUTADORES E UPGRADES LTDA',
  cnpj: '',
  email: '',
  phone: '',
  addressLine: '',
  city: 'Fortaleza',
  state: 'CE',
  businessHours: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  heroTitle: 'Potência computacional para transformar Inteligência Artificial em resultado.',
  heroSubtitle:
    'Workstations e computadores dimensionados para IA, geração de conteúdo, ciência de dados e processamento local.',
  heroBadge: 'Consultoria técnica antes da configuração',
  aboutHistory:
    'A UPAR nasceu montando computadores de alta performance e fazendo upgrades. Hoje aplica essa experiência a projetos de IA.',
  aboutStructure:
    'Quem dimensiona a configuração é quem monta, testa e atende depois da entrega.',
  aboutExpertise:
    'O trabalho começa pela aplicação, não pela lista de peças.',
  warrantyPolicy:
    'As condições de garantia e de suporte são informadas na proposta comercial, de acordo com a configuração escolhida.',
  consultantPhotoUrl: '/equipe/consultor.jpg',
  consultantName: '',
  consultantRole: '',
  seoTitle: 'UPAR AI — Computadores de alta performance para Inteligência Artificial',
  seoDescription:
    'Workstations, computadores e servidores dimensionados para IA. Consultoria técnica para encontrar a configuração certa.',
  ga4Id: '',
  gtmId: '',
  metaPixelId: '',
  googleAdsId: '',
  adsConversionWhatsapp: '',
  adsConversionLead: '',
  showTestimonials: true,
  caseStudies: [],
  landingPages: defaultLandingPages,
  pendingRealData: [
    'Número oficial do WhatsApp comercial',
    'Cores oficiais da marca (arquivo de identidade visual)',
    'Logotipo em vetor (SVG) nas versões clara e escura',
    'Fotografias reais dos equipamentos e da estrutura física',
    'Foto de alguém da equipe para o convite de consultoria da home',
    'CNPJ, endereço completo, telefone e e-mail para exibição pública',
    'Condições reais de garantia e de suporte por categoria de produto',
    'Depoimentos e avaliações reais, com autorização de uso',
    'Números institucionais (tempo de mercado, clientes atendidos, equipe)',
    'Catálogo real de produtos com preços e disponibilidade',
    'Benchmarks medidos e validados pela equipe técnica',
    'IDs de GA4, GTM, Meta Pixel e Google Ads',
    'Texto jurídico revisado da Política de Privacidade e dos Termos de Uso',
  ],
  diagnosticQuestions: DEFAULT_DIAGNOSTIC_QUESTIONS,
  facebook: '',
  stateRegistration: '',
  paymentMethods: [],
  installmentNote: '',
}

/* -------------------------- Usuários administrativos ----------------------- */
/* DEMONSTRATIVOS — em produção os usuários vêm do Supabase Auth.              */

export const adminUsers: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Administrador UPAR',
    email: 'admin@uparai.com.br',
    role: 'administrador',
    active: true,
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'u-2',
    name: 'Gestão Comercial',
    email: 'comercial@uparai.com.br',
    role: 'gestor_comercial',
    active: true,
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'u-3',
    name: 'Conteúdo e SEO',
    email: 'conteudo@uparai.com.br',
    role: 'editor_conteudo',
    active: true,
    createdAt: '2026-03-11T09:00:00.000Z',
  },
  {
    id: 'u-4',
    name: 'Consultor de Vendas',
    email: 'consultor@uparai.com.br',
    role: 'consultor_vendas',
    active: true,
    createdAt: '2026-04-20T09:00:00.000Z',
  },
]

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'a-1',
    at: '2026-09-01T12:00:00.000Z',
    actor: 'sistema',
    action: 'seed',
    entity: 'catálogo',
    detail: 'Carga inicial de dados demonstrativos',
  },
]
