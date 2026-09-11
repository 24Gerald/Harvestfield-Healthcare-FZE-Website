import PageHeader from '../components/PageHeader'
import PageCta from '../components/PageCta'
import Factory from '../sections/Factory'
import Gallery from '../sections/Gallery'
import Certified from '../sections/Certified'
import TrustedBy from '../sections/TrustedBy'
import { pages } from '../data/content'

/** Manufacturing and quality — the facility, the process, the quality system and the regulatory position. */
export default function Manufacturing() {
  return (
    <>
      <PageHeader page={pages.manufacturing} />
      <Factory />
      <Gallery />
      <TrustedBy />
      <Certified />
      <PageCta />
    </>
  )
}
