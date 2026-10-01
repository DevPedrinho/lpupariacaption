import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { purchaseBenefits } from '@/data/process'
import type { Product, SiteSettings } from '@/lib/types'

/** "36" cadastrado como garantia vira frase; texto livre passa como está. */
function garantia(value: string): string {
  return /^\d+$/.test(value.trim()) ? `${value.trim()} meses de garantia` : value
}

/**
 * Por que comprar com a UPAR: seis cartões curtos logo depois do resumo, e os
 * serviços inclusos nesta configuração. Substitui o bloco "Garantia e
 * serviços" que ficava no fim da página.
 */
export function PurchaseBenefits({ product, settings }: { product: Product; settings: SiteSettings }) {
  return (
    <Section id="beneficios" className="py-12 md:py-16">
      <div className="container-page">
        <p className="text-2xs font-semibold tracking-[0.14em] text-brand-300 uppercase">Por que comprar com a UPAR</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {purchaseBenefits.map((item) => (
            <li key={item.title} className="flex gap-3.5 rounded-xl border border-ink-700/70 bg-ink-880/60 p-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/12 text-brand-300 ring-1 ring-brand-500/25 ring-inset">
                <Icon name={item.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[0.9375rem] leading-snug font-medium text-white">
                  {'installment' in item && settings.installmentNote ? settings.installmentNote : item.title}
                </h3>
                <p className="mt-0.5 text-sm text-ink-400">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {(product.services.length > 0 || product.warranty) && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-ink-700/70 bg-ink-880/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-200">
              {product.warranty && (
                <li className="flex items-center gap-1.5">
                  <Icon name="shield" className="size-3.5 text-flux-400" />
                  {garantia(product.warranty)}
                </li>
              )}
              {product.services.map((service) => (
                <li key={service} className="flex items-center gap-1.5">
                  <Icon name="check" className="size-3.5 text-flux-400" />
                  {service}
                </li>
              ))}
            </ul>
            <Link href="/garantia" className="inline-flex shrink-0 items-center gap-1 text-sm text-flux-300 hover:text-flux-400">
              Política de garantia
              <Icon name="arrowRight" className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </Section>
  )
}
