import type { HomeContent } from './types'
import { assetPath, contactHref, createHeroLogos, homeAssetPaths } from './shared'
import { assetSrc } from '@/lib/assets.generated'
import { SERVICE_NAMES, serviceNameList } from '@/lib/service-names'

const testimonialPhotoAssetPath = homeAssetPaths.testimonialPhotos
const S = SERVICE_NAMES.en

export const homeContentEn: HomeContent = {
  meta: {
    title: 'Zitrone — A better food experience for modern work',
    description:
      `Zitrone designs and operates ${serviceNameList('en')} for modern workplaces in Mexico.`,
    siteName: 'Zitrone',
    ogImage: assetSrc('site-og-card'),
  },
  componentLabels: {
    servicesCarousel: {
      regionLabel: 'Service programs',
      previous: 'Previous service',
      next: 'Next service',
      progressLabel: 'Service programs progress',
      slideTemplate: 'Slide {current} of {total}',
      viewService: 'Learn more',
      logosAriaLabel: 'Zitrone client logos',
    },
    serviceSystem: {
      kicker: 'Our services',
      titleLine1: 'A program for every',
      titleLine2: 'moment of the day',
      titleAriaLabel:
        `A program for every moment of the day: ${serviceNameList('en')}.`,
      ctaLabel: 'View services',
      navAriaLabel: 'Service categories',
      progressAriaLabel: 'Service programs progress',
      progressValueTextTemplate: 'Program {current} of {total}',
      eyebrowTemplate: 'Program {index}',
      previous: 'Previous program',
      next: 'Next program',
      viewDetails: 'View details',
      hideDetails: 'Hide details',
    },
    systemTabs: {
      sectionLabel: 'How we work',
      listAriaLabel: 'Zitrone program steps',
      previous: 'Previous step',
      next: 'Next step',
    },
    storiesTabs: {
      tablistAriaLabel: 'Client stories',
    },
    profiler: {
      kicker: 'Personalized recommendation',
      stepWord: 'Step',
      ofWord: 'of',
      stages: {
        site: 'Site',
        schedule: 'Schedule',
        food: 'Food',
        space: 'Space',
        terms: 'Terms',
        contact: 'Contact',
      },
      stageAria: 'Questionnaire progress',
      q1Heading: 'How many people are on site on a normal day?',
      q1Copy:
        'Headcount decides which formats make economic sense, so it is the first thing we ask.',
      q1AriaLabel: 'People on site per day',
      q2Heading: 'Which moments of the day do you want to solve?',
      q2Copy: 'Select all that apply. Each moment is solved with a different format.',
      q3Heading: 'How do you picture the day-to-day service?',
      q3Copy: 'This decides between machines, carts, or a staffed bar.',
      q3AriaLabel: 'Service style',
      back: 'Back',
      seeRecommendation: 'See recommendation',
      startOver: 'Start over',
      sectionHeading: 'Find the service that fits your team',
      sectionHeadingEmphasis: 'fits',
      introCopy:
        'Tell us how your site runs and we tell you the best place to start.',
      startLabel: 'Start',
      continueLabel: 'Continue',
      skipLabel: 'Skip',
      editLabel: 'Edit',
      scenes: {
        site: {
          title: 'How many people are on site on a normal day?',
          copy: 'Headcount decides which formats make economic sense. That is why we ask it first.',
        },
        location: {
          title: 'Where is the site?',
          copy: 'The city drives logistics and which kitchen we can operate from.',
        },
        payment: {
          title: 'What are your payment terms?',
          copy: 'Optional, but knowing it saves a round in the negotiation.',
        },
        schedule: {
          title: 'Which days does the service run?',
          copy: 'Pick the service days and the meal moments. Adjust the headcount per shift.',
        },
        food: {
          title: 'What kind of food do you need?',
          copy: 'The menu tier drives cost per meal and the operation on site.',
        },
        space: {
          title: 'What facilities do you have?',
          copy: 'This decides whether we produce on your site or deliver from our commissary.',
        },
        terms: {
          title: 'Commercial terms',
          copy: 'All optional. Whatever you share here speeds up the proposal.',
        },
        start: {
          title: 'When do you need it?',
          copy: 'This closes the brief. We come back with a concrete proposal.',
        },
      },
      brief: {
        title: 'Your brief',
        peopleTemplate: '{count} people',
        reviewTitle: 'What you told us',
        pending: 'Pending',
        undecided: 'We define it together',
        people: 'People',
        location: 'Location',
        days: 'Days',
        shifts: 'Shifts',
        menu: 'Menu',
        space: 'Facilities',
        terms: 'Terms',
        start: 'Start',
        leaning: 'Leaning toward',
      },
      site: {
        headcountLabel: 'People on site on a normal day',
        headcountAria: 'People on site per day',
        headcountMax: '2,000 or more',
        mealsTemplate: 'Around {meals} meals a day',
        unsureLabel: 'It varies, or not sure yet',
        stateLabel: 'State',
        statePlaceholder: 'Type a city',
      },
      schedule: {
        daysLabel: 'Service days',
        daysAria: 'Service days',
        dayNames: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        dayNamesLong: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        presetWeekdays: 'Mon–Fri',
        presetSixDays: 'Mon–Sat',
        presetAll: 'Every day',
        shiftsLabel: 'Which meals do you need, and for how many people?',
        shiftsAria: 'Meal moments',
        peopleAria: 'People on this shift',
        mealsUnit: 'meals',
        weekdaysSummary: 'Mon–Fri',
        allDaysSummary: 'Every day',
      },
      food: {
        tierLabel: 'Menu tier',
        tierAria: 'Menu tier',
        extrasLabel: 'What else would you like to cover?',
        styleLabel: 'How do you picture the service?',
        styleAria: 'Service style',
      },
      space: {
        facilityLabel: 'Facilities on site',
        facilityAria: 'Facilities on site',
      },
      terms: {
        subsidizedLabel: 'Does the company subsidise the service?',
        subsidizedAria: 'Service subsidised by the company',
        subsidyLabel: 'How much does the company cover?',
        subsidyAria: 'Percentage subsidised by the company',
        subsidyTemplate: 'The company covers {company}% and the employee {employee}%.',
        budgetLabel: 'Target price per meal',
        budgetAria: 'Target price per meal in pesos',
        budgetTemplate: '${amount} MXN per meal',
        budgetMax: '$350 or more',
        budgetOptOut: 'I’d rather not say',
      },
      start: {
        dateLabel: 'Ideal start date',
        dateAria: 'Ideal start date',
        flexibleLabel: 'The date is flexible',
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        notesLabel: 'Any particular requirement?',
        notesPlaceholder:
          'Allergies, certifications, union rules, specific menus, anything relevant.',
        contactLabel: 'So we can send you the proposal',
        nameLabel: 'Name',
        companyLabel: 'Company',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        phoneOptional: 'optional',
        submit: 'Send brief',
        sending: 'Sending…',
        sendError: 'The brief did not send. Try again, or email us at opina@zitrone.com.mx.',
        sourceLabel: 'How did you hear about Zitrone?',
      },
      shifts: [
        { id: 'breakfast', label: 'Breakfast' },
        { id: 'lunch', label: 'Lunch' },
        { id: 'dinner', label: 'Dinner' },
        { id: 'night', label: 'Night shift' },
      ],
      menuTiers: [
        {
          id: 'industrial',
          label: 'Industrial',
          note: 'High-volume menu for plants and operations.',
        },
        {
          id: 'corporativo',
          label: 'Corporate',
          note: 'Balanced menu with daily variety for offices.',
        },
        {
          id: 'premium',
          label: 'Corporate premium',
          note: 'Stations, signature ingredients and more rotation.',
        },
        {
          id: 'recommend',
          label: 'You recommend',
          note: 'Zitrone proposes based on size, space and budget.',
        },
      ],
      facilities: [
        {
          id: 'full-kitchen',
          label: 'Full kitchen',
          note: 'We can produce on site.',
        },
        {
          id: 'serving-only',
          label: 'Serving space only',
          note: 'A dining room or bar, no production kitchen.',
        },
        {
          id: 'none',
          label: 'Nothing yet',
          note: 'The space still has to be defined with you.',
        },
      ],
      subsidizedOptions: [
        { id: 'yes', label: 'Yes' },
        { id: 'no', label: 'No' },
        { id: 'tbd', label: 'To be defined' },
      ],
      sourceOptions: [
        { id: 'referral', label: 'A referral' },
        { id: 'search', label: 'Search' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'event', label: 'An event' },
        { id: 'other', label: 'Other' },
      ],
      talkToZitrone: 'Talk to Zitrone',
      contactEmail: 'opina@zitrone.com.mx',
      subjectPrefix: "Let's talk:",
      subjectFallback: 'Help me choose the right service',
      startHere: 'Start here',
      alsoLabel: 'We can also cover',
      learnMore: 'See the service',
      closingNote:
        'You can start with a single service and add the rest when it makes sense, with the same team.',
      uncoveredNote:
        'Something you selected is not listed here: not every format makes sense at every scale. We will review it with you on a call.',
      verdictStrong: {
        heading: 'Here is how we would start.',
        body: 'Based on what you selected, this is the starting point we would propose. Everything runs under one team and one invoice.',
      },
      verdictLean: {
        heading: 'There is a leaner way.',
        body: 'Below 50 people, a full dining room rarely justifies its fixed cost. This is what does work at your size.',
      },
      verdictCustom: {
        heading: "Let's look at it together.",
        body: 'From what you have told us there is more than one possible path. A short call with the team sets the right starting point.',
      },
      reasons: {
        'comedor-full':
          'A full meal every day, with an on-site kitchen or commissary delivery and the whole operation run by Zitrone.',
        'comedor-full-breakfast':
          'A full meal every day, with an on-site kitchen or commissary delivery. Breakfast folds into the same service.',
        'comedor-comisariato':
          'At your size the commissary format works: a full meal every day without building a kitchen in your office.',
        'comedor-comisariato-breakfast':
          'At your size the commissary format works: a full meal every day without building a kitchen. Breakfast folds into the same service.',
        'cafeteria-hub':
          'A barista-run bar brings coffee, ready food, pastry, and snacks together in one staffed point.',
        'cafeteria-morning':
          'Covers the mornings with drinks prepared to order and ready-to-go food.',
        'pantry-daily':
          'Snacks and beverages with open consumption or a per-person allocation, priced on the products you choose.',
        'maquinas-coffee':
          'Freshly ground coffee with no upfront investment and maintenance included.',
        'maquinas-water':
          'Filtered water for the whole office, with no upfront investment and maintenance included.',
        'maquinas-coffee-water':
          'Freshly ground coffee and filtered water, with no upfront investment and maintenance included.',
        'carritos-floors':
          'A Zitrone-run cart tours every floor with fresh food, no fixed point needed.',
        'catering-events': 'Food, setup, tableware, and servers coordinated by Zitrone, per event.',
        'catering-box-lunch':
          'Box lunches and working meals on demand: they solve the daily meal without the fixed cost of a dining room.',
        'catering-box-lunch-events':
          'Box lunches for the day to day and full catering for your events, with the same team.',
      },
    },
  },
  primaryNav: [
    { href: '#service-system', label: 'Services' },
    { href: '#outcomes', label: 'How we work' },
    { href: '/en/blog', label: 'Blog' },
    { href: '#faq', label: 'FAQs' },
    { href: '#cta', label: 'Contact' },
  ],

  heroLogos: createHeroLogos(),

  serviceCards: [
    {
      title: S.dining.name,
      eyebrow: 'Program 01',
      accent: 'dining',
      image: assetSrc('site-service-corporate-dining-food-hall'),
      copy: 'A complete fresh menu every day, with on-site or commissary production and full operations by Zitrone.',
      href: '/services/corporate-dining',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/corporate-cafe', label: S.cafe.name },
        { href: '/services/pantry-restocking', label: S.pantry.name },
        { href: '/services/corporate-catering', label: S.catering.name },
      ],
    },
    {
      title: S.cafe.name,
      eyebrow: 'Program 02',
      accent: 'cafe',
      image: assetSrc('site-service-corporate-cafe'),
      copy: 'A complete cafe with barista, freshly prepared drinks, ready food, pastries, snacks, and fruit.',
      href: '/services/corporate-cafe',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/coffee-water', label: S.coffee.name },
        { href: '/services/service-carts', label: S['grab-go'].name },
        { href: '/services/corporate-dining', label: S.dining.name },
      ],
    },
    {
      title: S.pantry.name,
      eyebrow: 'Program 03',
      accent: 'pantry',
      image: assetSrc('site-service-pantry'),
      copy: 'Snacks and beverages operated by Zitrone, with open consumption or a per-person allocation, and personalised pricing.',
      href: '/services/pantry-restocking',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/service-carts', label: S['grab-go'].name },
        { href: '/services/coffee-water', label: S.coffee.name },
        { href: '/services/corporate-dining', label: S.dining.name },
      ],
    },
    {
      title: S.coffee.name,
      eyebrow: 'Program 04',
      accent: 'cafe',
      image: assetSrc('site-service-coffee-and-water'),
      copy: 'Fresh-ground coffee and filtered water, with no upfront investment and maintenance included.',
      href: '/services/coffee-water',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/corporate-cafe', label: S.cafe.name },
        { href: '/services/pantry-restocking', label: S.pantry.name },
        { href: '/services/service-carts', label: S['grab-go'].name },
      ],
    },
    {
      title: S['grab-go'].name,
      eyebrow: 'Program 05',
      accent: 'pantry',
      image: assetSrc('site-service-cart'),
      copy: 'A Zitrone-operated cart visits every floor with fresh ready food for your team to choose.',
      href: '/services/service-carts',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/pantry-restocking', label: S.pantry.name },
        { href: '/services/coffee-water', label: S.coffee.name },
        { href: '/services/corporate-dining', label: S.dining.name },
      ],
    },
    {
      title: S.catering.name,
      eyebrow: 'Program 06',
      accent: 'catering',
      image: assetSrc('site-service-catering-buffet'),
      copy: 'Custom events with food, setup, tableware, and servers coordinated by Zitrone.',
      href: '/services/corporate-catering',
      ctaLabel: 'Learn more',
      relatedLinks: [
        { href: '/services/corporate-dining', label: S.dining.name },
        { href: '/services/corporate-cafe', label: S.cafe.name },
        { href: '/services/service-carts', label: S['grab-go'].name },
      ],
    },
  ],

  servicesOrbitItems: [
    {
      title: 'Breakfasts',
      theme: 'dining',
      image: assetSrc('food-breakfast-molletes'),
      copy: 'A good start for early arrivals, with a complete setup every morning in the dining room.',
    },
    {
      title: 'Premium menus',
      theme: 'dining',
      image: assetSrc('site-service-detail-chef-plated-dish'),
      copy: 'Chef-designed menus with specialty proteins, fine pastries and restaurant-style service, for every day or your executive dining room.',
    },
    {
      title: 'Coffee bars',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/bebidas-cup.jpg',
      copy: 'Baristas making espresso, lattes, cappuccinos and chai to order, without leaving the office.',
    },
    {
      title: 'Salad bars',
      theme: 'dining',
      image: '/img/shared/services/comedor/barra-ensaladas-tazones.jpg',
      copy: 'Fresh greens, vegetables, proteins and toppings so everyone can build their own salad, every day.',
    },
    {
      title: 'Box lunches',
      theme: 'catering',
      image: '/img/shared/services/catering/box-lunch.jpg',
      copy: 'Complete individual meals for training days, launches and meetings that cannot pause.',
    },
    {
      title: 'Poke bowls',
      theme: 'dining',
      image: '/img/shared/services/comedor/poke-bowl.jpg',
      copy: 'Fresh ingredients and flexible combinations for a light, colorful lunch.',
    },
    {
      title: 'Coffee breaks',
      theme: 'catering',
      image: '/img/shared/services/catering/event-breakfast-setup.png',
      copy: 'Coffee, fruit, pastries and sandwiches to recharge between one session and the next.',
    },
    {
      title: 'Grab & Go',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/vitrina-ready-to-go.jpg',
      copy: 'Sandwiches, salads, fruit, desserts and drinks ready in the display case, so people eat well without slowing down.',
    },
    {
      title: 'Taco stations',
      theme: 'dining',
      image: '/img/shared/services/comedor/taco-station.jpg',
      copy: 'Warm tortillas, proteins and toppings made to order, as part of the dining room menu.',
    },
    {
      title: 'Healthy snacks',
      theme: 'pantry',
      image: '/img/shared/services/pantry/bento-healthy.jpg',
      copy: 'Fruit and lighter options always within reach for something good to snack on through the day.',
    },
    {
      title: 'Grill bars',
      theme: 'dining',
      image: '/img/shared/services/comedor/barra-grill.jpg',
      copy: 'Fresh proteins finished on the grill to order, right in the dining room.',
    },
    {
      title: 'Juices and smoothies',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/green-smoothie.jpg',
      copy: 'Freshly made cold options in the cafe, for when the day calls for more than coffee.',
    },
    {
      title: 'Cold drinks',
      theme: 'pantry',
      image: assetSrc('pantry-cooler-shelf-portrait'),
      copy: 'Water, sodas, juices, kombuchas and plant-based drinks, kept cold and restocked before they run out.',
    },
    {
      title: 'Snacks and sweets',
      theme: 'pantry',
      image: assetSrc('pantry-snacks'),
      copy: 'Chips, cookies, popcorn and candy in single portions, always stocked.',
    },
    {
      title: 'Pizza bars',
      theme: 'dining',
      image: assetSrc('food-pizza-station'),
      copy: 'A station that rotates through the dining room and gives the week something different to look forward to.',
    },
    {
      title: 'Coffee machines',
      theme: 'coffee',
      image: '/img/shared/services/cafeteras/person-machine.jpg',
      copy: 'Fresh-ground coffee at your office, with equipment, supplies, cleaning and maintenance on us.',
    },
    {
      title: 'Bakery and pastry',
      theme: 'cafe',
      image: '/img/shared/services/catering/concha-pan-dulce.jpg',
      copy: 'Freshly baked bread and the day\'s desserts in the cafe, to go with coffee or as a small treat.',
    },
    {
      title: 'Water dispensers',
      theme: 'coffee',
      image: '/img/shared/services/water/person-dispenser-portrait.jpg',
      copy: 'Cold, hot, room-temperature or sparkling water, with filters and maintenance included.',
    },
    {
      title: 'Working lunches',
      theme: 'catering',
      image: '/img/shared/services/catering/box-lunch.jpg',
      copy: 'Well-served food for leadership visits, all-hands meetings and workshops at your company.',
    },
    {
      title: 'Bowl bars',
      theme: 'dining',
      image: assetSrc('comedor-make-your-own-bowl-line'),
      copy: 'Fresh ingredients so everyone can build their bowl the way they like it.',
    },
  ],

  serviceLinks: {
    dining: { label: S.dining.name, shortLabel: S.dining.short, href: '/services/corporate-dining' },
    cafe: { label: S.cafe.name, shortLabel: S.cafe.short, href: '/services/corporate-cafe' },
    pantry: { label: S.pantry.name, shortLabel: S.pantry.short, href: '/services/pantry-restocking' },
    coffee: { label: S.coffee.name, shortLabel: S.coffee.short, href: '/services/coffee-water' },
    'grab-go': { label: S['grab-go'].name, shortLabel: S['grab-go'].short, href: '/services/service-carts' },
    catering: { label: S.catering.name, shortLabel: S.catering.short, href: '/services/corporate-catering' },
  },


  systemTabs: [
    {
      key: 'plan',
      icon: 'briefcase',
      stage: 'Learn',
      stageCopy: {
        before: 'We get to know ',
        highlight: 'your team’s culture, preferences, and rhythm',
        after: ' before making a single decision.',
      },
      title: 'Designed and run by the experts',
      copy: 'You tell us what your team needs, and we design the program and define how the operation runs. You should not have to engineer your own food service, so we take that weight off you and make it happen.',
      panelTitle: 'Designed and run by the experts',
      panelCopy:
        'You tell us what your team needs, and we design the program and define how the operation runs. You should not have to engineer your own food service, so we take that weight off you and make it happen.',
      image: assetSrc('ops-operating-system-1'),
      visualWidget: {
        kind: 'profile',
        mealsUnit: 'meals',
        days: [
          { label: 'M', name: 'Monday', value: 240 },
          { label: 'T', name: 'Tuesday', value: 300 },
          { label: 'W', name: 'Wednesday', value: 300 },
          { label: 'T', name: 'Thursday', value: 240 },
          { label: 'F', name: 'Friday', value: null },
        ],
        offLabel: 'Home office',
        schedule: [
          { minutes: 450, label: 'Café opens' },
          { minutes: 480, label: 'Breakfast' },
          { minutes: 660, label: 'Pantry · snacks' },
          { minutes: 780, label: 'Lunch' },
          { minutes: 1020, label: 'Café closes' },
        ],
      },
      tone: 'ocean',
    },
    {
      key: 'prepare',
      icon: 'shield',
      stage: 'Solve',
      stageCopy: {
        before: 'An expert team takes care of ',
        highlight: 'getting every detail right, every day',
        after: '.',
      },
      title: 'Your team eats well today, tomorrow, and always',
      copy: 'Standardized production, documented food-safety controls, and teams trained by Zitrone. Quality stays consistent because the process stays consistent.',
      panelTitle: 'Your team eats well today, tomorrow, and always',
      panelCopy:
        'Standardized production, documented food-safety controls, and teams trained by Zitrone. Quality stays consistent because the process stays consistent.',
      image: assetSrc('ops-operating-system-3'),
      visualWidget: {
        kind: 'menu',
        title: 'Today’s menu',
        meta: 'Mon, Aug 10',
        meals: ['Breakfast', 'Lunch'],
        dishes: [
          {
            meal: 0,
            name: 'Classic molletes',
            kcal: 341,
            tags: ['Gluten', 'Dairy'],
            description: 'From the day\'s breakfast, alongside green chilaquiles and scrambled eggs.',
            image: assetSrc('food-breakfast-molletes'),
          },
          {
            meal: 1,
            name: 'Arrachera',
            kcal: 237,
            tags: ['Premium'],
            description: 'Flank steak from the grill menu, served as the premium option.',
            image: '/img/shared/services/comedor/arrachera-plato.jpg',
          },
          {
            meal: 1,
            name: 'Salad bar',
            kcal: 526,
            tags: ['Dairy', 'Sesame', 'Gluten', 'Fish'],
            description: 'Build your salad from the day\'s options.',
            image: '/img/shared/services/comedor/barra-ensaladas.jpg',
          },
        ],
      },
      tone: 'natural',
    },
    {
      key: 'serve',
      icon: 'people',
      stage: 'Show up',
      stageCopy: {
        before: 'The same people are there ',
        highlight: 'for every moment that matters',
        after: ', from coffee to key meetings.',
      },
      title: 'One active team across every moment of the day',
      copy: 'It is not a single service, it is full coverage. Dining, barista, breakfast, snacks & beverages, carts, and catering coordinated by Zitrone from start to finish.',
      panelTitle: 'One active team across every moment of the day',
      panelCopy:
        'It is not a single service, it is full coverage. Dining, barista, breakfast, snacks & beverages, carts, and catering coordinated by Zitrone from start to finish.',
      image: assetSrc('ops-operating-system-2'),
      visualWidget: {
        kind: 'service',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        /* Ford QBR Jan–May 2026: Delivery (coverage, stock-outs, monthly
           wait) and Volume (meals per month). */
        metrics: [
          { label: 'Staff coverage · May', value: 98.3, decimals: 1, suffix: '%', chart: { kind: 'meter', fill: 0.983 } },
          { label: 'Meals served a month', value: 11100, prefix: '~', chart: { kind: 'months', values: [11670, 11172, 10601, 10941, 11185] } },
          { label: 'Food stock-outs', value: 0, chart: { kind: 'zero' } },
          { label: 'Wait in line · target 7 min', value: 1.5, decimals: 1, suffix: ' min', chart: { kind: 'months', values: [8, 2.48, 1.74, 1.34, 1.49] } },
        ],
      },
      tone: 'sage',
    },
    {
      key: 'measure',
      icon: 'chart',
      stage: 'Evolve',
      stageCopy: {
        before: 'We listen and adapt so ',
        highlight: 'the service evolves with your operation',
        after: '.',
      },
      title: 'The program improves because we measure what matters',
      copy: 'We stay close every day through constant feedback, surveys, and regular reviews. We track satisfaction and the key metrics that matter, follow up on what we find, and keep improving. We do not wait for the complaint; we look for it first.',
      panelTitle: 'The program improves because we measure what matters',
      panelCopy:
        'We stay close every day through constant feedback, surveys, and regular reviews. We track satisfaction and the key metrics that matter, follow up on what we find, and keep improving. We do not wait for the complaint; we look for it first.',
      image: assetSrc('ops-operating-system-4'),
      visualWidget: {
        kind: 'score',
        title: 'Satisfaction',
        value: 94,
        valueLabel: '94%',
        delta: '+6 pts vs. Nov.',
        trend: {
          label: 'Scorecard',
          valueLabel: '95%',
          caption: 'Jan → May',
          points: [78, 74, 86.7, 88.3, 95],
          min: 70,
          max: 100,
        },
        bars: {
          label: 'Average wait time',
          valueLabel: '1.8 min',
          caption: 'Feb–May · was 8 min',
          /* Monthly wait, Feb–May (source QBR, Entrega slide). January's 8 min
             is the "before" and lives in the caption, not as a bar that would
             dwarf the rest. The headline is the mean of these four. */
          values: [2.48, 1.74, 1.34, 1.49],
        },
        channel: 'dining',
        messages: [
          { author: 'Clau H.', text: 'Thanks for the chilaquiles and the sopes 😍🌮' },
          { author: 'Nagib W.', text: 'Today’s breakfast enchiladas were delicious, thank you!' },
          { author: 'Ale R.', text: 'Thanks for this pound cake! It’s the most delicious one of all 🙌' },
          { author: 'Montse R.', text: 'Thank you so much for organizing these super cool initiatives!! 👏😄' },
          { author: 'Andrés A.', text: 'Very good, thank you! 🙌' },
        ],
      },
      tone: 'lime',
    },
  ],

  proofColumns: [
    [
      {
        variant: 'photo',
        title: 'Menus that balance flavor, variety, and nutrition',
        sub: 'Chefs and registered nutritionists develop fresh, balanced menus with rotation and adjustments based on consumption and team feedback.',
        image: assetSrc('site-hero-buffet-line'),
        alt: 'Fresh balanced menu in a Zitrone corporate dining room',
      },
      {
        variant: 'photo',
        title: 'Daily production and reliable supply',
        sub: 'We prepare food daily in our commissaries and also operate kitchens inside companies to maintain freshness, control, and continuity.',
        image: assetSrc('site-service-corporate-dining'),
        alt: 'Corporate dining room operated and supplied daily by Zitrone',
      },
    ],
    [
      {
        variant: 'photo',
        title: 'Food safety backed by Distintivo H',
        sub: 'Our commissaries hold Distintivo H and use documented food handling controls across production, transport, and service.',
        image: assetSrc('ops-hygiene'),
        alt: 'Food safety and Distintivo H standards at Zitrone',
      },
      {
        variant: 'studies',
        title: 'A dedicated team in your workplace',
        sub: 'We assign trained people who learn your schedules, protocols, and culture. Supervision and follow-up are part of the daily operation.',
        image: assetSrc('ops-trained-teams'),
        alt: 'Trained team operating workplace food services',
      },
    ],
    [
      {
        variant: 'logos',
        title: 'Proven experience in demanding operations',
        sub: 'Part of the daily operation at some of Mexico’s most important companies.',
        tone: 'green',
        hideLogos: true,
        stats: [
          { value: '17 years', label: 'of experience' },
          { value: '15,000', label: 'meals served every day' },
        ],
      },
    ],
  ],

  serviceLayers: [
    {
      title: S.dining.name,
      theme: 'dining',
      image: assetSrc('site-service-corporate-dining-food-hall'),
      copy: 'A complete fresh menu every day, with on-site or commissary production and full operations by Zitrone.',
      href: '/services/corporate-dining',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'Corporate, industrial or premium dining',
          text: 'Three formats, matched to your headcount and your shifts.',
          icon: 'utensils',
        },
        {
          title: 'With an **on-site kitchen** or **no kitchen on site**',
          text: 'Without one, the food arrives finished and delivered by us.',
          icon: 'chef',
        },
        {
          title: 'Menus designed by nutritionists',
          text: 'They change weekly, with a vegetarian option and allergens labelled.',
          icon: 'leaf',
        },
      ],
    },
    {
      title: S.cafe.name,
      theme: 'cafe',
      image: assetSrc('site-service-corporate-cafe'),
      copy: 'A complete cafe with barista, beverages, ready food, pastries, snacks, and fruit.',
      href: '/services/corporate-cafe',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'A coffee bar with specialty products',
          text: 'Coffees and teas made by a barista.',
          icon: 'coffee',
        },
        {
          title: 'Hot and cold food, to eat in or take away',
          text: 'Breakfasts, grab & go, fine pastries, snacks and more.',
          icon: 'utensils',
        },
        {
          title: 'Smoothies, frappés and cold-pressed juices',
          text: 'Shakes and cold drinks, beyond coffee.',
          icon: 'drink',
        },
      ],
    },
    {
      title: S.pantry.name,
      theme: 'pantry',
      image: assetSrc('site-service-pantry'),
      copy: 'Snacks and beverages operated by Zitrone, with open consumption or a per-person allocation, and personalised pricing.',
      href: '/services/pantry-restocking',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'Snacks, drinks, and fresh fruit every day',
          text: 'Zitrone people on site stock, hand out, and replenish.',
          icon: 'fruit',
        },
        {
          title: 'A catalogue chosen with you, healthy first',
          text: 'Fruit, bars, nuts, and lower-sugar snacks at eye level.',
          icon: 'leaf',
        },
        {
          title: 'Open consumption or a per-person allocation',
          text: 'Allocation sets per-person limits for a more controlled cost.',
          icon: 'people',
        },
      ],
    },
    {
      title: S.coffee.name,
      shortTitle: S.coffee.short,
      theme: 'coffee',
      image: assetSrc('site-service-coffee-and-water'),
      copy: 'Fresh-ground coffee and filtered water, with no upfront investment and maintenance included.',
      href: '/services/coffee-water',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'The machines are ours to provide',
          text: 'No equipment to buy or rent. Installation, restocking, cleaning and maintenance included.',
          icon: 'machine',
        },
        {
          title: 'Espresso, americano, cappuccino, cortado and latte',
          text: '100% arabica from Chiapas and Veracruz, plus hot chocolate and teas.',
          icon: 'coffee',
        },
        {
          title: 'Water cold, hot, ambient, and sparkling',
          text: 'Multi-stage filtration, with filter changes and microbiological testing every six months.',
          icon: 'water',
        },
      ],
    },
    {
      title: S['grab-go'].name,
      theme: 'grab-go',
      image: assetSrc('site-service-cart-full'),
      copy: 'A Zitrone-operated cart visits every floor with fresh ready food for your team to choose.',
      href: '/services/service-carts',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'A mobile service point, with nothing to build',
          text: 'You add workplace food without construction or fixed equipment.',
          icon: 'cart',
        },
        {
          title: 'Route and times defined with your operation',
          text: 'We bring the cart, the product and the people, restocked daily.',
          icon: 'clock',
        },
        {
          title: 'From savoury to fruit, ready to eat',
          text: 'Salads, sandwiches, wraps, pasta and the dish of the day.',
          icon: 'utensils',
        },
      ],
    },
    {
      title: S.catering.name,
      theme: 'catering',
      image: assetSrc('site-service-catering-buffet'),
      copy: 'Custom corporate events with food, setup, tableware, and servers coordinated by Zitrone.',
      href: '/services/corporate-catering',
      ctaLabel: 'Learn more',
      features: [
        {
          title: 'Coffee break, breakfast, box lunch or a plated meal',
          text: 'We pick the format to match the moment of the event.',
          icon: 'calendar',
        },
        {
          title: 'Catalogue packages or a custom proposal',
          text: 'Menus built around the tastes and restrictions of your guests.',
          icon: 'chat',
        },
        {
          title: 'Setup, tableware, linens and servers coordinated',
          text: 'One provider produces, sets up and serves the event.',
          icon: 'people',
        },
      ],
    },
  ],

  profilerSizeOptions: [
    { label: 'Fewer than 50', value: 'xs' },
    { label: '50 to 150', value: 's' },
    { label: '150 to 500', value: 'm' },
    { label: 'More than 500', value: 'l' },
    { label: 'It varies, or not sure yet', value: 'unsure' },
  ],

  profilerMoments: [
    {
      id: 'lunch',
      title: 'The daily meal',
      text: 'A full meal for the team, every day.',
    },
    {
      id: 'breakfast',
      title: 'Breakfast',
      text: 'For teams that start early.',
    },
    {
      id: 'coffee',
      title: 'Coffee machines',
      text: 'Fresh-ground coffee, throughout the day.',
    },
    {
      id: 'snacks',
      title: 'Snacks & drinks',
      text: 'Available between meals.',
    },
    {
      id: 'water',
      title: 'Water dispensers',
      text: 'Filtered water for the whole office.',
    },
    {
      id: 'events',
      title: 'Catering',
      text: 'Food per event: meetings, celebrations and visits.',
    },
  ],

  profilerStyles: [
    {
      id: 'selfserve',
      title: 'Buffet',
      text: 'Guests serve themselves, always available.',
    },
    {
      id: 'staffed',
      title: 'Assisted by Zitrone staff',
      text: 'A bar or a point run by our team.',
    },
    {
      id: 'recommend',
      title: 'You recommend',
      text: 'Zitrone proposes based on size and space.',
    },
  ],

  profilerServices: [
    {
      id: 'comedor',
      title: S.dining.name,
      accent: 'dining',
      href: '/services/corporate-dining',
    },
    {
      id: 'cafeteria',
      title: S.cafe.name,
      accent: 'cafe',
      href: '/services/corporate-cafe',
    },
    {
      id: 'pantry',
      title: S.pantry.name,
      accent: 'pantry',
      href: '/services/pantry-restocking',
    },
    {
      id: 'maquinas',
      title: S.coffee.name,
      accent: 'cafe',
      href: '/services/coffee-water',
    },
    {
      id: 'carritos',
      title: S['grab-go'].name,
      accent: 'pantry',
      href: '/services/service-carts',
    },
    {
      id: 'catering',
      title: S.catering.name,
      accent: 'catering',
      href: '/services/corporate-catering',
    },
  ],

  clientStories: [
    {
      name: 'Uber',
      label: 'Uber story',
      role: 'Food Program Manager, Americas',
      logo: `${assetPath}/img/shared/clients/mono/uber.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/uber.jpg`,
      repeatsHero: true,
      location: 'Mexico City',
      imageAlt: 'Zitrone workplace food operation',
      quote:
        'Zitrone has been a valued and highly professional food service partner for our team in Mexico City since 2018. Their dedication to operational excellence is evident in the quality of the daily service.',
      quoteHighlight: 'operational excellence',
    },
    {
      name: 'Pinterest',
      label: 'Pinterest story',
      role: 'Employee microkitchen & catering program',
      logo: `${assetPath}/img/shared/clients/mono/pinterest.svg`,
      logoFit: 'compact',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/pinterest.jpg`,
      repeatsHero: true,
      location: 'Mexico City',
      imageAlt: 'Zitrone microkitchen and catering program',
      quote:
        'Their service is reliable and attentive, with excellent, thoughtfully curated products that our teams love. Their proactive support streamlines our operations.',
      quoteHighlight: 'proactive support',
    },
    {
      name: 'Stripe',
      label: 'Stripe story',
      role: 'Workplace Experience Manager LATAM',
      logo: `${assetPath}/img/shared/clients/mono/stripe.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/stripe.jpg`,
      repeatsHero: true,
      location: 'Mexico City',
      imageAlt: 'Zitrone workplace catering and pantry service',
      quote:
        'The breakfast, lunch, snacks, and beverage options align perfectly with our food philosophy. The service and attention from the entire team have been exceptional.',
      quoteHighlight: 'our food philosophy',
    },
    {
      name: 'Salesforce',
      label: 'Salesforce story',
      role: 'Workplace Services Manager',
      logo: `${assetPath}/img/shared/clients/mono/salesforce-lockup.svg`,
      logoFit: 'balanced',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/salesforce.jpg`,
      location: 'Mexico City',
      imageAlt: 'Zitrone barista, pantry, and catering operation',
      quote:
        'Their greatest strength has always been the same: the ability to adapt to client needs and personalize every detail to match each company’s culture.',
      quoteHighlight: 'adapt to client needs',
    },
    {
      name: 'Capital One',
      label: 'Capital One story',
      role: 'Third Party Management Manager',
      logo: `${assetPath}/img/shared/clients/mono/capital-one.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/capital-one.jpg`,
      location: 'Mexico City',
      imageAlt: 'Zitrone enterprise workplace food program',
      quote:
        'Zitrone has been an excellent strategic partner, offering services and processes for a complex project without risking quality or customer service.',
      quoteHighlight: 'strategic partner',
    },
    {
      name: 'Nike',
      label: 'Nike story',
      role: 'Corporate dining program',
      logo: `${assetPath}/img/shared/clients/mono/nike.svg`,
      logoFit: 'compact',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/nike-v2.jpg`,
      location: 'Mexico City',
      imageAlt: 'Zitrone corporate dining operation',
      quote:
        'We appreciate their willingness to work around our requirements and hope they continue improving to reach the standards we need.',
      quoteHighlight: 'our requirements',
    },
    {
      name: 'AT&T',
      label: 'AT&T story',
      role: 'Benefits, Inclusion & Culture Director',
      logo: `${assetPath}/img/shared/clients/mono/att.svg`,
      logoFit: 'balanced',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/att.jpg`,
      location: 'Mexico City',
      imageAlt: 'Zitrone enterprise food service partnership',
      quote:
        'Their willingness to adapt to our requirements and the excellence in the way they treat our employees have been key to building trust and collaboration.',
      quoteHighlight: 'trust and collaboration',
    },
  ],

  faqs: [
    {
      question: 'What kind of companies does Zitrone support?',
      answer: [
        'Zitrone supports modern companies that need food to work reliably across the day: daily dining, workplace snacks and beverages, cafe stations, coffee and water, grab-and-go meals, and corporate events.',
        'The service model can start small or scale into a complete operating system, depending on team size, available space, and the level of daily support required.',
      ],
    },
    {
      question: 'Do we need an on-site kitchen?',
      answer: [
        'No. Zitrone can operate a dedicated kitchen inside your facility when infrastructure exists, or supply daily meals from its central commissary with transport and service handled by Zitrone.',
        'For commissary-fed dining, the client typically needs a serving area, dining room, utilities, and a daily headcount commitment, not a full production kitchen.',
      ],
    },
    {
      question: 'How does Zitrone manage food safety?',
      answer: [
        'Our commissaries hold the Distintivo H, the certification Mexico\'s Ministries of Tourism and Health award to kitchens that meet the official standards for hygienic food handling.',
        'On top of that, Zitrone uses documented food-safety controls across production, transport, and service: temperature logging, CAMBRO containers, retained samples, raw-material logs, and trained food-handling teams.',
        'Services are supported by hygiene protocols, scheduled testing, and operating standards designed for enterprise workplaces where reliability and documentation matter.',
      ],
    },
    {
      question: 'Can we combine services?',
      answer: [
        'Yes. You can hire a single service or several at once: for example, dining for the daily meal, coffee and snacks through the day, and catering for meetings and events.',
        'Combining services creates one relationship for the full workday: dining, cafe, snacks & beverages, coffee & water, service carts, and catering are coordinated through one operator.',
      ],
    },
    {
      question: 'How are menus planned?',
      answer: [
        'Menus are designed by professional chefs and registered nutritionists, with a rotating cycle, caloric values, allergen information, themed menus, and advance publication for teams.',
      ],
    },
  ],

  footerColumns: [
    {
      label: 'Zitrone',
      links: [
        { href: '#service-system', label: 'Services' },
        { href: '#outcomes', label: 'How we work' },
        { href: '#profiler', label: 'Find your solution' },
        { href: '#stories', label: 'Client stories' },
        { href: '#faq', label: 'FAQs' },
      ],
    },
    {
      label: 'Services',
      links: [
        { href: '/services', label: 'All services' },
        { href: '/services/corporate-dining', label: S.dining.name },
        { href: '/services/corporate-cafe', label: S.cafe.name },
        { href: '/services/pantry-restocking', label: S.pantry.name },
        { href: '/services/coffee-water', label: S.coffee.name },
        { href: '/services/service-carts', label: S['grab-go'].name },
        { href: '/services/corporate-catering', label: S.catering.name },
      ],
    },
    {
      label: 'Resources',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/blog/feed.xml', label: 'Blog RSS feed' },
      ],
    },
  ],

  sections: {
    hero: {
      navAriaLabel: 'Primary',
      mobileNavAriaLabel: 'Primary mobile',
      menuOpenLabel: 'Open menu',
      menuCloseLabel: 'Close menu',
      cta: { label: 'Contact us', href: contactHref('nav') },
      title: 'Food that nourishes your team.',
      titleEmphasis: 'nourishes',
      frames: [
        {
          pillar: 'nourishment',
          accentWord: 'nourishes',
          image: assetSrc('site-hero-dining-hall-skyline'),
          alt: 'Corporate dining hall in full service',
        },
        {
          pillar: 'care',
          accentWord: 'nurtures',
          image: assetSrc('site-hero-coffee-bar-lounge'),
          alt: 'Workplace cafe and barista bar',
        },
        {
          pillar: 'connection',
          accentWord: 'connects',
          image: assetSrc('site-hero-buffet-line'),
          alt: 'Buffet line during lunch service',
        },
        {
          pillar: 'momentum',
          accentWord: 'powers',
          image: assetSrc('site-hero-food-hall'),
          alt: 'Corporate dining hall with a beverage island and service counters',
        },
      ],
      copy: 'We work inside your workplace, understand your culture, and build a food experience that reflects and energizes your team.',
      copyShort: 'A food experience that reflects and energizes your team, inside your workplace.',
      ribbonLabel: 'Brands that trust Zitrone',
      ribbonStat: { value: 15000, label: 'Meals served daily at great companies:' },
      marqueeAriaLabel: 'Credentials',
    },

    services: {
      kicker: 'Service formats',
      titleAriaLabel: 'And every moment, made to fit your company.',
      titleWords: [
        { text: 'And' },
        { text: 'every' },
        { text: 'moment,' },
        { text: 'made', accent: true },
        { text: 'to', accent: true },
        { text: 'fit', accent: true },
        { text: 'your', accent: true },
        { text: 'company.', accent: true },
      ],
      copy: 'Every service, coordinated by one team and adapted to your company\'s operation, culture, and people.',
      /* The cover over the service strip: names the formats themselves, so it
         does not repeat the spotlight intro, which uses `copy`. */
      coverCopy: 'A complete service we build with you, format by format, around your culture, your needs and your budget, so it feels like your own.',
      ctaPrimary: { label: 'View services', href: '/services' },
      ctaSecondary: { label: 'Contact us', href: contactHref('home-services') },
    },

    operatingSystem: {
      kicker: 'How we work with you',
      titleAriaLabel: 'Every detail, shaped around your people.',
      titleWords: [
        { text: 'Every' },
        { text: 'detail,' },
        { text: 'shaped', accent: true },
        { text: 'around', accent: true },
        { text: 'your', accent: true },
        { text: 'people.', accent: true },
      ],
      copy: 'Before we propose a menu, we get to know your schedules, your spaces and your people. Then we look after every service and refine it with what your team tells us.',
      ctaPrimary: { label: 'View services', href: '/services' },
    },

    proof: {
      kicker: 'Experience in workplace food services',
      clientLogosAriaLabel: 'Zitrone client logos',
      headingAriaLabel: 'The companies that care for their people choose Zitrone',
      headingLead: 'The companies that care for their people choose',
      headingAccent: 'Zitrone',
      headingTrail: '',
      copy: 'More than 17 years operating corporate dining rooms and workplace food services in Mexico. We combine daily production, trained teams, and processes that maintain quality from end to end.',
    },

    featuredMedia: {
      label: 'Featured media',
      ariaLabel: 'Featured media references',
      logos: [
        {
          id: 'el-financiero',
          src: `${assetPath}/img/shared/media/el-financiero.svg`,
          alt: 'El Financiero',
          fit: 'wide',
          scale: 1.06,
        },
        {
          id: 'el-universal',
          src: `${assetPath}/img/shared/media/el-universal.svg`,
          alt: 'El Universal',
          fit: 'wide',
          scale: 1.02,
        },
        {
          id: 'entrepreneur',
          src: `${assetPath}/img/shared/media/entrepreneur.svg`,
          alt: 'Entrepreneur',
          fit: 'wide',
          scale: 1.02,
        },
        {
          id: 'mundo-ejecutivo',
          src: `${assetPath}/img/shared/media/mundo-ejecutivo.svg`,
          alt: 'Mundo Ejecutivo',
          fit: 'wide',
          scale: 1.04,
        },
        {
          id: 'reforma',
          src: `${assetPath}/img/shared/media/reforma.svg`,
          alt: 'Periódico Reforma',
          fit: 'wide',
          scale: 1.04,
        },
      ],
    },

    stories: {
      titleAriaLabel: 'The most demanding teams trust Zitrone',
      titleWords: [
        { text: 'The' },
        { text: 'most' },
        { text: 'demanding', accent: true },
        { text: 'teams' },
        { text: 'trust' },
        { text: 'Zitrone' },
      ],
      cta: { label: 'Contact us', href: contactHref('home-proof') },
      panelCta: { label: 'Contact us', href: contactHref('home-proof-panel') },
    },

    faq: {
      heading: 'FAQs',
      headingLead: 'FAQs',
      ctaTitle: 'Have more questions?',
      ctaCopy: 'Tell us what your team needs and we will shape the right solution for the workday.',
      cta: { label: 'Contact us', href: contactHref('home-faq') },
    },

    footer: {
      ariaLabel: 'Zitrone site footer',
      tagline: 'When food works, the day works better.',
      taglineEmphasis: 'day works better',
      ctaPrimary: {
        label: 'Contact us',
        href: contactHref('footer'),
      },
      ctaSecondary: { label: 'View services', href: '/services' },
      contactLabel: 'Contact',
      address: [
        'Calle 3 13-1, Alce Blanco',
        '53370 Naucalpan de Juárez',
        'State of Mexico',
      ],
      contactLinks: [
        { label: 'General inquiries', href: 'mailto:opina@zitrone.com.mx' },
        { label: 'Phone', href: 'tel:+525512054000' },
      ],
      legal: {
        copyright: '© 2026 Zitrone',
        links: [
          { label: 'Privacy notice', href: '/privacy-notice' },
          { label: 'Billing', href: 'mailto:facturacion@zitrone.com.mx,contabilidad@zitrone.com.mx?subject=Invoice%20request%20%2F%20Solicitud%20de%20factura&body=Attached%20are%20my%20RFC%20and%20purchase%20ticket.' },
        ],
      },
      socialsLabel: 'Social media',
      socialLinks: [
        {
          icon: 'instagram',
          label: 'Zitrone on Instagram',
          href: 'https://www.instagram.com/zitrone_mx/',
        },
        { icon: 'twitter', label: 'Zitrone on X', href: 'https://twitter.com/ZitroneNatural' },
        {
          icon: 'facebook',
          label: 'Zitrone on Facebook',
          href: 'https://www.facebook.com/ZitroneMx/',
        },
        {
          icon: 'linkedin',
          label: 'Zitrone on LinkedIn',
          href: 'https://mx.linkedin.com/company/zitrone-natural',
        },
      ],
    },
  },
}
