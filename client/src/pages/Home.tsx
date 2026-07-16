import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ArrowRight, Droplets, Leaf, Cpu, Sparkles,
  ShieldCheck, Thermometer, ShoppingBag, MapPin, Wrench, Phone, Mail, Send, Check
} from "lucide-react";
import { ProductDetail, type Product } from "@/components/ProductDetail";
import { MapView } from "@/components/Map";
import { TypewriterText } from "@/components/TypewriterText";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { useLocation } from "wouter";
import { getLocalizedFeatured, getLocalizedProducts } from "@/lib/products";
import { ReviewsSection } from "@/components/ReviewsSection";
import TeamSection from "@/components/TeamSection";
import SpainDistributorsMap from "@/components/SpainDistributorsMap";
import { REVIEWS, AVATAR_COLORS } from "@/lib/reviews";
import { CartPanel } from "@/components/CartPanel";
import { PremiumCareModal } from "@/components/PremiumCareModal";
import { useCart } from "@/contexts/CartContext";
import { LanguageSwitcher, LanguageDetectionBanner } from "@/components/LanguageSwitcher";

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_URL = "/manus-storage/elora_200_6f84beaa.png";
const HERO_IMAGE = "/manus-storage/esenza2-800x800_759c0894.jpg";

const PRODUCT_IMAGES: Record<string, string> = {
  "ESENZA": "/manus-storage/esenza2-800x800_759c0894.jpg",
  "AURA-COMPACT": "/manus-storage/inodoro_lujo_v2_a0f04654.webp",
  "AURA-SUSPENDIDO": "/manus-storage/AURA-suspendido-p-800x800_d9689cec.jpg",
};
// SECTIONS se genera dinámicamente con i18n dentro del componente

const ESENZA_GALLERY = [
  "/manus-storage/esenza2-800x800_759c0894.jpg",
  "/manus-storage/ESENZa-12_d6ee1106.webp",
  "/manus-storage/ESENZA-9_0d209077.webp",
  "/manus-storage/ESENZA-10_7acf0307.webp",
  "/manus-storage/ESENZA-7_e866e071.webp",
  "/manus-storage/ESENZA-8_dce78a4d.webp",
  "/manus-storage/ESENZA-2_f12f8e70.webp",
  "/manus-storage/ESENZA-11_ed0aab7f.webp",
];

const AURA_COMPACT_GALLERY = [
  "/manus-storage/AURA-compact-p-800x800_fbe86644.jpg",
  "/manus-storage/aura-compact-1_7543b556.jpg",
  "/manus-storage/aura-compact-11_a212d210.jpg",
  "/manus-storage/aura-compact-6_a3f2c15c.jpg",
  "/manus-storage/aura-compact-10_287cc5b7.jpg",
  "/manus-storage/aura-compact-8_1e63cc34.jpg",
  "/manus-storage/aura-compact-3_07a38eef.jpg",
];

const AURA_SUSP_GALLERY = [
  "/manus-storage/AURA-suspendido-p-800x800_d9689cec.jpg",
  "/manus-storage/aura-suspendido1_6aabbd7f.jpg",
  "/manus-storage/aura-suspendido-2_ce860add.jpg",
  "/manus-storage/aura-suspendido-3_8aca979d.jpg",
  "/manus-storage/aura-suspendido-111_c50b43cf.jpg",
  "/manus-storage/aura-suspendido-9_4a44a893.jpg",
  "/manus-storage/aura-suspendido-6_eaa179cb.jpg",
];

// ─── Datos de productos ────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "ESENZA",
    name: "Inodoro inteligente ESENZA",
    tagline: "El inodoro inteligente japonés a suelo de ELORA SMART.",
    description: "Ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación.",
    longDescription:
      "ESENZA a suelo es el inodoro inteligente japonés de ELORA SMART, ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Mantiene todas las funciones esenciales de la gama ESENZA con instalación sencilla, máxima estabilidad y un diseño de líneas limpias para baños modernos. Incluye 10 años de garantía en la cerámica y 3 años en la tecnología, ampliables a 5 años con ELORA Premium Care.",
    img: "/manus-storage/esenza2-800x800_759c0894.jpg",
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
    price: 1341,
    originalPrice: 1490,
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
    price: 1990,
    originalPrice: 2500,
  },
  {
    id: "AURA-SUSPENDIDO",
    name: "Inodoro inteligente AURA suspendido",
    tagline: "Todo el confort AURA en diseño flotante.",
    description: "Todo el confort del Inodoro inteligente AURA en un diseño flotante. Estética moderna y minimalista, suelo totalmente libre, altura ajustable en la instalación.",
    longDescription:
      "El inodoro inteligente AURA suspendido ofrece todo el confort del Inodoro inteligente AURA en un diseño flotante, con una estética moderna y minimalista que deja el suelo totalmente libre para una imagen de orden y un efecto más despejado. Con el inodoro suspendido puedes ajustar la altura a tu gusto en el momento de la instalación.",
    img: "/manus-storage/AURA-suspendido-p-800x800_d9689cec.jpg",
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
          { label: "Control por voz", value: "Sí (inglés)" },
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
        price: 2080,
    originalPrice: 2600,
  },
];
// ─── Galerías productos nuevos ───────────────────────────────────────────────
const ESENZA_COMPACT_GALLERY = [
  "/manus-storage/batch_5_53c917c7.webp",
  "/manus-storage/batch_1_109bf079.webp",
  "/manus-storage/batch_2_4df211a9.webp",
  "/manus-storage/batch_10_abcfd796.webp",
  "/manus-storage/batch_9_62fb25c3.webp",
  "/manus-storage/batch_8_d1e90e07.webp",
  "/manus-storage/batch_6_8fbcdb77.webp",
  "/manus-storage/batch_7_5d443355.webp",
  "/manus-storage/batch_11_291c444b.webp",
];

const ESENZA_SUSP_GALLERY = [
  "/manus-storage/batch_4-1_78792862.webp",
  "/manus-storage/batch_2-1_532f500d.webp",
  "/manus-storage/batch_6-1_4bb05c49.webp",
  "/manus-storage/batch_7-1_6d65febd.webp",
  "/manus-storage/batch_5-1_f87ff88f.webp",
  "/manus-storage/batch_8-1_dc449f6d.webp",
];

const AURA_GALLERY = [
  "/manus-storage/inodoro-aura_d094b1e7.jpg",
  "/manus-storage/aura-elorasmart7-scaled_abd185af.jpg",
  "/manus-storage/aura-elorasmart6_78e99a28.jpg",
  "/manus-storage/aura-elorasmart5_57bea580.jpg",
  "/manus-storage/aura-elorasmart3_0cc520b5.jpg",
  "/manus-storage/aura-elorasmart2_3a56defa.jpg",
  "/manus-storage/aura-elorasmart-scaled_c27dd2d5.jpg",
  "/manus-storage/AURA-BLANCO-2-scaled_b64623c3.jpg",
  "/manus-storage/AURA-BLANCO-3-scaled_9ded939e.jpg",
  "/manus-storage/AURA-BLANCO-6-scaled_23a236c7.jpg",
];

// ─── Productos nuevos ─────────────────────────────────────────────────────────
const EXTRA_PRODUCTS: Product[] = [
  {
    id: "ESENZA-COMPACT",
    name: "Inodoro inteligente ESENZA compact",
    tagline: "Todas las funciones en fondo reducido.",
    description: "El inodoro inteligente japonés de fondo reducido. Optimiza cada centímetro sin renunciar a ninguna función.",
    longDescription: "ESENZA COMPACT es el inodoro inteligente compacto de ELORA SMART, pensado para ganar espacio en baños pequeños, reformas y obra nueva. Su diseño más corto y totalmente pegado a la pared optimiza cada centímetro, manteniendo las funciones esenciales de ESENZA —lavado con agua, secado, asiento calefactado y automatización— en un formato más estilizado.",
    img: "/manus-storage/batch_5_53c917c7.webp",
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
    price: 1431,
    originalPrice: 1590,
  },
  {
    id: "ESENZA-SUSPENDIDO",
    name: "Inodoro inteligente ESENZA suspendido",
    tagline: "Diseño flotante con funciones esenciales.",
    description: "El inodoro inteligente japonés flotante de ELORA SMART. Libera el suelo y aporta una estética minimalista y contemporánea.",
    longDescription: "ESENZA Suspendido es el inodoro inteligente japonés flotante de ELORA SMART, diseñado para baños modernos que buscan un acabado más limpio, minimalista y elevado del suelo. Su instalación suspendida facilita la limpieza, libera espacio visual y mantiene todas las funciones esenciales de la gama ESENZA con un diseño más ligero y contemporáneo.",
    img: "/manus-storage/batch_4-1_78792862.webp",
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
    price: 1521,
    originalPrice: 1690,
  },
  {
    id: "AURA",
    name: "Inodoro inteligente AURA",
    tagline: "La experiencia AURA completa.",
    description: "El inodoro inteligente más completo de ELORA SMART. Disponible en 3 colores de display: Gris y Negro, Blanco y Gris.",
    longDescription: "El inodoro inteligente AURA ofrece higiene y confort con funciones como apertura automática, asiento climatizado, lavado ajustable, secado, esterilización con rayos UV y aromaterapia. Con control remoto en español, memoria de usuarios y un diseño moderno. Transforma tu baño en un espacio inteligente y relajante, ideal para todas las edades.",
    img: "/manus-storage/inodoro-aura_d094b1e7.jpg",
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
        price: 1875,
    originalPrice: 2500,
  },
];
// HOME_PRODUCTS_FALLBACK se genera dinámicamente según el idioma en el componente

// ─── Tipos ─────────────────────────────────────────────────────────────────────
// CartItem importado desde @/components/CartPanel

// ─── EsenciaCarousel ─────────────────────────────────────────────────────────────────
const ESENCIA_CARDS = [
  { icon: MapPin, title: "Showroom en Galicia", body: "Ven y pruébalo. Te enamorarás y entenderás por qué cambia tu día a día.", accent: "#d97706" },
  { icon: ShieldCheck, title: "10 años de garantía", body: "Te asesoramos antes, durante y después. Para que aciertes y estés tranquilo.", accent: "#d97706" },
  { icon: Wrench, title: "Instalación sencilla", body: "Solo necesitas un enchufe cerca y a tu fontanero de confianza. Nada más.", accent: "#d97706" },
  { icon: Sparkles, title: "Higiene real", body: "Agua templada, boquilla autolimpiable y secado en 30 segundos. Sin papel.", accent: "#d97706" },
];

function EsenciaCarousel() {
  const { t } = useTranslation();
  const ICONS = [MapPin, ShieldCheck, Wrench, Sparkles];
  const cards = (t('esenciaCards', { returnObjects: true }) as Array<{title:string;body:string}>).map((c, i) => ({ ...c, icon: ICONS[i], accent: '#d97706' }));
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % cards.length), 2800);
    return () => clearInterval(timer);
  }, [cards.length]);
  const card = cards[active];
  const Icon = card.icon;
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 overflow-hidden bg-foreground text-background">
      {/* Luz de fondo */}
      <motion.div
        key={active + '-glow'}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.25, scale: 1.4 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${card.accent} 0%, transparent 70%)` }}
      />
      {/* Icono */}
      <motion.div
        key={active + '-icon'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className="w-7 h-7" style={{ color: card.accent }} />
      </motion.div>
      {/* Texto */}
      <motion.div
        key={active + '-text'}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="relative z-10"
      >
        <h3 className="font-display text-lg uppercase tracking-wide leading-tight text-background mb-1.5">{card.title}</h3>
        <p className="font-body text-[11px] leading-relaxed text-background/55">{card.body}</p>
      </motion.div>
      {/* Indicadores */}
      <div className="flex gap-1.5 mt-3">
        {cards.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="h-[3px] rounded-full transition-all duration-500 cursor-pointer"
            style={{ width: i === active ? 20 : 8, background: i === active ? card.accent : 'rgba(var(--background), 0.2)' }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── ExperienceSection ─────────────────────────────────────────────────────────────────
const EXPERIENCE_STEPS = [
  { number: "01", eyebrow: "En el instante en que te acercas", title: "La tapa se levanta automáticamente", subtitle: "para ti", body: "Un sensor detecta tu presencia y levanta la tapa antes de que llegues. Sin tocar nada. Sin esfuerzo. El inodoro ya sabe que estás ahí.", image: "/manus-storage/Aperturaautomatica_f34ea22b.png", tag: "Sensor de presencia" },
  { number: "02", eyebrow: "De pie o sentado", title: "Detecta tu postura", subtitle: "y lo resuelve al instante", body: "Reconoce si estás de pie o sentado y ajusta el comportamiento: apertura de asiento, tipo de descarga y cierre de tapa. Más comodidad, menos gestos.", image: "/manus-storage/SENSORPIE_42f0af9c.png", tag: "Detección de postura" },
  { number: "03", eyebrow: "Asiento CLIMADAPT", title: "Calefacción integrada", subtitle: "ajustable en 4 temperaturas", body: "El asiento se adapta automáticamente a la temperatura ambiente. Natural, 33°C, 37°C o 39°C. Nunca más el contacto frío de la cerámica al amanecer.", image: "/manus-storage/Asientocalefactado_09919c3c.png", tag: "CLIMADAPT" },
  { number: "04", eyebrow: "Higiene completa con agua", title: "Lavado posterior, femenino y móvil", subtitle: "temperatura y presión ajustables", body: "Agua caliente instantánea. Boquilla autolimpiable en acero inoxidable. Tres modos de lavado personalizables. La higiene que el papel nunca puede dar.", image: "/manus-storage/ESENZA-4_71482d4a.webp", tag: "Sistema de lavado triple" },
  { number: "05", eyebrow: "Secado Súper-Tifón", title: "En menos de 30 segundos", subtitle: "temperatura y velocidad ajustables", body: "Un chorro de aire de alto rendimiento seca completamente en menos de 30 segundos. 5 velocidades, 4 temperaturas. La realidad de un inodoro sin papel.", image: "/manus-storage/secadorapido_3d9e137d.png", tag: "Sin papel" },
  { number: "06", eyebrow: "Escudo de espuma higiénica", title: "Previene las salpicaduras", subtitle: "y bloquea olores", body: "Antes de cada uso, el inodoro crea una barrera de espuma en el agua. Evita salpicaduras, neutraliza olores y mantiene la cerámica más limpia.", image: "/manus-storage/Antisalpicadura_9602f0f4.png", tag: "Escudo de espuma" },
  { number: "07", eyebrow: "Lámpara esterilizadora UV", title: "Desinfecta por completo", subtitle: "con UV ultravioleta", body: "La lámpara UV elimina bacterias y gérmenes de forma automática. Desodorización del ambiente incluida. El baño más limpio, siempre.", image: "/manus-storage/LuzUV_7fd9bd41.png", tag: "EXPERIENCIA ELORA" },
  { number: "08", eyebrow: "Control total", title: "Mando a distancia", subtitle: "para guardar tus preferencias", body: "Mando en español con memoria para 2 usuarios. Guarda tus ajustes de temperatura, modos de lavado y secado. Todo personalizado, siempre listo.", image: "/manus-storage/mando-a-distancia-1024x825_ff981e6b.jpg", tag: "2 perfiles de usuario" },
];

function ExperienceSection({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const { t } = useTranslation();
  const { data: dbSlides } = trpc.experience.getSlides.useQuery(undefined, { staleTime: 5 * 60 * 1000, retry: false });
  // Use DB slides if available, otherwise fall back to i18n + hardcoded images
  const i18nSteps = t('experience.steps', { returnObjects: true }) as Array<{number:string;eyebrow:string;title:string;subtitle:string;body:string;tag:string}>;
  const STEPS = (dbSlides && dbSlides.length > 0)
    ? dbSlides.map(s => ({
        number: s.step,
        eyebrow: s.description ?? '',
        title: s.title,
        subtitle: '',
        body: s.description ?? '',
        tag: s.step,
        image: s.imageUrl ?? '',
      }))
    : i18nSteps.map((s, i) => ({ ...s, image: EXPERIENCE_STEPS[i]?.image ?? '' }));
  const [activeStep, setActiveStep] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  // Precargar todas las imágenes al montar el componente
  useEffect(() => {
    if (STEPS.length === 0) return;
    STEPS.forEach(s => {
      if (!s.image) return;
      const img = new Image();
      img.onload = () => setLoadedImages(prev => new Set(prev).add(s.image));
      img.src = s.image;
    });
  }, [STEPS.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const container = scrollContainer.current;
    const el = sectionRef.current;
    if (!container || !el) return;
    let inSection = false;
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top;
      const totalScrollable = el.scrollHeight - container.clientHeight;
      const scrolled = -relativeTop;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const idx = Math.min(
        STEPS.length - 1,
        Math.floor(progress * STEPS.length)
      );
      setActiveStep(idx);
      // Ocultar chatbot cuando la sección está en vista
      const nowInSection = scrolled > -80 && scrolled < totalScrollable + 80;
      if (nowInSection !== inSection) {
        inSection = nowInSection;
        window.dispatchEvent(new CustomEvent('experience-section-visible', { detail: { visible: nowInSection } }));
      }
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  const step = STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-foreground text-background relative"
    >
      {/* ── MOBILE: mismo scroll-pin pero vertical ── */}
      <div
        className="md:hidden"
        style={{ height: `${STEPS.length * 100}vh` }}
      >
        <div className="sticky top-20 h-[calc(100dvh-5rem)] w-full overflow-hidden flex flex-col bg-foreground">

          {/* Cabecera fija móvil */}
          <div className="shrink-0 px-5 pt-5 pb-3 border-b border-background/10 flex items-end justify-between gap-3">
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.35em] text-accent-deep mb-1 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-accent-deep" /> {t('experience.eyebrow')}
              </p>
              <h2 className="font-display text-xl uppercase tracking-wide leading-[0.9]">
                {t('experience.title')}<span className="text-accent-deep">{t('experience.titleHighlight')}</span>
              </h2>
            </div>
            {/* Contador */}
            <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.3em] text-background/40">
              {String(activeStep + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Imagen — 55% de la altura disponible */}
          <div className="relative overflow-hidden" style={{ flex: '0 0 55%' }}>
            {STEPS.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={activeStep === idx
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.94, y: -20 }
                }
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Skeleton mientras carga */}
                {!loadedImages.has(s.image) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 rounded-lg bg-background/10 animate-pulse" />
                  </div>
                )}
                <img
                  src={s.image}
                  alt={s.title}
                  className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${loadedImages.has(s.image) ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Número de fondo */}
                <span className="absolute bottom-1 right-3 font-display text-[5rem] leading-none text-background/5 select-none pointer-events-none">
                  {s.number}
                </span>
                {/* Tag */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground/80 backdrop-blur-sm border border-background/10 font-body text-[8px] uppercase tracking-[0.25em] text-accent-deep">
                  <span className="w-1 h-1 rounded-full bg-accent-deep" />
                  {s.tag}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Texto del paso activo — flex-1 con tamaños legibles */}
          <div className="flex-1 border-t border-background/10 px-5 py-4 flex flex-col justify-center">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-background/40 mb-1.5">{step.eyebrow}</p>
              <h3 className="font-display text-xl uppercase tracking-wide leading-[0.95] text-background mb-1.5">
                {step.title}
              </h3>
              <p className="font-body text-base text-accent-deep mb-2">{step.subtitle}</p>
              <p className="font-body text-sm text-background/60 leading-relaxed line-clamp-3">{step.body}</p>
            </motion.div>
          </div>

          {/* Dots de progreso */}
          <div className="shrink-0 px-5 pb-3 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === activeStep ? 'w-5 h-1.5 bg-accent-deep'
                  : i < activeStep ? 'w-1.5 h-1.5 bg-accent-deep/40'
                  : 'w-1.5 h-1.5 bg-background/20'
                }`}
              />
            ))}
          </div>

          {/* Barra de progreso inferior */}
          <div className="shrink-0 h-[2px] bg-background/10">
            <motion.div
              className="h-full bg-accent-deep"
              animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP: scroll-pin con sticky ── */}
      <div
        className="hidden md:block"
        style={{ height: `${STEPS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col">

          {/* Cabecera fija */}
          <div className="shrink-0 px-16 pt-10 pb-6 border-b border-background/10 flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep mb-3 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-accent-deep" /> {t('experience.eyebrow')}
              </p>
              <h2 className="font-display text-6xl uppercase tracking-wide leading-[0.9]">
                {t('experience.title')}<span className="text-accent-deep">{t('experience.titleHighlight')}</span>
              </h2>
            </div>
            {/* Dots + contador */}
            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeStep ? 'w-6 h-2 bg-accent-deep'
                    : i < activeStep ? 'w-2 h-2 bg-accent-deep/40'
                    : 'w-2 h-2 bg-background/20'
                  }`}
                />
              ))}
              <span className="ml-3 font-body text-[10px] uppercase tracking-[0.3em] text-background/40">
                {String(activeStep + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Contenido: texto izq + imagen der */}
          <div className="flex-1 flex overflow-hidden">
            {/* Texto */}
            <div className="w-1/2 flex flex-col justify-center px-16 py-0">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-background/40 mb-4">{step.eyebrow}</p>
                <h3 className="font-display text-5xl xl:text-6xl uppercase tracking-wide leading-[0.9] text-background mb-3">{step.title}</h3>
                <p className="font-body text-lg text-accent-deep mb-6 tracking-wide">{step.subtitle}</p>
                <p className="font-body text-base text-background/60 leading-relaxed max-w-md mb-6">{step.body}</p>
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-accent-deep/40 font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-deep" />
                  {step.tag}
                </span>
              </motion.div>
            </div>

            {/* Imagen */}
            <div className="w-1/2 relative border-l border-background/10">
              {STEPS.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={activeStep === idx ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-8"
                >
                  <div className="w-full h-full bg-background/5 border border-background/10 overflow-hidden flex items-center justify-center relative">
                    {!loadedImages.has(s.image) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 rounded-lg bg-background/10 animate-pulse" />
                      </div>
                    )}
                    <img
                      src={s.image}
                      alt={s.title}
                      className={`w-full h-full object-contain p-4 transition-opacity duration-500 ${loadedImages.has(s.image) ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                  <span className="absolute bottom-4 right-6 font-display text-[8rem] leading-none text-background/5 select-none pointer-events-none">{s.number}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Barra de progreso inferior */}
          <div className="shrink-0 h-[3px] bg-background/10">
            <motion.div
              className="h-full bg-accent-deep"
              animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Acordeón compacto del Manifiesto (solo móvil) ─────────────────────────
const MANIFESTO_FEATS = [
  {
    icon: Sparkles,
    title: "Higiene Real",
    body: "El bidé integrado con agua templada limpia con una eficacia que el papel nunca alcanza. Más cuidado, menos irritación, cero residuos.",
    img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    color: "from-sky-900/70",
  },
  {
    icon: ShieldCheck,
    title: "Salud Diaria",
    body: "Asiento con calefacción, secado por aire y filtro de carbón activo. Un gesto cotidiano que protege la piel sensible y mejora el bienestar.",
    img: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    color: "from-emerald-900/70",
  },
  {
    icon: Thermometer,
    title: "Lujo Silencioso",
    body: "Tapa de cierre asistido, luz nocturna ambiental y modos personalizados. El confort de un hotel cinco estrellas, cada mañana, en casa.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    color: "from-stone-900/80",
  },
];

function ManifiestoAccordion() {
  const { t } = useTranslation();
  const ICONS_MANIF = [Sparkles, ShieldCheck, Thermometer];
  const IMGS_MANIF = [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  ];
  const COLORS_MANIF = ["from-sky-900/70", "from-emerald-900/70", "from-stone-900/80"];
  const feats = (t('manifestoFeats', { returnObjects: true }) as Array<{title:string;body:string}>).map((f, i) => ({ ...f, icon: ICONS_MANIF[i], img: IMGS_MANIF[i], color: COLORS_MANIF[i] }));
  return (
    <div className="md:hidden flex flex-col gap-0 border border-border overflow-hidden">
      {feats.map((feat, i) => {
        const Icon = feat.icon;
        return (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.93 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, scale: 0.93 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{
              duration: 0.65,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="relative overflow-hidden bg-background border-b border-border last:border-b-0"
          >
            {/* Foto discreta de fondo */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src={feat.img}
                alt=""
                className="w-full h-full object-cover opacity-[0.07]"
              />
            </div>

            <div className="relative z-10 p-7 flex flex-col gap-4">
              {/* Cabecera */}
              <div className="flex items-start justify-between">
                <motion.div
                  className="w-11 h-11 rounded-full bg-accent-deep flex items-center justify-center"
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.2 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <span className="font-display text-[4.5rem] leading-none text-foreground/6 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <motion.h3
                className="font-display text-2xl uppercase tracking-wide leading-tight"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {feat.title}
              </motion.h3>

              <motion.p
                className="font-body text-sm text-foreground/70 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ delay: 0.32, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {feat.body}
              </motion.p>

              {/* Línea decorativa que se expande */}
              <motion.div
                className="h-[2px] bg-accent-deep rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Sección de Reseñas ──────────────────────────────────────────────────────
// REVIEWS y AVATAR_COLORS importados desde @/lib/reviews (fuente única de verdad)

function GoogleStarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="#FBBC04">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  );
}

function GoogleLogoIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}



function ReviewCard({ r, idx }: { r: import("@/lib/reviews").Review; idx: number }) {
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div className="w-[300px] md:w-[340px] flex-shrink-0 bg-white rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.12)] p-5 border border-gray-100 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-shadow duration-300">
      {/* Header: avatar + nombre + Google logo */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {r.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm leading-tight">{r.name}</p>
            <p className="text-gray-400 text-xs">{r.date}</p>
          </div>
        </div>
        <GoogleLogoIcon />
      </div>
      {/* Estrellas */}
      <div className="flex gap-0.5 mb-3">
        {[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}
      </div>
      {/* Texto */}
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">{r.text}</p>
    </div>
  );
}

// ReviewsSection importada desde @/components/ReviewsSection


// ─── Club Elora Section ──────────────────────────────────────────────────────────────────────────────
const CLUB_PERKS = [
  { icon: "⚡", title: "Acceso a preventas", desc: "Sé el primero en reservar nuevos modelos con descuentos exclusivos antes que nadie." },
  { icon: "💬", title: "Contenido privado", desc: "Guías de uso, trucos de mantenimiento y novedades de la marca solo para miembros." },
  { icon: "💸", title: "Promociones exclusivas", desc: "Ofertas y descuentos que no publicamos en ningún otro canal. Solo para el club." },
  { icon: "🛠️", title: "Soporte prioritario", desc: "Atención directa con el equipo técnico de Elora. Respuesta garantizada en menos de 24h." },
];

function ClubEloraSection() {
  const { t } = useTranslation();
  const clubPerks = t('clubSection.perks', { returnObjects: true }) as Array<{icon:string;title:string;desc:string}>;
  const [form, setForm] = useState({ nombre: "", email: "", acepto: false });
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const signupMutation = trpc.clubElora.signup.useMutation({
    onSuccess: () => {
      setSent(true);
    },
    onError: (err) => {
      toast.error(err.message || t('clubSection.errorJoin'));
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.acepto) return;
    signupMutation.mutate({
      nombre: form.nombre || undefined,
      email: form.email,
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #001220 0%, #001F3F 40%, #0a2a4a 70%, #001220 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('/manus-storage/inodoro-aura_d094b1e7.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(ellipse, #F5A45B 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(ellipse, #F5A45B 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-16 py-12 md:py-32">
        <div className={`text-center mb-8 md:mb-20 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-amber-400/70 mb-2">{t('clubSection.eyebrow')}</p>
          <h2 className="font-display text-4xl md:text-7xl lg:text-8xl uppercase tracking-wide text-white leading-[0.9] mb-4">
            Club
            <span className="block" style={{ WebkitTextStroke: "1px rgba(245,164,91,0.6)", color: "transparent" }}>Elora</span>
          </h2>
          <p className="font-body text-white/50 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
            {t('clubSection.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 md:mb-20">
          {clubPerks.map((perk, i) => (
            <div
              key={i}
              className={`group relative rounded-sm border border-white/10 p-4 md:p-8 hover:border-amber-400/40 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                background: "rgba(255,255,255,0.03)",
                transitionDelay: `${200 + i * 100}ms`,
                animation: visible ? `floatCard ${3.5 + i * 0.4}s ease-in-out infinite` : "none",
                animationDelay: `${i * 0.6}s`
              }}
            >
              <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(245,164,91,0.05) 0%, transparent 100%)" }} />
              <div className="text-2xl mb-2 md:mb-4">{perk.icon}</div>
              <h3 className="font-display text-sm md:text-lg uppercase tracking-wide text-white mb-1 md:mb-2">{perk.title}</h3>
              <p className="font-body text-white/40 text-xs leading-relaxed hidden sm:block">{perk.desc}</p>

            </div>
          ))}
        </div>

        <div
          className={`max-w-xl mx-auto transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ animation: visible ? "floatCard 4.5s ease-in-out infinite" : "none", animationDelay: "0.3s" }}
        >
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-white mb-2">{t('clubSection.welcomeTitle')}</h3>
              <p className="font-body text-white/50 text-sm">{t('clubSection.welcomeBody')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">{t('clubSection.nameLabel')}</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder={t('clubSection.namePlaceholder')}
                    className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">{t('clubSection.emailLabel')}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors duration-300"
                  />
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setForm(f => ({ ...f, acepto: !f.acepto }))}
                  className={`mt-0.5 w-5 h-5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    form.acepto ? "bg-amber-400 border-amber-400" : "bg-transparent border-white/30 group-hover:border-white/60"
                  }`}
                >
                  {form.acepto && (
                    <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-xs text-white/40 leading-relaxed">
                  {t('clubSection.privacyText')}{" "}
                  <a href="/politica-privacidad" className="text-amber-400/70 hover:text-amber-400 underline underline-offset-2 transition-colors">
                    {t('clubSection.privacyLink')}
                  </a>
                </span>
              </label>
              <button
                type="submit"
                disabled={!form.acepto || signupMutation.isPending}
                className="w-full py-4 font-display text-sm uppercase tracking-[0.3em] transition-all duration-300 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: form.acepto && !signupMutation.isPending ? "linear-gradient(135deg, #F5A45B, #e8923a)" : "rgba(255,255,255,0.08)", color: form.acepto && !signupMutation.isPending ? "#001F3F" : "rgba(255,255,255,0.3)" }}
              >
                {signupMutation.isPending ? t('clubSection.joining') : t('clubSection.joinBtn')}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 md:mt-16 flex items-center justify-center gap-6 opacity-30">
          <div className="h-[1px] w-24 bg-white/30" />
          <span className="font-display text-xs uppercase tracking-[0.4em] text-white/50">Elora Smart · Galicia</span>
          <div className="h-[1px] w-24 bg-white/30" />
        </div>
      </div>
    </section>
  );
}

// ─── Componente de vídeo Esencia ─────────────────────────────────────────────
function EsenciaVideoCard() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Escucha el primer clic en toda la página para desbloquear el audio
  useEffect(() => {
    const unlock = () => {
      setUserInteracted(true);
      const v = videoRef.current;
      if (v && v.muted) {
        v.muted = false;
      }
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.muted = false; v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  useEffect(() => {
    const v = videoRef.current;
    const c = containerRef.current;
    if (!v || !c) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Arranca siempre silenciado; el sonido se activa tras el primer clic del usuario
          v.muted = !userInteracted;
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, [userInteracted]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-5%" }}
      className="md:col-span-4 md:row-span-2 relative overflow-hidden border border-border bg-black min-h-[300px] md:min-h-0 group cursor-pointer"
      onClick={toggle}
    >
      <video
        ref={videoRef}
        src="/manus-storage/elora-video-cantera_c60888ff.mp4"
        playsInline
        muted
        loop
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!playing && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      )}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="play-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white bg-accent-deep px-2 py-1">{t('video.location')}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative px-4 py-4 flex items-end justify-between gap-3">
          <p className="font-display text-sm md:text-base uppercase tracking-wide leading-tight text-white max-w-[55%]">
            {t('video.title')}
          </p>
          <motion.div
            className="text-right ml-auto"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className="inline-block bg-amber-500/90 backdrop-blur-sm px-3 py-2 border-l-2 border-white/40">
              <p className="font-body text-[8px] uppercase tracking-[0.3em] text-white/80 leading-tight">{t('video.waitLabel')}</p>
              <p className="font-display text-sm uppercase tracking-wide text-white leading-tight">{t('video.waitTitle')}</p>
              <p className="font-body text-[8px] uppercase tracking-[0.2em] text-white/70 leading-tight mt-0.5">{t('video.waitSub')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t, i18n } = useTranslation();
  const [homeProducts, setHomeProducts] = useState(() => getLocalizedFeatured('es'));
  const productsQuery = trpc.products.getAll.useQuery();

  useEffect(() => {
    const parseJsonField = (val: any, fallback: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fallback; } }
      if (val && typeof val === 'object') return val;
      return fallback;
    };
    // Siempre partir de los productos localizados como base
    const localizedBase = getLocalizedFeatured(i18n.language);
    if (productsQuery.data && productsQuery.data.length > 0) {
      // Merge: textos del idioma activo + img/gallery/price de la BD
      const merged = localizedBase.map((fallback) => {
        const fromDb = productsQuery.data.find((p: any) =>
          p.slug?.toLowerCase() === fallback.id?.toLowerCase()
        );
        if (!fromDb) return fallback;
        return {
          ...fallback,
          img: fromDb.img || fallback.img,
          gallery: parseJsonField(fromDb.gallery, fallback.gallery || []),
          price: fromDb.price ? (typeof fromDb.price === 'number' ? fromDb.price : parseFloat(fromDb.price)) : fallback.price,
          originalPrice: fromDb.originalPrice ? (typeof fromDb.originalPrice === 'number' ? fromDb.originalPrice : parseFloat(String(fromDb.originalPrice))) : fallback.originalPrice ?? null,
        };
      });
      setHomeProducts(merged as any);
    } else {
      setHomeProducts(localizedBase);
    }
  }, [productsQuery.data, i18n.language]);
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { cart, isCartOpen, addToCart: addToCartCtx, removeFromCart, openCart, closeCart, totalItems } = useCart();
  const [contactForm, setContactForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [catalogLang, setCatalogLang] = useState<"es" | "en" | "fr" | "pt">(() => {
    const l = i18n.language;
    if (l.startsWith("en")) return "en";
    if (l.startsWith("fr")) return "fr";
    if (l.startsWith("pt")) return "pt";
    return "es";
  });
  // Sincronizar con el idioma activo de la app
  useEffect(() => {
    const l = i18n.language;
    if (l.startsWith("en")) setCatalogLang("en");
    else if (l.startsWith("fr")) setCatalogLang("fr");
    else if (l.startsWith("pt")) setCatalogLang("pt");
    else setCatalogLang("es");
  }, [i18n.language]);
  const [contactSent, setContactSent] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Estado para el modal de upsell ELORA PREMIUM CARE
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ id: string; name: string; price: number; img: string } | null>(null);

  const addToCart = (item: { id: string; name: string; price: number; img?: string }) => {
    const isEsenza = item.id?.toLowerCase().includes('esenza') || item.name?.toLowerCase().includes('esenza');
    if (isEsenza) {
      setPendingProduct({ id: item.id, name: item.name, price: item.price, img: item.img || '' });
      setPremiumModalOpen(true);
    } else {
      addToCartCtx(item);
      setAddedId(item.id);
      setTimeout(() => setAddedId(null), 1200);
      openCart();
    }
  };

  const handlePremiumAccept = () => {
    if (pendingProduct) {
      addToCartCtx(pendingProduct);
      addToCartCtx({ id: 'premium-care', name: 'ELORA PREMIUM CARE', price: 249, img: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/premium-care-product-KotbV6544WKMGezFLb8UJF.webp' });
      setAddedId(pendingProduct.id);
      setTimeout(() => setAddedId(null), 1200);
    }
    setPremiumModalOpen(false);
    setPendingProduct(null);
    openCart();
  };

  const handlePremiumDecline = () => {
    if (pendingProduct) {
      addToCartCtx(pendingProduct);
      setAddedId(pendingProduct.id);
      setTimeout(() => setAddedId(null), 1200);
    }
    setPremiumModalOpen(false);
    setPendingProduct(null);
    openCart();
  };

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setTimeout(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
  };

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setContactSent(true);
      setContactForm({ nombre: "", telefono: "", email: "", mensaje: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Error al enviar el mensaje. Inténtalo de nuevo.");
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      nombre: contactForm.nombre,
      telefono: contactForm.telefono || undefined,
      email: contactForm.email,
      mensaje: contactForm.mensaje || undefined,
      idiomaCatalogo: catalogLang,
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: scrollContainerRef.current, threshold: [0.25, 0.5, 0.75] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [selectedProduct]);

  const SECTIONS = [t('nav.vision'), t('nav.esencia'), t('nav.manifiesto'), t('nav.coleccion'), t('nav.contacto')];

  // Actualizar selectedProduct cuando cambia el idioma (para que el modal se traduzca)
  useEffect(() => {
    if (selectedProduct) {
      const allLoc = getLocalizedProducts(i18n.language);
      const updated = allLoc.find(p => p.id === selectedProduct.id);
      if (updated) setSelectedProduct({ ...selectedProduct, ...updated, img: selectedProduct.img, gallery: selectedProduct.gallery });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  // Bloquear scroll del body mientras Home está montado (el scroll es interno por secciones)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <div
        className={`flex flex-col md:flex-row h-[100dvh] w-full bg-background text-foreground font-body overflow-hidden selection:bg-foreground selection:text-background transition-opacity duration-700 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        {/* ── MOBILE TOP NAVBAR ─────────────────────────────────────────────── */}
        <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
          <button onClick={() => { setSelectedProduct(null); scrollToSection(0); }}>
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
          </button>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => openCart()}
              className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center outline-none"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-4 h-4 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-300 outline-none"
              aria-label={t('nav.menu')}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── DESKTOP LEFT SIDEBAR ──────────────────────────────────────────── */}
        <aside className="hidden md:flex w-72 h-full border-r border-border bg-background flex-col justify-between items-start z-50 shrink-0 relative py-7">
          <div className="px-10 text-left">
            <button onClick={() => { setSelectedProduct(null); scrollToSection(0); }} className="outline-none text-left">
              <img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto select-none" />
              <p className="font-display text-xs uppercase tracking-[0.4em] text-foreground/50 mt-3">Smart</p>
            </button>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          <nav className="flex flex-col gap-5 w-full px-10">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">{t('nav.index')}</p>
            {SECTIONS.map((item, idx) => {
              const isActive = !selectedProduct && activeIndex === idx;
              return (
                <button
                  key={`desktop-${item}`}
                  onClick={() => scrollToSection(idx)}
                  className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
                >
                  <span className={`h-[1px] transition-all duration-500 ${isActive ? "w-8 bg-accent-deep" : "w-3 bg-foreground/20"}`} />
                  <span className={`font-display text-xl lg:text-2xl uppercase tracking-wide transition-colors duration-500 ${isActive ? "text-foreground" : "text-foreground/30 group-hover:text-foreground/60"}`}>
                    {item}
                  </span>
                  <span className={`ml-auto font-body text-[10px] transition-colors duration-500 ${isActive ? "text-accent-deep" : "text-foreground/20"}`}>
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="px-10 w-full flex flex-col gap-5">
            <button
              onClick={() => openCart()}
              className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
            >
              <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
                <ShoppingBag className="w-4 h-4" /> {t('coleccion.buy')}
              </span>
              <span className="font-display text-sm text-accent-deep">{totalItems}</span>
            </button>
            <div className="flex items-center justify-between">
              <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-deep" />
                EST. SPAIN - 2022
              </div>
            </div>
          </div>
        </aside>

        {/* ── MOBILE FULLSCREEN MENU ────────────────────────────────────────── */}
        <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-7 pb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">{t('nav.index')}</p>
            {SECTIONS.map((item, idx) => {
              const isActive = !selectedProduct && activeIndex === idx;
              return (
                <button
                  key={`mobile-${item}`}
                  onClick={() => scrollToSection(idx)}
                  className={`text-left font-display text-4xl uppercase tracking-wide transition-all duration-500 outline-none flex items-center gap-4 ${isActive ? "text-foreground" : "text-foreground/30"}`}
                >
                  <span className={`text-sm font-body ${isActive ? "text-accent-deep" : "text-foreground/30"}`}>0{idx + 1}</span>
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        <LanguageDetectionBanner />

        {/* ── PREMIUM CARE MODAL ─────────────────────────────────────────── */}
        <PremiumCareModal
          isOpen={premiumModalOpen}
          productName={pendingProduct?.name ?? ''}
          onAccept={handlePremiumAccept}
          onDecline={handlePremiumDecline}
        />

        {/* ── CART PANEL ────────────────────────────────────────────────────── */}
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => closeCart()}
          cart={cart}
          onRemove={removeFromCart}
          sections={SECTIONS}
          onNavigate={scrollToSection}
        />

                {/* ── MAIN SCROLLING CONTENT ────────────────────────────────────────── */}
        <main
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto hide-scrollbar relative bg-background scroll-smooth"
        >
          {selectedProduct ? (
            <div className="pt-20 md:pt-0">
              <ProductDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onAdd={(p) => { addToCart({ id: p.id, name: p.name, price: p.price, img: p.img }); }}
              />
            </div>
          ) : (
            <>
              {/* ── CAPÍTULO 1: VISIÓN ──────────────────────────────────────── */}
              <section
                ref={setSectionRef(0)}
                data-index="0"
                className="h-[calc(100dvh-5rem)] md:h-[100dvh] w-full relative overflow-hidden bg-black flex flex-col"
              >
                {/* Video de fondo: vistas de drón (mp4 directo, sin YouTube) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                    disableRemotePlayback
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover"
                    style={{ transform: "translate(-50%, -50%)", pointerEvents: "none" }}
                  >
                    <source src="/manus-storage/elora-hero-v2_6bab4cdb.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

                <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-20 max-w-3xl pb-16 md:pb-20">
                  <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 mb-6 md:mb-8 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-accent-deep"></span>
                    {t('hero.eyebrow')}
                  </p>
                  <h1 className="font-display text-[14vw] md:text-[8vw] leading-[0.85] uppercase tracking-tight text-white drop-shadow-lg">
                    {t('hero.title1')}<br />
                    <span className="text-accent">{t('hero.title2')}</span>
                  </h1>
                  <p className="mt-8 md:mt-12 max-w-md font-body text-sm md:text-base text-white/90 leading-relaxed border-l border-accent-deep pl-6 backdrop-blur-md bg-black/20 p-5">
                    {t('hero.body')}
                  </p>
                  <button
                    onClick={() => scrollToSection(3)}
                    className="mt-8 group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-white/80 border-b border-white/30 pb-2 w-fit hover:text-accent hover:border-accent transition-colors"
                  >
                    {t('hero.cta')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="absolute bottom-8 left-8 md:left-20 font-display text-lg text-white/40 z-10">01</div>
              </section>

              {/* ── CAPÍTULO 2: ESENCIA ─────────────────────────────────────── */}
              <section
                ref={setSectionRef(1)}
                data-index="1"
                className="w-full relative overflow-hidden bg-background flex flex-col"
              >
                {/* Cabecera de sección */}
                <div className="px-6 pt-7 pb-4 md:px-12 md:pt-8 md:pb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-10%" }}
                  >
                    <p className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent-deep mb-3 flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-accent-deep" /> {t('esencia.eyebrow')}
                    </p>
                    <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide leading-[0.95]">
                      {t('esencia.title1')}<br />{t('esencia.title2')}
                    </h2>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="font-body text-sm text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6"
                  >
                    {t('esencia.body')}
                  </motion.p>
                </div>

                {/* Grid estructura original: 7+5 cols, 2 filas */}
                <div id="esencia-grid" className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-3 md:gap-4 px-6 pb-8 md:px-12 md:pb-10">

                  {/* BLOQUE GRANDE IZQUIERDA — vídeo "Espera, escúchame" (7 cols, 2 rows) */}
                  <EsenciaVideoCard />

                  {/* BLOQUE SUPERIOR DERECHA — stat garantía + imagen ESENZA (5 cols) */}
                  {/* BLOQUE SUPERIOR DERECHA — claim potente con foto de equipo */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-5%" }}
                    className="md:col-span-8 relative overflow-hidden border border-border min-h-[260px] md:min-h-[140px] group bg-black"
                  >
                    <img
                      src="/manus-storage/eloraerquipo_cbe7849e.webp"
                      alt="Equipo Elora Smart"
                      className="absolute inset-0 w-full h-full object-cover opacity-100"
                      style={{objectPosition: '100% 30%', transform: 'translateX(15%) scale(1.25)', transition: 'transform 2.5s ease-out'}}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(15%) scale(1.30)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(15%) scale(1.25)')}
                    />
                    {/* Degradado: negro opaco en la mitad izquierda, transparente en la derecha para ver la foto */}
                    <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.70) 30%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0) 65%)'}} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    {/* Contenido principal */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 pb-10 md:pb-8 pointer-events-none">
                      {/* Eyebrow */}
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-[1px] bg-accent"></span>
                        <p className="font-body text-[9px] uppercase tracking-[0.35em] text-accent">{t('esencia.estab')}</p>
                      </div>

                      {/* Claim central */}
                      <div>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                          className="font-display text-2xl md:text-3xl uppercase tracking-wide leading-tight text-white mb-2"
                        >
                          {t('esencia.trust')}<br />{t('esencia.trustBrand')}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.55, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                          className="font-body text-xs text-white/60 uppercase tracking-widest"
                        >
                          {t('esencia.trustSub')}
                        </motion.p>
                      </div>

                      {/* Stat garantía */}
                      <div className="flex items-end gap-4">
                        <div>
                          <p className="font-display text-4xl md:text-5xl text-accent leading-none">10</p>
                          <p className="font-body text-[9px] uppercase tracking-widest text-white/50">{t('esencia.years')}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/20"></div>
                        <div>
                          <p className="font-display text-4xl md:text-5xl text-white leading-none">100<span className="text-accent text-2xl">%</span></p>
                          <p className="font-body text-[9px] uppercase tracking-widest text-white/50">{t('esencia.origin')}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* BLOQUE INFERIOR DERECHA — stat + tarjeta producto top ventas (8 cols) */}
                  <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

                    {/* Tarjeta azul marina — dato llamativo */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="hidden md:flex relative overflow-hidden flex-col justify-between cursor-default min-h-[140px] md:min-h-0"
                      style={{ background: '#0a0a0a' }}
                    >
                      {/* Carrusel automático de tarjetas Experiencia Elora */}
                      <EsenciaCarousel />
                    </motion.div>

                    {/* Tarjeta producto Top Ventas — AURA-SUSPENDIDO */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="relative overflow-hidden border border-amber-400 bg-background flex flex-col cursor-default group"
                    >
                      {/* Barra Top Ventas */}
                      <div className="relative bg-amber-500 px-3 py-1.5 flex items-center gap-2 overflow-hidden">
                        {/* Shimmer animado */}
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        />
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                          className="text-white text-[11px]"
                        >★</motion.span>
                        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-white font-semibold">{t('esencia.topSales')}</span>
                        <span className="ml-auto font-body text-[9px] text-white/70 uppercase tracking-widest">#1</span>
                      </div>

                      {/* Imagen producto */}
                      <div className="relative overflow-hidden bg-muted min-h-[220px] md:min-h-[180px]">
                        <img
                          src="/manus-storage/AURA-suspendido-p-800x800_d9689cec.jpg"
                          alt="AURA Suspendido"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectPosition: 'center 55%' }}
                        />
                      </div>

                      {/* Info producto */}
                      <div className="p-3 md:p-3 border-t border-amber-400/30">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-display text-base md:text-sm uppercase tracking-widest text-foreground/70 mb-0.5">AURA Suspendido</p>
                            <p className="font-display text-2xl md:text-base leading-none text-foreground">2.600 <span className="text-sm md:text-xs text-foreground/60">€</span></p>
                          </div>
                        </div>
                        <button
                          onClick={() => { const p = getLocalizedProducts(i18n.language).find(p => p.id === 'AURA-SUSPENDIDO'); if (p) openProduct(p); }}
                          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white font-body text-[9px] uppercase tracking-[0.25em] py-2 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {t('esencia.viewDetail')}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </motion.div>

                  </div>

                </div>

                <div className="absolute top-6 right-6 md:right-12 font-display text-lg text-foreground/20">02</div>
              </section>

              {/* ── CAPÍTULO 3: POR QUÉ ─────────────────────────────────────── */}
              <section
                ref={setSectionRef(2)}
                data-index="2"
                className="w-full relative overflow-hidden bg-muted px-6 py-20 md:p-16"
              >

                <div className="max-w-[1400px] mx-auto w-full">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16 relative z-10">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-accent-deep" /> {t('manifiesto.eyebrow')}
                      </p>
                      <TypewriterText key={`manifiesto-${i18n.language}`} text={`${t('manifiesto.title1')}\n${t('manifiesto.title2')}`} tag="h2" className="font-display text-4xl md:text-6xl uppercase tracking-wide leading-[0.95] whitespace-pre-line" speed={35} delay={100} />
                    </div>
                    <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6">
                      {t('manifiesto.body')}
                    </p>
                  </div>

                  {/* ─ Desktop: grid 3 columnas ─ */}
                  <div className="hidden md:grid grid-cols-3 gap-px bg-border border border-border relative z-10">
                    {(t('manifestoFeats', { returnObjects: true }) as Array<{title:string;body:string}>).map((feat, fi) => {
                      const ICONS_D = [Sparkles, ShieldCheck, Thermometer];
                      const Icon = ICONS_D[fi];
                      return (
                        <div key={feat.title} className="bg-background p-8 md:p-10 flex flex-col gap-6">
                          <div className="flex items-center justify-between">
                            <Icon className="w-6 h-6 text-accent-deep" />
                            <span className="font-display text-sm text-foreground/30 uppercase tracking-widest">{feat.title.split(" ")[0]}</span>
                          </div>
                          <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wide leading-tight">{feat.title}</h3>
                          <p className="font-body text-sm text-foreground/70 leading-relaxed">{feat.body}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ─ Móvil: acordeón compacto ─ */}
                  <ManifiestoAccordion />

                  <div className="mt-10 md:mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-border pt-8 relative z-10">
                    <p className="font-display text-xl md:text-2xl uppercase tracking-wide max-w-xl leading-tight">
                      {t('manifiesto.quote')}
                    </p>
                    <button
                      onClick={() => scrollToSection(3)}
                      className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-foreground border-b border-foreground pb-2 hover:text-accent-deep hover:border-accent-deep transition-colors"
                    >
                      {t('manifiesto.discoverCta')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 md:right-16 font-display text-lg text-foreground/20 z-10">03</div>
              </section>

              {/* ── CAPÍTULO 4: COLECCIÓN ───────────────────────────────────── */}
              <section
                ref={setSectionRef(3)}
                data-index="3"
                className="w-full relative overflow-hidden bg-background px-6 py-20 md:p-16"
              >
                <div className="max-w-[1400px] w-full mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-3 flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-accent-deep" /> {t('coleccion.eyebrow')}
                      </p>
                      <TypewriterText key={`coleccion-${i18n.language}`} text={t('coleccion.title')} tag="h2" className="font-display text-4xl md:text-6xl uppercase tracking-wide leading-[0.95]" speed={40} delay={100} />
                    </div>
                    <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6">
                      {t('coleccion.body')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {homeProducts.map((prod, idx) => (
                      <motion.div
                        key={prod.id}
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: false, margin: "-5%" }}
                        transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="group flex flex-col h-full bg-background border border-border hover:border-accent-deep transition-colors"
                      >
                        {/* Imagen */}
                        <button
          onClick={() => openProduct(prod)}
          className="relative overflow-hidden bg-muted border-b border-border aspect-square outline-none w-full"
        >
          <img
            src={prod.img}
            alt={prod.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background font-body text-[9px] uppercase tracking-[0.25em] px-2 py-1">
                            {t('coleccion.viewDetail')}
                          </span>
                        </button>

                        {/* Info */}
                        <div className="flex flex-col gap-2 flex-1 p-4">
                          <p className="font-body text-[10px] text-foreground/50 uppercase tracking-widest">{prod.id}</p>
                          <h3 className="font-display text-lg uppercase tracking-wide leading-tight">{prod.name}</h3>
                          <p className="font-display text-xs uppercase tracking-wide text-accent-deep leading-tight">{prod.tagline}</p>

                          {/* Precio + botones */}
                          <div className="mt-auto pt-4 border-t border-border">
                            <div className="flex items-baseline justify-between mb-3">
                              <div className="flex flex-col gap-0.5">
                                {prod.originalPrice && (
                                  <span className="font-body text-xs text-foreground/40 line-through">
                                    {(typeof prod.originalPrice === 'number' ? prod.originalPrice : parseFloat(String(prod.originalPrice))).toLocaleString()} €
                                  </span>
                                )}
                                <div className="flex items-baseline gap-2">
                                  <span className="font-display text-2xl tracking-wide text-foreground">
                                    {prod.price.toLocaleString()} €
                                  </span>
                                  {prod.originalPrice && (
                                    <span className="font-body text-[9px] uppercase tracking-widest bg-accent-deep/20 text-accent-deep px-1.5 py-0.5 rounded">
                                      {t('coleccion.offer')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="font-body text-[10px] text-foreground/40 uppercase tracking-widest">{t('coleccion.vatIncl')}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  addToCart({ id: prod.id, name: prod.name, price: prod.price, img: prod.img });
                                  openCart();
                                }}
                                className="flex-1 bg-foreground text-background font-body text-[10px] uppercase tracking-[0.25em] py-3 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors active:scale-[0.97]"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                {t('coleccion.buy')}
                              </button>
                              <button
                                onClick={() => openProduct(prod)}
                                className="px-4 border border-border font-body text-[10px] uppercase tracking-[0.2em] text-foreground hover:border-accent-deep hover:text-accent-deep transition-colors active:scale-[0.97]"
                              >
                                {t('coleccion.info')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── Botón Ver todos ── */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <button
                      onClick={() => navigate("/coleccion")}
                      className="group inline-flex items-center gap-4 border border-foreground px-8 py-4 font-body text-xs uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300 active:scale-[0.97]"
                    >
                      {t('coleccion.viewAll')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                      ESENZA · ESENZA Compact · ESENZA Suspendido · AURA · AURA Compact · AURA Suspendido
                    </p>
                  </div>

                  <div className="mt-12 md:mt-16">
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-8 flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-accent-deep" /> {t('coleccion.experience')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                      {(t('esenciaCards', { returnObjects: true }) as Array<{title:string;body:string}>).slice(0,3).map((item, ei) => {
                        const ICONS_E = [MapPin, ShieldCheck, Wrench];
                        const Icon = ICONS_E[ei];
                        return (
                          <div key={item.title} className="bg-background p-8 md:p-10 flex flex-col gap-5">
                            <Icon className="w-6 h-6 text-accent-deep" />
                            <h3 className="font-display text-2xl uppercase tracking-wide leading-tight">{item.title}</h3>
                            <p className="font-body text-sm text-foreground/70 leading-relaxed">{item.body}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8 md:right-16 font-display text-lg text-foreground/20">04</div>
              </section>

              {/* ── CAPÍTULO EXPERIENCIA: PASOS DE USO ──────────────────── */}
              <ExperienceSection scrollContainer={scrollContainerRef} />

              {/* ── RESEÑAS ────────────────────────────────────────────────── */}
              <ReviewsSection />

              {/* ── DIVISOR MARQUEE ────────────────────────────────────────── */}
              <div className="w-full overflow-hidden bg-foreground py-4 select-none">
                <div
                  className="flex w-max"
                  style={{ animation: "marquee-team 28s linear infinite" }}
                >
                  {[
                    "INNOVACIÓN",
                    "CONFORT JAPONÉS",
                    "DISEÑO SIN OBRA",
                    "TECNOLOGÍA PREMIUM",
                    "EQUIPO ELORA",
                    "PASIÓN POR EL DETALLE",
                    "CALIDAD CERTIFICADA",
                    "ATENCIÓN PERSONAL",
                    "INNOVACIÓN",
                    "CONFORT JAPONÉS",
                    "DISEÑO SIN OBRA",
                    "TECNOLOGÍA PREMIUM",
                    "EQUIPO ELORA",
                    "PASIÓN POR EL DETALLE",
                    "CALIDAD CERTIFICADA",
                    "ATENCIÓN PERSONAL",
                  ].map((phrase, j) => (
                    <span key={j} className="flex items-center">
                      <span
                        className="font-display text-white text-sm md:text-base tracking-[0.35em] uppercase px-8"
                        style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
                      >
                        {phrase}
                      </span>
                      <span
                        style={{ color: "#E87A3D", fontSize: "10px", lineHeight: 1 }}
                        aria-hidden
                      >●</span>
                    </span>
                  ))}
                </div>
                <style>{`
                  @keyframes marquee-team {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    [style*="marquee-team"] { animation: none !important; }
                  }
                `}</style>
              </div>

              {/* ── EQUIPO ─────────────────────────────────────────────────────── */}
              <TeamSection />

              {/* ── CLUB ELORA ────────────────────────────────────────────────── */}
              {/* ── DIVISOR DISTRIBUIDORES ──────────────────────────────────── */}
              <div style={{ background: "#001F3F", overflow: "hidden", padding: "18px 0" }}>
                <style>{`
                  @keyframes marquee-dist { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                  @media (prefers-reduced-motion: reduce) { .marquee-dist-inner { animation: none !important; } }
                `}</style>
                <div className="marquee-dist-inner" style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee-dist 30s linear infinite" }}>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                      {["ENCUENTRA TU DISTRIBUIDOR", "RED OFICIAL", "14 PUNTOS DE VENTA", "ATENCIÓN PERSONALIZADA", "INSTALACIÓN CERTIFICADA", "COBERTURA NACIONAL", "EXPERTOS ELORA", "CERCA DE TI"].map((txt, j) => (
                        <span key={j} style={{ display: "inline-flex", alignItems: "center" }}>
                          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#ffffff", padding: "0 28px" }}>{txt}</span>
                          <span style={{ color: "#E87A3D", fontSize: "8px" }}>✦</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <SpainDistributorsMap />

              <ClubEloraSection />

              {/* ── CAPÍTULO 5: CONTACTO ────────────────────────────────────── */}
              <section
                ref={setSectionRef(4)}
                data-index="4"
                className="w-full relative overflow-hidden bg-background flex flex-col justify-between min-h-[100dvh]"
              >
                <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full px-6 md:px-16 py-20 md:py-24 gap-12 md:gap-16">
                  {/* Texto izquierda */}
                  <div className="flex flex-col justify-center md:w-1/2 min-w-0">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                      <span className="font-display text-[30vw] leading-none whitespace-nowrap text-foreground font-bold">ELORA</span>
                    </div>
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/50 mb-6 relative z-10">{t('contacto.eyebrow')}</p>
                      <TypewriterText key={`contacto-${i18n.language}`} text={t('contacto.headline')} tag="h2" className="font-display text-5xl md:text-7xl uppercase tracking-wide mb-6 relative z-10 leading-tight md:leading-[0.9]" speed={45} delay={100} />
                    <p className="font-body text-sm text-foreground/70 leading-relaxed mb-10 max-w-sm relative z-10">
                      {t('contacto.body')}
                    </p>
                    {/* Botón descarga catálogo multiidioma */}
                    <div className="mb-8 relative z-10">
                      <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-3 flex items-center gap-2">
                        <span className="w-4 h-px bg-accent-deep/50" />
                        Catálogo general 2026
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                      <a href="tel:+34614451901" className="flex items-center gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <Phone className="w-4 h-4 text-accent-deep" />
                        +34 614 45 19 01
                      </a>
                      <a href="mailto:info@elorasmart.com" className="flex items-center gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <Mail className="w-4 h-4 text-accent-deep" />
                        info@elorasmart.com
                      </a>
                      <a href="https://maps.google.com/?q=Avenida+da+Mahía+17+Bertamiráns+Ames" target="_blank" rel="noreferrer" className="flex items-start gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <MapPin className="w-4 h-4 text-accent-deep mt-0.5 shrink-0" />
                        <span>
                          <span className="block">{t('contacto.store')}</span>
                          <span className="block text-xs text-foreground/40 mt-0.5">{t('contacto.storeAddress')}</span>
                        </span>
                      </a>
                    </div>

                    {/* Mapa móvil: después de la dirección, solo visible en móvil */}
                    {isMobile && (
                    <div className="mt-5 relative w-full" style={{ height: '200px' }}>
                      {/* Marco animado con gradiente dorado */}
                      <div style={{
                        position: 'absolute', inset: '-2px', borderRadius: '4px', padding: '2px',
                        background: 'linear-gradient(var(--angle, 0deg), #d97706, #fbbf24, #92400e, #f59e0b, #d97706)',
                        animation: 'spin-border 3s linear infinite',
                        zIndex: 10,
                      }}>
                        <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '2px' }} />
                      </div>
                      <div className="absolute overflow-hidden" style={{ inset: '2px', borderRadius: '2px', zIndex: 11 }}>
                      <MapView
                        className="w-full h-full"
                        initialCenter={{ lat: 42.862, lng: -8.6474 }}
                        initialZoom={16}
                        onMapReady={(map) => {
                          const markerEl = document.createElement("div");
                          markerEl.style.cssText = `width:44px;height:44px;border-radius:50%;background:#fff;border:3px solid #d97706;box-shadow:0 4px 16px rgba(217,119,6,0.4);display:flex;align-items:center;justify-content:center;overflow:hidden;`;
                          const img = document.createElement("img");
                          img.src = "/manus-storage/elora_200_6f84beaa.png";
                          img.style.cssText = "width:32px;height:32px;object-fit:contain;";
                          markerEl.appendChild(img);
                          new window.google.maps.marker.AdvancedMarkerElement({ map, position: { lat: 42.862, lng: -8.6474 }, content: markerEl });
                          map.setOptions({ styles: [{elementType:"geometry",stylers:[{color:"#f5f5f0"}]},{elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#ffffff"}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"transit",stylers:[{visibility:"off"}]}], mapTypeControl:false, streetViewControl:false, fullscreenControl:false, zoomControl:false });
                        }}
                      />
                      <a
                        href="https://maps.google.com/?q=Avenida+da+Mahía+17+Bertamiráns+Ames"
                        target="_blank" rel="noreferrer"
                        className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 bg-foreground text-background font-body text-[10px] uppercase tracking-wider px-2.5 py-1.5 shadow-md hover:bg-accent-deep transition-colors"
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        {t('contacto.directions')}
                      </a>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Formulario derecha */}
                  <div className="md:w-1/2 relative z-10">
                    {contactSent ? (
                      <div className="border border-accent-deep p-10 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px]">
                        <Sparkles className="w-8 h-8 text-accent-deep" />
                        <h3 className="font-display text-3xl uppercase tracking-wide">{t('contacto.form.successTitle')}</h3>
                        <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xs">
                          {t('contacto.form.successBody')}
                        </p>
                        <button
                          onClick={() => setContactSent(false)}
                          className="mt-4 font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-accent-deep transition-colors border-b border-foreground/20 pb-1"
                        >
                          {t('contacto.form.sendAnother')}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="border border-border p-8 md:p-10 flex flex-col gap-6">
                        <div>
                          <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-1 flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-accent-deep" /> {t('contacto.form.eyebrow')}
                          </p>
                          <h3 className="font-display text-2xl uppercase tracking-wide mt-2">{t('contacto.form.title')}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">{t('contacto.form.name')} *</label>
                            <input
                              type="text"
                              required
                              value={contactForm.nombre}
                              onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                              className="border-b border-border bg-transparent font-body text-sm text-foreground py-2 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30"
                              placeholder={t('contacto.form.namePlaceholder')}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">{t('contacto.form.phone')}</label>
                            <input
                              type="tel"
                              value={contactForm.telefono}
                              onChange={(e) => setContactForm({ ...contactForm, telefono: e.target.value })}
                              className="border-b border-border bg-transparent font-body text-sm text-foreground py-2 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30"
                              placeholder="+34 600 000 000"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">{t('contacto.form.email')} *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="border-b border-border bg-transparent font-body text-sm text-foreground py-2 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30"
                            placeholder="tu@email.com" // keep as-is, universal
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">{t('contacto.form.message')}</label>
                          <textarea
                            rows={4}
                            value={contactForm.mensaje}
                            onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                            className="border border-border bg-transparent font-body text-sm text-foreground p-3 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30 resize-none"
                            placeholder={t('contacto.form.messagePlaceholder')}
                          />
                        </div>

                        {/* Selector de idioma del catálogo */}
                        <div className="flex flex-col gap-2">
                          <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">
                            {i18n.language.startsWith("en") ? "Catalogue language" :
                             i18n.language.startsWith("fr") ? "Langue du catalogue" :
                             i18n.language.startsWith("pt") ? "Idioma do catálogo" :
                             "Idioma del catálogo"}
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {(["es", "en", "fr", "pt"] as const).map((lang) => {
                              const flags: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", fr: "🇫🇷", pt: "🇵🇹" };
                              const labels: Record<string, string> = { es: "ESP", en: "ENG", fr: "FRA", pt: "POR" };
                              return (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => setCatalogLang(lang)}
                                  className={`flex flex-col items-center gap-1 py-2.5 border transition-all duration-150 font-body text-[10px] uppercase tracking-wider ${
                                    catalogLang === lang
                                      ? "border-accent-deep text-accent-deep bg-accent-deep/5"
                                      : "border-border text-foreground/50 hover:border-foreground/40 hover:text-foreground/70"
                                  }`}
                                >
                                  <span className="text-lg leading-none">{flags[lang]}</span>
                                  <span>{labels[lang]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={contactMutation.isPending}
                          className="group w-full bg-foreground text-background font-body text-xs uppercase tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          {contactMutation.isPending ? t('contacto.form.submitting') : t('contacto.form.submit')}
                        </button>

                        <p className="font-body text-[10px] text-foreground/40 leading-relaxed">
                          {t('contacto.form.privacy')}{" "}
                          <a href="https://elorasmart.com/politica-de-privacidad/" target="_blank" rel="noreferrer" className="underline hover:text-accent-deep transition-colors">
                            {t('contacto.form.privacyLink')}
                          </a>
                          {t('contacto.form.privacyEnd')}
                        </p>
                      </form>
                    )}
                  </div>
                </div>

                {/* Mapa con marcador personalizado — helper reutilizable */}
                {(() => {
                  const mapBlock = (extraClass = "") => (
                    <div className={`relative overflow-hidden ${extraClass}`}>
                      <MapView
                        className="w-full h-full"
                        initialCenter={{ lat: 42.862, lng: -8.6474 }}
                        initialZoom={16}
                        onMapReady={(map) => {
                          const markerEl = document.createElement("div");
                          markerEl.style.cssText = `
                            width: 48px; height: 48px; border-radius: 50%;
                            background: #fff; border: 3px solid #d97706;
                            box-shadow: 0 4px 20px rgba(217,119,6,0.4);
                            display: flex; align-items: center; justify-content: center;
                            overflow: hidden; cursor: pointer;
                          `;
                          const img = document.createElement("img");
                          img.src = "/manus-storage/elora_200_6f84beaa.png";
                          img.style.cssText = "width: 36px; height: 36px; object-fit: contain;";
                          markerEl.appendChild(img);
                          new window.google.maps.marker.AdvancedMarkerElement({
                            map, position: { lat: 42.862, lng: -8.6474 },
                            content: markerEl, title: t('contacto.storeTitle'),
                          });
                          map.setOptions({
                            styles: [
                              { elementType: "geometry", stylers: [{ color: "#f5f5f0" }] },
                              { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
                              { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
                              { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
                              { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d8e8" }] },
                              { featureType: "poi", stylers: [{ visibility: "off" }] },
                              { featureType: "transit", stylers: [{ visibility: "off" }] },
                            ],
                            mapTypeControl: false, streetViewControl: false,
                            fullscreenControl: false, zoomControl: true,
                          });
                        }}
                      />
                      {/* Overlay dirección */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-amber-200 px-3 py-2.5 shadow-lg pointer-events-none">
                        <p className="font-body text-[11px] font-semibold text-foreground uppercase tracking-wider">{t('contacto.storeTitle')}</p>
                        <p className="font-body text-[10px] text-foreground/60 mt-0.5">{t('contacto.storeAddress')}</p>
                      </div>
                      {/* Botón Cómo llegar — solo en móvil */}
                      <div className="absolute bottom-4 right-4 md:hidden">
                        <a
                          href="https://maps.google.com/?q=Avenida+da+Mahía+17+Bertamiráns+Ames"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-foreground text-background font-body text-[10px] uppercase tracking-wider px-3 py-2 shadow-lg hover:bg-accent-deep transition-colors"
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          {t('contacto.directions')}
                        </a>
                      </div>
                    </div>
                  );
                  return (
                    <>
                      {/* Solo escritorio: mapa al final a ancho completo */}
                      <div className="hidden md:block w-full h-[360px]">{mapBlock("w-full h-full")}</div>
                    </>
                  );
                })()}

                <Footer />
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
