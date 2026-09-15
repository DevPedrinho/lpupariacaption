import type { Metadata } from 'next'
import { getRepository } from '@/lib/repository'
import { JsonLd } from '@/components/site/JsonLd'
import { faqSchema, organizationSchema, websiteSchema } from '@/lib/schema'
import { Hero } from '@/components/home/Hero'
import { PainPoints } from '@/components/home/PainPoints'
import { ApproachCompare } from '@/components/home/ApproachCompare'
import { ApplicationsGrid } from '@/components/home/ApplicationsGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { ConsultingSteps } from '@/components/home/ConsultingSteps'
import { LocalAiBenefits } from '@/components/home/LocalAiBenefits'
import { CategoryTable } from '@/components/home/CategoryTable'
import { Differentials } from '@/components/home/Differentials'
import { Testimonials } from '@/components/home/Testimonials'
import { FaqSection } from '@/components/home/FaqSection'
import { HomeSummary } from '@/components/home/HomeSummary'
import { FinalCta } from '@/components/home/FinalCta'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getRepository().getSettings()
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    alternates: { canonical: '/' },
    openGraph: { title: settings.seoTitle, description: settings.seoDescription, url: '/' },
  }
}

export default async function HomePage() {
  const repo = getRepository()
  const [settings, applications, featured, allProducts, testimonials, faqs] = await Promise.all([
    repo.getSettings(),
    repo.listApplications(),
    repo.listProducts({ featured: true }),
    repo.listProducts(),
    repo.listTestimonials(),
    repo.listFaqs('home'),
  ])

  const appIndex = applications.map(({ slug, name }) => ({ slug, name }))
  const highlighted = featured.length > 0 ? featured : allProducts.slice(0, 6)

  return (
    <>
      <JsonLd data={[organizationSchema(settings), websiteSchema(settings), faqSchema(faqs)]} />
      <Hero />
      <PainPoints />
      <ApproachCompare />
      <ApplicationsGrid applications={applications} />
      <FeaturedProducts products={highlighted} applications={appIndex} />
      <ConsultingSteps />
      <LocalAiBenefits />
      <CategoryTable />
      <Differentials />
      <Testimonials testimonials={testimonials} />
      <HomeSummary />
      <FaqSection faqs={faqs} />
      <FinalCta />
    </>
  )
}
