import { routing, type AppLocale } from "@/i18n/routing"

type PrivacySection = {
  heading: string
  paragraphs: string[]
}

export type PrivacyContent = {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  intro: string[]
  sections: PrivacySection[]
}

const privacyContent: Record<AppLocale, PrivacyContent> = {
  es: {
    metaTitle: "Aviso de Privacidad — Zitrone",
    metaDescription:
      "Conoce el Aviso de Privacidad de Zitrone, el tratamiento de datos personales, sus finalidades y los medios para ejercer derechos ARCO.",
    kicker: "Legal",
    title: "Aviso de Privacidad",
    intro: [
      "Responsable de la protección de sus Datos Personales:",
      "Servicio de Alimentación Zitrone, S.A.P.I. de C.V. (en adelante “Zitrone”), con domicilio en Calle Leandro Valle, número 44, Colonia San Ángel Inn, Alcaldía Álvaro Obregón, Ciudad de México, C.P. 01060.",
      "Es el responsable de recabar sus Datos Personales, del uso que se le dé a los mismos y de su protección en términos de lo dispuesto en la Ley Federal de Protección de Datos Personales en Posesión de Particulares, su Reglamento y demás disposiciones aplicables (en adelante la “Ley de Datos”). Usted podrá acceder al contenido de dichas normativas a través de la página de Internet del Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (en lo sucesivo referido como el “INAI”) por medio de la siguiente dirección: www.inai.gob.mx.",
      "Zitrone es responsable del tratamiento de sus Datos Personales, así como de garantizar su privacidad y su derecho a la autodeterminación informativa, por lo que, los Datos Personales que se obtengan serán tratados de manera responsable y confidencial, regulando los derechos de acceso, rectificación, cancelación y oposición del tratamiento de los mismos.",
    ],
    sections: [
      {
        heading: "¿Qué finalidades perseguimos al recabar sus Datos Personales?",
        paragraphs: [
          "Únicamente usaremos los Datos Personales que usted nos proporcione para la finalidad para la que fueron recabados. Usted podrá estar seguro de que seremos responsables de proporcionarle toda la información necesaria respecto de la finalidad del uso de sus datos, el tratamiento de los mismos, las restricciones de su uso, los detalles necesarios para brindarle la privacidad que usted necesita, así como los medios que usted tendrá a su disposición para el ejercicio de sus derechos ARCO como Titular de Datos Personales.",
          "Hacemos de su conocimiento que Zitrone tratará y resguardará sus Datos Personales con base en los principios de licitud, calidad, consentimiento, información, finalidad, lealtad, proporcionalidad y responsabilidad, consagrados en la Ley de Datos y su Reglamento.",
          "Finalidades principales: Los Datos Personales que recabemos, los utilizaremos para las siguientes finalidades, mismas que son necesarias para el servicio que deseamos proporcionar: identificación, operación, registro, administración y venta de productos y servicios, mantener la relación profesional con los Titulares, facturación y cobranza, prestación del servicio del que se trate, mantenimiento de registros.",
          "Finalidades secundarias: De manera adicional, utilizaremos su información personal para las siguientes finalidades que no son necesarias para el servicio solicitado, pero que nos permiten y facilitan brindarle una mejor atención: ofrecer contenidos personalizados, hacerle llegar noticias y cambios en el Aviso de Privacidad, estadísticas, promoción y mercadeo, así como establecer preferencias de consumo.",
          "En caso de que el Titular no desee que Zitrone de tratamiento a sus Datos Personales para las finalidades previstas en el párrafo anterior, tendrán un plazo de 15 (quince) días para manifestar su negativa dirigiendo una comunicación al Departamento de Datos Personales de Zitrone enviando un correo electrónico a la siguiente dirección: opina@zitrone.com.mx",
        ],
      },
      {
        heading: "¿Qué Datos Personales vamos a recabar?",
        paragraphs: [
          "Para llevar a cabo las finalidades descritas en el presente Aviso de Privacidad, Datos Personales de identificación y contacto.",
          "Asimismo Zitrone podrá utilizar y recabar los siguientes Datos Personales: nombre completo, domicilio, fecha de nacimiento, ocupación, número telefónico, edad, sexo, correo electrónico y datos bancarios.",
          "También es posible que Zitrone reciba información personal mediante terceros, como empresas y agentes, u otras compañías que proporcionan servicios a nuestros clientes y asociados. La información que recopilamos mediante terceros puede incluir datos personales.",
        ],
      },
      {
        heading: "¿Cuál será el tratamiento principal de sus Datos Personales?",
        paragraphs: [
          "Una vez que usted entregue a Zitrone sus Datos Personales, le manifestamos que estos serán conservados en un lugar y medios seguros que la tecnología lo permita, cuyo acceso estará controlado y limitado.",
          "En Zitrone consideramos valioso tener una relación cercana y activa con nuestros clientes. Debido a esto, es que podremos recabar sus Datos Personales para los efectos mencionados en el presente Aviso de Privacidad. Hacemos de su conocimiento que Zitrone tratará y resguardará sus Datos Personales con base en los principios de licitud, calidad, consentimiento, información, finalidad, lealtad, proporcionalidad y responsabilidad, consagrados en la Ley de Datos y su Reglamento.",
        ],
      },
      {
        heading: "Transferencias de Datos Personales",
        paragraphs: [
          "Zitrone no realizará transferencia alguna de los Datos Personales que recabe. No obstante lo anterior, Zitrone puede compartir la información personal que recopila, a sus afiliadas, subsidiarias, o empresas dentro del mismo grupo corporativo, según lo permita la Ley. Zitrone no compartirá información personal con personas que no sean afiliadas, asociados o clientes, excepto cuando la Ley lo permita o exija.",
          "El Titular reconoce y acepta que Zitrone no requiere de autorización ni confirmación de dicho Titular para realizar transferencias de Datos Personales nacionales o internacionales en los casos previstos en el Artículo 37 de la Ley de Datos o en cualquier otro caso de excepción previsto por la misma o la demás legislación aplicable.",
        ],
      },
      {
        heading: "Consentimiento del Titular",
        paragraphs: [
          "Se entenderá que el Titular consciente tácitamente el tratamiento de sus datos cuando habiéndose puesto a su disposición el presente Aviso de Privacidad, no manifieste su oposición.",
          "Para efectos de lo dispuesto por el artículo 17 de la Ley de Datos, el Titular manifiesta que el presente Aviso de Privacidad le ha sido dado a conocer por Zitrone, y haber leído, entendido y acordado los términos expuestos en este Aviso de Privacidad, por lo que otorga su consentimiento respecto del tratamiento de sus Datos Personales para efectos de la Ley de Datos y demás legislación aplicable.",
          "Mediante el ingreso y/o registro a través del sitio web de Zitrone, usted otorga el pleno consentimiento y sin reservas para que Zitrone de tratamiento de sus Datos Personales de acuerdo al presente Aviso de Privacidad.",
        ],
      },
      {
        heading: "Resguardo y seguridad de Datos Personales",
        paragraphs: [
          "Zitrone conservará los Datos Personales del Titular durante el tiempo que sea necesario para procesar sus solicitudes de información, productos y/o servicios. Los Datos Personales del Titular recolectados por Zitrone se encontrarán protegidos por medidas de seguridad técnicas y físicas adecuadas contra el daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizados, de conformidad con lo dispuesto en la Ley de Datos y de la regulación administrativa derivada de la misma.",
          "Entre estos resguardos se encuentra la manera en que se almacena la información personal en los espacios de trabajo y computadoras y la manera en que se transfiere dicha información dentro de Zitrone y sus socios comerciales. Sólo se permite que personas que trabajan para Zitrone o sus socios comerciales consulten la información personal cuando es parte de su trabajo para proporcionar productos o servicios a los clientes, asociados y afiliados. Zitrone informa a estas personas sobre nuestros resguardos, políticas de privacidad y la ley que protege la privacidad.",
          "Zitrone podrá revelar sus Datos Personales, para cumplir con las disposiciones legales aplicables o por requerimiento de la autoridad competente, así como para llevar a cabo las finalidades para los que han sido recabados, por lo que podrá hacer las transferencias nacionales o internacionales de datos, así como también podrá realizar transferencias de datos a entidades proveedoras de servicios para el cumplimiento de los fines establecidos.",
        ],
      },
      {
        heading: "¿Qué derechos tiene usted como Titular de Datos Personales?",
        paragraphs: [
          "Queremos recordarle que usted como Titular de sus Datos Personales, podrá solicitar el ejercicio de sus derechos “ARCO” (Acceso, Rectificación, Cancelación u Oposición).",
          "Usted tiene derecho a conocer qué Datos Personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus Datos Personales para fines específicos (Oposición).",
        ],
      },
      {
        heading: "Procedimiento para ejercer los derechos ARCO",
        paragraphs: [
          "Para ejercer los Derechos ARCO, el Titular o su representante debe presentar una solicitud por escrito de acceso, rectificación, cancelación u oposición con la información y documentación siguiente: nombre del Titular y domicilio u otro medio para comunicarle la respuesta a su solicitud; documentos que acrediten su identidad o, en su caso, la representación legal del Titular; la descripción clara y precisa de los Datos Personales respecto de los que busca ejercer alguno de los Derechos ARCO; y cualquier otro elemento o documento que facilite la localización de los Datos Personales del Titular.",
          "En el caso de las solicitudes de rectificación de Datos Personales, el Titular respectivo deberá también indicar las modificaciones a realizarse y aportar la documentación que sustente su petición.",
          "Para la recepción, registro y atención de las solicitudes para ejercer su derecho de acceso, rectificación, cancelación y oposición a sus Datos Personales, así como para limitar el uso o divulgación de sus datos, y los demás derechos previstos en la Ley contactar al siguiente correo electrónico: opina@zitrone.com.mx",
          "Zitrone le responderá al Titular respectivo en un plazo máximo de veinte días hábiles, contados desde la fecha en que se recibió la solicitud de acceso, rectificación, cancelación u oposición, la determinación adoptada, a efecto de que, si resulta procedente, se haga efectiva la misma dentro de los quince días siguientes a la fecha en que se le comunica la respuesta al Titular. Tratándose de solicitudes de acceso a Datos Personales, Zitrone procederá con su entrega previa acreditación de la identidad del solicitante o de su representante legal, según corresponda. Los plazos antes referidos podrán ser ampliados sólo en términos de la Ley de conformidad con el artículo 32 de la Ley de Datos.",
          "La entrega de los Datos Personales será gratuita, solamente le corresponderá cubrir los gastos justificados de envío o el costo de reproducción en copias u otros formatos.",
          "Para efectos de las solicitudes de cancelación de Datos Personales, además de lo dispuesto por el presente Aviso de Privacidad, se estará a lo dispuesto en el Artículo 26 de la Ley de Datos incluyendo los casos de excepción de cancelación de Datos Personales señalados.",
          "Asimismo, el Titular en este acto consiente que Zitrone utilice su imagen para fines únicamente publicitarios y promocionales de los eventos y prestación de servicios.",
        ],
      },
      {
        heading: "Uso de cookies y/o contadores de visitas",
        paragraphs: [
          "Zitrone recaba y almacena información a través de ingreso a su sitio Web, información sobre la dirección IP o nombre de dominio del visitante, sitios Web que hagan referencia a su sitio, comportamiento y el tiempo de estadía en el sitio Web, las páginas navegadas, herramientas utilizadas, código postal, tipo de navegador y sistema operativo entre otros.",
          "Dicha información se obtiene y almacena con el fin de medir la actividad del sitio e identificar tendencias sobre navegación que no son atribuibles a un individuo en específico.",
          "La información anteriormente señalada se recopila a través de las “cookies”, así como otros medios y mecanismos tecnológicos, tales como las etiquetas de pixel, los web bugs, enlaces en correos electrónicos, web beacons (etiquetas de Internet, etiquetas de pixel y clear GIFs) entre otros.",
          "La mayoría de los exploradores le permitirán eliminar el uso de cookies, bloquear la aceptación de las cookies o recibir una advertencia antes de almacenar cookies. Le sugerimos consultar las instrucciones de su explorador para utilizar las “cookies”.",
          "Asimismo, las cookies pueden utilizarse para que le mostremos avisos, noticias y/o recomendaciones que pudieran interesarle, de conformidad con sus actividades anteriores en nuestro sitio web. Las cookies también se usan para implementar estrategias que nos permitan elevar la calidad de nuestros productos y/o servicios.",
          "Herramientas que utilizamos: este sitio usa Google Analytics para medir el uso de las páginas y Google Ads para medir la efectividad de nuestra publicidad, incluida la función de conversiones mejoradas, que transmite datos de contacto en forma cifrada (hash) cuando usted nos envía una solicitud. Ambas herramientas se administran mediante Google Tag Manager.",
          "Cómo controlar estas cookies: en la parte inferior de cualquier página encontrará el enlace “Preferencias de cookies”, desde el cual puede aceptar todo, rechazar todo o elegir por categoría entre Medición y Publicidad. Las cookies necesarias para el funcionamiento del sitio y la prevención de fraude no pueden desactivarse, ya que sin ellas el sitio no opera. Su elección se guarda en su navegador durante seis meses y puede cambiarla en cualquier momento desde el mismo enlace.",
          "Ámbito territorial: para visitantes ubicados en el Espacio Económico Europeo, el Reino Unido y Suiza, ninguna cookie de medición o publicidad se activa antes de que usted otorgue su consentimiento. Para el resto de los visitantes, incluidos los ubicados en México, estas cookies operan desde el inicio de la visita conforme al presente Aviso, y usted puede oponerse en cualquier momento mediante el enlace señalado o ejerciendo sus derechos ARCO conforme a lo previsto en este documento.",
        ],
      },
      {
        heading: "Cambios al Aviso de Privacidad",
        paragraphs: [
          "El presente Aviso de Privacidad podrá ser modificado en el futuro. En todo caso, cualquier modificación al mismo se hará de su conocimiento mediante la publicación del mismo en su página web.",
          "Zitrone se reserva el derecho de actualizar periódicamente el presente Aviso para reflejar los cambios de nuestras prácticas de información. Es responsabilidad del Titular revisar periódicamente el contenido del Aviso de Privacidad en el sitio antes mencionado. Zitrone, entenderá que de no expresar lo contrario, significa que el Titular ha leído, entendido y acordado los términos expuestos, lo que constituye su consentimiento a los cambios establecidos en dichas actualizaciones respecto al tratamiento de sus Datos Personales para efectos de la Ley y demás legislaciones aplicables.",
        ],
      },
    ],
  },
  en: {
    metaTitle: "Privacy Notice — Zitrone",
    metaDescription:
      "Read Zitrone's Privacy Notice, how personal data is processed, the purposes for collection, and the means available to exercise ARCO rights.",
    kicker: "Legal",
    title: "Privacy Notice",
    intro: [
      "Party responsible for the protection of your Personal Data:",
      "Servicio de Alimentación Zitrone, S.A.P.I. de C.V. (“Zitrone”), with address at Calle Leandro Valle, number 44, Colonia San Ángel Inn, Alcaldía Álvaro Obregón, Mexico City, C.P. 01060.",
      "Zitrone is responsible for collecting your Personal Data, for the use made of such data, and for its protection in accordance with the Federal Law on Protection of Personal Data Held by Private Parties, its Regulations, and other applicable provisions (the “Data Law”). You may review these regulations through the website of the National Institute for Transparency, Access to Information and Personal Data Protection (“INAI”) at www.inai.gob.mx.",
      "Zitrone is responsible for the processing of your Personal Data, as well as for safeguarding your privacy and your right to informational self-determination. Any Personal Data obtained will be handled responsibly and confidentially, regulating the rights of access, rectification, cancellation, and objection to such processing.",
    ],
    sections: [
      {
        heading: "What purposes do we pursue when collecting your Personal Data?",
        paragraphs: [
          "We will only use the Personal Data you provide for the purpose for which it was collected. We are responsible for giving you all necessary information about the purpose of using your data, the processing of that data, any restrictions on its use, the details needed to provide the privacy you require, and the means available for exercising your ARCO rights as the Data Subject.",
          "Zitrone processes and safeguards your Personal Data based on the principles of lawfulness, quality, consent, information, purpose, loyalty, proportionality, and accountability established in the Data Law and its Regulations.",
          "Primary purposes: The Personal Data we collect will be used for the following purposes, which are necessary for the services we provide: identification, operation, registration, administration and sale of products and services, maintaining the professional relationship with Data Subjects, billing and collection, provision of the applicable service, and record keeping.",
          "Secondary purposes: In addition, we may use your personal information for purposes that are not essential to the requested service but that allow us to offer better service, such as personalized content, notices and changes to the Privacy Notice, statistics, promotion and marketing, and the development of consumption preferences.",
          "If the Data Subject does not want Zitrone to process Personal Data for the secondary purposes described above, they have 15 (fifteen) days to state their refusal by contacting Zitrone's Personal Data Department at opina@zitrone.com.mx.",
        ],
      },
      {
        heading: "What Personal Data do we collect?",
        paragraphs: [
          "To carry out the purposes described in this Privacy Notice, we collect identification and contact Personal Data.",
          "Zitrone may also use and collect the following Personal Data: full name, address, date of birth, occupation, telephone number, age, sex, email address, and banking information.",
          "Zitrone may also receive personal information through third parties, such as companies and agents, or other companies that provide services to our clients and partners. The information collected through third parties may include personal data.",
        ],
      },
      {
        heading: "What is the main treatment of your Personal Data?",
        paragraphs: [
          "Once you provide your Personal Data to Zitrone, it will be stored in a secure place and by secure means to the extent technology allows, with controlled and limited access.",
          "At Zitrone, we value a close and active relationship with our clients. For that reason, we may collect your Personal Data for the purposes described in this Privacy Notice. Zitrone will process and safeguard your Personal Data based on the principles of lawfulness, quality, consent, information, purpose, loyalty, proportionality, and accountability established in the Data Law and its Regulations.",
        ],
      },
      {
        heading: "Transfers of Personal Data",
        paragraphs: [
          "Zitrone will not carry out any transfer of the Personal Data it collects. Notwithstanding the above, Zitrone may share the personal information it collects with affiliates, subsidiaries, or companies within the same corporate group, as permitted by law. Zitrone will not share personal information with persons who are not affiliates, partners, or clients, except when the law permits or requires it.",
          "The Data Subject acknowledges and accepts that Zitrone does not require authorization or confirmation from the Data Subject to carry out national or international transfers of Personal Data in the cases established by Article 37 of the Data Law or in any other exception provided by applicable law.",
        ],
      },
      {
        heading: "Consent of the Data Subject",
        paragraphs: [
          "The Data Subject will be deemed to have tacitly consented to the processing of their data when, after this Privacy Notice has been made available, they do not express their opposition.",
          "For purposes of Article 17 of the Data Law, the Data Subject states that this Privacy Notice has been made known by Zitrone, and that they have read, understood, and agreed to the terms set forth herein, thereby granting consent for the processing of Personal Data under the Data Law and other applicable legislation.",
          "By entering and or registering through Zitrone's website, you grant full and unconditional consent for Zitrone to process your Personal Data in accordance with this Privacy Notice.",
        ],
      },
      {
        heading: "Storage and security of Personal Data",
        paragraphs: [
          "Zitrone will keep the Data Subject's Personal Data for the time necessary to process requests for information, products, and or services. Personal Data collected by Zitrone will be protected by appropriate technical and physical security measures against damage, loss, alteration, destruction, or unauthorized use, access, or processing, in accordance with the Data Law and the administrative regulations derived from it.",
          "These safeguards include how personal information is stored in workspaces and computers, and how that information is transferred within Zitrone and its business partners. Only people working for Zitrone or its business partners may review personal information when it is part of their work in providing products or services to clients, partners, and affiliates. Zitrone informs these individuals about our safeguards, privacy policies, and the law protecting privacy.",
          "Zitrone may disclose your Personal Data in order to comply with applicable legal provisions or at the request of a competent authority, as well as to carry out the purposes for which the data was collected. It may therefore conduct national or international data transfers and may transfer data to service providers for fulfillment of the stated purposes.",
        ],
      },
      {
        heading: "What rights do you have as the holder of Personal Data?",
        paragraphs: [
          "As the holder of your Personal Data, you may request the exercise of your ARCO rights: Access, Rectification, Cancellation, or Objection.",
          "You have the right to know what Personal Data we have about you, what we use it for, and the conditions under which it is used (Access). You also have the right to request correction of your personal information if it is outdated, inaccurate, or incomplete (Rectification); request removal from our records or databases when you consider that it is not being used in accordance with the principles, duties, and obligations established by law (Cancellation); and object to the use of your Personal Data for specific purposes (Objection).",
        ],
      },
      {
        heading: "Procedure to exercise ARCO rights",
        paragraphs: [
          "To exercise ARCO rights, the Data Subject or representative must submit a written request for access, rectification, cancellation, or objection including the following information and documentation: the Data Subject's name and address or another means to communicate the response; documents proving identity or, where applicable, legal representation; a clear and precise description of the Personal Data for which ARCO rights are sought; and any other element or document that facilitates locating the Data Subject's Personal Data.",
          "In the case of rectification requests, the Data Subject must also indicate the changes to be made and provide documentation supporting the request.",
          "For receipt, registration, and handling of requests to exercise access, rectification, cancellation, and objection rights, as well as to limit the use or disclosure of personal data and any other rights established by the Data Law, please contact: opina@zitrone.com.mx.",
          "Zitrone will respond to the Data Subject within a maximum period of twenty business days from the date the request was received, and if appropriate, the decision will be implemented within the fifteen days following communication of the response. In the case of access requests, Zitrone will deliver the Personal Data once the identity of the applicant or legal representative has been verified. These periods may only be extended as permitted by Article 32 of the Data Law.",
          "Delivery of Personal Data will be free of charge, and only justified shipping costs or the cost of reproduction in copies or other formats may apply.",
          "For cancellation requests, in addition to what is set forth in this Privacy Notice, Article 26 of the Data Law and its exceptions to cancellation shall apply.",
          "Likewise, the Data Subject consents to Zitrone using their image solely for advertising and promotional purposes related to events and the provision of services.",
        ],
      },
      {
        heading: "Use of cookies and visit counters",
        paragraphs: [
          "Zitrone collects and stores information through access to its website, including the visitor's IP address or domain name, websites referring traffic to our site, behavior and time spent on the website, pages viewed, tools used, zip code, browser type, operating system, among others.",
          "This information is collected and stored to measure site activity and identify browsing trends that cannot be attributed to a specific individual.",
          "The information described above is collected through cookies and other technological tools, such as pixel tags, web bugs, email links, and web beacons, among others.",
          "Most browsers allow you to delete cookies, block acceptance of cookies, or receive a warning before cookies are stored. We suggest reviewing your browser instructions to manage cookies.",
          "Cookies may also be used to show you notices, news, or recommendations that may interest you according to your prior activity on our website. Cookies are also used to implement strategies that help improve the quality of our products and or services.",
          "Tools we use: this site uses Google Analytics to measure page usage and Google Ads to measure the effectiveness of our advertising, including the enhanced conversions feature, which transmits contact details in hashed form when you send us an enquiry. Both are managed through Google Tag Manager.",
          "How to control these cookies: at the bottom of any page you will find a \u201cCookie preferences\u201d link, from which you can accept all, reject all, or choose by category between Measurement and Advertising. Cookies necessary for the site to function and to prevent fraud cannot be disabled, as the site does not operate without them. Your choice is stored in your browser for six months and can be changed at any time from the same link.",
          "Territorial scope: for visitors located in the European Economic Area, the United Kingdom and Switzerland, no measurement or advertising cookie is activated before you give your consent. For all other visitors, including those located in Mexico, these cookies operate from the start of the visit in accordance with this Notice, and you may object at any time through the link indicated or by exercising your ARCO rights as set out in this document.",
        ],
      },
      {
        heading: "Changes to the Privacy Notice",
        paragraphs: [
          "This Privacy Notice may be modified in the future. In any case, any modification will be made known through publication on the website.",
          "Zitrone reserves the right to update this Notice periodically in order to reflect changes in our information practices. It is the responsibility of the Data Subject to review the content of the Privacy Notice regularly on the website mentioned above. Unless otherwise stated, Zitrone will understand that the Data Subject has read, understood, and agreed to the terms described, which constitutes consent to the changes set forth in such updates regarding the processing of Personal Data under the Law and other applicable legislation.",
        ],
      },
    ],
  },
}

export function getPrivacyContent(locale: string): PrivacyContent {
  return (routing.locales as readonly string[]).includes(locale)
    ? privacyContent[locale as AppLocale]
    : privacyContent[routing.defaultLocale]
}
