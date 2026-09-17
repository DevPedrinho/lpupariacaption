import Link from 'next/link'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Panel } from '@/components/admin/ui'
import { saveProduct } from '@/app/admin/actions'
import { availabilityLabel, formFactorLabel, tierLabel } from '@/lib/format'
import type { Application, Product } from '@/lib/types'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const area =
  'w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'

function Label({ htmlFor, children, hint }: { htmlFor: string; children: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block">
      <span className="text-xs font-medium text-ink-300">{children}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink-500">{hint}</span>}
    </label>
  )
}

export function ProductForm({
  product,
  applications,
}: {
  product?: Product
  applications: Application[]
}) {
  const storageValue = (product?.storage ?? [])
    .map((drive) => [drive.kind, drive.capacityGb, drive.purpose ?? ''].join(' | '))
    .join('\n')

  return (
    <form action={saveProduct} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={product?.id ?? ''} />

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Identificação</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Nome da solução</Label>
            <input id="name" name="name" required defaultValue={product?.name} className={input} />
          </div>
          <div>
            <Label htmlFor="slug" hint="Deixe em branco para gerar a partir do nome.">Slug (URL)</Label>
            <input id="slug" name="slug" defaultValue={product?.slug} className={input} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="tagline">Chamada curta</Label>
            <input id="tagline" name="tagline" defaultValue={product?.tagline} className={input} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="summary">Resumo comercial</Label>
            <textarea id="summary" name="summary" rows={4} defaultValue={product?.summary} className={area} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="clientProfile">Perfil de cliente</Label>
            <input id="clientProfile" name="clientProfile" defaultValue={product?.clientProfile} className={input} />
          </div>
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Classificação</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="formFactor">Formato</Label>
            <select id="formFactor" name="formFactor" defaultValue={product?.formFactor ?? 'workstation'} className={input}>
              {(['workstation', 'desktop', 'server'] as const).map((value) => (
                <option key={value} value={value}>{formFactorLabel[value]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="performanceTier">Nível de desempenho</Label>
            <select id="performanceTier" name="performanceTier" defaultValue={product?.performanceTier ?? 'avancado'} className={input}>
              {(['essencial', 'avancado', 'profissional', 'extremo'] as const).map((value) => (
                <option key={value} value={value}>{tierLabel[value]}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="availability">Disponibilidade</Label>
            <select id="availability" name="availability" defaultValue={product?.availability ?? 'made_to_order'} className={input}>
              {(['in_stock', 'made_to_order', 'pre_order', 'unavailable'] as const).map((value) => (
                <option key={value} value={value}>{availabilityLabel[value]}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-xs font-medium text-ink-300">Aplicações recomendadas</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <label key={application.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-200">
                <input
                  type="checkbox"
                  name="applications"
                  value={application.slug}
                  defaultChecked={product?.applications.includes(application.slug)}
                  className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500"
                />
                {application.name}
              </label>
            ))}
          </div>
        </fieldset>
      </Panel>

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Configuração</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Label htmlFor="cpuModel">Processador</Label>
            <input id="cpuModel" name="cpuModel" defaultValue={product?.cpu.model} className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cpuCores">Núcleos</Label>
              <input id="cpuCores" name="cpuCores" type="number" min={1} defaultValue={product?.cpu.cores} className={input} />
            </div>
            <div>
              <Label htmlFor="cpuThreads">Threads</Label>
              <input id="cpuThreads" name="cpuThreads" type="number" min={1} defaultValue={product?.cpu.threads} className={input} />
            </div>
          </div>

          <div>
            <Label htmlFor="gpuVendor">Fabricante da GPU</Label>
            <select id="gpuVendor" name="gpuVendor" defaultValue={product?.gpu.vendor ?? 'NVIDIA'} className={input}>
              {(['NVIDIA', 'AMD', 'Intel'] as const).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="gpuModel" hint="Só o nome do modelo, curto (ex.: RTX A6000). Detalhes vão na observação abaixo.">
              Modelo da GPU
            </Label>
            <input id="gpuModel" name="gpuModel" maxLength={40} required defaultValue={product?.gpu.model} className={input} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="gpuQuantity">Qtd.</Label>
              <input id="gpuQuantity" name="gpuQuantity" type="number" min={1} defaultValue={product?.gpu.quantity ?? 1} className={input} />
            </div>
            <div>
              <Label htmlFor="gpuVram">VRAM (GB)</Label>
              <input id="gpuVram" name="gpuVram" type="number" min={0} defaultValue={product?.gpu.vramGb} className={input} />
            </div>
            <div>
              <Label htmlFor="maxGpus">Máx. GPUs</Label>
              <input id="maxGpus" name="maxGpus" type="number" min={1} defaultValue={product?.maxGpus ?? 1} className={input} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="gpuNote" hint="Aparece na ficha técnica da página do produto (ex.: memória GDDR6 com ECC, refrigeração blower).">
              Observação sobre a placa de vídeo
            </Label>
            <input id="gpuNote" name="gpuNote" maxLength={200} defaultValue={product?.gpu.note} className={input} />
          </div>

          <div>
            <Label htmlFor="ramCapacity">Memória RAM (GB)</Label>
            <input id="ramCapacity" name="ramCapacity" type="number" min={0} defaultValue={product?.ram.capacityGb} className={input} />
          </div>
          <div>
            <Label htmlFor="ramType">Tipo de memória</Label>
            <input id="ramType" name="ramType" defaultValue={product?.ram.type ?? 'DDR5'} className={input} />
          </div>
          <div>
            <Label htmlFor="ramMax">Expansão máxima (GB)</Label>
            <input id="ramMax" name="ramMax" type="number" min={0} defaultValue={product?.ram.maxGb} className={input} />
          </div>

          <div className="md:col-span-3">
            <Label htmlFor="storage" hint="Uma unidade por linha, no formato: Tipo | Capacidade em GB | Finalidade">
              Armazenamento
            </Label>
            <textarea
              id="storage"
              name="storage"
              rows={3}
              defaultValue={storageValue}
              placeholder={'NVMe | 2000 | Sistema e modelos\nNVMe | 8000 | Conjuntos de dados'}
              className={area}
            />
          </div>

          <div className="md:col-span-3 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="cooling">Refrigeração</Label>
              <input id="cooling" name="cooling" defaultValue={product?.cooling} className={input} />
            </div>
            <div>
              <Label htmlFor="psu">Fonte de alimentação</Label>
              <input id="psu" name="psu" defaultValue={product?.psu} className={input} />
            </div>
            <div>
              <Label htmlFor="network">Rede e conectividade</Label>
              <input id="network" name="network" defaultValue={product?.network} className={input} />
            </div>
            <div>
              <Label htmlFor="chassis">Gabinete</Label>
              <input id="chassis" name="chassis" defaultValue={product?.chassis} className={input} />
            </div>
          </div>

          <div className="md:col-span-3">
            <Label htmlFor="expansion" hint="Um item por linha.">Possibilidades de expansão</Label>
            <textarea id="expansion" name="expansion" rows={3} defaultValue={product?.expansion.join('\n')} className={area} />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          A seção “Entenda esta máquina” da página pública é montada automaticamente a partir destes campos,
          sempre que o produto é salvo.
        </p>
      </Panel>

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Comercial</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="priceMode">Exibição de preço</Label>
            <select id="priceMode" name="priceMode" defaultValue={product?.priceMode ?? 'on_request'} className={input}>
              <option value="displayed">Preço exibido</option>
              <option value="from">A partir de</option>
              <option value="on_request">Sob consulta</option>
            </select>
          </div>
          <div>
            <Label htmlFor="priceBrl" hint="Ignorado quando a exibição for “sob consulta”.">Valor (R$)</Label>
            <input id="priceBrl" name="priceBrl" type="number" min={0} step={100} defaultValue={product?.priceBrl} className={input} />
          </div>
          <div>
            <Label htmlFor="leadTime">Prazo informado</Label>
            <input id="leadTime" name="leadTime" defaultValue={product?.leadTime} className={input} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="warranty" hint="Deixe em branco para usar a política geral definida em Configurações.">
              Garantia específica
            </Label>
            <input id="warranty" name="warranty" defaultValue={product?.warranty} className={input} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="services" hint="Um item por linha.">Serviços inclusos</Label>
            <textarea id="services" name="services" rows={4} defaultValue={product?.services.join('\n')} className={area} />
          </div>
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-5 text-base font-semibold text-white">Publicação e SEO</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="status">Situação</Label>
            <select id="status" name="status" defaultValue={product?.status ?? 'draft'} className={input}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2.5 pb-1">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-200">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500" />
              Destacar na home
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-200">
              <input type="checkbox" name="customizable" defaultChecked={product?.customizable ?? true} className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500" />
              Permite personalização
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-200">
              <input type="checkbox" name="isDemo" defaultChecked={product?.isDemo} className="size-4 rounded-xs border border-ink-500 bg-ink-900 accent-brand-500" />
              Marcar como dado demonstrativo
            </label>
          </div>
          <div>
            <Label htmlFor="seoTitle">Título para SEO</Label>
            <input id="seoTitle" name="seoTitle" defaultValue={product?.seoTitle} className={input} />
          </div>
          <div>
            <Label htmlFor="seoDescription">Descrição para SEO</Label>
            <input id="seoDescription" name="seoDescription" defaultValue={product?.seoDescription} className={input} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>Salvar produto</SubmitButton>
        <Link href="/admin/produtos" className="text-sm text-ink-300 transition-colors hover:text-white">
          Cancelar
        </Link>
        {product && (
          <Link
            href={`/produtos/${product.slug}`}
            target="_blank"
            className="ml-auto text-sm text-flux-300 transition-colors hover:text-flux-400"
          >
            Ver no site ↗
          </Link>
        )}
      </div>
    </form>
  )
}
