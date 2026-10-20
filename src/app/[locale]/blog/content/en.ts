import type { BlogContent } from "./types"
import { assetSrc } from "@/lib/assets.generated"
import { SERVICE_NAMES } from "@/lib/service-names"

export const blogContentEn: BlogContent = {
  layout: {
    brandAriaLabel: "Zitrone home",
    primaryNavAriaLabel: "Primary navigation",
    navLinks: [
      { href: "/#services", label: "Services" },
      { href: "/#outcomes", label: "System" },
      { href: "/#features", label: "Proof" },
      { href: "/blog", label: "Journal" },
    ],
    navCtaLabel: "Start a program",
    navCtaHref: "/#cta",
    bottomKicker: "Workplace food systems",
    bottomHeadingLead: "Ready to make office food feel ",
    bottomHeadingAccent: "operationally simple?",
    bottomHeadingTrail: "",
    bottomCopy:
      "Zitrone can help your team design the right mix of corporate dining, office pantry, office coffee service, and corporate catering.",
    bottomCtaPrimaryLabel: "Contact us",
    bottomCtaPrimaryHref: "/#cta",
    bottomCtaSecondaryLabel: "Explore services",
    bottomCtaSecondaryHref: "/services",
    footerDescription: "Workplace food-service systems for modern companies.",
    footerLegal: "© 2026 Zitrone. All rights reserved.",
    footerGroups: [
      {
        title: "Services",
        links: [
          { label: SERVICE_NAMES.en["dining"].name, href: "/services/corporate-dining" },
          { label: SERVICE_NAMES.en["cafe"].name, href: "/services/corporate-cafe" },
          { label: SERVICE_NAMES.en["pantry"].name, href: "/services/pantry-restocking" },
          { label: SERVICE_NAMES.en["coffee"].name, href: "/services/coffee-water" },
          { label: SERVICE_NAMES.en["grab-go"].name, href: "/services/service-carts" },
          { label: SERVICE_NAMES.en["catering"].name, href: "/services/corporate-catering" },
        ],
      },
      {
        title: "System",
        links: [
          { label: "Operating system", href: "/#outcomes" },
          { label: "Operational proof", href: "/#features" },
          { label: "Food safety", href: "/#features" },
          { label: "Contact", href: "/#cta" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Journal", href: "/blog" },
          { label: "Billing", href: "mailto:facturacion@zitrone.com.mx,contabilidad@zitrone.com.mx?subject=Invoice%20request%20%2F%20Solicitud%20de%20factura&body=Attached%20are%20my%20RFC%20and%20purchase%20ticket." },
          { label: "About Zitrone", href: "/#services" },
          { label: "Client portfolio", href: "/#features" },
          { label: "Start a program", href: "/#cta" },
        ],
      },
    ],
  },
  index: {
    metadataTitle: "Zitrone Journal — Corporate dining, pantry, coffee, and catering",
    metadataDescription:
      "Ideas, systems, and practical notes from Zitrone on corporate dining, office pantry, office coffee service, corporate cafe, and catering operations.",
    heroTitleLine1: "The Zitrone",
    heroTitleLine2: "journal",
    categoryNavAriaLabel: "Journal categories",
    searchLabel: "Search",
    searchPlaceholder: "Search articles",
    searchAriaLabel: "Search articles by title or excerpt",
    searchSubmitAriaLabel: "Run search",
    searchClearLabel: "Clear filters",
    emptyStateHeading: "No articles match your filters",
    emptyStateBody:
      "Try a different category or clear your search to see every Zitrone journal post.",
    subscribeKicker: "Subscribe",
    subscribeHeading:
      "Get workplace food notes, service ideas, and operational updates.",
    subscribeCopy:
      "Practical thinking for teams building better dining, pantry, coffee, and catering systems.",
    subscribeCtaLabel: "Talk to us",
    subscribeCtaHref: "/#cta",
    highlightsAriaLabel: "Journal highlights",
    allArticlesKicker: "All articles",
    allArticlesHeadingLead: "Recent thinking from the ",
    allArticlesHeadingAccent: "Zitrone",
    allArticlesHeadingTrail: " team",
    allArticlesCopy:
      "Browse practical notes for building corporate dining, office pantry, coffee service, and catering programs that operations teams can trust.",
    paginationAriaLabel: "Article pages",
    paginationPreviousAriaLabel: "Previous articles",
    paginationNextAriaLabel: "Next articles",
    paginationCounter: "1 / 3",
    viewMoreLabel: "View more",
  },
  article: {
    metadataSuffix: " — Zitrone Journal",
    notFoundTitle: "Article not found — Zitrone Journal",
    backLinkLabel: "Journal",
    metaCardAriaLabel: "Article details",
    authorName: "Zitrone Operations Team",
    authorHref: "/#services",
    publishedInPrefix: "Published in ",
    shareLabel: "Share",
    shareSubjectPrefix: "Read this Zitrone Journal article: ",
    reviewedByLabel: "Reviewed by",
    reviewedByName: "Zitrone Food Safety & Operations",
    takeawaysHeading: "Key takeaways",
    inlineCtaKicker: "#zitroneoperations",
    inlineCtaLeading: "Find the right Zitrone program to turn food logistics into ",
    inlineCtaEmphasis: "operational confidence",
    inlineCtaTrailing: ".",
    inlineCtaButton: "Contact us",
    inlineCtaHref: "/contact?src=blog-article-cta",
    faqHeading: "Frequently asked questions",
    onThisPageAriaLabel: "On this page",
    onThisPageHeading: "On this page",
    tocToggleLabel: "On this page",
    topicsHeading: "Topics",
    recommendedKicker: "Recommended articles",
    recommendedHeadingLead: "More notes from the ",
    recommendedHeadingAccent: "Zitrone",
    recommendedHeadingTrail: " team",
    recommendedCopy:
      "Keep exploring practical ways to make workplace food more reliable, useful, and easy to operate.",
    breadcrumbHome: "Zitrone",
    breadcrumbBlog: "Journal",
  },
  categories: [
    "All",
    "Culture & retention",
    "Wellbeing & productivity",
    "Building a program",
    "Trust & standards",
  ],
  posts: [
    {
      slug: "office-food-employee-retention",
      translationKey: "office-food-employee-retention",
      href: "/blog/office-food-employee-retention",
      title: "Office food and employee retention: what really moves the needle",
      category: "Culture & retention",
      date: "April 2026",
      readTime: "6 min read",
      image: assetSrc("site-blog-office-food-employee-retention"),
      alt: "Workplace dining and social space supporting the daily employee experience",
      excerpt:
        "Free lunch is not a retention plan. Here is what the daily office food ritual actually does for company culture, attendance, and the people you want to keep.",
      intro: [
        "Food perks show up in almost every retention deck and almost no exit interview. The mismatch is informative — what employees remember about workplace food is rarely the dish, and almost always the experience around it.",
        "Retention is built on a stack of small, repeated signals. A daily office meal is one of the most repeated signals a company produces. The question is what signal it is sending.",
      ],
      takeaways: [
        "Free food is not an employee retention strategy. A reliable, dignified daily food ritual is.",
        "Consistency over indulgence — what people remember is whether the lunch hour worked, not whether the menu was impressive.",
        "Measure participation rate and complaint drift, not abstract satisfaction surveys.",
      ],
      sections: [
        {
          id: "food-shows-up-retention",
          title: "Why food keeps showing up in retention conversations",
          body: [
            "Food rarely tops the list of why someone joins a company, and almost never tops the list of why they leave. But it appears constantly in the everyday texture of work — manager 1:1s, hybrid debates, onboarding feedback, the quiet calculus of whether to show up on a Tuesday.",
            "Retention is shaped by hundreds of micro-experiences, and the lunch hour is one of the few experiences every employee has every day they are in the office. That repetition makes food disproportionately influential, even when it is not the headline reason anyone gives for staying or going.",
          ],
          image: assetSrc("site-service-detail-buffet-toppings-bar"),
          alt: "Workplace lunch service that supports daily employee experience",
        },
        {
          id: "perk-versus-operating-layer",
          title: "A perk vs. an operating layer",
          body: [
            "Treating office food as a perk produces fragile programs: budgets get cut early, vendors rotate often, and the experience swings between generous and broken depending on who is paying attention that month. Employees notice the swing more than they notice the average.",
            "Treating it as an operating layer produces something different — a predictable daily ritual, owned by a partner who keeps the kitchen, delivery, service line, and replenishment moving as one system. Predictability is what turns a food benefit into a retention asset.",
          ],
          image: assetSrc("site-service-detail-chef-plated-dish"),
          alt: "Coordinated workplace dining and coffee service",
        },
        {
          id: "signal-of-care",
          title: "The daily ritual as a signal of care",
          body: [
            "When the lunch line is on time, the menu fits the team, the pantry is stocked, and the coffee is fresh, employees read it as a signal that the company has planned for their day. That signal compounds over months. It is also visible to candidates from the moment they walk in for an on-site interview.",
            "When the same systems break — late delivery, run-out at 1:15pm, weeks of repeats — the signal inverts. People do not write that on an exit survey, but they remember it. Culture is built and lost in those small accumulations.",
          ],
        },
        {
          id: "what-to-measure",
          title: "What to measure if you want food to support retention",
          body: [
            "Most teams measure satisfaction with annual surveys that capture mood, not behavior. Better metrics are participation rate (how many people in the office actually use the service), complaint drift (whether the same complaint is increasing month over month), and pantry velocity stability.",
            "These metrics catch problems before they show up in attrition. They also let the food program become a leading indicator for the wider workplace experience, not a lagging one.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does free office food actually improve employee retention?",
          answer:
            "Not on its own. Free food helps when the program is consistent and dignified. It hurts when it is inconsistent, because the swing teaches employees that benefits are unreliable. Retention impact comes from predictability, not from the price tag.",
        },
        {
          question: "How much should a company spend per employee on workplace food?",
          answer:
            "There is no universal benchmark. Spend depends on headcount, hybrid schedule, service model (dining, pantry, catering), and what the program is replacing. Zitrone typically scopes a per-headcount range based on the operating brief, then adjusts against participation data.",
        },
        {
          question: "What is the most common food mistake that hurts retention?",
          answer:
            "Inconsistency. A great Wednesday lunch followed by a broken Thursday tells employees the system is fragile. Most companies underrate consistency and overrate menu novelty when designing for retention.",
        },
      ],
    },
    {
      slug: "afternoon-slump-office-pantry",
      translationKey: "afternoon-slump-office-pantry",
      href: "/blog/afternoon-slump-office-pantry",
      title: "The 3pm slump and what your office pantry can do about it",
      category: "Wellbeing & productivity",
      date: "April 2026",
      readTime: "4 min read",
      image: assetSrc("site-blog-afternoon-slump-office-pantry"),
      alt: "Employee choosing snacks and drinks from a well-stocked office pantry",
      excerpt:
        "The afternoon energy crash is mostly a hydration and protein problem. A well-curated office pantry quietly fixes it before it becomes a productivity meeting.",
      intro: [
        "Most offices treat the afternoon slump as cultural — a thing teams complain about and adapt to. It is mostly nutritional, partly behavioral, and almost entirely fixable through what is on the pantry shelf.",
        "The fix is not stronger coffee. The fix is the mix of items reachable between 2pm and 4pm, and the quiet absence of the things that make the crash worse.",
      ],
      takeaways: [
        "The afternoon slump is mostly carb crash, dehydration, and missed protein at lunch — not lack of caffeine.",
        "Curating an office pantry for afternoon hours is different from curating it for morning hours.",
        "What you remove from the pantry matters as much as what you add.",
      ],
      sections: [
        {
          id: "what-is-the-slump",
          title: "What the afternoon slump actually is",
          body: [
            "The post-lunch energy dip is well-studied: a combination of circadian rhythm, glucose response to a heavy or carb-loaded meal, and the cumulative effect of mild dehydration through the morning. None of those are mysteries, and none of them are cultural.",
            "Each one has a different pantry response. Lumping them together as the afternoon slump and reaching for stronger coffee solves at most one of the three, and only briefly.",
          ],
          image: assetSrc("site-service-detail-dining-hall-buffet"),
          alt: "Office pantry stocked for afternoon focus and energy",
        },
        {
          id: "pantry-mix-by-time",
          title: "Curating the office pantry by time of day",
          body: [
            "Morning curation favors quick protein, fruit, and the coffee setup. Afternoon curation favors items that smooth glucose, support hydration, and hold people through the second half of the day without inviting another sugar spike.",
            "In practice that means more nuts and seeds, more fresh fruit, more electrolyte water, more savory options, and fewer high-sugar baked items at the visible front of the shelf.",
          ],
        },
        {
          id: "quiet-removals",
          title: "The quiet removals that change everything",
          body: [
            "Most pantry programs grow by addition: someone requests an item, it gets added, the SKU list expands. Few programs prune. The result is a shelf where the highest-sugar items are also the most visible, because they have been there longest and get reordered automatically.",
            "Quietly removing or back-shelving the items that worsen the 3pm crash does more for afternoon focus than any new addition. Velocity data makes those removals defensible — the team is choosing healthier options, not having them taken away.",
          ],
          image: assetSrc("site-service-detail-buffet-toppings-bar"),
          alt: "Curated pantry items supporting afternoon wellness",
        },
        {
          id: "hydration-the-bigger-half",
          title: "Hydration is the bigger half",
          body: [
            "Hydration is the most underrated lever in the entire wellbeing-and-productivity conversation. Most office workers are mildly dehydrated by 2pm, and mild dehydration looks identical to fatigue, low focus, and irritability.",
            "A pantry strategy that treats water access, temperature options, and electrolyte availability as first-class items — not afterthoughts — moves the afternoon slump more than any snack curation will.",
          ],
        },
      ],
      faqs: [
        {
          question: "Does more coffee help the afternoon slump?",
          answer:
            "Caffeine masks the dip but does not solve it. After a heavy lunch and several hours of mild dehydration, coffee adds a stimulant on top of the underlying problem. It can also push the crash later into the day instead of removing it.",
        },
        {
          question: "What snacks actually help in the afternoon?",
          answer:
            "Items that combine protein with fiber and water content tend to outperform: nuts and seeds, fresh fruit, yogurt, savory options like olives or hummus with vegetables. The point is to smooth the glucose curve rather than spike it again.",
        },
        {
          question: "Should we remove all sugary snacks from the office pantry?",
          answer:
            "No, but they should not be the most visible or easiest items to grab in the afternoon. Reducing visibility — back-shelving rather than removing — preserves choice while shifting default behavior toward better options.",
        },
      ],
    },
    {
      slug: "workplace-food-program-that-works",
      translationKey: "workplace-food-program-that-works",
      href: "/blog/workplace-food-program-that-works",
      title: "How to build a workplace food program that actually works",
      category: "Building a program",
      date: "April 2026",
      readTime: "6 min read",
      image: assetSrc("site-blog-workplace-food-program-that-works"),
      alt: "Kitchen team preparing meals for a structured workplace food program",
      excerpt:
        "A practical look at the operating rhythm behind daily dining, pantry, coffee, and catering when one accountable partner owns the system.",
      intro: [
        "Workplace food is often treated as a collection of separate tasks: lunch, pantry, coffee, catering, feedback, invoices, and emergency fixes. In practice, those tasks are connected. When one layer breaks, the whole experience feels fragile.",
        "A better program starts by designing the system around the workday and then building the service layers that support it. That is the difference between food as a perk and food as an operating layer.",
      ],
      takeaways: [
        "A reliable workplace food program behaves like an operating system, not a rotating list of vendors.",
        "The right service model depends on headcount, space, schedule, culture, and how much coordination your team can realistically own.",
        "Food service becomes easier to trust when kitchen, delivery, staffing, replenishment, and issue recovery are accountable to one partner.",
      ],
      sections: [
        {
          id: "start-with-workday",
          title: "Start with the workday, not the menu",
          body: [
            "The strongest workplace food programs begin with the rhythm of the office. Arrival times, meeting blocks, hybrid schedules, production windows, and team rituals all shape what food service needs to do before anyone chooses a dish.",
            "Menu planning matters, but it should come after the operating brief. If service starts late, replenishment is unclear, or the cafe line stalls before an all-hands, even a thoughtful menu becomes a daily source of friction.",
          ],
          image: assetSrc("site-service-detail-staff-handwashing"),
          alt: "Daily workplace dining service prepared for an office team",
        },
        {
          id: "choose-service-model",
          title: "Choose the right service model",
          body: [
            "Some teams need commissary-prepared meals delivered with a clean service window. Others need an on-site cafe, pantry restocking, coffee and water, or catering that flexes around trainings and client visits.",
            "The useful question is not which service is most impressive. It is which mix of services removes the most operational drag while matching the size, space, and culture of the organization.",
          ],
          image: assetSrc("site-service-detail-chef-plated-dish"),
          alt: "Corporate cafe and coffee service in a workplace",
        },
        {
          id: "build-operating-rhythm",
          title: "Build the operating rhythm",
          body: [
            "Once the model is clear, consistency comes from cadence: ordering, production, routing, setup, service, replenishment, cleanup, reporting, and adjustment. Each layer needs an owner and a recovery path.",
            "This is where a single operating partner changes the experience. Instead of asking an office team to coordinate the seams, the partner owns the system and keeps the service moving from commissary to table.",
          ],
          image: assetSrc("site-service-detail-pantry-attendant-portrait"),
          alt: "Food service operations moving from kitchen preparation to table service",
        },
        {
          id: "measure-and-adjust",
          title: "Measure, learn, and adjust",
          body: [
            "Food programs are living systems. Utilization, preference shifts, waste, service timing, pantry velocity, and feedback should inform the next cycle instead of sitting in a report no one uses.",
            "The goal is not a rigid program. It is a reliable one that can adapt without creating vendor surprises, logistics gaps, or single points of failure.",
          ],
        },
        {
          id: "bottom-line",
          title: "The bottom line",
          body: [
            "A workplace food program works when people enjoy it and operations teams do not have to chase it. That requires thoughtful menus, but it also requires infrastructure, staffing, delivery discipline, food-safety controls, and clear accountability.",
            "When those pieces are coordinated from one place, food shifts from a daily logistics burden into a managed operating layer.",
          ],
        },
      ],
      faqs: [
        {
          question: "What should a workplace food program include?",
          answer:
            "A complete program should define the service model, menu cadence, production plan, delivery or on-site staffing, replenishment rhythm, food-safety controls, reporting, and escalation path for daily issues.",
        },
        {
          question: "Do we need an on-site kitchen?",
          answer:
            "Not always. Many teams can run a strong program through commissary-prepared meals, mobile cafe service, pantry restocking, and catering. The right answer depends on headcount, space, schedule, and desired service experience.",
        },
        {
          question: "How does Zitrone keep service reliable?",
          answer:
            "Zitrone coordinates the kitchen, delivery, staffing, replenishment, service rhythm, and recovery plan so the client has one accountable partner instead of a chain of disconnected vendors.",
        },
      ],
      topics: [
        "Workplace food",
        "Operations",
        "Daily dining",
        "Service model",
        "Food safety",
      ],
    },
  ],
}
