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
  title: 'Dual active mosquito nets manufactured in Nigeria',
  subtitle: 'Strengthening the fight against malaria.',
  primaryCta: { label: 'Request supply', href: '/contact' },
  secondaryCta: { label: 'See the net', href: '#net' },
}

/* Section 2 — Who we are. A single quiet paragraph, no imagery, no emphasis. */
export const whoWeAre = {
  body: 'Harvestfield Healthcare FZE is a healthcare manufacturing company, wholly Nigerian owned, within the Harvestfield Group. Our current manufacturing programme is long-lasting insecticidal nets for malaria prevention, produced at our facility in the [Harvestfield Free Trade Zone](https://www.harvestfield-ng.com), Ogun State.',
}

/* Section 3 — Where we are today. Replaces the four-figure statistics strip. */
export const today = {
  title: 'Where we are today',
  // Item 2's WHO wording was supplied by the client (Sept 2026) and the card in
  // Section 7 is worded to match. Change both together.
  items: [
    {
      lead: 'In commercial production since September 2026.',
      detail: 'Synera DuoForte dual-insecticide nets, manufactured at our Ogun State facility.',
    },
    {
      lead: 'Nigeria’s first.',
      detail:
        'First LLIN manufacturing facility in Nigeria listed as an additional WHO prequalification manufacturing site. First ISO-certified LLIN manufacturing facility in the country.',
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
  title: 'Resistance is winning wherever it goes unanswered',
  // Claims are kept qualitative; the source line below cites the WHO 2025
  // Nigeria country profile. No percentage is published here.
  body: [
    'Nigeria carries a larger share of the world’s malaria cases and deaths than any other country. For two decades the standard defence has been a net treated with a single class of insecticide, and across much of the country mosquitoes have adapted to it. A net that a resistant mosquito survives protects less than the household sleeping under it believes.',
    'Nets carrying two active ingredients that work through different modes of action are the response, and they now account for the large majority of nets supplied into sub-Saharan Africa. Synera DuoForte is one of them.',
  ],
  link: { label: 'How Synera DuoForte works', href: '#net' },
  source: {
    label: 'Source: WHO, Malaria 2025 — Nigeria country profile',
    href: 'https://www.who.int/publications/m/item/malaria-2025-nigeria-country-profile',
  },
}

/* Section 5 — The net. Condensed; benefits and the full spec strip move to the
   Synera DuoForte page when it is built. */
export const net = {
  id: 'net',
  eyebrow: 'The Net',
  productName: 'Synera DuoForte',
  title: 'Built for the mosquito we actually face',
  // Loadings, the three-year rating and the fibre-binding description confirmed
  // by the client (Sept 2026).
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
  title: 'Made in Nigeria',
  body: [
    'Our facility sits inside the [Harvestfield Industries Free Trade Zone](https://www.harvestfield-ng.com) in Ogun State, Nigeria, on a site the group owns and operates. Netting arrives in bulk panels and leaves as finished, packed Synera DuoForte nets, ready for the programmes and families waiting for them.',
    'Manufacturing in-country closes the distance between a decision and a delivery. No shipping windows, no port delays, and no waiting on a production slot in another hemisphere. For a programme that needs nets in a specific state in a specific month, that is the difference between a campaign that runs on time and one that does not.',
  ],
  process: [
    { step: 'Netting in', detail: 'Treated polyester knit arrives at the zone in bulk rolls.' },
    { step: 'Cut', detail: 'Panels are cut on site to size for each net format.' },
    { step: 'Sew', detail: 'Panels are seamed, hemmed and fitted with hanging loops.' },
    { step: 'Pack and deliver', detail: 'Synera DuoForte nets are folded, bagged, batch-checked and dispatched.' },
  ],
  link: { label: 'Inside the facility', href: '#inside-the-factory' },
}

export const gallery = {
  id: 'inside-the-factory',
  eyebrow: 'Inside the factory',
  title: 'Where Synera DuoForte nets take shape',
  ariaLabel: 'Photos from the Harvestfield Healthcare FZE factory, scrolling continuously. Hover to pause.',
}

/* Section 7 — Quality and regulatory.
   Carries the most regulatory risk on the site. Do not alter this wording
   without regulatory sign-off (specification, Part 4, Section 7). */
export const certified = {
  id: 'certified',
  eyebrow: 'Quality and regulatory',
  title: 'Quality comes first every time',
  // Second entry is set as the closing statement, not a paragraph.
  body: [
    'Every net we produce must meet the required standards before it leaves our facility. Our quality team has the authority to hold production, stop a line or reject a product when those standards are not met.',
    'Production matters. Quality comes first.',
  ],
  // ISO standard, NAFDAC GMP and the WHO wording all confirmed by the client
  // (Sept 2026). The WHO card and "Where we are today" now use the same
  // phrasing — "listed as an additional manufacturing site" — because this is
  // the claim procurement agencies verify directly. Change both together.
  //
  // The WHO emblem was removed from this card on WHO's instruction (Oct 2026).
  // WHO restricts use of its emblem; do not reinstate it. The wording is a
  // factual reference to the prequalification listing and is unaffected.
  items: [
    {
      key: 'who',
      kicker: 'Globally validated',
      title: 'WHO prequalification',
      body: 'Synera DuoForte is a WHO-prequalified product, developed and owned by GDM Health Products. Our facility in Nigeria is listed as an additional manufacturing site under that prequalification.',
    },
    {
      key: 'nafdac',
      kicker: 'Nationally regulated',
      title: 'NAFDAC',
      body: 'Our facility is GMP certified by NAFDAC, Nigeria’s regulator for medicines and health products.',
      logoAlt: 'NAFDAC — National Agency for Food and Drug Administration and Control',
    },
    {
      key: 'iso',
      kicker: 'International quality',
      title: 'ISO',
      body: 'Our quality management system is certified to ISO 9001:2015 – Quality Management Systems.',
      logoAlt: 'ISO certified company',
    },
  ],
}

/* Section 8 — The GDM relationship. Replaces the "Trusted by" strip. */
export const trustedBy = {
  eyebrow: 'Technology partner',
  title: 'The technology is GDM’s. The manufacturing is ours',
  // Arrangement description confirmed by the client (Sept 2026).
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
  title: '26 years delivering nets. Now we make them',
  // The 26-year record and the 42 million figure confirmed publishable (Sept 2026).
  body: [
    'For 26 years, Harvestfield has worked in vector control across Nigeria, delivering more than 42 million mosquito nets to households across all 36 states. That experience gives us something that cannot be built overnight: deep knowledge of the Nigerian market, nationwide distribution reach, and decades of experience getting products where they need to go.',
    'Manufacturing is the natural next step.',
    'We have built the facility, quality systems and local expertise to manufacture nets here in Nigeria to the standards international malaria programmes require. It brings production closer to the people we have spent more than two decades serving.',
    'From delivering the nets to making them. The purpose remains the same.',
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
  title: 'A malaria supply chain that starts in Nigeria',
  body: [
    'Nigeria carries one of the heaviest malaria burdens in the world and has historically bought almost all of its control commodities abroad. That arrangement holds until a foreign budget is cut or a shipping route closes, and then the shortage arrives here.',
    'Manufacturing WHO-prequalified malaria commodities inside Nigeria changes that exposure. It shortens the supply chain, keeps manufacturing and regulatory capability in the country, creates skilled technical work, and leaves more of the value where the disease is.',
    'Strengthening domestic healthcare manufacturing is a national priority, and we are approaching it as a private company investing private capital. We are not waiting for the conditions to be perfect before building.',
  ],
}

/* Section 11 — Purpose */
export const purpose = {
  eyebrow: 'Our purpose',
  title: 'To build what better health requires',
  body: 'Building means more than manufacturing. It means the plant, the quality systems, the regulatory capability, the technical skill and the careers that go with them. Nets are what we make. The purpose is what we are building around them.',
}

/* Section 12 — Leadership.
   Three groups: Harvestfield Healthcare's own Chairman and Managing Director
   first, then the board and the executive management of Harvestfield
   Industries Limited, the parent company. Keeping them in separate groups is
   deliberate — Folake Sanu chairs the Industries board while Martins A.
   Awofisayo chairs Harvestfield Healthcare, and listing them together would
   read as two chairmen of one company.

   The two Healthcare biographies are verbatim from the profiles supplied by
   the MD Office (Chairman, Sept 2026; Isaac_Awofisayo_Profile_healthcare.docx);
   the six Industries biographies are verbatim from
   Harvestfield_Industries_Management_Executive_Profile (2026), which is also
   where the portraits come from. Only the first paragraph shows before "Read
   full profile", so any future edit should keep the substance in that opening
   paragraph.

   Ola Olabinjo and Alhaji Adebayo Jimoh have no portrait in that document, so
   their cards show initials until one arrives — drop a file in
   src/assets/management/ and it is picked up automatically (see README there). */
export const management = {
  id: 'management',
  eyebrow: 'Leadership',
  title: 'The people running it',
  intro:
    'Harvestfield Healthcare is led by people who have spent their careers putting health products into Nigerian households, and who are now responsible for making them.',
  readMore: 'Read full profile',
  readLess: 'Show less',
  groups: [
    {
      title: 'Harvestfield Healthcare FZE',
      people: [
        {
          name: 'Martins A. Awofisayo',
          role: 'Chairman',
          also: 'Managing Director / Chief Executive Officer, Harvestfield Industries Limited',
          photo: 'chairman',
          initials: 'MA',
          bio: [
            'Martins A. Awofisayo established Harvestfield Industries Limited in 2000 to market agrochemicals and public health products in Nigeria, building it into the distribution and manufacturing business from which Harvestfield Healthcare has evolved. He previously worked with Continental Pharmaceuticals Limited, Lagos, joining the company in 1987 as Operations Manager and subsequently rising to Deputy General Manager.',
            'He currently serves as President of CropLife Nigeria and Chairman of the Ogun State branch of the Manufacturers Association of Nigeria. His longstanding involvement in malaria control and public health includes serving as Vice Chairman of the Federal Ministry of Health’s World Malaria Day Celebrations from 2005 to 2015. He was also a member of the Development Partners Committee of the Roll Back Malaria Programme in Nigeria, an advisory body to the Federal Ministry of Health comprising representatives of organisations including the World Health Organization (WHO), UNICEF and DFID.',
            'In 2013, he was named West African Emerging Entrepreneur of the Year by Ernst & Young, recognising his achievements in entrepreneurship and business development in the region.',
            'He holds a Master’s degree in Business Analysis from the University of Lancaster, United Kingdom, awarded in 1984. From 1984 to 1987, he worked with the London office of the Nigerian Universities Office as Recruitment Manager and served as Secretary to the Recruitment Committee of the Committee of Vice-Chancellors of Nigerian Universities, supporting the recruitment of international academic staff for Nigerian universities.',
          ],
        },
        {
          name: 'Isaac Awofisayo',
          role: 'Managing Director',
          also: 'Head of Strategy, Harvestfield Industries Limited',
          photo: 'managing-director',
          initials: 'IA',
          bio: [
            'Isaac Awofisayo is the Managing Director of Harvestfield Healthcare FZE, where he leads the company’s strategy, operations and long-term development as it builds a diversified healthcare manufacturing business in Nigeria.',
            'He brings more than 15 years of experience across corporate and investment banking, strategy, healthcare and manufacturing. Before moving into industry, Isaac spent more than a decade with Barclays in the United Kingdom, latterly as a Relationship Director within Barclays Corporate & Investment Bank, where he managed complex corporate relationships, financing and credit requirements, including cross-border transactions.',
            'At Harvestfield Healthcare, Isaac leads the development of new healthcare manufacturing platforms, international technical and commercial partnerships, investment and business development, and the continued strengthening of the company’s manufacturing and regulatory capabilities. His focus is on building a commercially strong Nigerian healthcare company capable of manufacturing high-quality healthcare products to international standards while developing local technical expertise.',
            'Isaac also serves as Managing Director of the Harvestfield Free Trade Zone, overseeing its strategic development as a platform for manufacturing and investment, and as Head of Strategy at Harvestfield Industries Limited, contributing to the Group’s strategy, investments, partnerships and new business development.',
            'He holds an MSc in International Business Management from the University of Surrey, United Kingdom.',
          ],
        },
      ],
    },
    {
      title: 'Board of Directors',
      note: 'Harvestfield Industries Limited, the parent company',
      people: [
        {
          name: 'Folake Sanu, FCA',
          role: 'Chairman, Board of Directors',
          photo: 'folake-sanu',
          initials: 'FS',
          bio: [
            'Folake Sanu is a transformation executive coach, board executive and an accomplished banking and finance expert with over 40 years of working experience spanning professional accounting practice and 30 years in banking at senior and executive management levels. She is a Fellow of the Institute of Chartered Accountants of Nigeria (FCA) and an Honorary Senior Member of the Chartered Institute of Bankers of Nigeria (CIBN).',
            'She began her career as a professional accountant with Peat Marwick Ani Ogunde & Co, where she spent over ten years auditing financial institutions, manufacturing and service companies, before transitioning into banking. She went on to lead and manage various transformational projects and strategic business units across four different Nigerian banks, with experience spanning Governance and Compliance, Finance, Corporate Strategy, Digital Transformation and Customer Experience, Operations and Technology, Risk Management, Audit, Mergers and Acquisitions, Project Management, Credit and Marketing.',
            'Her last banking role was at WEMA Bank Plc, where she became the bank’s first female Executive Director, a position she held for six years. She oversaw the Lagos Business Directorate before becoming Executive Director of Business Support, overseeing Sustainability and Corporate Social Responsibility, Human Capital Management, Operations, Customer Experience Management, Business Process Re-engineering, and Brand & Marketing Communications. During her tenure, she led the transformation of the bank’s service delivery and drove the digitization of core business processes, significantly strengthening the WEMA Bank brand.',
            'Folake is a results-oriented and motivating leader dedicated to the pursuit of excellence and is passionate about the advancement of women. She is a Life Member of WIMBIZ (Women in Management and Business), a partner in WAW (Women at Work), a Director at Elizabethan H & H, and a mentor with Women’s Lifestyle Hub.',
            'She is a keen leadership scholar and an alumna of the Harvard Business School Advanced Management Program and the London Business School Senior Management Program, and has completed executive leadership, digital transformation and governance programs at Harvard Business School, INSEAD Fontainebleau, IMD and other global learning institutions. She is the author of Life Lessons of a Nigerian Wonder Woman, a memoir written to inspire women to become resourceful and successful in their endeavours.',
            'Folake Sanu is currently the CEO of FS Global Advisory Services and an Independent Director with Remita Payment Services Limited, Coleman Cables Technical Company Limited and Alpha Morgan Bank.',
          ],
        },
        {
          name: 'Ola Olabinjo',
          role: 'Director',
          photo: 'ola-olabinjo',
          initials: 'OO',
          bio: [
            'Ola Olabinjo is a seasoned professional with over 30 years of experience spanning Investment and Corporate Banking, Risk Management, Treasury, Transaction Banking and Operations. He has served as Executive Director and Divisional Head of Corporate and Commercial Banking at various commercial banks, with oversight of the Oil & Gas, Telecoms, Power, Construction, FMCG and Financial Institutions business groups.',
            'He began his career at Marina International Bank Limited as an Assistant Banking Officer, rising to Assistant Manager with experience in corporate banking, internal control and credit risk management. He subsequently moved to Prudent Bank Plc as Manager (Head of Operations), before rising through the ranks to Deputy General Manager at Skye Bank Plc, General Manager at FCMB, and Executive Director at Heritage Banking Limited. He is currently the Managing Director/CEO of Skystone Finance Company Limited.',
            'He is a Fellow of the Chartered Institute of Bankers of Nigeria (CIBN), a Fellow of the Institute of Credit Administration (ICA), and a member of the Institute of Directors (IoD). He also serves as a director on the boards of several companies, providing strategic advice and guidance.',
            'He has been involved in several key infrastructure projects, with extensive experience leading, advising, arranging and structuring acquisition financing for construction and development projects across sectors including power, oil and gas, real estate, telecommunications and FMCG, with particular expertise in debt solutions and management.',
          ],
        },
        {
          name: 'Alhaji Adebayo Jimoh',
          role: 'Director',
          photo: 'adebayo-jimoh',
          initials: 'AJ',
          bio: [
            'Alhaji Adebayo Jimoh is a multi-disciplinary professional with experience spanning both the private and public sectors of the economy, having spent over two decades with the British multinational conglomerate John Holt Plc and later headed a sub-regional conglomerate as Group Managing Director & Chief Executive. His exposure across these sectors has strengthened his capacity in strategic thinking and decision-making.',
            'He began his career as an Assistant Lecturer at the University of Ibadan, teaching Industrial Psychology and Organisational Behaviour, before transitioning into the conglomerate industry. He joined John Holt Plc as a Management Trainee in 1983 and rose through the ranks to become Deputy General Manager (Operations) in 1993, and General Manager of John Holt Ventures from 1994 to 1996.',
            'He subsequently served as General Manager at Yamaha Almarine Company (1997), Chief Executive in charge of Trade and Export for the John Holt Group in Nigeria and West Africa, and Executive Director in charge of Group Operations of John Holt Plc from 2003. In May 2005, he was appointed Group Managing Director/CEO of Odua Investment Company Limited, the investment vehicle of the five South-Western states in Nigeria, a position he held for nine years until his retirement in October 2014.',
            'Alhaji Adebayo Jimoh is a Fellow of the National Institute of Marketing of Nigeria and a member of the Institute of Directors. He currently chairs Synergy Cotton and Agro Allied Company, a cotton export business operated in partnership with Plexus Cotton, UK. He is also Chairman of University of Ibadan Bookshop Limited and Golden Age Universal Services Limited; Vice Chairman of the Federal University of Technology, Akure Advancement Board; National Vice Chairman of the Nigeria Chamber of Commerce, Industry, Mines and Agriculture (NACCIMA); and a Board Member of the National Orientation Agency, Abuja.',
            'He is widely travelled and has represented Nigerian business interests internationally across Europe, Asia, the Americas, Japan, the United Kingdom and Africa, and is a strong believer in team building, results and due process.',
          ],
        },
      ],
    },
    {
      title: 'Executive management',
      note: 'Harvestfield Industries Limited',
      people: [
        {
          name: 'Dr Abdullahi Aliyu Ndarubu, Ph.D.',
          role: 'Chief Operating Officer',
          photo: 'abdullahi-ndarubu',
          initials: 'AN',
          bio: [
            'Dr Abdullahi Aliyu Ndarubu joined Harvestfield Industries Limited in May 2017 as General Manager (Research & Development) and currently serves as Chief Operating Officer. He led the establishment of Harvestfield’s agrochemical formulation factory and the bio-control products (Aflasafe) manufacturing factory, with oversight supervisory responsibility for both plants to date.',
            'He graduated from the Federal University of Technology, Minna, in 1990 with a Bachelor of Technology (B.Tech), obtained a Master’s degree in Agronomy from Ahmadu Bello University, Zaria, in 1997, and a Ph.D. in Agronomy from the University of Ilorin in 2006. He completed the Senior Management Programme (SMP 28) at the Lagos Business School and attended an International Training on Pesticide Research and Development at the Hunan Research Institute of Chemical Industry, PR China, in 2012.',
            'He spent 15 years at the National Cereal Research Institute (NCRI), Badeggi, from 1992 to 2006, as Senior Research Fellow (Agronomy) and Head of the National Research Programme on Sesame. He worked extensively on rice, sesame, cowpea, sugarcane and pesticides technology, and has over 20 scientific publications to his credit in international and local journals and proceedings.',
            'He joined The Candel Company Limited in May 2006, serving until February 2017 as General Manager (Research & Business Development) and later as General Manager (Technical & Regulatory Affairs). While with The Candel Company Ltd, he led the establishment of the agrochemical formulation plant located within the Lekki Free Zone Enterprise (The Candel FZE).',
            'Dr Abdullahi is an EXCO member of CropLife Nigeria (CLN), served as its General Secretary for over a decade and currently serves as Chairman of the Technical Committee. He is a Fellow of the Weed Science Society of Nigeria (WSSN) and a member of several professional societies including the Nigeria Society for Plant Protection (NSPP), the Mycotoxicological Society of Nigeria (MSN), the Agricultural Society of Nigeria (ASN), the Sugarcane Technologists Society of Nigeria (STSN) and the Ecological Society of Nigeria (ECOSON). He is an associate of the Business Incubation Platform (BIP), IITA Ibadan, and a facilitator of the IITA / ROME Business School Nigeria Agribusiness programme based at IITA, Ibadan. He serves as industry-based supervisor to post-graduate students of the Department of Crop Protection and Environmental Biology, University of Ibadan.',
          ],
        },
        {
          name: 'Adetayo Ogunfowoke',
          role: 'Head of Finance',
          photo: 'adetayo-ogunfowoke',
          initials: 'AO',
          bio: [
            'Adetayo Ogunfowoke is a seasoned finance and strategic planning professional with extensive experience in financial planning and analysis, financial control, treasury management, corporate finance, business strategy, cost management and performance optimization across Nigeria’s manufacturing, FMCG, energy, technology and telecommunications sectors.',
            'He currently serves as Head of Finance at Harvestfield Industries Limited, where he provides leadership and oversight for the Company’s finance function and supports executive management in financial planning, performance management, financial control and strategic decision-making. In this capacity, he contributes to strengthening financial governance, improving operational efficiency, enhancing business performance and supporting the Company’s sustainable growth.',
            'Prior to his current role, Adetayo worked with Rite Foods Limited, where he gained valuable experience within the fast-moving consumer goods sector, further strengthening his expertise in financial planning, business performance analysis, management reporting, budgeting and strategic financial decision support.',
            'He also served as Financial Planning and Analysis Manager at Mouka Limited, where he contributed to financial forecasting, budgeting, financial performance analysis and performance optimization initiatives. His experience at Mouka further developed his ability to connect financial results with operational and commercial drivers and provide actionable insights to support management decision-making.',
            'Earlier in his career, Adetayo held finance and leadership positions at Wragby Business Solutions Limited, where he served as Financial Controller; CDK Industries Limited, where he worked as Cost Accountant; Sapele Power Plc, where he served as Finance Manager; Eurafric Oil and Coastal Limited, where he worked as Senior Accountant; Intercellular Nigeria Limited, where he served as Internal Auditor; and 21st Century Technologies, where he worked as Accountant.',
            'Across these roles, he developed broad expertise in financial reporting, management accounting, treasury management, internal controls, auditing, cost accounting, budgeting, forecasting, payroll management, financial analysis and operational finance. His experience across different industries has given him a strong understanding of the relationship between financial performance, operational efficiency, commercial strategy and sustainable business growth.',
            'Adetayo developed his audit and accounting foundation through his earlier career as an Audit Supervisor at Solomon Osunba & Co. and Olushile Fowora & Co. (Chartered Accountants). These roles provided him with strong technical foundations in auditing, accounting, taxation, internal controls and financial reporting, which subsequently supported his progression into corporate finance, FP&A and senior finance leadership.',
            'He holds a Bachelor of Science (B.Sc.) in Accounting from the University of Lagos and a Higher National Diploma (HND) in Accounting from Moshood Abiola Polytechnic, Abeokuta. He is a Fellow of the Institute of Chartered Accountants of Nigeria (FCA) and an Associate Accounting Technician (AAT). He completed the Leadership Excellence Programme at Lagos Business School, Pan-Atlantic University, further strengthening his leadership and strategic management capabilities.',
          ],
        },
        {
          name: 'Aderonke Ifedolapo Ajala',
          role: 'Human Resource Manager',
          also: 'FCIHRM, ACIPMN, CHRP',
          photo: 'aderonke-ajala',
          initials: 'AA',
          bio: [
            'Aderonke Ifedolapo Ajala is an accomplished Training and Human Resources professional with over two decades of extensive experience across administration, compliance management, regulatory standards, training operations and organizational development. Currently serving as the Human Resources Manager at Harvestfield Industries Limited, Aderonke leads strategic talent initiatives, drives employee development, and ensures robust alignment with corporate standards and labour regulations.',
            'Throughout her distinguished career spanning more than 20 years, she has held progressive leadership roles across human resources management, administrative operations and professional training supervision. Aderonke brings a strong, cross-functional track record in quality assurance, policy compliance, document control, root cause analysis and strategic workforce management.',
          ],
        },
      ],
    },
  ],
}

/* Section 13 — Supply */
export const supply = {
  id: 'supply',
  eyebrow: 'Supply',
  title: 'Two ways to get Synera DuoForte where it is needed',
  // Batch documentation wording confirmed; the distribution network is
  // established (client, Sept 2026).
  programs: {
    title: 'For programmes',
    audience: 'Ministries, malaria programmes, funds and NGOs',
    body: 'Source Synera DuoForte nets manufactured in Nigeria, with quality assurance on every batch and delivery measured in days. We work with procurement teams on volumes, packaging, batch documentation and timelines.',
    points: ['Manufactured in Nigeria', 'Batch-level quality assurance', 'Delivery in days, not months'],
    cta: { label: 'Request supply', href: '#request-supply' },
  },
  institutional: {
    title: 'Protect the communities you support',
    audience: 'Private & institutional supply',
    body: [
      'Synera DuoForte is available to companies, foundations and organisations running malaria prevention, CSR and community health programmes across Nigeria.',
      'Whether you are supporting one community or a large-scale initiative, talk to us about your requirements.',
    ],
    points: ['Made in Nigeria', 'Suitable for community and institutional programmes', 'Nationwide supply capability'],
    cta: { label: 'Request a supply proposal', href: '/request-proposal' },
  },
}

/* FAQ — the specification moves this to the Synera DuoForte page. It stays on
   the homepage until that page exists, so the answers are not lost. */
export const faqSection = {
  id: 'faq',
  eyebrow: 'FAQ',
  title: 'Questions we hear most',
}

/* Section 14 — Request supply */
export const requestSupply = {
  id: 'request-supply',
  eyebrow: 'Request supply',
  title: 'Tell us what you need',
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
    title: 'Thank you. Your request is in',
    body: 'It has reached the team and we will come back to you.',
  },
  error: {
    title: 'Something went wrong.',
    body: 'Your request was not sent. Please try again, or email us directly at',
  },
}

/* ---------------------------------------------------------------------------
 * Phase 2 pages.
 *
 * The specification (Part 3) names five pages plus News and holds their copy
 * "pending approval of homepage positioning". These pages are built from that
 * structure using copy that is already approved or already on the site — the
 * standfirsts below come from the specification's own "What it does" column —
 * so no new claim is introduced anywhere. The detailed Phase 2 copy is still
 * owed for anything beyond what is composed here.
 * ------------------------------------------------------------------------ */
export const pages = {
  home: {
    path: '/',
    docTitle: 'Harvestfield Healthcare FZE | LLIN manufacturing in Nigeria',
    description: 'Harvestfield Healthcare FZE is a wholly Nigerian-owned healthcare manufacturer producing Synera DuoForte dual-insecticide nets at its facility in Ogun State, Nigeria for malaria programmes in Nigeria and West Africa.',
  },
  product: {
    path: '/synera-duoforte',
    navLabel: 'Synera DuoForte',
    eyebrow: 'The product',
    title: 'Synera DuoForte',
    standfirst: 'Technical detail on the dual-insecticide net Harvestfield Healthcare manufactures in Nigeria, and the questions we are asked about it most.',
    docTitle: 'Synera DuoForte | Dual-insecticide LLIN manufactured in Nigeria',
    description: 'Synera DuoForte carries alpha-cypermethrin and chlorfenapyr, bound into the polyester fibre and rated for three years. Developed by GDM Health Products, manufactured in Nigeria by Harvestfield Healthcare FZE.',
  },
  manufacturing: {
    path: '/manufacturing',
    navLabel: 'Manufacturing',
    eyebrow: 'Manufacturing and quality',
    title: 'How the nets are made, and to what standard',
    standfirst: 'The facility, the process, the quality system and the regulatory position.',
    docTitle: 'Manufacturing and quality | Harvestfield Healthcare FZE',
    description: 'How Synera DuoForte nets are manufactured at the Harvestfield Industries Free Trade Zone in Ogun State, Nigeria, and the quality system and regulatory position behind them.',
  },
  about: {
    path: '/about',
    navLabel: 'About',
    eyebrow: 'About Harvestfield Healthcare',
    title: 'A Nigerian healthcare manufacturer',
    standfirst: 'The company, the group behind it, what it is building and the people running it.',
    docTitle: 'About | Harvestfield Healthcare FZE',
    description: 'Harvestfield Healthcare FZE is a wholly Nigerian-owned healthcare manufacturer within the Harvestfield Group, which has worked in Nigerian vector control for 26 years.',
  },
  news: {
    path: '/news',
    navLabel: 'News',
    eyebrow: 'News',
    title: 'Milestones',
    standfirst: 'Production, programme supply and the science behind dual-insecticide nets.',
    docTitle: 'News | Harvestfield Healthcare FZE',
    description: 'Milestones from Harvestfield Healthcare FZE: production, malaria programme supply and the science behind dual-insecticide nets.',
  },
  contact: {
    path: '/contact',
    navLabel: 'Contact',
    eyebrow: 'Contact',
    title: 'Contact and request supply',
    standfirst: 'Routes for programme supply, distribution, media and career enquiries.',
    docTitle: 'Contact and request supply | Harvestfield Healthcare FZE',
    description: 'Request Synera DuoForte supply, talk to us about distribution, or reach us for media and career enquiries. Harvestfield Healthcare FZE, Ogun State, Nigeria.',
  },
}

/* The supply-proposal form, reached from the private & institutional panel. */
export const proposal = {
  path: '/request-proposal',
  eyebrow: 'Private & institutional supply',
  title: 'Request a supply proposal',
  standfirst:
    'Tell us about the programme you are running and the quantities you need, and we will come back with a written proposal.',
  docTitle: 'Request a supply proposal | Harvestfield Healthcare FZE',
  description:
    'Request a written Synera DuoForte supply proposal for a malaria prevention, CSR or community health programme in Nigeria.',
  fields: {
    organisation: 'Organisation name',
    contactName: 'Contact name',
    jobTitle: 'Job title',
    email: 'Business email',
    phone: 'Phone number',
    orgType: 'Organisation type',
    orgTypeOptions: ['Company', 'Foundation', 'NGO', 'Other'],
    purpose: 'Purpose',
    purposeOptions: ['CSR programme', 'Community health programme', 'Employee programme', 'Donation', 'Other'],
    quantity: 'Estimated number of nets required',
    location: 'State(s) / delivery location',
    deliveryDate: 'Required delivery date',
    notes: 'Additional information',
    notesPlaceholder: 'Anything else we should know about the programme, packaging or timelines.',
    select: 'Select one',
  },
  submit: 'Submit request',
  success: {
    title: 'Thank you. Your request is in',
    body: 'It has reached the team and we will come back to you with a proposal.',
  },
  error: {
    title: 'Something went wrong.',
    body: 'Your request was not sent. Please try again, or email us directly at',
  },
}

/* Closing band on every Phase 2 page, routing back to the form. */
export const pageCta = {
  title: 'Supplying a malaria programme, or distributing in Nigeria?',
  body: 'Tell us the volumes, the timelines and where the nets need to be.',
  cta: { label: 'Request supply', href: '/contact' },
}

/* News. Replaces the blog (specification, Part 3); /blog still redirects here
   so any link already shared keeps working. */
export const blog = {
  eyebrow: 'News',
  title: 'Milestones',
  intro: 'Production, malaria programme supply and the science behind dual-insecticide nets.',
  soonTitle: 'First entries coming soon',
  soonBody: 'We are setting this up. Check back shortly, or write to us if you have a question in the meantime.',
}
