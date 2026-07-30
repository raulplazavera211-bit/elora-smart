import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useCurrency, formatCurrency, convertPrice } from "@/contexts/CurrencyContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, X, Menu, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/components/ProductDetail";
import { Footer } from "@/components/Footer";
import { getLocalizedProducts } from "@/lib/products";
import { trpc } from "@/lib/trpc";
import { ReviewsSection } from "@/components/ReviewsSection";
import { CartPanel } from "@/components/CartPanel";
import { useCart } from "@/contexts/CartContext";
import { PremiumCareModal } from "@/components/PremiumCareModal";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

export default function Coleccion() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [displayProducts, setDisplayProducts] = useState<Product[]>(() => getLocalizedProducts('es') as Product[]);

  const { cart, isCartOpen, addToCart, removeFromCart, updateQuantity, openCart, closeCart, totalItems } = useCart();

  // Estado para el modal de upsell ELORA PREMIUM CARE
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{ id: string; name: string; price: number; img: string } | null>(null);

  const handleAddToCart = (item: { id: string; name: string; price: number; img: string }) => {
    const isEsenza = item.id?.toLowerCase().includes('esenza') || item.name?.toLowerCase().includes('esenza');
    if (isEsenza) {
      setPendingProduct(item);
      setPremiumModalOpen(true);
    } else {
      addToCart(item);
      openCart();
    }
  };

  const handlePremiumAccept = () => {
    if (pendingProduct) {
      addToCart(pendingProduct);
      addToCart({ id: 'premium-care', name: 'ELORA PREMIUM CARE', price: 249, img: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/premium-care-product-KotbV6544WKMGezFLb8UJF.webp' });
    }
    setPremiumModalOpen(false);
    setPendingProduct(null);
    openCart();
  };

  const handlePremiumDecline = () => {
    if (pendingProduct) {
      addToCart(pendingProduct);
    }
    setPremiumModalOpen(false);
    setPendingProduct(null);
    openCart();
  };

  // Cargar productos desde la BD para que los cambios del admin se reflejen
  const productsQuery = trpc.products.getAll.useQuery();
  const { region, currency, exchangeRate } = useCurrency();
  
  useEffect(() => {
    if (productsQuery.data && productsQuery.data.length > 0) {
      const parseJsonField = (val: any, fallback: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fallback; } }
        if (val && typeof val === 'object') return val;
        return fallback;
      };
      // Merge: usar datos de BD para img/gallery, resto del fallback hardcodeado
      const localizedBase = getLocalizedProducts(i18n.language);
      const merged = localizedBase.map((fallback) => {
        const fromDb = productsQuery.data.find((p: any) => p.slug?.toLowerCase() === fallback.id?.toLowerCase());
        if (!fromDb) return fallback;
        return {
          ...fallback,
          img: fromDb.img || fallback.img,
          gallery: parseJsonField(fromDb.gallery, fallback.gallery || []),
          price: fromDb.price ? (typeof fromDb.price === 'number' ? fromDb.price : parseFloat(fromDb.price)) : fallback.price,
          originalPrice: fromDb.originalPrice ? (typeof fromDb.originalPrice === 'number' ? fromDb.originalPrice : parseFloat(String(fromDb.originalPrice))) : null,
        } as Product;
      });
      
      // Filtrar por región: solo mostrar productos visibles en la región actual
      const filtered = merged.filter(p => {
        if (!p.visibleRegions) return true; // Sin restricción = visible en todas partes
        return p.visibleRegions.includes(region);
      });
      
      setDisplayProducts(filtered);
    }
  }, [productsQuery.data, i18n.language, region]);

  // Actualizar textos de productos cuando cambie el idioma (sin datos de BD)
  useEffect(() => {
    if (!productsQuery.data || productsQuery.data.length === 0) {
      setDisplayProducts(getLocalizedProducts(i18n.language) as Product[]);
    }
  }, [i18n.language]);

    const PRODUCT_SLUGS: Record<string, string> = {
    "ESENZA": "esenza",
    "ESENZA-COMPACT": "esenza-compact",
    "ESENZA-SUSPENDIDO": "esenza-suspendido",
    "AURA": "aura",
    "AURA-COMPACT": "aura-compact",
    "AURA-SUSPENDIDO": "aura-suspendido",
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  // Abrir producto directamente si viene con ?producto=slug desde el chatbot
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("producto");
    if (slug) {
      const found = getLocalizedProducts(i18n.language).find(
        (p) => (PRODUCT_SLUGS[p.id] ?? p.id.toLowerCase()) === slug
      );
      if (found) setSelectedProduct(found as Product);
    }
  }, []);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 bg-background text-foreground font-body flex overflow-hidden">

      {/* ── SIDEBAR DESKTOP ────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[220px] lg:w-[260px] flex-shrink-0 h-full border-r border-border flex-col justify-between py-10 z-30 bg-background">
        <div className="px-8 mb-10">
          <button onClick={() => navigate("/")} className="outline-none">
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
          </button>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
        <nav className="flex flex-col gap-5 w-full px-10 flex-1">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">{t('nav.index')}</p>
          <button
            onClick={() => { if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0; }}
            className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
          >
            <span className="h-[1px] w-8 bg-accent-deep transition-all duration-500" />
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground transition-colors duration-500">{t('nav.coleccion')}</span>
            <span className="ml-auto font-body text-[10px] text-accent-deep">01</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
          >
            <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 group-hover:bg-foreground/40 transition-all duration-500" />
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">{t('nav.home')}</span>
            <span className="ml-auto font-body text-[10px] text-foreground/20">02</span>
          </button>
        </nav>
        <div className="px-10 w-full flex flex-col gap-5">
          <button
            onClick={openCart}
            className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
          >
            <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
              <ShoppingBag className="w-4 h-4" /> {t('nav.cart')}
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

      {/* ── MOBILE HEADER ─────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
        <button onClick={() => navigate("/")} className="outline-none">
          <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
        </button>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={openCart}
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

      {/* ── MOBILE MENU ───────────────────────────────────────────── */}
      <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center outline-none"
        >
          <X className="w-5 h-5" />
        </button>
        <nav className="flex flex-col gap-7 pb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">{t('nav.index')}</p>
          <button
            onClick={() => { setIsMenuOpen(false); }}
            className="text-left font-display text-4xl uppercase tracking-wide text-foreground outline-none flex items-center gap-4"
          >
            <span className="text-sm font-body text-accent-deep">01</span>{t('nav.coleccion')}
          </button>
          <button
            onClick={() => { navigate("/"); setIsMenuOpen(false); }}
            className="text-left font-display text-4xl uppercase tracking-wide text-foreground/30 outline-none flex items-center gap-4"
          >
            <span className="text-sm font-body text-foreground/30">02</span>{t('nav.home')}
          </button>
        </nav>
      </div>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-20 md:pt-0"
      >
          <>
            {/* Hero */}
            <div className="px-6 md:px-14 py-14 md:py-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-accent-deep" /> {t('coleccion.eyebrow')}
                </p>
                <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wide leading-[0.9] mb-6">
                  {t('coleccion.title')}<br />
                  <span className="text-foreground/30">{t('coleccion.complete')}</span>
                </h1>
                <p className="font-body text-sm md:text-base text-foreground/60 max-w-xl leading-relaxed">
                  {t('coleccion.body')}
                </p>
              </motion.div>

              {/* Filtros */}
              <div className="mt-10 mb-12 flex gap-3 flex-wrap">
                {[t('coleccion.filterAll'), t('coleccion.filterEsenza'), t('coleccion.filterAura')].map((f) => (
                  <span key={f} className="font-body text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-border text-foreground/50 cursor-default">
                    {f}
                  </span>
                ))}
              </div>

              {/* Grid 6 productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {displayProducts.map((prod, i) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                    className="group flex flex-col h-full bg-background border border-border hover:border-accent-deep transition-colors"
                  >
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
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {prod.badges.map((b) => (
                          <span
                            key={b}
                            className={`font-body text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                              b.toLowerCase().includes('vendido') || b.toLowerCase().includes('seller') || b.toLowerCase().includes('vendido') || b.toLowerCase().includes('vendu') || b.toLowerCase().includes('venduto') || b.toLowerCase().includes('mais vendido')
                                ? "bg-amber-500 text-white font-semibold"
                                : "bg-foreground text-background"
                            }`}
                          >
                            {b.toLowerCase().includes('vendido') || b.toLowerCase().includes('seller') || b.toLowerCase().includes('vendu') || b.toLowerCase().includes('venduto') || b.toLowerCase().includes('mais vendido') ? "★ " + b : b}
                          </span>
                        ))}
                      </div>
                      <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background font-body text-[9px] uppercase tracking-[0.25em] px-2 py-1">
                        {t('coleccion.viewDetail')}
                      </span>
                    </button>

                    <div className="flex flex-col gap-2 flex-1 p-4">
                      <p className="font-body text-[10px] text-foreground/50 uppercase tracking-widest">{prod.id}</p>
                      <h3 className="font-display text-lg uppercase tracking-wide leading-tight cursor-pointer hover:text-accent-deep transition-colors" onClick={() => openProduct(prod)}>{prod.name}</h3>
                      <p className="font-body text-xs text-accent-deep leading-tight">{prod.tagline}</p>
                      <div className="mt-auto pt-4 border-t border-border">
                        <div className="flex items-baseline justify-between mb-3">
                          <div className="flex flex-col gap-0.5">
                            {prod.originalPrice && currency === "EUR" && (
                              <span className="font-body text-xs text-foreground/40 line-through">
                                {formatCurrency(convertPrice(prod.originalPrice, currency, exchangeRate), currency)}
                              </span>
                            )}
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-2xl tracking-wide text-foreground">
                                {formatCurrency(convertPrice(prod.price, currency, exchangeRate, (prod as any).priceUsd), currency)}
                              </span>
                              {prod.originalPrice && currency === "EUR" && (
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
                            onClick={() => handleAddToCart({ id: prod.id, name: prod.name, price: prod.price, img: prod.img })}
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

              {/* Bloque La experiencia Elora */}
              <div className="mt-16">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-8 flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-accent-deep" /> {t('coleccion.experience')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                  {(t('esenciaCards', { returnObjects: true }) as Array<{title:string;body:string}>).slice(0,3).map((item, ei) => {
                    const ICONS_C = [MapPin, ShieldCheck, Wrench];
                    const Icon = ICONS_C[ei];
                    return (
                    <div key={item.title} className="bg-background px-8 py-10 flex flex-col gap-4">
                      <Icon className="w-6 h-6 text-accent-deep" />
                      <h4 className="font-display text-lg uppercase tracking-wide">{item.title}</h4>
                      <p className="font-body text-sm text-foreground/60 leading-relaxed">{item.body}</p>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>

            {/* Footer colección */}
            <div className="border-t border-border px-6 md:px-14 py-8 flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-accent-deep transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t('nav.backHome')}
              </button>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/30">
                {t('footer.taglineShort')}
              </p>
            </div>

            <ReviewsSection />
            <Footer />
          </>
      </div>

      {/* ── CART PANEL COMPARTIDO (mismo diseño que Home) ─────────── */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      {/* ── UPSELL PREMIUM CARE ─────────── */}
      <PremiumCareModal
        isOpen={premiumModalOpen}
        productName={pendingProduct?.name ?? 'ESENZA'}
        onAccept={handlePremiumAccept}
        onDecline={handlePremiumDecline}
      />
      {/* Overlay de producto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-background z-[200] flex flex-col md:flex-row overflow-hidden">
          {/* ── SIDEBAR DESKTOP dentro del overlay ── */}
          <aside className="hidden md:flex w-[220px] lg:w-[260px] flex-shrink-0 h-full border-r border-border flex-col justify-between py-10 z-30 bg-background">
            <div className="px-8 mb-10">
              <button onClick={() => setSelectedProduct(null)} className="outline-none">
                <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
              </button>
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
            </div>
            <nav className="flex flex-col gap-5 w-full px-10 flex-1">
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">{t('nav.index')}</p>
              <button
                onClick={() => setSelectedProduct(null)}
                className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
              >
                <span className="h-[1px] w-8 bg-accent-deep transition-all duration-500" />
                <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground transition-colors duration-500">{t('nav.coleccion')}</span>
                <span className="ml-auto font-body text-[10px] text-accent-deep">01</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
              >
                <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 group-hover:bg-foreground/40 transition-all duration-500" />
                <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">{t('nav.home')}</span>
                <span className="ml-auto font-body text-[10px] text-foreground/20">02</span>
              </button>
            </nav>
            <div className="px-10 w-full flex flex-col gap-5">
              <button
                onClick={openCart}
                className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
              >
                <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
                  <ShoppingBag className="w-4 h-4" /> {t('nav.cart')}
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

          {/* ── MOBILE HEADER dentro del overlay ── */}
          <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-[210] flex items-center justify-between px-6">
            <button onClick={() => setSelectedProduct(null)} className="outline-none">
              <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
            </button>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={openCart}
                className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center outline-none"
              >
                <ShoppingBag className="w-4 h-4 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-300 outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── CONTENIDO DEL PRODUCTO ── */}
          <div className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-20 md:pt-0">
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAdd={(p) => handleAddToCart({ id: p.id, name: p.name, price: p.price, img: p.img })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
