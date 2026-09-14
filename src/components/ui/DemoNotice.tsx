import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/**
 * Marca visualmente que um conteúdo é DEMONSTRATIVO e precisa ser substituído
 * por informação real fornecida pela UPAR antes da publicação.
 */
export function DemoNotice({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-caution-500/30 bg-caution-500/8 px-3.5 py-3 text-sm text-[#F0C560]',
        className,
      )}
    >
      <Icon name="info" className="mt-0.5 size-4 shrink-0" />
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}
