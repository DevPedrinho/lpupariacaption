import Anthropic from '@anthropic-ai/sdk'
import { getRepository } from '@/lib/repository'
import { saveDraft, signedUrl, type Comparison } from '@/lib/comparativos'
import { formatCapacity, gpuSummary, storageSummary, tierLabel, vramSummary } from '@/lib/format'

/* ============================================================================
   Rascunho de resposta para a equipe.

   A IA lê o que o cliente mandou — print, texto ou os dois —, compara com o
   catálogo real da UPAR e redige uma resposta sugerindo a configuração mais
   coerente. O texto nunca chega ao cliente direto: fica em `comparison_drafts`,
   que só a equipe lê, e um vendedor edita antes de enviar.

   Sem `ANTHROPIC_API_KEY` o módulo continua funcionando: o rascunho é marcado
   como indisponível e o vendedor escreve do zero.
   ========================================================================== */

const MODEL = 'claude-opus-5'

export const aiConfigurada = Boolean(process.env.ANTHROPIC_API_KEY?.trim())

/**
 * O que a IA pode e não pode afirmar.
 *
 * As proibições não são estilo: o briefing do projeto veta número que a UPAR
 * não tenha medido, e um modelo de linguagem inventa especificação com muita
 * naturalidade. Como o vendedor revisa antes de enviar, isso é a primeira
 * barreira, não a única.
 */
const SYSTEM = `Você redige rascunhos de resposta para a equipe comercial da UPAR, uma empresa brasileira que monta computadores e workstations de alta performance para inteligência artificial.

Um cliente enviou a configuração de um computador que encontrou em outro site e quer saber o que a UPAR entregaria no lugar.

Sua tarefa: ler a configuração recebida, compará-la com o catálogo da UPAR fornecido abaixo e redigir uma resposta em português do Brasil.

REGRAS QUE NÃO PODEM SER QUEBRADAS:
- Não invente especificação, preço, prazo ou benchmark. Se um dado não estiver no catálogo fornecido nem na configuração do cliente, diga que precisa ser confirmado.
- Não cite nem caracterize o concorrente. Fale do que a UPAR faz, nunca do que o outro deixa de fazer.
- Não prometa que a UPAR é mais barata, mais rápida ou melhor. Se a máquina que o cliente achou resolver o caso dele, diga isso.
- Não afirme compatibilidade com um modelo de IA específico sem que o cliente tenha dito qual pretende rodar.
- Se a configuração recebida estiver ilegível ou incompleta, peça o que falta em vez de supor.

TOM: direto, técnico e sem jargão de vendas. Trate por você. Entre 80 e 180 palavras. Sem saudação genérica de e-mail e sem assinatura — o vendedor cuida disso.

FORMATO DA SAÍDA: responda apenas com um objeto JSON válido, sem cercas de código, com exatamente estas chaves:
{"resposta": "o texto para o cliente", "slug": "slug-do-produto-do-catalogo-mais-coerente-ou-null", "observacao": "o que você não conseguiu determinar e o vendedor precisa checar"}`

type Parsed = { resposta: string; slug: string | null; observacao: string }

/** Extrai o JSON mesmo se o modelo envolver em cercas ou texto. */
function parseResposta(raw: string): Parsed | null {
  const limpo = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const inicio = limpo.indexOf('{')
  const fim = limpo.lastIndexOf('}')
  if (inicio === -1 || fim === -1) return null
  try {
    const obj = JSON.parse(limpo.slice(inicio, fim + 1)) as Record<string, unknown>
    if (typeof obj.resposta !== 'string') return null
    return {
      resposta: obj.resposta,
      slug: typeof obj.slug === 'string' && obj.slug !== 'null' ? obj.slug : null,
      observacao: typeof obj.observacao === 'string' ? obj.observacao : '',
    }
  } catch {
    return null
  }
}

/** Catálogo em texto, que é o contexto sobre o qual a IA pode se apoiar. */
async function catalogoEmTexto(): Promise<string> {
  const produtos = await getRepository().listProducts()
  if (produtos.length === 0) return '(catálogo vazio)'

  return produtos
    .map((p) =>
      [
        `- slug: ${p.slug}`,
        `  nome: ${p.name}`,
        `  categoria: ${tierLabel[p.performanceTier]}`,
        `  processador: ${p.cpu.model} (${p.cpu.cores}C/${p.cpu.threads}T)`,
        `  placa de vídeo: ${gpuSummary(p)}`,
        `  VRAM: ${vramSummary(p)}`,
        `  memória: ${formatCapacity(p.ram.capacityGb)} ${p.ram.type}`,
        `  armazenamento: ${storageSummary(p)}`,
        `  expansão: até ${p.maxGpus} placas`,
        p.isDemo ? '  ATENÇÃO: configuração demonstrativa, ainda não é catálogo real' : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')
}

/** Baixa o print e devolve em base64, que é como a API recebe imagem. */
async function imagemEmBase64(
  path: string,
): Promise<{ data: string; mediaType: string } | null> {
  const url = await signedUrl(path, 120)
  if (!url) return null
  try {
    const resposta = await fetch(url)
    if (!resposta.ok) return null
    const buffer = Buffer.from(await resposta.arrayBuffer())
    const mediaType = resposta.headers.get('content-type') ?? 'image/png'
    return { data: buffer.toString('base64'), mediaType }
  } catch (error) {
    console.error('Falha ao ler o print para a IA', error)
    return null
  }
}

export async function gerarRascunho(comparison: Comparison): Promise<void> {
  if (!aiConfigurada) {
    await saveDraft(comparison.id, {
      status: 'indisponivel',
      body: '',
      error: 'ANTHROPIC_API_KEY não configurada neste ambiente.',
    })
    return
  }

  try {
    const catalogo = await catalogoEmTexto()

    const conteudo: Anthropic.ContentBlockParam[] = []
    for (const path of comparison.imagePaths.slice(0, 4)) {
      const imagem = await imagemEmBase64(path)
      if (!imagem) continue
      conteudo.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: imagem.mediaType as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif',
          data: imagem.data,
        },
      })
    }

    conteudo.push({
      type: 'text',
      text: [
        'CATÁLOGO DA UPAR:',
        catalogo,
        '',
        'CONFIGURAÇÃO QUE O CLIENTE ENVIOU:',
        comparison.sourceText || '(o cliente enviou apenas imagem)',
        conteudo.length > 0 ? '' : '\n(sem imagem anexada)',
      ].join('\n'),
    })

    const client = new Anthropic()
    const resposta = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: SYSTEM,
      messages: [{ role: 'user', content: conteudo }],
    })

    if (resposta.stop_reason === 'refusal') {
      await saveDraft(comparison.id, {
        status: 'erro',
        body: '',
        model: MODEL,
        error: 'A análise foi recusada pelo modelo. Escreva a resposta manualmente.',
      })
      return
    }

    const texto = resposta.content
      .filter((bloco): bloco is Anthropic.TextBlock => bloco.type === 'text')
      .map((bloco) => bloco.text)
      .join('\n')
      .trim()

    const analisado = parseResposta(texto)
    const corpo = analisado
      ? [analisado.resposta, analisado.observacao ? `\n\n[Para o vendedor conferir: ${analisado.observacao}]` : '']
          .join('')
          .trim()
      : texto

    await saveDraft(comparison.id, {
      status: corpo ? 'gerado' : 'erro',
      body: corpo,
      suggestedSlug: analisado?.slug ?? null,
      model: MODEL,
      error: corpo ? null : 'O modelo respondeu vazio.',
    })
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('Falha na análise por IA', error)
    await saveDraft(comparison.id, {
      status: 'erro',
      body: '',
      model: MODEL,
      error: mensagem.slice(0, 400),
    })
  }
}
