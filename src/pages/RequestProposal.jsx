import PageHeader from '../components/PageHeader'
import ProposalForm from '../sections/ProposalForm'
import { proposal } from '../data/content'

/** The supply-proposal form on its own page, reached from the Supply section. */
export default function RequestProposal() {
  return (
    <>
      <PageHeader page={proposal} />
      <ProposalForm />
    </>
  )
}
