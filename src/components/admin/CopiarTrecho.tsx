'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Campo somente leitura com botão de copiar — para colar o trecho no texto. */
export function CopiarTrecho({ trecho }: { trecho: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <div className="flex gap-1.5">
      <input
        readOnly
        value={trecho}
        onFocus={(event) => event.currentTarget.select()}
        className="h-8 min-w-0 flex-1 rounded-md border border-ink-700/70 bg-ink-900/70 px-2 font-mono text-2xs text-ink-300"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(trecho)
            setCopiado(true)
            setTimeout(() => setCopiado(false), 1500)
          } catch {
            /* sem clipboard: o campo acima é selecionável */
          }
        }}
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-ink-600/70 px-2 text-xs text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
        title="Copiar"
      >
        <Icon name={copiado ? 'check' : 'copy'} className="size-3.5" />
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}
