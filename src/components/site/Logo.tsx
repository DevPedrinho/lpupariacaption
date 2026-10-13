import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Logotipo oficial da UPAR, versão em negativo (monocromática clara) enviada
 * pela empresa para uso sobre fundo escuro. A versão escura, para superfícies
 * claras, está em `/marca/upar.png` e é derivada do mesmo arquivo.
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
      {/* Altura fixa; a largura acompanha a proporção 1261×469 do arquivo. */}
      <img
        src="/marca/upar-negativo.png"
        alt="UPAR"
        width={1261}
        height={469}
        className="h-6 w-auto shrink-0 self-center transition-opacity duration-200 group-hover:opacity-85"
      />
      {!compact && (
        <span className="font-display text-[1.05rem] leading-none font-semibold tracking-tight text-brand-400">
          AI
        </span>
      )}
    </Link>
  )
}
