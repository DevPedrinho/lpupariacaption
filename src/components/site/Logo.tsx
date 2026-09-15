import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Logotipo oficial da UPAR, do pacote de identidade da marca.
 *
 * O arquivo servido é a versão negativa: o verde do logotipo permanece e as
 * letras que no original são pretas ficam brancas, porque o site é escuro. A
 * versão original (verde e preto) está em `/marca/upar.svg`, para uso sobre
 * fundo claro.
 *
 * "AI" é acrescentado ao lado como texto, e não faz parte do logotipo — é o
 * recorte deste site dentro da marca. Se a UPAR tiver uma assinatura própria
 * para a linha de inteligência artificial, ela substitui esse trecho.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="UPAR AI — página inicial"
      className={cn('group inline-flex items-baseline gap-2.5', className)}
    >
      {/* Altura fixa; a largura acompanha a proporção 530×265 do arquivo. */}
      <img
        src="/marca/upar-negativo.svg"
        alt="UPAR"
        width={530}
        height={265}
        className="h-7 w-auto shrink-0 self-center transition-opacity duration-200 group-hover:opacity-85"
      />
      {!compact && (
        <span className="font-display text-[1.05rem] leading-none font-semibold tracking-tight text-brand-400">
          AI
        </span>
      )}
    </Link>
  )
}
