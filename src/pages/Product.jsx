import PageHeader from '../components/PageHeader'
import PageCta from '../components/PageCta'
import TheNet from '../sections/TheNet'
import FAQ from '../sections/FAQ'
import { pages } from '../data/content'

/** Synera DuoForte — the technical product page. Absorbs the net content in full, plus the FAQ. */
export default function Product() {
  return (
    <>
      <PageHeader page={pages.product} />
      <TheNet full />
      <FAQ tone="tint" />
      <PageCta tone="white" />
    </>
  )
}
