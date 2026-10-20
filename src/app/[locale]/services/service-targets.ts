import type { FeatureIconName } from "@/app/_components/home/home-data"
import { SERVICE_NAMES, type ServiceKey } from "@/lib/service-names"

export type ServiceTarget = {
  slug: string
  theme: ServiceKey
  title: string
  /** Hero headline: the service's promise, set under the service name. The
      accent is the culture verb, set in the brand green like the home hero.
      `trail` carries its own leading space or punctuation. */
  headline: { lead: string; accent: string; trail: string }
  metaTitle: string
  metaDescription: string
  lede: string
  summary: string
  whyItMatters: string
  operatingFit: string
  relatedBlogLabel: string
  relatedBlogHref: string
}

export type ServiceTemplateMetric = {
  value: string
  label: string
}

export type ServiceTemplateOverview = {
  headingLead: string
  headingAccent: string
  headingTrail?: string
  /** Overview CTA, named after the service so it reads as the next step. */
  ctaLabel: string
  copy: string
  metrics: ServiceTemplateMetric[]
}

export type ServiceTemplateFaq = {
  question: string
  answer: string
}

/** One outcome of the service, for the "what it solves" zone. */
export type ServiceTemplatePoint = {
  title: string
  copy: string
  icon?: FeatureIconName
}

/** The operating standard, identical for every service. */
export type ServiceStandard = {
  kicker: string
  headingLead: string
  headingAccent: string
  intro: string
  points: Required<ServiceTemplatePoint>[]
}

export type ServiceTemplateContent = {
  overview: ServiceTemplateOverview
  /* Section contract: every zone answers one question and no fact is repeated
     across zones. `resolves` is the "what does it solve" zone; how the service
     is run is not written per service, it is the shared `getServiceStandard`
     block below. */
  resolves?: { points: ServiceTemplatePoint[] }
  /** 'service' shows this service's own FAQs and emits FAQPage structured data. */
  faqScope?: 'service' | 'general'
  faqs: ServiceTemplateFaq[]
  testimonialStory: string
}

export type ServiceCallToAction = {
  hero: { label: string }
  overview: { label: string }
}

export function getServiceCta(locale: string): ServiceCallToAction {
  if (locale === "es") {
    return {
      hero: { label: "Conoce más" },
      overview: { label: "Hablemos" },
    }
  }

  return {
    hero: { label: "Learn more" },
    overview: { label: "Contact us" },
  }
}

/* The same for every service, in both locales: how Zitrone operates, not what
   this particular service contains. It replaced the per-service sales-process
   steps, which were a plausible reconstruction rather than a documented flow. */
export function getServiceStandard(locale: string): ServiceStandard {
  if (locale === "es") {
    return {
      kicker: "El estándar Zitrone",
      headingLead: "Así cuidamos",
      headingAccent: "a tu empresa y a tu gente",
      intro: "Operamos tu alimentación corporativa para que cada persona esté bien atendida y tú tengas un pendiente menos.",
      points: [
        {
          title: "Los mismos estándares todos los días",
          copy: "Distintivo H, NOM-251 y control de temperatura en cada servicio.",
          icon: "shield",
        },
        {
          title: "No contratas ni administras a nadie",
          copy: "El personal es nuestro, con IMSS y REPSE al día.",
          icon: "people",
        },
        {
          title: "El servicio mejora cada mes",
          copy: "Vemos qué gustó, cuánta gente vino y qué sobró.",
          icon: "chart",
        },
        {
          title: "Ya operamos en empresas como la tuya",
          copy: "17 años y 15,000 comidas servidas cada día.",
          icon: "briefcase",
        },
      ],
    }
  }

  return {
    kicker: "The Zitrone standard",
    headingLead: "How we keep",
    headingAccent: "your workplace working",
    intro: "We run your corporate food service so your people are well looked after and it's off your plate.",
    points: [
      {
        title: "The same standards every day",
        copy: "Distintivo H, NOM-251 and temperature control at every service.",
        icon: "shield",
      },
      {
        title: "You hire and manage no one",
        copy: "The staff is ours, with IMSS and REPSE current.",
        icon: "people",
      },
      {
        title: "The service gets better every month",
        copy: "We see what people liked, who came, what was left.",
        icon: "chart",
      },
      {
        title: "We already run programs at companies like yours",
        copy: "17 years and 15,000 meals served every day.",
        icon: "briefcase",
      },
    ],
  }
}

export function getServiceTemplateContent(
  locale: string,
  theme: ServiceTarget["theme"],
): ServiceTemplateContent {
  if (locale === "es") {
    const content: Record<ServiceTarget["theme"], ServiceTemplateContent> = {
      dining: {
        overview: {
          headingLead: "Comida que tu equipo espera,",
          headingAccent: "todos los días",
          ctaLabel: "Diseñemos tu comedor",
          copy:
            "Zitrone opera el comedor completo: cocina, menú, personal, abasto, limpieza e inocuidad, con la flexibilidad de cocinar en tu sede o entregar fresco desde nuestro comisariato.",
          metrics: [
            { value: "3", label: "tipos de servicio: corporativo, premium e industrial" },
            { value: "2", label: "modelos de producción: cocina en sitio o comisariato" },
            { value: "Diario", label: "menú fresco y variado" },
            { value: "Por persona", label: "cuota subsidiada, no subsidiada o híbrida" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Comedor corporativo, industrial o premium",
              copy: "Tres formatos, según el tamaño y los turnos de tu empresa.",
              icon: "utensils",
            },
            {
              title: "Con **cocina en sitio** o **sin cocina en sitio**",
              copy: "Sin cocina, la comida llega terminada y transportada por nosotros.",
              icon: "chef",
            },
            {
              title: "Menús diseñados por nutriólogos",
              copy: "Cambian cada semana, con opción vegetariana y alérgenos etiquetados.",
              icon: "leaf",
            },
          ],
        },
        faqs: [
          {
            question: "¿Qué diferencia hay entre un comedor corporativo, industrial y premium?",
            answer:
              "El corporativo es para oficinas, con menú del día y barras de servicio. El industrial está pensado para plantas con varios turnos y alto volumen. El premium suma proteínas especiales, repostería fina y una experiencia tipo restaurante.",
          },
          {
            question: "¿Se puede tener un servicio tipo buffet o asistido por personal?",
            answer:
              "Las dos. En buffet o self-service, cada persona se sirve de barras que se mantienen surtidas durante todo el servicio. En servicio asistido, personal de Zitrone sirve en la línea con porciones controladas. También se pueden combinar, por ejemplo plato fuerte asistido y barra de ensaladas en self-service.",
          },
          {
            question: "¿Necesitamos una cocina en el edificio para tener comedor?",
            answer:
              "No. Si tu sede tiene cocina, producimos ahí mismo. Si solo hay espacio para servir, cocinamos en nuestro comisariato y llevamos la comida lista. Si todavía no hay espacio, lo definimos contigo.",
          },
          {
            question: "¿Por qué tercerizar el comedor en lugar de operarlo internamente?",
            answer:
              "Porque tu empresa deja de contratar personal, comprar insumos y responder por la inocuidad. Zitrone opera todo con estándares documentados, y tu equipo solo decide el presupuesto y el horario.",
          },
          {
            question: "¿Cuánto cuesta un comedor para empresas?",
            answer:
              "Depende del menú, el formato y el número de comensales, y se cobra por comida servida. La empresa puede subsidiar la cuota completa, trasladarla al colaborador o repartirla. Te preparamos una propuesta con el costo por comensal.",
          },
          {
            question: "¿Cómo se garantiza la inocuidad de la comida?",
            answer:
              "Nuestras instalaciones cuentan con Distintivo H y cada lote se produce con control HACCP, registro de temperaturas y bitácoras auditables. Hay un supervisor asignado a tu cuenta que atiende cualquier incidencia en menos de dos horas.",
          },
          {
            question: "¿Cómo sabemos si el comedor está funcionando?",
            answer:
              "Medimos asistencia, satisfacción y desperdicio, y revisamos los resultados contigo de forma periódica para ajustar el menú y el servicio.",
          },
        ],
        testimonialStory: "Uber",
      },
      cafe: {
        overview: {
          headingLead: "Una cafetería completa,",
          headingAccent: "operada por Zitrone",
          ctaLabel: "Diseñemos tu cafetería",
          copy:
            "Montamos la cafetería, ponemos el equipo y el barista, y operamos bebidas, comida lista, abasto, limpieza y mantenimiento todos los días.",
          metrics: [
            { value: "Barista", label: "y personal Zitrone en sitio" },
            { value: "Diario", label: "abasto, limpieza y mantenimiento" },
            { value: "Frío + caliente", label: "bebidas recién preparadas" },
            { value: "Grab & Go", label: "comida fresca lista para llevar" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Barra de café con productos de especialidad",
              copy: "Cafés y tés preparados por barista.",
              icon: "coffee",
            },
            {
              title: "Comida fría y caliente, en sitio o para llevar",
              copy: "Desayunos, grab & go, repostería fina, botanas y más.",
              icon: "utensils",
            },
            {
              title: "Smoothies, frappés y jugos cold pressed",
              copy: "Licuados y bebidas frías, más allá del café.",
              icon: "drink",
            },
          ],
        },
        faqs: [
          {
            question: "¿Qué espacio se necesita para montar una cafetería?",
            answer:
              "El que tengas. Diseñamos la barra al espacio disponible y ajustamos la carta y el equipo a lo que cabe; la instalación corre por nuestra cuenta.",
          },
          {
            question: "¿Quién atiende la barra y con qué estándar?",
            answer:
              "Un barista de Zitrone, en sitio cada día. La operación incluye abasto, limpieza y mantenimiento del punto, con reporte de consumo mensual.",
          },
          {
            question: "¿Cuántas personas se necesitan para que convenga una cafetería?",
            answer:
              "Depende del flujo diario, no solo del headcount. El servicio arranca 30 días después de confirmar, con la carta y los horarios ajustados a tu operación.",
          },
          {
            question: "¿Cómo se cobra la cafetería?",
            answer:
              "Facturación mensual sobre el consumo real. La empresa puede pagar todo, subsidiar un porcentaje o dejar que cada colaborador cubra lo que consume.",
          },
        ],
        testimonialStory: "Salesforce",
      },
      pantry: {
        overview: {
          headingLead: "Un pantry surtido y atendido,",
          headingAccent: "todos los días",
          ctaLabel: "Diseñemos tu servicio de snacks",
          copy:
            "Personal de Zitrone en sitio surte, distribuye y reabastece un catálogo elegido contigo, con fruta fresca y las opciones saludables al frente, con consumo abierto o una asignación diaria por persona, y un precio armado según los productos que elijas.",
          metrics: [
            { value: "L–V", label: "acceso diario para colaboradores" },
            { value: "Diario", label: "surtido y reabasto operados por Zitrone" },
            { value: "A tu medida", label: "catálogo elegido con tu equipo" },
            { value: "2 modelos", label: "consumo abierto o asignación por persona" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Snacks, bebidas y fruta fresca cada día",
              copy: "Personal de Zitrone en sitio surte, distribuye y reabastece.",
              icon: "fruit",
            },
            {
              title: "Catálogo elegido contigo, con lo saludable al frente",
              copy: "Fruta, barras, frutos secos y snacks bajos en azúcar a la vista.",
              icon: "leaf",
            },
            {
              title: "Consumo abierto o con asignación por persona",
              copy: "La asignación pone límites por persona para un costo más controlado.",
              icon: "people",
            },
          ],
        },
        faqs: [
          {
            question: "¿Qué incluye el servicio de snacks y bebidas para oficina?",
            answer:
              "La operación completa, no solo el producto. Incluye personal de Zitrone en sitio, surtido y reabasto diario, el catálogo armado a la medida de tu empresa y un reporte de consumo. Acceso de lunes a viernes, con reabasto al arranque de cada día.",
          },
          {
            question: "¿En qué se diferencia de una máquina de vending?",
            answer:
              "En que hay alguien operándolo. El vending es autoservicio y cobra por pieza; aquí hay personal de Zitrone que surte, acomoda y entrega los productos, y el colaborador no paga nada en el momento. Eso permite un catálogo mucho más amplio, con fruta fresca y producto perecedero que una máquina no puede manejar.",
          },
          {
            question: "¿Qué productos entran en el catálogo?",
            answer:
              "Cuatro familias de snack más bebidas. Snacks salados como papas, nueces, semillas y botanas horneadas; snacks dulces como chocolates, galletas y barras; opciones saludables como barras de proteína, granola y mix de frutos secos; fruta fresca de temporada en porciones individuales; y bebidas: agua natural y mineral, refrescos, jugos, isotónicos y funcionales. También entran básicos como cereal y té, que se integran con el servicio de café.",
          },
          {
            question: "¿Hay opciones saludables, sin azúcar, sin gluten o veganas?",
            answer:
              "Sí, y además van al frente. Acomodamos el pantry con un planograma que prioriza el perfil nutricional: la fruta fresca, las crudités y los snacks bajos en azúcar van en los niveles principales, a la altura de los ojos, y los dulces y antojos quedan disponibles en niveles inferiores. El catálogo incluye alternativas sin azúcar, sin gluten y veganas.",
          },
          {
            question: "¿Cómo se evita que el consumo se dispare?",
            answer:
              "Con el programa de asignación, que pone límites por persona, por ejemplo dos bebidas y cuatro snacks al día. El personal entrega los productos con registro por tarjeta, pieza por pieza, así que el consumo real queda medido y visible. Trabajamos con benchmarks de consumo para que el costo sea predecible desde el primer mes.",
          },
          {
            question: "¿Qué se necesita en la oficina para montar un pantry?",
            answer:
              "Un mueble o rack y un punto de servicio. Nosotros llevamos el catálogo, la gente y el reabasto; no hay equipo que comprar ni instalar.",
          },
          {
            question: "¿Qué tamaño de oficina necesita un pantry atendido?",
            answer:
              "Funciona donde el equipo asiste de lunes a viernes. El surtido y el número de puntos se definen según headcount, pisos ocupados y ritmo de asistencia; el reabasto se calcula en piezas por persona al día, normalmente tres, cuatro o seis.",
          },
          {
            question: "¿Cuánto cuesta y cómo se cobra el servicio de snacks y bebidas?",
            answer:
              "Con un precio personalizado según los productos que elijas y el programa. Hay dos programas: consumo abierto, o asignación con límites por persona, que es la opción de costo más controlado. Si hay que cuidar el presupuesto, hacemos substituciones a costo neutral: cambiamos los productos de mayor costo por alternativas de costo igual o menor, manteniendo la variedad y la rotación. La selección final se confirma contigo.",
          },
        ],
        testimonialStory: "Pinterest",
      },
      coffee: {
        overview: {
          headingLead: "Café recién molido y agua filtrada,",
          headingAccent: "sin comprar equipo",
          ctaLabel: "Diseñemos tu servicio de café",
          copy:
            "Instalamos las cafeteras y los dispensadores de agua, los surtimos a diario y les damos mantenimiento. No compras el equipo: pagas por taza servida, y el café en grano ya va incluido.",
          metrics: [
            { value: "24/7", label: "equipos disponibles para tu equipo" },
            { value: "Diario", label: "reabasto y limpieza de cafeteras" },
            { value: "6 meses", label: "cambio de filtros y pruebas de agua" },
            { value: "Por taza", label: "modelo de pago para el servicio de café" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Las máquinas las ponemos nosotros",
              copy: "No compras ni rentas equipo. Instalación, abasto, limpieza y mantenimiento preventivo incluidos.",
              icon: "machine",
            },
            {
              title: "Espresso, americano, cappuccino, cortado y latte",
              copy: "Café 100% arábiga de Chiapas y Veracruz, más chocolate y tés.",
              icon: "coffee",
            },
            {
              title: "Agua fría, caliente, al tiempo y mineral con gas",
              copy: "Filtración multietapa, con cambio de filtros y pruebas microbiológicas semestrales.",
              icon: "water",
            },
          ],
        },
        faqs: [
          {
            question: "¿Es renta de cafeteras o hay que comprarlas?",
            answer:
              "No compras nada. Las máquinas son nuestras y el montaje corre por nuestra cuenta; tú pagas una tarifa mensual según el volumen de tazas que contrates, y ahí ya va el café en grano, el abasto diario, las visitas y el mantenimiento preventivo. Aparte se venden por caja los consumibles: leches, endulzantes, vasos y tapas.",
          },
          {
            question: "¿Qué cafetera conviene según el tamaño de la oficina?",
            answer:
              "Hay un equipo para cada volumen. La Lirika Plus, compacta, para equipos pequeños: espumador de vapor y unas 50 tazas al día. La Krea Touch, para oficinas medianas: pantalla táctil, 10 bebidas, conectada a la red hídrica y hasta 150 tazas al día. La Aulika Top EVO, premium para alto tráfico: doble caldera y cappuccino automático. Y la Saeco Idea Duo tiene dos tolvas, para servir regular y descafeinado al mismo tiempo. El precio por taza es el mismo en todas, así que eliges por capacidad, no por costo.",
          },
          {
            question: "¿Qué bebidas se pueden preparar?",
            answer:
              "Con café: americano, espresso, espresso americano, cappuccino, cortado y latte. Sin café: moka, chocolate caliente y cinco tés Bigelow o Stash. Hay sabores a elegir como matcha, chai, vainilla francesa, cajeta, horchata o pumpkin spice. En leches van entera, light y deslactosada, más alternativas vegetales de almendra, avena, coco y soya.",
          },
          {
            question: "¿De dónde viene el café?",
            answer:
              "Es una selección 100% arábiga de altura, variedades bourbon y typica, cultivada en comunidades autosustentables de Chiapas y Veracruz. Hay control de calidad en cada etapa y trazabilidad por lote. En taza da cuerpo abundante, acidez cítrica y notas dulces. Se muele en el momento en cada bebida; nunca es instantáneo.",
          },
          {
            question: "¿Cuántas tazas al mes cubre el servicio?",
            answer:
              "El servicio se contrata por volumen mensual de tazas, hasta 3,000 al mes por plan. Eliges el volumen según el tamaño del equipo, y el costo por taza baja conforme subes de plan. Se mide con el contador de cada máquina, con conteo mensual validado contigo.",
          },
          {
            question: "¿Se necesita una toma de agua para instalar los equipos?",
            answer:
              "Los dispensadores sí: se conectan a la red y filtran ahí mismo. Las cafeteras solo necesitan corriente y un punto de servicio, salvo la Krea Touch, que también se conecta a la red para no recargar agua. La instalación va por nuestra cuenta en todos los casos.",
          },
          {
            question: "¿Qué tipos de agua dan los dispensadores?",
            answer:
              "Cuatro: fría, caliente, al tiempo y mineral con gas. Son equipos nuevos con filtración de varias etapas, disponibles las 24 horas todo el año. Cada seis meses cambiamos filtros y corremos pruebas microbiológicas de calidad.",
          },
          {
            question: "¿Cuánto tarda en arrancar el servicio?",
            answer:
              "Treinta días desde que confirmas. Operamos en días hábiles del calendario oficial mexicano y las máquinas quedan disponibles las 24 horas. El contrato es a 24 meses, el plazo en que se amortiza el equipo que ponemos nosotros.",
          },
        ],
        testimonialStory: "AT&T",
      },
      "grab-go": {
        overview: {
          headingLead: "Comida fresca que",
          headingAccent: "recorre tu oficina",
          ctaLabel: "Diseñemos tu servicio de carritos",
          copy:
            "Un carrito surtido pasa por cada piso en horarios definidos contigo, para que tu equipo elija comida fresca y lista sin salir de su lugar.",
          metrics: [
            { value: "Por piso", label: "recorrido definido con tu operación" },
            { value: "Diario", label: "surtido y reabasto del carrito" },
            { value: "En sitio", label: "personal Zitrone opera el servicio" },
            { value: "A medida", label: "catálogo, pisos y horarios" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Un punto de servicio móvil, sin montar nada",
              copy: "Sumas comida en la oficina sin obra ni equipo fijo.",
              icon: "cart",
            },
            {
              title: "Recorrido y horarios definidos con tu operación",
              copy: "Ponemos carrito, producto y gente, con reabasto diario.",
              icon: "clock",
            },
            {
              title: "Del salado a la fruta, listo para comer",
              copy: "Ensaladas, sándwiches, wraps, pastas y platos del día.",
              icon: "utensils",
            },
          ],
        },
        faqs: [
          {
            question: "¿Se puede usar en un edificio de varios pisos?",
            answer:
              "Sí, es el escenario para el que existe. El carrito recorre los pisos que definas en horarios fijos, y puede sumarse un punto de servicio adicional.",
          },
          {
            question: "¿Cómo se mantiene fresca la comida durante el recorrido?",
            answer:
              "El carrito se surte y se reabastece cada día. La comida va en porciones listas para comer, y el catálogo se ajusta con lo que tu equipo sí consume.",
          },
          {
            question: "¿Cuántos pisos o personas necesita el servicio?",
            answer:
              "Se define por el recorrido, no por un mínimo fijo. Ajustamos pisos, horarios y catálogo al tamaño de tu equipo y a lo que le gusta.",
          },
          {
            question: "¿Cómo se cobra el carrito de servicio?",
            answer:
              "Facturación mensual sobre el consumo real. La empresa puede cubrirlo, subsidiar un porcentaje o dejar que cada persona pague lo que toma.",
          },
        ],
        testimonialStory: "Pinterest",
      },
      catering: {
        overview: {
          headingLead: "Tu evento,",
          headingAccent: "resuelto de principio a fin",
          ctaLabel: "Diseñemos tu evento",
          copy:
            "Diseñamos el menú a la medida y coordinamos comida, montaje, loza, cristalería, mantelería y meseros en una sola propuesta.",
          metrics: [
            { value: "1 equipo", label: "coordinación con proveedores externos" },
            { value: "Catálogo", label: "paquetes o propuesta a la medida" },
            { value: "Todo incluido", label: "comida, montaje, loza y meseros" },
            { value: "1 aliado", label: "coordinación de principio a fin" },
          ],
        },
        faqScope: "service",
        resolves: {
          points: [
            {
              title: "Coffee break, desayuno, box lunch o comida emplatada",
              copy: "Elegimos el formato según el momento del evento.",
              icon: "calendar",
            },
            {
              title: "Paquetes del catálogo o propuesta a la medida",
              copy: "Menús armados para los gustos y restricciones de tus invitados.",
              icon: "chat",
            },
            {
              title: "Montaje, loza, mantelería y meseros coordinados",
              copy: "Un solo proveedor produce, monta y atiende el evento.",
              icon: "people",
            },
          ],
        },
        faqs: [
          {
            question: "¿Se puede servir en nuestras propias oficinas?",
            answer:
              "Sí. Llevamos comida, montaje, loza, cristalería y mantelería al lugar del evento. Los formatos de entrega, como el box lunch, llegan fríos y listos para servir.",
          },
          {
            question: "¿Quién coordina el montaje el día del evento?",
            answer:
              "Zitrone, de principio a fin. Producción, logística, montaje y servicio van en la misma propuesta, así no tienes que coordinar varios proveedores en paralelo.",
          },
          {
            question: "¿Cuántos invitados se necesitan para contratar catering?",
            answer:
              "Diez comensales. A partir de ahí el formato se elige según el evento, desde un coffee break de cinco horas hasta una comida emplatada.",
          },
          {
            question: "¿Cómo se cotiza un catering corporativo?",
            answer:
              "Por persona, según el paquete elegido. Los meseros se cobran aparte, en $1,100 más IVA cada uno, y los precios de menú tampoco incluyen IVA.",
          },
        ],
        testimonialStory: "Capital One",
      },
    }

    return content[theme]
  }

  const content: Record<ServiceTarget["theme"], ServiceTemplateContent> = {
    dining: {
      overview: {
        headingLead: "Food your team looks forward to,",
        headingAccent: "every day",
        ctaLabel: "Let's design your dining program",
        copy:
          "Zitrone runs the full dining room: kitchen, menus, staff, supply, cleaning, and food safety, with the flexibility to cook on site or deliver fresh from our central commissary.",
        metrics: [
          { value: "3", label: "service types: corporate, premium, and industrial" },
          { value: "2", label: "production models: on-site kitchen or commissary" },
          { value: "Daily", label: "fresh, varied menus" },
          { value: "Per person", label: "subsidized, employee-paid, or hybrid fee" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "Corporate, industrial or premium dining",
            copy: "Three formats, matched to your headcount and your shifts.",
            icon: "utensils",
          },
          {
            title: "With an **on-site kitchen** or **no kitchen on site**",
            copy: "Without one, the food arrives finished and delivered by us.",
            icon: "chef",
          },
          {
            title: "Menus designed by nutritionists",
            copy: "They change weekly, with a vegetarian option and allergens labelled.",
            icon: "leaf",
          },
        ],
      },
      faqs: [
        {
          question: "What is the difference between a corporate, industrial and premium dining program?",
          answer:
            "Corporate is for offices, with a daily menu and service bars. Industrial is built for plants with multiple shifts and high volume. Premium adds specialty proteins, fine pastries and a restaurant-style experience.",
        },
        {
          question: "Can the service be buffet-style or staffed?",
          answer:
            "Both. With a buffet or self-service, each person serves themselves from bars kept stocked throughout the service. With staffed service, Zitrone staff serve on the line with controlled portions. The two can also be combined, for example a staffed main course and a self-service salad bar.",
        },
        {
          question: "Do we need a kitchen in the building to have a dining room?",
          answer:
            "No. If your site has a kitchen, we cook there. If there is only space to serve, we cook in our commissary and bring the food ready to serve. If there is no space yet, we define it with you.",
        },
        {
          question: "Why outsource the dining room instead of running it in-house?",
          answer:
            "Because your company stops hiring staff, buying supplies and carrying food-safety liability. Zitrone runs everything to documented standards, and your team only decides the budget and the service hours.",
        },
        {
          question: "How much does a corporate dining program cost?",
          answer:
            "It depends on the menu, the format and the number of diners, and it is charged per meal served. The company can subsidize the full fee, pass it to the employee or split it. We prepare a proposal with the cost per diner.",
        },
        {
          question: "How is food safety guaranteed?",
          answer:
            "Our facilities hold Distintivo H, and every batch is produced under HACCP control, with temperature logs and auditable records. A supervisor assigned to your account handles any incident in under two hours.",
        },
        {
          question: "How do we know the dining program is working?",
          answer:
            "We track attendance, satisfaction and waste, and review the results with you regularly to adjust the menu and the service.",
        },
      ],
      testimonialStory: "Uber",
    },
    cafe: {
      overview: {
        headingLead: "A complete workplace cafe,",
        headingAccent: "operated by Zitrone",
        ctaLabel: "Let's design your café",
        copy:
          "We set up the cafe, provide the equipment and barista, and operate beverages, ready food, supply, cleaning, and maintenance every day.",
        metrics: [
          { value: "Barista", label: "and Zitrone staff on site" },
          { value: "Daily", label: "supply, cleaning, and maintenance" },
          { value: "Hot + cold", label: "freshly prepared beverages" },
          { value: "Grab & Go", label: "fresh food ready to take away" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "A coffee bar with specialty products",
            copy: "Coffees and teas made by a barista.",
            icon: "coffee",
          },
          {
            title: "Hot and cold food, to eat in or take away",
            copy: "Breakfasts, grab & go, fine pastries, snacks and more.",
            icon: "utensils",
          },
          {
            title: "Smoothies, frappés and cold-pressed juices",
            copy: "Shakes and cold drinks, beyond coffee.",
            icon: "drink",
          },
        ],
      },
      faqs: [
        {
          question: "How much space does a workplace cafe need?",
          answer:
            "Whatever you have. We design the bar around the available space and fit the menu and equipment to it; the build-out is on us.",
        },
        {
          question: "Who runs the bar, and to what standard?",
          answer:
            "A Zitrone barista, on site each day. Operations cover stocking, cleaning and upkeep of the point, with a monthly consumption report.",
        },
        {
          question: "How many people does a cafe need to make sense?",
          answer:
            "It depends on daily footfall, not only headcount. The service starts 30 days after confirmation, with the menu and hours fitted to your operation.",
        },
        {
          question: "How is the cafe charged?",
          answer:
            "Monthly billing on actual consumption. The company can pay it all, subsidise a percentage, or let each employee cover what they take.",
        },
      ],
      testimonialStory: "Salesforce",
    },
    pantry: {
      overview: {
        headingLead: "A pantry stocked and staffed,",
        headingAccent: "every single day",
        ctaLabel: "Let's design your snack program",
        copy:
          "Zitrone people on site stock, distribute, and replenish a catalogue selected with you, with fresh fruit and the healthier options up front, with open consumption or a daily per-person allocation, and pricing built around the products you choose.",
        metrics: [
          { value: "Mon-Fri", label: "daily employee access" },
          { value: "Daily", label: "stocking and replenishment by Zitrone" },
          { value: "Tailored", label: "catalogue chosen with your team" },
          { value: "2 models", label: "open consumption or per-person allocation" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "Snacks, drinks, and fresh fruit every day",
            copy: "Zitrone people on site stock, hand out, and replenish.",
            icon: "fruit",
          },
          {
            title: "A catalogue chosen with you, healthy first",
            copy: "Fruit, bars, nuts, and lower-sugar snacks at eye level.",
            icon: "leaf",
          },
          {
            title: "Open consumption or a per-person allocation",
            copy: "Allocation sets per-person limits for a more controlled cost.",
            icon: "people",
          },
        ],
      },
      faqs: [
        {
          question: "What does the office snacks and beverages service include?",
          answer:
            "The full operation, not just the product. It covers Zitrone staff on site, daily stocking and replenishment, a catalogue built around your company, and a consumption report. Access runs Monday to Friday, and anything that runs out during the day is back at the start of the next one.",
        },
        {
          question: "How is this different from a vending machine?",
          answer:
            "Someone actually runs it. Vending is self-service and charges by the item; here Zitrone staff stock it, arrange it, and hand products out, and employees pay nothing at the point of use. That allows a far wider catalogue, including fresh fruit and perishables a machine cannot handle.",
        },
        {
          question: "What products are in the catalogue?",
          answer:
            "Four snack families plus drinks. Savoury snacks such as crisps, nuts, seeds, and baked snacks; sweet snacks such as chocolates, biscuits, and bars; healthier options such as protein bars, granola, and trail mix; seasonal fresh fruit in individual portions; and beverages: still and sparkling water, sodas, juices, isotonic and functional drinks. Basics such as cereal and tea are included too, tied in with the coffee service.",
        },
        {
          question: "Are there healthy, sugar-free, gluten-free, or vegan options?",
          answer:
            "Yes, and they go up front. We arrange the pantry to a planogram that prioritises nutritional profile: fresh fruit, crudites, and lower-sugar snacks sit on the main shelves at eye level, while sweets and treats stay available on the lower ones. The catalogue includes sugar-free, gluten-free, and vegan alternatives.",
        },
        {
          question: "How do you keep consumption from running away?",
          answer:
            "With the allocation program, which sets per-person limits, say two drinks and four snacks a day. Staff hand items out with card tracking, item by item, so real consumption is measured and visible. We work to consumption benchmarks so cost is predictable from the first month.",
        },
        {
          question: "What does the office need for a pantry to work?",
          answer:
            "A cabinet or rack and a service point. We bring the catalogue, the people, and the replenishment; there is no equipment to buy or install.",
        },
        {
          question: "What size of office does a staffed pantry fit?",
          answer:
            "It fits offices where the team comes in Monday to Friday. Assortment and number of points follow headcount, occupied floors, and attendance rhythm; replenishment is calculated in items per person per day, typically three, four, or six.",
        },
        {
          question: "How much does the snacks and beverages service cost, and how is it charged?",
          answer:
            "Pricing is personalised to the products you choose and the program. There are two programs: open consumption, or an allocation with per-person limits, which is the option with the most controlled cost. Where budget needs protecting, we make cost-neutral substitutions: higher-cost items are swapped for alternatives at equal or lower cost, keeping variety and rotation. The final selection is confirmed with you.",
        },
      ],
      testimonialStory: "Pinterest",
    },
    coffee: {
      overview: {
        headingLead: "Fresh-ground coffee and filtered water,",
        headingAccent: "without buying equipment",
        ctaLabel: "Let's design your coffee service",
        copy:
          "We install the coffee machines and water dispensers, restock them daily, and maintain them. You do not buy the equipment: you pay per cup served, and the coffee beans are included.",
        metrics: [
          { value: "24/7", label: "equipment available to your team" },
          { value: "Daily", label: "coffee-machine restocking and cleaning" },
          { value: "6 months", label: "water-filter changes and quality tests" },
          { value: "Per cup", label: "payment model for coffee service" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "The machines are ours to provide",
            copy: "No equipment to buy or rent. Installation, restocking, cleaning and maintenance included.",
            icon: "machine",
          },
          {
            title: "Espresso, americano, cappuccino, cortado and latte",
            copy: "100% arabica from Chiapas and Veracruz, plus hot chocolate and teas.",
            icon: "coffee",
          },
          {
            title: "Water cold, hot, ambient, and sparkling",
            copy: "Multi-stage filtration, with filter changes and microbiological testing every six months.",
            icon: "water",
          },
        ],
      },
      faqs: [
        {
          question: "Is this coffee machine rental, or do we have to buy them?",
          answer:
            "You buy nothing. The machines are ours and the setup is on us; you pay a monthly rate set by the cup volume you contract, and that covers the beans, daily restocking, the visits, and preventive maintenance. Consumables are sold separately by the box: milks, sweeteners, cups, and lids.",
        },
        {
          question: "Which coffee machine suits our office size?",
          answer:
            "There is a unit for each volume. The Lirika Plus, compact, for small teams: a steam wand and around 50 cups a day. The Krea Touch, for mid-size offices: a touchscreen, 10 drinks, plumbed into the mains, and up to 150 cups a day. The Aulika Top EVO, premium for high traffic: a double boiler and one-touch cappuccino. The Saeco Idea Duo has two hoppers, for serving regular and decaf at once. The price per cup is the same on all of them, so you choose on capacity, not cost.",
        },
        {
          question: "Which drinks can the machines make?",
          answer:
            "With coffee: americano, espresso, espresso americano, cappuccino, cortado, and latte. Without coffee: mocha, hot chocolate, and five Bigelow or Stash teas. Flavours are selectable, including matcha, chai, French vanilla, cajeta, horchata, and pumpkin spice. Milks include whole, light, and lactose-free, plus almond, oat, coconut, and soy alternatives.",
        },
        {
          question: "Where does the coffee come from?",
          answer:
            "It is a 100% arabica high-altitude selection, bourbon and typica varieties, grown in self-sustaining communities in Chiapas and Veracruz. There is quality control at every stage and traceability by lot. In the cup it gives full body, citric acidity, and sweet high-altitude notes. It is ground fresh for every drink; it is never instant.",
        },
        {
          question: "How many cups a month does the service cover?",
          answer:
            "The service is contracted by monthly cup volume, up to 3,000 cups a month per plan. You pick the volume for your headcount, and the cost per cup drops as the plan grows. It is measured by each machine's counter, with a monthly count validated with you.",
        },
        {
          question: "Do we need a water line to install the equipment?",
          answer:
            "The dispensers do: they connect to the mains and filter on the spot. Coffee machines only need power and a service point, except the Krea Touch, which also plumbs in so no one refills water. Either way, the install is on us.",
        },
        {
          question: "What kinds of water do the dispensers serve?",
          answer:
            "Four: cold, hot, ambient, and sparkling mineral. They are new units with multi-stage filtration, available 24 hours a day, year round. Every six months we change the filters and run microbiological quality tests.",
        },
        {
          question: "How long does it take to start the service?",
          answer:
            "Thirty days from the moment you confirm. We operate on Mexican public-calendar business days, and the machines stay available 24 hours. The contract runs 24 months, the term over which the equipment we provide is amortised.",
        },
      ],
      testimonialStory: "AT&T",
    },
    "grab-go": {
      overview: {
        headingLead: "Fresh food that",
        headingAccent: "moves through your office",
        ctaLabel: "Let's design your cart service",
        copy:
          "A stocked service cart visits each floor at times defined with you, so your team can choose fresh, ready food without leaving their workspace.",
        metrics: [
          { value: "By floor", label: "a route defined around your operation" },
          { value: "Daily", label: "cart stocking and replenishment" },
          { value: "On site", label: "Zitrone staff operate the service" },
          { value: "Custom", label: "catalogue, floors, and schedule" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "A mobile service point, with nothing to build",
            copy: "You add workplace food without construction or fixed equipment.",
            icon: "cart",
          },
          {
            title: "Route and times defined with your operation",
            copy: "We bring the cart, the product and the people, restocked daily.",
            icon: "clock",
          },
          {
            title: "From savoury to fruit, ready to eat",
            copy: "Salads, sandwiches, wraps, pasta and the dish of the day.",
            icon: "utensils",
          },
        ],
      },
      faqs: [
        {
          question: "Does it work in a building with several floors?",
          answer:
            "Yes, that is the case it exists for. The cart runs the floors you define at fixed times, and an extra service point can be added.",
        },
        {
          question: "How does the food stay fresh along the route?",
          answer:
            "The cart is stocked and replenished every day. Food travels in ready-to-eat portions, and the catalogue is trimmed to what your team actually takes.",
        },
        {
          question: "How many floors or people does the service need?",
          answer:
            "It is set by the route, not by a fixed minimum. We adjust floors, times and catalogue to the size and the tastes of your team.",
        },
        {
          question: "How is the service cart charged?",
          answer:
            "Monthly billing on actual consumption. The company can cover it, subsidise a percentage, or let each person pay for what they take.",
        },
      ],
      testimonialStory: "Pinterest",
    },
    catering: {
      overview: {
        headingLead: "Your event,",
        headingAccent: "handled from start to finish",
        ctaLabel: "Let's design your event",
        copy:
          "We design a custom menu and coordinate food, setup, tableware, glassware, linens, and servers in one proposal.",
        metrics: [
          { value: "1 team", label: "coordination with third-party providers" },
          { value: "Catalogue", label: "packages or custom proposal" },
          { value: "All included", label: "food, setup, tableware, and servers" },
          { value: "1 partner", label: "coordination from start to finish" },
        ],
      },
      faqScope: "service",
      resolves: {
        points: [
          {
            title: "Coffee break, breakfast, box lunch or a plated meal",
            copy: "We pick the format to match the moment of the event.",
            icon: "calendar",
          },
          {
            title: "Catalogue packages or a custom proposal",
            copy: "Menus built around the tastes and restrictions of your guests.",
            icon: "chat",
          },
          {
            title: "Setup, tableware, linens and servers coordinated",
            copy: "One provider produces, sets up and serves the event.",
            icon: "people",
          },
        ],
      },
      faqs: [
        {
          question: "Can it be served in our own offices?",
          answer:
            "Yes. We bring food, setup, tableware, glassware and linens to the venue. Delivery formats such as box lunch arrive cold and ready to serve.",
        },
        {
          question: "Who coordinates the setup on the day of the event?",
          answer:
            "Zitrone, start to finish. Production, logistics, setup and service sit in the same proposal, so you are not coordinating several vendors in parallel.",
        },
        {
          question: "Is there a guest minimum to book catering?",
          answer:
            "Ten guests. From there the format follows the event, from a five-hour coffee break to a plated meal.",
        },
        {
          question: "How is corporate catering quoted?",
          answer:
            "Per person, by the package chosen. Servers are billed separately, at $1,100 MXN plus tax each, and menu prices are quoted before tax as well.",
        },
      ],
      testimonialStory: "Capital One",
    },
  }

  return content[theme]
}

export function getServiceTargets(locale: string): ServiceTarget[] {
  if (locale === "es") {
    return [
      {
        slug: "comedor-corporativo",
        theme: "dining",
        title: SERVICE_NAMES.es["dining"].name,
        headline: { lead: "Un comedor que", accent: "reúne", trail: " a tu equipo, todos los días." },
        metaTitle: "Comedor corporativo en CDMX | Zitrone",
        metaDescription:
          "Comedor corporativo con menú fresco diario, cocina en sitio o comisariato, estaciones rotativas y operación completa por Zitrone.",
        lede: "Un comedor donde tu gente se sienta junta, come bien y vuelve a la tarde con energía. Nosotros operamos todo lo demás.",
        summary:
          "Cocina en sitio o entrega fresca desde comisariato, tres tipos de servicio y una cuota por comensal definida a tu medida.",
        whyItMatters:
          "Resuelve la comida principal del día con variedad que rota y un servicio confiable para tu equipo.",
        operatingFit:
          "Funciona para operaciones corporativas, premium o industriales, con barras asistidas o en self-service.",
        relatedBlogLabel: "Leer notas sobre programas de comedor",
        relatedBlogHref: "/blog?category=Building%20a%20program",
      },
      {
        slug: "cafeteria-corporativa",
        theme: "cafe",
        title: SERVICE_NAMES.es["cafe"].name,
        headline: { lead: "Una cafetería donde tu equipo", accent: "se encuentra", trail: "." },
        metaTitle: "Cafetería corporativa para oficinas | Zitrone",
        metaDescription:
          "Cafetería corporativa con barista, bebidas, grab and go, pastelería, snacks y operación diaria por Zitrone.",
        lede: "Un lugar donde tu equipo hace pausa, se cruza y conversa, con barista y comida lista. Nosotros lo atendemos toda la jornada.",
        summary:
          "Zitrone pone el equipo, el barista, el café, los insumos y el producto, y se encarga del abasto, la limpieza y el mantenimiento.",
        whyItMatters:
          "Reúne café, comida lista, pastelería, snacks y fruta en un mismo punto disponible durante el día.",
        operatingFit:
          "Se adapta al espacio, al equipo y al esquema de pago: empresa, subsidio parcial o consumo del colaborador.",
        relatedBlogLabel: "Explorar ideas de bienestar y productividad",
        relatedBlogHref: "/blog?category=Wellbeing%20%26%20productivity",
      },
      {
        slug: "pantry-y-restocking",
        theme: "pantry",
        title: SERVICE_NAMES.es["pantry"].name,
        headline: { lead: "Un pantry que", accent: "cuida", trail: " a tu equipo entre juntas." },
        metaTitle: "Servicio de snacks y bebidas para oficinas | Zitrone",
        metaDescription:
          "Pantry para oficinas con snacks, bebidas y fruta fresca, personal en sitio, catálogo a la medida y reabasto diario.",
        lede: "Fruta, snacks y bebidas siempre surtidos para las pausas entre juntas. Nosotros reabastecemos cada día y tu empresa controla el costo por persona.",
        summary:
          "Personal Zitrone surte, distribuye y reabastece un catálogo elegido contigo, con las opciones saludables al frente.",
        whyItMatters:
          "El equipo tiene acceso diario a fruta, snacks y bebidas, y la empresa mantiene el consumo visible y el costo predecible.",
        operatingFit:
          "Funciona para oficinas que quieren un programa atendido en lugar de vending, con consumo abierto o por asignación.",
        relatedBlogLabel: "Ver notas sobre snacks, bebidas y jornada laboral",
        relatedBlogHref: "/blog?category=Wellbeing%20%26%20productivity",
      },
      {
        slug: "cafe-y-agua",
        theme: "coffee",
        title: SERVICE_NAMES.es["coffee"].name,
        headline: { lead: "Café para las conversaciones que", accent: "mueven", trail: " tu empresa." },
        metaTitle: "Servicio de café para oficina y dispensadores de agua | Zitrone",
        metaDescription:
          "Renta de cafeteras y dispensadores de agua para oficina, sin inversión inicial. Pagas por taza servida e incluye café, abasto diario, limpieza, filtros y mantenimiento.",
        lede: "Café recién hecho y agua filtrada en cada piso, a cualquier hora. Nosotros ponemos los equipos, los insumos y el mantenimiento.",
        summary:
          "Ponemos las cafeteras, los dispensadores y el café en grano, y los surtimos y reparamos nosotros. Tú pagas por taza servida, sin comprar el equipo.",
        whyItMatters:
          "Tu equipo toma café de cafetería a cualquier hora, y nadie de tu lado tiene que rellenar, limpiar ni llamar al técnico.",
        operatingFit:
          "Cuántas máquinas y cuántos puntos de agua van depende de cuánta gente hay y de cuánto café se toma. Eso lo vemos contigo.",
        relatedBlogLabel: "Leer sobre operación diaria y confiabilidad",
        relatedBlogHref: "/blog?category=Trust%20%26%20standards",
      },
      {
        slug: "carritos-de-servicio",
        theme: "grab-go",
        title: SERVICE_NAMES.es["grab-go"].name,
        headline: { lead: "Comida lista para comer, que", accent: "llega", trail: " hasta tu lugar." },
        metaTitle: "Carritos de servicio para oficinas | Zitrone",
        metaDescription:
          "Carritos de servicio para oficinas con comida fresca y lista, personal Zitrone, recorrido por piso y reabasto diario.",
        lede: "Comida fresca en cada piso, para que tu equipo coma bien sin cortar su jornada, aunque tu oficina no tenga comedor.",
        summary:
          "Zitrone pone el carrito, el producto y el personal, y ajusta catálogo, pisos y horarios a tu operación.",
        whyItMatters:
          "Acerca opciones frescas y balanceadas al lugar donde trabaja tu equipo, sin filas ni tiempos muertos.",
        operatingFit:
          "Funciona como un punto de servicio móvil con recorrido, surtido y subsidio definidos a tu medida.",
        relatedBlogLabel: "Ver notas sobre attendance e híbrido",
        relatedBlogHref: "/blog?category=Culture%20%26%20retention",
      },
      {
        slug: "catering-corporativo",
        theme: "catering",
        title: SERVICE_NAMES.es["catering"].name,
        headline: { lead: "Comida a la altura de los momentos que", accent: "unen", trail: " a tu empresa." },
        metaTitle: "Catering corporativo para oficinas y eventos | Zitrone",
        metaDescription:
          "Catering corporativo a la medida con comida, montaje, loza, cristalería, mantelería, meseros y coordinación.",
        lede: "Celebraciones, all-hands y fechas importantes con comida, montaje y meseros resueltos. Tu equipo solo tiene que llegar.",
        summary:
          "Cada evento puede partir de nuestro catálogo de catering o de una propuesta a la medida, con comida, montaje y servicio coordinados por Zitrone.",
        whyItMatters:
          "Un solo aliado coordina cocina, montaje y meseros para que puedas disfrutar tu propio evento.",
        operatingFit:
          "Se adapta desde un coffee break rápido hasta una comida emplatada, con alternativas para gustos y restricciones.",
        relatedBlogLabel: "Explorar contenido sobre eventos y operación",
        relatedBlogHref: "/blog?category=Building%20a%20program",
      },
    ]
  }

  return [
    {
      slug: "corporate-dining",
      theme: "dining",
      title: SERVICE_NAMES.en["dining"].name,
      headline: { lead: "A dining room that brings your team", accent: "together", trail: ", every day." },
      metaTitle: "Corporate dining service for offices | Zitrone",
      metaDescription:
        "Corporate dining with fresh daily menus, on-site or commissary production, rotating stations, and full operations by Zitrone.",
      lede: "A dining room where your people sit together, eat well and head into the afternoon with energy. We run everything else.",
      summary:
        "On-site kitchen or fresh commissary delivery, three service types, and a per-diner fee shaped around your operation.",
      whyItMatters:
        "It solves the main meal of the day with rotating variety and reliable service for your team.",
      operatingFit:
        "It works for corporate, premium, or industrial operations, with staffed or self-service food stations.",
      relatedBlogLabel: "Read notes on building a dining program",
      relatedBlogHref: "/blog?category=Building%20a%20program",
    },
    {
      slug: "corporate-cafe",
      theme: "cafe",
      title: SERVICE_NAMES.en["cafe"].name,
      headline: { lead: "A café where your team", accent: "comes together", trail: "." },
      metaTitle: "Corporate cafe service for offices | Zitrone",
      metaDescription:
        "Corporate cafe with barista, beverages, grab-and-go, pastries, snacks, and daily operations by Zitrone.",
      lede: "A place where your team takes a break, crosses paths and talks, with a barista and ready-to-eat food. We staff it all day.",
      summary:
        "Zitrone provides the equipment, barista, coffee, supplies, and products, and handles stocking, cleaning, and maintenance.",
      whyItMatters:
        "It brings coffee, ready food, pastries, snacks, and fruit together in one point available throughout the day.",
      operatingFit:
        "It adapts to the space, team, and payment model: company-paid, partially subsidized, or employee-paid.",
      relatedBlogLabel: "Explore workplace wellbeing ideas",
      relatedBlogHref: "/blog?category=Wellbeing%20%26%20productivity",
    },
    {
      slug: "pantry-restocking",
      theme: "pantry",
      title: SERVICE_NAMES.en["pantry"].name,
      headline: { lead: "A pantry that", accent: "looks after", trail: " your team between meetings." },
      metaTitle: "Office snacks and beverages service | Zitrone",
      metaDescription:
        "Office pantry with snacks, beverages, and fresh fruit, on-site staff, a catalogue built with you, and daily replenishment.",
      lede: "Fruit, snacks and drinks always stocked for the breaks between meetings. We restock every day, and your company controls the cost per person.",
      summary:
        "Zitrone staff stock, distribute, and replenish a catalogue selected with you, with the healthier options up front.",
      whyItMatters:
        "Your team gets daily access to fruit, snacks, and beverages, and the company keeps consumption visible and cost predictable.",
      operatingFit:
        "It fits offices that want a staffed program instead of vending, with open or allocated consumption.",
      relatedBlogLabel: "Read notes on snacks, beverages and productivity",
      relatedBlogHref: "/blog?category=Wellbeing%20%26%20productivity",
    },
    {
      slug: "coffee-water",
      theme: "coffee",
      title: SERVICE_NAMES.en["coffee"].name,
      headline: { lead: "Good coffee for the conversations that", accent: "move", trail: " your company." },
      metaTitle: "Office coffee service and water dispensers | Zitrone",
      metaDescription:
        "Office coffee machine rental and water dispensers with no upfront investment. You pay per cup served, and coffee beans, daily restocking, cleaning, filters, and maintenance are included.",
      lede: "Freshly made coffee and filtered water on every floor, at any hour. We provide the machines, the supplies and the maintenance.",
      summary:
        "We provide the coffee machines, the dispensers, and the beans, and we restock and repair them. You pay per cup served, without buying the equipment.",
      whyItMatters:
        "Your team gets cafe-grade coffee at any hour, and nobody on your side has to refill it, clean it, or call the technician.",
      operatingFit:
        "How many machines and water points you need comes down to headcount and how much coffee gets drunk. We work that out with you.",
      relatedBlogLabel: "Read about standards and daily reliability",
      relatedBlogHref: "/blog?category=Trust%20%26%20standards",
    },
    {
      slug: "service-carts",
      theme: "grab-go",
      title: SERVICE_NAMES.en["grab-go"].name,
      headline: { lead: "Ready-to-eat food that", accent: "comes", trail: " right to your desk." },
      metaTitle: "Service carts for offices | Zitrone",
      metaDescription:
        "Office service carts with fresh ready food, Zitrone staff, a floor-by-floor route, and daily replenishment.",
      lede: "Fresh food on every floor, so your team eats well without breaking up the day, even if your office has no dining room.",
      summary:
        "Zitrone provides the cart, products, and staff, and adapts the catalogue, floors, and schedule to your operation.",
      whyItMatters:
        "It brings fresh, balanced options to where your team works, without lines or time lost going downstairs.",
      operatingFit:
        "It works as a mobile service point with a route, assortment, and subsidy model defined around your needs.",
      relatedBlogLabel: "Read about hybrid attendance and food rituals",
      relatedBlogHref: "/blog?category=Culture%20%26%20retention",
    },
    {
      slug: "corporate-catering",
      theme: "catering",
      title: SERVICE_NAMES.en["catering"].name,
      headline: { lead: "Food worthy of the moments that bring your company", accent: "together", trail: "." },
      metaTitle: "Corporate catering for offices and events | Zitrone",
      metaDescription:
        "Custom corporate catering with food, setup, tableware, glassware, linens, servers, and coordination.",
      lede: "Celebrations, all-hands and key dates with food, setup and servers handled. Your team just has to show up.",
      summary:
        "Every event can start from our catering catalogue or a custom proposal, with food, setup, and service coordinated by Zitrone.",
      whyItMatters:
        "One partner coordinates kitchen, setup, and servers so you can enjoy your own event.",
      operatingFit:
        "It adapts from a quick coffee break to a plated meal, with alternatives for guest preferences and restrictions.",
      relatedBlogLabel: "Explore program-building notes",
      relatedBlogHref: "/blog?category=Building%20a%20program",
    },
  ]
}

export function getServiceTargetBySlug(locale: string, slug: string): ServiceTarget | undefined {
  return getServiceTargets(locale).find((service) => service.slug === slug)
}

export function getServiceAlternates(
  currentLocale: string,
  slug: string,
): Record<string, string> | undefined {
  const current = getServiceTargetBySlug(currentLocale, slug)
  if (!current) return undefined

  const locales = ["en", "es"] as const
  const alternates: Record<string, string> = {}

  for (const locale of locales) {
    const match = getServiceTargets(locale).find((service) => service.theme === current.theme)
    if (match) {
      alternates[locale] = `https://www.zitrone.mx/${locale}/services/${match.slug}`
    }
  }

  // x-default must match routing.defaultLocale ("es"), same as localeAlternates
  // in lib/seo.ts declares for every other page.
  alternates["x-default"] = alternates.es ?? `https://www.zitrone.mx/es/services/${slug}`

  return alternates
}
