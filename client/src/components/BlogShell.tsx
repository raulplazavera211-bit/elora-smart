import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { CartPanel } from "@/components/CartPanel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

type BlogShellProps = { children: React.ReactNode };

/**
 * Header de blog basado en el header de Inicio: sidebar en escritorio y
 * barra + menú de pantalla completa en móvil. Comparte carrito e idioma.
 */
export function BlogShell({ children }: BlogShellProps) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, isCartOpen, openCart, closeCart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();

  const navItems = [
    { label: t("nav.vision"), href: "/" },
    { label: t("nav.esencia"), href: "/" },
    { label: t("nav.manifiesto"), href: "/" },
    { label: t("nav.coleccion"), href: "/coleccion" },
    { label: t("nav.contacto"), href: "/" },
  ];

  const goTo = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background text-foreground font-body">
      {/* Header móvil: misma estructura visual que Inicio */}
      <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
        <button onClick={() => goTo("/")} aria-label="Ir al inicio"><img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" /></button>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={openCart} className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center outline-none" aria-label={t("nav.cart")}>
            <ShoppingBag className="w-4 h-4 text-foreground" />
            {totalItems > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">{totalItems}</span>}
          </button>
          <button onClick={() => setIsMenuOpen((value) => !value)} className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-300 outline-none" aria-label={t("nav.menu")}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar de escritorio: reproduce el header lateral de Inicio */}
      <aside className="hidden md:flex w-72 min-h-[100dvh] sticky top-0 border-r border-border bg-background flex-col justify-between items-start z-40 shrink-0 py-7">
        <div className="px-10 text-left">
          <button onClick={() => goTo("/")} className="outline-none text-left"><img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto select-none" /><p className="font-display text-xs uppercase tracking-[0.4em] text-foreground/50 mt-3">Smart</p></button>
          <div className="mt-4"><LanguageSwitcher /></div>
        </div>
        <nav className="flex flex-col gap-5 w-full px-10">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">{t("nav.index")}</p>
          {navItems.map((item, index) => (
            <button key={`${item.label}-${index}`} onClick={() => goTo(item.href)} className="group text-left outline-none flex items-center gap-4 transition-all duration-500">
              <span className={`h-[1px] transition-all duration-500 ${item.href === "/coleccion" ? "w-3 bg-foreground/20" : "w-3 bg-foreground/20"}`} />
              <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">{item.label}</span>
              <span className="ml-auto font-body text-[10px] text-foreground/20">0{index + 1}</span>
            </button>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <span className="h-[1px] w-8 bg-accent-deep" />
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground">Blog</span>
            <span className="ml-auto font-body text-[10px] text-accent-deep">06</span>
          </div>
        </nav>
        <div className="px-10 w-full flex flex-col gap-5">
          <button onClick={openCart} className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none">
            <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground"><ShoppingBag className="w-4 h-4" /> {t("coleccion.buy")}</span>
            <span className="font-display text-sm text-accent-deep">{totalItems}</span>
          </button>
          <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-accent-deep" /> EST. SPAIN - 2022</div>
        </div>
      </aside>

      <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="absolute top-6 right-6 flex items-center gap-3"><LanguageSwitcher /><button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center outline-none"><X className="w-5 h-5" /></button></div>
        <nav className="flex flex-col gap-7 pb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">{t("nav.index")}</p>
          {navItems.map((item, index) => <button key={`${item.label}-${index}`} onClick={() => goTo(item.href)} className="text-left font-display text-4xl uppercase tracking-wide text-foreground/30 transition-all duration-500 outline-none flex items-center gap-4"><span className="text-sm font-body text-foreground/30">0{index + 1}</span>{item.label}</button>)}
          <button onClick={() => setIsMenuOpen(false)} className="text-left font-display text-4xl uppercase tracking-wide text-foreground outline-none flex items-center gap-4"><span className="text-sm font-body text-accent-deep">06</span>Blog</button>
        </nav>
      </div>

      <CartPanel isOpen={isCartOpen} onClose={closeCart} cart={cart} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onClearCart={clearCart} />
      <div className="flex-1 min-w-0 pt-20 md:pt-0">{children}</div>
    </div>
  );
}
