import { Fragment } from 'react'

/**
 * Renderizador mínimo do subconjunto de Markdown usado nos artigos
 * (títulos de nível 2 e 3, parágrafos, listas e negrito).
 * Evita uma dependência extra e não interpreta HTML bruto — o conteúdo do
 * painel nunca é injetado como marcação.
 */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  )
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/)

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        const trimmed = block.trim()

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="mt-3 text-xl font-semibold text-white">
              {inline(trimmed.slice(4))}
            </h3>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={index} className="mt-6 text-2xl font-semibold text-white">
              {inline(trimmed.slice(3))}
            </h2>
          )
        }
        if (/^[-*] /m.test(trimmed) && trimmed.split('\n').every((line) => /^[-*] /.test(line.trim()))) {
          return (
            <ul key={index} className="flex flex-col gap-2 pl-1">
              {trimmed.split('\n').map((line, lineIndex) => (
                <li key={lineIndex} className="flex gap-2.5 text-[1.0625rem] leading-relaxed text-ink-200">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-flux-400" />
                  <span>{inline(line.trim().replace(/^[-*] /, ''))}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="text-[1.0625rem] leading-relaxed text-ink-200">
            {inline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}
