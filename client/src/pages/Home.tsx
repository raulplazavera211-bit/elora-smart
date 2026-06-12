import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ArrowRight, Droplets, Leaf, Cpu, Sparkles,
  ShieldCheck, Thermometer, ShoppingBag, MapPin, Wrench, Phone, Mail, Send, Check
} from "lucide-react";
import { ProductDetail, type Product } from "@/components/ProductDetail";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { useLocation } from "wouter";
import { FEATURED_PRODUCTS, ALL_PRODUCTS as ALL_PRODS } from "@/lib/products";

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";
const HERO_IMAGE = "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg";

const PRODUCT_IMAGES: Record<string, string> = {
  "ESENZA": "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
  "AURA-COMPACT": "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
  "AURA-SUSPENDIDO": "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
};
const SECTIONS = ["Visión", "Esencia", "Por Qué", "Colección", "Contacto"];

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

// ─── Datos de productos ────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
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
    id: "AURA-COMPACT",
    name: "Inodoro inteligente AURA compact",
    tagline: "Tecnología AURA completa en formato compacto.",
    description: "Combina tecnología y diseño compacto: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización y control por voz.",
    longDescription:
      "El inodoro inteligente AURA COMPACT combina tecnología y un diseño compacto, ofreciendo todas las ventajas como: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización, control por voz y mando, todo con eficiencia energética y ahorro de espacio. Ideal para baños con poco espacio o lugares donde quieres ganar amplitud.",
    img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
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
];

// ─── Galerías productos nuevos ───────────────────────────────────────────────
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

// ─── Productos nuevos ─────────────────────────────────────────────────────────
const EXTRA_PRODUCTS: Product[] = [
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

const ALL_PRODUCTS = ALL_PRODS;
const HOME_PRODUCTS = FEATURED_PRODUCTS;

// ─── Tipos ─────────────────────────────────────────────────────────────────────
type CartItem = { id: string; name: string; price: number; img: string };
type CheckoutStep = "cart" | "checkout" | "success";

// ─── ExperienceSection ─────────────────────────────────────────────────────────────────
const EXPERIENCE_STEPS = [
  { number: "01", eyebrow: "En el instante en que te acercas", title: "La tapa se levanta automáticamente", subtitle: "para ti", body: "Un sensor detecta tu presencia y levanta la tapa antes de que llegues. Sin tocar nada. Sin esfuerzo. El inodoro ya sabe que estás ahí.", image: "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart-scaled.jpg", tag: "Sensor de presencia" },
  { number: "02", eyebrow: "De pie o sentado", title: "Detecta tu postura", subtitle: "y lo resuelve al instante", body: "Reconoce si estás de pie o sentado y ajusta el comportamiento: apertura de asiento, tipo de descarga y cierre de tapa. Más comodidad, menos gestos.", image: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-7.webp", tag: "Detección de postura" },
  { number: "03", eyebrow: "Asiento CLIMADAPT", title: "Calefacción integrada", subtitle: "ajustable en 4 temperaturas", body: "El asiento se adapta automáticamente a la temperatura ambiente. Natural, 33°C, 37°C o 39°C. Nunca más el contacto frío de la cerámica al amanecer.", image: "https://elorasmart.com/wp-content/uploads/2025/05/aura-elorasmart3.jpg", tag: "CLIMADAPT" },
  { number: "04", eyebrow: "Higiene completa con agua", title: "Lavado posterior, femenino y móvil", subtitle: "temperatura y presión ajustables", body: "Agua caliente instantánea. Boquilla autolimpiable en acero inoxidable. Tres modos de lavado personalizables. La higiene que el papel nunca puede dar.", image: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-4.webp", tag: "Sistema de lavado triple" },
  { number: "05", eyebrow: "Secado Súper-Tifón", title: "En menos de 30 segundos", subtitle: "temperatura y velocidad ajustables", body: "Un chorro de aire de alto rendimiento seca completamente en menos de 30 segundos. 5 velocidades, 4 temperaturas. La realidad de un inodoro sin papel.", image: "https://elorasmart.com/wp-content/uploads/2025/05/decibelios-aura.png", tag: "Sin papel" },
  { number: "06", eyebrow: "Escudo de espuma higiénica", title: "Previene las salpicaduras", subtitle: "y bloquea olores", body: "Antes de cada uso, el inodoro crea una barrera de espuma en el agua. Evita salpicaduras, neutraliza olores y mantiene la cerámica más limpia.", image: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-2.webp", tag: "Escudo de espuma" },
  { number: "07", eyebrow: "Control total", title: "Mando a distancia", subtitle: "para guardar tus preferencias", body: "Mando en español con memoria para 2 usuarios. Guarda tus ajustes de temperatura, modos de lavado y secado. Todo personalizado, siempre listo.", image: "https://elorasmart.com/wp-content/uploads/2025/05/mando-a-distancia-1024x825.jpg", tag: "2 perfiles de usuario" },
  { number: "08", eyebrow: "Lámpara esterilizadora UV", title: "Desinfecta por completo", subtitle: "con UV ultravioleta", body: "La lámpara UV elimina bacterias y gérmenes de forma automática. Desodorización del ambiente incluida. El baño más limpio, siempre.", image: "https://elorasmart.com/wp-content/uploads/2025/05/control-por-voz-768x635.jpg", tag: "Gama AURA" },
];

function ExperienceSection({ scrollContainer }: { scrollContainer: React.RefObject<HTMLDivElement | null> }) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainer.current;
    const el = sectionRef.current;
    if (!container || !el) return;
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top;
      const totalScrollable = el.scrollHeight - container.clientHeight;
      const scrolled = -relativeTop;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const idx = Math.min(
        EXPERIENCE_STEPS.length - 1,
        Math.floor(progress * EXPERIENCE_STEPS.length)
      );
      setActiveStep(idx);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  const step = EXPERIENCE_STEPS[activeStep];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-foreground text-background relative"
    >
      {/* ── MOBILE: mismo scroll-pin pero vertical ── */}
      <div
        className="md:hidden"
        style={{ height: `${EXPERIENCE_STEPS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col bg-foreground">

          {/* Cabecera fija móvil */}
          <div className="shrink-0 px-5 pt-8 pb-4 border-b border-background/10 flex items-end justify-between gap-3">
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.35em] text-accent-deep mb-1.5 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-accent-deep" /> La Experiencia
              </p>
              <h2 className="font-display text-2xl uppercase tracking-wide leading-[0.9]">
                Así funciona<span className="text-accent-deep"> cada vez.</span>
              </h2>
            </div>
            {/* Contador */}
            <span className="shrink-0 font-body text-[10px] uppercase tracking-[0.3em] text-background/40">
              {String(activeStep + 1).padStart(2, '0')} / {String(EXPERIENCE_STEPS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Imagen grande — ocupa la mayor parte de la pantalla */}
          <div className="relative overflow-hidden" style={{ flex: '0 0 52%' }}>
            {EXPERIENCE_STEPS.map((s, idx) => (
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
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-contain p-6"
                  loading="lazy"
                />
                {/* Número de fondo */}
                <span className="absolute bottom-2 right-4 font-display text-[6rem] leading-none text-background/5 select-none pointer-events-none">
                  {s.number}
                </span>
                {/* Tag */}
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/80 backdrop-blur-sm border border-background/10 font-body text-[9px] uppercase tracking-[0.25em] text-accent-deep">
                  <span className="w-1 h-1 rounded-full bg-accent-deep" />
                  {s.tag}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Texto del paso activo */}
          <div className="shrink-0 border-t border-background/10 px-5 py-5 flex-1">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-background/40 mb-2">{step.eyebrow}</p>
              <h3 className="font-display text-2xl uppercase tracking-wide leading-[0.95] text-background mb-1.5">
                {step.title}
              </h3>
              <p className="font-body text-base text-accent-deep mb-3">{step.subtitle}</p>
              <p className="font-body text-sm text-background/60 leading-relaxed line-clamp-4">{step.body}</p>
            </motion.div>
          </div>

          {/* Dots de progreso */}
          <div className="shrink-0 px-5 pb-4 flex items-center gap-1.5">
            {EXPERIENCE_STEPS.map((_, i) => (
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
              animate={{ width: `${((activeStep + 1) / EXPERIENCE_STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP: scroll-pin con sticky ── */}
      <div
        className="hidden md:block"
        style={{ height: `${EXPERIENCE_STEPS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col">

          {/* Cabecera fija */}
          <div className="shrink-0 px-16 pt-10 pb-6 border-b border-background/10 flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep mb-3 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-accent-deep" /> La Experiencia
              </p>
              <h2 className="font-display text-6xl uppercase tracking-wide leading-[0.9]">
                Así funciona<span className="text-accent-deep"> cada vez.</span>
              </h2>
            </div>
            {/* Dots + contador */}
            <div className="flex items-center gap-2">
              {EXPERIENCE_STEPS.map((_, i) => (
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
                {String(activeStep + 1).padStart(2, '0')} / {String(EXPERIENCE_STEPS.length).padStart(2, '0')}
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
              {EXPERIENCE_STEPS.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={activeStep === idx ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-12"
                >
                  <div className="w-full h-full bg-background/5 border border-background/10 overflow-hidden flex items-center justify-center">
                    <img src={s.image} alt={s.title} className="w-full h-full object-contain p-10" loading="lazy" />
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
              animate={{ width: `${((activeStep + 1) / EXPERIENCE_STEPS.length) * 100}%` }}
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
  return (
    <div className="md:hidden flex flex-col gap-0 border border-border overflow-hidden">
      {MANIFESTO_FEATS.map((feat, i) => {
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
const REVIEWS = [
  { name: "Ana G.", text: "Me encanta mover el chorro de agua, para tener una limpieza perfecta.", date: "Mayo 2026", stars: 5 },
  { name: "Jaime V.", text: "El Vater en sí es la bomba, muy buena calidad, facilísimo de instalar siempre que sigas las instrucciones, facilísimo de usar y todo automático. La atención al cliente es brutal, el seguimiento que hacen y la paciencia que tienen.", date: "Mayo 2026", stars: 5 },
  { name: "Adán M.", text: "Teníamos un WC suspendido y nos horrorizaba la idea de meternos en obra. Pero gracias al buen asesoramiento, decidimos lanzarnos de cabeza. Totalmente satisfechos con el resultado.", date: "Mayo 2026", stars: 5 },
  { name: "Lorena A.", text: "Un lujo tener este inodoro en casa, no sé cómo hemos podido vivir sin él! El baño ha pasado a ser de lujo! Un 10.", date: "Marzo 2026", stars: 5 },
  { name: "Carlos M.", text: "La atención un 10 sobre 10, profesionales y con el producto que compré muy satisfecho. Para mí ha sido una alegría, estoy muy conforme, lo recomiendo.", date: "Marzo 2026", stars: 5 },
  { name: "Marta R.", text: "Muy buena atención de Marta y Eloi. Interesante producto. Espero que poco a poco nos vayamos acostumbrando a las nuevas tendencias.", date: "Marzo 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Excelente producto, atención inmejorable. Acostumbrados a instalar todo tipo de wc inteligentes, sin duda este es el más completo que hemos instalado hasta la fecha. Altísima calidad tanto en funciones como en acabados.", date: "Febrero 2026", stars: 5 },
  { name: "Roberto F.", text: "Después de varias semanas aún me sigue sorprendiendo 😃", date: "Febrero 2026", stars: 5 },
  { name: "Pedro L.", text: "Hemos instalado el modelo compact y la verdad que es toda una novedad. La instalación es muy similar a un inodoro convencional. Estoy sorprendido por todas las opciones que tiene, lo recomiendo.", date: "Enero 2026", stars: 5 },
  { name: "Sofía T.", text: "Me lo han puesto en mi casa y estoy encantada. Al principio no estaba segura que fuera realmente útil y ahora solo utilizo este inodoro.", date: "Enero 2026", stars: 5 },
];

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

const AVATAR_COLORS = [
  "#4285F4", "#EA4335", "#34A853", "#FBBC04", "#9C27B0",
  "#00BCD4", "#FF5722", "#607D8B", "#E91E63", "#3F51B5",
];

function ReviewCard({ r, idx }: { r: typeof REVIEWS[0]; idx: number }) {
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

function ReviewsSection() {
  const doubled = [...REVIEWS, ...REVIEWS];
  return (
    <section className="w-full bg-[#F8F9FA] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12">
        <div className="flex items-center gap-2 mb-3">
          <GoogleLogoIcon />
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gray-400">Reseñas verificadas en Google</p>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide text-foreground leading-[0.9]">
            Lo que dicen<br />nuestros clientes
          </h2>
          <div className="hidden md:flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-2xl leading-none">5.0</p>
              <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(i => <GoogleStarIcon key={i} />)}</div>
              <p className="text-gray-400 text-xs mt-1">10 reseñas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carrusel infinito fila 1 → izquierda */}
      <div className="relative">
        <div className="flex gap-5 w-max" style={{ animation: "marquee-left 40s linear infinite" }}>
          {doubled.map((r, i) => <ReviewCard key={i} r={r} idx={i % REVIEWS.length} />)}
        </div>
      </div>

      {/* Carrusel infinito fila 2 → derecha */}
      <div className="relative mt-5">
        <div className="flex gap-5 w-max" style={{ animation: "marquee-right 50s linear infinite" }}>
          {[...doubled].reverse().map((r, i) => <ReviewCard key={i} r={r} idx={(REVIEWS.length - 1 - (i % REVIEWS.length))} />)}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}


// ─── Club Elora Section ──────────────────────────────────────────────────────────────────────────────
const CLUB_PERKS = [
  { icon: "⚡", title: "Acceso a preventas", desc: "Sé el primero en reservar nuevos modelos con descuentos exclusivos antes que nadie." },
  { icon: "💬", title: "Contenido privado", desc: "Guías de uso, trucos de mantenimiento y novedades de la marca solo para miembros." },
  { icon: "💸", title: "Promociones exclusivas", desc: "Ofertas y descuentos que no publicamos en ningún otro canal. Solo para el club." },
  { icon: "🛠️", title: "Soporte prioritario", desc: "Atención directa con el equipo técnico de Elora. Respuesta garantizada en menos de 24h." },
];

function ClubEloraSection() {
  const [form, setForm] = useState({ nombre: "", email: "", acepto: false });
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #001220 0%, #001F3F 40%, #0a2a4a 70%, #001220 100%)" }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('https://elorasmart.com/wp-content/uploads/2025/05/inodoro-aura.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(ellipse, #F5A45B 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(ellipse, #F5A45B 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16 py-24 md:py-32">
        <div className={`text-center mb-16 md:mb-20 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-amber-400/70 mb-4">Acceso exclusivo</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-wide text-white leading-[0.9] mb-6">
            Club
            <span className="block" style={{ WebkitTextStroke: "1px rgba(245,164,91,0.6)", color: "transparent" }}>Elora</span>
          </h2>
          <p className="font-body text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Únete y sé el primero en descubrir promociones, acceso a preventas y contenido privado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 md:mb-20">
          {CLUB_PERKS.map((perk, i) => (
            <div
              key={i}
              className={`group relative rounded-sm border border-white/10 p-6 md:p-8 hover:border-amber-400/40 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ background: "rgba(255,255,255,0.03)", transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(245,164,91,0.05) 0%, transparent 100%)" }} />
              <div className="text-3xl mb-4">{perk.icon}</div>
              <h3 className="font-display text-lg uppercase tracking-wide text-white mb-2">{perk.title}</h3>
              <p className="font-body text-white/40 text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        <div className={`max-w-xl mx-auto transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-white mb-2">Bienvenido al club</h3>
              <p className="font-body text-white/50 text-sm">Pronto recibirás novedades exclusivas en tu email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                    className="w-full bg-white/5 border border-white/15 rounded-sm px-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">Email *</label>
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
                  Acepto la{" "}
                  <a href="https://elorasmart.com/politica-de-privacidad/" target="_blank" rel="noopener noreferrer" className="text-amber-400/70 hover:text-amber-400 underline underline-offset-2 transition-colors">
                    Política de Privacidad
                  </a>
                </span>
              </label>
              <button
                type="submit"
                disabled={!form.acepto}
                className="w-full py-4 font-display text-sm uppercase tracking-[0.3em] transition-all duration-300 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: form.acepto ? "linear-gradient(135deg, #F5A45B, #e8923a)" : "rgba(255,255,255,0.08)", color: form.acepto ? "#001F3F" : "rgba(255,255,255,0.3)" }}
              >
                Unirme al Club Elora
              </button>
            </form>
          )}
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 opacity-30">
          <div className="h-[1px] w-24 bg-white/30" />
          <span className="font-display text-xs uppercase tracking-[0.4em] text-white/50">Elora Smart · A Coruña</span>
          <div className="h-[1px] w-24 bg-white/30" />
        </div>
      </div>
    </section>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ nombre: "", apellidos: "", email: "", telefono: "", direccion: "", ciudad: "", cp: "", notas: "" });
  const [contactForm, setContactForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [contactSent, setContactSent] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.findIndex(i => i.id === item.id);
      if (existing >= 0) return prev;
      return [...prev, item];
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };
  const removeFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
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

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center outline-none"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-4 h-4 text-foreground" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-300 outline-none"
              aria-label="Menú"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── DESKTOP LEFT SIDEBAR ──────────────────────────────────────────── */}
        <aside className="hidden md:flex w-72 h-full border-r border-border bg-background flex-col justify-between items-start z-50 shrink-0 relative py-12">
          <button onClick={() => { setSelectedProduct(null); scrollToSection(0); }} className="px-10 text-left outline-none">
            <img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto select-none" />
            <p className="font-display text-xs uppercase tracking-[0.4em] text-foreground/50 mt-3">Smart</p>
          </button>

          <nav className="flex flex-col gap-5 w-full px-10">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">Índice</p>
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
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
            >
              <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
                <ShoppingBag className="w-4 h-4" /> Comprar
              </span>
              <span className="font-display text-sm text-accent-deep">{cart.length}</span>
            </button>
            <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-deep" />
              Est. Galicia · 2024
            </div>
          </div>
        </aside>

        {/* ── MOBILE FULLSCREEN MENU ────────────────────────────────────────── */}
        <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
          <nav className="flex flex-col gap-7 pb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">Índice</p>
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

        {/* ── CART PANEL ────────────────────────────────────────────────────── */}
        {/* Panel del carrito: lateral en móvil, fullscreen en desktop */}
        <motion.div
          initial={false}
          animate={isCartOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex"
          onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }}
        >
          {/* Overlay: solo en móvil (en desktop el panel ocupa todo) */}
          <motion.div
            className="md:hidden flex-1 bg-foreground/30 backdrop-blur-sm"
            animate={isCartOpen ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* Desktop: sidebar izquierdo fijo visible dentro del fullscreen */}
          <div className="hidden md:flex w-72 h-full border-r border-border bg-background flex-col justify-between items-start shrink-0 py-12 z-10">
            <button onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }} className="px-10 text-left outline-none">
              <img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto select-none" />
              <p className="font-display text-xs uppercase tracking-[0.4em] text-foreground/50 mt-3">Smart</p>
            </button>
            <nav className="flex flex-col gap-5 w-full px-10">
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">Índice</p>
              {SECTIONS.map((item, idx) => (
                <button
                  key={`cart-nav-${item}`}
                  onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); scrollToSection(idx); }}
                  className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
                >
                  <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 transition-all duration-500" />
                  <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">{item}</span>
                  <span className="ml-auto font-body text-[10px] text-foreground/20">0{idx + 1}</span>
                </button>
              ))}
            </nav>
            <div className="px-10 w-full">
              <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent-deep" />
                Est. Galicia · 2024
              </div>
            </div>
          </div>
          {/* ── DESKTOP: layout 2 columnas ── */}
          <div className="hidden md:flex flex-1 h-full overflow-hidden">
            {/* Columna izquierda: imagen + resumen + reseñas (fondo oscuro) */}
            <div className="w-[420px] xl:w-[480px] h-full bg-[#0F0F0F] flex flex-col shrink-0 overflow-y-auto">
              {/* Header con botón cerrar */}
              <div className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0">
                <p className="font-display text-xs uppercase tracking-[0.35em] text-white/40">
                  {checkoutStep === "cart" ? "Tu selección" : checkoutStep === "checkout" ? "Resumen" : "Confirmado"}
                </p>
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }} aria-label="Cerrar" className="outline-none w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Imagen del producto principal */}
              {cart.length > 0 ? (
                <div className="px-10 mb-6">
                  <div className="aspect-square w-full overflow-hidden bg-[#1A1A1A]">
                    <img src={cart[0].img} alt={cart[0].name} className="w-full h-full object-cover opacity-90" />
                  </div>
                </div>
              ) : (
                <div className="px-10 mb-6">
                  <div className="aspect-square w-full bg-[#1A1A1A] flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-white/10" />
                  </div>
                </div>
              )}

              {/* Items del carrito en la columna izquierda */}
              <div className="px-10 flex flex-col gap-3 mb-6">
                {cart.map((item, idx) => (
                  <div key={`left-${item.id}-${idx}`} className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 mb-0.5">{item.id}</p>
                      <p className="font-display text-sm uppercase tracking-wide text-white leading-snug">{item.name}</p>
                    </div>
                    <p className="font-display text-base text-[#D67A00] shrink-0">{item.price.toLocaleString('es-ES')} €</p>
                  </div>
                ))}
                {cart.length > 0 && (
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-body text-[10px] uppercase tracking-widest text-white/30">Total</span>
                    <span className="font-display text-2xl text-white">{cartTotal.toLocaleString('es-ES')} €</span>
                  </div>
                )}
              </div>

              {/* Reseñas flotantes */}
              <div className="px-10 mt-auto pb-10">
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 mb-4">Lo que dicen nuestros clientes</p>
                <div className="flex flex-col gap-3">
                  {REVIEWS.slice(0, 3).map((r, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + i * 0.6, ease: "easeInOut", delay: i * 0.5 }}
                      className="bg-white/5 border border-white/8 rounded-lg px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0"
                          style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <p className="text-white/80 text-[11px] font-semibold">{r.name}</p>
                        <div className="flex gap-0.5 ml-auto">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className="w-3 h-3" viewBox="0 0 20 20" fill="#FBBC04">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">{r.text}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3 h-3" viewBox="0 0 20 20" fill="#FBBC04">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}</div>
                  <p className="text-white/30 text-[10px]">5.0 · 10 reseñas verificadas en Google</p>
                </div>
              </div>
            </div>

            {/* Columna derecha: carrito / formulario / éxito */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ x: "100%" }}
              animate={isCartOpen ? { x: 0 } : { x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 38 }}
              className="flex-1 h-full bg-background flex flex-col"
            >
              {/* Steps indicator */}
              {checkoutStep !== "success" && (
                <div className="flex items-center gap-0 px-12 py-5 border-b border-border shrink-0">
                  {["Carrito", "Datos de envío"].map((label, i) => (
                    <div key={label} className="flex items-center gap-0">
                      <div className={`flex items-center gap-2.5 ${i === 0 ? (checkoutStep === "cart" ? "text-foreground" : "text-foreground/30") : (checkoutStep === "checkout" ? "text-foreground" : "text-foreground/30")} transition-colors duration-300`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-body transition-all duration-300 ${
                          (i === 0 && checkoutStep === "cart") || (i === 1 && checkoutStep === "checkout")
                            ? "bg-foreground text-background"
                            : i === 0 && checkoutStep === "checkout"
                            ? "bg-accent-deep text-background"
                            : "border border-border text-foreground/30"
                        }`}>
                          {i === 0 && checkoutStep === "checkout" ? <Check className="w-3 h-3" /> : i + 1}
                        </div>
                        <span className="font-body text-xs uppercase tracking-widest">{label}</span>
                      </div>
                      {i < 1 && <div className={`w-12 h-[1px] mx-4 transition-colors duration-300 ${checkoutStep === "checkout" ? "bg-accent-deep" : "bg-border"}`} />}
                    </div>
                  ))}
                  {checkoutStep === "checkout" && (
                    <button onClick={() => setCheckoutStep("cart")} className="ml-auto font-body text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors outline-none flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 rotate-180" /> Volver al carrito
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {checkoutStep === "success" ? (
                  <div className="flex flex-col items-center justify-center h-full px-16 text-center gap-8">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="w-24 h-24 rounded-full border-2 border-accent-deep flex items-center justify-center"
                    >
                      <Check className="w-12 h-12 text-accent-deep" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-3xl uppercase tracking-wide mb-3">¡Pedido recibido!</h3>
                      <p className="font-body text-base text-foreground/60 leading-relaxed max-w-md">Gracias, {checkoutForm.nombre}. Nos pondremos en contacto contigo en menos de 24h para confirmar tu pedido y coordinar la instalación.</p>
                    </div>
                    <button
                      onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); setCart([]); }}
                      className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors border border-border px-8 py-3 hover:border-foreground"
                    >
                      Volver al inicio
                    </button>
                  </div>
                ) : checkoutStep === "checkout" ? (
                  <form
                    id="checkout-form-desktop"
                    onSubmit={(e) => { e.preventDefault(); setCheckoutStep("success"); }}
                    className="px-12 py-10 flex flex-col gap-5 max-w-xl"
                  >
                    <h2 className="font-display text-2xl uppercase tracking-wide mb-2">Datos de envío</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Nombre *</label>
                        <input required value={checkoutForm.nombre} onChange={e => setCheckoutForm(f => ({...f, nombre: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Tu nombre" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Apellidos *</label>
                        <input required value={checkoutForm.apellidos} onChange={e => setCheckoutForm(f => ({...f, apellidos: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Apellidos" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Email *</label>
                        <input required type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({...f, email: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="tu@email.com" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Teléfono *</label>
                        <input required type="tel" value={checkoutForm.telefono} onChange={e => setCheckoutForm(f => ({...f, telefono: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="+34 600 000 000" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Dirección de envío *</label>
                      <input required value={checkoutForm.direccion} onChange={e => setCheckoutForm(f => ({...f, direccion: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Calle, número, piso" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Ciudad *</label>
                        <input required value={checkoutForm.ciudad} onChange={e => setCheckoutForm(f => ({...f, ciudad: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Ciudad" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">C.P. *</label>
                        <input required value={checkoutForm.cp} onChange={e => setCheckoutForm(f => ({...f, cp: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="00000" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Notas adicionales</label>
                      <textarea rows={3} value={checkoutForm.notas} onChange={e => setCheckoutForm(f => ({...f, notas: e.target.value}))} className="bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none" placeholder="Instrucciones de entrega, preguntas..." />
                    </div>
                  </form>
                ) : (
                  <div className="px-12 py-10">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center gap-6 py-20 text-center">
                        <ShoppingBag className="w-16 h-16 text-foreground/10" />
                        <div>
                          <p className="font-display text-xl uppercase tracking-wide text-foreground/30 mb-2">Tu carrito está vacío</p>
                          <p className="font-body text-sm text-foreground/30">Explora nuestra colección y añade un producto</p>
                        </div>
                        <button onClick={() => { setIsCartOpen(false); scrollToSection(3); }} className="font-body text-xs uppercase tracking-[0.3em] border border-border px-8 py-3 hover:border-foreground transition-colors">
                          Ver colección
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h2 className="font-display text-2xl uppercase tracking-wide mb-8">Tu pedido</h2>
                        <ul className="flex flex-col gap-6">
                          {cart.map((item, idx) => (
                            <motion.li
                              key={`${item.id}-${idx}`}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -16 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-6 border-b border-border pb-6"
                            >
                              <div className="w-24 h-24 shrink-0 overflow-hidden border border-border bg-[#F8F8F8]">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{item.id}</p>
                                <p className="font-display text-lg uppercase tracking-wide leading-snug">{item.name}</p>
                                <p className="font-display text-xl text-accent-deep mt-2">{item.price.toLocaleString('es-ES')} €</p>
                              </div>
                              <button onClick={() => removeFromCart(idx)} className="shrink-0 w-8 h-8 border border-border flex items-center justify-center text-foreground/30 hover:text-foreground hover:border-foreground transition-colors outline-none">
                                <X className="w-4 h-4" />
                              </button>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {checkoutStep !== "success" && (
                <div className="px-12 py-8 border-t border-border shrink-0">
                  {checkoutStep === "cart" ? (
                    <motion.button
                      onClick={() => setCheckoutStep("checkout")}
                      disabled={cart.length === 0}
                      whileHover={cart.length > 0 ? { scale: 1.01 } : {}}
                      whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
                      className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group"
                      style={{ boxShadow: cart.length > 0 ? "0 4px 32px rgba(214,122,0,0.4)" : undefined }}
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <ShoppingBag className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">
                        {cart.length > 0 ? `Continuar · ${cartTotal.toLocaleString('es-ES')} €` : "Añade productos"}
                      </span>
                      <motion.span
                        className="relative z-10 flex items-center"
                        animate={{ x: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </motion.button>
                  ) : (
                    <button
                      type="submit"
                      form="checkout-form-desktop"
                      className="w-full bg-foreground text-background font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-3 hover:bg-accent-deep transition-all duration-300 active:scale-[0.98]"
                    >
                      <Check className="w-5 h-5" />
                      Confirmar pedido
                    </button>
                  )}
                  <p className="font-body text-[10px] text-foreground/30 text-center mt-3">
                    Pago seguro · Envío e instalación coordinados por Elora
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── MÓVIL: panel lateral deslizante (sin cambios) ── */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={isCartOpen ? { x: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            className="md:hidden w-full max-w-md h-full bg-background border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <p className="font-display text-lg uppercase tracking-widest">
                  {checkoutStep === "cart" ? `Carrito · ${cart.length}` : checkoutStep === "checkout" ? "Datos de envío" : "Pedido confirmado"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {checkoutStep === "checkout" && (
                  <button onClick={() => setCheckoutStep("cart")} className="font-body text-[10px] uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors outline-none flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 rotate-180" /> Volver
                  </button>
                )}
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); }} aria-label="Cerrar" className="outline-none">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Steps indicator */}
            {checkoutStep !== "success" && (
              <div className="flex items-center gap-0 px-8 py-3 border-b border-border shrink-0">
                {["Carrito", "Datos"].map((label, i) => (
                  <div key={label} className="flex items-center gap-0">
                    <div className={`flex items-center gap-2 ${i === 0 ? (checkoutStep === "cart" ? "text-foreground" : "text-foreground/30") : (checkoutStep === "checkout" ? "text-foreground" : "text-foreground/30")} transition-colors duration-300`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-body transition-all duration-300 ${
                        (i === 0 && checkoutStep === "cart") || (i === 1 && checkoutStep === "checkout")
                          ? "bg-foreground text-background"
                          : i === 0 && checkoutStep === "checkout"
                          ? "bg-accent-deep text-background"
                          : "border border-border text-foreground/30"
                      }`}>
                        {i === 0 && checkoutStep === "checkout" ? <Check className="w-2.5 h-2.5" /> : i + 1}
                      </div>
                      <span className="font-body text-[10px] uppercase tracking-widest">{label}</span>
                    </div>
                    {i < 1 && <div className={`w-8 h-[1px] mx-3 transition-colors duration-300 ${checkoutStep === "checkout" ? "bg-accent-deep" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* Body móvil */}
            <div className="flex-1 overflow-y-auto">
              {checkoutStep === "success" ? (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-20 h-20 rounded-full border border-accent-deep flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-accent-deep" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide mb-2">¡Pedido recibido!</h3>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">Gracias, {checkoutForm.nombre}. Nos pondremos en contacto contigo en menos de 24h.</p>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); setCheckoutStep("cart"); setCart([]); }} className="font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-foreground transition-colors">
                    Cerrar
                  </button>
                </div>
              ) : checkoutStep === "checkout" ? (
                <form
                  id="checkout-form"
                  onSubmit={(e) => { e.preventDefault(); setCheckoutStep("success"); }}
                  className="px-8 py-6 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Nombre *</label><input required value={checkoutForm.nombre} onChange={e => setCheckoutForm(f => ({...f, nombre: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Tu nombre" /></div>
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Apellidos *</label><input required value={checkoutForm.apellidos} onChange={e => setCheckoutForm(f => ({...f, apellidos: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Apellidos" /></div>
                  </div>
                  <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Email *</label><input required type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({...f, email: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="tu@email.com" /></div>
                  <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Teléfono *</label><input required type="tel" value={checkoutForm.telefono} onChange={e => setCheckoutForm(f => ({...f, telefono: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="+34 600 000 000" /></div>
                  <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Dirección *</label><input required value={checkoutForm.direccion} onChange={e => setCheckoutForm(f => ({...f, direccion: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Calle, número, piso" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Ciudad *</label><input required value={checkoutForm.ciudad} onChange={e => setCheckoutForm(f => ({...f, ciudad: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Ciudad" /></div>
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">C.P. *</label><input required value={checkoutForm.cp} onChange={e => setCheckoutForm(f => ({...f, cp: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="00000" /></div>
                  </div>
                  <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Notas</label><textarea rows={2} value={checkoutForm.notas} onChange={e => setCheckoutForm(f => ({...f, notas: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none" placeholder="Instrucciones de entrega..." /></div>
                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body text-xs text-foreground/50 uppercase tracking-widest">Total</span>
                      <span className="font-display text-xl">{cartTotal.toLocaleString('es-ES')} €</span>
                    </div>
                    <p className="font-body text-[10px] text-foreground/40">IVA incluido · Envío e instalación a coordinar</p>
                  </div>
                </form>
              ) : (
                <div className="px-8 py-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                      <ShoppingBag className="w-10 h-10 text-foreground/20" />
                      <p className="font-body text-sm text-foreground/40">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-4">
                      {cart.map((item, idx) => (
                        <motion.li key={`mob-${item.id}-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex items-center gap-4 border-b border-border pb-4">
                          <div className="w-16 h-16 shrink-0 overflow-hidden border border-border"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5">{item.id}</p>
                            <p className="font-display text-sm uppercase tracking-wide leading-snug">{item.name}</p>
                            <p className="font-display text-base text-accent-deep mt-1">{item.price.toLocaleString('es-ES')} €</p>
                          </div>
                          <button onClick={() => removeFromCart(idx)} className="shrink-0 text-foreground/30 hover:text-foreground transition-colors outline-none"><X className="w-4 h-4" /></button>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Footer móvil */}
            {checkoutStep !== "success" && (
              <div className="flex flex-col shrink-0">
                {checkoutStep === "cart" && (
                  <div className="bg-[#F8F9FA] border-t border-gray-200 px-5 py-3">
                    <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2.5 text-center">Estás a punto de unirte a clientes como estos</p>
                    <div className="flex flex-col gap-1.5">
                      {REVIEWS.slice(0, 2).map((r, i) => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.8 + i * 0.7, ease: "easeInOut", delay: i * 0.4 }} className="flex items-center gap-2 bg-white rounded-md px-2.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{r.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5"><p className="text-gray-800 text-[11px] font-semibold leading-none shrink-0">{r.name}</p><div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div></div>
                            <p className="text-gray-400 text-[10px] leading-tight line-clamp-1 mt-0.5">{r.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
                      <p className="text-gray-400 text-[10px]">5.0 · 10 reseñas</p>
                      <GoogleLogoIcon />
                    </div>
                    <div className="flex justify-center mt-1.5">
                      <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }} className="flex flex-col items-center gap-0.5">
                        <div className="w-[1px] h-3 bg-gray-300" />
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </motion.div>
                    </div>
                  </div>
                )}
                <div className="px-8 py-6 border-t border-border flex flex-col gap-3">
                  {checkoutStep === "cart" && cart.length > 0 && (
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-body text-xs text-foreground/50 uppercase tracking-widest">Total</span>
                      <span className="font-display text-2xl">{cartTotal.toLocaleString('es-ES')} €</span>
                    </div>
                  )}
                  {checkoutStep === "cart" ? (
                    <motion.button
                      onClick={() => setCheckoutStep("checkout")}
                      disabled={cart.length === 0}
                      whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
                      whileTap={cart.length > 0 ? { scale: 0.97 } : {}}
                      className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group"
                      style={{ boxShadow: cart.length > 0 ? "0 4px 24px rgba(214,122,0,0.35)" : undefined }}
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <ShoppingBag className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{cart.length > 0 ? `Comprar · ${cartTotal.toLocaleString('es-ES')} €` : "Añade productos"}</span>
                      <motion.span className="relative z-10 flex items-center" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}><ArrowRight className="w-4 h-4" /></motion.span>
                    </motion.button>
                  ) : (
                    <button type="submit" form="checkout-form" className="w-full bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 hover:bg-accent-deep transition-all duration-300 active:scale-[0.98]">
                      <Check className="w-4 h-4" />Confirmar pedido
                    </button>
                  )}
                  <p className="font-body text-[10px] text-foreground/30 text-center leading-relaxed">Pago seguro · Envío e instalación coordinados por Elora</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ── MAIN SCROLLING CONTENT ────────────────────────────────────────── */}
        <main
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto hide-scrollbar relative bg-background scroll-smooth"
        >
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAdd={(p) => addToCart({ id: p.id, name: p.name, price: p.price, img: p.img })}
            />
          ) : (
            <>
              {/* ── CAPÍTULO 1: VISIÓN ──────────────────────────────────────── */}
              <section
                ref={setSectionRef(0)}
                data-index="0"
                className="h-[calc(100dvh-5rem)] md:h-[100dvh] w-full relative overflow-hidden bg-black flex flex-col"
              >
                {/* Video de fondo: De la cantera gallega al baño contemporáneo */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/TDs15k-NTGU?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=TDs15k-NTGU&start=15&modestbranding=1&showinfo=0"
                    title="Elora Smart — De la cantera gallega al baño contemporáneo"
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    style={{ width: "177.78vh", height: "100vh", minWidth: "100%", minHeight: "56.25vw", transform: "translate(-50%, -50%)" }}
                    allow="autoplay; encrypted-media"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

                <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-20 max-w-3xl pb-16 md:pb-20">
                  <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-white/80 mb-6 md:mb-8 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-accent-deep"></span>
                    Elegancia Neo-Corporativa
                  </p>
                  <h1 className="font-display text-[14vw] md:text-[8vw] leading-[0.85] uppercase tracking-tight text-white drop-shadow-lg">
                    Mejora tu<br />
                    <span className="text-accent">calidad de vida.</span>
                  </h1>
                  <p className="mt-8 md:mt-12 max-w-md font-body text-sm md:text-base text-white/90 leading-relaxed border-l border-accent-deep pl-6 backdrop-blur-md bg-black/20 p-5">
                    Hay un momento del día que es solo tuyo. Ya es hora de disfrutarlo. Inodoros inteligentes que fusionan alta tecnología con la noble solidez de la piedra gallega.
                  </p>
                  <button
                    onClick={() => scrollToSection(3)}
                    className="mt-8 group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-white/80 border-b border-white/30 pb-2 w-fit hover:text-accent hover:border-accent transition-colors"
                  >
                    Ver la colección
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
                      <span className="w-6 h-[1px] bg-accent-deep" /> La Esencia · Feito en Galicia
                    </p>
                    <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide leading-[0.95]">
                      Alma gallega,<br />precisión absoluta.
                    </h2>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="font-body text-sm text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6"
                  >
                    Diseñamos desde Galicia, donde la piedra y el atlántico marcan el ritmo. Cada Elora se piensa en gallego antes de viajar a tu baño.
                  </motion.p>
                </div>

                {/* Grid estructura original: 7+5 cols, 2 filas */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-3 md:gap-4 px-6 pb-8 md:px-12 md:pb-10" style={{gridTemplateRows: 'repeat(2, 190px)' as any}}>

                  {/* BLOQUE GRANDE IZQUIERDA — vídeo "Espera, escúchame" (7 cols, 2 rows) */}
                  {(() => {
                    const videoRef = useRef<HTMLVideoElement>(null);
                    const containerRef = useRef<HTMLDivElement>(null);
                    const [playing, setPlaying] = useState(false);
                    const toggle = () => {
                      const v = videoRef.current;
                      if (!v) return;
                      if (v.paused) { v.play(); setPlaying(true); }
                      else { v.pause(); setPlaying(false); }
                    };
                    // Autoplay al entrar en viewport, pausa al salir
                    useEffect(() => {
                      const v = videoRef.current;
                      const c = containerRef.current;
                      if (!v || !c) return;
                      const obs = new IntersectionObserver(
                        ([entry]) => {
                          if (entry.isIntersecting) {
                            v.play().then(() => setPlaying(true)).catch(() => {});
                          } else {
                            v.pause();
                            setPlaying(false);
                          }
                        },
                        { threshold: 0.5 }
                      );
                      obs.observe(c);
                      return () => obs.disconnect();
                    }, []);
                    return (
                      <motion.div
                        ref={containerRef}
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-5%" }}
                        className="md:col-span-4 md:row-span-2 relative overflow-hidden border border-border bg-black min-h-[150px] md:min-h-0 group cursor-pointer"
                        onClick={toggle}
                      >
                        {/* Vídeo */}
                        <video
                          ref={videoRef}
                          src="/manus-storage/elora-video-cantera_c60888ff.mp4"
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                          onEnded={() => setPlaying(false)}
                        />

                        {/* Overlay oscuro solo cuando está pausado */}
                        {!playing && (
                          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                        )}

                        {/* Botón play/pausa central */}
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

                        {/* Badge superior izquierda */}
                        <div className="absolute top-4 left-4 pointer-events-none">
                          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white bg-accent-deep px-2 py-1">A Coruña · Galicia</span>
                        </div>

                        {/* Texto parpadeante esquina superior derecha */}
                        <motion.div
                          className="absolute top-4 right-4 text-right pointer-events-none"
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        >
                          <p className="font-body text-[9px] uppercase tracking-[0.25em] text-accent leading-tight">Espera, escúchame.</p>
                          <p className="font-display text-sm uppercase tracking-wide text-white leading-tight">Es importante.</p>
                        </motion.div>

                        {/* Texto inferior — solo visible cuando pausado */}
                        {!playing && (
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-white pointer-events-none">
                            <p className="font-display text-lg md:text-xl uppercase tracking-wide leading-tight max-w-md mb-2">
                              De la cantera gallega<br />al baño contemporáneo.
                            </p>
                            <div className="flex items-center gap-5">
                              <div>
                                <p className="font-display text-sm uppercase tracking-widest">Pureza</p>
                                <p className="font-body text-[9px] text-white/60 uppercase tracking-widest">Cerámica blanca</p>
                              </div>
                              <div>
                                <p className="font-display text-sm uppercase tracking-widest">Solidez</p>
                                <p className="font-body text-[9px] text-white/60 uppercase tracking-widest">Granito local</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}

                  {/* BLOQUE SUPERIOR DERECHA — stat garantía + imagen ESENZA (5 cols) */}
                  {/* BLOQUE SUPERIOR DERECHA — claim potente con foto de equipo */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-5%" }}
                    className="md:col-span-8 relative overflow-hidden border border-border min-h-[140px] group bg-black"
                  >
                    <img
                      src="/manus-storage/eloraerquipo_cbe7849e.webp"
                      alt="Equipo Elora Smart"
                      className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-[2.5s] ease-out group-hover:scale-105 opacity-60"
                    />
                    {/* Overlay degradado lateral */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* Contenido principal */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 pointer-events-none">
                      {/* Eyebrow */}
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-[1px] bg-accent"></span>
                        <p className="font-body text-[9px] uppercase tracking-[0.35em] text-accent">Est. Galicia · 2024</p>
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
                          No compramos<br />lo que otros fabrican.
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.55, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                          className="font-body text-xs text-white/60 uppercase tracking-widest"
                        >
                          Lo creamos nosotros, para ti.
                        </motion.p>
                      </div>

                      {/* Stat garantía */}
                      <div className="flex items-end gap-4">
                        <div>
                          <p className="font-display text-4xl md:text-5xl text-accent leading-none">10</p>
                          <p className="font-body text-[9px] uppercase tracking-widest text-white/50">años de garantía</p>
                        </div>
                        <div className="w-[1px] h-8 bg-white/20"></div>
                        <div>
                          <p className="font-display text-4xl md:text-5xl text-white leading-none">100<span className="text-accent text-2xl">%</span></p>
                          <p className="font-body text-[9px] uppercase tracking-widest text-white/50">origen gallego</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* BLOQUE INFERIOR DERECHA — stat + tarjeta producto top ventas (8 cols) */}
                  <div className="md:col-span-8 grid grid-cols-2 gap-3 md:gap-4">

                    {/* Tarjeta stat -40% */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="border border-border p-5 md:p-6 flex flex-col justify-between gap-2 cursor-default bg-foreground text-background"
                    >
                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 18 }}
                        className="font-display text-3xl md:text-4xl leading-none text-accent"
                      >
                        -40%
                      </motion.p>
                      <div>
                        <p className="font-display text-sm md:text-base uppercase tracking-wide leading-tight text-background">consumo de agua</p>
                        <p className="font-body text-[10px] leading-relaxed mt-1 text-background/50">frente al papel higiénico convencional</p>
                      </div>
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
                        <span className="font-body text-[9px] uppercase tracking-[0.3em] text-white font-semibold">Top Ventas</span>
                        <span className="ml-auto font-body text-[9px] text-white/70 uppercase tracking-widest">#1</span>
                      </div>

                      {/* Imagen producto */}
                      <div className="relative flex-1 min-h-[80px] overflow-hidden bg-muted">
                        <img
                          src="https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg"
                          alt="AURA Suspendido"
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Info producto */}
                      <div className="p-3 border-t border-amber-400/30">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-body text-[8px] uppercase tracking-widest text-foreground/40 mb-0.5">AURA Suspendido</p>
                            <p className="font-display text-base leading-none text-foreground">2.600 <span className="text-xs text-foreground/60">€</span></p>
                          </div>
                        </div>
                        <button
                          onClick={() => openProduct(PRODUCTS.find(p => p.id === "AURA-SUSPENDIDO")!)}
                          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white font-body text-[9px] uppercase tracking-[0.25em] py-2 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          Ver producto
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
                        <span className="w-6 h-[1px] bg-accent-deep" /> El Manifiesto
                      </p>
                      <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide leading-[0.95]">
                        Por qué un inodoro<br />deja de ser un mueble.
                      </h2>
                    </div>
                    <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6">
                      Pasamos casi un año y medio de nuestra vida en el baño. Sin embargo, lo seguimos tratando como una pieza secundaria. En Elora rediseñamos ese momento íntimo desde la higiene, la salud y el silencio.
                    </p>
                  </div>

                  {/* ─ Desktop: grid 3 columnas ─ */}
                  <div className="hidden md:grid grid-cols-3 gap-px bg-border border border-border relative z-10">
                    {[
                      { icon: Sparkles, title: "Higiene Real", body: "El bidé integrado con agua templada limpia con una eficacia que el papel nunca alcanza. Más cuidado, menos irritación, cero residuos." },
                      { icon: ShieldCheck, title: "Salud Diaria", body: "Asiento con calefacción, secado por aire y filtro de carbón activo. Un gesto cotidiano que protege la piel sensible y mejora el bienestar." },
                      { icon: Thermometer, title: "Lujo Silencioso", body: "Tapa de cierre asistido, luz nocturna ambiental y modos personalizados. El confort de un hotel cinco estrellas, cada mañana, en casa." },
                    ].map((feat) => {
                      const Icon = feat.icon;
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
                      No es un electrodoméstico. <span className="text-accent-deep">Es la pieza más íntima de tu arquitectura.</span>
                    </p>
                    <button
                      onClick={() => scrollToSection(3)}
                      className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-foreground border-b border-foreground pb-2 hover:text-accent-deep hover:border-accent-deep transition-colors"
                    >
                      Descubre la colección
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
                        <span className="w-6 h-[1px] bg-accent-deep" /> Exclusivo Elora®
                      </p>
                      <h2 className="font-display text-4xl md:text-6xl uppercase tracking-wide leading-[0.95]">
                        La Colección
                      </h2>
                    </div>
                    <p className="font-body text-sm md:text-base text-foreground/70 leading-relaxed max-w-md md:border-l md:border-border md:pl-6">
                      Seis modelos. Una misma filosofía: higiene avanzada, diseño premium y la tranquilidad del servicio Elora detrás de cada pieza.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {HOME_PRODUCTS.map((prod) => (
                      <div
                        key={prod.id}
                        className="group flex flex-col h-full bg-background border border-border hover:border-accent-deep transition-colors"
                      >
                        {/* Imagen */}
                        <button
                          onClick={() => openProduct(prod)}
                          className="relative overflow-hidden bg-muted border-b border-border h-[260px] outline-none w-full"
                        >
                          <img
                            src={prod.img}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background font-body text-[9px] uppercase tracking-[0.25em] px-2 py-1">
                            Ver detalle
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
                              <span className="font-display text-2xl tracking-wide text-foreground">
                                {prod.price.toLocaleString('es-ES')} €
                              </span>
                              <span className="font-body text-[10px] text-foreground/40 uppercase tracking-widest">IVA incl.</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  addToCart({ id: prod.id, name: prod.name, price: prod.price, img: prod.img });
                                  setIsCartOpen(true);
                                }}
                                className="flex-1 bg-foreground text-background font-body text-[10px] uppercase tracking-[0.25em] py-3 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors active:scale-[0.97]"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Añadir
                              </button>
                              <button
                                onClick={() => openProduct(prod)}
                                className="px-4 border border-border font-body text-[10px] uppercase tracking-[0.2em] text-foreground hover:border-accent-deep hover:text-accent-deep transition-colors active:scale-[0.97]"
                              >
                                Info
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Botón Ver todos ── */}
                  <div className="mt-10 flex flex-col items-center gap-4">
                    <button
                      onClick={() => navigate("/coleccion")}
                      className="group inline-flex items-center gap-4 border border-foreground px-8 py-4 font-body text-xs uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300 active:scale-[0.97]"
                    >
                      Ver los 6 modelos
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                      ESENZA · ESENZA Compact · ESENZA Suspendido · AURA Compact · AURA Suspendido · AURA
                    </p>
                  </div>

                  <div className="mt-12 md:mt-16">
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-8 flex items-center gap-3">
                      <span className="w-6 h-[1px] bg-accent-deep" /> La experiencia Elora
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                      {[
                        { icon: MapPin, title: "Showroom en Galicia", body: "Ven y pruébalo. Te enamorarás y entenderás por qué cambia tu día a día." },
                        { icon: ShieldCheck, title: "Garantías y SAT", body: "Te asesoramos antes, durante y después. Para que aciertes y estés tranquilo." },
                        { icon: Wrench, title: "Instalación sencilla", body: "Solo necesitas un enchufe cerca y a tu fontanero de confianza. Nada más." },
                      ].map((item) => {
                        const Icon = item.icon;
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

              {/* ── CLUB ELORA ────────────────────────────────────────────────── */}
              <ClubEloraSection />

              {/* ── CAPÍTULO 5: CONTACTO ────────────────────────────────────── */}
              <section
                ref={setSectionRef(4)}
                data-index="4"
                className="w-full relative overflow-hidden bg-background flex flex-col justify-between min-h-[100dvh]"
              >
                <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full px-6 md:px-16 py-20 md:py-24 gap-12 md:gap-16">
                  {/* Texto izquierda */}
                  <div className="flex flex-col justify-center md:w-1/2">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                      <span className="font-display text-[30vw] leading-none whitespace-nowrap text-foreground font-bold">ELORA</span>
                    </div>
                    <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/50 mb-6 relative z-10">Listo para elevar tu espacio</p>
                    <h2 className="font-display text-5xl md:text-7xl uppercase tracking-wide mb-6 relative z-10 leading-[0.9]">
                      Hablemos<br />de tu baño.
                    </h2>
                    <p className="font-body text-sm text-foreground/70 leading-relaxed mb-10 max-w-sm relative z-10">
                      Cuéntanos qué tienes en mente. Te asesoramos sin compromiso sobre qué modelo se adapta mejor a tu espacio, instalación y presupuesto.
                    </p>
                    <div className="flex flex-col gap-4 relative z-10">
                      <a href="tel:+34614451901" className="flex items-center gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <Phone className="w-4 h-4 text-accent-deep" />
                        +34 614 45 19 01
                      </a>
                      <a href="mailto:info@elorasmart.com" className="flex items-center gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <Mail className="w-4 h-4 text-accent-deep" />
                        info@elorasmart.com
                      </a>
                      <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="flex items-center gap-3 font-body text-sm text-foreground/70 hover:text-accent-deep transition-colors">
                        <MapPin className="w-4 h-4 text-accent-deep" />
                        Showroom · A Coruña, Galicia
                      </a>
                    </div>
                  </div>

                  {/* Formulario derecha */}
                  <div className="md:w-1/2 relative z-10">
                    {contactSent ? (
                      <div className="border border-accent-deep p-10 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px]">
                        <Sparkles className="w-8 h-8 text-accent-deep" />
                        <h3 className="font-display text-3xl uppercase tracking-wide">¡Mensaje enviado!</h3>
                        <p className="font-body text-sm text-foreground/70 leading-relaxed max-w-xs">
                          Nos pondremos en contacto contigo en menos de 24 horas. Gracias por confiar en Elora Smart.
                        </p>
                        <button
                          onClick={() => setContactSent(false)}
                          className="mt-4 font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-accent-deep transition-colors border-b border-foreground/20 pb-1"
                        >
                          Enviar otro mensaje
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="border border-border p-8 md:p-10 flex flex-col gap-6">
                        <div>
                          <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-1 flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-accent-deep" /> Solicita información
                          </p>
                          <h3 className="font-display text-2xl uppercase tracking-wide mt-2">Catálogo privado</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">Nombre *</label>
                            <input
                              type="text"
                              required
                              value={contactForm.nombre}
                              onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                              className="border-b border-border bg-transparent font-body text-sm text-foreground py-2 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">Teléfono</label>
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
                          <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">Email *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="border-b border-border bg-transparent font-body text-sm text-foreground py-2 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30"
                            placeholder="tu@email.com"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="font-body text-[10px] uppercase tracking-widest text-foreground/50">Mensaje</label>
                          <textarea
                            rows={4}
                            value={contactForm.mensaje}
                            onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                            className="border border-border bg-transparent font-body text-sm text-foreground p-3 outline-none focus:border-accent-deep transition-colors placeholder:text-foreground/30 resize-none"
                            placeholder="Cuéntanos sobre tu baño, qué modelo te interesa o cualquier duda..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="group w-full bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 hover:bg-accent-deep transition-colors relative overflow-hidden"
                        >
                          <Send className="w-4 h-4" />
                          Solicitar catálogo privado
                        </button>

                        <p className="font-body text-[10px] text-foreground/40 leading-relaxed">
                          Al enviar este formulario aceptas nuestra{" "}
                          <a href="https://elorasmart.com/politica-de-privacidad/" target="_blank" rel="noreferrer" className="underline hover:text-accent-deep transition-colors">
                            política de privacidad
                          </a>
                          . No compartimos tus datos con terceros.
                        </p>
                      </form>
                    )}
                  </div>
                </div>

                <Footer />
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
