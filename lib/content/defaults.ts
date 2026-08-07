/**
 * The approved prototype's copy, verbatim.
 *
 * Serves two purposes: it seeds Sanity on first run, and it acts as the render
 * fallback so the site never shows an empty section if a CMS field is cleared.
 * Editing content should happen in Studio, not here.
 */

export const DEFAULT_HOMEPAGE = {
  heroEyebrow: "Dubai  ·  Gurgaon  ·  Verified before recommended",
  heroLine1: "Most buyers are shown property.",
  heroLine2: "Almost none are shown the risk.",
  heroBody:
    "Twelve years selling property in a city where every rupee sits in escrow, every title is public and every promise is enforceable. We apply that same standard to everything we recommend — in Dubai, and now in Gurgaon.",
  heroStats: [
    { value: "12 yrs", countTo: 12, suffix: " yrs", label: "Operating in Dubai real estate" },
    // The prototype claimed "4,200+ keys handed over". The content plan flags
    // this as needing verification — whether it is a personal record or the
    // record of firms worked within. Left as a CMS field with a neutral label
    // until the owner confirms a defensible figure.
    { value: "—", label: "Transactions closed · confirm figure" },
    { value: "100%", label: "Escrow-protected on eligible Dubai transactions" },
    { value: "0", label: "Undisclosed fees. Ever." },
  ],
  marqueeItems: [
    "Payments tied to construction progress",
    "Title verified thrice",
    "Carpet-area pricing",
    "One fee, in writing",
    "Possession on time, in writing",
    "Exit planned before entry",
  ],

  chapter1Label: "Chapter I",
  chapter1Heading: "Where we come from, a handshake is law.",
  chapter1Body: [
    "In Dubai, a buyer's money never touches a developer's pocket directly. It sits in a government-regulated escrow account and is released only as construction milestones are certified. Every title is registered with the Land Department. Every off-plan sale is recorded before a single brick is laid. Every broker carries a licence number you can verify in seconds.",
    "We didn't just work inside that system — we were shaped by it. And after twelve years and thousands of handovers, one question kept following us home: why doesn't buying in India feel like this?",
  ],
  chapter1Cards: [
    { title: "Escrow law", body: "Buyer funds locked & milestone-released since 2007" },
    { title: "Public registry", body: "Every title & transaction on government record" },
    { title: "Licensed brokers", body: "Certified, numbered, accountable by law" },
  ],

  chapter2Label: "Chapter II",
  chapter2Heading: "Then we looked at what Indian buyers endure.",
  chapter2Body:
    "The largest purchase of a family's life — negotiated in whispers, priced on area they'll never occupy, paid into accounts nobody audits, delivered years late with a shrug. It isn't a market. It's a maze built to exhaust you into agreeing.",
  chapter2Stats: [
    {
      value: "5+ yrs",
      label:
        "of possession delay is routine on stalled projects — with the buyer's money already gone.",
    },
    {
      value: "~40%",
      label:
        'of a "super built-up" price can be walls, lobbies and air you will never live in.',
    },
    {
      value: "₹0",
      label:
        "is what a typical broker puts in writing. No fee disclosure, no fiduciary duty, no accountability.",
    },
    {
      value: "1 in 3",
      label:
        'resale deals hits a title surprise — dues, disputes or documents that were "coming tomorrow".',
    },
  ],
  chapter2Quote:
    "Buyers don't fear property. They fear the process. So we rebuilt the process.",
  chapter2QuoteAttrib: "— Founding note, Roar Realty India",

  standardLabel: "Chapter III",
  standardHeading: "The Roar Standard.",
  standardBody:
    "Six rules we brought from Dubai. Every transaction, every client, no exceptions. Each one is written into your agreement — not into a brochure.",
  pillars: [
    {
      num: "Rule 01",
      title: "Payments tied to progress",
      body: "In Dubai, buyer funds sit in a government-supervised escrow account and are released only against certified construction milestones — that is written into law, and we use it. Where a market offers no such mechanism, we negotiate the payment schedule with the developer directly, so your money still moves only as the building does.",
    },
    {
      num: "Rule 02",
      title: "Title verified thrice",
      body: "A 30-year ownership chain, an independent litigation scan, and a RERA cross-check — completed before a property earns a place on our shelf.",
    },
    {
      num: "Rule 03",
      title: "Carpet-area pricing",
      body: 'We quote on the area you will actually live in. The walls, lobbies and "super built-up" fog are itemised separately, in plain language.',
    },
    {
      num: "Rule 04",
      title: "One fee. In writing.",
      body: 'A single, fixed advisory fee disclosed before we begin. No side commissions, no builder kickbacks, no "PLC surprises" at the last table.',
    },
    {
      num: "Rule 05",
      title: "The digital paper trail",
      body: "Every document, signature, payment and phone commitment is logged in your private deal room. Yours to keep, forever, and to hold us to.",
    },
    {
      num: "Rule 06",
      title: "Possession on time",
      body: "For off-plan purchases we make sure the delay clause is real — a named amount, a trigger date and a payment method, not decoration. If the developer slips, we hold them to it on your behalf rather than leaving you to chase it alone.",
    },
  ],

  processEyebrow: "How we work with you",
  processHeading: "Five steps. Zero surprises. You always know what happens next.",
  steps: [
    {
      num: "I",
      title: "The brief",
      body: "One sitting — your budget, your non-negotiables, your timeline. We tell you honestly what the market can and cannot give you at that number.",
    },
    {
      num: "II",
      title: "The shortlist",
      body: "A maximum of five properties, each pre-screened against your brief. If nothing genuinely fits, we say so and wait. We do not pad shortlists.",
    },
    {
      num: "III",
      title: "The file",
      body: "For any property you like: complete title chain, encumbrances, dues, litigation history, developer record and true carpet-area maths — before you fall in love with it.",
    },
    {
      num: "IV",
      title: "The transaction",
      body: "Escrow where the market provides it, milestone-linked terms where it doesn't. We negotiate on record and manage stamp duty, registration and handover end to end. You sign; we sweat.",
    },
    {
      num: "V",
      title: "The aftercare",
      body: "Twenty-four months of post-possession support — mutation, society transfer, snag lists, leasing if you want it. The relationship outlives the deal.",
    },
  ],

  portfolioEyebrow: "Curated · Delhi NCR",
  portfolioHeading: "The portfolio.",
  portfolioBody:
    "Every listing below carries a complete Glass File — title chain, dues, litigation scan and builder record — before we let it on this page.",

  compareEyebrow: "Why buyers switch",
  compareHeading: "The old way, retired.",
  compareRows: [
    {
      label: "Fee",
      old: "Undisclosed. Often paid twice — by you and by the builder, to the same broker.",
      roar: "One fixed advisory fee, quoted in writing before work begins.",
    },
    {
      label: "Price basis",
      old: '"Super built-up" area — you pay for lobbies, walls and air.',
      roar: "Carpet area, with every other charge itemised in plain language.",
    },
    {
      label: "Your money",
      old: "Straight to the developer's account. Gone the moment it leaves yours.",
      roar: "Escrow where the market provides it; milestone-linked terms where it doesn't. Documented at every step.",
    },
    {
      label: "Documents",
      old: '"Sir, papers are coming tomorrow." Verified after you commit.',
      roar: "Full Glass File — title, dues, litigation — before you shortlist.",
    },
    {
      label: "Possession risk",
      old: "Yours alone. Delays are your problem, penalties unenforceable.",
      roar: "A delay clause with a real amount, trigger and method — and we enforce it for you.",
    },
    {
      label: "Exit",
      old: "Never discussed.",
      roar: "Exit liquidity assessed before you enter, not after.",
    },
    {
      label: "After the deal",
      old: "The number stops answering.",
      roar: "24 months of aftercare, on record, in your deal room.",
    },
  ],

  contactEyebrow: "Begin the conversation",
  contactHeading: "Your next address deserves a process worthy of it.",
  contactBody:
    "Tell us the budget, the objective and the timeline. Within 48 hours you get a shortlist — each with its verification file — and a fixed fee in writing. No obligation, no calls you didn't ask for.",

  /* ---- The two doors: Dubai primary, Gurgaon secondary ---- */
  doorsEyebrow: "Two markets, one standard",
  doorsHeading: "Where are you buying?",
  doors: [
    {
      market: "Dubai",
      heading: "Investing in Dubai from India",
      body: "Escrow law, a public title registry and licensed brokers make Dubai one of the most verifiable property markets in the world. That does not make every project a good investment. We filter on location demand, developer record, payment structure, rental logic, exit liquidity and your actual objective — then tell you plainly whether it fits.",
      cta: "Explore Dubai advisory",
      href: "/dubai",
    },
    {
      market: "Gurgaon & NCR",
      heading: "Buying in Gurgaon & NCR",
      body: "India's market gives you the same information Dubai does — title chains, RERA records, mutation status, encumbrance certificates. It just scatters them across five places and hopes you won't look. We look. Before you shortlist, not after you've paid a token.",
      cta: "Explore Gurgaon advisory",
      href: "/gurgaon",
    },
  ],

  /* ---- Founder block ---- */
  founderHeading: "Twelve years in Dubai. Now building the same standard in Gurgaon.",
  founderBody:
    "I spent twelve years in a market where verification is built into the law. Coming back, the gap was obvious — the information exists here too, it is just scattered, and almost nobody assembles it before a buyer commits. That assembly is the work. Everything else is showing property.",
  founderCta: "Read the full story",

  /* ---- How we choose what to show you ---- */
  frameworkEyebrow: "How we choose what to show you",
  frameworkHeading: "Three questions, in this order.",
  frameworkBody:
    "Most agents start with what they have to sell. We start with whether it should be sold to you at all.",
  framework: [
    {
      num: "01",
      title: "Understand the client",
      intro: "Before showing any property, we first understand:",
      items: [
        "Budget",
        "Goal",
        "Timeline",
        "Risk comfort",
        "Rental vs capital growth",
        "Holding period",
        "Exit expectation",
      ],
      line: "We don't start with the project. We start with the client.",
    },
    {
      num: "02",
      title: "Filter the opportunity",
      intro: "Then we evaluate each property through our investment lens:",
      items: [
        "Location demand",
        "Developer credibility",
        "Payment plan quality",
        "Rental potential",
        "Capital appreciation potential",
        "Exit liquidity",
        "Risk level",
        "Client fit",
      ],
      line: "We don't show everything. We filter what actually makes sense.",
    },
    {
      num: "03",
      title: "Plan entry, hold & exit",
      intro: "Finally, we build the strategy:",
      items: [
        "Why to enter",
        "How long to hold",
        "Rental or resale plan",
        "Risk and downside",
        "Best exit possibility",
        "Conservative, realistic and optimistic scenarios",
      ],
      line: "Buying is easy. The real strategy is knowing how to hold and exit.",
    },
  ],
};

/** Sitewide investment disclaimer required by the content plan. */
export const INVESTMENT_DISCLAIMER =
  "All investment discussion, rental estimates, resale expectations and appreciation projections are based on available information and stated market assumptions. Returns are not guaranteed. Market conditions change. Buyers should independently verify all legal, financial, tax and contractual details before any purchase decision.";

/**
 * Placeholder testimonials only.
 *
 * These are structural examples so the slider has something to render — every
 * one is flagged `illustrative`, which shows a visible marker and keeps the
 * section out of Google. Replace them with real, consented client quotes; the
 * content plan lists this as a pre-launch blocker.
 */
export const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "They talked me out of the unit I walked in wanting. The file showed a dues problem nobody else had mentioned. That is when I understood what I was paying for.",
    name: "Placeholder — replace with a real client",
    role: "First-time buyer",
    region: "India",
    agent: "",
  },
  {
    quote:
      "I asked for projected returns. What I got instead was three scenarios with the assumptions written underneath each one, including the one where I lose money.",
    name: "Placeholder — replace with a real client",
    role: "Off-plan investor",
    region: "Dubai",
    agent: "",
  },
  {
    quote:
      "The exit conversation happened before the entry conversation. No one had ever done that with me before.",
    name: "Placeholder — replace with a real client",
    role: "NRI investor",
    region: "Dubai",
    agent: "",
  },
];

/** Regions the testimonial slider can filter by. */
export const TESTIMONIAL_REGIONS = [
  "Dubai",
  "India",
  "Australia",
  "Canada",
  "Europe",
  "Saudi Arabia",
  "United Kingdom",
  "United States",
  "Singapore",
] as const;

/** The prototype's nine listings, carried over as clearly-marked samples. */
export const DEFAULT_PROPERTIES = [
  {
    name: "The Camellias Residence",
    city: "Gurugram",
    locality: "Golf Course Road",
    priceCr: 14.5,
    propertyType: "Apartments",
    tag: "Ultra-luxury",
    bedrooms: 4,
    carpetArea: 3850,
    possessionStatus: "Ready to move",
    escrowProtected: true,
    featured: true,
  },
  {
    name: "Aravalli Crest Villa",
    city: "Gurugram",
    locality: "Sector 59",
    priceCr: 9.2,
    propertyType: "Villas",
    tag: "Glass File ready",
    bedrooms: 5,
    plotArea: 5200,
    possessionStatus: "Ready to move",
    escrowProtected: true,
    featured: true,
  },
  {
    name: "Meridian One, Tower B",
    city: "Gurugram",
    locality: "Dwarka Expressway",
    priceCr: 2.4,
    propertyType: "Off-plan",
    tag: "Escrow-protected",
    bedrooms: 3,
    carpetArea: 1620,
    possessionStatus: "Under construction",
    possessionDate: "Q4 2027",
    escrowProtected: true,
    featured: true,
  },
  {
    name: "Lutyens Court Penthouse",
    city: "New Delhi",
    locality: "Chanakyapuri",
    priceCr: 22,
    propertyType: "Apartments",
    tag: "Ultra-luxury",
    bedrooms: 5,
    carpetArea: 6100,
    possessionStatus: "Ready to move",
    escrowProtected: true,
    featured: true,
  },
  {
    name: "Horizon Trade Suites",
    city: "Gurugram",
    locality: "Golf Course Extension Road",
    priceCr: 3.8,
    propertyType: "Commercial",
    tag: "Pre-leased 7.1%",
    carpetArea: 2400,
    possessionStatus: "Ready to move",
    escrowProtected: true,
    featured: true,
  },
  {
    name: "Yamuna Greens Estate",
    city: "Noida",
    locality: "Sector 22D, YEIDA",
    priceCr: 1.6,
    propertyType: "Plots",
    tag: "Clear title × 30 yrs",
    plotArea: 300,
    areaUnit: "sq yd",
    possessionStatus: "Registry-ready",
    featured: true,
  },
  {
    name: "Ambience Sky Residences",
    city: "Gurugram",
    locality: "NH-8",
    priceCr: 5.6,
    propertyType: "Apartments",
    tag: "Glass File ready",
    bedrooms: 4,
    carpetArea: 2980,
    possessionStatus: "Ready to move",
    escrowProtected: true,
  },
  {
    name: "Cedar Row Villas",
    city: "Noida",
    locality: "Sector 150",
    priceCr: 4.1,
    propertyType: "Villas",
    tag: "Escrow-protected",
    bedrooms: 4,
    plotArea: 3600,
    possessionStatus: "Under construction",
    possessionDate: "Q2 2027",
    escrowProtected: true,
  },
  {
    name: "Noida One Business Bay",
    city: "Noida",
    locality: "Sector 62",
    priceCr: 1.9,
    propertyType: "Commercial",
    tag: "Pre-leased 6.4%",
    carpetArea: 1150,
    possessionStatus: "Ready to move",
  },
];

export const DEFAULT_FAQS = [
  {
    question: "What exactly is a Glass File?",
    answer:
      "A complete due-diligence pack we prepare before you shortlist a property: the 30-year title chain, an independent litigation scan, outstanding dues, the encumbrance position, the builder's delivery record, and the true carpet-area maths behind the quoted price. You get it before you fall in love with a place, not after you've committed.",
    category: "Buying",
    order: 1,
  },
  {
    question: "Do you hold my money in escrow?",
    answer:
      "No — and be careful of any advisor who says they do. In Dubai, escrow is a statutory mechanism: buyer funds sit in a government-supervised account and are released against certified construction milestones. We work within that system; we don't operate it. In India, RERA requires 70% of buyer funds for a registered project to sit in a designated project account. Where a market offers no such mechanism at all, we negotiate the payment schedule directly with the developer so your money still moves only as the building does. Your funds never pass through us in any market.",
    category: "Escrow & payments",
    order: 2,
  },
  {
    question: "Do you guarantee returns?",
    answer:
      "No. We do not guarantee rental income, appreciation or resale value, and we would be cautious of anyone who does. We give you research, the assumptions written down, three scenarios — conservative, realistic and optimistic — and an explicit risk view, so you decide with the downside in front of you.",
    category: "Buying",
    order: 3,
  },
  {
    question: "Why not just buy directly from the developer?",
    answer:
      "A developer can explain their own project accurately. What they cannot tell you is how it compares to three alternatives, whether the unit size holds resale demand, or whether something else fits your objective better. That comparison is the service.",
    category: "Buying",
    order: 4,
  },
  {
    question: "Why do you talk so much about exit?",
    answer:
      "Because a property can look profitable and still have no buyer when you need one. Entry price is a fact; exit is an assumption. We would rather test that assumption before your money is in it.",
    category: "Buying",
    order: 8,
  },
  {
    question: "What if nothing fits my brief?",
    answer:
      "We tell you that, and we wait. A padded shortlist is how buyers end up with something that was never right for them. If the market cannot deliver at your number, that is the useful answer.",
    category: "Buying",
    order: 9,
  },
  {
    question: "What do you charge, and who pays you?",
    answer:
      "One fixed advisory fee, agreed in writing before we start work. We do not take side commissions or builder kickbacks — if a developer offers one, it is disclosed to you and adjusted against your fee.",
    category: "Fees",
    order: 3,
  },
  {
    question: "Why do you quote on carpet area?",
    answer:
      "Because it is the area you will actually live in. Super built-up figures can include lobbies, shafts, walls and common areas — as much as 40% of what you are being asked to pay for. We quote carpet area and itemise every other charge separately, in plain language.",
    category: "Buying",
    order: 4,
  },
  {
    question: "Do you work with NRI buyers?",
    answer:
      "Extensively — it is where we started. We handle remote viewings, documentation, power of attorney, FEMA-compliant payment routing and registration, so you can complete a purchase without flying in.",
    category: "Buying",
    order: 5,
  },
  {
    question: "What happens after possession?",
    answer:
      "Twenty-four months of aftercare: mutation, society transfer, snag lists, and leasing if you want it. Every commitment stays logged in your deal room so you can hold us to it.",
    category: "Aftercare",
    order: 6,
  },
];
