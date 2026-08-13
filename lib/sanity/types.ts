import type { PortableTextBlock } from "sanity";
import type { SanityImage } from "./image";

export type Seo = {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
  noIndex?: boolean;
};

export type Builder = {
  _id: string;
  name: string;
  slug?: string;
  logo?: SanityImage;
  established?: number;
  description?: string;
  projectsDelivered?: number;
};

export type Locality = {
  _id: string;
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  blurb?: string;
  image?: SanityImage;
  body?: PortableTextBlock[];
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImage;
  bio?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  reraId?: string;
  order?: number;
};

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  region?: string;
  market?: string;
  agent?: string;
  avatar?: SanityImage;
  rating?: number;
  illustrative?: boolean;
  order?: number;
};

export type Door = {
  _key: string;
  market: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
};

export type FrameworkStep = {
  _key: string;
  num: string;
  title: string;
  intro?: string;
  items: string[];
  line: string;
};

/** The differentiator: due-diligence facts shown on every listing. */
export type GlassFile = {
  titleChainYears?: number;
  litigationScan?: boolean;
  encumbranceChecked?: boolean;
  reraVerified?: boolean;
  reraNumber?: string;
  builderRecordChecked?: boolean;
  duesCleared?: boolean;
  notes?: string;
};

export type PriceBreakdownRow = {
  _key: string;
  label: string;
  amount?: string;
  note?: string;
};

export type Property = {
  _id: string;
  name: string;
  slug: string;
  tag?: string;
  propertyType: string;
  /** Price in ₹ crore. Null means "price on request". */
  priceCr: number | null;
  priceOnRequest?: boolean;
  city: string;
  citySlug?: string;
  locality?: string;
  localitySlug?: string;
  address?: string;
  geo?: { lat: number; lng: number };
  bedrooms?: number;
  bathrooms?: number;
  carpetArea?: number;
  superBuiltUpArea?: number;
  plotArea?: number;
  areaUnit?: string;
  possessionStatus?: string;
  possessionDate?: string;
  facing?: string;
  floor?: string;
  totalFloors?: number;
  furnishing?: string;
  parking?: number;
  amenities?: string[];
  images?: SanityImage[];
  floorPlans?: SanityImage[];
  brochureUrl?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  escrowProtected?: boolean;
  featured?: boolean;
  illustrative?: boolean;
  summary?: string;
  body?: PortableTextBlock[];
  highlights?: string[];
  nearby?: { _key: string; label: string; distance: string }[];
  priceBreakdown?: PriceBreakdownRow[];
  glassFile?: GlassFile;
  builder?: Builder;
  agent?: TeamMember;
  seo?: Seo;
  publishedAt?: string;
  /** Derived server-side for card display. */
  spec1?: string;
  spec2?: string;
};

export type Insight = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover?: SanityImage;
  category?: string;
  readingMinutes?: number;
  author?: TeamMember;
  body?: PortableTextBlock[];
  seo?: Seo;
  publishedAt: string;
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
};

export type Pillar = {
  _key: string;
  num: string;
  title: string;
  body: string;
};

export type ProcessStep = {
  _key: string;
  num: string;
  title: string;
  body: string;
};

export type CompareRow = {
  _key: string;
  label: string;
  old: string;
  roar: string;
};

export type Stat = {
  _key: string;
  value: string;
  /** When set, the figure counts up from zero on scroll. */
  countTo?: number;
  suffix?: string;
  label: string;
};

export type Homepage = {
  heroEyebrow?: string;
  heroLine1?: string;
  heroLine2?: string;
  heroBody?: string;
  heroStats?: Stat[];
  marqueeItems?: string[];
  chapter1Label?: string;
  chapter1Heading?: string;
  chapter1Body?: string[];
  chapter1Cards?: { _key: string; title: string; body: string }[];
  chapter2Label?: string;
  chapter2Heading?: string;
  chapter2Body?: string;
  chapter2Stats?: Stat[];
  chapter2Quote?: string;
  chapter2QuoteAttrib?: string;
  standardLabel?: string;
  standardHeading?: string;
  standardBody?: string;
  pillars?: Pillar[];
  processEyebrow?: string;
  processHeading?: string;
  steps?: ProcessStep[];
  portfolioEyebrow?: string;
  portfolioHeading?: string;
  portfolioBody?: string;
  compareEyebrow?: string;
  compareHeading?: string;
  compareRows?: CompareRow[];
  contactEyebrow?: string;
  contactHeading?: string;
  contactBody?: string;
  doorsEyebrow?: string;
  doorsHeading?: string;
  doors?: Door[];
  founderHeading?: string;
  founderBody?: string;
  founderCta?: string;
  frameworkEyebrow?: string;
  frameworkHeading?: string;
  frameworkBody?: string;
  framework?: FrameworkStep[];
  seo?: Seo;
};

export type SiteSettings = {
  title?: string;
  logo?: SanityImage;
  phone?: string;
  whatsapp?: string;
  whatsappUae?: string;
  whatsappDesks?: { _key: string; label: string; number: string }[];
  email?: string;
  emailIndia?: string;
  officeAddress?: string;
  reraNumber?: string;
  /** Hides the "registration pending" marker while the number is being issued. */
  hideReraNotice?: boolean;
  /** Master switch for the homepage portfolio grid and the Properties nav item. */
  showProperties?: boolean;
  foundedYear?: number;
  legalEntity?: string;
  cin?: string;
  socials?: { _key: string; platform: string; url: string }[];
  goldTone?: string;
  effects3d?: boolean;
  grainOverlay?: boolean;
  announcement?: { enabled?: boolean; text?: string; href?: string };
  exitIntent?: {
    enabled?: boolean;
    heading?: string;
    body?: string;
    cta?: string;
  };
  footerNote?: string;
  defaultSeo?: Seo;
};
