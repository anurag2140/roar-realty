/**
 * Copy for the two market pages, taken from the owner's content plan.
 *
 * The structure matters as much as the words: every section here has a
 * two-sided shape — what the market protects you from, and what it doesn't.
 * That second half is the thing no competitor publishes, and it is the whole
 * reason the brand's voice works.
 */

export const DUBAI = {
  eyebrow: "Dubai · 60–70% of what we do",
  heading: "Dubai is verifiable. That doesn't make every project a good investment.",
  intro:
    "Escrow law since 2007. Every title on public record. Every broker licensed and traceable. Dubai removed most of the fraud risk Indian buyers are used to fearing — and in doing so, moved the risk somewhere else entirely: choosing wrong. Oversupply, weak exit liquidity, service charges that eat the yield, a payment plan that looks generous and isn't. Those risks are real, and no registry protects you from them.",

  protectsHeading: "What Dubai actually protects you from",
  protects: [
    {
      title: "Escrow law",
      body: "Buyer funds sit in a supervised account, released against certified construction milestones. Not to the developer, not to us.",
    },
    {
      title: "Public registry",
      body: "Every title and transaction on government record, searchable by anyone.",
    },
    {
      title: "Licensed brokers",
      body: "Numbered, certified and accountable by law. You can verify a licence in seconds.",
    },
    {
      title: "Mandatory registration",
      body: "Off-plan projects must be registered before a single unit can legally be sold.",
    },
  ],

  doesNotHeading: "What it does not protect you from",
  doesNot: [
    "Oversupply in high-density mid-market areas — supply pressure is concentrated, not uniform.",
    "Weak exit liquidity. A unit can be legally perfect and still have no buyer at your price.",
    "Service charges quietly consuming the rental yield you were shown.",
    "Payment plans structured for the developer's cash flow, not yours.",
    "Buying the segment that is oversupplied rather than the one that is scarce.",
  ],

  filterHeading: "The eight-point filter",
  filterIntro:
    "Every property we consider is run through the same eight checks before it reaches you. If it fails on the ones that matter for your objective, you never see it.",
  filter: [
    {
      title: "Location demand",
      body: "Real tenant and buyer demand — connectivity, employment hubs, community maturity, upcoming supply.",
    },
    {
      title: "Developer credibility",
      body: "Delivery history, construction quality, and the track record on previous handovers.",
    },
    {
      title: "Payment plan quality",
      body: "Whether the schedule serves your cash flow or the developer's.",
    },
    {
      title: "Rental potential",
      body: "Tenant profile, occupancy, service charges and competing supply — not the brochure yield.",
    },
    {
      title: "Capital appreciation",
      body: "Entry price against area trend, scarcity, infrastructure and future supply.",
    },
    {
      title: "Exit liquidity",
      body: "Who buys this from you later, and how long it takes them to do it.",
    },
    {
      title: "Risk score",
      body: "Oversupply, delay, pricing, liquidity and market-cycle risk, stated plainly.",
    },
    {
      title: "Client fit",
      body: "Whether a genuinely good property is a good property for you specifically.",
    },
  ],

  scenariosHeading: "Scenarios, not promises",
  scenariosBody:
    "We do not say “this will return X.” We show three views — conservative, realistic and optimistic — with the assumptions behind each one written down. You see the downside as clearly as the upside, which is the only honest way to present an asset that can fall.",

  servicesHeading: "How we work in Dubai",
  services: [
    {
      title: "Off-plan advisory",
      who: "Buyers considering new launches",
      body: "Whether the project makes sense beyond the brochure — developer record, handover risk, resale restrictions and exit.",
    },
    {
      title: "Ready property advisory",
      who: "Rental income and end-use buyers",
      body: "Real occupancy, real service charges and real tenant demand — before you count the yield.",
    },
    {
      title: "Luxury & branded residences",
      who: "Premium and high-value buyers",
      body: "Lifestyle understanding with investment logic — scarcity, positioning and long-term value.",
    },
    {
      title: "Portfolio strategy",
      who: "Repeat and multi-asset investors",
      body: "Allocation across ready, off-plan, income and growth — with exit timing planned from the start.",
    },
    {
      title: "Resale & exit review",
      who: "Existing Dubai property owners",
      body: "Whether your property has real resale demand, or only paper value.",
    },
  ],

  mistakesHeading: "Dubai is not Indian real estate with better weather",
  mistakesIntro:
    "In India, property is bought on land value, familiarity and long-term emotional holding. Nobody sells the house. In Dubai, property is a timing, liquidity and strategy asset — buyers change, supply moves, and the exit is a real event you should plan for on the day you enter. Indian buyers who apply Indian instincts to Dubai make predictable, expensive mistakes.",
  mistakes: [
    "Choosing on the brochure's finish rather than the area's demand",
    "Letting an attractive payment plan decide the purchase",
    "Comparing Dubai to India — same instincts, wrong market",
    "Ignoring service charges when calculating yield",
    "Treating launch hype as evidence of demand",
    "Never asking who buys this unit at exit",
    "Assuming the popular project is the right project",
  ],

  questionsHeading: "The practical questions Indian buyers actually ask",
  questions: [
    "How money moves from India to Dubai legally — LRS limits and TCS thresholds",
    "What the Golden Visa actually requires, and what it does not grant",
    "Whether you can buy remotely without flying, and what that process looks like",
    "How rental income is treated, and where it can be held",
    "What happens at handover if you are not in the country",
  ],
  questionsNote:
    "We answer these with current figures rather than remembered ones. LRS limits, TCS rates and Golden Visa thresholds change — often at the Union Budget — so we verify them at the time of your transaction rather than quoting a number from a blog post.",
};

export const GURGAON = {
  eyebrow: "Gurgaon & NCR · the local practice",
  heading:
    "The information exists here too. It is just scattered — and nobody assembles it before you pay.",
  intro:
    "Dubai puts every title, transaction and owner on one public record. India has the same information across five systems that do not talk to each other — the registry, the mutation record, RERA, the revenue courts and the licensing authority. That gap is not a legal problem. It is a time problem, and time is what makes buyers skip verification. So we do the assembling.",

  verifyHeading: "What we verify before you shortlist",
  verify: [
    {
      check: "Title chain — 30 years",
      reveals: "Every ownership transfer, in sequence",
      matters: "Breaks in the chain surface here or never",
    },
    {
      check: "Mutation status (intkal)",
      reveals: "Whether the revenue record shows the current owner",
      matters:
        "The registry alone does not update it — the single most common red flag in Haryana",
    },
    {
      check: "Encumbrance certificate",
      reveals: "Pending loans, mortgages and disputes",
      matters: "A clean-looking deed can still carry an existing loan",
    },
    {
      check: "RERA registration",
      reveals: "Project registration and declared completion date",
      matters: "The date the builder gave the government, not the one sales gave you",
    },
    {
      check: "DTCP licence / HSVP allotment",
      reveals: "Whether the colony is legally licensed",
      matters: "Applies specifically to Gurgaon plots and licensed colonies",
    },
    {
      check: "Litigation scan",
      reveals: "Revenue and civil court cases on the property",
      matters: "Public record, and rarely checked",
    },
    {
      check: "Carpet area verification",
      reveals: "Actual usable area against quoted area",
      matters: "Super built-up can be 30–40% of what you pay for",
    },
  ],

  askHeading: "What Gurgaon buyers should ask, and usually don't",
  ask: [
    "Is this quoted on carpet area or super built-up — and what is the actual usable number?",
    "What completion date is registered with RERA, and does it match what I was told?",
    "Has mutation been completed, or does the revenue record still show the previous owner?",
    "Does the delay penalty clause name an amount, a trigger date and a payment method — or is it decorative?",
    "How many units are genuinely unsold, according to the RERA filing rather than the sales desk?",
  ],

  servicesHeading: "How we work in NCR",
  services: [
    {
      title: "Buyer advisory",
      who: "First-time and upgrading buyers in NCR",
      body: "Full verification before shortlist, carpet-area pricing, and one disclosed fee.",
    },
    {
      title: "Resale due diligence",
      who: "Anyone buying a secondary-market property",
      body: "Title, mutation, encumbrance and litigation — assembled before your token, not after.",
    },
    {
      title: "NRI buying in India",
      who: "Indians abroad buying back home",
      body: "Remote verification, a documented process, and someone physically at the site.",
    },
  ],
};
