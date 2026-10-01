import { Icon } from '@/components/ui/Icon'

export type SpecGroup = { group: string; rows: { label: string; value: string }[] }

/**
 * Ficha técnica em grupos recolhíveis (`details`/`summary` nativos: funciona
 * sem JavaScript e o leitor de tela anuncia como expansível). O primeiro grupo
 * abre por padrão; os demais ficam fechados, o que encurta a página no celular.
 */
export function SpecSheet({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="flex flex-col gap-3">
      {groups.map((group, index) => (
        <details
          key={group.group}
          open={index === 0}
          className="group overflow-hidden rounded-xl border border-ink-700/70 bg-ink-880/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-ink-850 px-5 py-3.5 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
            <span>{group.group}</span>
            <span className="flex items-center gap-2 text-xs font-normal text-ink-400">
              {group.rows.length} {group.rows.length === 1 ? 'item' : 'itens'}
              <Icon name="chevronDown" className="size-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <dl className="divide-y divide-ink-700/50 border-t border-ink-700/60">
            {group.rows.map((row) => (
              <div key={`${row.label}-${row.value}`} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:gap-6">
                <dt className="shrink-0 text-sm text-ink-400 sm:w-56">{row.label}</dt>
                <dd className="text-sm text-ink-100">{row.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      ))}
    </div>
  )
}
