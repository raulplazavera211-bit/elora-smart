import type { Product } from "@/components/ProductDetail";

// ─── Galerías ─────────────────────────────────────────────────────────────────
const ESENZA_GALLERY = [
  "/manus-storage/esenza-main_7db64882.png",
  "/manus-storage/ESENZa-12_b3dd228d.webp",
  "/manus-storage/ESENZA-9_70e448e2.webp",
  "/manus-storage/ESENZA-10_b08075fa.webp",
  "/manus-storage/ESENZA-7_f5ab967b.webp",
  "/manus-storage/ESENZA-8_5a6baa87.webp",
  "/manus-storage/ESENZA-2_af433520.webp",
  "/manus-storage/ESENZA-11_da6d1cbb.webp",
];

const AURA_COMPACT_GALLERY = [
  "/manus-storage/AURA-compact-p-800x800_597da236.jpg",
  "/manus-storage/aura-compact-1_1b4aadd9.jpg",
  "/manus-storage/aura-compact-11_0852f604.jpg",
  "/manus-storage/aura-compact-6_2af3f2ac.jpg",
  "/manus-storage/aura-compact-10_eff13988.jpg",
  "/manus-storage/aura-compact-8_eceb1cbb.jpg",
  "/manus-storage/aura-compact-3_bd7e50b6.jpg",
];

const AURA_SUSP_GALLERY = [
  "/manus-storage/aura-suspendido-v3_9a4f47aa.png",
  "/manus-storage/aura-suspendido1_e7c19dd4.jpg",
  "/manus-storage/aura-suspendido-2_0c11bedb.jpg",
  "/manus-storage/aura-suspendido-3_a85c6741.jpg",
  "/manus-storage/aura-suspendido-111_0aba49d6.jpg",
  "/manus-storage/aura-suspendido-9_f2122b99.jpg",
  "/manus-storage/aura-suspendido-6_d2e510a8.jpg",
];

const ESENZA_COMPACT_GALLERY = [
  "/manus-storage/Clipboard_0_D4A653F1_4c49e12c.png",
  "/manus-storage/esenza-compact-2_6a5ecb63.jpg",
  "/manus-storage/esenza-compact-3_af2323bc.jpg",
  "/manus-storage/esenza-compact-4_f75e6287.jpg",
  "/manus-storage/esenza-compact-5_4b470e16.jpg",
  "/manus-storage/esenza-compact-6_b65076a8.jpg",
  "/manus-storage/esenza-compact-7_3dea5eaf.jpg",
  "/manus-storage/esenza-compact-8_208f6452.jpg",
  "/manus-storage/esenza-compact-9_1026b0e1.jpg",
  "/manus-storage/esenza-compact-10_8bdc6de5.jpg",
  "/manus-storage/esenza-compact-11_c3f91d64.jpg",
];

const ESENZA_SUSP_GALLERY = [
  "/manus-storage/esenza-suspendido-1_472bd803.jpg",
  "/manus-storage/esenza-suspendido-2_6528abc5.jpg",
  "/manus-storage/esenza-suspendido-3_8de7a007.jpg",
  "/manus-storage/esenza-suspendido-4_8a048cf4.jpg",
  "/manus-storage/esenza-suspendido-5_299a6ccc.jpg",
  "/manus-storage/esenza-suspendido-6_c0bd94b2.jpg",
  "/manus-storage/esenza-suspendido-7_36df7098.jpg",
  "/manus-storage/esenza-suspendido-8_79ae6792.jpg",
];

const AURA_GALLERY = [
  "/manus-storage/inodoro-aura_4c9492ae.jpg",
  "/manus-storage/aura-elorasmart7-scaled_9b6de14c.jpg",
  "/manus-storage/aura-elorasmart6_394ec9d0.jpg",
  "/manus-storage/aura-elorasmart5_4d4349ff.jpg",
  "/manus-storage/aura-elorasmart3_3c10af0e.jpg",
  "/manus-storage/aura-elorasmart2_26f388f7.jpg",
  "/manus-storage/aura-elorasmart-scaled_0b6e65dc.jpg",
  "/manus-storage/AURA-BLANCO-2-scaled_95299e91.jpg",
  "/manus-storage/AURA-BLANCO-3-scaled_736949ee.jpg",
  "/manus-storage/AURA-BLANCO-6-scaled_85d2c447.jpg",
];

const THALOS_SUSP_GALLERY = [
  "/manus-storage/12_22ba2ae7.jpeg",
  "/manus-storage/1_583ff2d7.jpeg",
  "/manus-storage/2_5a5ce514.jpeg",
  "/manus-storage/3_6d0f3b99.jpeg",
  "/manus-storage/5_284bacd8.jpeg",
  "/manus-storage/6_1b90070b.jpeg",
  "/manus-storage/7_2216bf4a.jpeg",
  "/manus-storage/8_4c521920.jpeg",
  "/manus-storage/9_7549d2c7.jpeg",
  "/manus-storage/10_87b707cd.jpeg",
  "/manus-storage/11_656c3cd4.jpeg",
];

// ─── Catálogo completo ────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Product[] = [
  // ── ESENZA ────────────────────────────────────────────────────────────────
  {
    id: "ESENZA",
    name: "Inodoro inteligente ESENZA",
    tagline: "El inodoro inteligente japonés a suelo de ELORA SMART.",
    description: "Ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación.",
    longDescription:
      "ESENZA a suelo es el inodoro inteligente japonés de ELORA SMART, ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Mantiene todas las funciones esenciales de la gama ESENZA con instalación sencilla, máxima estabilidad y un diseño de líneas limpias para baños modernos. Incluye 10 años de garantía en la cerámica y 3 años en la tecnología, ampliables a 5 años con ELORA Premium Care.",
    img: "/manus-storage/esenza-main_7db64882.png",
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
    visibleRegions: ["europe"],
    priceUsd: 2900,
  },

  // ── AURA-COMPACT ──────────────────────────────────────────────────────────
  {
    id: "AURA-COMPACT",
    name: "Inodoro inteligente AURA compact",
    tagline: "Tecnología AURA completa en formato compacto.",
    description: "Combina tecnología y diseño compacto: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización y control por voz.",
    longDescription:
      "El inodoro inteligente AURA COMPACT combina tecnología y un diseño compacto, ofreciendo todas las ventajas como: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización, control por voz y mando, todo con eficiencia energética y ahorro de espacio. Ideal para baños con poco espacio o lugares donde quieres ganar amplitud.",
    img: "/manus-storage/inodoro_lujo_v2_81e05275.webp",
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
    visibleRegions: ["europe", "world"],
    priceUsd: 3800,
  },

  // ── AURA-SUSPENDIDO ───────────────────────────────────────────────────────
  {
    id: "AURA-SUSPENDIDO",
    name: "Inodoro inteligente AURA suspendido",
    tagline: "Todo el confort AURA en diseño flotante.",
    description: "Todo el confort del Inodoro inteligente AURA en un diseño flotante. Estética moderna y minimalista, suelo totalmente libre, altura ajustable en la instalación.",
    longDescription:
      "El inodoro inteligente AURA suspendido ofrece todo el confort del Inodoro inteligente AURA en un diseño flotante, con una estética moderna y minimalista que deja el suelo totalmente libre para una imagen de orden y un efecto más despejado. Con el inodoro suspendido puedes ajustar la altura a tu gusto en el momento de la instalación.",
    img: "/manus-storage/aura-suspendido-v3_9a4f47aa.png",
    gallery: AURA_SUSP_GALLERY,
    badges: ["Suspendido", "Altura ajustable"],
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
      "Inodoro inteligente AURA suspendido",
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
    visibleRegions: ["europe", "world"],
    priceUsd: 3800,
  },

  // ── ESENZA-COMPACT ────────────────────────────────────────────────────────
  {
    id: "ESENZA-COMPACT",
    name: "Inodoro inteligente ESENZA compact",
    tagline: "Todas las funciones en fondo reducido.",
    description: "El inodoro inteligente japonés de fondo reducido. Optimiza cada centímetro sin renunciar a ninguna función.",
    longDescription: "ESENZA COMPACT es el inodoro inteligente compacto de ELORA SMART, pensado para ganar espacio en baños pequeños, reformas y obra nueva. Su diseño más corto y totalmente pegado a la pared optimiza cada centímetro, manteniendo las funciones esenciales de ESENZA —lavado con agua, secado, asiento calefactado y automatización— en un formato más estilizado.",
    img: "/manus-storage/Clipboard_0_D4A653F1_4c49e12c.png",
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
    visibleRegions: ["europe", "world"],
    priceUsd: 2900,
  },

  // ── ESENZA-SUSPENDIDO ─────────────────────────────────────────────────────
  {
    id: "ESENZA-SUSPENDIDO",
    name: "Inodoro inteligente ESENZA suspendido",
    tagline: "Diseño flotante con funciones esenciales.",
    description: "El inodoro inteligente japonés flotante de ELORA SMART. Libera el suelo y aporta una estética minimalista y contemporánea.",
    longDescription: "ESENZA Suspendido es el inodoro inteligente japonés flotante de ELORA SMART, diseñado para baños modernos que buscan un acabado más limpio, minimalista y elevado del suelo. Su instalación suspendida facilita la limpieza, libera espacio visual y mantiene todas las funciones esenciales de la gama ESENZA con un diseño más ligero y contemporáneo.",
    img: "/manus-storage/esenza-suspendido-1_472bd803.jpg",
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
    visibleRegions: ["europe", "world"],
    priceUsd: 2900,
  },

  // ── AURA ──────────────────────────────────────────────────────────────────
  {
    id: "AURA",
    name: "Inodoro inteligente AURA",
    tagline: "La experiencia AURA completa.",
    description: "El inodoro inteligente más completo de ELORA SMART. Disponible en 3 colores de display: Gris y Negro, Blanco y Gris.",
    longDescription: "El inodoro inteligente AURA ofrece higiene y confort con funciones como apertura automática, asiento climatizado, lavado ajustable, secado, esterilización con rayos UV y aromaterapia. Con control remoto en español, memoria de usuarios y un diseño moderno. Transforma tu baño en un espacio inteligente y relajante, ideal para todas las edades.",
    img: "/manus-storage/inodoro-aura_4c9492ae.jpg",
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
    visibleRegions: ["europe", "world"],
    priceUsd: 3800,
  },

  // ── THALOS-SUSPENDIDO ─────────────────────────────────────────────────────
  {
    id: "THALOS-SUSPENDIDO",
    name: "Inodoro inteligente THALOS suspendido",
    tagline: "La nueva generación de inodoros inteligentes, suspendida.",
    description: "El inodoro inteligente THALOS suspendido: tecnología de próxima generación en formato flotante. Diseño minimalista, funciones avanzadas y máxima higiene.",
    longDescription: "THALOS SUSPENDIDO es la nueva colección de ELORA SMART, diseñada para usuarios que buscan lo mejor en tecnología, diseño y sostenibilidad. En formato suspendido (flotante), combina automatización inteligente, higiene superior con agua y aire, y un diseño minimalista que transforma cualquier baño. Incluye 10 años de garantía en cerámica y 3 años en tecnología, ampliables a 5 años con ELORA Premium Care.",
    img: "/manus-storage/12_22ba2ae7.jpeg",
    gallery: THALOS_SUSP_GALLERY,
    badges: ["Nueva colección", "Suspendido"],
    highlights: [
      { label: "Formato", value: "Suspendido" },
      { label: "Secado", value: "< 30 segundos" },
      { label: "Garantía", value: "10 años cerámica" },
    ],
    pitch: [
      { title: "Diseño minimalista flotante", body: "Formato suspendido que libera completamente el suelo. Líneas puras y elegantes que transforman el baño en un espacio de bienestar." },
      { title: "Automatización inteligente", body: "Apertura, cierre y descarga automáticos. Sensor de pie integrado y detección de postura. Todo sin tocar nada." },
      { title: "Higiene completa con agua", body: "Sistema de lavado triple: posterior, femenino y móvil. Agua caliente instantánea. Boquilla autolimpiable en acero inoxidable con autolimpieza antes y después de cada uso." },
      { title: "Secado Súper-Tifón", body: "Secado completo en menos de 30 segundos. Ajustable en 5 velocidades y 4 temperaturas. Experiencia 100% sin papel." },
      { title: "Asiento CLIMADAPT", body: "Regula la temperatura del asiento según el ambiente. Niveles: Natural, 33°C, 37°C, 39°C. Material antibacteriano y amable con la piel." },
      { title: "Desinfección UV constante", body: "Sistema de luz ultravioleta interna que desinfecta automáticamente la cánula y zonas críticas entre usos. Higiene silenciosa y programada." },
    ],
    features: [
      "Apertura, cierre y descarga automáticos",
      "Sensor de pie integrado",
      "Detección de postura (pie/sentado)",
      "Lavado posterior, femenino y móvil",
      "Agua caliente instantánea (4 temperaturas)",
      "Boquilla autolimpiable en acero inoxidable",
      "Masaje SPA con oscilación 15mm",
      "Asiento calefactado CLIMADAPT",
      "Secado en menos de 30 segundos (5 velocidades)",
      "Desinfección UV automática",
      "Escudo de espuma y desodorización",
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
          { label: "Formato", value: "Suspendido (flotante)" },
          { label: "Tanque", value: "5 litros integrado" },
          { label: "Ruido", value: "≤59 dB" },
        ],
      },
      {
        group: "Funciones de higiene",
        specs: [
          { label: "Lavados", value: "Posterior · Femenino · Móvil" },
          { label: "Temperatura agua", value: "Natural, 33°C, 37°C, 39°C" },
          { label: "Presión agua", value: "3 niveles" },
          { label: "Secado", value: "5 velocidades · 4 temperaturas" },
        ],
      },
      {
        group: "Automatización",
        specs: [
          { label: "Apertura/cierre", value: "Automático por proximidad" },
          { label: "Descarga", value: "Automática + manual" },
          { label: "Detección", value: "Postura (pie/sentado)" },
        ],
      },
      {
        group: "Control",
        specs: [
          { label: "Mando", value: "En español" },
          { label: "Voz", value: "Sí (inglés)" },
          { label: "Usuarios", value: "Hasta 2 perfiles" },
        ],
      },
    ],
    dimensions: [
      { label: "Instalación", value: "Suspendida (flotante)" },
      { label: "Altura", value: "Ajustable en instalación" },
      { label: "Suelo", value: "Totalmente libre" },
      { label: "Descarga", value: "Dual (completa / ecológica)" },
    ],
    inTheBox: [
      "Inodoro inteligente THALOS suspendido",
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
      { q: "¿Cuál es la diferencia entre THALOS y AURA?", a: "THALOS es la nueva generación de ELORA SMART. Incluye desinfección UV automática, mejor sistema de secado y diseño más minimalista. Ambos están disponibles en formato suspendido." },
      { q: "¿Puedo ajustar la altura?", a: "Sí. Puedes ajustar la altura del váter a tu gusto en el momento de la instalación." },
      { q: "¿Necesita obra?", a: "Sí, requiere instalación suspendida en pared. Es habitual en reformas de baño modernas." },
      { q: "¿Funciona fuera de Europa?", a: "Sí. THALOS está disponible para mercados internacionales con adaptaciones de voltaje y certificaciones locales." },
    ],
    price: 2600,
    visibleRegions: ["world"],
    priceUsd: 2600,
  },
];

// ─── Helpers de localización ──────────────────────────────────────────────────

/**
 * Devuelve todos los productos. El parámetro lang se reserva para
 * futuras traducciones; por ahora todos los textos están en español.
 */
export function getLocalizedProducts(_lang?: string): Product[] {
  return ALL_PRODUCTS;
}

/**
 * Devuelve los productos destacados para la Home (los 3 primeros:
 * ESENZA, AURA-COMPACT, AURA-SUSPENDIDO).
 */
export function getLocalizedFeatured(_lang?: string): Product[] {
  return ALL_PRODUCTS.slice(0, 3);
}
