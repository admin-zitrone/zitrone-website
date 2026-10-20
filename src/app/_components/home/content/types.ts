export type Accent = 'dining' | 'cafe' | 'pantry' | 'catering'

export type ServiceTheme = 'dining' | 'cafe' | 'pantry' | 'coffee' | 'grab-go' | 'catering'

export type FeatureIconName =
  | 'heart'
  | 'spark'
  | 'trend'
  | 'clock'
  | 'briefcase'
  | 'people'
  | 'shield'
  | 'chart'
  | 'chat'
  | 'calendar'
  | 'coffee'
  | 'utensils'
  | 'drink'
  | 'chef'
  | 'leaf'
  | 'fruit'
  | 'machine'
  | 'water'
  | 'cart'

export type RevealWord = {
  text: string
  accent?: boolean
}

export type NavItem = {
  href: string
  label: string
}

export type LogoFit = 'wide' | 'balanced' | 'compact'

export type HeroLogo = {
  id: string
  src: string
  /** Optional B&W/outline artwork used only where logos render as a single-color
   * silhouette (the home hero ribbon). Falls back to `src` when absent. */
  monoSrc?: string
  alt: string
  fit?: LogoFit
  scale?: number
}

export type ServiceCard = {
  title: string
  eyebrow: string
  accent: Accent
  image: string
  copy: string
  href?: string
  ctaLabel?: string
  relatedLinks?: NavItem[]
}

export type ServicesOrbitItem = {
  title: string
  theme: ServiceTheme
  image: string
  copy: string
}

export type ServiceLink = {
  label: string
  shortLabel: string
  href: string
}

export type SystemTab = {
  key: string
  icon?: FeatureIconName
  stage?: string
  stageCopy?: {
    before: string
    highlight: string
    after?: string
  }
  title: string
  copy: string
  panelTitle: string
  panelCopy: string
  image: string
  tone?: 'ocean' | 'natural' | 'sage' | 'lime'
  /* A small product-style card laid over the active step image. Each kind
     draws the step as a piece of the service (the day's rhythm, the menu, the
     live service, the score), so the photo is illustrated, not captioned. */
  visualWidget?: SystemTabWidget
  /* One short lime tag pinned to the opposite corner of the photo. */
  visualBadge?: { icon: ChipIconName; label: string }
}

/** Kept separate from FeatureIconName: that union is mirrored in the Payload
 *  schema, and these marks only ever appear on the operating-step visual. */
export type ChipIconName = FeatureIconName | 'star' | 'check'

export type SystemTabWidget =
  | {
      /** One client's agreed operation (proposal evidence): meals per weekday
       *  walked day by day as a glass calendar, two service windows below. */
      kind: 'profile'
      mealsUnit: string
      days: { label: string; name: string; value: number | null }[]
      offLabel: string
      /** The service day as clock checkpoints (minutes from midnight), from
       *  the client's agreed hours: the card's clock ticks between them. */
      schedule: { minutes: number; label: string }[]
    }
  | {
      /** One real published day, alternating between its meals on its own.
       *  Every dish and kcal figure comes from that day's menu. */
      kind: 'menu'
      title: string
      meta: string
      /** Meal names for the switch on the card (e.g. Desayuno, Comida). */
      meals: string[]
      /** Dishes from one real published menu (Santander, 10 Aug 2026), shown
       *  one at a time. kcal and allergens are that menu's own figures; the
       *  photo is of that dish; `meal` is the index into `meals` it lights. */
      dishes: {
        meal: number
        name: string
        kcal: number
        tags: string[]
        description: string
        image: string
      }[]
    }
  | {
      kind: 'service'
      /** Short month labels under the monthly charts. */
      months: string[]
      /** Service levels from a client QBR, one per view, rotating: a label
       *  with its period, the value and a small chart. */
      metrics: {
        label: string
        value: number
        decimals?: number
        prefix?: string
        suffix?: string
        chart:
          /** One column per month, the last one highlighted. */
          | { kind: 'months'; values: number[] }
          /** One check per month: a count that stayed at zero. */
          | { kind: 'zero' }
          /** A single track filled to `fill` (0-1). */
          | { kind: 'meter'; fill: number }
      }[]
    }
  | {
      kind: 'score'
      title: string
      /** 0-100, drawn as the ring. */
      value: number
      valueLabel: string
      delta: string
      /** Monthly series from the same QBR: a line for the scorecard, bars for
       *  the wait time. Values are the raw monthly figures. */
      trend: { label: string; valueLabel: string; caption: string; points: number[]; min: number; max: number }
      bars: { label: string; valueLabel: string; caption: string; values: number[] }
      /** Real diner messages from a client channel (QBR evidence). First
       *  name + initial only, and never the client's name. */
      channel: string
      messages: { author: string; text: string }[]
    }

export type BentoBox = { label: string; size: 'sm' | 'md' | 'lg' }

export type BentoCard =
  | {
      variant: 'photo'
      title: string
      sub?: string
      image: string
      alt: string
      imageFit?: 'cover' | 'contain'
      tone?: 'natural' | 'slate' | 'green'
    }
  | { variant: 'clock'; title: string; sub?: string; tone: 'slate' }
  | {
      variant: 'logos'
      title: string
      sub?: string
      tone: 'green' | 'slate'
      stats?: Array<{ value: string; label: string }>
      hideLogos?: boolean
    }
  | { variant: 'specialties'; title: string; sub?: string; boxes: BentoBox[] }
  | {
      variant: 'studies'
      title: string
      sub?: string
      image: string
      alt: string
      imageFit?: 'cover' | 'contain'
      tone?: 'natural' | 'slate' | 'green'
    }
  | { variant: 'plain'; title: string; sub?: string; tone: 'natural' | 'ocean' }

export type ServiceLayer = {
  title: string
  /** Compact label for the tab strip, when the full title is too long to scan. */
  shortTitle?: string
  theme: ServiceTheme
  image: string
  copy?: string
  href?: string
  ctaLabel?: string
  features: Array<{
    title: string
    text: string
    icon: FeatureIconName
  }>
}

export type ProfilerOption = {
  label: string
  value: string
}

export type ProfilerItem = {
  id: string
  title: string
  text: string
}

export type ClientStory = {
  name: string
  label: string
  role: string
  logo: string
  logoFit?: LogoFit
  logoScale?: number
  image: string
  imageAlt: string
  /* Site the photo was taken at; shown as "Client · Location" when the story
     photo is used as a section background. Left empty until confirmed. */
  location?: string
  /* The photo shows the same space as a home hero slide, so sections that sit
     under the hero (the services cover) leave it out to avoid a repeat. */
  repeatsHero?: boolean
  quote: string
  quoteHighlight?: string
}

export type FaqItem = {
  question: string
  answer: string[]
}

export type FooterColumn = {
  label: string
  links: NavItem[]
}

export type Cta = {
  label: string
  href: string
}

export type FooterSocialLink = {
  icon: 'linkedin' | 'instagram' | 'facebook' | 'twitter'
  label: string
  href: string
}

export type SectionHead = {
  kicker?: string
  titleAriaLabel: string
  titleWords: RevealWord[]
  copy?: string
}

export type ServicesSection = SectionHead & {
  /* Copy under the heading on the services cover. Falls back to `copy`. */
  coverCopy?: string
  ctaPrimary: Cta
  ctaSecondary: Cta
}

export type ProofSection = {
  kicker?: string
  clientLogosAriaLabel: string
  headingAriaLabel: string
  headingLead: string
  headingAccent: string
  headingTrail?: string
  copy: string
}

export type FeaturedMediaSection = {
  label: string
  ariaLabel: string
  logos: HeroLogo[]
}

export type StoriesSection = SectionHead & {
  cta: Cta
  panelCta: Cta
}

export type FaqSection = {
  heading: string
  headingLead?: string
  headingMuted?: string
  cta: Cta
  ctaTitle?: string
  ctaCopy?: string
}

export type FooterSection = {
  ariaLabel: string
  tagline: string
  taglineEmphasis?: string
  ctaPrimary: Cta
  ctaSecondary: Cta
  contactLabel: string
  address: string[]
  contactLinks: Cta[]
  legal: {
    copyright: string
    links: Cta[]
  }
  socialsLabel: string
  socialLinks: FooterSocialLink[]
}

/** Universal Zitrone promises. These apply across every service vertical. */
export type HeroPillar = 'nourishment' | 'care' | 'connection' | 'momentum'

export type HeroFrame = {
  /** Strategic promise represented by both this photo and its headline verb. */
  pillar: HeroPillar
  accentWord: string
  image: string
  alt: string
}

export type HeroSectionContent = {
  navAriaLabel: string
  mobileNavAriaLabel: string
  menuOpenLabel: string
  menuCloseLabel: string
  cta: Cta
  title: string
  titleEmphasis?: string
  /** Frame 0 must use the word inside `title`, so server output and first paint agree. */
  frames: HeroFrame[]
  copy: string
  /** Phone-only lede (under 40rem). Must be a trim of `copy`, not new claims. */
  copyShort?: string
  ribbonLabel: string
  /** Replaces `ribbonLabel` with a count-up figure when set. `value` must be a
      real, sourced figure (people served per day), never an estimate. */
  ribbonStat?: { value: number; label: string }
  marqueeAriaLabel: string
}

export type SiteMeta = {
  title: string
  description: string
  siteName: string
  ogImage: string
}

export type ServicesCarouselLabels = {
  regionLabel: string
  previous: string
  next: string
  progressLabel: string
  slideTemplate: string
  viewService: string
  logosAriaLabel: string
}

export type ServiceSystemLabels = {
  kicker: string
  titleLine1: string
  titleLine2: string
  titleAriaLabel: string
  ctaLabel: string
  navAriaLabel: string
  progressAriaLabel: string
  progressValueTextTemplate: string
  eyebrowTemplate: string
  previous: string
  next: string
  viewDetails: string
  hideDetails: string
}

export type SystemTabsLabels = {
  sectionLabel: string
  listAriaLabel: string
  previous: string
  next: string
}

export type StoriesTabsLabels = {
  tablistAriaLabel: string
}

export type ProfilerVerdictCopy = {
  heading: string
  body: string
}

/** Result-card metadata for one real Zitrone service (links to its detail page). */
export type ProfilerServiceInfo = {
  id: string
  title: string
  accent: Accent
  href: string
}

/** One selectable option in a chip row or a card row. */
export type ProfilerChoice = {
  id: string
  label: string
  note?: string
}

/** Title and lede for one scene of the brief. */
export type ProfilerSceneCopy = {
  title: string
  copy: string
}

export type ProfilerScenes = {
  site: ProfilerSceneCopy
  location: ProfilerSceneCopy
  payment: ProfilerSceneCopy
  schedule: ProfilerSceneCopy
  food: ProfilerSceneCopy
  space: ProfilerSceneCopy
  terms: ProfilerSceneCopy
  start: ProfilerSceneCopy
}

/** Short labels for the rows of the running brief in the left rail. */
export type ProfilerBriefLabels = {
  title: string
  peopleTemplate: string
  reviewTitle: string
  pending: string
  undecided: string
  people: string
  location: string
  days: string
  shifts: string
  menu: string
  space: string
  terms: string
  start: string
  leaning: string
}

export type ProfilerSiteLabels = {
  headcountLabel: string
  headcountAria: string
  headcountMax: string
  mealsTemplate: string
  unsureLabel: string
  stateLabel: string
  statePlaceholder: string
}

export type ProfilerScheduleLabels = {
  daysLabel: string
  daysAria: string
  dayNames: string[]
  dayNamesLong: string[]
  presetWeekdays: string
  presetSixDays: string
  presetAll: string
  shiftsLabel: string
  shiftsAria: string
  peopleAria: string
  mealsUnit: string
  weekdaysSummary: string
  allDaysSummary: string
}

export type ProfilerFoodLabels = {
  tierLabel: string
  tierAria: string
  extrasLabel: string
  styleLabel: string
  styleAria: string
}

export type ProfilerSpaceLabels = {
  facilityLabel: string
  facilityAria: string
}

export type ProfilerTermsLabels = {
  subsidizedLabel: string
  subsidizedAria: string
  subsidyLabel: string
  subsidyAria: string
  subsidyTemplate: string
  budgetLabel: string
  budgetAria: string
  budgetTemplate: string
  budgetMax: string
  budgetOptOut: string
}

export type ProfilerStartLabels = {
  dateLabel: string
  dateAria: string
  flexibleLabel: string
  monthNames: string[]
  notesLabel: string
  notesPlaceholder: string
  contactLabel: string
  nameLabel: string
  companyLabel: string
  emailLabel: string
  phoneLabel: string
  phoneOptional: string
  submit: string
  sending: string
  sendError: string
  sourceLabel: string
}

export type ProfilerStageLabels = {
  site: string
  schedule: string
  food: string
  space: string
  terms: string
  contact: string
}

export type ProfilerLabels = {
  kicker: string
  stepWord: string
  ofWord: string
  /** The six named stages the questions are grouped under in the progress bar. */
  stages: ProfilerStageLabels
  stageAria: string
  sectionHeading: string
  /** Words inside `sectionHeading` set in the green serif accent. */
  sectionHeadingEmphasis?: string
  introCopy: string
  startLabel: string
  continueLabel: string
  skipLabel: string
  editLabel: string
  q1Heading: string
  q1Copy: string
  q1AriaLabel: string
  q2Heading: string
  q2Copy: string
  q3Heading: string
  q3Copy: string
  q3AriaLabel: string
  back: string
  seeRecommendation: string
  startOver: string
  scenes: ProfilerScenes
  brief: ProfilerBriefLabels
  site: ProfilerSiteLabels
  schedule: ProfilerScheduleLabels
  food: ProfilerFoodLabels
  space: ProfilerSpaceLabels
  terms: ProfilerTermsLabels
  start: ProfilerStartLabels
  shifts: ProfilerChoice[]
  menuTiers: ProfilerChoice[]
  facilities: ProfilerChoice[]
  subsidizedOptions: ProfilerChoice[]
  sourceOptions: ProfilerChoice[]
  talkToZitrone: string
  contactEmail: string
  subjectPrefix: string
  subjectFallback: string
  startHere: string
  alsoLabel: string
  learnMore: string
  closingNote: string
  uncoveredNote: string
  verdictStrong: ProfilerVerdictCopy
  verdictLean: ProfilerVerdictCopy
  verdictCustom: ProfilerVerdictCopy
  /** Keyed by the reason ids emitted from profiler-logic. */
  reasons: Record<string, string>
}

export type ComponentLabels = {
  servicesCarousel: ServicesCarouselLabels
  serviceSystem: ServiceSystemLabels
  systemTabs: SystemTabsLabels
  storiesTabs: StoriesTabsLabels
  profiler: ProfilerLabels
}

export type HomeSections = {
  hero: HeroSectionContent
  services: ServicesSection
  operatingSystem: SectionHead & {
    ctaPrimary: Cta
    ctaSecondary?: Cta
    feedbackTitle?: string
    feedbackCopy?: string
  }
  proof: ProofSection
  featuredMedia: FeaturedMediaSection
  stories: StoriesSection
  faq: FaqSection
  footer: FooterSection
}

export type HomeContent = {
  meta: SiteMeta
  componentLabels: ComponentLabels
  primaryNav: NavItem[]
  heroLogos: HeroLogo[]
  serviceCards: ServiceCard[]
  servicesOrbitItems: ServicesOrbitItem[]
  serviceLinks: Record<ServiceTheme, ServiceLink>
  systemTabs: SystemTab[]
  proofColumns: BentoCard[][]
  serviceLayers: ServiceLayer[]
  profilerSizeOptions: ProfilerOption[]
  profilerMoments: ProfilerItem[]
  profilerStyles: ProfilerItem[]
  profilerServices: ProfilerServiceInfo[]
  clientStories: ClientStory[]
  faqs: FaqItem[]
  footerColumns: FooterColumn[]
  sections: HomeSections
}
