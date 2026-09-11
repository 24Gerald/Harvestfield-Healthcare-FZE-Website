import Hero from '../sections/Hero'
import WhoWeAre from '../sections/WhoWeAre'
import Today from '../sections/Today'
import Malaria from '../sections/Malaria'
import TheNet from '../sections/TheNet'
import Factory from '../sections/Factory'
import Gallery from '../sections/Gallery'
import Certified from '../sections/Certified'
import TrustedBy from '../sections/TrustedBy'
import Heritage from '../sections/Heritage'
import LocalCapability from '../sections/LocalCapability'
import Purpose from '../sections/Purpose'
import Management from '../sections/Management'
import Supply from '../sections/Supply'
import RequestSupply from '../sections/RequestSupply'

/**
 * Homepage order follows the build specification's flow: hero, who we are,
 * where we are today, the malaria problem, the net, made here, to what
 * standard, with whom, why us, what it means for Nigeria, why we exist, who
 * runs it, how to engage. The FAQ lives on the Synera DuoForte page.
 *
 * Backgrounds alternate dark / tint / white down the page, so no two adjacent
 * sections share a band.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <Today />
      <Malaria />
      <TheNet />
      <Factory />
      <Gallery />
      <Certified />
      <TrustedBy />
      <Heritage />
      <LocalCapability />
      <Purpose />
      <Management />
      <Supply />
      <RequestSupply />
    </>
  )
}
