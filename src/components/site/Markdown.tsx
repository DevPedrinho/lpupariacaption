import { Fragment, type ReactNode } from 'react'

/**
 * Renderizador mínimo do subconjunto de Markdown usado nos artigos:
 * títulos (## e ###), parágrafos, listas, negrito, links, imagens e vídeo.
 *
 * Não interpreta HTML bruto — o conteúdo do painel nunca é injetado como
 * marcação. Vídeo só de YouTube e Vimeo, montado a partir do identificador,
 * para o iframe nunca apontar para um domínio arbitrário.
 */
const SAFE_URL = /^(https?:\/\/|\/(?!\/))/

function videoEmbed(url: string): { src: string; title: string } | null {
  const yt = url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, title: 'Vídeo do YouTube' }
  const vimeo = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/)
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo[1]}`, title: 'Vídeo do Vimeo' }
  return null
}

function inline(text: string): ReactNode[] {
  // Negrito e links, na ordem em que aparecem.
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link && SAFE_URL.test(link[2])) {
      const externo = /^https?:\/\//.test(link[2])
      return (
        <a
          key={index}
          href={link[2]}
          target={externo ? '_blank' : undefined}
          rel={externo ? 'noopener noreferrer' : undefined}
          className="text-flux-300 underline decoration-flux-300/40 underline-offset-4 transition-colors hover:text-flux-200"
        >
          {link[1]}
        </a>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export function Markdown({ source }: { source: string }) {
  // O textarea do painel envia CRLF; sem normalizar, nenhum bloco se separa.
  const blocks = source.replace(/\r\n?/g, '\n').trim().split(/\n{2,}/)

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

        // Imagem sozinha no bloco: ![legenda](url)
        const image = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
        if (image && SAFE_URL.test(image[2])) {
          return (
            <figure key={index} className="my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image[2]}
                alt={image[1]}
                loading="lazy"
                className="w-full rounded-xl border border-ink-700/70 bg-ink-900"
              />
              {image[1] && <figcaption className="mt-2 text-center text-sm text-ink-400">{image[1]}</figcaption>}
            </figure>
          )
        }

        // Endereço de vídeo sozinho no bloco vira player.
        const video = /^https?:\/\/\S+$/.test(trimmed) ? videoEmbed(trimmed) : null
        if (video) {
          return (
            <div key={index} className="my-2 aspect-video overflow-hidden rounded-xl border border-ink-700/70 bg-ink-900">
              <iframe
                src={video.src}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
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
