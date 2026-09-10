/**
 * Section copy for the site, in page order.
 *
 * NOTE: the concept site (hhc-kibo.netlify.app) was unreachable from the build
 * environment, so body copy below was written from the facts in the build brief.
 * Headlines, eyebrows, stat labels, spec figures and CTA labels follow the brief
 * exactly. Paste the approved concept text over the body copy here — nothing in
 * the components needs to change.
 */

export const hero = {
  eyebrow: 'Harvestfield Healthcare FZE',
  title: 'Protection, made close to the fight.',
  subtitle: 'New-generation dual-insecticide Synera DuoForte mosquito nets, cut, sewn and packed in Nigeria.',
  primaryCta: { label: 'Request Supply', href: '#request-supply' },
  secondaryCta: { label: 'See the Net', href: '#net' },
}

export const trustedBy = {
  eyebrow: 'Trusted by',
  body: 'Synera DuoForte is designed by GDM Health Products and manufactured under licence by Harvestfield Healthcare FZE.',
  partners: [
    { name: 'GDM Health Products', role: 'Designer of Synera DuoForte', logo: 'gdm', url: 'https://www.gdmedhealth.com/' },
  ],
}

export const localCapability = {
  id: 'local-manufacturing',
  eyebrow: 'Local manufacturing',
  title: ['Global innovation.', 'Local capability.', 'Lasting impact.'],
  body: [
    'Harvestfield Healthcare FZE is strengthening local capability for the manufacture and supply of essential public-health solutions in Nigeria.',
    'Through its collaboration with GDM Health Products, Harvestfield Healthcare undertakes local manufacturing operations for Synera DuoForte, bringing key stages of finished-net production closer to the communities and malaria-control programmes they are designed to serve.',
    'The initiative supports a broader commitment to local manufacturing, stronger health supply chains and sustainable industrial development in Nigeria.',
    "Working alongside public and private-sector stakeholders, including PVAC and OgunInvest, this work contributes to Nigeria's ambition to expand domestic healthcare manufacturing and build a more resilient healthcare value chain.",
  ],
  supportersLabel: 'Working alongside',
  supporters: [
    { name: 'Harvestfield Industries', fullName: 'Harvestfield Industries Free Trade Zone, Ogun State', logo: 'harvestfield-industries', url: 'https://www.harvestfield-ng.com' },
    { name: 'PVAC', fullName: 'Presidential Initiative on Healthcare Value Chain', logo: 'pvac', url: 'https://pvac.gov.ng/' },
    { name: 'OgunInvest', fullName: 'Ogun State Investment Promotion Agency', logo: 'oguninvest', url: 'https://invest.ogunstate.gov.ng/index' },
  ],
}

export const certified = {
  id: 'certified',
  eyebrow: 'Certified by',
  title: 'Quality built into every stage.',
  // TODO(client): confirm each claim and the exact certificate numbers before launch.
  items: [
    {
      key: 'iso',
      kicker: 'International Quality',
      title: 'ISO Certified',
      body: 'Quality management audited to the international standard, from netting in to nets out.',
      photo: 'HHC QC / production inspection',
      logoAlt: 'ISO certified company',
    },
    {
      key: 'who',
      kicker: 'Globally Validated',
      title: 'WHO Prequalified',
      body: 'Synera DuoForte is WHO-prequalified, the benchmark for nets supplied to malaria-control programmes.',
      photo: 'LLIN laboratory / testing scene',
      logoAlt: 'World Health Organization',
    },
    {
      key: 'nafdac',
      kicker: 'Manufactured to Standard',
      title: 'NAFDAC GMP',
      body: "Made under Good Manufacturing Practice, overseen by NAFDAC, Nigeria's regulator for medicines and health products.",
      photo: 'HHC factory / production line',
      logoAlt: 'NAFDAC — National Agency for Food and Drug Administration and Control',
    },
  ],
}

export const factory = {
  id: 'factory',
  eyebrow: 'The Factory',
  title: 'Brought home to Nigeria.',
  body: [
    'For 26 years [Harvestfield](https://www.harvestfield-ng.com) has distributed health products across Nigeria. Now we make them here too. Inside the [Harvestfield Industries Free Trade Zone](https://www.harvestfield-ng.com) in Ogun State, netting arrives in bulk and leaves as finished, packed Synera DuoForte mosquito nets, ready for the programs and families who need them.',
    'Manufacturing in-country closes the distance between a decision and a delivery. No shipping windows, no port delays, no waiting on a factory a continent away.',
  ],
  process: [
    { step: 'Netting in', detail: 'Treated polyester knit arrives at the zone in bulk rolls.' },
    { step: 'Cut', detail: 'Panels are cut to size for each net format.' },
    { step: 'Sew', detail: 'Panels are seamed, hemmed and fitted with hanging loops.' },
    { step: 'Pack and ship', detail: 'Synera DuoForte nets are folded, bagged, batch-checked and dispatched.' },
  ],
}

export const net = {
  id: 'net',
  eyebrow: 'The Net',
  productName: 'Synera DuoForte',
  title: 'Built for the mosquito we actually face.',
  body: [
    'Mosquitoes in Nigeria have grown resistant to the single insecticide most nets rely on. Synera DuoForte carries two active ingredients in the fibre so the net keeps working where older nets have stopped.',
  ],
  ingredients: [
    {
      name: 'Alpha-cypermethrin',
      dose: '3.75 g/kg',
      role: 'Knockdown',
      detail: 'A fast-acting pyrethroid that stops mosquitoes on contact.',
    },
    {
      name: 'Chlorfenapyr',
      dose: '5.6 g/kg',
      role: 'Resistance-breaking',
      detail: 'A pyrrole with a different mode of action that resistant mosquitoes have not adapted to.',
    },
  ],
  specs: ['Polyester knit', 'WHO-recommended dual-AI class', 'Rated 3 years use/wash'],
  benefits: [
    {
      title: 'Stops resistant mosquitoes',
      detail: 'Two modes of action mean there is no single defence for a mosquito to evolve around.',
    },
    {
      title: 'Survives years of washing',
      detail: 'Active ingredients are bound into the fibre and rated for three years of use and washing.',
    },
    {
      title: 'Made minutes from where it is needed',
      detail: 'Cut, sewn and packed in Ogun State, so supply moves in days rather than shipping seasons.',
    },
  ],
  designerNote: 'Synera DuoForte pack. Designed by GDM Health Products. Manufactured by Harvestfield Healthcare FZE.',
  meshNote: 'Both active ingredients are bound into the polyester fibre itself, so every intersection of the mesh carries them.',
}

export const supply = {
  id: 'supply',
  eyebrow: 'Supply',
  title: 'Two ways to get Synera DuoForte nets where they are needed.',
  programs: {
    title: 'For Programs',
    audience: 'Ministries, funds and NGOs',
    body: 'Source Synera DuoForte dual-insecticide nets in-country, with quality assurance on every batch and delivery measured in days. We work with procurement teams on volumes, packaging and timelines.',
    points: ['In-country manufacturing', 'QA on every batch', 'Delivery in days, not months'],
    cta: { label: 'Request Supply', href: '#request-supply' },
  },
  families: {
    title: 'For Families',
    audience: 'Retail and household buyers',
    body: 'The same Synera DuoForte net that protects programs will be available through retail distributors across Nigeria. We are building that network now.',
    points: ['Same Synera DuoForte dual-insecticide net', 'Rated for 3 years of use', 'Made in Nigeria'],
    // No distributor list exists yet — route to the form rather than a dead page.
    cta: { label: 'Distributor network launching soon — write to us', href: '#request-supply' },
  },
}

export const faqSection = {
  id: 'faq',
  eyebrow: 'FAQ',
  title: 'Questions we hear most.',
}

export const requestSupply = {
  id: 'request-supply',
  eyebrow: 'Request Supply',
  title: 'Tell us what you need.',
  context: [
    'We manufacture at the Harvestfield Industries Free Trade Zone, Ogun State, Nigeria.',
    'We reply within two working days.',
    'We supply ministries, funds, NGOs and distributors.',
  ],
  fields: {
    fullName: 'Full name',
    organization: 'Organization (optional)',
    email: 'Email',
    message: 'What do you need?',
    messagePlaceholder: 'Volumes, timelines, delivery location, or anything else we should know.',
  },
  submit: 'Send request',
  success: {
    title: 'Thank you. Your request is in.',
    body: 'We will reply within two working days.',
  },
  error: {
    title: 'Something went wrong.',
    body: 'Your request was not sent. Please try again, or email us directly at',
  },
}


export const blog = {
  eyebrow: 'Blog',
  title: 'Notes from the factory floor.',
  intro: 'Updates on production, malaria programme supply and the science behind dual-insecticide nets.',
  soonTitle: 'First posts coming soon.',
  soonBody: 'We are setting up the blog. Check back shortly, or write to us if you have a question in the meantime.',
}
