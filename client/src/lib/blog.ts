export type BlogPost = {
  slug: string;
  category: "Modelos" | "Funciones" | "Instalación" | "Guías prácticas";
  title: string;
  excerpt: string;
  body: string[];
  sourceHref: string;
  sourceLabel: string;
  additionalSources?: { href: string; label: string }[];
};

/**
 * Entradas editoriales construidas exclusivamente a partir de contenido
 * publicado en fichas de producto, preguntas frecuentes y Garantías.
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
    slug: "que-incluye-esenza-en-la-caja",
    category: "Guías prácticas",
    title: "¿Qué incluye ESENZA en la caja?",
    excerpt: "Los elementos que la ficha de producto enumera para el modelo a suelo.",
    body: [
      "La ficha de ESENZA publica que el contenido de la caja incluye el inodoro inteligente ESENZA, el mando a distancia en español, la rueda lateral multifunción, el manual de instalación y uso y el kit de instalación.",
      "El mando a distancia se describe como un control en español con memoria para dos usuarios. La rueda lateral se publica como un control para lavado, descarga y secado, y el manual forma parte de los elementos incluidos por el modelo.",
      "Estos elementos corresponden a ESENZA. Los modelos AURA, suspendidos, compactos y THALOS tienen sus propios listados de contenido incluido en sus respectivas fichas.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
  },
  {
    slug: "que-modelo-esta-pensado-para-banos-pequenos",
    category: "Guías prácticas",
    title: "¿Qué modelos están pensados para baños pequeños?",
    excerpt: "Los formatos compactos y back-to-wall que se describen en las fichas publicadas.",
    body: [
      "ESENZA Compact se describe como un modelo de fondo reducido, pegado a la pared, pensado para ganar espacio en baños pequeños, reformas y obra nueva. AURA Compact también se presenta como un formato compacto para baños con poco espacio o para ganar amplitud.",
      "THALOS Compact se publica con un formato corto y totalmente pegado a la pared. Su ficha indica que está especialmente diseñado para baños pequeños y que optimiza cada centímetro sin perder funcionalidad.",
      "Cada formato compacto tiene funciones e instalación propias. Las fichas específicas de ESENZA Compact, AURA Compact y THALOS Compact permiten revisar esa información antes de elegir el modelo.",
    ],
    sourceHref: "/producto/esenza-compact",
    sourceLabel: "Ficha de producto ESENZA Compact",
    additionalSources: [
      { href: "/producto/aura-compact", label: "Ficha de producto AURA Compact" },
      { href: "/coleccion", label: "Catálogo THALOS Compact" },
    ],
  },
  {
    slug: "que-significa-descarga-dual",
    category: "Guías prácticas",
    title: "¿Qué significa la descarga dual en AURA Compact?",
    excerpt: "La ficha del modelo publica dos opciones: completa y ecológica.",
    body: [
      "La ficha de AURA Compact publica una descarga dual con dos opciones: completa y ecológica. Esta característica aparece tanto entre las funciones del modelo como en el bloque de control de sus especificaciones técnicas.",
      "En las preguntas frecuentes de AURA Compact, ELORA indica que la descarga inteligente optimiza el consumo mediante esas dos opciones. La misma ficha publica apertura automática, lavado con agua tibia, secado con aire caliente, desodorización y escudo de espuma como parte del modelo.",
      "La descarga y el resto de funciones deben confirmarse siempre en la ficha del modelo elegido, ya que las especificaciones se muestran individualmente para cada producto de la colección.",
    ],
    sourceHref: "/producto/aura-compact",
    sourceLabel: "Ficha de producto AURA Compact",
  },
  {
    slug: "para-que-sirve-diseno-rimless",
    category: "Guías prácticas",
    title: "¿Qué es el diseño rimless que publica ESENZA?",
    excerpt: "La ficha técnica lo identifica como un diseño sin reborde interior.",
    body: [
      "En la ficha de ESENZA, el diseño rimless se define como un diseño sin reborde interior. Esta característica aparece tanto en el listado de funciones como en el grupo técnico de agua y sistema.",
      "La ficha también publica una boquilla autolimpiable de acero inoxidable, lavado posterior, femenino y móvil, y un tanque integrado de 5 litros. Todas estas especificaciones forman parte de la descripción técnica de ESENZA.",
      "Para comprobar cómo se presenta esta característica en otros formatos de la colección, la referencia correcta es la ficha de producto correspondiente, ya que el catálogo no atribuye las mismas especificaciones de forma universal a todos los modelos.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
  },
  {
    slug: "que-necesito-para-instalar-esenza",
    category: "Guías prácticas",
    title: "¿Qué necesito para instalar un ESENZA?",
    excerpt: "Conexiones existentes, un enchufe cercano y el proceso publicado para el modelo a suelo.",
    body: [
      "La ficha de ESENZA indica que el modelo a suelo sustituye al inodoro actual utilizando las mismas conexiones. Por ello, se presenta como una opción para reformas de baño y sustituciones de un inodoro tradicional sin cambiar la instalación.",
      "El requisito que destaca la ficha es disponer de un enchufe cerca. ELORA también publica que un fontanero de confianza puede realizar la instalación en 60–90 minutos y que el producto incluye manual de instalación y uso, kit de instalación, mando en español y rueda lateral multifunción.",
      "Una vez instalado, la propia ficha indica que las preferencias se pueden configurar desde el mando en español. Para confirmar la compatibilidad concreta de un baño, la página de Garantía y Soporte incluye orientación sobre compatibilidad e instalación.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
    additionalSources: [{ href: "/garantias", label: "Página de Garantía y Soporte" }],
  },
  {
    slug: "que-ocurre-si-hay-baja-presion-de-agua",
    category: "Guías prácticas",
    title: "¿Qué ocurre si hay baja presión de agua?",
    excerpt: "La respuesta publicada por la ficha de ESENZA sobre su tanque integrado y su bomba doble.",
    body: [
      "La ficha de ESENZA publica un tanque integrado de 5 litros y una bomba doble de alta potencia. En sus preguntas frecuentes, indica que este sistema garantiza un funcionamiento fiable incluso en edificios antiguos o con baja presión de agua.",
      "La sección técnica de la misma ficha especifica que el tanque es integrado, que la bomba es doble de alta potencia y que la descarga es dual direccional. Estas características se muestran como parte del sistema de agua del modelo ESENZA.",
      "La información corresponde a ESENZA. Para conocer las especificaciones de agua y descarga de los demás modelos, la referencia es la ficha técnica individual del producto elegido.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
  },
  {
    slug: "diferencia-esenza-y-aura",
    category: "Guías prácticas",
    title: "¿Qué diferencia hay entre ESENZA y AURA?",
    excerpt: "Una respuesta basada en la pregunta frecuente publicada en la ficha de ESENZA.",
    body: [
      "La pregunta frecuente de ESENZA explica que este modelo reúne las funciones esenciales de la gama: lavado, secado, asiento calefactado y automatización. La misma ficha lo presenta como un modelo a suelo que sustituye un inodoro tradicional usando las mismas conexiones.",
      "Según esa respuesta publicada, AURA añade escudo de espuma anti-salpicaduras, luz UV, aromaterapia y control por voz. La ficha de AURA enumera además apertura automática, asiento climatizado, lavado ajustable, secado, mando en español, esterilización UV, aromaterapia integrada y descarga dual.",
      "Las fichas de cada modelo permiten contrastar el formato de instalación y las funciones publicadas antes de tomar una decisión entre ambas gamas.",
    ],
    sourceHref: "/producto/esenza",
    sourceLabel: "Ficha de producto ESENZA",
    additionalSources: [{ href: "/producto/aura", label: "Ficha de producto AURA" }],
  },
  {
    slug: "que-implica-elegir-inodoro-suspendido",
    category: "Guías prácticas",
    title: "¿Qué implica elegir un inodoro suspendido?",
    excerpt: "Suelo libre, altura ajustable y requisitos publicados para los modelos flotantes.",
    body: [
      "Las fichas de ESENZA Suspendido, AURA Suspendido y THALOS Suspendido describen modelos flotantes instalados en pared. En todos ellos, el formato suspendido deja el suelo libre; AURA Suspendido y THALOS Suspendido publican además altura ajustable durante la instalación.",
      "ESENZA Suspendido indica que incluye módulo de instalación, requiere un enchufe Schuko a menos de 1,2 metros y necesita instalador. La ficha publica un tiempo de instalación de 90–120 minutos. AURA Suspendido y THALOS Suspendido también especifican la necesidad de instalador especializado y enchufe cercano.",
      "Cada modelo combina el formato suspendido con sus propias funciones. Por eso, una vez decidido el tipo de instalación, la información más completa está en la ficha técnica del modelo flotante que interese.",
    ],
    sourceHref: "/producto/esenza-suspendido",
    sourceLabel: "Ficha de producto ESENZA Suspendido",
    additionalSources: [
      { href: "/producto/aura-suspendido", label: "Ficha de producto AURA Suspendido" },
      { href: "/coleccion", label: "Catálogo THALOS Suspendido" },
    ],
  },
];

const BLOG_COVER_IMAGES = {
  esenza: [
    "/manus-storage/esenza-main_7db64882.png",
    "/manus-storage/ESENZa-12_b3dd228d.webp",
    "/manus-storage/ESENZA-9_70e448e2.webp",
  ],
  esenzaCompact: [
    "/manus-storage/Clipboard_0_D4A653F1_4c49e12c.png",
    "/manus-storage/esenza-compact-3_af2323bc.jpg",
  ],
  esenzaSuspendido: [
    "/manus-storage/esenza-suspendido-1_472bd803.jpg",
    "/manus-storage/esenza-suspendido-4_8a048cf4.jpg",
  ],
  aura: [
    "/manus-storage/inodoro-aura_4c9492ae.jpg",
    "/manus-storage/aura-elorasmart6_394ec9d0.jpg",
  ],
  auraCompact: [
    "/manus-storage/AURA-compact-p-800x800_597da236.jpg",
    "/manus-storage/aura-compact-6_2af3f2ac.jpg",
  ],
  auraSuspendido: [
    "/manus-storage/aura-suspendido-v3_9a4f47aa.png",
    "/manus-storage/aura-suspendido-3_a85c6741.jpg",
  ],
  thalosSuspendido: [
    "/manus-storage/12_22ba2ae7.jpeg",
    "/manus-storage/5_284bacd8.jpeg",
  ],
  thalosCompact: [
    "/manus-storage/WhatsAppImage2026-07-16at12.45.28(2)_dda274fb.jpeg",
    "/manus-storage/WhatsAppImage2026-07-16at12.46.17_8440d82c.jpeg",
  ],
} as const;

/** Selecciona únicamente imágenes existentes que ya forman parte del catálogo publicado. */
export function getBlogCover(post: BlogPost, variant = 0): string {
  const slug = post.slug;
  const choose = (images: readonly string[]) => images[variant % images.length];

  if (slug.includes("thalos-compact")) return choose(BLOG_COVER_IMAGES.thalosCompact);
  if (slug.includes("thalos")) return choose(BLOG_COVER_IMAGES.thalosSuspendido);
  if (slug.includes("esenza-suspendido")) return choose(BLOG_COVER_IMAGES.esenzaSuspendido);
  if (slug.includes("esenza-compact")) return choose(BLOG_COVER_IMAGES.esenzaCompact);
  if (slug.includes("aura-compact")) return choose(BLOG_COVER_IMAGES.auraCompact);
  if (slug.includes("aura-suspendido") || slug.includes("suspendido")) return choose(BLOG_COVER_IMAGES.auraSuspendido);
  if (slug.includes("aura")) return choose(BLOG_COVER_IMAGES.aura);
  return choose(BLOG_COVER_IMAGES.esenza);
}

/** Devuelve la ficha de catálogo que documenta el contenido de la guía cuando existe una relación directa. */
export function getBlogProductId(post: BlogPost): string | null {
  const slug = post.slug;
  if (slug.includes("esenza-suspendido")) return "ESENZA-SUSPENDIDO";
  if (slug.includes("esenza-compact")) return "ESENZA-COMPACT";
  if (slug.includes("aura-compact")) return "AURA-COMPACT";
  if (slug.includes("aura-suspendido")) return "AURA-SUSPENDIDO";
  if (slug.includes("thalos-compact")) return "THALOS-COMPACT";
  if (slug.includes("thalos")) return "THALOS-SUSPENDIDO";
  if (slug.includes("aura") || slug.includes("espuma") || slug.includes("desinfeccion") || slug.includes("mando")) return "AURA-COMPACT";
  return "ESENZA";
}

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
