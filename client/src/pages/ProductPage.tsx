import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ProductDetail } from "@/components/ProductDetail";
import { CartPanel } from "@/components/CartPanel";
import { ALL_PRODUCTS } from "@/lib/products";
import NotFound from "@/pages/NotFound";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { ShoppingBag, X, Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

// Mapa de slug de URL → id de producto
const SLUG_TO_ID: Record<string, string> = {
  "esenza":             "ESENZA",
  "esenza-compact":     "ESENZA-COMPACT",
  "esenza-suspendido":  "ESENZA-SUSPENDIDO",
  "aura":               "AURA",
  "aura-compact":       "AURA-COMPACT",
  "aura-suspendido":    "AURA-SUSPENDIDO",
};

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { cart, isCartOpen, addToCart, removeFromCart, updateQuantity, openCart, closeCart, totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const productId = SLUG_TO_ID[params.slug];
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  // Preload imagen principal para carga más rápida
  useEffect(() => {
    if (!product) return;
    const existing = document.querySelector(`link[rel="preload"][data-product-img]`);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = product.img;
    link.setAttribute('data-product-img', 'true');
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, [product?.img]);

  // Actualizar meta tags para SEO
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Elora Smart`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", product.description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = product.description;
      document.head.appendChild(meta);
    }
    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setOg("og:title", `${product.name} | Elora Smart`);
    setOg("og:description", product.description);
    setOg("og:image", `https://elorasmart.online${product.img}`);
    setOg("og:type", "product");
    setOg("og:url", `https://elorasmart.online/producto/${params.slug}`);
  }, [product, params.slug]);

  if (!product) return <NotFound />;

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
            onClick={() => navigate("/coleccion")}
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
            onClick={() => { navigate("/coleccion"); setIsMenuOpen(false); }}
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
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-20 md:pt-0">
        <ProductDetail
          product={product}
          onBack={() => navigate("/coleccion")}
          onAdd={(p) => {
            addToCart({ id: p.id, name: p.name, price: p.price, img: p.img });
            openCart();
          }}
        />
      </div>

      {/* ── CART PANEL ─────────────────────────────────────────────── */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
