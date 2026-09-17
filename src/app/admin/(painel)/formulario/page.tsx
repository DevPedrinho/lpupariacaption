import { requireSession } from '@/lib/admin-session'
import { getRepository } from '@/lib/repository'
import { carregar } from '@/lib/admin-carregar'
import { defaultSettings } from '@/data/content'
import { OUTRO_LABEL, normalizeQuestions } from '@/lib/diagnostic'
import { AdminHeader, AvisoCarregamento, AvisoGravacao, Panel } from '@/components/admin/ui'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Icon } from '@/components/ui/Icon'
import { restoreDiagnosticForm, saveDiagnosticForm } from '../../actions'

const input =
  'h-10 w-full rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 focus:outline-none'
const select =
  'h-10 rounded-lg border border-ink-600/70 bg-ink-900/70 px-3 text-sm text-ink-50 focus:border-brand-500 focus:outline-none'

const PESOS = [
  { value: 0, label: 'Não altera' },
  { value: 1, label: 'Sugere categoria maior (+1)' },
  { value: 2, label: 'Sugere categoria bem maior (+2)' },
]

export default async function FormularioPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>
}) {
  await requireSession('configuracoes')
  const { salvo, erro } = await searchParams

  const { dados, falhas } = await carregar(
    { settings: getRepository().getSettings() },
    { settings: defaultSettings },
    { settings: 'Formulário' },
  )
  const questions = normalizeQuestions(dados.settings.diagnosticQuestions)

  return (
    <>
      <AdminHeader
        title="Formulário do diagnóstico"
        description="As cinco perguntas de “Encontre sua configuração”. Cada uma tem quatro escolhas e, se você quiser, a quinta escolha “Outro”, em que o cliente escreve."
      />

      <AvisoCarregamento falhas={falhas} className="mb-5" />
      <AvisoGravacao erro={erro} className="mb-5" />

      {salvo && (
        <Panel className="mb-5 border-positive-500/30 bg-positive-500/8">
          <p className="flex items-center gap-2 text-sm text-[#5FD9A4]">
            <Icon name="check" className="size-4" />
            Formulário salvo. O site já mostra as perguntas novas.
          </p>
        </Panel>
      )}

      <form action={saveDiagnosticForm} className="flex flex-col gap-5">
        {questions.map((question, i) => (
          <Panel key={i}>
            <h2 className="mb-5 text-base font-semibold text-white">Pergunta {i + 1}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor={`q${i}-title`} className="mb-1.5 block text-xs font-medium text-ink-300">
                  Pergunta
                </label>
                <input
                  id={`q${i}-title`}
                  name={`q${i}.title`}
                  defaultValue={question.title}
                  required
                  maxLength={200}
                  className={input}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`q${i}-help`} className="mb-1.5 block text-xs font-medium text-ink-300">
                  Texto de apoio <span className="text-ink-500">(opcional)</span>
                </label>
                <input
                  id={`q${i}-help`}
                  name={`q${i}.help`}
                  defaultValue={question.help ?? ''}
                  maxLength={200}
                  placeholder="Uma frase curta que ajuda a responder"
                  className={input}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {question.options.map((option, j) => (
                <div key={j} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <label htmlFor={`q${i}-o${j}`} className="mb-1.5 block text-xs font-medium text-ink-300">
                      Escolha {j + 1}
                    </label>
                    <input
                      id={`q${i}-o${j}`}
                      name={`q${i}.o${j}.label`}
                      defaultValue={option.label}
                      required
                      maxLength={120}
                      className={input}
                    />
                  </div>
                  <div>
                    <label htmlFor={`q${i}-w${j}`} className="mb-1.5 block text-xs font-medium text-ink-300">
                      Peso na indicação
                    </label>
                    <select
                      id={`q${i}-w${j}`}
                      name={`q${i}.o${j}.weight`}
                      defaultValue={option.weight}
                      className={select}
                    >
                      {PESOS.map((peso) => (
                        <option key={peso.value} value={peso.value}>
                          {peso.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <label className="mt-1 flex items-center gap-2.5 text-sm text-ink-200">
                <input
                  type="checkbox"
                  name={`q${i}.allowOther`}
                  defaultChecked={question.allowOther}
                  className="size-4 rounded border-ink-600 bg-ink-900 accent-brand-500"
                />
                Mostrar a quinta escolha “{OUTRO_LABEL}” com campo para o cliente escrever
              </label>
            </div>
          </Panel>
        ))}

        <Panel>
          <h2 className="mb-2 text-base font-semibold text-white">Como o peso funciona</h2>
          <p className="text-sm leading-relaxed text-ink-300">
            No fim do diagnóstico o site indica uma categoria (Essencial, Avançado, Profissional ou
            Extremo) somando o peso das escolhas: até 1 ponto é Essencial, 2 a 3 é Avançado, 4 a 5 é
            Profissional e 6 ou mais é Extremo. A resposta “{OUTRO_LABEL}” não pontua. O resultado sempre
            avisa que precisa ser validado por um especialista.
          </p>
        </Panel>

        <div>
          <SubmitButton>Salvar formulário</SubmitButton>
        </div>
      </form>

      <form action={restoreDiagnosticForm} className="mt-8 border-t border-ink-700/60 pt-6">
        <p className="mb-3 text-sm text-ink-400">
          Quer voltar às perguntas originais? Isso substitui o que está salvo acima.
        </p>
        <button
          type="submit"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-600/70 px-4 text-sm text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
        >
          <Icon name="upgrade" className="size-4" />
          Restaurar perguntas padrão
        </button>
      </form>
    </>
  )
}
