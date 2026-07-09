import { motion } from "motion/react";
import {
  ArrowLeft, ShoppingBag, Truck, Wrench, Shield,
  Sparkles, Droplets, Thermometer, Wind, Zap, Check, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const allImages = [product.img, ...product.gallery].filter(Boolean);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + allImages.length) % allImages.length : null), [allImages.length]);
  const nextImage = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % allImages.length : null), [allImages.length]);

  return (
    <>
    {/* LIGHTBOX */}
    {lightboxIndex !== null && (
      <div
        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        onClick={closeLightbox}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {/* Botón cerrar */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        {/* Botón anterior */}
        {allImages.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white/80 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
        )}
        {/* Imagen ampliada */}
        <img
          src={allImages[lightboxIndex]}
          alt={product.name}
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {/* Botón siguiente */}
        {allImages.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white/80 hover:text-white transition-colors z-10 p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        )}
        {/* Contador */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 font-body text-xs tracking-widest">
          {lightboxIndex + 1} / {allImages.length}
        </div>
      </div>
    )}
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
            {t('product.backToCollection')}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Imagen */}
            <div
              className="bg-background border border-border overflow-hidden aspect-square relative cursor-zoom-in"
              onClick={() => openLightbox(0)}
            >
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
                        {product.originalPrice.toLocaleString()} €
                      </span>
                      <span className="font-body text-[9px] uppercase tracking-widest bg-accent-deep/20 text-accent-deep px-2 py-0.5 rounded">
                        {t('coleccion.offer')}
                      </span>
                    </div>
                  )}
                  <p className="font-display text-3xl sm:text-4xl md:text-5xl tracking-wide">{product.price.toLocaleString()} €</p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-foreground/50 mt-1">{t('coleccion.vatIncl')}</p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onAdd(product)}
                  className="group flex-1 inline-flex items-center justify-center gap-3 bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 hover:bg-accent-deep transition-colors active:scale-[0.97]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t('product.buyNow')}
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 inline-flex items-center justify-center gap-3 border border-border font-body text-xs uppercase tracking-[0.3em] py-4 hover:border-accent-deep hover:text-accent-deep transition-colors"
                >
                  {t('product.viewCollection')}
                </button>
              </div>

              {/* Garantías — 1 col en móvil, 3 en sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-4 mt-1 border-t border-border">
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Truck className="w-3.5 h-3.5 text-accent-deep shrink-0" /> Envío a Europa
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Wrench className="w-3.5 h-3.5 text-accent-deep shrink-0" /> {t('product.guidedInstall')}
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-foreground/60">
                  <Shield className="w-3.5 h-3.5 text-accent-deep shrink-0" /> {product.warranty.years} {t('product.yearsWarranty')}
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.whyThis')} {product.id}
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.gallery')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {product.gallery.map((g, idx) => (
              <div
                key={g}
                className="aspect-square bg-muted border border-border overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(idx + 1)}
              >
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.features')}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95] mb-6">
              {t('product.allIncluded')} {product.id}.
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.dimensions')}
            </p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight">{t('product.exactMeasures')}</h3>
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.techSpecs')}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95] mb-8 md:mb-14">
              {t('product.engineeringDetail')}
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
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">{t('product.inTheBox')}</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">{t('product.whatYouGet')}</h3>
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
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">{t('product.installation')}</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">{t('product.easyAndGuided')}</h3>
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
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent mb-4">{t('product.warranty')}</p>
            <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-5">{product.warranty.years} {t('product.yearsEloraSAT')}</h3>
            <p className="font-body text-sm text-background/80 leading-relaxed mb-5">{product.warranty.details}</p>
            {/* Garantía — 3 cols en todos los tamaños (iconos pequeños, texto corto) */}
            <div className="grid grid-cols-3 gap-2 border-t border-background/15 pt-5">
              <div className="flex flex-col gap-1.5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">{t('product.totalCoverage')}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Wrench className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">{t('product.satGalicia')}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <Truck className="w-4 h-4 text-accent" />
                <span className="font-body text-[9px] uppercase tracking-widest text-background/60 leading-tight">{t('product.pickupIncluded')}</span>
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
              <span className="w-5 h-[1px] bg-accent-deep" /> {t('product.faq')}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-[0.95]">
              {t('product.faqTitle')}
            </h2>
            <p className="font-body text-sm text-foreground/70 leading-relaxed mt-5">
              {t('product.faqBody')}
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <a
                href="https://wa.me/34614451901?text=Hola%2C%20tengo%20una%20duda%20sobre%20el%20ESENZA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white font-body text-xs uppercase tracking-[0.2em] py-3 px-5 hover:bg-[#1ebe5d] transition-colors active:scale-[0.97]"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a
                href="tel:+34614451901"
                className="inline-flex items-center gap-3 border border-border font-body text-xs uppercase tracking-[0.2em] py-3 px-5 hover:border-accent-deep hover:text-accent-deep transition-colors active:scale-[0.97]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z"/></svg>
                +34 614 45 19 01
              </a>
              <a
                href="mailto:info@elorasmart.com"
                className="inline-flex items-center gap-3 border border-border font-body text-xs uppercase tracking-[0.2em] py-3 px-5 hover:border-accent-deep hover:text-accent-deep transition-colors active:scale-[0.97]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                info@elorasmart.com
              </a>
            </div>
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
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-accent-deep mb-3">{t('product.readyForBath')}</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl uppercase tracking-wide leading-[0.95] mb-3">
              {product.name}<br />{t('product.waitingForYou')}
            </h2>
            <p className="font-display text-xl sm:text-2xl tracking-wide">{product.price.toLocaleString()} €</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onAdd(product)}
              className="group inline-flex items-center justify-center gap-3 bg-foreground text-background font-body text-xs uppercase tracking-[0.3em] py-4 px-8 hover:bg-accent-deep transition-colors active:scale-[0.97]"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('coleccion.buy')}
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-3 border border-border font-body text-xs uppercase tracking-[0.3em] py-4 px-8 hover:border-accent-deep hover:text-accent-deep transition-colors"
            >
              {t('product.backToCollection')}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
    </>
  );
}
