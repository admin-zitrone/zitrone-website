export type ArticleSection = {
  id: string
  title: string
  body: string[]
  checklist?: string[]
  links?: { before: string; label: string; href: string; after?: string }[]
  image?: string
  alt?: string
}

export type ArticleFAQ = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  /** Pairs the ES and EN versions of one article now that slugs are localized.
      CMS posts use their document id; static posts use the EN slug. */
  translationKey?: string
  href: string
  title: string
  category: string
  seo?: { title?: string; description?: string }
  cta?: { heading: string; label: string; href: string }
  date: string
  readTime: string
  image: string
  alt: string
  publishedAtISO?: string
  updatedAtISO?: string
  authorName?: string
  authorRole?: string
  reviewedByName?: string
  excerpt: string
  intro: string[]
  takeaways: string[]
  sections: ArticleSection[]
  faqs: ArticleFAQ[]
  /** Optional keyword chips rendered at the end of the article body. */
  topics?: string[]
}

export type BlogLinkGroup = {
  title: string
  links: { label: string; href: string }[]
}

export type BlogIndexCopy = {
  metadataTitle: string
  metadataDescription: string
  heroTitleLine1: string
  heroTitleLine2: string
  categoryNavAriaLabel: string
  searchLabel: string
  searchPlaceholder: string
  searchAriaLabel: string
  searchSubmitAriaLabel: string
  searchClearLabel: string
  emptyStateHeading: string
  emptyStateBody: string
  subscribeKicker: string
  subscribeHeading: string
  subscribeCopy: string
  subscribeCtaLabel: string
  subscribeCtaHref: string
  highlightsAriaLabel: string
  allArticlesKicker: string
  allArticlesHeadingLead: string
  allArticlesHeadingAccent: string
  allArticlesHeadingTrail: string
  allArticlesCopy: string
  paginationAriaLabel: string
  paginationPreviousAriaLabel: string
  paginationNextAriaLabel: string
  paginationCounter: string
  viewMoreLabel: string
}

export type BlogArticleCopy = {
  metadataSuffix: string
  notFoundTitle: string
  backLinkLabel: string
  metaCardAriaLabel: string
  authorName: string
  authorHref: string
  publishedInPrefix: string
  shareLabel: string
  shareSubjectPrefix: string
  reviewedByLabel: string
  reviewedByName: string
  takeawaysHeading: string
  inlineCtaKicker: string
  inlineCtaLeading: string
  inlineCtaEmphasis: string
  inlineCtaTrailing: string
  inlineCtaButton: string
  inlineCtaHref: string
  faqHeading: string
  onThisPageAriaLabel: string
  onThisPageHeading: string
  tocToggleLabel: string
  topicsHeading: string
  recommendedKicker: string
  recommendedHeadingLead: string
  recommendedHeadingAccent: string
  recommendedHeadingTrail: string
  recommendedCopy: string
  breadcrumbHome: string
  breadcrumbBlog: string
}

export type BlogLayoutCopy = {
  brandAriaLabel: string
  primaryNavAriaLabel: string
  navLinks: { href: string; label: string }[]
  navCtaLabel: string
  navCtaHref: string
  bottomKicker: string
  bottomHeadingLead: string
  bottomHeadingAccent: string
  bottomHeadingTrail: string
  bottomCopy: string
  bottomCtaPrimaryLabel: string
  bottomCtaPrimaryHref: string
  bottomCtaSecondaryLabel: string
  bottomCtaSecondaryHref: string
  footerDescription: string
  footerLegal: string
  footerGroups: BlogLinkGroup[]
}

export type BlogContent = {
  layout: BlogLayoutCopy
  index: BlogIndexCopy
  article: BlogArticleCopy
  categories: string[]
  posts: BlogPost[]
}
