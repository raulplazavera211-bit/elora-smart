import type { Product } from "@/components/ProductDetail";

// ─── Galerías ─────────────────────────────────────────────────────────────────
const ESENZA_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZa-12.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-9.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-10.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-7.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-8.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-2.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-11.webp",
];

const AURA_COMPACT_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-1.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-11.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-6.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-10.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-8.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-3.jpg",
];

const AURA_SUSP_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido1.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-2.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-3.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-111.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-9.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-6.jpg",
];

const ESENZA_COMPACT_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_5.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_2.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_10.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_9.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_8.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_6.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_7.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_11.webp",
];

const ESENZA_SUSP_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_4-1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_2-1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_6-1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_7-1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_5-1.webp",
  "https://elorasmart.com/wp-content/uploads/2025/12/batch_8-1.webp",
];

const AURA_GALLERY = [
  "https://elorasmart.com/wp-content/uploads/2025/05/inodoro-aura.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart7-scaled.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart6.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart5.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart3.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart2.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart-scaled.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/AURA-BLANCO-2-scaled.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/AURA-BLANCO-3-scaled.jpg",
  "https://elorasmart.com/wp-content/uploads/2025/05/AURA-BLANCO-6-scaled.jpg",
];

// ─── Catálogo completo ────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Product[] = [
  {
    id: "ESENZA",
    name: "Inodoro inteligente ESENZA",
    tagline: "El inodoro inteligente japonés a suelo de ELORA SMART.",
    description: "Ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación.",
    longDescription:
      "ESENZA a suelo es el inodoro inteligente japonés de ELORA SMART, ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Mantiene todas las funciones esenciales de la gama ESENZA con instalación sencilla, máxima estabilidad y un diseño de líneas limpias para baños modernos. Incluye 10 años de garantía en la cerámica y 3 años en la tecnología, ampliables a 5 años con ELORA Premium Care.",
    img: "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
    gallery: ESENZA_GALLERY,
    badges: ["Best seller", "Sin obra"],
    highlights: [
      { label: "Asiento", value: "CLIMADAPT" },
      { label: "Secado", value: "< 30 segundos" },
      { label: "Garantía", value: "10 años cerámica" },
    ],
    pitch: [
      { title: "Automatización inteligente", body: "Apertura, cierre y descarga automáticos. Sensor de pie integrado y detección de postura (pie/sentado). Todo sin tocar nada." },
      { title: "Higiene completa con agua", body: "Sistema de lavado triple: posterior, femenino y móvil. Agua caliente instantánea (Natural, 33°C, 37°C, 39°C). Boquilla autolimpiable en acero inoxidable." },
      { title: "Secado Súper-Tifón", body: "Secado completo en menos de 30 segundos. Ajustable en 5 velocidades y 4 temperaturas. La realidad de un inodoro sin papel." },
      { title: "Asiento CLIMADAPT", body: "Regula la temperatura del asiento según el ambiente para un confort perfecto todo el año. Niveles: Natural, 33°C, 37°C, 39°C." },
      { title: "Control total, muy fácil", body: "Mando a distancia en español con memoria para 2 usuarios. Rueda lateral intuitiva: giro adelante/atrás para lavados, botón central para descarga/secado." },
      { title: "Sistema de agua avanzado", body: "Bomba doble de alta potencia. Tanque integrado de 5 litros. Funciona en edificios con baja presión. Funcionamiento silencioso ≤59 dB." },
    ],
    features: [
      "Apertura, cierre y descarga automáticos",
      "Sensor de pie integrado",
      "Detección de postura (pie/sentado)",
      "Lavado posterior, femenino y móvil",
      "Agua caliente instantánea (4 temperaturas)",
      "Boquilla autolimpiable en acero inoxidable",
      "Asiento antibacteriano CLIMADAPT",
      "Secado Súper-Tifón en menos de 30 segundos (5 velocidades)",
      "Panel digital en cristal templado",
      "Mando a distancia en español (2 usuarios)",
      "Rueda lateral multifunción",
      "Luz ambiente LED y luz nocturna",
      "Diseño rimless (sin reborde interior)",
      "Tapa de caída amortiguada",
      "Tanque integrado de 5 litros",
      "Bomba doble de alta potencia",
      "Funcionamiento silencioso ≤59 dB",
    ],
    technical: [
      {
        group: "Lavado & bidé",
        specs: [
          { label: "Modos de lavado", value: "Posterior · Femenino · Móvil" },
          { label: "Temperatura del agua", value: "Natural · 33°C · 37°C · 39°C" },
          { label: "Boquilla", value: "Acero inoxidable autolimpiante" },
          { label: "Asiento", value: "Antibacteriano CLIMADAPT" },
        ],
      },
      {
        group: "Confort & secado",
        specs: [
          { label: "Asiento calefactado", value: "Natural · 33°C · 37°C · 39°C" },
          { label: "Secado Súper-Tifón", value: "5 velocidades · 4 temperaturas" },
          { label: "Tiempo de secado", value: "< 30 segundos" },
          { label: "Cierre", value: "Amortiguado (soft close)" },
        ],
      },
      {
        group: "Automatización",
        specs: [
          { label: "Apertura/cierre", value: "Automático por sensor" },
          { label: "Sensor de pie", value: "Sí" },
          { label: "Detección de postura", value: "Pie / Sentado" },
          { label: "Descarga automática", value: "Al levantarse" },
        ],
      },
      {
        group: "Agua & sistema",
        specs: [
          { label: "Tanque integrado", value: "5 litros" },
          { label: "Bomba", value: "Doble de alta potencia" },
          { label: "Descarga", value: "Dual direccional" },
          { label: "Nivel sonoro", value: "≤59 dB" },
          { label: "Diseño", value: "Rimless (sin reborde)" },
        ],
      },
    ],
    dimensions: [
      { label: "Instalación", value: "A suelo (estándar)" },
      { label: "Tanque", value: "5 litros integrado" },
      { label: "Nivel sonoro", value: "≤59 dB" },
      { label: "Diseño", value: "Rimless" },
    ],
    inTheBox: [
      "Inodoro inteligente ESENZA",
      "Mando a distancia en español",
      "Rueda lateral multifunción",
      "Manual de instalación y uso",
      "Kit de instalación",
    ],
    installation: [
      "Instalación a suelo estándar — sustituye a tu inodoro actual.",
      "Solo necesitas un enchufe cerca.",
      "Tu fontanero de confianza lo instala en 60–90 minutos.",
      "Configura tus preferencias con el mando en español.",
    ],
    warranty: {
      years: 3,
      details: "10 años de garantía en la cerámica · 3 años en la tecnología (ampliable a 5 años con ELORA Premium Care por 249€, contratable solo en el momento de la compra). Servicio técnico en español. Repuestos oficiales garantizados 10 años.",
    },
    faqs: [
      { q: "¿Necesito obra para instalar el ESENZA?", a: "No. Sustituye a tu inodoro actual con las mismas conexiones. Solo necesitas un enchufe cerca." },
      { q: "¿En qué se diferencia ESENZA de AURA?", a: "ESENZA tiene todas las funciones esenciales (lavado, secado, asiento calefactado, automatización) a un precio más contenido. AURA añade espuma anti-salpicaduras, luz UV, aromaterapia y control por voz." },
      { q: "¿Funciona con baja presión de agua?", a: "Sí. El tanque integrado de 5 litros garantiza un funcionamiento fiable incluso en edificios antiguos o con baja presión." },
      { q: "¿Hace ruido por la noche?", a: "No. El funcionamiento es silencioso, por debajo de 59 dB — hasta 21 dB más silencioso que muchos inodoros convencionales." },
    ],
    price: 1490,
  },
  {
    id: "ESENZA-COMPACT",
    name: "Inodoro inteligente ESENZA compact",
    tagline: "Todas las funciones en fondo reducido.",
    description: "El inodoro inteligente japonés de fondo reducido. Optimiza cada centímetro sin renunciar a ninguna función.",
    longDescription: "ESENZA COMPACT es el inodoro inteligente compacto de ELORA SMART, pensado para ganar espacio en baños pequeños, reformas y obra nueva. Su diseño más corto y totalmente pegado a la pared optimiza cada centímetro, manteniendo las funciones esenciales de ESENZA —lavado con agua, secado, asiento calefactado y automatización— en un formato más estilizado.",
    img: "https://elorasmart.com/wp-content/uploads/2025/12/batch_5.webp",
    gallery: ESENZA_COMPACT_GALLERY,
    badges: ["Compact", "Back-to-wall"],
    highlights: [
      { label: "Formato", value: "Fondo reducido" },
      { label: "Instalación", value: "Back-to-wall" },
      { label: "Garantía", value: "10 años" },
    ],
    pitch: [
      { title: "Diseñado para baños pequeños", body: "Formato compacto de fondo reducido. Cabe donde otros no llegan sin sacrificar ninguna función esencial." },
      { title: "Automatización total", body: "Apertura, cierre y descarga automáticos. Sensor de pie y detección de postura para un uso completamente sin contacto." },
      { title: "Secado en 30 segundos", body: "Chorro de aire concentrado de alto rendimiento. Higiene completa sin papel, ajustable en 5 velocidades." },
    ],
    features: [
      "Apertura, cierre y descarga automáticos",
      "Sensor de pie integrado",
      "Detección de postura (pie/sentado)",
      "Lavado posterior, femenino y móvil",
      "Agua caliente instantánea",
      "Boquilla autolimpiable en acero inoxidable",
      "Asiento calefactado CLIMADAPT",
      "Secado en menos de 30 segundos (5 velocidades)",
      "Mando a distancia en español (2 usuarios)",
      "Rueda lateral multifunción",
      "Luz nocturna LED",
      "Cerámica rimless",
      "Tanque integrado de 5 litros",
      "Funcionamiento silencioso ≤59 dB",
    ],
    technical: [
      {
        group: "Dimensiones",
        specs: [
          { label: "Formato", value: "Compacto back-to-wall" },
          { label: "Tanque", value: "5 litros integrado" },
          { label: "Ruido", value: "≤59 dB" },
        ],
      },
      {
        group: "Funciones",
        specs: [
          { label: "Lavados", value: "Posterior · Femenino · Móvil" },
          { label: "Temperatura agua", value: "4 niveles" },
          { label: "Secado", value: "5 velocidades" },
        ],
      },
    ],
    dimensions: [
      { label: "Formato", value: "Compacto (fondo reducido)" },
      { label: "Instalación", value: "Back-to-wall" },
      { label: "Tanque", value: "5 litros integrado" },
    ],
    inTheBox: ["Inodoro ESENZA Compact", "Mando a distancia", "Manual en español", "Kit de instalación"],
    installation: [
      "Instalación back-to-wall (pegado a pared)",
      "Solo necesitas un enchufe cerca",
      "Tu fontanero de confianza en 60-90 min",
    ],
    warranty: {
      years: 3,
      details: "10 años cerámica · 3 años tecnología (ampliable a 5 con Premium Care +249€)",
    },
    faqs: [
      { q: "¿En qué se diferencia del ESENZA estándar?", a: "Tiene fondo reducido y diseño back-to-wall (pegado a pared), ideal para baños pequeños. Las funciones son idénticas." },
      { q: "¿Necesita obras?", a: "No. Solo un enchufe cerca y tu fontanero habitual." },
    ],
    price: 1590,
  },
  {
    id: "ESENZA-SUSPENDIDO",
    name: "Inodoro inteligente ESENZA suspendido",
    tagline: "Diseño flotante con funciones esenciales.",
    description: "El inodoro inteligente japonés flotante de ELORA SMART. Libera el suelo y aporta una estética minimalista y contemporánea.",
    longDescription: "ESENZA Suspendido es el inodoro inteligente japonés flotante de ELORA SMART, diseñado para baños modernos que buscan un acabado más limpio, minimalista y elevado del suelo. Su instalación suspendida facilita la limpieza, libera espacio visual y mantiene todas las funciones esenciales de la gama ESENZA con un diseño más ligero y contemporáneo.",
    img: "https://elorasmart.com/wp-content/uploads/2025/12/batch_4-1.webp",
    gallery: ESENZA_SUSP_GALLERY,
    badges: ["Suspendido", "Rimless"],
    highlights: [
      { label: "Instalación", value: "Suspendida" },
      { label: "Suelo", value: "Completamente libre" },
      { label: "Garantía", value: "10 años" },
    ],
    pitch: [
      { title: "Diseño flotante", body: "El suelo queda completamente libre. Limpieza total sin recovecos, amplitud visual y estética minimalista." },
      { title: "Automatización completa", body: "Apertura, cierre y descarga automáticos. Sensor de pie y detección de postura para un uso sin contacto." },
      { title: "Secado ultra-rápido", body: "Sistema de secado de alto rendimiento en menos de 30 segundos. Higiene completa sin papel." },
    ],
    features: [
      "Apertura, cierre y descarga automáticos",
      "Sensor de pie integrado",
      "Detección de postura (pie/sentado)",
      "Lavado posterior, femenino y móvil",
      "Agua caliente instantánea",
      "Boquilla autolimpiable en acero inoxidable",
      "Asiento calefactado CLIMADAPT",
      "Secado en menos de 30 segundos (5 velocidades)",
      "Mando a distancia en español (2 usuarios)",
      "Rueda lateral multifunción",
      "Luz nocturna LED",
      "Cerámica rimless",
      "Tanque integrado en módulo suspendido",
      "Funcionamiento silencioso ≤59 dB",
      "Diseño flotante — suelo completamente libre",
    ],
    technical: [
      {
        group: "Instalación",
        specs: [
          { label: "Tipo", value: "Suspendida (mural)" },
          { label: "Tanque", value: "Integrado en módulo" },
          { label: "Ruido", value: "≤59 dB" },
        ],
      },
      {
        group: "Funciones",
        specs: [
          { label: "Lavados", value: "Posterior · Femenino · Móvil" },
          { label: "Temperatura agua", value: "4 niveles" },
          { label: "Secado", value: "5 velocidades" },
        ],
      },
    ],
    dimensions: [
      { label: "Instalación", value: "Suspendida (mural)" },
      { label: "Suelo", value: "Completamente libre" },
      { label: "Tanque", value: "Integrado en módulo" },
    ],
    inTheBox: ["Inodoro ESENZA Suspendido", "Módulo de instalación", "Mando a distancia", "Manual en español", "Kit de instalación suspendida"],
    installation: [
      "Instalación suspendida en pared",
      "Requiere módulo de instalación incluido",
      "Enchufe Schuko a menos de 1,2 m",
      "Instalador en 90-120 minutos",
    ],
    warranty: {
      years: 3,
      details: "10 años cerámica · 3 años tecnología (ampliable a 5 con Premium Care +249€)",
    },
    faqs: [
      { q: "¿Necesita obra?", a: "Sí, requiere instalación suspendida en pared. Es habitual en reformas de baño modernas." },
      { q: "¿Qué diferencia hay con ESENZA estándar?", a: "La instalación es suspendida (flotante), lo que libera el suelo y aporta una estética más limpia y moderna. Las funciones son idénticas." },
    ],
    price: 1690,
  },
  {
    id: "AURA-COMPACT",
    name: "Inodoro inteligente AURA compact",
    tagline: "Tecnología AURA completa en formato compacto.",
    description: "Combina tecnología y diseño compacto: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización y control por voz.",
    longDescription:
      "El inodoro inteligente AURA COMPACT combina tecnología y un diseño compacto, ofreciendo todas las ventajas como: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización, control por voz y mando, todo con eficiencia energética y ahorro de espacio. Ideal para baños con poco espacio o lugares donde quieres ganar amplitud.",
    img: "/manus-storage/inodoro_lujo_v2_a0f04654.webp",
    gallery: AURA_COMPACT_GALLERY,
    badges: ["ClimAdapt", "UV · Voz"],
    highlights: [
      { label: "ClimAdapt", value: "Sensor inteligente" },
      { label: "UV", value: "Esterilización" },
      { label: "Control", value: "Por voz" },
    ],
    pitch: [
      { title: "Sensor inteligente ClimAdapt", body: "Ajusta automáticamente la temperatura del asiento, agua y secador según la estación del año y tus preferencias." },
      { title: "Escudo de espuma higiénica", body: "Crea una barrera de espuma en el agua para evitar salpicaduras y malos olores. Más limpieza, menos esfuerzo." },
      { title: "Desodorización automática", body: "Sistema que elimina olores mediante un proceso de purificación del aire. El baño siempre huele bien." },
      { title: "Secado con aire caliente", body: "Elimina la necesidad de papel higiénico gracias a su potente secador integrado." },
      { title: "Control por voz", body: "Controla las funciones usando solo la voz (en inglés). También disponible con mando a distancia en español." },
      { title: "Ideal para toda la familia", body: "Compatible con adultos mayores, embarazadas, personas con movilidad reducida y niños." },
    ],
    features: [
      "Sensor inteligente ClimAdapt",
      "Apertura automática de tapa",
      "Lavado personal con agua tibia",
      "Secado con aire caliente",
      "Desodorización automática",
      "Asiento calefactable",
      "Escudo de espuma anti-salpicaduras",
      "Uso eficiente del agua (descarga dual)",
      "Autolimpieza de boquillas",
      "Modo nocturno con luz LED",
      "Funcionamiento silencioso",
      "Control remoto en español",
      "Control por voz (inglés)",
      "Ideal para toda la familia",
    ],
    technical: [
      {
        group: "Confort & climatización",
        specs: [
          { label: "Sensor ClimAdapt", value: "Temperatura automática" },
          { label: "Asiento calefactable", value: "Sí" },
          { label: "Lavado", value: "Agua tibia, varias posiciones" },
          { label: "Secado", value: "Aire caliente potente" },
        ],
      },
      {
        group: "Higiene & aire",
        specs: [
          { label: "Desodorización", value: "Automática" },
          { label: "Espuma anti-salpicaduras", value: "Escudo higiénico" },
          { label: "Autolimpieza boquillas", value: "Antes y después de cada uso" },
          { label: "Luz nocturna LED", value: "Sí" },
        ],
      },
      {
        group: "Control",
        specs: [
          { label: "Mando", value: "En español" },
          { label: "Control por voz", value: "Sí (inglés)" },
          { label: "Descarga", value: "Dual (completa / ecológica)" },
          { label: "Nivel sonoro", value: "Silencioso" },
        ],
      },
    ],
    dimensions: [
      { label: "Formato", value: "Compacto" },
      { label: "Instalación", value: "A suelo estándar" },
      { label: "Descarga", value: "Dual (completa / ecológica)" },
    ],
    inTheBox: [
      "Inodoro inteligente AURA Compact",
      "Mando a distancia en español",
      "Manual de instalación y uso",
      "Kit de instalación",
    ],
    installation: [
      "Instalación a suelo estándar.",
      "Solo necesitas un enchufe cerca.",
      "Tu fontanero de confianza.",
    ],
    warranty: {
      years: 5,
      details: "5 años de garantía en tecnología incluidos. 10 años en cerámica. Servicio técnico en español.",
    },
    faqs: [
      { q: "¿En qué se diferencia del AURA estándar?", a: "El AURA Compact tiene un formato más reducido, ideal para baños con poco espacio. Las funciones son las mismas que el AURA estándar." },
      { q: "¿Funciona el control por voz en español?", a: "Actualmente el control por voz está disponible solo en inglés. El mando a distancia físico está completamente en español." },
      { q: "¿La descarga automática gasta más agua?", a: "No. La descarga inteligente optimiza el consumo con dos opciones: completa y ecológica." },
      { q: "¿Es apto para personas mayores?", a: "Sí. Es compatible con adultos mayores, embarazadas, personas con movilidad reducida y niños." },
    ],
    price: 2500,
  },
  {
    id: "AURA-SUSPENDIDO",
    name: "Váter japonés AURA suspendido",
    tagline: "Todo el confort AURA en diseño flotante.",
    description: "Todo el confort del Water japonés AURA en un diseño flotante. Estética moderna y minimalista, suelo totalmente libre, altura ajustable en la instalación.",
    longDescription:
      "El váter japonés AURA suspendido ofrece todo el confort del Water japonés AURA en un diseño flotante, con una estética moderna y minimalista que deja el suelo totalmente libre para una imagen de orden y un efecto más despejado. Con el váter suspendido puedes ajustar la altura a tu gusto en el momento de la instalación.",
    img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
    gallery: AURA_SUSP_GALLERY,
    badges: ["Más vendido", "Suspendido", "Altura ajustable"],
    highlights: [
      { label: "Instalación", value: "Suspendida" },
      { label: "Suelo", value: "Totalmente libre" },
      { label: "Altura", value: "Ajustable" },
    ],
    pitch: [
      { title: "Sensor inteligente ClimAdapt", body: "Ajusta automáticamente la temperatura del asiento, agua y secador según la estación del año y tus preferencias." },
      { title: "Escudo de espuma higiénica", body: "Crea una barrera de espuma en el agua para evitar salpicaduras y malos olores." },
      { title: "Desodorización automática", body: "Sistema que elimina olores mediante un proceso de purificación del aire." },
      { title: "Diseño flotante", body: "El suelo queda totalmente libre, dando una imagen de orden y un efecto más despejado. Más fácil de limpiar." },
      { title: "Altura ajustable", body: "Puedes ajustar la altura del váter a tu gusto en el momento de la instalación." },
      { title: "Control por voz", body: "Controla las funciones usando solo la voz (en inglés). También disponible con mando a distancia en español." },
    ],
    features: [
      "Sensor inteligente ClimAdapt",
      "Lavado personal con agua tibia",
      "Secado con aire caliente",
      "Desodorización automática",
      "Asiento calefactable",
      "Escudo de espuma anti-salpicaduras",
      "Uso eficiente del agua (descarga dual)",
      "Autolimpieza de boquillas",
      "Modo nocturno con luz LED",
      "Funcionamiento silencioso",
      "Control remoto en español",
      "Control por voz (inglés)",
      "Diseño suspendido — suelo totalmente libre",
      "Altura ajustable en instalación",
      "Ideal para toda la familia",
    ],
    technical: [
      {
        group: "Confort & climatización",
        specs: [
          { label: "Sensor ClimAdapt", value: "Temperatura automática" },
          { label: "Asiento calefactable", value: "Sí" },
          { label: "Lavado", value: "Agua tibia, varias posiciones" },
          { label: "Secado", value: "Aire caliente potente" },
        ],
      },
      {
        group: "Higiene & aire",
        specs: [
          { label: "Desodorización", value: "Automática" },
          { label: "Espuma anti-salpicaduras", value: "Escudo higiénico" },
          { label: "Autolimpieza boquillas", value: "Antes y después de cada uso" },
          { label: "Luz nocturna LED", value: "Sí" },
        ],
      },
      {
        group: "Instalación & control",
        specs: [
          { label: "Tipo", value: "Suspendida (flotante)" },
          { label: "Altura", value: "Ajustable en instalación" },
          { label: "Mando", value: "En español" },
          { label: "Descarga", value: "Dual (completa / ecológica)" },
        ],
      },
    ],
    dimensions: [
      { label: "Instalación", value: "Suspendida (flotante)" },
      { label: "Altura", value: "Ajustable" },
      { label: "Suelo", value: "Totalmente libre" },
      { label: "Descarga", value: "Dual (completa / ecológica)" },
    ],
    inTheBox: [
      "Váter japonés AURA Suspendido",
      "Módulo de instalación suspendida",
      "Mando a distancia en español",
      "Manual de instalación y uso",
      "Kit de instalación suspendida",
    ],
    installation: [
      "Instalación suspendida en pared.",
      "Altura ajustable en el momento de la instalación.",
      "Requiere instalador especializado.",
      "Solo necesitas un enchufe cerca.",
    ],
    warranty: {
      years: 5,
      details: "5 años de garantía en tecnología. 10 años en cerámica. Servicio técnico en español.",
    },
    faqs: [
      { q: "¿En qué se diferencia del AURA Compact?", a: "El AURA Suspendido tiene el mismo equipamiento que el AURA estándar pero en formato flotante. El suelo queda completamente libre y la altura es ajustable." },
      { q: "¿Puedo ajustar la altura?", a: "Sí. Puedes ajustar la altura del váter a tu gusto en el momento de la instalación." },
      { q: "¿Necesita obra?", a: "Sí, requiere instalación suspendida en pared. Es habitual en reformas de baño modernas." },
      { q: "¿Funciona el control por voz en español?", a: "Actualmente el control por voz está disponible solo en inglés. El mando a distancia físico está completamente en español." },
    ],
    price: 2600,
  },
  {
    id: "AURA",
    name: "Water japonés AURA",
    tagline: "La experiencia AURA completa.",
    description: "El inodoro inteligente más completo de ELORA SMART. Disponible en 3 colores de display: Gris y Negro, Blanco y Gris.",
    longDescription: "El water japonés AURA ofrece higiene y confort con funciones como apertura automática, asiento climatizado, lavado ajustable, secado, esterilización con rayos UV y aromaterapia. Con control remoto en español, memoria de usuarios y un diseño moderno. Transforma tu baño en un espacio inteligente y relajante, ideal para todas las edades.",
    img: "https://elorasmart.com/wp-content/uploads/2025/05/inodoro-aura.jpg",
    gallery: AURA_GALLERY,
    badges: ["3 colores", "UV + Aromaterapia"],
    highlights: [
      { label: "Display", value: "3 colores" },
      { label: "UV", value: "Esterilización" },
      { label: "Aromaterapia", value: "Integrada" },
    ],
    pitch: [
      { title: "Sensor ClimAdapt", body: "Ajusta automáticamente la temperatura del asiento, agua y secador según la estación del año y tus preferencias." },
      { title: "Esterilización UV", body: "Lámpara UV que desinfecta por completo. Desodorización automática del ambiente. Siempre limpio." },
      { title: "Aromaterapia integrada", body: "Cada hora libera una fragancia delicada. Mini SPA personal con terapia de calor por infrarrojos." },
    ],
    features: [
      "Sensor inteligente ClimAdapt",
      "Apertura automática de tapa",
      "Lavado personal con agua tibia",
      "Secado con aire caliente",
      "Desodorización automática",
      "Asiento calefactable",
      "Aromaterapia integrada",
      "Escudo de espuma anti-salpicaduras",
      "Esterilización UV ultravioleta",
      "Terapia de calor por infrarrojos",
      "Descarga dual eficiente",
      "Autolimpieza de boquillas",
      "Modo nocturno con luz LED",
      "Control remoto en español",
      "Control por voz (inglés)",
      "Disponible en 3 colores de display",
    ],
    technical: [
      {
        group: "Funciones premium",
        specs: [
          { label: "UV", value: "Esterilización ultravioleta" },
          { label: "Aromaterapia", value: "Sí (cada hora)" },
          { label: "Infrarrojos", value: "Terapia de calor" },
          { label: "Espuma", value: "Escudo anti-salpicaduras" },
        ],
      },
      {
        group: "Control",
        specs: [
          { label: "Mando", value: "En español" },
          { label: "Voz", value: "Sí (inglés)" },
          { label: "Display", value: "Gris/Negro · Blanco · Gris" },
        ],
      },
    ],
    dimensions: [
      { label: "Colores display", value: "Gris y Negro / Blanco / Gris" },
      { label: "Instalación", value: "A suelo estándar" },
    ],
    inTheBox: ["Inodoro AURA", "Mando a distancia", "Manual en español", "Kit de instalación"],
    installation: [
      "Instalación a suelo estándar",
      "Solo necesitas un enchufe cerca",
      "Tu fontanero de confianza",
    ],
    warranty: {
      years: 5,
      details: "5 años tecnología · 10 años cerámica",
    },
    faqs: [
      { q: "¿En qué se diferencia del AURA Compact?", a: "El AURA estándar tiene mayor tamaño y añade aromaterapia, terapia de calor por infrarrojos y está disponible en 3 colores de display." },
      { q: "¿Puedo elegir el color del display?", a: "Sí. Disponible en Gris y Negro, Blanco y Gris. Se elige en el momento del pedido." },
    ],
    price: 2500,
  },
];

// Los 3 productos destacados para la home
export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(p =>
  ["ESENZA", "AURA-COMPACT", "AURA-SUSPENDIDO"].includes(p.id)
);

// ─── Productos localizados ────────────────────────────────────────────────────
import { getProductLocale } from "@/i18n/products";

/**
 * Devuelve ALL_PRODUCTS con los textos (name, tagline, description,
 * longDescription, badges, highlights, pitch, features, technical,
 * dimensions, inTheBox, installation, warranty.details, faqs) en el
 * idioma solicitado. Los datos no-textuales (img, gallery, price, etc.)
 * se mantienen del catálogo base.
 */
export function getLocalizedProducts(lang: string): Product[] {
  return ALL_PRODUCTS.map(p => {
    const loc = getProductLocale(p.id, lang);
    if (!loc) return p;
    return {
      ...p,
      name: loc.name,
      tagline: loc.tagline,
      description: loc.description,
      longDescription: loc.longDescription,
      badges: loc.badges,
      highlights: loc.highlights,
      pitch: loc.pitch,
      features: loc.features,
      technical: loc.technical,
      dimensions: loc.dimensions,
      inTheBox: loc.inTheBox,
      installation: loc.installation,
      warranty: { ...p.warranty, details: loc.warrantyDetails },
      faqs: loc.faqs,
    };
  });
}

export function getLocalizedFeatured(lang: string): Product[] {
  return getLocalizedProducts(lang).filter(p =>
    ["ESENZA", "AURA-COMPACT", "AURA-SUSPENDIDO"].includes(p.id)
  );
}
