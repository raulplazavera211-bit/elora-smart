import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, X } from "lucide-react";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/components/ProductDetail";
import { Footer } from "@/components/Footer";
import { ALL_PRODUCTS } from "@/lib/products";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

type CartItem = { id: string; name: string };

export default function Coleccion() {
  const [, navigate] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  const removeFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background text-foreground font-body">
        {/* Header */}
        <div className="fixed top-0 left-0 w-full h-16 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6 md:px-10">
          <button onClick={() => navigate("/")} className="outline-none">
            <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto select-none" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center border border-border hover:border-accent-deep transition-colors outline-none"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-4 h-4 text-foreground" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="pt-16">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAdd={(item) => { addToCart(item); setIsCartOpen(true); }}
          />
        </div>

        {/* Cart panel */}
        {isCartOpen && (
          <div className="fixed inset-0 z-[60] flex" onClick={() => setIsCartOpen(false)}>
            <div className="flex-1 bg-foreground/40 backdrop-blur-sm" />
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md h-full bg-background border-l border-border flex flex-col">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <p className="font-display text-lg uppercase tracking-widest">Carrito · {cart.length}</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="outline-none"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {cart.length === 0 ? (
                  <p className="font-body text-sm text-foreground/60">No hay productos en el carrito.</p>
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
              {cart.length > 0 && (
                <div className="px-8 py-6 border-t border-border flex flex-col gap-4">
                  <a
                    href={`https://wa.me/34600000000?text=${encodeURIComponent("Hola, me interesa solicitar información sobre: " + cart.map(i => i.name).join(", "))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-foreground text-background font-body text-xs uppercase tracking-[0.25em] py-4 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors"
                  >
                    Solicitar presupuesto por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-16 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6 md:px-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 outline-none group">
          <ArrowLeft className="w-4 h-4 text-foreground/50 group-hover:text-accent-deep transition-colors" />
          <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto select-none" />
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-10 h-10 flex items-center justify-center border border-border hover:border-accent-deep transition-colors outline-none"
          aria-label="Carrito"
        >
          <ShoppingBag className="w-4 h-4 text-foreground" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Hero de la colección */}
      <div className="pt-16 px-6 md:px-16 py-16 md:py-24 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-accent-deep mb-4 flex items-center gap-3">
            <span className="w-6 h-[1px] bg-accent-deep" /> Exclusivo Elora®
          </p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-wide leading-[0.9] mb-6">
            La Colección<br />
            <span className="text-foreground/30">Completa</span>
          </h1>
          <p className="font-body text-sm md:text-base text-foreground/60 max-w-xl leading-relaxed">
            Seis modelos. Una misma filosofía: higiene avanzada, diseño premium y la tranquilidad del servicio Elora detrás de cada pieza. Encuentra el que se adapta a tu baño y a tu vida.
          </p>
        </motion.div>

        {/* Filtros por gama */}
        <div className="mt-10 mb-12 flex gap-3 flex-wrap">
          {["Todos", "Gama ESENZA", "Gama AURA"].map((f) => (
            <span key={f} className="font-body text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-border text-foreground/50 cursor-default">
              {f}
            </span>
          ))}
        </div>

        {/* Grid de 6 productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {ALL_PRODUCTS.map((prod, i) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
              className="group flex flex-col h-full bg-background border border-border hover:border-accent-deep transition-colors"
            >
              {/* Imagen */}
              <button
                onClick={() => openProduct(prod)}
                className="relative overflow-hidden bg-muted border-b border-border h-[280px] outline-none w-full"
              >
                <img
                  src={prod.img}
                  alt={prod.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {prod.badges.map((b) => (
                    <span key={b} className="bg-foreground text-background font-body text-[9px] uppercase tracking-[0.2em] px-2 py-1">
                      {b}
                    </span>
                  ))}
                </div>
                <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background font-body text-[9px] uppercase tracking-[0.25em] px-2 py-1">
                  Ver detalle
                </span>
              </button>

              {/* Info */}
              <div className="flex flex-col gap-2 flex-1 p-4">
                <p className="font-body text-[10px] text-foreground/50 uppercase tracking-widest">{prod.id}</p>
                <h3 className="font-display text-lg uppercase tracking-wide leading-tight">{prod.name}</h3>
                <p className="font-body text-xs text-accent-deep leading-tight">{prod.tagline}</p>

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
                      onClick={() => { addToCart({ id: prod.id, name: prod.name }); setIsCartOpen(true); }}
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
            </motion.div>
          ))}
        </div>

        {/* CTA volver */}
        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-accent-deep transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </button>
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/30">
            Elora Smart · Galicia · 2024
          </p>
        </div>
      </div>

      <Footer />

      {/* Cart panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex" onClick={() => setIsCartOpen(false)}>
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md h-full bg-background border-l border-border flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <p className="font-display text-lg uppercase tracking-widest">Carrito · {cart.length}</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="outline-none"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {cart.length === 0 ? (
                <p className="font-body text-sm text-foreground/60">No hay productos en el carrito.</p>
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
            {cart.length > 0 && (
              <div className="px-8 py-6 border-t border-border flex flex-col gap-4">
                <a
                  href={`https://wa.me/34600000000?text=${encodeURIComponent("Hola, me interesa solicitar información sobre: " + cart.map(i => i.name).join(", "))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-foreground text-background font-body text-xs uppercase tracking-[0.25em] py-4 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors"
                >
                  Solicitar presupuesto por WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
