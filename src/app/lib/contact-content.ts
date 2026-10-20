import { type AppLocale } from "@/i18n/routing"

export type ContactPageContent = {
  metaTitle: string
  metaDescription: string
  title: string
  intro: string
  back: string
  form: {
    steps: {
      service: { title: string; lede: string }
      site: { title: string; lede: string }
      schedule: { title: string; lede: string }
      food: { title: string; lede: string }
      space: { title: string; lede: string }
      terms: { title: string; lede: string }
      contact: { title: string; lede: string }
    }
    headcount: string
    guests: string
    headcountHint: string
    city: string
    cityPlaceholder: string
    cityOther: string
    cityOtherLabel: string
    cityUnsure: string
    serviceUnsure: string
    cateringNotesPlaceholder: string
    equipmentNotesPlaceholder: string
    days: string
    daysWeekdays: string
    daysSix: string
    daysAll: string
    meals: string
    menu: string
    extras: string
    style: string
    facility: string
    budget: string
    budgetHint: string
    budgetOptOut: string
    subsidized: string
    subsidy: string
    subsidyHint: string
    name: string
    company: string
    email: string
    phone: string
    phoneOptional: string
    notes: string
    notesPlaceholder: string
    notesNone: string
    source: string
    submit: string
  }
  next: string
  formCaption: string
  submitting: string
  successTitle: string
  successBody: string
  successMeta: string
  nameError: string
  emailError: string
  errorMessage: string
}

const es: ContactPageContent = {
  metaTitle: "Contacto | Zitrone",
  metaDescription:
    "Cuéntanos qué servicio buscas y dónde lo necesitas. Nuestro equipo te ayudará a definir los siguientes pasos.",
  title: "Diseñemos tu servicio de alimentos",
  intro:
    "Elige los servicios que necesitas. Te preguntamos los detalles que corresponden a tu operación y cómo contactarte.",
  back: "Atrás",
  form: {
    steps: {
      service: {
        title: "¿Qué servicios necesitas?",
        lede: "Puedes seleccionar varios servicios para tu equipo.",
      },
      site: {
        title: "Cuéntanos de tu equipo",
        lede: "Selecciona una cantidad aproximada de personas y la ubicación del servicio.",
      },
      schedule: { title: "¿Cómo es la semana?", lede: "Elige los días y las comidas. Ajusta cuántas personas atenderemos en cada horario." },
      food: {
        title: "¿Qué quieres darles de comer?",
        lede: "Ajusta el menú al presupuesto y al perfil de tu equipo.",
      },
      space: {
        title: "¿Cómo es el espacio?",
        lede: "De esto dependen la inversión inicial y los tiempos de arranque.",
      },
      terms: {
        title: "Hablemos de presupuesto",
        lede: "Trabajamos con tu presupuesto y tus condiciones de pago.",
      },
      contact: { title: "¿Con quién seguimos?", lede: "" },
    },
    headcount: "Personas a atender (aproximado)",
    guests: "Invitados al evento (aproximado)",
    headcountHint: "personas",
    city: "Ciudad",
    cityPlaceholder: "Busca tu ciudad",
    cityOther: "Otra ciudad",
    cityOtherLabel: "¿Cuál?",
    cityUnsure: "Ubicación por definir",
    serviceUnsure: "Ayúdenme a elegir / otro servicio",
    cateringNotesPlaceholder: "Si los sabes: fecha, tipo de evento, horario y necesidades de alimentos o bebidas.",
    equipmentNotesPlaceholder: "Si los sabes: consumo aproximado, puntos de servicio y si necesitas café, agua o ambos.",
    days: "Días",
    daysWeekdays: "Lunes a viernes",
    daysSix: "Lunes a sábado",
    daysAll: "Todos los días",
    meals: "Comidas",
    menu: "Tipo de menú",
    extras: "Otros servicios (opcional)",
    style: "Formato",
    facility: "Instalaciones",
    budget: "Precio por comida",
    budgetHint: "por comida",
    budgetOptOut: "Todavía no lo tengo",
    subsidized: "Apoyo de la empresa",
    subsidy: "Aporte de la empresa",
    subsidyHint: "lo pone la empresa",
    name: "Nombre",
    company: "Empresa (opcional)",
    email: "Correo",
    phone: "Teléfono",
    phoneOptional: "opcional",
    notes: "¿Algo que debamos saber? (opcional)",
    notesPlaceholder: "Qué necesitas, cuándo te gustaría empezar o qué servicios quieres combinar.",
    notesNone: "Nada por ahora",
    source: "Cómo nos conociste (opcional)",
    submit: "Enviar",
  },
  next: "Continuar",
  formCaption: "Te respondemos por correo, con una persona del equipo.",
  submitting: "Enviando…",
  successTitle: "Listo, ya nos llegó",
  successBody: "Revisamos tus respuestas y te escribimos con una recomendación y los siguientes pasos.",
  successMeta: "Folio",
  nameError: "Escribe tu nombre con al menos dos caracteres.",
  emailError: "Revisa el correo, sin uno válido no te podemos responder.",
  errorMessage: "No se envió. Inténtalo otra vez o escríbenos a opina@zitrone.com.mx.",
}

const en: ContactPageContent = {
  metaTitle: "Contact | Zitrone",
  metaDescription:
    "Tell us which service you need and where. Our team will help you work out the next steps.",
  title: "Let’s design your food service",
  intro:
    "Choose the services you need. We will ask for the relevant operating details and how to contact you.",
  back: "Back",
  form: {
    steps: {
      service: {
        title: "Which services do you need?",
        lede: "You can select several services for your team.",
      },
      site: {
        title: "Tell us about your team",
        lede: "Select an approximate number of people and the service location.",
      },
      schedule: { title: "What does the week look like?", lede: "Choose the days and meals. Adjust how many people we will serve at each mealtime." },
      food: {
        title: "What do you want to feed them?",
        lede: "Matches the menu to your budget and to your team.",
      },
      space: {
        title: "What is the space like?",
        lede: "Drives the up-front investment and how soon we can start.",
      },
      terms: {
        title: "Let’s talk budget",
        lede: "We work with your budget and your payment terms.",
      },
      contact: { title: "Who do we follow up with?", lede: "" },
    },
    headcount: "People to serve (approximate)",
    guests: "Event guests (approximate)",
    headcountHint: "people",
    city: "City",
    cityPlaceholder: "Search your city",
    cityOther: "Another city",
    cityOtherLabel: "Which one?",
    cityUnsure: "Location to be defined",
    serviceUnsure: "Help me choose / another service",
    cateringNotesPlaceholder: "If known: date, event type, schedule, and food or beverage requirements.",
    equipmentNotesPlaceholder: "If known: approximate consumption, service points, and whether you need coffee, water or both.",
    days: "Days",
    daysWeekdays: "Monday to Friday",
    daysSix: "Monday to Saturday",
    daysAll: "Every day",
    meals: "Meals",
    menu: "Kind of menu",
    extras: "Other services (optional)",
    style: "Format",
    facility: "Facilities",
    budget: "Price per meal",
    budgetHint: "per meal",
    budgetOptOut: "I do not have one yet",
    subsidized: "Company support",
    subsidy: "Company share",
    subsidyHint: "paid by the company",
    name: "Name",
    company: "Company (optional)",
    email: "Email",
    phone: "Phone",
    phoneOptional: "optional",
    notes: "Anything we should know? (optional)",
    notesPlaceholder: "What you need, when you would like to start, or which services you want to combine.",
    notesNone: "Nothing for now",
    source: "How you found us (optional)",
    submit: "Send",
  },
  next: "Continue",
  formCaption: "We reply by email, from someone on the team.",
  submitting: "Sending…",
  successTitle: "Got it",
  successBody: "We go through your answers and write back with a recommendation and next steps.",
  successMeta: "Reference",
  nameError: "Enter your name using at least two characters.",
  emailError: "Check the email, we cannot reply to you without a valid one.",
  errorMessage: "The request did not send. Try again, or email us at opina@zitrone.com.mx.",
}

export function getContactContent(locale: string): ContactPageContent {
  return (locale as AppLocale) === "en" ? en : es
}
