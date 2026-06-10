import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, X, Plus, Minus, ChevronDown, ArrowRight, Menu, MessageCircle, Star, Check, Zap, Droplets, Wind, Thermometer, Volume2, Shield, Smartphone, Mic } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { ProductDetail, type Product } from "@/components/ProductDetail";
import { useInView } from "@/hooks/useInView";

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";
const HERO_BG = "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg";

// ─── Imágenes reales de elorasmart.com ────────────────────────────────────────
const IMGS = {
  esenzaHero: "https://elorasmart.com/wp-content/uploads/2025/12/esenza2-800x800.jpg",
  esenza1: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZa-12.webp",
  esenza2: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-9.webp",
  esenza3: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-10.webp",
  esenza4: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-7.webp",
  esenza5: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-8.webp",
  esenza6: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-2.webp",
  esenza7: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-11.webp",
  esenza8: "https://elorasmart.com/wp-content/uploads/2025/12/ESENZA-13.webp",
  auraCompactHero: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-compact-p-800x800.jpg",
  auraCompact1: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-1.jpg",
  auraCompact2: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-11.jpg",
  auraCompact3: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-6.jpg",
  auraCompact4: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-10.jpg",
  auraCompact5: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-8.jpg",
  auraCompact6: "https://elorasmart.com/wp-content/uploads/2025/05/aura-compact-3.jpg",
  auraSuspHero: "https://elorasmart.com/wp-content/uploads/2025/05/AURA-suspendido-p-800x800.jpg",
  auraSusp1: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido1.jpg",
  auraSusp2: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-2.jpg",
  auraSusp3: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-3.jpg",
  auraSusp4: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-111.jpg",
  auraSusp5: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-9.jpg",
  auraSusp6: "https://elorasmart.com/wp-content/uploads/2025/05/aura-suspendido-6.jpg",
  mando: "https://elorasmart.com/wp-content/uploads/2025/05/mando-a-distancia-1024x825.jpg",
  voz: "https://elorasmart.com/wp-content/uploads/2025/05/control-por-voz-768x635.jpg",
  secado: "https://elorasmart.com/wp-content/uploads/2025/12/secado-30seg.webp",
  usoPie: "https://elorasmart.com/wp-content/uploads/2025/05/uso-de-pie.png",
  usoSentada: "https://elorasmart.com/wp-content/uploads/2025/05/uso-sentada.png",
};

interface CartItem { product: Product; qty: number; }

// ─── Datos de productos (reales de elorasmart.com) ────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "esenza",
    name: "ESENZA",
    tagline: "El esencial inteligente.",
    description: "El primer paso al confort japonés. Todas las funciones esenciales con un precio más contenido.",
    longDescription: "ESENZA a suelo es el inodoro inteligente japonés de ELORA SMART, ideal para reformas de baño y para sustituir un inodoro tradicional sin cambiar la instalación. Mantiene todas las funciones esenciales de la gama ESENZA con instalación sencilla, máxima estabilidad y un diseño de líneas limpias para baños modernos.",
    img: IMGS.esenzaHero,
    gallery: [IMGS.esenza1, IMGS.esenza2, IMGS.esenza3, IMGS.esenza4, IMGS.esenza5, IMGS.esenza6, IMGS.esenza7, IMGS.esenza8],
    price: 1490,
    badges: ["Best seller", "Sin obra"],
    highlights: [
      { label: "Instalación", value: "A suelo" },
      { label: "Garantía cerámica", value: "10 años" },
      { label: "Garantía tech", value: "3 años" },
      { label: "Ruido", value: "≤59 dB" },
    ],
    features: [
      "Apertura, cierre y descarga automáticos",
      "Sensor de pie integrado — sin tocar nada",
      "Detección de postura (pie/sentado)",
      "Lavado posterior, femenino y móvil",
      "Agua caliente instantánea (33°C, 37°C, 39°C)",
      "Boquilla autolimpiable en acero inoxidable",
      "Asiento CLIMADAPT calefactado",
      "Secado Súper-Tifón en menos de 30 segundos",
      "Mando a distancia en español (2 usuarios)",
      "Rueda lateral táctil de diseño futurista",
      "Luz nocturna LED",
      "Diseño rimless — limpieza en segundos",
      "Tanque integrado de 5 litros",
      "Funcionamiento silencioso ≤59 dB",
    ],
    pitch: [
      { title: "Automatización total", body: "Sensor detecta tu presencia y levanta la tapa automáticamente. Al terminar, baja y descarga solo." },
      { title: "Higiene con agua", body: "Lavado posterior, femenino y móvil. Temperatura ajustable en 4 niveles. Boquilla autolimpiable." },
      { title: "Confort CLIMADAPT", body: "Asiento calefactado que se adapta a la temperatura ambiente. Secado en menos de 30 segundos." },
    ],
    technical: [
      { group: "Dimensiones", specs: [{ label: "Largo", value: "700 mm" }, { label: "Ancho", value: "380 mm" }, { label: "Alto", value: "490 mm" }] },
      { group: "Agua", specs: [{ label: "Tanque", value: "5 litros" }, { label: "Presión mínima", value: "Sin requisito" }, { label: "Temperatura", value: "33–39°C" }] },
    ],
    dimensions: [{ label: "Largo", value: "700 mm" }, { label: "Ancho", value: "380 mm" }, { label: "Alto", value: "490 mm" }],
    inTheBox: ["Inodoro ESENZA", "Mando a distancia", "Manual en español", "Kit de instalación"],
    installation: ["Instalación a suelo estándar", "Solo necesitas un enchufe", "Tu fontanero de confianza"],
    warranty: { years: 3, details: "10 años cerámica · 3 años tecnología (ampliable a 5 con Premium Care +249€)" },
    faqs: [
      { q: "¿Necesita obras?", a: "No. Solo un enchufe cerca y tu fontanero habitual." },
      { q: "¿Funciona con baja presión?", a: "Sí. Tiene tanque integrado de 5 litros." },
    ],
  },
  {
    id: "aura-compact",
    name: "AURA Compact",
    tagline: "Confort completo en formato reducido.",
    description: "Toda la tecnología AURA en una pieza pensada para baños donde cada centímetro cuenta.",
    longDescription: "El inodoro inteligente AURA COMPACT combina tecnología y un diseño compacto, ofreciendo todas las ventajas: apertura automática, lavado personalizable, secado rápido, asiento climatizado, esterilización UV, desodorización, control por voz y mando, todo con eficiencia energética y ahorro de espacio.",
    img: IMGS.auraCompactHero,
    gallery: [IMGS.auraCompact1, IMGS.auraCompact2, IMGS.auraCompact3, IMGS.auraCompact4, IMGS.auraCompact5, IMGS.auraCompact6],
    price: 2500,
    badges: ["Compact", "Sensor IR"],
    highlights: [
      { label: "Largo", value: "650 mm" },
      { label: "Garantía", value: "5 años tech" },
      { label: "UV", value: "Esterilización" },
      { label: "Voz", value: "Control" },
    ],
    features: [
      "Sensor inteligente ClimAdapt",
      "Lavado personal con agua tibia",
      "Secado con aire caliente",
      "Desodorización automática",
      "Asiento calefactable",
      "Escudo de espuma higiénica anti-salpicaduras",
      "Uso eficiente del agua — descarga dual",
      "Autolimpieza de boquillas",
      "Modo nocturno con luz LED",
      "Funcionamiento silencioso",
      "Control remoto en español",
      "Control por voz (inglés)",
      "Ideal para toda la familia",
    ],
    pitch: [
      { title: "Sensor ClimAdapt", body: "Ajusta automáticamente temperatura del asiento, agua y secador según la estación." },
      { title: "Escudo de espuma", body: "Barrera de espuma higiénica que evita salpicaduras y bloquea olores." },
      { title: "Esterilización UV", body: "Lámpara UV desinfecta por completo. Desodorización automática del ambiente." },
    ],
    technical: [
      { group: "Dimensiones", specs: [{ label: "Largo", value: "650 mm" }, { label: "Ancho", value: "370 mm" }, { label: "Alto", value: "480 mm" }] },
      { group: "Funciones", specs: [{ label: "UV", value: "Sí" }, { label: "Desodorización", value: "Sí" }, { label: "Control voz", value: "Sí (inglés)" }] },
    ],
    dimensions: [{ label: "Largo", value: "650 mm" }, { label: "Ancho", value: "370 mm" }, { label: "Alto", value: "480 mm" }],
    inTheBox: ["Inodoro AURA Compact", "Mando a distancia", "Manual en español", "Kit de instalación"],
    installation: ["Instalación a suelo estándar", "Solo necesitas un enchufe", "Tu fontanero de confianza"],
    warranty: { years: 5, details: "5 años tecnología incluidos · 10 años cerámica" },
    faqs: [
      { q: "¿Qué diferencia hay con ESENZA?", a: "AURA incluye espuma anti-salpicaduras, UV, desodorización, aromaterapia y control por voz." },
      { q: "¿Cabe en baños pequeños?", a: "Sí, con solo 650 mm de largo es ideal para baños compactos." },
    ],
  },
  {
    id: "aura-suspendido",
    name: "AURA Suspendido",
    tagline: "La pieza arquitectónica.",
    description: "Un inodoro inteligente flotante que libera el suelo y redefine el baño.",
    longDescription: "El váter japonés AURA suspendido ofrece todo el confort del AURA en un diseño flotante, ofreciendo una estética moderna y minimalista. El suelo queda totalmente libre dando una imagen de orden y un efecto más despejado. Puedes ajustar la altura a tu gusto en el momento de la instalación.",
    img: IMGS.auraSuspHero,
    gallery: [IMGS.auraSusp1, IMGS.auraSusp2, IMGS.auraSusp3, IMGS.auraSusp4, IMGS.auraSusp5, IMGS.auraSusp6],
    price: 2600,
    badges: ["Suspendido", "Cisterna empotrada"],
    highlights: [
      { label: "Instalación", value: "Suspendida" },
      { label: "Altura", value: "Regulable" },
      { label: "Garantía", value: "5 años tech" },
      { label: "Diseño", value: "Flotante" },
    ],
    features: [
      "Sensor inteligente ClimAdapt",
      "Lavado personal con agua tibia",
      "Secado con aire caliente",
      "Desodorización automática",
      "Asiento calefactable",
      "Escudo de espuma higiénica anti-salpicaduras",
      "Uso eficiente del agua — descarga dual",
      "Autolimpieza de boquillas",
      "Modo nocturno con luz LED",
      "Funcionamiento silencioso",
      "Control remoto en español",
      "Control por voz (inglés)",
      "Altura regulable en instalación",
      "Diseño flotante — suelo completamente libre",
    ],
    pitch: [
      { title: "Diseño flotante", body: "El suelo queda completamente libre. Imagen de orden, limpieza y amplitud visual." },
      { title: "Altura regulable", body: "Ajusta la altura a tu gusto en el momento de la instalación." },
      { title: "Tecnología AURA completa", body: "Toda la electrónica AURA: espuma, UV, desodorización, control por voz y mando." },
    ],
    technical: [
      { group: "Instalación", specs: [{ label: "Tipo", value: "Suspendido" }, { label: "Altura", value: "Regulable" }, { label: "Cisterna", value: "Empotrada" }] },
      { group: "Funciones", specs: [{ label: "UV", value: "Sí" }, { label: "Desodorización", value: "Sí" }, { label: "Control voz", value: "Sí (inglés)" }] },
    ],
    dimensions: [{ label: "Largo", value: "580 mm" }, { label: "Ancho", value: "370 mm" }, { label: "Proyección", value: "Regulable" }],
    inTheBox: ["Inodoro AURA Suspendido", "Mando a distancia", "Manual en español", "Kit de instalación suspendida"],
    installation: ["Instalación suspendida", "Requiere cisterna empotrada", "Altura regulable en instalación"],
    warranty: { years: 5, details: "5 años tecnología incluidos · 10 años cerámica" },
    faqs: [
      { q: "¿Necesita cisterna empotrada?", a: "Sí, se instala con cisterna empotrada en pared." },
      { q: "¿Puedo ajustar la altura?", a: "Sí, la altura se regula en el momento de la instalación." },
    ],
  },
];

const SECTIONS = ["Visión", "Esencia", "Por Qué", "Colección", "Contacto"];

// ─── Componente AnimatedSection ───────────────────────────────────────────────
function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "slide-left" | "slide-right" | "scale-in" | "fade-in";
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const animClass = {
    "fade-up": "animate-fade-up",
    "slide-left": "animate-slide-left",
    "slide-right": "animate-slide-right",
    "scale-in": "animate-scale-in",
    "fade-in": "animate-fade-in",
  }[animation];

  return (
    <div
      ref={ref}
      className={`${className} ${inView ? `${animClass}` : "opacity-0"}`}
      style={inView ? { animationDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
}

// ─── Componente FeatureCard ───────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group p-6 border border-border bg-background hover:border-accent transition-all duration-500 ${inView ? "animate-fade-up" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 flex items-center justify-center border border-border mb-5 group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
        <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-base uppercase tracking-wide mb-2">{title}</h3>
      <p className="font-body text-sm text-foreground/60 leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Componente ProductCard ───────────────────────────────────────────────────
function ProductCard({ product, onView, onAddToCart, delay }: {
  product: Product;
  onView: () => void;
  onAddToCart: (p: Product) => void;
  delay: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`group flex flex-col bg-background border border-border transition-all duration-700 ${inView ? "animate-fade-up" : "opacity-0"} ${hovered ? "shadow-xl -translate-y-1" : ""}`}
      style={{ animationDelay: `${delay}ms`, transition: "box-shadow 0.4s ease, transform 0.4s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted h-[300px] md:h-[380px]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <span key={b} className="font-body text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 bg-foreground text-background">
              {b}
            </span>
          ))}
        </div>
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-foreground/5 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={onView}
            className="font-body text-[11px] uppercase tracking-[0.25em] px-6 py-3 bg-background text-foreground border border-border hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Ver detalles
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-1">{product.tagline}</p>
        <h3 className="font-display text-2xl uppercase tracking-wide mb-3">{product.name}</h3>
        <p className="font-body text-sm text-foreground/60 leading-relaxed mb-5 flex-1">{product.description}</p>

        {/* Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {product.highlights.slice(0, 4).map((h) => (
            <div key={h.label} className="border border-border p-2.5">
              <p className="font-body text-[9px] uppercase tracking-[0.15em] text-foreground/40">{h.label}</p>
              <p className="font-display text-sm uppercase tracking-wide mt-0.5">{h.value}</p>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40">Desde</p>
            <p className="font-display text-3xl tracking-tight">
              {product.price.toLocaleString("es-ES")} <span className="text-lg">€</span>
            </p>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="group/btn flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.25em] px-5 py-3 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-300"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente CartPanel ─────────────────────────────────────────────────────
function CartPanel({ items, onClose, onUpdate }: {
  items: CartItem[];
  onClose: () => void;
  onUpdate: (id: string, delta: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const whatsappMsg = encodeURIComponent(
    `Hola, me gustaría solicitar presupuesto para:\n${items.map((i) => `• ${i.product.name} x${i.qty} — ${(i.product.price * i.qty).toLocaleString("es-ES")}€`).join("\n")}\nTotal: ${total.toLocaleString("es-ES")}€`
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background border-l border-border flex flex-col h-full animate-slide-right">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl uppercase tracking-wide">Carrito</h2>
            <p className="font-body text-xs text-foreground/40 mt-0.5">{items.length} producto{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart className="w-12 h-12 text-foreground/20" strokeWidth={1} />
              <p className="font-body text-sm text-foreground/40">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                <img src={item.product.img} alt={item.product.name} className="w-20 h-20 object-cover bg-muted border border-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base uppercase tracking-wide truncate">{item.product.name}</p>
                  <p className="font-body text-xs text-foreground/50 mt-0.5">{item.product.tagline}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border">
                      <button onClick={() => onUpdate(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-body text-sm">{item.qty}</span>
                      <button onClick={() => onUpdate(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-display text-lg">{(item.product.price * item.qty).toLocaleString("es-ES")} €</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-foreground/60">Total estimado</span>
              <span className="font-display text-2xl">{total.toLocaleString("es-ES")} €</span>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=34614451901&text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-foreground text-background font-body text-xs uppercase tracking-[0.25em] hover:bg-accent hover:text-foreground transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar presupuesto
            </a>
            <p className="font-body text-[10px] text-foreground/30 text-center">
              Envío gratuito a España Peninsular · Sin compromiso
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente ContactForm ───────────────────────────────────────────────────
function ContactForm() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, me llamo ${form.nombre}.\nTeléfono: ${form.telefono}\nEmail: ${form.email}\n\n${form.mensaje}`
    );
    window.open(`https://api.whatsapp.com/send?phone=34614451901&text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div ref={ref} className={`${inView ? "animate-fade-up" : "opacity-0"}`}>
      {sent ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-12 h-12 border border-accent flex items-center justify-center">
            <Check className="w-6 h-6 text-accent" />
          </div>
          <p className="font-display text-xl uppercase tracking-wide">¡Mensaje enviado!</p>
          <p className="font-body text-sm text-foreground/60">Nos pondremos en contacto contigo muy pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50">Nombre *</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="bg-transparent border-b border-border pb-2 font-body text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50">Teléfono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="bg-transparent border-b border-border pb-2 font-body text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground transition-colors"
                placeholder="+34 600 000 000"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-transparent border-b border-border pb-2 font-body text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/50">Mensaje</label>
            <textarea
              rows={4}
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="bg-transparent border-b border-border pb-2 font-body text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-foreground transition-colors resize-none"
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          <button
            type="submit"
            className="group flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] px-8 py-4 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-300 mt-2"
          >
            Enviar mensaje
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [heroParallax, setHeroParallax] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Parallax on hero
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => {
      setHeroParallax(el.scrollTop * 0.35);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  // Active section detection
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollY = el.scrollTop;
      let current = 0;
      sectionRefs.current.forEach((sec, i) => {
        if (sec && sec.offsetTop - 120 <= scrollY) current = i;
      });
      setActiveSection(current);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  const scrollToSection = useCallback((i: number) => {
    const el = sectionRefs.current[i];
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateCart = (id: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i.product.id !== id) return [i];
        const newQty = i.qty + delta;
        return newQty <= 0 ? [] : [{ ...i, qty: newQty }];
      })
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!loaded) return <Loader onComplete={() => setLoaded(true)} />;

  // ─── Product Detail View ──────────────────────────────────────────────────
  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAdd={(p) => addToCart(p)}
      />
    );
  }

  return (
    <>
      {/* ─── Sidebar Navigation (desktop) ─────────────────────────────────── */}
      <nav className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col items-center justify-between py-8 px-4 w-16 border-r border-border bg-background/95 backdrop-blur-sm">
        <img src={LOGO_URL} alt="Elora" className="w-8 h-8 object-contain" />
        <div className="flex flex-col items-center gap-6">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => scrollToSection(i)}
              title={s}
              className={`writing-vertical-rl font-body text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                activeSection === i ? "text-accent" : "text-foreground/30 hover:text-foreground/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:text-accent transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-foreground text-[9px] font-body flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ─── Top Nav (mobile) ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center justify-between px-5 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
        <img src={LOGO_URL} alt="Elora Smart" className="h-7 w-auto" />
        <div className="flex items-center gap-4">
          <button onClick={() => setCartOpen(true)} className="relative p-1.5">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-foreground text-[9px] font-body flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMenuOpen(true)} className="p-1.5">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu ───────────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-8">
            <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 p-2">
              <X className="w-6 h-6" />
            </button>
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto mb-4 opacity-60" />
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => scrollToSection(i)}
                className={`font-display text-4xl uppercase tracking-wide transition-colors duration-300 ${
                  activeSection === i ? "text-accent" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main Scroll Container ─────────────────────────────────────────── */}
      <main ref={mainRef} className="fixed inset-0 lg:left-16 overflow-y-auto overflow-x-hidden hide-scrollbar">

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 1 — VISIÓN / HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Hero image with parallax */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={HERO_BG}
              alt="Elora Smart"
              className="w-full h-full object-cover object-center"
              style={{ transform: `translateY(${heroParallax}px) scale(1.1)` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-20 pt-20 lg:pt-0">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 animate-fade-in">
                <div className="w-8 h-px bg-accent" />
                <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent">Exclusivo Elora®</span>
              </div>

              {/* Main headline */}
              <h1
                className="font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] tracking-tight mb-8"
                style={{ clipPath: "inset(0 0 0 0)" }}
              >
                <span className="block animate-slide-left delay-100">Mejora</span>
                <span className="block animate-slide-left delay-200">tu calidad</span>
                <span className="block animate-slide-left delay-300 text-accent">de vida.</span>
              </h1>

              {/* Subheadline */}
              <p className="font-body text-base md:text-lg text-foreground/70 leading-relaxed max-w-xl mb-10 animate-fade-up delay-500">
                Hay un momento del día que es solo tuyo. Ya es hora de disfrutarlo. Inodoros inteligentes japoneses desde <strong className="text-foreground">1.490 €</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 animate-fade-up delay-600">
                <button
                  onClick={() => scrollToSection(3)}
                  className="group flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] px-8 py-4 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-300"
                >
                  Ver colección
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection(4)}
                  className="font-body text-[11px] uppercase tracking-[0.3em] px-8 py-4 border border-foreground/40 hover:border-foreground text-foreground/70 hover:text-foreground transition-all duration-300"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-1000 z-10">
            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/30">Scroll</span>
            <ChevronDown className="w-4 h-4 text-foreground/30 animate-bounce" />
          </div>

          {/* Ticker / marquee */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm overflow-hidden py-3 z-10">
            <div className="flex animate-marquee whitespace-nowrap">
              {Array(8).fill(null).map((_, i) => (
                <span key={i} className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/30 mx-8">
                  Apertura automática · Bidé integrado · Asiento calefactado · Secado en 30s · Control por voz · Garantía 10 años ·
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 2 — ESENCIA
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="relative py-24 md:py-32 px-8 md:px-16 lg:px-20"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image side */}
            <AnimatedSection animation="slide-left" className="relative">
              <div className="relative overflow-hidden aspect-[3/4] max-h-[700px]">
                <img
                  src={IMGS.esenza1}
                  alt="ESENZA"
                  className="w-full h-full object-cover"
                />
                {/* Floating badge */}
                <div className="absolute bottom-8 right-8 bg-background border border-border p-5 animate-float">
                  <p className="font-body text-[9px] uppercase tracking-[0.25em] text-foreground/40">Showroom en</p>
                  <p className="font-display text-xl uppercase tracking-wide mt-1">Galicia</p>
                  <div className="w-8 h-px bg-accent mt-2" />
                </div>
              </div>
              {/* Decorative line */}
              <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-accent/40" />
            </AnimatedSection>

            {/* Text side */}
            <div className="flex flex-col gap-8">
              <AnimatedSection animation="fade-up">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-px bg-accent" />
                  <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent">Nuestra esencia</span>
                </div>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.95] tracking-tight">
                  El baño que<br />siempre<br /><em className="not-italic text-accent">mereciste.</em>
                </h2>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={150}>
                <p className="font-body text-base text-foreground/65 leading-relaxed">
                  En Elora Smart creemos que el baño es el único momento del día que es completamente tuyo. Por eso diseñamos inodoros inteligentes que transforman ese momento en una experiencia de bienestar real.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={250}>
                <p className="font-body text-base text-foreground/65 leading-relaxed">
                  Tecnología japonesa, diseño europeo y atención personalizada en español. Feito en Galicia, pensado para toda España.
                </p>
              </AnimatedSection>

              {/* Stats */}
              <AnimatedSection animation="fade-up" delay={350}>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {[
                    { n: "10", label: "Años garantía cerámica" },
                    { n: "5", label: "Años garantía tech" },
                    { n: "59", label: "dB máx. silencioso" },
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="font-display text-4xl text-accent">{s.n}</span>
                      <span className="font-body text-[10px] uppercase tracking-[0.15em] text-foreground/50 leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={450}>
                <button
                  onClick={() => scrollToSection(2)}
                  className="group inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] text-foreground border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors duration-300 w-fit"
                >
                  Por qué elegirnos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 3 — POR QUÉ
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="relative py-24 md:py-32 bg-foreground text-background overflow-hidden"
        >
          {/* Background texture */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />

          <div className="relative px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 md:mb-20">
              <AnimatedSection animation="fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-accent" />
                  <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent">Por qué Elora</span>
                </div>
                <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.9] tracking-tight text-background">
                  Tecnología que<br />cambia tu día a día.
                </h2>
              </AnimatedSection>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-background/10">
              {[
                { icon: Zap, title: "Apertura automática", desc: "Sensor de proximidad que levanta la tapa al acercarte. Sin tocar nada." },
                { icon: Droplets, title: "Bidé integrado", desc: "Lavado posterior, femenino y móvil con temperatura ajustable en 4 niveles." },
                { icon: Wind, title: "Secado en 30 seg.", desc: "Súper-Tifón de alta potencia. Adiós al papel higiénico para siempre." },
                { icon: Thermometer, title: "Asiento CLIMADAPT", desc: "Se adapta automáticamente a la temperatura ambiente. Confort todo el año." },
                { icon: Volume2, title: "≤59 dB silencioso", desc: "Hasta 21 dB más silencioso que un inodoro convencional. Un susurro." },
                { icon: Shield, title: "Garantía 10 años", desc: "10 años en cerámica y hasta 5 en tecnología. La mayor del mercado." },
                { icon: Smartphone, title: "Mando en español", desc: "Control completo con memoria para 2 usuarios. Personaliza todo." },
                { icon: Mic, title: "Control por voz", desc: "Dilo y Elora lo hace. Temperatura, presión, secado. Solo con tu voz." },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className={`group p-8 bg-foreground hover:bg-background/5 transition-all duration-500 border border-background/10 ${""}`}
                >
                  <AnimatedSection animation="fade-up" delay={i * 80}>
                    <div className="w-10 h-10 border border-background/20 flex items-center justify-center mb-6 group-hover:border-accent transition-colors duration-300">
                      <f.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-lg uppercase tracking-wide text-background mb-3">{f.title}</h3>
                    <p className="font-body text-sm text-background/55 leading-relaxed">{f.desc}</p>
                  </AnimatedSection>
                </div>
              ))}
            </div>

            {/* Feature images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { img: IMGS.mando, label: "Mando a distancia", sub: "Control total" },
                { img: IMGS.secado, label: "Secado Súper-Tifón", sub: "Menos de 30 segundos" },
                { img: IMGS.voz, label: "Control por voz", sub: "Solo en inglés" },
              ].map((item, i) => (
                <AnimatedSection key={item.label} animation="scale-in" delay={i * 150}>
                  <div className="relative overflow-hidden group aspect-[4/3]">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-background/50 mb-1">{item.sub}</p>
                      <p className="font-display text-xl uppercase tracking-wide text-background">{item.label}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Posture detection */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection animation="slide-left">
                <div className="relative overflow-hidden bg-background/5 border border-background/10 p-8 flex flex-col md:flex-row items-center gap-8">
                  <img src={IMGS.usoPie} alt="Uso de pie" className="w-32 h-auto object-contain flex-shrink-0" />
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent mb-2">Uso de pie</p>
                    <h4 className="font-display text-2xl uppercase tracking-wide text-background mb-2">Detección de postura</h4>
                    <p className="font-body text-sm text-background/55 leading-relaxed">
                      Reconoce si estás de pie o sentado y ajusta automáticamente la apertura del asiento y el tipo de descarga.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slide-right">
                <div className="relative overflow-hidden bg-background/5 border border-background/10 p-8 flex flex-col md:flex-row items-center gap-8">
                  <img src={IMGS.usoSentada} alt="Uso sentada" className="w-32 h-auto object-contain flex-shrink-0" />
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent mb-2">Uso sentada</p>
                    <h4 className="font-display text-2xl uppercase tracking-wide text-background mb-2">Todo automatizado</h4>
                    <p className="font-body text-sm text-background/55 leading-relaxed">
                      Apertura de asiento, tipo de descarga y cierre de tapa. Más comodidad, menos gestos, todo automatizado.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 4 — COLECCIÓN
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="relative py-24 md:py-32 px-8 md:px-16 lg:px-20"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <AnimatedSection animation="fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-accent" />
                  <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent">Colección 2025</span>
                </div>
                <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
                  Elige tu<br />Elora.
                </h2>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={200}>
                <a
                  href="https://elorasmart.com/landing-page-modelos/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] text-foreground/50 hover:text-accent transition-colors duration-300 border-b border-foreground/20 hover:border-accent pb-1"
                >
                  ¿No sabes cuál es el tuyo?
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </AnimatedSection>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {PRODUCTS.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={() => setSelectedProduct(product)}
                  onAddToCart={(p) => addToCart(p)}
                  delay={i * 150}
                />
              ))}
            </div>

            {/* Comparison note */}
            <AnimatedSection animation="fade-up" delay={300} className="mt-12 p-6 border border-border flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-8 h-8 border border-accent flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-accent" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="font-display text-base uppercase tracking-wide mb-1">¿ESENZA o AURA?</p>
                <p className="font-body text-sm text-foreground/60">
                  Elige ESENZA si quieres todas las funciones esenciales con un precio más contenido. Elige AURA si quieres el modelo más completo: espuma anti-salpicaduras, UV, desodorización, aromaterapia y control por voz.
                </p>
              </div>
              <a
                href="https://elorasmart.com/landing-page-modelos/"
                target="_blank"
                rel="noreferrer"
                className="font-body text-[10px] uppercase tracking-[0.25em] px-5 py-3 border border-foreground/30 hover:border-accent hover:text-accent transition-all duration-300 flex-shrink-0"
              >
                Comparar
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SECCIÓN 5 — CONTACTO
        ══════════════════════════════════════════════════════════════════ */}
        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="relative py-24 md:py-32 bg-secondary"
        >
          <div className="px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

              {/* Left: info */}
              <div className="flex flex-col gap-10">
                <AnimatedSection animation="fade-up">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-accent" />
                    <span className="font-body text-[10px] uppercase tracking-[0.4em] text-accent">Contacto</span>
                  </div>
                  <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.9] tracking-tight">
                    ¿Tienes<br />dudas?
                  </h2>
                  <p className="font-body text-base text-foreground/65 leading-relaxed mt-6">
                    Te las resolvemos sin compromiso. Nuestro equipo te acompaña en todo el proceso: dudas de instalación, configuración y uso diario, con atención personalizada en español.
                  </p>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={150}>
                  <div className="space-y-6">
                    {[
                      { label: "Showroom en Galicia", value: "Avenida da Mahía, 17, Bajo 2 · 15220 Bertamiráns (Ames)", sub: "Ven y pruébalo. Te enamorarás." },
                      { label: "Teléfono", value: "+34 614 45 19 01", sub: "Lunes a Viernes 10:00–18:00" },
                      { label: "Instalación sencilla", value: "Solo necesitas un enchufe y tu fontanero", sub: "Sin obras complicadas" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 py-4 border-b border-border last:border-0">
                        <div className="w-1 flex-shrink-0 bg-accent self-stretch" />
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1">{item.label}</p>
                          <p className="font-display text-lg uppercase tracking-wide">{item.value}</p>
                          <p className="font-body text-xs text-foreground/50 mt-1">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={250}>
                  <a
                    href="https://api.whatsapp.com/send?phone=34614451901"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 font-body text-[11px] uppercase tracking-[0.3em] px-8 py-4 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-300 w-fit"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp directo
                  </a>
                </AnimatedSection>
              </div>

              {/* Right: form */}
              <div>
                <AnimatedSection animation="fade-up" delay={100}>
                  <h3 className="font-display text-2xl uppercase tracking-wide mb-8">Escríbenos</h3>
                </AnimatedSection>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <Footer />
      </main>

      {/* ─── Cart Panel ──────────────────────────────────────────────────── */}
      {cartOpen && (
        <CartPanel
          items={cart}
          onClose={() => setCartOpen(false)}
          onUpdate={updateCart}
        />
      )}

      {/* ─── WhatsApp FAB ─────────────────────────────────────────────────── */}
      <a
        href="https://api.whatsapp.com/send?phone=34614451901"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        title="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}
