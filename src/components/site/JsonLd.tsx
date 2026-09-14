/** Injeta dados estruturados schema.org. O conteúdo é sempre gerado no servidor. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // O JSON é montado a partir dos dados do próprio site, nunca de entrada do usuário.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
