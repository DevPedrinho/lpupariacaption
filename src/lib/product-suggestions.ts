import type { Product } from './types'

/** Modelos já usados em outros produtos, para autocompletar no cadastro. */
export function sugestoesDeModelos(products: Product[]): { cpus: string[]; gpus: string[] } {
  const unicos = (lista: string[]) => Array.from(new Set(lista.filter(Boolean))).sort()
  return {
    cpus: unicos(products.map((p) => p.cpu.model)),
    gpus: unicos(products.map((p) => p.gpu.model)),
  }
}
