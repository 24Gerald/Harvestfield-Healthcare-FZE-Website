import Hero from '../sections/Hero'
import WhoWeAre from '../sections/WhoWeAre'
import Today from '../sections/Today'
import Malaria from '../sections/Malaria'
import TheNet from '../sections/TheNet'
import PageLinks from '../components/PageLinks'
import PageCta from '../components/PageCta'
import { pages } from '../data/content'
import { usePageMeta } from '../lib/pageMeta'

/**
 * Home is home. Each section of the site lives on exactly one page, so the
 * home page carries only what introduces the company — who we are, where we
 * are today, why the product matters and the net itself, condensed — and then
 * signposts the four pages that carry everything else:
 *
 *   Synera DuoForte ........ the net in full, and the FAQ
 *   Manufacturing and quality  the factory, the photos, the credentials, GDM
 *   About .................. the group, local manufacturing, purpose, leadership
 *   Contact ................ the two supply routes and the request form
 *
 * Backgrounds alternate dark / tint / white down the page.
 */
export default function Home() {
  usePageMeta(pages.home)

  return (
    <>
      <Hero />
      <WhoWeAre />
      <Today />
      <Malaria />
      <TheNet />
      <PageLinks />
      <PageCta tone="white" />
    </>
  )
}
