/**
 * Leituras do painel que degradam em vez de derrubar a tela.
 *
 * O repositório repropaga o erro do Supabase, então uma única leitura que
 * falhe viraria a página branca de erro do servidor — e é justamente no painel
 * que a pessoa chega para entender o que está acontecendo. Aqui cada leitura
 * cai para um valor padrão e o nome do que não veio fica disponível para a
 * tela avisar.
 */
type Resolvido<T> = { [K in keyof T]: Awaited<T[K]> }

export async function carregar<T extends Record<string, Promise<unknown>>>(
  leituras: T,
  padroes: Resolvido<T>,
  rotulos: Record<keyof T, string>,
): Promise<{ dados: Resolvido<T>; falhas: string[] }> {
  const chaves = Object.keys(leituras) as (keyof T)[]
  const resultados = await Promise.allSettled(chaves.map((chave) => leituras[chave]))

  const dados = { ...padroes }
  const falhas: string[] = []

  resultados.forEach((resultado, indice) => {
    const chave = chaves[indice]
    if (resultado.status === 'fulfilled') {
      dados[chave] = resultado.value as Resolvido<T>[keyof T]
    } else {
      falhas.push(rotulos[chave])
      console.error(`[painel] leitura "${String(chave)}" falhou:`, resultado.reason)
    }
  })

  return { dados, falhas }
}
