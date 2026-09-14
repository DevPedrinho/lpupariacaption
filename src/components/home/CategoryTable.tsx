import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeader } from '@/components/ui/Section'
import { categoryComparison } from '@/data/content'

export function CategoryTable() {
  return (
    <Section id="categorias" tone="raised">
      <div className="container-page">
        <SectionHeader
          eyebrow="Comparativo de categorias"
          title="Quatro níveis, quatro tipos de operação"
          description="As categorias existem para orientar o ponto de partida. A configuração final sempre depende da sua aplicação — não existe categoria que seja melhor em tudo."
        />

        {/* Tabela em telas médias e grandes */}
        <div className="mt-10 hidden overflow-x-auto rounded-xl border border-ink-700/70 md:block">
          <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparativo entre as categorias de computadores da UPAR AI
            </caption>
            <thead>
              <tr className="bg-ink-850">
                <th scope="col" className="px-5 py-4 font-semibold text-white">Categoria</th>
                <th scope="col" className="px-5 py-4 font-semibold text-white">Placas de vídeo</th>
                <th scope="col" className="px-5 py-4 font-semibold text-white">VRAM típica</th>
                <th scope="col" className="px-5 py-4 font-semibold text-white">Memória típica</th>
                <th scope="col" className="px-5 py-4 font-semibold text-white">Melhor para</th>
                <th scope="col" className="px-5 py-4 font-semibold text-white">Não é a escolha para</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700/60">
              {categoryComparison.map((row) => (
                <tr key={row.tier} className="align-top transition-colors hover:bg-ink-850/60">
                  <th scope="row" className="px-5 py-5 font-medium text-white">
                    {row.name}
                    <span className="mt-1 block text-xs font-normal text-ink-400">{row.positioning}</span>
                  </th>
                  <td className="px-5 py-5 text-ink-200">{row.typicalGpu}</td>
                  <td className="px-5 py-5 font-medium text-flux-300">{row.typicalVram}</td>
                  <td className="px-5 py-5 text-ink-200">{row.typicalRam}</td>
                  <td className="px-5 py-5 text-ink-300">{row.bestFor}</td>
                  <td className="px-5 py-5 text-ink-400">{row.notFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartões em telas pequenas */}
        <ul className="mt-8 flex flex-col gap-3 md:hidden">
          {categoryComparison.map((row) => (
            <li key={row.tier} className="rounded-xl border border-ink-700/70 bg-ink-880/60 p-5">
              <h3 className="text-lg font-semibold text-white">{row.name}</h3>
              <p className="mt-1 text-sm text-ink-400">{row.positioning}</p>
              <dl className="mt-4 flex flex-col gap-2 border-t border-ink-700/60 pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">Placas de vídeo</dt>
                  <dd className="text-right text-ink-100">{row.typicalGpu}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">VRAM típica</dt>
                  <dd className="text-right font-medium text-flux-300">{row.typicalVram}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-400">Memória típica</dt>
                  <dd className="text-right text-ink-100">{row.typicalRam}</dd>
                </div>
                <div className="mt-1.5 border-t border-ink-700/60 pt-3">
                  <dt className="text-ink-400">Melhor para</dt>
                  <dd className="mt-1 text-ink-200">{row.bestFor}</dd>
                </div>
                <div className="mt-1.5">
                  <dt className="text-ink-400">Não é a escolha para</dt>
                  <dd className="mt-1 text-ink-400">{row.notFor}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <Link
          href="/encontre-sua-configuracao"
          className="mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-flux-300 transition-colors hover:text-flux-400"
        >
          Não sabe em qual categoria você se encaixa? Responda o diagnóstico
          <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </Section>
  )
}
