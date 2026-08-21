export type BlogPost = {
  slug: string;
  category: "Modelos" | "Funciones" | "Instalación" | "Garantía y soporte" | "Envíos";
  title: string;
  excerpt: string;
  body: string[];
  sourceHref: string;
  sourceLabel: string;
  additionalSources?: { href: string; label: string }[];
};

/**
 * Entradas editoriales construidas exclusivamente a partir de contenido
 * publicado en fichas de producto, Garantías y Política de envíos.
 * No se usan datos de terceros ni afirmaciones que no existan en esas fuentes.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "funciones-publicadas-inodoros-inteligentes-elora",
    category: "Funciones",
    title: "Funciones publicadas en los inodoros inteligentes ELORA",
    excerpt: "Una lectura del catálogo: lavado, secado, asiento climatizado, automatización y control.",
    body: [
      "Las fichas de producto de ELORA SMART describen funciones como lavado con agua, secado con aire caliente, asiento calefactado, apertura, cierre y descarga automáticos. La disponibilidad concreta depende de cada modelo y de su ficha técnica.",
      "En la gama ESENZA se publican lavado posterior, femenino y móvil, agua caliente instantánea, boquilla autolimpiable y secado. Los modelos AURA añaden, según sus fichas, funciones como desodorización automática, escudo de espuma, control por voz en inglés y, en el AURA estándar, esterilización UV y aromaterapia.",
    ],
    sourceHref: "/coleccion",
    sourceLabel: "Catálogo de productos ELORA SMART",
    additionalSources: [
      { href: "/producto/esenza", label: "Ficha de producto ESENZA" },
      { href: "/producto/aura", label: "Ficha de producto AURA" },
    ],
  },
  {
    slug: "esenza-a-suelo-sin-obra",
    category: "Modelos",
    title: "ESENZA a suelo: una opción publicada para sustituir un inodoro tradicional",
    excerpt: "La ficha de ESENZA indica instalación a suelo estándar y sustitución con las mismas conexiones.",
    body: [
      "La ficha de ESENZA presenta este modelo como una alternativa para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Su instalación se describe como a suelo estándar.",
      "El contenido publicado indica que se necesita un enchufe cercano y que un fontanero de confianza puede instalarlo en 60–90 minutos. La ficha también especifica un tanque integrado de 5 litros, bomba doble y un nivel sonoro de hasta 59 dB.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
  },
  {
    slug: "esenza-compact-fondo-reducido",
    category: "Modelos",
    title: "ESENZA Compact: fondo reducido y diseño back-to-wall",
    excerpt: "Qué publica ELORA sobre el formato compacto pegado a la pared.",
    body: [
      "ESENZA Compact se describe como un modelo de fondo reducido, pensado para ganar espacio en baños pequeños, reformas y obra nueva. La ficha lo identifica como back-to-wall, es decir, pegado a la pared.",
      "La información del catálogo mantiene en este formato las funciones esenciales de ESENZA: lavado con agua, secado, asiento calefactado y automatización. Para su instalación, la ficha indica un enchufe cercano y una instalación de 60–90 minutos con un fontanero de confianza.",
    ],
    sourceHref: "/producto/esenza-compact",
    sourceLabel: "Ficha de producto ESENZA Compact",
  },
  {
    slug: "esenza-suspendido-diseno-flotante",
    category: "Modelos",
    title: "ESENZA Suspendido: diseño flotante y suelo libre",
    excerpt: "La ficha del modelo suspendido explica su instalación mural y las funciones de la gama.",
    body: [
      "ESENZA Suspendido se presenta como un modelo flotante destinado a baños modernos. Según la ficha, la instalación suspendida deja el suelo completamente libre y permite un acabado visual más limpio.",
      "El catálogo mantiene las funciones esenciales de ESENZA, entre ellas apertura, cierre y descarga automáticos, lavado posterior, femenino y móvil, secado en menos de 30 segundos y mando a distancia. Su instalación requiere un módulo incluido, un enchufe Schuko a menos de 1,2 metros e instalador, con un tiempo publicado de 90–120 minutos.",
    ],
    sourceHref: "/producto/esenza-suspendido",
    sourceLabel: "Ficha de producto ESENZA Suspendido",
  },
  {
    slug: "aura-experiencia-completa",
    category: "Modelos",
    title: "AURA: las funciones publicadas de la experiencia completa",
    excerpt: "Un resumen de lo que la ficha del AURA estándar incorpora a la gama.",
    body: [
      "La ficha del inodoro inteligente AURA reúne apertura automática, asiento climatizado, lavado ajustable, secado y control remoto en español. El modelo estándar se publica con tres opciones de display: Gris y Negro, Blanco y Gris.",
      "Además, la ficha enumera esterilización UV ultravioleta, aromaterapia integrada, terapia de calor por infrarrojos, escudo de espuma anti-salpicaduras, descarga dual y autolimpieza de boquillas. La instalación indicada es a suelo estándar con enchufe cercano.",
    ],
    sourceHref: "/producto/aura",
    sourceLabel: "Ficha de producto AURA",
  },
  {
    slug: "aura-compact-formato-reducido",
    category: "Modelos",
    title: "AURA Compact: tecnología AURA en un formato compacto",
    excerpt: "La ficha explica el enfoque de este modelo para baños con menor espacio.",
    body: [
      "AURA Compact combina un formato compacto con funciones publicadas como apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización y control por voz en inglés.",
      "El catálogo señala que el modelo está pensado para baños con poco espacio o lugares en los que se busca ganar amplitud. Incluye mando a distancia en español, descarga dual completa o ecológica y una instalación a suelo estándar con enchufe cercano.",
    ],
    sourceHref: "/producto/aura-compact",
    sourceLabel: "Ficha de producto AURA Compact",
  },
  {
    slug: "aura-suspendido-altura-ajustable",
    category: "Modelos",
    title: "AURA Suspendido: suelo libre y altura ajustable en instalación",
    excerpt: "Qué especifica la ficha sobre el formato suspendido de AURA.",
    body: [
      "AURA Suspendido se describe como la versión flotante de AURA. La ficha indica que el suelo queda totalmente libre y que la altura puede ajustarse al gusto durante la instalación.",
      "Sus funciones publicadas incluyen sensor ClimAdapt, lavado con agua tibia, secado con aire caliente, desodorización automática, espuma anti-salpicaduras, autolimpieza de boquillas, luz nocturna LED y control por voz en inglés. Al tratarse de una instalación suspendida en pared, requiere instalador especializado y un enchufe cercano.",
    ],
    sourceHref: "/producto/aura-suspendido",
    sourceLabel: "Ficha de producto AURA Suspendido",
  },
  {
    slug: "thalos-suspendido-nueva-coleccion",
    category: "Modelos",
    title: "THALOS Suspendido: la nueva colección en formato flotante",
    excerpt: "La información publicada de THALOS Suspendido, sus funciones y su formato.",
    body: [
      "THALOS Suspendido se publica como una nueva colección de ELORA SMART en formato flotante. La ficha reúne automatización, lavado posterior, femenino y móvil, agua caliente instantánea, secado y asiento CLIMADAPT.",
      "Entre las funciones diferenciales indicadas se encuentran desinfección UV automática, escudo de espuma y desodorización, masaje SPA con oscilación de 15 mm y hasta dos perfiles en el mando a distancia en español. La instalación suspendida requiere instalador especializado y permite ajustar la altura durante el montaje.",
    ],
    sourceHref: "/coleccion",
    sourceLabel: "Ficha de producto THALOS Suspendido",
  },
  {
    slug: "thalos-compact-fondo-reducido",
    category: "Modelos",
    title: "THALOS Compact: nueva generación en fondo reducido",
    excerpt: "El formato back-to-wall de THALOS para optimizar el espacio disponible.",
    body: [
      "THALOS Compact se presenta como la versión de fondo reducido de la nueva colección. La ficha explica que su formato más corto, totalmente pegado a la pared, busca optimizar cada centímetro en baños pequeños, reformas y obra nueva.",
      "El modelo publica lavado con agua, secado, asiento calefactado, automatización y desinfección UV. También enumera tanque integrado de 5 litros, cerámica rimless, luz nocturna LED y funcionamiento de hasta 59 dB. La instalación back-to-wall requiere instalador especializado y un enchufe cercano.",
    ],
    sourceHref: "/coleccion",
    sourceLabel: "Ficha de producto THALOS Compact",
  },
  {
    slug: "instalacion-a-suelo-o-suspendida",
    category: "Instalación",
    title: "Instalación a suelo o suspendida: lo que publica cada ficha",
    excerpt: "Una guía basada en las indicaciones de instalación de los modelos ELORA.",
    body: [
      "Los modelos ESENZA, AURA y AURA Compact se describen con instalación a suelo estándar. ESENZA y ESENZA Compact indican que solo necesitan un enchufe cercano y que la instalación puede realizarla un fontanero de confianza.",
      "Las fichas de ESENZA Suspendido, AURA Suspendido y THALOS Suspendido describen una instalación mural o suspendida. En estos casos se publica la necesidad de módulo de instalación y de instalador especializado. Los modelos suspendidos liberan el suelo; AURA y THALOS Suspendido también indican altura ajustable durante el montaje.",
    ],
    sourceHref: "/coleccion",
    sourceLabel: "Fichas de producto e instrucciones de instalación",
    additionalSources: [
      { href: "/producto/esenza", label: "Ficha de producto ESENZA" },
      { href: "/producto/esenza-suspendido", label: "Ficha de producto ESENZA Suspendido" },
      { href: "/producto/aura-suspendido", label: "Ficha de producto AURA Suspendido" },
    ],
  },
  {
    slug: "lavado-posterior-femenino-y-movil",
    category: "Funciones",
    title: "Lavado posterior, femenino y móvil: los modos publicados en ESENZA y THALOS",
    excerpt: "Las fichas técnicas describen tres modos de lavado con agua.",
    body: [
      "Las fichas de ESENZA, ESENZA Compact, ESENZA Suspendido y THALOS enumeran tres modos de lavado: posterior, femenino y móvil. En ESENZA y THALOS se describe además agua caliente instantánea.",
      "La información técnica publicada para ESENZA y THALOS identifica boquillas autolimpiables de acero inoxidable. THALOS añade que esa autolimpieza se realiza antes y después de cada uso. Las especificaciones de cada modelo son la referencia para confirmar las funciones concretas disponibles.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha técnica ESENZA y catálogo THALOS",
    additionalSources: [{ href: "/coleccion", label: "Catálogo THALOS" }],
  },
  {
    slug: "temperatura-agua-publicada-esenza-thalos",
    category: "Funciones",
    title: "Temperatura del agua: los niveles publicados en ESENZA y THALOS",
    excerpt: "Natural, 33 °C, 37 °C y 39 °C en las fichas técnicas de estas gamas.",
    body: [
      "La ficha técnica de ESENZA publica cuatro niveles de temperatura del agua: natural, 33 °C, 37 °C y 39 °C. La misma referencia aparece en los modelos THALOS del catálogo.",
      "En ESENZA, los niveles se vinculan al sistema de lavado posterior, femenino y móvil. THALOS publica los mismos niveles junto con tres niveles de presión de agua. Estas especificaciones pertenecen a las fichas de esas gamas y no deben extrapolarse a modelos cuya ficha no las detalle.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha técnica ESENZA",
    additionalSources: [{ href: "/coleccion", label: "Catálogo THALOS" }],
  },
  {
    slug: "secado-super-tifon-menos-de-30-segundos",
    category: "Funciones",
    title: "Secado Súper-Tifón: la especificación de menos de 30 segundos",
    excerpt: "Las fichas de ESENZA y THALOS describen secado ajustable con aire caliente.",
    body: [
      "ESENZA publica un secado Súper-Tifón completo en menos de 30 segundos, ajustable en cinco velocidades y cuatro temperaturas. El mismo tiempo de referencia aparece en sus aspectos destacados y en la ficha de ESENZA Compact y ESENZA Suspendido.",
      "Los modelos THALOS también indican secado en menos de 30 segundos, con cinco velocidades y cuatro temperaturas. La información de ELORA lo presenta junto con el lavado con agua como parte de la higiene sin papel que describen esas fichas.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA y catálogo THALOS",
    additionalSources: [
      { href: "/producto/esenza-compact", label: "Ficha de producto ESENZA Compact" },
      { href: "/producto/esenza-suspendido", label: "Ficha de producto ESENZA Suspendido" },
      { href: "/coleccion", label: "Catálogo THALOS" },
    ],
  },
  {
    slug: "asiento-climadapt-funcion-publicada",
    category: "Funciones",
    title: "Asiento CLIMADAPT: qué indica la información publicada",
    excerpt: "La regulación de la temperatura aparece en las fichas de las gamas ESENZA, AURA y THALOS.",
    body: [
      "La ficha de ESENZA describe CLIMADAPT como un asiento que regula su temperatura según el ambiente, con niveles natural, 33 °C, 37 °C y 39 °C. También lo identifica como antibacteriano.",
      "AURA y AURA Suspendido publican un sensor inteligente ClimAdapt que ajusta automáticamente asiento, agua y secador según la estación del año y las preferencias. THALOS publica el asiento calefactado CLIMADAPT con los mismos niveles de temperatura indicados en su catálogo.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Fichas de producto ESENZA, AURA y THALOS",
  },
  {
    slug: "apertura-cierre-y-descarga-automaticos",
    category: "Funciones",
    title: "Apertura, cierre y descarga automáticos: cómo lo describen las fichas",
    excerpt: "La automatización se publica con sensor de pie y detección de postura en varias gamas.",
    body: [
      "En ESENZA, ESENZA Compact, ESENZA Suspendido y THALOS se publican apertura, cierre y descarga automáticos. Las fichas señalan un sensor de pie integrado y detección de postura, diferenciando pie y sentado.",
      "La ficha técnica de ESENZA indica descarga automática al levantarse. THALOS publica apertura y cierre automáticos por proximidad, así como descarga automática y manual. Para AURA, las fichas también enumeran apertura automática de tapa y descarga dual como parte de sus funciones de control.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha técnica ESENZA y catálogo de producto",
  },
  {
    slug: "boquilla-autolimpiable-acero-inoxidable",
    category: "Funciones",
    title: "Boquilla autolimpiable: la información publicada sobre higiene",
    excerpt: "Las fichas de ESENZA y THALOS especifican acero inoxidable y autolimpieza.",
    body: [
      "La ficha de ESENZA indica una boquilla autolimpiable de acero inoxidable como parte de su sistema de lavado. ESENZA Compact y ESENZA Suspendido también incluyen esta característica en sus listas de funciones.",
      "THALOS publica una boquilla autolimpiable de acero inoxidable y añade que la autolimpieza se realiza antes y después de cada uso. AURA y sus variantes también publican autolimpieza de boquillas; sus fichas especifican ese proceso antes y después de cada uso.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Fichas de producto ESENZA, AURA y THALOS",
  },
  {
    slug: "espuma-anti-salpicaduras-y-desodorizacion",
    category: "Funciones",
    title: "Espuma anti-salpicaduras y desodorización en la gama AURA",
    excerpt: "Las fichas AURA describen un escudo de espuma y un sistema de purificación del aire.",
    body: [
      "AURA Compact y AURA Suspendido describen un escudo de espuma higiénica que crea una barrera en el agua para evitar salpicaduras y malos olores. La misma información publica desodorización automática mediante un proceso de purificación del aire.",
      "El AURA estándar enumera escudo de espuma anti-salpicaduras y desodorización automática entre sus funciones. THALOS también publica escudo de espuma y desodorización. Las capacidades exactas se consultan en la ficha del modelo elegido.",
    ],
    sourceHref: "/producto/aura",
    sourceLabel: "Fichas de producto AURA y catálogo THALOS",
  },
  {
    slug: "desinfeccion-uv-publicada",
    category: "Funciones",
    title: "Desinfección UV: qué modelos la publican",
    excerpt: "La esterilización ultravioleta aparece en AURA y en la nueva colección THALOS.",
    body: [
      "El AURA estándar publica esterilización UV ultravioleta dentro de sus funciones premium. AURA Compact también enumera esterilización UV en su descripción y destacados.",
      "THALOS Suspendido y THALOS Compact publican desinfección UV automática. La ficha de THALOS Suspendido explica que una luz ultravioleta interna desinfecta automáticamente la cánula y zonas críticas entre usos. La información debe interpretarse como una función publicada del producto, atendiendo siempre a la ficha concreta de cada modelo.",
    ],
    sourceHref: "/producto/aura",
    sourceLabel: "Fichas de producto AURA y catálogo THALOS",
  },
  {
    slug: "mando-espanol-y-control-por-voz",
    category: "Funciones",
    title: "Mando en español y control por voz: la disponibilidad publicada",
    excerpt: "Las fichas diferencian el mando a distancia en español del control por voz en inglés.",
    body: [
      "Las fichas de ESENZA y THALOS indican mando a distancia en español con memoria para dos usuarios. ESENZA también publica una rueda lateral multifunción para lavado, descarga y secado.",
      "AURA, AURA Compact y AURA Suspendido especifican mando a distancia en español y control por voz en inglés. Sus preguntas frecuentes aclaran que el control por voz no está disponible en español. Las fichas son la fuente para comprobar la disponibilidad de estas opciones por modelo.",
    ],
    sourceHref: "/producto/aura-compact",
    sourceLabel: "Fichas de producto AURA y ESENZA",
  },
  {
    slug: "luz-nocturna-led-y-cierre-amortiguado",
    category: "Funciones",
    title: "Luz nocturna LED y cierre amortiguado: funciones del catálogo",
    excerpt: "Dos prestaciones que aparecen en listas de funciones y especificaciones técnicas.",
    body: [
      "ESENZA publica luz ambiente LED y luz nocturna, además de tapa de caída amortiguada. Su ficha técnica identifica el cierre como amortiguado, también denominado soft close.",
      "ESENZA Compact, ESENZA Suspendido, AURA y THALOS incluyen luz nocturna LED en sus listados de funciones. Como con cualquier prestación, la forma de confirmar si está incluida es revisar la ficha del modelo específico antes de realizar el pedido.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA y catálogo de producto",
  },
  {
    slug: "preparar-instalacion-esenza",
    category: "Instalación",
    title: "Preparar la instalación de ESENZA según su ficha",
    excerpt: "Conexiones existentes, enchufe cercano y pasos publicados para el modelo a suelo.",
    body: [
      "La ficha de ESENZA indica que el modelo a suelo puede sustituir el inodoro actual utilizando las mismas conexiones. Entre los requisitos publicados figura disponer de un enchufe cerca.",
      "El proceso de instalación de ESENZA describe montaje a suelo estándar, instalación por un fontanero de confianza en 60–90 minutos y configuración de preferencias desde el mando en español. La marca también publica soporte técnico en español para dudas de compatibilidad e instalación.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
  },
  {
    slug: "instalacion-suspendida-requisitos-publicados",
    category: "Instalación",
    title: "Instalación suspendida: requisitos publicados para los modelos flotantes",
    excerpt: "Módulo, pared, enchufe cercano e instalador especializado en las fichas de los modelos suspendidos.",
    body: [
      "Las fichas de ESENZA Suspendido, AURA Suspendido y THALOS Suspendido describen una instalación suspendida en pared. En ESENZA Suspendido se publica un módulo de instalación incluido y un enchufe Schuko a menos de 1,2 metros.",
      "AURA y THALOS Suspendido indican que la altura se puede ajustar durante la instalación. Las fichas señalan la necesidad de instalador especializado para los modelos suspendidos. Esta información permite diferenciar este formato de la instalación a suelo estándar de otros modelos del catálogo.",
    ],
    sourceHref: "/producto/esenza-suspendido",
    sourceLabel: "Fichas de producto suspendido",
  },
  {
    slug: "garantia-ceramica-diez-anos",
    category: "Garantía y soporte",
    title: "Garantía de cerámica de 10 años: condiciones publicadas",
    excerpt: "La página de garantías define la cobertura de fabricación de la cerámica.",
    body: [
      "La página de Garantía y Soporte de ELORA SMART indica que todos sus modelos incluyen 10 años de garantía en cerámica, siempre que el producto se haya instalado correctamente y se utilice conforme a las indicaciones del fabricante.",
      "La cobertura publicada se refiere a defectos de fabricación relacionados con la estructura cerámica. La misma página diferencia esta garantía de la cobertura de componentes tecnológicos y de la disponibilidad de recambios, que tienen condiciones propias.",
    ],
    sourceHref: "/garantias",
    sourceLabel: "Página de Garantía y Soporte",
  },
  {
    slug: "cobertura-tecnologica-esenza-y-aura",
    category: "Garantía y soporte",
    title: "Cobertura tecnológica de ESENZA y AURA según la página de garantías",
    excerpt: "La web distingue los periodos de cobertura de componentes tecnológicos por gama.",
    body: [
      "La página de Garantía y Soporte indica que ESENZA cuenta con cobertura de componentes tecnológicos durante los primeros tres años desde la compra cuando la incidencia se relaciona con un defecto de fabricación.",
      "Para AURA, la misma página publica ELORA Premium Care con cobertura ampliada de componentes tecnológicos durante los primeros cinco años desde la compra. La garantía de cerámica de 10 años se presenta como común a todos los modelos bajo las condiciones publicadas.",
    ],
    sourceHref: "/garantias",
    sourceLabel: "Página de Garantía y Soporte",
  },
  {
    slug: "recambios-disponibles-diez-anos",
    category: "Garantía y soporte",
    title: "Recambios durante 10 años: el compromiso publicado por ELORA",
    excerpt: "Disponibilidad de piezas y diferencia entre recambio disponible y recambio gratuito.",
    body: [
      "ELORA SMART publica disponibilidad de recambios durante 10 años desde la compra. La página de garantía explica que este compromiso permite ofrecer piezas para mantener el producto después de que termine el periodo de garantía.",
      "La disponibilidad no significa que todas las piezas sean gratuitas durante diez años. Cuando la reparación está fuera de garantía, la web indica que se informará previamente de las opciones y de los posibles costes de piezas, envíos o intervenciones.",
    ],
    sourceHref: "/garantias",
    sourceLabel: "Página de Garantía y Soporte",
  },
  {
    slug: "soporte-tecnico-incidencias-elora",
    category: "Garantía y soporte",
    title: "Soporte técnico ante una incidencia: las vías publicadas",
    excerpt: "Asistencia remota, técnico local, pieza de repuesto o revisión en instalaciones.",
    body: [
      "La página de soporte indica que ELORA SMART puede estudiar una incidencia mediante asistencia remota paso a paso, intervención de un técnico local cuando sea posible, envío de una pieza a un técnico de confianza o revisión del componente en sus instalaciones.",
      "El soporte publicado incluye orientación sobre compatibilidad, instalación, uso del mando, funciones inteligentes, mantenimiento básico, consumibles y recambios. Antes de una actuación con coste fuera de garantía, la web señala que comunica las opciones disponibles.",
    ],
    sourceHref: "/garantias",
    sourceLabel: "Página de Garantía y Soporte",
  },
  {
    slug: "zonas-y-tarifas-envio-publicadas",
    category: "Envíos",
    title: "Zonas y tarifas de envío: la información publicada por ELORA SMART",
    excerpt: "España peninsular y Portugal continental sin coste, más tarifas para destinos concretos.",
    body: [
      "La Política de Envíos publica envío gratuito para España peninsular y Portugal continental. Para Baleares, Francia continental, Italia continental, Alemania y Países Bajos se muestran tarifas específicas.",
      "La misma página enumera zonas sin servicio por motivos logísticos, aduaneros o fiscales, entre ellas Canarias, Ceuta, Melilla, Azores, Madeira, Córcega, islas italianas y territorios franceses de ultramar. Para casos concretos, la web invita a contactar con ELORA SMART.",
    ],
    sourceHref: "/politica-envios",
    sourceLabel: "Política de Envíos",
  },
  {
    slug: "plazos-y-proceso-envio",
    category: "Envíos",
    title: "Plazos y proceso de envío según la Política de Envíos",
    excerpt: "Preparación, seguimiento y plazos estimados por destino publicados en la web.",
    body: [
      "La Política de Envíos publica plazos estimados de 3–7 días laborables para España peninsular, 5–10 días para Portugal continental y Baleares, y 7–15 días para Francia, Italia, Alemania y Países Bajos. Estos plazos se presentan como estimaciones sujetas a disponibilidad, transporte y circunstancias excepcionales.",
      "Tras confirmarse el pago, la web indica una preparación de 1–2 días laborables en Bertamiráns (AMES). Una vez recogido el pedido, se comunica por correo el número de seguimiento para consultar el estado del envío.",
    ],
    sourceHref: "/politica-envios",
    sourceLabel: "Política de Envíos",
  },
  {
    slug: "recepcion-y-danos-transporte",
    category: "Envíos",
    title: "Recepción del pedido y daños de transporte: pasos publicados",
    excerpt: "Qué recomienda la Política de Envíos en el momento de la entrega.",
    body: [
      "La Política de Envíos recomienda revisar el embalaje exterior antes de firmar el albarán. Si se detectan daños, indica anotarlos en el albarán y contactar con ELORA SMART de inmediato.",
      "En caso de daños en embalaje o producto, la web pide reflejar los daños visibles antes de firmar, fotografiar embalaje y producto y contactar en un plazo máximo de 24 horas con las imágenes. La política indica que ELORA SMART gestionará la reclamación y procederá a reposición o reparación sin coste adicional para el cliente.",
    ],
    sourceHref: "/politica-envios",
    sourceLabel: "Política de Envíos",
  },
  {
    slug: "derecho-desistimiento-devoluciones",
    category: "Envíos",
    title: "Devoluciones y derecho de desistimiento: información publicada",
    excerpt: "El plazo, el estado del producto y el procedimiento descritos en la Política de Envíos.",
    body: [
      "La Política de Envíos indica un derecho de desistimiento de 14 días naturales desde la recepción del producto. Para ejercerlo, la web solicita comunicarlo por escrito antes de que venza el plazo.",
      "El producto debe devolverse sin usar, en perfecto estado y con su embalaje original. La política publicada señala que los gastos de devolución corresponden al cliente, salvo defecto de fabricación. Tras la recepción y verificación, se indica un reembolso íntegro en un máximo de 14 días mediante el mismo método de pago utilizado en la compra.",
    ],
    sourceHref: "/politica-envios",
    sourceLabel: "Política de Envíos",
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
