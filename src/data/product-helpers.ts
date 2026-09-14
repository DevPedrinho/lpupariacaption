import type { Explainer, Product } from '@/lib/types'

/**
 * Monta a seção "Entenda esta máquina" a partir da configuração cadastrada.
 * O texto de `role` explica a função do componente em linguagem acessível;
 * o `spec` vem sempre do cadastro do produto. O painel permite sobrescrever
 * qualquer um dos blocos.
 */
/** Número de posições de GPU ainda livres, já flexionado. */
function free(p: Pick<Product, 'maxGpus' | 'gpu'>): number {
  return p.maxGpus - p.gpu.quantity
}

function freeLabel(p: Pick<Product, 'maxGpus' | 'gpu'>): string {
  const count = free(p)
  return `${count} ${count === 1 ? 'posição' : 'posições'}`
}

export function buildExplainers(
  p: Pick<Product, 'cpu' | 'gpu' | 'ram' | 'storage' | 'cooling' | 'psu' | 'network' | 'expansion' | 'maxGpus'>,
): Explainer[] {
  const totalVram = p.gpu.vramGb * p.gpu.quantity
  const gpuLabel = p.gpu.quantity > 1 ? `${p.gpu.quantity}× ${p.gpu.model}` : p.gpu.model
  const storageLabel = p.storage
    .map((d) => `${d.capacityGb >= 1000 ? `${d.capacityGb / 1000} TB` : `${d.capacityGb} GB`} ${d.kind}`)
    .join(' + ')

  return [
    {
      icon: 'cpu',
      title: 'Processador',
      spec: `${p.cpu.model} — ${p.cpu.cores} núcleos e ${p.cpu.threads} threads`,
      role:
        'É o coordenador da máquina. Cuida da preparação dos dados, das partes do trabalho que não rodam na placa de vídeo e de manter várias tarefas em andamento ao mesmo tempo. Quanto mais núcleos, mais trabalho paralelo a máquina sustenta sem engasgar.',
    },
    {
      icon: 'gpu',
      title: 'Placa de vídeo',
      spec: gpuLabel,
      role:
        'É onde os modelos de IA efetivamente rodam. A placa de vídeo executa milhares de cálculos simultâneos, e é por isso que ela define a maior parte do desempenho em treinamento, inferência, geração de imagem e renderização.',
    },
    {
      icon: 'memory',
      title: 'VRAM (memória da placa de vídeo)',
      spec:
        p.gpu.quantity > 1
          ? `${p.gpu.vramGb} GB por placa — ${totalVram} GB no total`
          : `${p.gpu.vramGb} GB`,
      role:
        'É o fator que mais limita projetos de IA. O modelo precisa caber aqui para rodar com fluidez; se não couber, parte do processamento migra para a memória do sistema e o desempenho cai. Contexto longo e resoluções altas também consomem VRAM.',
    },
    {
      icon: 'memory',
      title: 'Memória RAM',
      spec: `${p.ram.capacityGb} GB ${p.ram.type}${p.ram.maxGb ? ` — expansível até ${p.ram.maxGb} GB` : ''}`,
      role:
        'É o espaço de trabalho do sistema. Sustenta bases de dados em análise, carregamento de modelos, contêineres e várias aplicações abertas. Memória curta faz o computador recorrer ao disco, e é aí que o trabalho fica lento.',
    },
    {
      icon: 'storage',
      title: 'Armazenamento',
      spec: storageLabel,
      role:
        'Além da capacidade, o que importa é a velocidade de leitura. Modelos ocupam dezenas de gigabytes e conjuntos de dados precisam ser lidos rapidamente para não deixar a placa de vídeo ociosa esperando informação.',
    },
    {
      icon: 'cooling',
      title: 'Refrigeração',
      spec: p.cooling,
      role:
        'Cargas de IA são longas e constantes. Quando a temperatura sobe demais, os componentes reduzem a própria velocidade para se proteger e o trabalho demora mais. Refrigeração adequada é o que mantém o desempenho estável do começo ao fim.',
    },
    {
      icon: 'power',
      title: 'Fonte de alimentação',
      spec: p.psu,
      role:
        'Fornece energia estável para processador e placas de vídeo nos momentos de pico. Uma fonte dimensionada com folga protege o equipamento e viabiliza a instalação de placas adicionais no futuro.',
    },
    {
      icon: 'network',
      title: 'Rede e conectividade',
      spec: p.network,
      role:
        'Define como a máquina conversa com o restante da operação: acesso de outros usuários, integração com armazenamento compartilhado e transferência de conjuntos de dados.',
    },
    {
      icon: 'upgrade',
      title: 'Expansão futura',
      spec:
        p.maxGpus > p.gpu.quantity
          ? `Suporta até ${p.maxGpus} placas de vídeo (${freeLabel(p)} livre${free(p) === 1 ? '' : 's'})`
          : `Configuração no limite de ${p.maxGpus} placa${p.maxGpus > 1 ? 's' : ''} de vídeo`,
      role: p.expansion.join(' · '),
    },
  ]
}
