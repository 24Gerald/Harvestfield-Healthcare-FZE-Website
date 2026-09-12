import PageHeader from '../components/PageHeader'
import PageCta from '../components/PageCta'
import Heritage from '../sections/Heritage'
import LocalCapability from '../sections/LocalCapability'
import Purpose from '../sections/Purpose'
import Management from '../sections/Management'
import { pages } from '../data/content'

/** About Harvestfield Healthcare — company, group heritage, purpose and leadership. One page. */
export default function About() {
  return (
    <>
      <PageHeader page={pages.about} />
      <LocalCapability />
      <Heritage />
      <Purpose />
      <Management />
      <PageCta />
    </>
  )
}
