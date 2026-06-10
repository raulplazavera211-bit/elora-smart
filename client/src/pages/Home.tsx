import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Menu, X, ArrowRight, Droplets, Leaf, Cpu, Sparkles,
  ShieldCheck, Thermometer, ShoppingBag, MapPin, Wrench, Phone, Mail, Send
} from "lucide-react";
import { ProductDetail, type Product } from "@/components/ProductDetail";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";

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
    tagline: "El esencial inteligente.",
    description: "El primer paso al confort japonés sin renunciar a la pureza visual.",
    longDescription:
      "ESENZA es el modelo de entrada a la familia Elora. Cerámica vitrificada blanca, bidé integrado con agua templada, asiento calefactado y secador por aire en un cuerpo monobloque silencioso. Pensado para quien quiere descubrir lo que es un baño de verdad sin obras complicadas: un enchufe cerca, tu fontanero y empiezas a vivirlo.",
    img: "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
    gallery: ESENZA_GALLERY,
    badges: ["Best seller", "Sin obra"],
    highlights: [
      { label: "Asiento", value: "Calefactado" },
      { label: "Limpieza", value: "3 modos" },
      { label: "Garantía", value: "5 años" },
    ],
    pitch: [
      { title: "Higiene japonesa accesible", body: "Bidé integrado con agua templada filtrada y boquilla autolimpiante antes y después de cada uso. Adiós al papel, hola al cuidado real." },
      { title: "Confort cotidiano", body: "Asiento calefactado con 5 niveles de temperatura. Nunca más el contacto frío de la cerámica al amanecer." },
      { title: "Diseño sin obra", body: "Monobloque a suelo de instalación tradicional. Solo necesitas toma de agua, desagüe y un enchufe cerca." },
      { title: "Ahorro real de agua", body: "Doble descarga 3/4,5 L y modo eco. Hasta un 40% menos que un inodoro convencional español." },
      { title: "Limpieza sin esfuerzo", body: "Esmalte CleanFlow antical y sin reborde interior: el agua barre toda la superficie en cada descarga." },
      { title: "Operación silenciosa", body: "Cierre amortiguado de tapa y asiento, descarga rediseñada por debajo de 45 dB. Pensado también para la noche." },
    ],
    features: [
      "Bidé integrado con boquilla de acero inoxidable",
      "Agua templada con calentador instantáneo",
      "5 niveles de temperatura del asiento",
      "Secador de aire caliente regulable",
      "Cierre amortiguado de tapa y asiento",
      "Descarga dual 3/4,5 L Watersense",
      "Esmalte antical CleanFlow sin reborde",
      "Boquilla autolimpiante antes y después de cada uso",
      "Mando inalámbrico de pared incluido",
      "Modo eco con apagado automático",
    ],
    technical: [
      {
        group: "Limpieza & bidé",
        specs: [
          { label: "Modos de limpieza", value: "Posterior · Femenino · Suave" },
          { label: "Presión del agua", value: "5 niveles ajustables" },
          { label: "Temperatura del agua", value: "32 – 40 ºC" },
          { label: "Boquilla", value: "Acero inoxidable autolimpiante" },
          { label: "Filtro de agua", value: "Cerámico sustituible" },
        ],
      },
      {
        group: "Confort",
        specs: [
          { label: "Asiento calefactado", value: "5 niveles · 28 – 40 ºC" },
          { label: "Secador de aire", value: "3 niveles · 35 – 55 ºC" },
          { label: "Cierre", value: "Soft close tapa y asiento" },
          { label: "Sensor de presencia", value: "Activación de pre-rociado" },
        ],
      },
      {
        group: "Descarga & agua",
        specs: [
          { label: "Tipo de descarga", value: "Dual 3 / 4,5 L" },
          { label: "Sistema", value: "Sin reborde, vórtice silencioso" },
          { label: "Presión recomendada", value: "0,7 – 7,5 bar" },
          { label: "Consumo medio", value: "≈ 3,2 L/uso" },
        ],
      },
      {
        group: "Eléctrico",
        specs: [
          { label: "Alimentación", value: "220 – 240 V · 50 Hz" },
          { label: "Potencia máxima", value: "1.200 W" },
          { label: "Consumo en standby", value: "0,8 W" },
          { label: "Protección", value: "IPX4" },
          { label: "Conexión", value: "Toma Schuko a 1 m" },
        ],
      },
    ],
    dimensions: [
      { label: "Largo", value: "680 mm" },
      { label: "Ancho", value: "390 mm" },
      { label: "Alto total", value: "775 mm" },
      { label: "Altura asiento", value: "415 mm" },
      { label: "Distancia a pared", value: "Min. 30 mm" },
      { label: "Peso", value: "42 kg" },
    ],
    inTheBox: [
      "Cuerpo monobloque cerámico ESENZA",
      "Asiento inteligente preinstalado",
      "Mando inalámbrico de pared con soporte",
      "Latiguillo flexible de agua 3/8\"",
      "Junta de salida y kit de fijación al suelo",
      "Manual en español, gallego e inglés",
    ],
    installation: [
      "Toma de agua fría a 3/8\" y desagüe estándar a suelo de Ø100 mm.",
      "Enchufe Schuko con toma de tierra a menos de 1 metro.",
      "Tu fontanero de confianza realiza la conexión en 60–90 minutos.",
      "Vinculas el mando, eliges tus preferencias y empiezas a usarlo.",
    ],
    warranty: {
      years: 5,
      details: "5 años de garantía en cerámica y electrónica con SAT propio en Galicia. Reposición de boquilla y filtro a coste cero durante el primer año.",
    },
    faqs: [
      { q: "¿Necesito obra para instalar el ESENZA?", a: "No. Sustituye a tu inodoro actual con las mismas conexiones. Solo necesitas un enchufe cerca; si no lo tienes, un electricista lo coloca en menos de una hora." },
      { q: "¿Cuánta agua consume?", a: "Descarga dual de 3 y 4,5 litros, con un consumo medio de 3,2 L por uso. Hasta un 40% menos que un inodoro convencional." },
      { q: "¿Qué pasa si se va la luz?", a: "Mantienes la descarga manual de emergencia. Cuando vuelve la corriente, el inodoro recupera tus ajustes guardados." },
      { q: "¿Hace ruido por la noche?", a: "El cierre y la descarga están por debajo de 45 dB. Es más silencioso que una conversación en voz baja." },
    ],
    price: 1490,
  },
  {
    id: "AURA-COMPACT",
    name: "Inodoro inteligente AURA Compact",
    tagline: "Confort completo en formato reducido.",
    description: "Toda la electrónica AURA en una pieza pensada para baños donde cada centímetro cuenta.",
    longDescription:
      "AURA Compact reduce la huella sin reducir la experiencia. Sensor de proximidad, apertura y descarga automáticas, filtro de carbón activo y luz nocturna LED en un cuerpo cerámico esculpido de 65 cm. Ideal para baños de invitados, áticos o reformas donde no sobra espacio pero no se renuncia al confort.",
    img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
    gallery: AURA_COMPACT_GALLERY,
    badges: ["Compact", "Sensor IR"],
    highlights: [
      { label: "Largo", value: "650 mm" },
      { label: "Sensor", value: "Apertura auto" },
      { label: "Garantía", value: "5 años" },
    ],
    pitch: [
      { title: "Hecho para baños pequeños", body: "Solo 650 mm de fondo. Cabe donde otros inodoros inteligentes no llegan, sin sacrificar funciones." },
      { title: "Sin contacto, más higiene", body: "Apertura, cierre y descarga automáticos por sensor infrarrojo. Llegas, lo usas, te vas: el inodoro hace el resto." },
      { title: "Aire siempre limpio", body: "Filtro de carbón activo desodorizante con ventilador silencioso integrado en el aro." },
      { title: "Luz para la noche", body: "LED ambiental RGB con sensor crepuscular. Te orienta sin encender la luz principal del baño." },
      { title: "Personalización por usuario", body: "App Elora Smart con perfiles individuales: temperatura del agua, presión, secador y modo guardados por persona." },
      { title: "Tranquilidad de uso", body: "Modo niños y limitador de temperatura. Asiento antibacteriano con plata iónica." },
    ],
    features: [
      "Apertura y cierre automáticos por sensor IR",
      "Descarga inteligente sin contacto",
      "Filtro de carbón activo desodorizante",
      "Luz nocturna LED RGB regulable",
      "App Elora Smart con perfiles de usuario",
      "Asiento con tratamiento antibacteriano",
      "Modo eco -40% consumo de agua",
      "Boquilla doble con limpieza automática",
      "Modo masaje pulsante en bidé",
      "Mando inalámbrico magnético incluido",
    ],
    technical: [
      {
        group: "Limpieza & bidé",
        specs: [
          { label: "Modos", value: "Posterior · Femenino · Suave · Masaje" },
          { label: "Presión", value: "6 niveles" },
          { label: "Temperatura agua", value: "32 – 40 ºC" },
          { label: "Boquilla", value: "Doble salida acero inox" },
          { label: "Filtro agua", value: "Sustituible cada 12 meses" },
        ],
      },
      {
        group: "Sensores & control",
        specs: [
          { label: "Sensor presencia", value: "Infrarrojo, alcance 60 cm" },
          { label: "Apertura/cierre", value: "Automático con tapa motorizada" },
          { label: "Descarga", value: "Automática al levantarse" },
          { label: "Conectividad", value: "Wi-Fi 2.4 GHz · App iOS/Android" },
          { label: "Mando", value: "Inalámbrico magnético de pared" },
        ],
      },
      {
        group: "Aire & luz",
        specs: [
          { label: "Filtro desodorizante", value: "Carbón activo + ventilador" },
          { label: "Luz nocturna", value: "LED RGB · 8 colores" },
          { label: "Sensor crepuscular", value: "Sí" },
        ],
      },
      {
        group: "Eléctrico & agua",
        specs: [
          { label: "Alimentación", value: "220 – 240 V · 50 Hz" },
          { label: "Potencia máxima", value: "1.400 W" },
          { label: "Consumo standby", value: "0,6 W" },
          { label: "Descarga", value: "Dual 3 / 4,5 L" },
          { label: "Presión recomendada", value: "0,7 – 7,5 bar" },
          { label: "Protección", value: "IPX4" },
        ],
      },
    ],
    dimensions: [
      { label: "Largo", value: "650 mm" },
      { label: "Ancho", value: "385 mm" },
      { label: "Alto total", value: "750 mm" },
      { label: "Altura asiento", value: "410 mm" },
      { label: "Distancia a pared", value: "Min. 25 mm" },
      { label: "Peso", value: "44 kg" },
    ],
    inTheBox: [
      "Cuerpo monobloque cerámico AURA Compact",
      "Asiento inteligente con sensor IR preinstalado",
      "Mando magnético de pared con soporte",
      "Latiguillo flexible reforzado 3/8\"",
      "Filtro de carbón activo de repuesto",
      "Kit de fijación oculta y junta de salida",
      "Guía rápida y manual completo",
    ],
    installation: [
      "Conexión a toma de agua y desagüe estándar a suelo.",
      "Enchufe Schuko a menos de 1,2 m con toma de tierra.",
      "Instalación por fontanero en 60–90 minutos.",
      "Vinculación con la app Elora Smart por Wi-Fi 2.4 GHz.",
      "Configuración de perfiles personalizados desde la app.",
    ],
    warranty: {
      years: 5,
      details: "5 años en cerámica y electrónica. Sustitución de filtros y boquillas durante el primer año sin coste, con SAT propio en Galicia y atención en gallego o castellano.",
    },
    faqs: [
      { q: "¿Cabe en un baño pequeño?", a: "Sí. Con 650 mm de fondo es uno de los inodoros inteligentes más compactos del mercado. Caben en huecos donde otros modelos no entran." },
      { q: "¿Funciona la app fuera de casa?", a: "Sí. Puedes precalentar el asiento o activar el modo eco desde cualquier sitio mientras tu inodoro tenga conexión Wi-Fi." },
      { q: "¿La descarga automática gasta más agua?", a: "No. Usa la descarga corta de 3 L por defecto y cambia a 4,5 L solo si detecta uso prolongado." },
      { q: "¿Y si me quiero olvidar del sensor?", a: "Puedes desactivar el modo automático desde la app o el mando y operar todo manualmente." },
    ],
    price: 2500,
  },
  {
    id: "AURA-SUSPENDIDO",
    name: "Váter japonés AURA Suspendido",
    tagline: "La pieza arquitectónica.",
    description: "Un inodoro inteligente flotante que libera el suelo y redefine el baño.",
    longDescription:
      "AURA Suspendido es nuestra interpretación arquitectónica del confort: una pieza flotante con cisterna empotrada Geberit Sigma, líneas continuas, pulsador en cristal templado y la electrónica completa de la familia AURA. Diseñado para reformas integrales que buscan ligereza visual, limpieza absoluta del suelo y una declaración de diseño en el baño.",
    img: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
    gallery: AURA_SUSP_GALLERY,
    badges: ["Suspendido", "Cisterna empotrada"],
    highlights: [
      { label: "Instalación", value: "Suspendida" },
      { label: "Cisterna", value: "Geberit Sigma" },
      { label: "Garantía", value: "7 años" },
    ],
    pitch: [
      { title: "El suelo libre", body: "Al volar sobre el suelo, el inodoro deja la limpieza al alcance de una mopa. Sin recovecos, sin cal, sin esfuerzo." },
      { title: "Cisterna empotrada premium", body: "Bastidor metálico Geberit Duofix con cisterna Sigma de 3/6 L. Acceso de mantenimiento por el pulsador, sin romper pared." },
      { title: "Pulsador en cristal templado", body: "Doble pulsador en vidrio negro o blanco, encastrado al ras. Diseño plano que dialoga con el alicatado." },
      { title: "Electrónica AURA completa", body: "Sensor IR, app, perfiles, filtro de carbón activo y luz nocturna. Todo lo de AURA Compact, en formato suspendido." },
      { title: "Iluminación indirecta LED", body: "Tira LED bajo el aro que dibuja la pieza por la noche y guía sin deslumbrar." },
      { title: "Hecho para durar", body: "Estructura para 400 kg de carga estática y cerámica de doble cocción de 12 mm de espesor." },
    ],
    features: [
      "Bastidor Geberit Duofix incluido",
      "Cisterna Sigma 3/6 L con doble pulsador",
      "Pulsador en cristal templado (negro o blanco)",
      "Sensor IR de apertura y descarga",
      "Bidé con presión y temperatura ajustables",
      "Filtro de carbón activo desodorizante",
      "Iluminación LED indirecta bajo aro",
      "App Elora Smart con perfiles",
      "Asiento con cierre amortiguado",
      "Tratamiento antibacteriano de plata iónica",
    ],
    technical: [
      {
        group: "Estructura & instalación",
        specs: [
          { label: "Bastidor", value: "Geberit Duofix 1.120 mm" },
          { label: "Cisterna", value: "Geberit Sigma 3/6 L" },
          { label: "Pulsador", value: "Cristal templado, encastrado" },
          { label: "Carga máxima", value: "400 kg estáticos" },
          { label: "Distancia bastidor-pared", value: "Mínimo 80 mm" },
        ],
      },
      {
        group: "Limpieza & bidé",
        specs: [
          { label: "Modos", value: "Posterior · Femenino · Suave · Masaje" },
          { label: "Presión", value: "6 niveles" },
          { label: "Temperatura agua", value: "32 – 40 ºC" },
          { label: "Boquilla", value: "Doble salida acero inox autolimpiante" },
        ],
      },
      {
        group: "Sensores & control",
        specs: [
          { label: "Sensor presencia", value: "Infrarrojo, alcance 60 cm" },
          { label: "Apertura/cierre", value: "Automático con tapa motorizada" },
          { label: "Descarga", value: "Automática al levantarse" },
          { label: "Conectividad", value: "Wi-Fi 2.4 GHz · App iOS/Android" },
        ],
      },
      {
        group: "Eléctrico",
        specs: [
          { label: "Alimentación", value: "220 – 240 V · 50 Hz" },
          { label: "Potencia máxima", value: "1.400 W" },
          { label: "Consumo standby", value: "0,6 W" },
          { label: "Protección", value: "IPX4" },
        ],
      },
    ],
    dimensions: [
      { label: "Largo", value: "540 mm" },
      { label: "Ancho", value: "370 mm" },
      { label: "Altura asiento", value: "400 – 430 mm (ajustable)" },
      { label: "Altura bastidor", value: "1.120 mm" },
      { label: "Distancia a pared", value: "Min. 80 mm" },
      { label: "Peso (taza)", value: "38 kg" },
    ],
    inTheBox: [
      "Taza cerámica AURA Suspendido",
      "Bastidor Geberit Duofix con cisterna Sigma",
      "Pulsador de cristal templado (negro o blanco)",
      "Asiento inteligente con sensor IR preinstalado",
      "Mando magnético de pared con soporte",
      "Kit de fijación y tornillería de acero inox",
      "Manual completo de instalación y uso",
    ],
    installation: [
      "Instalación del bastidor Geberit Duofix en tabique o pared.",
      "Alicatado y acabado de la pared (por tu instalador).",
      "Colocación de la taza y conexión de la electrónica.",
      "Enchufe Schuko oculto en el tabique a menos de 1,2 m.",
      "Vinculación con la app Elora Smart y configuración de perfiles.",
    ],
    warranty: {
      years: 7,
      details: "7 años de garantía en cerámica, electrónica y bastidor Geberit. SAT propio en Galicia con atención en gallego o castellano. Recogida y reposición incluidas.",
    },
    faqs: [
      { q: "¿Necesito obra para instalar el AURA Suspendido?", a: "Sí. Al ser un inodoro suspendido, requiere la instalación del bastidor Geberit en un tabique y acceso al espacio interior para la cisterna. Es habitual en reformas integrales de baño." },
      { q: "¿Puedo elegir la altura del asiento?", a: "Sí. El bastidor Geberit Duofix permite ajustar la altura de la taza entre 400 y 430 mm antes del alicatado final." },
      { q: "¿El pulsador de cristal viene en dos colores?", a: "Sí. Puedes elegir entre pulsador en cristal negro o blanco al realizar el pedido. Ambos son encastrados y al ras con el alicatado." },
      { q: "¿Qué garantía tiene el bastidor Geberit?", a: "El bastidor Geberit Duofix tiene garantía de fabricante de 10 años. Nosotros cubrimos la electrónica y la cerámica durante 7 años adicionales." },
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

const ALL_PRODUCTS = [...PRODUCTS, ...EXTRA_PRODUCTS];

// ─── Tipos ─────────────────────────────────────────────────────────────────────
type CartItem = { id: string; name: string };

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [contactForm, setContactForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [contactSent, setContactSent] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  const removeFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

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
            <img src={LOGO_URL} alt="Elora Smart" className="h-7 w-auto select-none" />
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
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
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
        {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex" onClick={() => setIsCartOpen(false)}>
            <div className="flex-1 bg-foreground/40 backdrop-blur-sm" />
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md h-full bg-background border-l border-border flex flex-col">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <p className="font-display text-lg uppercase tracking-widest">Carrito · {cart.length}</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} aria-label="Cerrar carrito" className="outline-none">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">
                {cart.length === 0 ? (
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">No hay productos en el carrito.</p>
                ) : (
                  <ul className="flex flex-col gap-5">
                    {cart.map((item, idx) => (
                      <li key={`${item.id}-${idx}`} className="flex items-start justify-between gap-4 border-b border-border pb-5">
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/50 mb-1">{item.id}</p>
                          <p className="font-display text-base uppercase tracking-wide leading-tight">{item.name}</p>
                          <p className="font-body text-xs text-foreground/60 mt-2">Solicitud de presupuesto</p>
                        </div>
                        <button onClick={() => removeFromCart(idx)} className="font-body text-[10px] uppercase tracking-widest text-foreground/50 hover:text-accent-deep transition-colors">
                          Quitar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-8 py-6 border-t border-border flex flex-col gap-4">
                <p className="font-body text-xs text-foreground/60 leading-relaxed">
                  Te contactaremos para confirmar disponibilidad, instalación y precio personalizado según tu baño.
                </p>
                <a
                  href={`https://wa.me/34614451901?text=Hola,%20me%20interesa%20${cart.map(i => i.name).join('%20y%20')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 hover:bg-accent-deep transition-colors ${cart.length === 0 ? "opacity-40 pointer-events-none" : ""}`}
                >
                  <Send className="w-4 h-4" />
                  Solicitar presupuesto
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── MAIN SCROLLING CONTENT ────────────────────────────────────────── */}
        <main
          ref={scrollContainerRef}
          className="flex-1 h-full overflow-y-auto hide-scrollbar relative bg-background scroll-smooth"
        >
          {selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAdd={(p) => addToCart({ id: p.id, name: p.name })}
            />
          ) : (
            <>
              {/* ── CAPÍTULO 1: VISIÓN ──────────────────────────────────────── */}
              <section
                ref={setSectionRef(0)}
                data-index="0"
                className="min-h-[100dvh] w-full relative overflow-hidden bg-black flex flex-col justify-center"
              >
                <img src={HERO_IMAGE} alt="Elora Smart" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-20 max-w-3xl pt-20 pb-32">
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
                className="min-h-[100dvh] w-full relative overflow-hidden bg-background px-6 py-10 md:p-12 flex flex-col"
              >
                <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
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

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-[auto] md:grid-rows-2 gap-3 md:gap-4">
                    {/* Video hero */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 40 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-5%" }}
                      className="md:col-span-7 md:row-span-2 relative overflow-hidden border border-border bg-black min-h-[200px]"
                    >
                      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                        <iframe
                          src="https://www.youtube-nocookie.com/embed/TDs15k-NTGU?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=TDs15k-NTGU&start=15"
                          title="Background Video"
                          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[200px] min-w-[200px] pointer-events-none"
                          style={{ transform: "translate(-50%, -50%) scale(1.5)" }}
                          allow="autoplay; encrypted-media"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />
                      <div className="absolute top-6 left-6 right-6 flex items-start gap-3 pointer-events-none">
                        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white bg-accent-deep border border-accent-deep px-2 py-1">A Coruña · Galicia</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white pointer-events-none">
                        <p className="font-display text-2xl md:text-3xl uppercase tracking-wide leading-tight max-w-md mb-4">
                          De la cantera gallega<br />al baño contemporáneo.
                        </p>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="font-display text-xl uppercase tracking-widest">Pureza</p>
                            <p className="font-body text-[10px] text-white/70 uppercase tracking-widest">Cerámica blanca</p>
                          </div>
                          <div>
                            <p className="font-display text-xl uppercase tracking-widest">Solidez</p>
                            <p className="font-body text-[10px] text-white/70 uppercase tracking-widest">Granito local</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Equipo */}
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-5%" }}
                      className="md:col-span-5 relative overflow-hidden border border-border p-5 md:p-6 flex flex-col justify-between gap-4 text-white min-h-[220px]"
                    >
                      <img
                        src="https://violet-antelope-234366.hostingersite.com/wp-content/uploads/2026/06/elora-erquipo.jpg"
                        alt="Equipo Elora"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between">
                        <Cpu className="w-5 h-5 text-accent" />
                        <span className="font-body text-[10px] uppercase tracking-widest text-white/60">Galicia · 2024</span>
                      </div>
                      <div className="relative z-10">
                        <h3 className="font-display text-xl uppercase tracking-wide mb-2">Marca gallega, mirada global.</h3>
                        <p className="font-body text-xs md:text-sm text-white/80 leading-relaxed">
                          Somos un equipo gallego que combina la mejor electrónica internacional con el cuidado artesanal del noroeste. Atención cercana, en gallego o castellano.
                        </p>
                      </div>
                    </motion.div>

                    {/* Cards pequeñas */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
                      {[
                        { icon: Droplets, title: "Higiene total", body: "Limpieza por sensores y agua templada." },
                        { icon: Leaf, title: "Ecológico", body: "Hasta un -40% en consumo de agua." },
                      ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                          <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-background border border-border p-4 md:p-5 flex flex-col justify-between gap-3 text-foreground transition-colors hover:border-accent-deep/50"
                          >
                            <Icon className="w-5 h-5 text-accent-deep" />
                            <div>
                              <h3 className="font-display text-base md:text-lg uppercase tracking-wide mb-1">{card.title}</h3>
                              <p className="font-body text-[11px] md:text-xs text-foreground/70 leading-relaxed">{card.body}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
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
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
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

                  <div className="mt-10 md:mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-border pt-8">
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
                <div className="absolute bottom-8 right-8 md:right-16 font-display text-lg text-foreground/20">03</div>
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
                      Tres modelos. Una misma filosofía: higiene avanzada, diseño premium y la tranquilidad del servicio Elora detrás de cada pieza.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {ALL_PRODUCTS.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => openProduct(prod)}
                        className="group flex flex-col h-full bg-background border border-border p-4 text-left hover:border-accent-deep transition-colors outline-none"
                      >
                        <div className="bg-muted mb-5 overflow-hidden relative border border-border h-[260px]">
                          <img
                            src={prod.img}
                            alt={prod.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                          <p className="font-body text-[10px] text-foreground/50 uppercase tracking-widest">{prod.id}</p>
                          <h3 className="font-display text-lg uppercase tracking-wide leading-tight">{prod.name}</h3>
                          <p className="font-display text-sm uppercase tracking-wide text-accent-deep leading-tight">{prod.tagline}</p>
                          <p className="font-body text-sm text-foreground/70 leading-relaxed">{prod.description}</p>
                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <span className="font-display text-lg tracking-wide text-foreground">
                              {prod.price.toLocaleString('es-ES')} €
                            </span>
                            <span className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-foreground group-hover:text-accent-deep transition-colors">
                              Ver detalle
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
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
