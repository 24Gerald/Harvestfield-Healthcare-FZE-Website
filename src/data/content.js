/**
 * Section copy for the homepage, in page order.
 *
 * Copy follows "Harvestfield Healthcare FZE — Website build specification"
 * (MD Office, Sept 2026), Part 4, Sections 1-14. Where the specification marks
 * an item as on hold, the TODO(md-office) comment above it names what is needed
 * before that line may be published.
 *
 * Phase 1 covers the homepage only. Content the specification moves to the
 * Synera DuoForte page (net.benefits, net.specs, the FAQ) is kept here, unused
 * or held, so nothing is lost when that page is built.
 */

/* Section 1 — Hero */
export const hero = {
  eyebrow: 'Harvestfield Healthcare FZE',
  title: 'Protection, made close to the fight.',
  subtitle:
    'Harvestfield Healthcare is a Nigerian healthcare manufacturer producing Synera DuoForte dual-insecticide nets at its facility in Ogun State. Advanced malaria protection, made in the country carrying the world’s heaviest malaria burden.',
  primaryCta: { label: 'Request supply', href: '#request-supply' },
  secondaryCta: { label: 'See the net', href: '#net' },
}

/* Section 2 — Who we are. A single quiet paragraph, no imagery, no emphasis. */
export const whoWeAre = {
  body: 'Harvestfield Healthcare FZE is a healthcare manufacturing company, wholly Nigerian owned, within the Harvestfield Group. Our current manufacturing programme is long-lasting insecticidal nets for malaria prevention, produced at our facility in the [Harvestfield Free Trade Zone](https://www.harvestfield-ng.com), Ogun State.',
}

/* Section 3 — Where we are today. Replaces the four-figure statistics strip. */
export const today = {
  title: 'Where we are today.',
  // TODO(md-office): item 2 needs the WHO site-inclusion wording in the exact
  // terms of the listing, and the NAFDAC certification description. Item 3
  // needs the 26-year record and the 42 million figure confirmed publishable.
  items: [
    {
      lead: 'In commercial production since September 2026.',
      detail: 'Synera DuoForte dual-insecticide nets, manufactured at our Ogun State facility.',
    },
    {
      lead: 'An approved manufacturing site.',
      detail:
        'Our facility is included as an approved manufacturing site under the WHO prequalification held for Synera DuoForte, and is certified by NAFDAC.',
    },
    {
      lead: '26 years in Nigerian vector control.',
      detail: 'The Harvestfield Group has supplied over 42 million nets across all 36 states.',
    },
    {
      lead: 'Wholly Nigerian owned.',
      detail: 'No foreign equity, inside a free trade zone the group owns and operates.',
    },
  ],
}

/* Section 4 — The malaria problem */
export const malaria = {
  id: 'why-this-matters',
  eyebrow: 'Why this matters',
  title: 'Resistance is winning wherever it goes unanswered.',
  // TODO(md-office): both claims to be sourced to the current WHO World Malaria
  // Report and dated, or kept qualitative as written here. No percentage is
  // published without a visible source and year.
  body: [
    'Nigeria carries a larger share of the world’s malaria cases and deaths than any other country. For two decades the standard defence has been a net treated with a single class of insecticide, and across much of the country mosquitoes have adapted to it. A net that a resistant mosquito survives protects less than the household sleeping under it believes.',
    'Nets carrying two active ingredients that work through different modes of action are the response, and they now account for the large majority of nets supplied into sub-Saharan Africa. Synera DuoForte is one of them.',
  ],
  link: { label: 'How Synera DuoForte works', href: '#net' },
}

/* Section 5 — The net. Condensed; benefits and the full spec strip move to the
   Synera DuoForte page when it is built. */
export const net = {
  id: 'net',
  eyebrow: 'The Net',
  productName: 'Synera DuoForte',
  title: 'Built for the mosquito we actually face.',
  // TODO(md-office): all product claims below require written GDM approval,
  // including loadings, the three-year rating and the fibre-binding description.
  body: [
    'Synera DuoForte carries alpha-cypermethrin for fast knockdown and chlorfenapyr, a pyrrole working through a mode of action that pyrethroid-resistant mosquitoes have not adapted to. Both are bound into the polyester fibre itself, so every intersection of the mesh carries them, and the net is rated for three years of use and washing.',
  ],
  attribution:
    'Synera DuoForte is developed and owned by GDM Health Products. Harvestfield Healthcare FZE manufactures it in Nigeria under a manufacturing agreement.',
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
  // Held for the Synera DuoForte page (specification, Section 5).
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
      detail: 'Produced in Ogun State, so supply moves in days rather than shipping seasons.',
    },
  ],
  designerNote: 'Synera DuoForte pack. Developed by GDM Health Products.',
  meshNote: 'Both active ingredients are bound into the polyester fibre itself, so every intersection of the mesh carries them.',
}

/* Section 6 — Made here */
export const factory = {
  id: 'factory',
  eyebrow: 'The Factory',
  title: 'Made in Ogun State, Nigeria — not shipped in.',
  body: [
    'Our facility sits inside the [Harvestfield Industries Free Trade Zone](https://www.harvestfield-ng.com) in Ogun State, Nigeria, on a site the group owns and operates. Netting arrives in bulk panels and leaves as finished, packed Synera DuoForte nets, ready for the programmes and families waiting for them.',
    'Manufacturing in-country closes the distance between a decision and a delivery. No shipping windows, no port delays, and no waiting on a production slot in another hemisphere. For a programme that needs nets in a specific state in a specific month, that is the difference between a campaign that runs on time and one that does not.',
  ],
  process: [
    { step: 'Netting in', detail: 'Treated polyester knit arrives at the zone in bulk rolls.' },
    { step: 'Cut', detail: 'Panels are cut on site to size for each net format.' },
    { step: 'Sew', detail: 'Panels are seamed, hemmed and fitted with hanging loops.' },
    { step: 'Pack and ship', detail: 'Synera DuoForte nets are folded, bagged, batch-checked and dispatched.' },
  ],
  link: { label: 'Inside the facility', href: '#inside-the-factory' },
}

export const gallery = {
  id: 'inside-the-factory',
  eyebrow: 'Inside the factory',
  title: 'Where Synera DuoForte nets take shape.',
  ariaLabel: 'Photos from the Harvestfield Healthcare FZE factory, scrolling continuously. Hover to pause.',
}

/* Section 7 — Quality and regulatory.
   Carries the most regulatory risk on the site. Do not alter this wording
   without regulatory sign-off (specification, Part 4, Section 7). */
export const certified = {
  id: 'certified',
  eyebrow: 'Quality and regulatory',
  title: 'Quality decides, and it is not a close call.',
  body: 'In healthcare manufacturing, quality is not a feature of the product. It is the condition of being allowed to supply at all. Where output and quality genuinely conflict here, quality wins, and the people responsible for quality can stop a line without asking permission first.',
  // TODO(md-office): BLOCKING. Do not publish until documentary evidence is in
  // hand for all three credentials, and complete the two ISO placeholders
  // rather than deleting them. "NAFDAC GMP" was removed pending confirmation
  // that it is the correct term for this product class.
  items: [
    {
      key: 'who',
      kicker: 'Globally validated',
      title: 'WHO prequalification',
      body: 'Synera DuoForte is a WHO-prequalified product, developed and owned by GDM Health Products. Our facility in Nigeria is included as an approved manufacturing site under that prequalification.',
      logoAlt: 'World Health Organization',
    },
    {
      key: 'nafdac',
      kicker: 'Nationally regulated',
      title: 'NAFDAC',
      body: 'Our facility is certified by NAFDAC, Nigeria’s regulator for medicines and health products.',
      logoAlt: 'NAFDAC — National Agency for Food and Drug Administration and Control',
    },
    {
      key: 'iso',
      kicker: 'International quality',
      title: 'ISO',
      body: 'Our quality management system is certified to [ISO STANDARD] by [CERTIFICATION BODY].',
      logoAlt: 'ISO certified company',
    },
  ],
}

/* Section 8 — The GDM relationship. Replaces the "Trusted by" strip. */
export const trustedBy = {
  eyebrow: 'Technology partner',
  title: 'The technology is GDM’s. The manufacturing is ours.',
  // TODO(md-office): confirm the description of the arrangement against the
  // executed agreement, and confirm GDM approves the description and logo use.
  body: [
    'Synera DuoForte was developed and is owned by GDM Health Products, and it holds WHO prequalification in their name. Harvestfield Healthcare manufactures it in Nigeria under the agreed manufacturing arrangement, inside their regulatory listing and to their specification.',
    'Being accepted into a prequalified product’s manufacturing arrangement is not a commercial formality. It requires a facility, a quality system and documentation that satisfy both the technology owner and the prequalification requirements. That is the standard our plant was built to meet.',
  ],
  partners: [
    { name: 'GDM Health Products', role: 'Developer and owner of Synera DuoForte', logo: 'gdm', url: 'https://www.gdmedhealth.com/' },
  ],
}

/* Section 9 — Harvestfield heritage. Replaces "Working alongside".
   Harvestfield Industries only: PVAC and OgunInvest are removed, because
   presenting a federal initiative and a state agency as partners implies an
   affiliation that is not documented. */
export const heritage = {
  id: 'harvestfield-group',
  eyebrow: 'The Harvestfield Group',
  title: 'Twenty-six years delivering nets. Now we make them.',
  // TODO(md-office): the 26-year record and the 42 million figure confirmed publishable.
  body: [
    'Harvestfield has worked in Nigerian vector control for 26 years and has put over 42 million mosquito nets into households in all 36 states. We know which states run campaigns when, which routes are difficult in the rainy season, and what happens to a programme when a shipment lands late.',
    'Manufacturing is the next step along the same chain, and it is a harder one. It required a plant built to be inspected, a quality system that holds up under audit, and people trained to run both. We began it with a clear view of the standard we would have to meet, because we have spent 26 years on the receiving end of other people’s.',
  ],
  parent: {
    name: 'Harvestfield Industries Limited',
    logo: 'harvestfield-industries',
    url: 'https://www.harvestfield-ng.com',
  },
}

/* Section 10 — What this means for Nigeria. Replaces "Local manufacturing". */
export const localCapability = {
  id: 'local-manufacturing',
  eyebrow: 'Local manufacturing',
  title: 'A malaria supply chain that starts in Nigeria.',
  body: [
    'Nigeria carries one of the heaviest malaria burdens in the world and has historically bought almost all of its control commodities abroad. That arrangement holds until a foreign budget is cut or a shipping route closes, and then the shortage arrives here.',
    'Manufacturing WHO-prequalified malaria commodities inside Nigeria changes that exposure. It shortens the supply chain, keeps manufacturing and regulatory capability in the country, creates skilled technical work, and leaves more of the value where the disease is.',
    'Strengthening domestic healthcare manufacturing is a national priority, and we are approaching it as a private company investing private capital. We are not waiting for the conditions to be perfect before building.',
  ],
}

/* Section 11 — Purpose */
export const purpose = {
  eyebrow: 'Our purpose',
  title: 'To build what better health requires.',
  body: 'Building means more than manufacturing. It means the plant, the quality systems, the regulatory capability, the technical skill and the careers that go with them. Nets are what we make. The purpose is what we are building around them.',
}

/* Section 12 — Leadership.
   The Chairman card is withheld: the existing biography covers 1984 to 1987
   and stops, and the specification is explicit that this section must not be
   built with that text. */
export const management = {
  id: 'management',
  eyebrow: 'Leadership',
  title: 'The people running it.',
  intro:
    'Harvestfield Healthcare is led by people who have spent their careers putting health products into Nigerian households, and who are now responsible for making them.',
  readMore: 'Read full profile',
  readLess: 'Show less',
  // TODO(md-office): BLOCKING for the Chairman. Needs his professional record
  // since 1987, particularly his role in building the Harvestfield Group.
  // The Managing Director's prior experience and education are also outstanding.
  people: [
    {
      name: 'Isaac Awofisayo',
      role: 'Managing Director',
      photo: 'managing-director',
      initials: 'IA',
      bio: [
        'Isaac Awofisayo is Managing Director of Harvestfield Healthcare FZE. He leads the company’s strategy and operations, and is responsible for its development as a healthcare manufacturing business in Nigeria.',
        'He oversaw the establishment of the manufacturing operation in the Harvestfield Free Trade Zone and its progress through international and national regulatory approval.',
      ],
    },
  ],
}

/* Section 13 — Supply */
export const supply = {
  id: 'supply',
  eyebrow: 'Supply',
  title: 'Two ways to get Synera DuoForte where it is needed.',
  // TODO(md-office): confirm batch documentation may be offered to procurement
  // teams in these terms, and that the distribution network may be described
  // as being built.
  programs: {
    title: 'For programmes',
    audience: 'Ministries, malaria programmes, funds and NGOs',
    body: 'Source Synera DuoForte nets manufactured in Nigeria, with quality assurance on every batch and delivery measured in days. We work with procurement teams on volumes, packaging, batch documentation and timelines.',
    points: ['Manufactured in Nigeria', 'Batch-level quality assurance', 'Delivery in days, not months'],
    cta: { label: 'Request supply', href: '#request-supply' },
  },
  distributors: {
    title: 'For distributors',
    audience: 'Health product distribution in Nigeria',
    body: 'We are building a distribution network to make Synera DuoForte available to households across Nigeria, alongside the group’s existing national reach. If you distribute health products in Nigeria, we would like to hear from you.',
    points: ['National reach behind it', 'The same net supplied to programmes', 'Made in Nigeria'],
    cta: { label: 'Talk to us about distribution', href: '#request-supply' },
  },
}

/* FAQ — the specification moves this to the Synera DuoForte page. It stays on
   the homepage until that page exists, so the answers are not lost. */
export const faqSection = {
  id: 'faq',
  eyebrow: 'FAQ',
  title: 'Questions we hear most.',
}

/* Section 14 — Request supply */
export const requestSupply = {
  id: 'request-supply',
  eyebrow: 'Request supply',
  title: 'Tell us what you need.',
  context: [
    'We manufacture at the Harvestfield Industries Free Trade Zone, Ogun State, Nigeria.',
    'We supply federal and state malaria programmes, international funds and programmes, NGOs and distributors.',
  ],
  fields: {
    fullName: 'Full name',
    organization: 'Organisation (optional)',
    email: 'Email',
    topic: 'What is this about?',
    topicPlaceholder: 'Select one',
    topicOptions: ['Programme supply', 'Distribution', 'Media enquiry', 'Careers', 'Something else'],
    message: 'What do you need?',
    messagePlaceholder: 'Volumes, timelines, delivery location, or anything else we should know.',
  },
  submit: 'Send request',
  success: {
    title: 'Thank you. Your request is in.',
    body: 'It has reached the team and we will come back to you.',
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
