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
        'Coordena a máquina: prepara os dados e mantém várias tarefas rodando ao mesmo tempo. Mais núcleos, mais trabalho em paralelo.',
    },
    {
      icon: 'gpu',
      title: 'Placa de vídeo',
      spec: gpuLabel,
      role:
        'É onde os modelos de IA rodam. Define a maior parte do desempenho em treinamento, inferência, geração de imagem e render.',
    },
    {
      icon: 'memory',
      title: 'VRAM (memória da placa de vídeo)',
      spec:
        p.gpu.quantity > 1
          ? `${p.gpu.vramGb} GB por placa — ${totalVram} GB no total`
          : `${p.gpu.vramGb} GB`,
      role:
        'O modelo precisa caber aqui. Se não cabe, o desempenho cai. É o limite mais comum em projetos de IA.',
    },
    {
      icon: 'memory',
      title: 'Memória RAM',
      spec: `${p.ram.capacityGb} GB ${p.ram.type}${p.ram.maxGb ? ` — expansível até ${p.ram.maxGb} GB` : ''}`,
      role:
        'Espaço de trabalho do sistema: bases de dados, modelos carregados e várias aplicações abertas sem recorrer ao disco.',
    },
    {
      icon: 'storage',
      title: 'Armazenamento',
      spec: storageLabel,
      role:
        'Modelos e conjuntos de dados ocupam dezenas de gigabytes. Leitura rápida evita deixar a placa de vídeo esperando.',
    },
    {
      icon: 'cooling',
      title: 'Refrigeração',
      spec: p.cooling,
      role:
        'Cargas de IA são longas. Refrigeração adequada evita que os componentes reduzam a velocidade para se proteger.',
    },
    {
      icon: 'power',
      title: 'Fonte de alimentação',
      spec: p.psu,
      role:
        'Energia estável nos picos de uso. Folga na fonte protege o equipamento e permite adicionar placas depois.',
    },
    {
      icon: 'network',
      title: 'Rede e conectividade',
      spec: p.network,
      role:
        'Como a máquina conversa com o restante da operação: outros usuários, armazenamento compartilhado e transferência de dados.',
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
