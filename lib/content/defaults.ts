/**
 * The approved prototype's copy, verbatim.
 *
 * Serves two purposes: it seeds Sanity on first run, and it acts as the render
 * fallback so the site never shows an empty section if a CMS field is cleared.
 * Editing content should happen in Studio, not here.
 */

export const DEFAULT_HOMEPAGE = {
  heroEyebrow: "Dubai  →  Delhi NCR  ·  Est. discipline, imported",
  heroLine1: "India, meet",
  heroLine2: "the Dubai standard.",
  heroBody:
    "For twelve years we sold property in a city where every rupee sits in escrow, every title is public, and every promise is enforced. Now we're bringing that discipline home — so buying in India finally feels safe.",
  heroStats: [
    { value: "12 yrs", countTo: 12, suffix: " yrs", label: "Operating in Dubai" },
    { value: "4,200+", countTo: 4200, suffix: "+", label: "Keys handed over" },
    { value: "100%", label: "Escrow-protected deals" },
    { value: "0", label: "Hidden charges. Ever." },
  ],
  marqueeItems: [
    "Escrow-protected payments",
    "Title verified thrice",
    "Carpet-area pricing",
    "One fee, in writing",
    "Possession-date guarantee",
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
      title: "Escrow-protected payments",
      body: "Your money moves into a supervised escrow account and is released only against verified milestones. Not to us. Not to the seller. Not until it should.",
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
      title: "Possession-date guarantee",
      body: "For off-plan purchases, delay penalties are written into your agreement — and if the developer defaults on them, we pay you first and chase them second.",
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
      title: "The Glass File",
      body: "For any property you like: complete title chain, encumbrances, dues, litigation history, builder track record and true carpet-area math — before you fall in love with it.",
    },
    {
      num: "IV",
      title: "Escrow & registration",
      body: "We open the escrow, negotiate on record, and manage stamp duty, registration and handover end-to-end. You sign; we sweat.",
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
      old: "Direct to the builder's account. Gone the moment it leaves yours.",
      roar: "Held in supervised escrow, released against verified milestones.",
    },
    {
      label: "Documents",
      old: '"Sir, papers are coming tomorrow." Verified after you commit.',
      roar: "Full Glass File — title, dues, litigation — before you shortlist.",
    },
    {
      label: "Possession risk",
      old: "Yours alone. Delays are your problem, penalties unenforceable.",
      roar: "Delay penalties written into the agreement. We pay first, chase later.",
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
    "Tell us what you're looking for. Within 48 hours you'll receive a curated shortlist — each with its Glass File — and a fixed, written fee. No obligation, no follow-up calls you didn't ask for.",
};

export const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "I bought two apartments in Dubai through them without flying in once. When they opened in Gurgaon, I didn't interview anyone else.",
    name: "Rohit Khanna",
    role: "NRI investor · Dubai & Gurugram",
  },
  {
    quote:
      "They showed me why NOT to buy the flat I came in wanting. The file had a dues problem no one else had mentioned. That's when I knew.",
    name: "Priya Raghavan",
    role: "First-time buyer · Noida",
  },
  {
    quote:
      "The escrow felt over-engineered until my developer slipped a quarter. The penalty landed in my account before I'd even called them.",
    name: "Sameer & Aditi Bhalla",
    role: "Off-plan buyers · Dwarka Expressway",
  },
];

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
    question: "How does escrow protection work in India?",
    answer:
      "RERA requires 70% of buyer funds for a registered project to sit in a designated project account, released against certified construction progress. We structure payments through that mechanism wherever it applies, and for resale transactions we use a supervised escrow arrangement so funds move only when documents and registration are in order.",
    category: "Escrow & payments",
    order: 2,
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
