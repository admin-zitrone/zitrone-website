import type { HomeContent } from './types'
import { assetPath, contactHref, createHeroLogos, homeAssetPaths } from './shared'
import { assetSrc } from '@/lib/assets.generated'
import { SERVICE_NAMES, serviceNameList } from '@/lib/service-names'

const testimonialPhotoAssetPath = homeAssetPaths.testimonialPhotos
const S = SERVICE_NAMES.es

export const homeContentEs: HomeContent = {
  meta: {
    title: 'Zitrone — Una mejor experiencia de comida para el trabajo moderno',
    description:
      `Zitrone diseña y opera ${serviceNameList('es')} para lugares de trabajo en México.`,
    siteName: 'Zitrone',
    ogImage: assetSrc('site-og-card'),
  },
  componentLabels: {
    servicesCarousel: {
      regionLabel: 'Programas de servicio',
      previous: 'Servicio anterior',
      next: 'Servicio siguiente',
      progressLabel: 'Avance de los programas de servicio',
      slideTemplate: 'Diapositiva {current} de {total}',
      viewService: 'Conocer más',
      logosAriaLabel: 'Logotipos de clientes de Zitrone',
    },
    serviceSystem: {
      kicker: 'Servicios de alimentación para empresas',
      titleLine1: 'Una solución para cada',
      titleLine2: 'momento del día',
      titleAriaLabel:
        `Una solución para cada momento del día: ${serviceNameList('es')}.`,
      ctaLabel: 'Ver servicios',
      navAriaLabel: 'Categorías de servicio',
      progressAriaLabel: 'Avance de los programas de servicio',
      progressValueTextTemplate: 'Programa {current} de {total}',
      eyebrowTemplate: 'Programa {index}',
      previous: 'Programa anterior',
      next: 'Programa siguiente',
      viewDetails: 'Ver detalles',
      hideDetails: 'Ocultar detalles',
    },
    systemTabs: {
      sectionLabel: 'Cómo trabajamos',
      listAriaLabel: 'Pasos del programa Zitrone',
      previous: 'Paso anterior',
      next: 'Paso siguiente',
    },
    storiesTabs: {
      tablistAriaLabel: 'Casos de clientes',
    },
    profiler: {
      kicker: 'Recomendación personalizada',
      stepWord: 'Paso',
      ofWord: 'de',
      stages: {
        site: 'Sitio',
        schedule: 'Horario',
        food: 'Comida',
        space: 'Espacio',
        terms: 'Condiciones',
        contact: 'Contacto',
      },
      stageAria: 'Avance del cuestionario',
      q1Heading: '¿Cuántas personas hay en tu sitio en un día normal?',
      q1Copy:
        'El tamaño decide qué formatos tienen sentido económico. Por eso es lo primero que preguntamos.',
      q1AriaLabel: 'Personas en sitio por día',
      q2Heading: '¿Qué momentos del día quieres resolver?',
      q2Copy: 'Marca todos los que apliquen. Cada momento se resuelve con un formato distinto.',
      q3Heading: '¿Cómo te imaginas el servicio en el día a día?',
      q3Copy: 'Esto define si proponemos máquinas, carritos o una barra atendida.',
      q3AriaLabel: 'Estilo de servicio',
      back: 'Atrás',
      seeRecommendation: 'Ver recomendación',
      startOver: 'Empezar de nuevo',
      sectionHeading: 'Descubre qué servicio le conviene a tu equipo',
      sectionHeadingEmphasis: 'le conviene',
      introCopy:
        'Cuéntanos cómo opera tu sitio y te decimos cuál es el mejor punto de partida.',
      startLabel: 'Empezar',
      continueLabel: 'Continuar',
      skipLabel: 'Omitir',
      editLabel: 'Editar',
      scenes: {
        site: {
          title: '¿Cuántas personas hay en tu sitio en un día normal?',
          copy: 'El tamaño decide qué formatos tienen sentido económico. Por eso es lo primero que preguntamos.',
        },
        location: {
          title: '¿Dónde está el sitio?',
          copy: 'La ciudad define la logística y desde qué cocina podemos operar.',
        },
        payment: {
          title: '¿Cómo son sus condiciones de pago?',
          copy: 'Opcional, pero saberlo evita una vuelta en la negociación.',
        },
        schedule: {
          title: '¿Qué días opera el servicio?',
          copy: 'Marca los días de servicio y los momentos de comida. Ajusta las personas de cada turno.',
        },
        food: {
          title: '¿Qué tipo de comida necesitan?',
          copy: 'El nivel de menú define el costo por comida y la operación en sitio.',
        },
        space: {
          title: '¿Con qué instalaciones cuentan?',
          copy: 'Esto define si producimos en tu sitio o llega desde comisariato.',
        },
        terms: {
          title: 'Las condiciones comerciales',
          copy: 'Todo esto es opcional. Lo que nos digas aquí acelera la propuesta.',
        },
        start: {
          title: '¿Para cuándo lo necesitan?',
          copy: 'Con esto cerramos. Te respondemos con una propuesta concreta.',
        },
      },
      brief: {
        title: 'Tu brief',
        peopleTemplate: '{count} personas',
        reviewTitle: 'Lo que nos dijiste',
        pending: 'Pendiente',
        undecided: 'Lo definimos juntos',
        people: 'Personas',
        location: 'Ubicación',
        days: 'Días',
        shifts: 'Turnos',
        menu: 'Menú',
        space: 'Instalaciones',
        terms: 'Condiciones',
        start: 'Arranque',
        leaning: 'Vamos hacia',
      },
      site: {
        headcountLabel: 'Personas en sitio en un día normal',
        headcountAria: 'Personas en sitio por día',
        headcountMax: '2,000 o más',
        mealsTemplate: 'Alrededor de {meals} comidas al día',
        unsureLabel: 'Varía o aún no lo sé',
        stateLabel: 'Estado de la república',
        statePlaceholder: 'Escribe una ciudad',
      },
      schedule: {
        daysLabel: 'Días de servicio',
        daysAria: 'Días de servicio',
        dayNames: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
        dayNamesLong: [
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
          'Domingo',
        ],
        presetWeekdays: 'L a V',
        presetSixDays: 'L a S',
        presetAll: 'Todos',
        shiftsLabel: '¿Qué comidas necesitan y para cuántas personas?',
        shiftsAria: 'Momentos de comida',
        peopleAria: 'Personas en este turno',
        mealsUnit: 'comidas',
        weekdaysSummary: 'L a V',
        allDaysSummary: 'Todos los días',
      },
      food: {
        tierLabel: 'Tipo de menú',
        tierAria: 'Tipo de menú',
        extrasLabel: '¿Qué más quieres cubrir?',
        styleLabel: '¿Cómo te imaginas el servicio?',
        styleAria: 'Estilo de servicio',
      },
      space: {
        facilityLabel: 'Instalaciones en sitio',
        facilityAria: 'Instalaciones en sitio',
      },
      terms: {
        subsidizedLabel: '¿La empresa subsidia el servicio?',
        subsidizedAria: 'Servicio subsidiado por la empresa',
        subsidyLabel: '¿Cuánto cubre la empresa?',
        subsidyAria: 'Porcentaje subsidiado por la empresa',
        subsidyTemplate:
          'La empresa cubre {company}% y el colaborador {employee}%.',
        budgetLabel: 'Precio meta por comida',
        budgetAria: 'Precio meta por comida en pesos',
        budgetTemplate: '${amount} MXN por comida',
        budgetMax: '$350 o más',
        budgetOptOut: 'Prefiero no decirlo',
      },
      start: {
        dateLabel: 'Fecha ideal de inicio',
        dateAria: 'Fecha ideal de inicio',
        flexibleLabel: 'La fecha es flexible',
        monthNames: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        notesLabel: '¿Alguna solicitud en particular?',
        notesPlaceholder:
          'Alergias, certificaciones, sindicato, menús específicos, lo que sea relevante.',
        contactLabel: 'Para enviarte la propuesta',
        nameLabel: 'Nombre',
        companyLabel: 'Empresa',
        emailLabel: 'Correo',
        phoneLabel: 'Teléfono',
        phoneOptional: 'opcional',
        submit: 'Enviar brief',
        sending: 'Enviando…',
        sendError: 'No se pudo enviar. Inténtalo de nuevo o escríbenos a opina@zitrone.com.mx.',
        sourceLabel: '¿Cómo te enteraste de Zitrone?',
      },
      shifts: [
        { id: 'breakfast', label: 'Desayuno' },
        { id: 'lunch', label: 'Comida' },
        { id: 'dinner', label: 'Cena' },
        { id: 'night', label: 'Turno nocturno' },
      ],
      menuTiers: [
        {
          id: 'industrial',
          label: 'Industrial',
          note: 'Menú de alto volumen para planta y operación.',
        },
        {
          id: 'corporativo',
          label: 'Corporativo',
          note: 'Menú balanceado con variedad diaria para oficina.',
        },
        {
          id: 'premium',
          label: 'Corporativo premium',
          note: 'Estaciones, ingredientes de autor y más rotación.',
        },
        {
          id: 'recommend',
          label: 'Recomiéndennos',
          note: 'Zitrone propone según tamaño, espacio y presupuesto.',
        },
      ],
      facilities: [
        {
          id: 'full-kitchen',
          label: 'Cocina completa',
          note: 'Se puede producir en sitio.',
        },
        {
          id: 'serving-only',
          label: 'Solo espacio para servir',
          note: 'Comedor o barra, sin cocina de producción.',
        },
        {
          id: 'none',
          label: 'Nada todavía',
          note: 'Hay que definir el espacio con ustedes.',
        },
      ],
      subsidizedOptions: [
        { id: 'yes', label: 'Sí' },
        { id: 'no', label: 'No' },
        { id: 'tbd', label: 'Por definir' },
      ],
      sourceOptions: [
        { id: 'referral', label: 'Recomendación' },
        { id: 'search', label: 'Buscador' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'event', label: 'Un evento' },
        { id: 'other', label: 'Otro' },
      ],
      talkToZitrone: 'Hablar con Zitrone',
      contactEmail: 'opina@zitrone.com.mx',
      subjectPrefix: 'Hablemos:',
      subjectFallback: 'Ayúdenme a elegir el servicio correcto',
      startHere: 'Empieza aquí',
      alsoLabel: 'También podemos cubrir',
      learnMore: 'Conoce el servicio',
      closingNote:
        'Puedes empezar con un solo servicio y sumar el resto cuando tenga sentido, con el mismo equipo.',
      uncoveredNote:
        'Algo de lo que marcaste no aparece aquí: no todos los formatos tienen sentido a cada escala. Escríbenos y lo revisamos contigo.',
      verdictStrong: {
        heading: 'Así empezaríamos contigo.',
        body: 'Con base en lo que marcaste, este es el punto de partida que propondríamos. Todo opera bajo un mismo equipo y una sola factura.',
      },
      verdictLean: {
        heading: 'Hay un camino más ligero.',
        body: 'Para menos de 50 personas, un comedor completo rara vez justifica su costo fijo. Esto es lo que sí funciona a tu escala.',
      },
      verdictCustom: {
        heading: 'Mejor lo vemos juntos.',
        body: 'Con lo que nos cuentas hay más de un camino posible. Escríbenos y te ayudamos a definir el punto de partida.',
      },
      reasons: {
        'comedor-full':
          'Comida completa cada día, con cocina en sitio o entrega desde comisariato y operación completa por Zitrone.',
        'comedor-full-breakfast':
          'Comida completa cada día, con cocina en sitio o comisariato. El desayuno se integra al mismo servicio.',
        'comedor-comisariato':
          'A tu escala funciona el formato comisariato: comida completa cada día sin instalar una cocina en tu oficina.',
        'comedor-comisariato-breakfast':
          'A tu escala funciona el formato comisariato: comida completa cada día sin instalar cocina. El desayuno se integra al mismo servicio.',
        'cafeteria-hub':
          'Una barra con barista concentra café, comida lista, pastelería y snacks en un solo punto atendido.',
        'cafeteria-morning':
          'Cubre las mañanas con bebidas preparadas al momento y comida lista para llevar.',
        'pantry-daily':
          'Snacks y bebidas con consumo abierto o asignación por persona, y precio según los productos que elijas.',
        'maquinas-coffee': 'Café recién molido sin inversión inicial y con mantenimiento incluido.',
        'maquinas-water':
          'Agua filtrada para toda la oficina, sin inversión inicial y con mantenimiento incluido.',
        'maquinas-coffee-water':
          'Café recién molido y agua filtrada, sin inversión inicial y con mantenimiento incluido.',
        'carritos-floors':
          'Un carrito operado por Zitrone recorre cada piso con comida fresca, sin necesidad de un punto fijo.',
        'catering-events': 'Comida, montaje, loza y meseros coordinados por Zitrone, por evento.',
        'catering-box-lunch':
          'Box lunch y comidas de trabajo por pedido: resuelven la comida del día sin el costo fijo de un comedor.',
        'catering-box-lunch-events':
          'Box lunch para el día a día y catering completo para tus eventos, con el mismo equipo.',
      },
    },
  },
  primaryNav: [
    { href: '#service-system', label: 'Servicios' },
    { href: '#outcomes', label: 'Cómo trabajamos' },
    { href: '/es/blog', label: 'Blog' },
    { href: '#faq', label: 'FAQs' },
    { href: '#cta', label: 'Contacto' },
  ],

  heroLogos: createHeroLogos(),

  serviceCards: [
    {
      title: S.dining.name,
      eyebrow: 'Programa 01',
      accent: 'dining',
      image: assetSrc('site-service-corporate-dining-food-hall'),
      copy: 'Menú completo y fresco cada día, con cocina en sitio o entrega desde comisariato y operación completa por Zitrone.',
      href: '/services/comedor-corporativo',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/cafeteria-corporativa', label: S.cafe.name },
        { href: '/services/pantry-y-restocking', label: S.pantry.name },
        { href: '/services/catering-corporativo', label: S.catering.name },
      ],
    },
    {
      title: S.cafe.name,
      eyebrow: 'Programa 02',
      accent: 'cafe',
      image: assetSrc('site-service-corporate-cafe'),
      copy: 'Una cafetería completa con barista, bebidas recién preparadas, comida lista, pastelería, snacks y fruta.',
      href: '/services/cafeteria-corporativa',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/cafe-y-agua', label: S.coffee.name },
        { href: '/services/carritos-de-servicio', label: S['grab-go'].name },
        { href: '/services/comedor-corporativo', label: S.dining.name },
      ],
    },
    {
      title: S.pantry.name,
      eyebrow: 'Programa 03',
      accent: 'pantry',
      image: assetSrc('site-service-pantry'),
      copy: 'Snacks y bebidas operados por Zitrone, con consumo abierto o asignación por persona y precio a la medida.',
      href: '/services/pantry-y-restocking',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/carritos-de-servicio', label: S['grab-go'].name },
        { href: '/services/cafe-y-agua', label: S.coffee.name },
        { href: '/services/comedor-corporativo', label: S.dining.name },
      ],
    },
    {
      title: S.coffee.name,
      eyebrow: 'Programa 04',
      accent: 'cafe',
      image: assetSrc('site-service-coffee-and-water'),
      copy: 'Café recién molido y agua filtrada, sin inversión inicial y con mantenimiento incluido.',
      href: '/services/cafe-y-agua',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/cafeteria-corporativa', label: S.cafe.name },
        { href: '/services/pantry-y-restocking', label: S.pantry.name },
        { href: '/services/carritos-de-servicio', label: S['grab-go'].name },
      ],
    },
    {
      title: S['grab-go'].name,
      eyebrow: 'Programa 05',
      accent: 'pantry',
      image: assetSrc('site-service-cart'),
      copy: 'Un carrito operado por Zitrone recorre cada piso con comida fresca y lista para elegir.',
      href: '/services/carritos-de-servicio',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/pantry-y-restocking', label: S.pantry.name },
        { href: '/services/cafe-y-agua', label: S.coffee.name },
        { href: '/services/comedor-corporativo', label: S.dining.name },
      ],
    },
    {
      title: S.catering.name,
      eyebrow: 'Programa 06',
      accent: 'catering',
      image: assetSrc('site-service-catering-buffet'),
      copy: 'Eventos a la medida con comida, montaje, loza y meseros coordinados por Zitrone.',
      href: '/services/catering-corporativo',
      ctaLabel: 'Conoce más',
      relatedLinks: [
        { href: '/services/comedor-corporativo', label: S.dining.name },
        { href: '/services/cafeteria-corporativa', label: S.cafe.name },
        { href: '/services/carritos-de-servicio', label: S['grab-go'].name },
      ],
    },
  ],

  servicesOrbitItems: [
    {
      title: 'Desayunos',
      theme: 'dining',
      image: assetSrc('food-breakfast-molletes'),
      copy: 'Un buen arranque para quienes llegan temprano, con un montaje completo cada mañana en el comedor.',
    },
    {
      title: 'Menús premium',
      theme: 'dining',
      image: assetSrc('site-service-detail-chef-plated-dish'),
      copy: 'Menús de chef con proteínas especiales, repostería fina y servicio tipo restaurante, para el día a día o tu comedor ejecutivo.',
    },
    {
      title: 'Barras de café',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/bebidas-cup.jpg',
      copy: 'Baristas que preparan espresso, lattes, cappuccinos y chai al momento, sin salir de la oficina.',
    },
    {
      title: 'Barras de ensaladas',
      theme: 'dining',
      image: '/img/shared/services/comedor/barra-ensaladas-tazones.jpg',
      copy: 'Hojas frescas, vegetales, proteínas y toppings para que cada quien arme su ensalada, todos los días.',
    },
    {
      title: 'Box lunches',
      theme: 'catering',
      image: '/img/shared/services/catering/box-lunch.jpg',
      copy: 'Comidas individuales completas para capacitaciones, lanzamientos y juntas que no se pueden detener.',
    },
    {
      title: 'Poke bowls',
      theme: 'dining',
      image: '/img/shared/services/comedor/poke-bowl.jpg',
      copy: 'Ingredientes frescos y combinaciones flexibles para una comida ligera y llena de color.',
    },
    {
      title: 'Coffee breaks',
      theme: 'catering',
      image: '/img/shared/services/catering/event-breakfast-setup.png',
      copy: 'Café, fruta, repostería y sándwiches para recargar energía entre una sesión y otra.',
    },
    {
      title: 'Grab & Go',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/vitrina-ready-to-go.jpg',
      copy: 'Sándwiches, ensaladas, fruta, postres y bebidas listos en vitrina para comer bien sin frenar el día.',
    },
    {
      title: 'Estaciones de tacos',
      theme: 'dining',
      image: '/img/shared/services/comedor/taco-station.jpg',
      copy: 'Tortillas calientes, proteínas y toppings preparados al momento, como parte del menú del comedor.',
    },
    {
      title: 'Snacks saludables',
      theme: 'pantry',
      image: '/img/shared/services/pantry/bento-healthy.jpg',
      copy: 'Fruta y opciones ligeras siempre a la mano para picar algo bueno durante la jornada.',
    },
    {
      title: 'Barras de grill',
      theme: 'dining',
      image: '/img/shared/services/comedor/barra-grill.jpg',
      copy: 'Proteínas frescas terminadas al grill al momento, dentro del comedor.',
    },
    {
      title: 'Jugos y smoothies',
      theme: 'cafe',
      image: '/img/shared/services/cafeteria/green-smoothie.jpg',
      copy: 'Opciones frías recién preparadas en la cafetería, para cuando el día pide algo más que café.',
    },
    {
      title: 'Bebidas frías',
      theme: 'pantry',
      image: assetSrc('pantry-cooler-shelf-portrait'),
      copy: 'Aguas, refrescos, jugos, kombuchas y bebidas vegetales bien frías, resurtidas antes de que se acaben.',
    },
    {
      title: 'Snacks y dulces',
      theme: 'pantry',
      image: assetSrc('pantry-snacks'),
      copy: 'Papas, galletas, palomitas y gomitas en porciones individuales, siempre surtidas.',
    },
    {
      title: 'Barras de pizzas',
      theme: 'dining',
      image: assetSrc('food-pizza-station'),
      copy: 'Una estación que rota en el comedor y le da a la semana un antojo distinto.',
    },
    {
      title: 'Máquinas de café',
      theme: 'coffee',
      image: '/img/shared/services/cafeteras/person-machine.jpg',
      copy: 'Café molido al momento en tu oficina, con equipo, insumos, limpieza y mantenimiento a nuestro cargo.',
    },
    {
      title: 'Pan y pastelería',
      theme: 'cafe',
      image: '/img/shared/services/catering/concha-pan-dulce.jpg',
      copy: 'Pan recién horneado y postres del día en la cafetería, para acompañar el café o darse un gusto.',
    },
    {
      title: 'Dispensadores de agua',
      theme: 'coffee',
      image: '/img/shared/services/water/person-dispenser-portrait.jpg',
      copy: 'Agua fría, caliente, al tiempo o con gas, con filtros y mantenimiento incluidos.',
    },
    {
      title: 'Comidas de trabajo',
      theme: 'catering',
      image: '/img/shared/services/catering/box-lunch.jpg',
      copy: 'Comida bien servida para visitas de dirección, all-hands y talleres dentro de tu empresa.',
    },
    {
      title: 'Barras de bowls',
      theme: 'dining',
      image: assetSrc('comedor-make-your-own-bowl-line'),
      copy: 'Ingredientes frescos para que cada persona arme su bowl a su gusto.',
    },
  ],

  serviceLinks: {
    dining: { label: S.dining.name, shortLabel: S.dining.short, href: '/services/comedor-corporativo' },
    cafe: { label: S.cafe.name, shortLabel: S.cafe.short, href: '/services/cafeteria-corporativa' },
    pantry: { label: S.pantry.name, shortLabel: S.pantry.short, href: '/services/pantry-y-restocking' },
    coffee: { label: S.coffee.name, shortLabel: S.coffee.short, href: '/services/cafe-y-agua' },
    'grab-go': { label: S['grab-go'].name, shortLabel: S['grab-go'].short, href: '/services/carritos-de-servicio' },
    catering: { label: S.catering.name, shortLabel: S.catering.short, href: '/services/catering-corporativo' },
  },


  systemTabs: [
    {
      key: 'plan',
      icon: 'briefcase',
      stage: 'Entendemos tu operación',
      stageCopy: {
        before: 'Revisamos ',
        highlight: 'la cultura, los horarios, los espacios y los hábitos de tu equipo',
        after: ' antes de proponer una solución.',
      },
      title: 'Entendemos cómo opera tu empresa',
      copy: 'Revisamos la cultura, los horarios, los espacios y los hábitos de tu equipo antes de proponer una solución.',
      panelTitle: 'Entendemos cómo opera tu empresa',
      panelCopy:
        'Revisamos la cultura, los horarios, los espacios y los hábitos de tu equipo antes de proponer una solución.',
      image: assetSrc('ops-operating-system-1'),
      visualWidget: {
        kind: 'profile',
        mealsUnit: 'comidas',
        days: [
          { label: 'L', name: 'Lunes', value: 240 },
          { label: 'M', name: 'Martes', value: 300 },
          { label: 'M', name: 'Miércoles', value: 300 },
          { label: 'J', name: 'Jueves', value: 240 },
          { label: 'V', name: 'Viernes', value: null },
        ],
        offLabel: 'Home office',
        schedule: [
          { minutes: 450, label: 'Abre cafetería' },
          { minutes: 480, label: 'Desayuno' },
          { minutes: 660, label: 'Pantry · snacks' },
          { minutes: 780, label: 'Comida' },
          { minutes: 1020, label: 'Cierra cafetería' },
        ],
      },
      tone: 'ocean',
    },
    {
      key: 'prepare',
      icon: 'shield',
      stage: 'Diseñamos el programa',
      stageCopy: {
        before: 'Definimos ',
        highlight: 'el formato, el menú, el personal y la forma de operar',
        after: ' que mejor encajan con tu empresa.',
      },
      title: 'Diseñamos el programa adecuado',
      copy: 'Definimos el formato, el menú, el personal y la forma de operar que mejor encajan con tu empresa.',
      panelTitle: 'Diseñamos el programa adecuado',
      panelCopy:
        'Definimos el formato, el menú, el personal y la forma de operar que mejor encajan con tu empresa.',
      image: assetSrc('ops-operating-system-3'),
      visualWidget: {
        kind: 'menu',
        title: 'Menú del día',
        meta: 'Lun 10 ago',
        meals: ['Desayuno', 'Comida'],
        dishes: [
          {
            meal: 0,
            name: 'Molletes clásicos',
            kcal: 341,
            tags: ['Gluten', 'Lácteos'],
            description: 'Del desayuno del día, junto a chilaquiles verdes y huevo revuelto.',
            image: assetSrc('food-breakfast-molletes'),
          },
          {
            meal: 1,
            name: 'Arrachera',
            kcal: 237,
            tags: ['Premium'],
            description: 'Corte a la parrilla del menú Grill, como opción premium.',
            image: '/img/shared/services/comedor/arrachera-plato.jpg',
          },
          {
            meal: 1,
            name: 'Barra de ensaladas',
            kcal: 526,
            tags: ['Lácteos', 'Sésamo', 'Gluten', 'Pescado'],
            description: 'Arma tu ensalada con las opciones del día.',
            image: '/img/shared/services/comedor/barra-ensaladas.jpg',
          },
        ],
      },
      tone: 'natural',
    },
    {
      key: 'serve',
      icon: 'people',
      stage: 'Operamos todos los días',
      stageCopy: {
        before: 'Nuestro equipo ',
        highlight: 'produce, abastece, sirve y supervisa',
        after: ' para que tú no cargues la operación.',
      },
      title: 'Operamos todos los días',
      copy: 'Nuestro equipo produce, abastece, sirve y supervisa para que tú no cargues la operación.',
      panelTitle: 'Operamos todos los días',
      panelCopy:
        'Nuestro equipo produce, abastece, sirve y supervisa para que tú no cargues la operación.',
      image: assetSrc('ops-operating-system-2'),
      visualWidget: {
        kind: 'service',
        months: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        /* Ford QBR ene–may 2026: Entrega (cobertura, desabastos, espera por
           mes) y Volumen (comidas por mes). */
        metrics: [
          { label: 'Cobertura de plantilla · mayo', value: 98.3, decimals: 1, suffix: '%', chart: { kind: 'meter', fill: 0.983 } },
          { label: 'Comidas servidas al mes', value: 11100, prefix: '~', chart: { kind: 'months', values: [11670, 11172, 10601, 10941, 11185] } },
          { label: 'Desabastos de comida', value: 0, chart: { kind: 'zero' } },
          { label: 'Espera en fila · meta 7 min', value: 1.5, decimals: 1, suffix: ' min', chart: { kind: 'months', values: [8, 2.48, 1.74, 1.34, 1.49] } },
        ],
      },
      tone: 'sage',
    },
    {
      key: 'measure',
      icon: 'chart',
      stage: 'Medimos y mejoramos',
      stageCopy: {
        before: 'Revisamos ',
        highlight: 'consumo, satisfacción y servicio',
        after: ' para ajustar el programa cuando hace falta.',
      },
      title: 'Medimos y mejoramos',
      copy: 'Revisamos consumo, satisfacción y servicio para ajustar el programa cuando hace falta.',
      panelTitle: 'Medimos y mejoramos',
      panelCopy:
        'Revisamos consumo, satisfacción y servicio para ajustar el programa cuando hace falta.',
      image: assetSrc('ops-operating-system-4'),
      visualWidget: {
        kind: 'score',
        title: 'Satisfacción',
        value: 94,
        valueLabel: '94%',
        delta: '+6 pts vs. nov.',
        trend: {
          label: 'Scorecard',
          valueLabel: '95%',
          caption: 'Ene → May',
          points: [78, 74, 86.7, 88.3, 95],
          min: 70,
          max: 100,
        },
        bars: {
          label: 'Tiempo de espera promedio',
          valueLabel: '1.8 min',
          caption: 'Feb–may · antes 8 min',
          /* Monthly wait, Feb–May (source QBR, Entrega slide). January's 8 min
             is the "before" and lives in the caption, not as a bar that would
             dwarf the rest. The headline is the mean of these four. */
          values: [2.48, 1.74, 1.34, 1.49],
        },
        channel: 'comedor',
        messages: [
          { author: 'Clau H.', text: '¡Gracias por los chilaquiles y los sopes! 😍🌮' },
          { author: 'Nagib W.', text: 'Las enchiladas del desayuno de hoy estuvieron deliciosas, ¡gracias!' },
          { author: 'Ale R.', text: '¡Gracias por este panqué! Es el más delicioso de todos 🙌' },
          { author: 'Montse R.', text: '¡Muchas gracias por organizar estas iniciativas tan padres! 👏😄' },
          { author: 'Andrés A.', text: '¡Muy bueno, gracias! 🙌' },
        ],
      },
      tone: 'lime',
    },
  ],

  proofColumns: [
    [
      {
        variant: 'photo',
        title: 'Menús que combinan sabor, variedad y nutrición',
        sub: 'Chefs y nutriólogos desarrollan menús frescos y balanceados, con rotación y ajustes basados en el consumo y los comentarios de tu equipo.',
        image: assetSrc('site-hero-buffet-line'),
        alt: 'Menú fresco y balanceado de un comedor corporativo Zitrone',
      },
      {
        variant: 'photo',
        title: 'Producción y abasto todos los días',
        sub: 'Preparamos alimentos diariamente en nuestros comisariatos y también operamos cocinas dentro de las empresas para mantener frescura, control y continuidad.',
        image: assetSrc('site-service-corporate-dining'),
        alt: 'Comedor corporativo operado y abastecido diariamente por Zitrone',
      },
    ],
    [
      {
        variant: 'photo',
        title: 'Inocuidad respaldada por Distintivo H',
        sub: 'Nuestros comisariatos cuentan con Distintivo H y controles documentados de manejo higiénico de alimentos en producción, transporte y servicio.',
        image: assetSrc('ops-hygiene'),
        alt: 'Manejo higiénico de alimentos y Distintivo H en Zitrone',
      },
      {
        variant: 'studies',
        title: 'Un equipo fijo en tu empresa',
        sub: 'Asignamos personal capacitado que conoce tus horarios, protocolos y cultura. La supervisión y el seguimiento forman parte de la operación diaria.',
        image: assetSrc('ops-trained-teams'),
        alt: 'Personal capacitado para operar servicios de alimentación en empresas',
      },
    ],
    [
      {
        variant: 'logos',
        title: 'Experiencia comprobada en operaciones exigentes',
        sub: 'Parte de la operación diaria de algunas de las empresas más importantes de México.',
        tone: 'green',
        hideLogos: true,
        stats: [
          { value: '17 años', label: 'de experiencia' },
          { value: '15,000', label: 'comidas servidas cada día' },
        ],
      },
    ],
  ],

  serviceLayers: [
    {
      title: S.dining.name,
      theme: 'dining',
      image: assetSrc('site-service-corporate-dining-food-hall'),
      copy: 'Un comedor diario para servir la comida principal de tu equipo.',
      href: '/services/comedor-corporativo',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Comedor corporativo, industrial o premium',
          text: 'Tres formatos, según el tamaño y los turnos de tu empresa.',
          icon: 'utensils',
        },
        {
          title: 'Con **cocina en sitio** o **sin cocina en sitio**',
          text: 'Sin cocina, la comida llega terminada y transportada por nosotros.',
          icon: 'chef',
        },
        {
          title: 'Menús diseñados por nutriólogos',
          text: 'Cambian cada semana, con opción vegetariana y alérgenos etiquetados.',
          icon: 'leaf',
        },
      ],
    },
    {
      title: S.cafe.name,
      theme: 'cafe',
      image: assetSrc('site-service-corporate-cafe'),
      copy: 'Una cafetería atendida dentro de la oficina, disponible durante toda la jornada.',
      href: '/services/cafeteria-corporativa',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Barra de café con productos de especialidad',
          text: 'Cafés y tés preparados por barista.',
          icon: 'coffee',
        },
        {
          title: 'Comida fría y caliente, en sitio o para llevar',
          text: 'Desayunos, grab & go, repostería fina, botanas y más.',
          icon: 'utensils',
        },
        {
          title: 'Smoothies, frappés y jugos cold pressed',
          text: 'Licuados y bebidas frías, más allá del café.',
          icon: 'drink',
        },
      ],
    },
    {
      title: S.pantry.name,
      theme: 'pantry',
      image: assetSrc('site-service-pantry'),
      copy: 'Snacks y bebidas disponibles cada día, con consumo y costo bajo control.',
      href: '/services/pantry-y-restocking',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Snacks, bebidas y fruta fresca cada día',
          text: 'Personal de Zitrone en sitio surte, distribuye y reabastece.',
          icon: 'fruit',
        },
        {
          title: 'Catálogo elegido contigo, con lo saludable al frente',
          text: 'Fruta, barras, frutos secos y snacks bajos en azúcar a la vista.',
          icon: 'leaf',
        },
        {
          title: 'Consumo abierto o con asignación por persona',
          text: 'La asignación pone límites por persona para un costo más controlado.',
          icon: 'people',
        },
      ],
    },
    {
      title: S.coffee.name,
      shortTitle: S.coffee.short,
      theme: 'coffee',
      image: assetSrc('site-service-coffee-and-water'),
      copy: 'Café y agua de autoservicio, sin comprar ni operar equipos.',
      href: '/services/cafe-y-agua',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Las máquinas las ponemos nosotros',
          text: 'No compras ni rentas equipo. Instalación, abasto, limpieza y mantenimiento preventivo incluidos.',
          icon: 'machine',
        },
        {
          title: 'Espresso, americano, cappuccino, cortado y latte',
          text: 'Café 100% arábiga de Chiapas y Veracruz, más chocolate y tés.',
          icon: 'coffee',
        },
        {
          title: 'Agua fría, caliente, al tiempo y mineral con gas',
          text: 'Filtración multietapa, con cambio de filtros y pruebas microbiológicas semestrales.',
          icon: 'water',
        },
      ],
    },
    {
      title: S['grab-go'].name,
      theme: 'grab-go',
      image: assetSrc('site-service-cart-full'),
      copy: 'Comida fresca que llega a cada piso cuando no hay un punto fijo.',
      href: '/services/carritos-de-servicio',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Un punto de servicio móvil, sin montar nada',
          text: 'Sumas comida en la oficina sin obra ni equipo fijo.',
          icon: 'cart',
        },
        {
          title: 'Recorrido y horarios definidos con tu operación',
          text: 'Ponemos carrito, producto y gente, con reabasto diario.',
          icon: 'clock',
        },
        {
          title: 'Del salado a la fruta, listo para comer',
          text: 'Ensaladas, sándwiches, wraps, pastas y platos del día.',
          icon: 'utensils',
        },
      ],
    },
    {
      title: S.catering.name,
      theme: 'catering',
      image: assetSrc('site-service-catering-buffet'),
      copy: 'Comida y servicio para reuniones, celebraciones y eventos de empresa.',
      href: '/services/catering-corporativo',
      ctaLabel: 'Ver servicio',
      features: [
        {
          title: 'Coffee break, desayuno, box lunch o comida emplatada',
          text: 'Elegimos el formato según el momento del evento.',
          icon: 'calendar',
        },
        {
          title: 'Paquetes del catálogo o propuesta a la medida',
          text: 'Menús armados para los gustos y restricciones de tus invitados.',
          icon: 'chat',
        },
        {
          title: 'Montaje, loza, mantelería y meseros coordinados',
          text: 'Un solo proveedor produce, monta y atiende el evento.',
          icon: 'people',
        },
      ],
    },
  ],

  profilerSizeOptions: [
    { label: 'Menos de 50', value: 'xs' },
    { label: 'Entre 50 y 150', value: 's' },
    { label: 'Entre 150 y 500', value: 'm' },
    { label: 'Más de 500', value: 'l' },
    { label: 'Varía o aún no lo sé', value: 'unsure' },
  ],

  profilerMoments: [
    {
      id: 'lunch',
      title: 'La comida del día',
      text: 'Comida completa para el equipo, todos los días.',
    },
    {
      id: 'breakfast',
      title: 'El desayuno',
      text: 'Para equipos que empiezan temprano.',
    },
    {
      id: 'coffee',
      title: 'Máquinas de café',
      text: 'Café recién molido, durante toda la jornada.',
    },
    {
      id: 'snacks',
      title: 'Snacks y bebidas',
      text: 'Disponibles entre comidas.',
    },
    {
      id: 'water',
      title: 'Dispensadores de agua',
      text: 'Agua filtrada para toda la oficina.',
    },
    {
      id: 'events',
      title: 'Catering',
      text: 'Comida por evento: juntas, celebraciones y visitas.',
    },
  ],

  profilerStyles: [
    {
      id: 'selfserve',
      title: 'Buffet',
      text: 'El comensal se sirve, siempre disponible.',
    },
    {
      id: 'staffed',
      title: 'Asistido por personal Zitrone',
      text: 'Una barra o un punto atendido por nuestro equipo.',
    },
    {
      id: 'recommend',
      title: 'Recomiéndenme',
      text: 'Zitrone propone según tamaño y espacio.',
    },
  ],

  profilerServices: [
    {
      id: 'comedor',
      title: S.dining.name,
      accent: 'dining',
      href: '/services/comedor-corporativo',
    },
    {
      id: 'cafeteria',
      title: S.cafe.name,
      accent: 'cafe',
      href: '/services/cafeteria-corporativa',
    },
    {
      id: 'pantry',
      title: S.pantry.name,
      accent: 'pantry',
      href: '/services/pantry-y-restocking',
    },
    {
      id: 'maquinas',
      title: S.coffee.name,
      accent: 'cafe',
      href: '/services/cafe-y-agua',
    },
    {
      id: 'carritos',
      title: S['grab-go'].name,
      accent: 'pantry',
      href: '/services/carritos-de-servicio',
    },
    {
      id: 'catering',
      title: S.catering.name,
      accent: 'catering',
      href: '/services/catering-corporativo',
    },
  ],

  clientStories: [
    {
      name: 'Uber',
      label: 'Caso Uber',
      role: 'Food Program Manager, Americas',
      logo: `${assetPath}/img/shared/clients/mono/uber.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/uber.jpg`,
      repeatsHero: true,
      location: 'Ciudad de México',
      imageAlt: 'Operación gastronómica de Zitrone en oficinas',
      quote:
        'Zitrone ha sido un socio valioso y altamente profesional de servicio de alimentos para nuestro equipo en Ciudad de México desde 2018. Su dedicación a la excelencia operativa es evidente en la calidad del servicio diario.',
      quoteHighlight: 'excelencia operativa',
    },
    {
      name: 'Pinterest',
      label: 'Caso Pinterest',
      role: 'Programa de microkitchen y catering',
      logo: `${assetPath}/img/shared/clients/mono/pinterest.svg`,
      logoFit: 'compact',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/pinterest.jpg`,
      repeatsHero: true,
      location: 'Ciudad de México',
      imageAlt: 'Programa de microkitchen y catering de Zitrone',
      quote:
        'Su servicio es confiable y atento, con productos excelentes y cuidadosamente curados que a nuestros equipos les encantan. Su apoyo proactivo agiliza nuestra operación.',
      quoteHighlight: 'apoyo proactivo',
    },
    {
      name: 'Stripe',
      label: 'Caso Stripe',
      role: 'Workplace Experience Manager LATAM',
      logo: `${assetPath}/img/shared/clients/mono/stripe.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/stripe.jpg`,
      repeatsHero: true,
      location: 'Ciudad de México',
      imageAlt: 'Servicio de catering y pantry corporativo de Zitrone',
      quote:
        'Las opciones de desayuno, comida, snacks y bebidas se alinean a la perfección con nuestra filosofía de alimentos. El servicio y la atención de todo el equipo han sido excepcionales.',
      quoteHighlight: 'nuestra filosofía de alimentos',
    },
    {
      name: 'Salesforce',
      label: 'Caso Salesforce',
      role: 'Workplace Services Manager',
      logo: `${assetPath}/img/shared/clients/mono/salesforce-lockup.svg`,
      logoFit: 'balanced',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/salesforce.jpg`,
      location: 'Ciudad de México',
      imageAlt: 'Operación de barista, pantry y catering de Zitrone',
      quote:
        'Su mayor fortaleza siempre ha sido la misma: la capacidad de adaptarse a las necesidades de sus clientes y personalizar cada detalle, alineándose con la cultura de la empresa.',
      quoteHighlight: 'adaptarse a las necesidades',
    },
    {
      name: 'Capital One',
      label: 'Caso Capital One',
      role: 'Third Party Management Manager',
      logo: `${assetPath}/img/shared/clients/mono/capital-one.svg`,
      logoFit: 'wide',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/capital-one.jpg`,
      location: 'Ciudad de México',
      imageAlt: 'Programa gastronómico corporativo de Zitrone',
      quote:
        'Zitrone ha sido un excelente aliado estratégico. Ofreciendo sus servicios y procesos a un proyecto complicado sin arriesgar calidad y el buen servicio a cliente.',
      quoteHighlight: 'aliado estratégico',
    },
    {
      name: 'Nike',
      label: 'Caso Nike',
      role: 'Programa de comedor corporativo',
      logo: `${assetPath}/img/shared/clients/mono/nike.svg`,
      logoFit: 'compact',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/nike-v2.jpg`,
      location: 'Ciudad de México',
      imageAlt: 'Operación de comedor corporativo de Zitrone',
      quote:
        'Agradecemos su disposición para trabajar en nuestros requerimientos y esperamos que sigan mejorando para alcanzar nuestros estándares.',
      quoteHighlight: 'nuestros requerimientos',
    },
    {
      name: 'AT&T',
      label: 'Caso AT&T',
      role: 'Directora de Beneficios, Inclusión y Cultura',
      logo: `${assetPath}/img/shared/clients/mono/att.svg`,
      logoFit: 'balanced',
      logoScale: 1,
      image: `${testimonialPhotoAssetPath}/att.jpg`,
      location: 'Ciudad de México',
      imageAlt: 'Alianza enterprise de servicio gastronómico con Zitrone',
      quote:
        'Su disposición para adaptarse a nuestros requerimientos y la excelencia en el trato hacia nuestros colaboradores han sido elementos clave en la construcción de una relación de confianza y colaboración.',
      quoteHighlight: 'relación de confianza',
    },
  ],

  faqs: [
    {
      question: '¿A qué tipo de empresas atiende Zitrone?',
      answer: [
        'Zitrone atiende a empresas modernas que necesitan que la comida funcione de manera confiable a lo largo del día: comedor diario, snacks y bebidas, estaciones de café, agua, comidas grab-and-go y eventos corporativos.',
        'El modelo de servicio puede iniciar pequeño o escalar a un sistema operativo completo, según el tamaño del equipo, el espacio disponible y el nivel de soporte diario requerido.',
      ],
    },
    {
      question: '¿Necesitamos cocina en sitio?',
      answer: [
        'No. Zitrone puede operar una cocina dedicada dentro de tus instalaciones cuando exista la infraestructura, o suministrar comidas diarias desde su comisariato central con transporte y servicio a cargo de Zitrone.',
        'Para comedor abastecido por comisariato, el cliente típicamente necesita un área de servicio, comedor, servicios básicos y un compromiso diario de comensales, no una cocina de producción completa.',
      ],
    },
    {
      question: '¿Cómo maneja Zitrone la inocuidad de los alimentos?',
      answer: [
        'Nuestros comisariatos cuentan con Distintivo H, el reconocimiento que otorgan la Secretaría de Turismo y la Secretaría de Salud a las cocinas que cumplen los estándares oficiales de manejo higiénico de alimentos.',
        'Además, Zitrone utiliza controles documentados de inocuidad en producción, transporte y servicio: bitácoras de temperatura, contenedores CAMBRO, muestras retenidas, registros de materia prima y equipos capacitados en manejo de alimentos.',
        'Los servicios se sostienen con protocolos de higiene, pruebas programadas y estándares operativos diseñados para entornos corporativos donde la confiabilidad y la documentación son esenciales.',
      ],
    },
    {
      question: '¿Podemos combinar servicios?',
      answer: [
        'Sí. Puedes contratar un solo servicio o varios a la vez: por ejemplo, comedor para la comida diaria, café y snacks durante la jornada, y catering para juntas y eventos.',
        'Combinar servicios crea una sola relación para todo el día laboral: comedor, cafetería, snacks y bebidas, café y agua, carritos de servicio y catering se coordinan a través de un solo operador.',
      ],
    },
    {
      question: '¿Cómo se planean los menús?',
      answer: [
        'Los menús son diseñados por chefs profesionales y nutriólogos titulados, con un ciclo rotativo, valores calóricos, información de alérgenos, menús temáticos y publicación anticipada para los equipos.',
      ],
    },
  ],

  footerColumns: [
    {
      label: 'Zitrone',
      links: [
        { href: '#service-system', label: 'Servicios' },
        { href: '#outcomes', label: 'Cómo trabajamos' },
        { href: '#profiler', label: 'Encuentra tu solución' },
        { href: '#stories', label: 'Casos de clientes' },
        { href: '#faq', label: 'Preguntas frecuentes' },
      ],
    },
    {
      label: 'Servicios',
      links: [
        { href: '/services', label: 'Todos los servicios' },
        { href: '/services/comedor-corporativo', label: S.dining.name },
        { href: '/services/cafeteria-corporativa', label: S.cafe.name },
        { href: '/services/pantry-y-restocking', label: S.pantry.name },
        { href: '/services/cafe-y-agua', label: S.coffee.name },
        { href: '/services/carritos-de-servicio', label: S['grab-go'].name },
        { href: '/services/catering-corporativo', label: S.catering.name },
      ],
    },
    {
      label: 'Recursos',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/blog/feed.xml', label: 'RSS del blog' },
      ],
    },
  ],

  sections: {
    hero: {
      navAriaLabel: 'Principal',
      mobileNavAriaLabel: 'Principal móvil',
      menuOpenLabel: 'Abrir menú',
      menuCloseLabel: 'Cerrar menú',
      cta: { label: 'Hablemos', href: contactHref('nav') },
      title: 'Comida que alimenta a tu equipo.',
      titleEmphasis: 'alimenta',
      frames: [
        {
          pillar: 'nourishment',
          accentWord: 'alimenta',
          image: assetSrc('site-hero-dining-hall-skyline'),
          alt: 'Comedor corporativo en servicio',
        },
        {
          pillar: 'care',
          accentWord: 'cuida',
          image: assetSrc('site-hero-coffee-bar-lounge'),
          alt: 'Cafetería corporativa con barra de barista',
        },
        {
          pillar: 'connection',
          accentWord: 'conecta',
          image: assetSrc('site-hero-buffet-line'),
          alt: 'Línea de buffet durante el servicio de comida',
        },
        {
          pillar: 'momentum',
          accentWord: 'impulsa',
          image: assetSrc('site-hero-food-hall'),
          alt: 'Comedor corporativo con isla de bebidas y barras de servicio',
        },
      ],
      copy: 'Trabajamos dentro de tus instalaciones, entendemos tu cultura y construimos una experiencia de alimentación que refleja e impulsa a tu equipo.',
      copyShort: 'Una experiencia de alimentación que refleja e impulsa a tu equipo, dentro de tus instalaciones.',
      ribbonLabel: 'Marcas que confían en Zitrone',
      ribbonStat: { value: 15000, label: 'Comidas diarias en grandes empresas:' },
      marqueeAriaLabel: 'Credenciales',
    },

    services: {
      kicker: 'Formatos de servicio',
      titleAriaLabel: 'Y cada momento, a la medida de tu empresa.',
      titleWords: [
        { text: 'Y' },
        { text: 'cada' },
        { text: 'momento,' },
        { text: 'a', accent: true },
        { text: 'la', accent: true },
        { text: 'medida', accent: true },
        { text: 'de', accent: true },
        { text: 'tu', accent: true },
        { text: 'empresa.', accent: true },
      ],
      copy: 'Todos los servicios, coordinados por un solo equipo y adaptados a la operación, la cultura y la gente de tu empresa.',
      /* The cover over the service strip: names the formats themselves, so it
         does not repeat the spotlight intro, which uses `copy`. */
      coverCopy: 'Un servicio completo que armamos contigo, formato por formato, según tu cultura, tus necesidades y tu presupuesto, para que se sienta tuyo.',
      ctaPrimary: { label: 'Ver servicios', href: '/services' },
      ctaSecondary: { label: 'Hablemos', href: contactHref('home-services') },
    },

    operatingSystem: {
      kicker: 'Así trabajamos contigo',
      titleAriaLabel: 'Cada detalle, pensado para tu gente.',
      titleWords: [
        { text: 'Cada' },
        { text: 'detalle,' },
        { text: 'pensado', accent: true },
        { text: 'para', accent: true },
        { text: 'tu', accent: true },
        { text: 'gente.', accent: true },
      ],
      copy: 'Antes de proponer un menú, conocemos tus horarios, tus espacios y a tu gente. Después cuidamos cada servicio y lo afinamos con lo que tu equipo nos dice.',
      ctaPrimary: { label: 'Ver servicios', href: '/services' },
    },

    proof: {
      kicker: 'Experiencia en servicios de alimentación para empresas',
      clientLogosAriaLabel: 'Logotipos de clientes de Zitrone',
      headingAriaLabel: 'Las empresas que cuidan a su gente eligen Zitrone',
      headingLead: 'Las empresas que cuidan a su gente eligen',
      headingAccent: 'Zitrone',
      headingTrail: '',
      copy: 'Más de 17 años operando comedores corporativos y servicios de alimentación en México. Combinamos producción diaria, equipos capacitados y procesos que mantienen la calidad de principio a fin.',
    },

    featuredMedia: {
      label: 'Medios destacados',
      ariaLabel: 'Referencias en medios',
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
      titleAriaLabel: 'Los equipos más exigentes confían en Zitrone',
      titleWords: [
        { text: 'Los' },
        { text: 'equipos' },
        { text: 'más' },
        { text: 'exigentes', accent: true },
        { text: 'confían' },
        { text: 'en' },
        { text: 'Zitrone' },
      ],
      cta: { label: 'Hablemos', href: contactHref('home-proof') },
      panelCta: { label: 'Hablemos', href: contactHref('home-proof-panel') },
    },

    faq: {
      heading: 'Preguntas frecuentes',
      headingLead: 'Preguntas frecuentes',
      ctaTitle: '¿Tienes más dudas?',
      ctaCopy:
        'Cuéntanos qué necesita tu equipo y diseñamos la solución adecuada para su día a día.',
      cta: { label: 'Hablemos', href: contactHref('home-faq') },
    },

    footer: {
      ariaLabel: 'Pie de página de Zitrone',
      tagline: 'Cuando la comida funciona, el día funciona mejor.',
      taglineEmphasis: 'día funciona mejor',
      ctaPrimary: {
        label: 'Hablemos',
        href: contactHref('footer'),
      },
      ctaSecondary: { label: 'Ver servicios', href: '/services' },
      contactLabel: 'Contacto',
      address: [
        'Calle 3 13-1, Alce Blanco',
        '53370 Naucalpan de Juárez',
        'Estado de México',
      ],
      contactLinks: [
        { label: 'Consultas generales', href: 'mailto:opina@zitrone.com.mx' },
        { label: 'Teléfono', href: 'tel:+525512054000' },
      ],
      legal: {
        copyright: '© 2026 Zitrone',
        links: [
          { label: 'Aviso de Privacidad', href: '/privacy-notice' },
          { label: 'Facturación', href: 'mailto:facturacion@zitrone.com.mx,contabilidad@zitrone.com.mx?subject=Solicitud%20de%20factura&body=Adjunto%20RFC%20y%20ticket%20de%20compra.' },
        ],
      },
      socialsLabel: 'Redes sociales',
      socialLinks: [
        {
          icon: 'instagram',
          label: 'Zitrone en Instagram',
          href: 'https://www.instagram.com/zitrone_mx/',
        },
        { icon: 'twitter', label: 'Zitrone en X', href: 'https://twitter.com/ZitroneNatural' },
        {
          icon: 'facebook',
          label: 'Zitrone en Facebook',
          href: 'https://www.facebook.com/ZitroneMx/',
        },
        {
          icon: 'linkedin',
          label: 'Zitrone en LinkedIn',
          href: 'https://mx.linkedin.com/company/zitrone-natural',
        },
      ],
    },
  },
}
