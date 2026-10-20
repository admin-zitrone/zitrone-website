import type { BlogContent } from './types'
import { assetSrc } from '@/lib/assets.generated'
import { SERVICE_NAMES } from '@/lib/service-names'

export const blogContentEs: BlogContent = {
  layout: {
    brandAriaLabel: 'Inicio Zitrone',
    primaryNavAriaLabel: 'Navegación principal',
    navLinks: [
      { href: '/#services', label: 'Servicios' },
      { href: '/#outcomes', label: 'Sistema' },
      { href: '/#features', label: 'Resultados' },
      { href: '/blog', label: 'Blog' },
    ],
    navCtaLabel: 'Iniciar un programa',
    navCtaHref: '/#cta',
    bottomKicker: 'Alimentación para empresas',
    bottomHeadingLead: '¿Buscas un servicio de comida ',
    bottomHeadingAccent: 'para tu oficina?',
    bottomHeadingTrail: '',
    bottomCopy:
      'Cuéntanos cuántas personas son y qué necesitan. Te ayudamos a elegir entre comedor, snacks, café y catering.',
    bottomCtaPrimaryLabel: 'Hablemos',
    bottomCtaPrimaryHref: '/#cta',
    bottomCtaSecondaryLabel: 'Conocer servicios',
    bottomCtaSecondaryHref: '/services',
    footerDescription: 'Comedores, café, snacks y catering para empresas.',
    footerLegal: '© 2026 Zitrone. Todos los derechos reservados.',
    footerGroups: [
      {
        title: 'Servicios',
        links: [
          { label: SERVICE_NAMES.es['dining'].name, href: '/services/comedor-corporativo' },
          { label: SERVICE_NAMES.es['cafe'].name, href: '/services/cafeteria-corporativa' },
          { label: SERVICE_NAMES.es['pantry'].name, href: '/services/pantry-y-restocking' },
          { label: SERVICE_NAMES.es['coffee'].name, href: '/services/cafe-y-agua' },
          { label: SERVICE_NAMES.es['grab-go'].name, href: '/services/carritos-de-servicio' },
          { label: SERVICE_NAMES.es['catering'].name, href: '/services/catering-corporativo' },
        ],
      },
      {
        title: 'Sistema',
        links: [
          { label: 'Sistema operativo', href: '/#outcomes' },
          { label: 'Resultados operativos', href: '/#features' },
          { label: 'Seguridad alimentaria', href: '/#features' },
          { label: 'Contacto', href: '/#cta' },
        ],
      },
      {
        title: 'Recursos',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'Facturación', href: 'mailto:facturacion@zitrone.com.mx,contabilidad@zitrone.com.mx?subject=Solicitud%20de%20factura&body=Adjunto%20RFC%20y%20ticket%20de%20compra.' },
          { label: 'Acerca de Zitrone', href: '/#services' },
          { label: 'Portafolio de clientes', href: '/#features' },
          { label: 'Iniciar un programa', href: '/#cta' },
        ],
      },
    ],
  },
  index: {
    metadataTitle: 'Comedores, snacks y comida para oficinas | Blog de Zitrone',
    metadataDescription:
      'Cómo organizar la comida en tu oficina: menús, comedores, snacks, café y consejos para el servicio diario.',
    heroTitleLine1: 'Blog',
    heroTitleLine2: 'de Zitrone',
    categoryNavAriaLabel: 'Categorías del blog',
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar artículos',
    searchAriaLabel: 'Buscar artículos por título o extracto',
    searchSubmitAriaLabel: 'Ejecutar búsqueda',
    searchClearLabel: 'Limpiar filtros',
    emptyStateHeading: 'Ningún artículo coincide con tus filtros',
    emptyStateBody: 'Prueba con otra palabra o elimina los filtros para ver todos los artículos.',
    subscribeKicker: 'Contacto',
    subscribeHeading: 'Hablemos de la comida en tu oficina.',
    subscribeCopy:
      'Te ayudamos a planear el servicio según tu espacio, tus horarios y tu presupuesto.',
    subscribeCtaLabel: 'Hablemos',
    subscribeCtaHref: '/#cta',
    highlightsAriaLabel: 'Artículos destacados',
    allArticlesKicker: 'Todos los artículos',
    allArticlesHeadingLead: 'Artículos de ',
    allArticlesHeadingAccent: 'Zitrone',
    allArticlesHeadingTrail: '',
    allArticlesCopy:
      'Consejos para planear el menú, elegir un servicio y resolver los pendientes del comedor.',
    paginationAriaLabel: 'Páginas de artículos',
    paginationPreviousAriaLabel: 'Artículos anteriores',
    paginationNextAriaLabel: 'Artículos siguientes',
    paginationCounter: '1 / 3',
    viewMoreLabel: 'Ver más',
  },
  article: {
    metadataSuffix: ' — Blog de Zitrone',
    notFoundTitle: 'Artículo no encontrado — Blog de Zitrone',
    backLinkLabel: 'Blog',
    metaCardAriaLabel: 'Detalles del artículo',
    authorName: 'Equipo de Operaciones Zitrone',
    authorHref: '/#services',
    publishedInPrefix: 'Publicado en ',
    shareLabel: 'Compartir',
    shareSubjectPrefix: 'Lee este artículo del Blog de Zitrone: ',
    reviewedByLabel: 'Revisado por',
    reviewedByName: 'Seguridad Alimentaria y Operaciones Zitrone',
    takeawaysHeading: 'Lo esencial',
    inlineCtaKicker: 'Comida para tu oficina',
    inlineCtaLeading: 'Cuéntanos qué necesita ',
    inlineCtaEmphasis: 'tu equipo',
    inlineCtaTrailing: '.',
    inlineCtaButton: 'Hablemos',
    inlineCtaHref: '/contact?src=blog-article-cta',
    faqHeading: 'Preguntas frecuentes',
    onThisPageAriaLabel: 'En esta página',
    onThisPageHeading: 'En esta página',
    tocToggleLabel: 'En esta página',
    topicsHeading: 'Temas',
    recommendedKicker: 'Artículos recomendados',
    recommendedHeadingLead: 'Más artículos de ',
    recommendedHeadingAccent: 'Zitrone',
    recommendedHeadingTrail: '',
    recommendedCopy: 'También te puede interesar.',
    breadcrumbHome: 'Zitrone',
    breadcrumbBlog: 'Blog',
  },
  categories: [
    'Todos',
    'Cultura y retención',
    'Bienestar y productividad',
    'Construir un programa',
    'Confianza y estándares',
  ],
  posts: [
    {
      slug: 'comida-en-la-oficina-y-retencion-de-talento',
      translationKey: 'office-food-employee-retention',
      href: '/blog/comida-en-la-oficina-y-retencion-de-talento',
      title: 'Comida en la oficina como prestación: cómo mejorar el servicio',
      seo: {
        title: 'Comida en la oficina como prestación | Zitrone',
        description:
          'Cómo evaluar el comedor de tu oficina: horarios, porciones, tiempos de espera y una lista de revisión para mejorar el servicio.',
      },
      cta: {
        heading: '¿Quieres mejorar el comedor de tu oficina?',
        label: 'Solicitar una propuesta de comedor',
        href: '/contact?src=blog-retencion-cta',
      },
      category: 'Cultura y retención',
      date: 'Abril 2026',
      readTime: '3 min de lectura',
      image: assetSrc('site-blog-office-food-employee-retention'),
      alt: 'Comedor y área de convivencia en una oficina',
      excerpt:
        'Un comedor puede ahorrar traslados y dar espacio para convivir. Para que el equipo lo aproveche, hacen falta buenos horarios, porciones suficientes y atención a sus comentarios.',
      intro: [
        'Ofrecer comida en la oficina resuelve una necesidad concreta: tener dónde comer durante la jornada, sin dedicar el descanso a buscar un lugar o esperar un pedido. También permite compartir la mesa con compañeros con quienes quizá no coincides el resto del día.',
        'Eso puede hacer más agradable ir a trabajar. Pero atribuirle al comedor la permanencia de una persona sería demasiado: el sueldo, la carga de trabajo, el trato y las oportunidades de desarrollo también cuentan. Vale la pena evaluar la comida por lo que ofrece en el día a día.',
      ],
      takeaways: [
        'Ajusta los horarios del comedor a los descansos y turnos del equipo.',
        'Revisa que haya porciones y opciones suficientes hasta el cierre del servicio.',
        'Registra cuántas personas comen, cuánto esperan y qué problemas se repiten.',
      ],
      sections: [
        {
          id: 'food-shows-up-retention',
          links: [
            {
              before: 'Si estás evaluando este beneficio, conoce cómo funciona nuestro ',
              label: 'servicio de comedor corporativo',
              href: '/services/comedor-corporativo',
              after: ' y qué se necesita para llevarlo a tu oficina.',
            },
          ],
          title: 'Qué facilita tener un comedor en la oficina',
          body: [
            'Piensa en alguien que tiene una hora para comer. Si debe salir, hacer fila, esperar su pedido y regresar, le queda poco tiempo para descansar. Un comedor dentro de la oficina puede ahorrarle parte de ese recorrido.',
            'El beneficio depende de las condiciones del servicio. Conviene preguntar al equipo a qué hora come, cuánto tiempo tiene y qué opciones necesita. Quienes entran temprano o trabajan en otro turno pueden necesitar un horario distinto.',
          ],
          image: assetSrc('site-service-detail-buffet-toppings-bar'),
          alt: 'Barra de complementos del comedor',
        },
        {
          id: 'perk-versus-operating-layer',
          title: 'Cumplir lo que se ofrece',
          body: [
            'Si anuncias comida de una a tres, debe haber servicio durante todo ese horario. Quedarse sin una opción a la mitad, cambiar precios sin aviso o servir porciones muy distintas genera molestias fáciles de entender.',
            'Antes de lanzar el comedor, acuerda con el proveedor cuántas comidas se preparan, cómo se ajustan a la asistencia y quién resuelve los faltantes. Comunica al equipo qué incluye el servicio y cómo reportar un problema.',
          ],
          image: assetSrc('site-service-detail-chef-plated-dish'),
          alt: 'Chef con un platillo preparado',
        },
        {
          id: 'signal-of-care',
          title: 'Escuchar también forma parte del servicio',
          body: [
            'Los comentarios suelen ser específicos: la sopa llega fría, la fila tarda demasiado o la opción vegetariana se repite. Un canal sencillo para recibirlos ayuda a saber qué corregir. Puede ser un formulario breve o una persona encargada durante el servicio.',
            'Después hay que responder. Si se cambia un platillo o un horario a partir de esos comentarios, avísalo. Si una petición no se puede atender, explica el motivo y busca una alternativa con el proveedor.',
          ],
        },
        {
          id: 'what-to-measure',
          checklist: [
            'Anota la asistencia a la oficina y las comidas servidas por turno durante una semana.',
            'Registra cuánto tarda la fila al inicio, a la mitad y al cierre del horario de comida.',
            'Revisa si el último turno encuentra las mismas opciones y porciones que el primero.',
            'Pregunta a quienes no usan el comedor qué les impide hacerlo.',
            'Elige un problema, acuerda un responsable y una fecha para revisar si quedó resuelto.',
          ],
          title: 'Lista para evaluar el comedor durante una semana',
          body: [
            'Revisa la participación en relación con la asistencia real a la oficina. Cien comidas servidas significan cosas distintas si ese día fueron ciento veinte personas o trescientas. Observa también los tiempos de espera, los faltantes y la comida que sobra.',
            'Complementa esos datos con preguntas concretas: ¿alcanzaste a comer en tu descanso?, ¿encontraste una opción que te gustara?, ¿qué cambiarías? Estas respuestas sirven para mejorar el comedor. Por sí solas, no demuestran que el servicio reduzca la rotación de personal.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿La comida gratis ayuda a retener talento?',
          answer:
            'Puede ser un beneficio valorado por el equipo, pero no garantiza que las personas se queden. Para conocer su importancia en tu empresa, pregunta cómo usan el servicio y considera sus respuestas junto con otros aspectos del trabajo.',
        },
        {
          question: '¿Cómo se calcula el presupuesto por persona?',
          answer:
            'Empieza por la asistencia diaria, los turnos y el número de personas que usarían el servicio. Pide que la propuesta desglose alimentos, personal, equipo y otros costos, y define qué parte paga la empresa y qué parte paga el empleado.',
        },
        {
          question: '¿Qué conviene revisar si pocas personas usan el comedor?',
          answer:
            'Pregunta primero a quienes no lo usan. Revisa horarios, precio, menú, tiempos de espera y opciones para distintas preferencias. Así podrás hacer un cambio concreto y observar si mejora la participación.',
        },
      ],
    },
    {
      slug: 'caida-de-las-3pm-pantry-de-oficina',
      translationKey: 'afternoon-slump-office-pantry',
      href: '/blog/caida-de-las-3pm-pantry-de-oficina',
      title: 'Snacks para oficina: qué ofrecer y cómo organizar la reposición',
      seo: {
        title: 'Snacks para oficina: surtido y reposición | Zitrone',
        description:
          'Qué snacks ofrecer en la oficina y cómo organizar su reposición. Incluye una lista para revisar consumo, existencias y caducidades.',
      },
      cta: {
        heading: 'Organicemos los snacks y las bebidas de tu oficina.',
        label: 'Cotizar snacks y bebidas',
        href: '/contact?src=blog-snacks-cta',
      },
      category: 'Bienestar y productividad',
      date: 'Abril 2026',
      readTime: '3 min de lectura',
      image: assetSrc('site-blog-afternoon-slump-office-pantry'),
      alt: 'Colaboradora eligiendo snacks y bebidas en un pantry de oficina bien abastecido',
      excerpt:
        'Qué tener a mano, cuándo reponerlo y cómo evitar que los favoritos se acaben antes de la tarde. Una guía para organizar los snacks y las bebidas de tu equipo.',
      intro: [
        'A media tarde alguien busca una fruta, otra persona quiere algo salado y alguien más va por café. Si todo se terminó por la mañana, el área de snacks sirve sólo a una parte del equipo.',
        'El pantry —el espacio de snacks y bebidas de la oficina— necesita un surtido pensado para quienes lo usan y un horario de reposición. Aquí hay algunas decisiones que ayudan a organizarlo sin llenar los estantes de productos que nadie elige.',
      ],
      takeaways: [
        'Ofrece variedad y pregunta qué productos usa el equipo.',
        'Planea una revisión del surtido antes de la tarde.',
        'Lleva un registro de faltantes, consumo y caducidades para ajustar los pedidos.',
      ],
      sections: [
        {
          id: 'what-is-the-slump',
          title: 'Revisa qué queda después de la comida',
          body: [
            'Antes de cambiar la lista de compras, observa el servicio durante varios días. Anota qué se termina primero, a qué hora ocurre y qué productos siguen ahí al final de la semana. Considera también cuántas personas asisten cada día.',
            'Un producto que siempre se agota puede necesitar más unidades o una segunda reposición. Uno que casi no se consume puede comprarse con menos frecuencia. Esta revisión evita repetir el mismo pedido por costumbre.',
          ],
          image: assetSrc('site-service-detail-dining-hall-buffet'),
          alt: 'Buffet en un comedor',
        },
        {
          id: 'pantry-mix-by-time',
          links: [
            {
              before: 'En el servicio de ',
              label: 'snacks y bebidas para oficinas',
              href: '/services/pantry-y-restocking',
              after: ' puedes revisar con Zitrone el surtido y la frecuencia de reposición.',
            },
          ],
          title: 'Un surtido con opciones para distintos gustos',
          body: [
            'Puedes combinar fruta de temporada, nueces o semillas, galletas y opciones saladas. Si hay refrigeración adecuada, se pueden incluir productos como yogurt. Elige las cantidades según el consumo y el espacio disponible para guardarlos.',
            'Conserva las etiquetas y la información de ingredientes a la vista. Pregunta por preferencias y restricciones del equipo, y acuerda con el proveedor cómo identificar los productos. Evita presentar una opción como apta para una alergia si no puedes verificarlo.',
          ],
        },
        {
          id: 'quiet-removals',
          title: 'Cambios de surtido que se puedan explicar',
          body: [
            'Si vas a cambiar un producto, avisa y da oportunidad de comentar. Retirar los favoritos sin explicación puede hacer que el equipo perciba el cambio como un recorte, aunque la intención sea ofrecer más variedad.',
            'Prueba unas cuantas opciones nuevas a la vez. Al terminar el periodo de prueba, revisa cuáles se consumieron, cuáles sobraron y qué opinó la gente. Conserva las que tengan sentido para el presupuesto y para quienes usan el servicio.',
          ],
          image: assetSrc('site-service-detail-buffet-toppings-bar'),
          alt: 'Barra con ingredientes y complementos',
        },
        {
          id: 'hydration-the-bigger-half',
          checklist: [
            'Por cada producto, registra existencias al abrir, unidades repuestas y existencias al cerrar.',
            'Anota por separado las unidades retiradas por caducidad o daño para no contarlas como consumo.',
            'Registra a qué hora se agota un producto; el inventario al cierre no muestra cuánto tiempo faltó.',
            'Revisa agua, café, vasos y otros insumos antes del horario de mayor demanda.',
            'Ajusta el siguiente pedido según la asistencia prevista y confirma cuándo llegará.',
          ],
          links: [
            {
              before: 'Para completar el área de bebidas, consulta las opciones de ',
              label: 'máquinas de café y dispensadores de agua',
              href: '/services/cafe-y-agua',
              after: '.',
            },
          ],
          title: 'Lista para revisar la reposición de snacks y bebidas',
          body: [
            'Incluye las bebidas en la revisión diaria: agua disponible, vasos limpios, café y los insumos que necesita la máquina. Define quién repone cada cosa y a quién se avisa si un dispensador deja de funcionar.',
            'Los snacks y las bebidas ofrecen una opción para hacer una pausa o comer algo entre comidas. No conviene prometer que un surtido específico eliminará el cansancio de la tarde o aumentará la productividad. El objetivo del servicio es que las personas encuentren opciones que les gusten cuando las necesitan.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Qué snacks conviene ofrecer en la oficina?',
          answer:
            'Parte de las preferencias del equipo y del espacio disponible. Fruta, nueces, semillas, galletas y opciones saladas permiten variar. Revisa etiquetas, caducidades y condiciones de almacenamiento antes de incorporarlos.',
        },
        {
          question: '¿Hay que quitar los dulces del pantry?',
          answer:
            'La selección se puede acordar con el equipo y la empresa. Puedes ofrecer dulces junto con otras opciones, revisar su consumo y ajustar cantidades sin hacer cambios a escondidas.',
        },
        {
          question: '¿Cada cuánto hay que reponer?',
          answer:
            'Depende del consumo y la asistencia. Revisa el surtido al abrir y antes de la tarde para detectar cuándo hace falta otra reposición. Los pedidos al proveedor pueden tener una frecuencia distinta al llenado de los estantes.',
        },
      ],
    },
    {
      slug: 'como-construir-un-programa-de-alimentacion-corporativa',
      translationKey: 'workplace-food-program-that-works',
      href: '/blog/como-construir-un-programa-de-alimentacion-corporativa',
      title: 'Cómo contratar un comedor corporativo: qué revisar y qué preguntar',
      seo: {
        title: 'Cómo contratar un comedor corporativo | Zitrone',
        description:
          'Qué revisar antes de contratar un comedor corporativo: espacio, horarios, costos y responsabilidades. Incluye una lista para comparar proveedores.',
      },
      cta: {
        heading: 'Cuéntanos cuántas personas van a comer en tu empresa.',
        label: 'Solicitar una propuesta de comedor',
        href: '/contact?src=blog-comedor-cta',
      },
      category: 'Construir un programa',
      date: 'Abril 2026',
      readTime: '3 min de lectura',
      image: assetSrc('site-blog-workplace-food-program-that-works'),
      alt: 'Equipo de cocina preparando alimentos para un programa de comedor corporativo',
      excerpt:
        'Cuántas personas comen, a qué hora, en qué espacio y con qué presupuesto. Lo que necesitas definir antes de contratar un comedor, café, snacks o catering.',
      intro: [
        'Contratar la comida de una oficina implica tomar varias decisiones: dónde se prepara, cómo se sirve, quién recibe al proveedor y qué pasa si llegan más personas de las previstas. Aclararlas desde el principio evita pendientes de último momento.',
        'Para pedir una propuesta útil, reúne primero la información de tu oficina. Con ella podrás comparar servicios y saber qué incluye cada cotización.',
      ],
      takeaways: [
        'Calcula la asistencia por día y por turno, además del total de empleados.',
        'Confirma qué permite el espacio y qué equipo hace falta.',
        'Deja por escrito horarios, responsables, costos y atención a imprevistos.',
      ],
      sections: [
        {
          id: 'start-with-workday',
          title: 'Cuántas personas van a comer y a qué hora',
          body: [
            'La plantilla total es un punto de partida, pero no basta para calcular las comidas. Revisa la asistencia por día, los turnos, los horarios de descanso y las visitas que suelen recibir. En una oficina híbrida, el martes puede tener una demanda muy distinta al viernes.',
            'Pregunta también por preferencias y restricciones alimentarias. Entrega al proveedor un estimado por horario y acuerda con cuánta anticipación se puede modificar el pedido. Así tendrá una base para calcular porciones y personal.',
          ],
          image: assetSrc('site-service-detail-staff-handwashing'),
          alt: 'Integrante del equipo lavándose las manos',
        },
        {
          id: 'choose-service-model',
          links: [
            {
              before: 'Consulta las opciones de ',
              label: 'comedor corporativo',
              href: '/services/comedor-corporativo',
              after: ' para revisar qué modelo se adapta al espacio de tu empresa.',
            },
            {
              before: 'Para capacitaciones o visitas, puedes planear un ',
              label: 'servicio de catering corporativo',
              href: '/services/catering-corporativo',
              after: ' con cantidades y horarios propios.',
            },
          ],
          title: 'Qué servicio cabe en tu espacio',
          body: [
            'Revisa si hay cocina, refrigeración, área de lavado, conexiones y espacio para servir y comer. Considera por dónde entran los alimentos, dónde se almacenan y cómo se retiran los residuos. Una visita técnica permite confirmar qué se puede ofrecer.',
            'Según esas condiciones, puedes evaluar comida preparada fuera de la oficina, cocina en sitio, cafetería o un servicio de snacks y bebidas. El catering para reuniones puede contratarse aparte, con su propio calendario y número de asistentes.',
          ],
          image: assetSrc('site-service-detail-chef-plated-dish'),
          alt: 'Chef con un platillo preparado',
        },
        {
          id: 'build-operating-rhythm',
          title: 'Qué debe quedar acordado con el proveedor',
          body: [
            'La propuesta debe especificar qué incluye el precio: alimentos, transporte, personal, equipo, montaje y limpieza. Pide también los horarios de entrega y servicio, las condiciones para cambiar cantidades y los cargos adicionales que podrían aplicar.',
            'Nombra a una persona de contacto de cada lado. Deja claro quién recibe los pedidos, quién confirma los cambios y cómo se atienden retrasos, faltantes o fallas de equipo. Revisa con el proveedor los procedimientos de higiene y manejo de alimentos que aplican al servicio.',
          ],
          image: assetSrc('site-service-detail-pantry-attendant-portrait'),
          alt: 'Persona encargada del servicio de snacks y bebidas',
        },
        {
          id: 'measure-and-adjust',
          title: 'Qué revisar durante las primeras semanas',
          body: [
            'Da seguimiento a las comidas servidas, los tiempos de espera, los faltantes y las porciones que sobran. Recoge comentarios sobre sabor, variedad, temperatura y tamaño de las porciones. Compáralos con el presupuesto y la asistencia de cada día.',
            'Acuerda una fecha para revisar esos resultados con el proveedor. Si la fila es larga, quizá haga falta ajustar el montaje o escalonar horarios. Si sobra comida de manera recurrente, revisa las cantidades antes de hacer el siguiente pedido.',
          ],
        },
        {
          id: 'bottom-line',
          checklist: [
            'Envía a todos los proveedores el mismo estimado de comensales, días y horarios.',
            'Pide un menú de ejemplo y el detalle de porciones, bebidas y opciones disponibles.',
            'Compara el total e identifica por separado alimentos, personal, transporte, equipo e impuestos.',
            'Confirma mínimos de contratación, plazos de aviso y cargos por cambios o cancelaciones.',
            'Deja por escrito quién limpia, repone, mantiene el equipo y atiende los faltantes.',
            'Acuerda una visita al espacio y una revisión del servicio después del arranque.',
          ],
          title: 'Lista para comparar propuestas de comedor corporativo',
          body: [
            'Prepara un resumen con ubicación, asistencia estimada, horarios, presupuesto, servicios que buscas y fecha de inicio. Incluye fotos o planos del espacio si los tienes y señala qué equipo está disponible.',
            'Con esos datos, en Zitrone podemos revisar contigo las opciones de servicio y lo que hace falta para ponerlas en marcha. La propuesta debe dejar claro qué recibirá tu equipo y quién estará a cargo de cada tarea.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Qué debe incluir una propuesta de alimentación corporativa?',
          answer:
            'El alcance del servicio, menú u opciones de surtido, cantidades, horarios, personal, equipo, limpieza y precio desglosado. También debe explicar cómo se solicitan cambios y cómo se atienden los imprevistos.',
        },
        {
          question: '¿Necesitamos una cocina en la oficina?',
          answer:
            'No en todos los casos. Se pueden evaluar alimentos preparados fuera de la oficina, pero hay que confirmar las condiciones para recibirlos, conservarlos y servirlos. Una visita al espacio ayuda a definir el modelo adecuado.',
        },
        {
          question: '¿Qué coordina Zitrone?',
          answer:
            'De acuerdo con el servicio contratado, Zitrone coordina la preparación, entrega, personal de servicio y reposición. El alcance y los responsables se definen en la propuesta para que tu equipo sepa a quién acudir.',
        },
      ],
      topics: [
        'Alimentación corporativa',
        'Operación',
        'Comedor diario',
        'Modelo de servicio',
        'Seguridad alimentaria',
      ],
    },
  ],
}
