import PageHeader from '../components/PageHeader'
import RequestSupply from '../sections/RequestSupply'
import { pages } from '../data/content'

/**
 * Contact and request supply — one form, routed by the "What is this about?"
 * field across programme supply, distribution, media and career enquiries.
 * The address and email sit in the footer directly beneath.
 */
export default function Contact() {
  return (
    <>
      <PageHeader page={pages.contact} />
      <RequestSupply />
    </>
  )
}
