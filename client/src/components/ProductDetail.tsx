import { motion } from "motion/react";
import {
  ArrowLeft, ShoppingBag, Truck, Wrench, Shield,
  Sparkles, Droplets, Thermometer, Wind, Zap, Check
} from "lucide-react";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  img: string;
  gallery: string[];
  badges: string[];
  highlights: { label: string; value: string }[];
  features: string[];
  pitch: { title: string; body: string }[];
  technical: { group: string; specs: ProductSpec[] }[];
  dimensions: { label: string; value: string }[];
  inTheBox: string[];
  installation: string[];
  warranty: { years: number; details: string };
  faqs: { q: string; a: string }[];
  price: number;
  originalPrice?: number | null;
};

type Props = {
  product: Product;
  onBack: () => void;
  onAdd: (p: Product) => void;
};

const PITCH_ICONS = [Sparkles, Droplets, Thermometer, Wind, Zap, Shield];

export function ProductDetail({ product, onBack, onAdd }: Props) {
  return (
    <motion.div
      className="min-h-full bg-background"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >

      {/* HERO */}
      <div className="relative w-full bg-muted border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 pt-5 pb-8 md:py-10">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-foreground/60 hover:text-accent-deep transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Volver a la colección
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Imagen */}
            <div className="bg-background border border-border overflow-hidden h-[300px] sm:h-[420px] md:h-[640px] relative">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.badges.map((b) => (
                  <span key={b} className="font-body text-[9px] uppercase tracking-[0.25em] bg-foreground text-background px-2 py-1">{b}</span>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep flex items-center gap-3">
                <span className="w-5 h-[1px] bg-accent-deep" /> {product.id}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl uppercase tracking-wide leading-[0.95]">
                {product.name}
              </h1>
              <p className="font-display text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-accent-deep leading-tight">
                {product.tagline}
              </p>
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                {product.longDescription}
              </p>

              {/* Highlights — siempre 3 columnas */}
              <div className="grid grid-cols-3 gap-px bg-border border border-border">
                {product.highlights.map((h) => (
                  <div key={h.label} className="bg-background p-3 sm:p-5 flex flex-col gap-1">
                    <p className="font-body text-[8px] sm:text-[9px] uppercase tracking-widest text-foreground/50 leading-tight">{h.label}</p>
                    <p className="font-display text-xs sm:text-base md:text-lg uppercase tracking-wide leading-tight">{h.value}</p>
                  </div>
                ))}
              </div>

              {/* Precio */}
              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col gap-1">
                  {product.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm text-foreground/40 line-through">
                        {product.originalPrice.toLocaleString('es-ES')} €
                      </span>
                      <span className="font-body text-[9px] uppercase tracking-widest bg-accent-deep/20 text-accent-deep px-2 py-0.5 rounded">
                        Oferta
                      </span>
                    </div>
                  )}
                  <p className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide">{product.price.toLocaleString('es-ES')} €</p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-foreground/50 mt-1">IVA incluido</p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onAdd(product)}
                  className="group flex-1 inline-flex items-center justify-center gap-3 bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 hover:bg-accent-deep transition-colors active:scale-[0.97]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Comprar ahora
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 inline-flex items-center justify-center gap-3 border border-border font-body text-xs uppercase tracking-[0.3em] py-4 hover:border-accent-deep hover:text-accent-deep transition-colors"
                >
                  Ver colección
                </button>
              </div>

              {/* Garantías — 1 col en móvil, 3 en sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 mt-1 border-t border-border">
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Truck className="w-3.5 h-3.5 text-accent-deep shrink-0" /> Envío Península
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Wrench className="w-3.5 h-3.5 text-accent-deep shrink-0" /> Instalación guiada
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Shield className="w-3.5 h-3.5 text-accent-deep shrink-0" /> {product.warranty.years} años garantía
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POR QUÉ ESTE MODELO */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-14">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-3 flex items-center gap-3">
              <span className="w-5 h-[1px] bg-accent-deep" /> Por qué {product.id}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl uppercase tracking-wide leading-[0.95]">
              {product.description}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {product.pitch.map((item, idx) => {
            const Icon = PITCH_ICONS[idx % PITCH_ICONS.length];
            return (
              <div key={item.title} className="bg-background p-6 md:p-8 flex flex-col gap-4">
                <Icon className="w-5 h-5 text-accent-deep" />
                <h3 className="font-display text-base md:text-xl uppercase tracking-wide leading-tight">{item.title}</h3>
                <p className="font-body text-sm text-foreground/70 leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* GALERÍA */}
      {product.gallery.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 pb-12 md:pb-24">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-5 flex items-center gap-3">
            <span className="w-5 h-[1px] bg-accent-deep" /> Galería
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {product.gallery.map((g) => (
              <div key={g} className="aspect-square bg-muted border border-border overflow-hidden">
                <img src={g} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CARACTERÍSTICAS + DIMENSIONES */}
      <section className="bg-muted border-y border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
          <div className="lg:col-span-2">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
              <span className="w-5 h-[1px] bg-accent-deep" /> Características
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95] mb-6">
              Todo lo que incluye {product.id}.
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 font-body text-sm text-foreground/80 border-b border-border pb-3">
                  <Check className="w-4 h-4 text-accent-deep mt-[3px] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-background border border-border p-5 md:p-8 flex flex-col gap-4 h-fit">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep flex items-center gap-3">
              <span className="w-5 h-[1px] bg-accent-deep" /> Dimensiones
            </p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight">Medidas exactas</h3>
            <ul className="flex flex-col gap-3 mt-1">
              {product.dimensions.map((d) => (
                <li key={d.label} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
                  <span className="font-body text-[10px] uppercase tracking-widest text-foreground/60 shrink-0">{d.label}</span>
                  <span className="font-display text-sm uppercase tracking-wide text-right">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
          <span className="w-5 h-[1px] bg-accent-deep" /> Especificaciones técnicas
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95] mb-8 md:mb-14">
          Ingeniería al detalle.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {product.technical.map((group) => (
            <div key={group.group} className="bg-background p-5 md:p-8">
              <p className="font-display text-sm uppercase tracking-widest text-accent-deep mb-4">{group.group}</p>
              <dl className="flex flex-col gap-3">
                {group.specs.map((s) => (
                  <div key={s.label} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0">
                    <dt className="font-body text-[10px] uppercase tracking-widest text-foreground/60 leading-relaxed" style={{ maxWidth: "50%" }}>{s.label}</dt>
                    <dd className="font-body text-xs text-foreground text-right leading-relaxed" style={{ maxWidth: "50%" }}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* EN LA CAJA + INSTALACIÓN + GARANTÍA */}
      <section className="bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">En la caja</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">Lo que recibes</h3>
            <ul className="flex flex-col gap-3">
              {product.inTheBox.map((item) => (
                <li key={item} className="flex items-start gap-3 font-body text-sm text-background/80 border-b border-background/10 pb-3">
                  <Check className="w-4 h-4 text-accent mt-[3px] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Instalación</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">Sencilla y guiada</h3>
            <ol className="flex flex-col gap-4">
              {product.installation.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="font-display text-lg text-accent shrink-0">0{i + 1}</span>
                  <p className="font-body text-sm text-background/80 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">Garantía</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">{product.warranty.years} años Elora SAT</h3>
            <p className="font-body text-sm text-background/80 leading-relaxed mb-5">{product.warranty.details}</p>
            {/* Garantía — 3 cols en todos los tamaños (iconos pequeños, texto corto) */}
            <div className="grid grid-cols-3 gap-2 border-t border-background/15 pt-5">
              <div className="flex flex-col gap-1.5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">Cobertura total</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Wrench className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">SAT en Galicia</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Truck className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">Recogida incluida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
              <span className="w-5 h-[1px] bg-accent-deep" /> Preguntas frecuentes
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95]">
              Resolvemos<br />tus dudas.
            </h2>
            <p className="font-body text-sm text-foreground/70 leading-relaxed mt-5">
              Si necesitas algo más, escríbenos: te atendemos directamente desde Galicia.
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col">
            {product.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-border py-4 sm:py-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-display text-sm sm:text-base md:text-lg uppercase tracking-wide leading-tight">
                  <span className="flex-1">{faq.q}</span>
                  <span className="font-body text-2xl text-accent-deep group-open:rotate-45 transition-transform shrink-0 mt-[-2px]">+</span>
                </summary>
                <p className="font-body text-sm text-foreground/70 leading-relaxed mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-muted border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-12 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-3">Listo para tu baño</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl uppercase tracking-wide leading-[0.95] mb-3">
              {product.name.replace("Inodoro inteligente ", "").replace("Váter ", "")}<br />te está esperando.
            </h2>
            <p className="font-display text-xl sm:text-2xl tracking-wide">{product.price.toLocaleString('es-ES')} €</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onAdd(product)}
              className="group inline-flex items-center justify-center gap-3 bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 px-8 hover:bg-accent-deep transition-colors active:scale-[0.97]"
            >
              <ShoppingBag className="w-4 h-4" />
              Comprar
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-3 border border-border font-body text-xs uppercase tracking-[0.3em] py-4 px-8 hover:border-accent-deep hover:text-accent-deep transition-colors"
            >
              Volver a la colección
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
