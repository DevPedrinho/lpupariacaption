import { Accordion } from '@/components/ui/Accordion'
import { Section, SectionHeader } from '@/components/ui/Section'
import type { Faq } from '@/lib/types'

export function FaqSection({
  faqs,
  tone = 'dark',
  eyebrow = 'Perguntas frequentes',
  title = 'Dúvidas que aparecem em quase toda conversa',
  description = 'Se a sua pergunta não estiver aqui, ela é específica da sua aplicação. Vale conversar com um especialista.',
  limit = 3,
}: {
  faqs: Faq[]
  tone?: 'dark' | 'light'
  eyebrow?: string
  title?: string
  description?: string
  limit?: number
}) {
  if (faqs.length === 0) return null

  return (
    <Section id="faq" tone={tone === 'light' ? 'light' : 'dark'}>
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            description={description}
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <Accordion
            tone={tone}
            items={faqs.slice(0, limit).map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
          />
        </div>
      </div>
    </Section>
  )
}
