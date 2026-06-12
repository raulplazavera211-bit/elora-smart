import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ShoppingBag, X, Menu, MapPin, ShieldCheck, Wrench, ArrowRight, Check, Trash2 } from "lucide-react";
import { ProductDetail } from "@/components/ProductDetail";
import type { Product } from "@/components/ProductDetail";
import { Footer } from "@/components/Footer";
import { ALL_PRODUCTS } from "@/lib/products";
import { ReviewsSection } from "@/components/ReviewsSection";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

type CartItem = { id: string; name: string; price: number; img: string };
type CheckoutStep = "cart" | "checkout" | "success";

export default function Coleccion() {
  const [, navigate] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [checkoutForm, setCheckoutForm] = useState({ nombre: "", apellidos: "", email: "", telefono: "", direccion: "", ciudad: "", cp: "", notas: "" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.findIndex(i => i.id === item.id);
      if (existing >= 0) return prev;
      return [...prev, item];
    });
  };
  const removeFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  };

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset checkout al cerrar carrito
  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
  };

  return (
    <div className="fixed inset-0 bg-background text-foreground font-body flex overflow-hidden">

      {/* ── SIDEBAR DESKTOP ────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[220px] lg:w-[260px] flex-shrink-0 h-full border-r border-border flex-col justify-between py-10 z-30 bg-background">
        <div className="px-8 mb-10">
          <button onClick={() => navigate("/")} className="outline-none">
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
          </button>
        </div>
        <nav className="flex flex-col gap-5 w-full px-10 flex-1">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">Índice</p>
          <button
            onClick={() => { setSelectedProduct(null); if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0; }}
            className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
          >
            <span className="h-[1px] w-8 bg-accent-deep transition-all duration-500" />
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground transition-colors duration-500">Colección</span>
            <span className="ml-auto font-body text-[10px] text-accent-deep">01</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
          >
            <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 group-hover:bg-foreground/40 transition-all duration-500" />
            <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">Inicio</span>
            <span className="ml-auto font-body text-[10px] text-foreground/20">02</span>
          </button>
        </nav>
        <div className="px-10 w-full flex flex-col gap-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
          >
            <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
              <ShoppingBag className="w-4 h-4" /> Carrito
            </span>
            <span className="font-display text-sm text-accent-deep">{cart.length}</span>
          </button>
          <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent-deep" />
            Est. Galicia · 2024
          </div>
        </div>
      </aside>

      {/* ── MOBILE HEADER ─────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
        <button onClick={() => navigate("/")} className="outline-none">
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

      {/* ── MOBILE MENU ───────────────────────────────────────────── */}
      <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center outline-none"
        >
          <X className="w-5 h-5" />
        </button>
        <nav className="flex flex-col gap-7 pb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">Índice</p>
          <button
            onClick={() => { setSelectedProduct(null); setIsMenuOpen(false); }}
            className="text-left font-display text-4xl uppercase tracking-wide text-foreground outline-none flex items-center gap-4"
          >
            <span className="text-sm font-body text-accent-deep">01</span>Colección
          </button>
          <button
            onClick={() => { navigate("/"); setIsMenuOpen(false); }}
            className="text-left font-display text-4xl uppercase tracking-wide text-foreground/30 outline-none flex items-center gap-4"
          >
            <span className="text-sm font-body text-foreground/30">02</span>Inicio
          </button>
        </nav>
      </div>

      {/* ── CONTENIDO PRINCIPAL ───────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-20 md:pt-0"
      >
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAdd={(item) => { addToCart({ id: item.id, name: item.name, price: item.price, img: item.img }); setIsCartOpen(true); }}
          />
        ) : (
          <>
            {/* Hero */}
            <div className="px-6 md:px-14 py-14 md:py-20">
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
                  Seis modelos. Una misma filosofía: higiene avanzada, diseño premium y la tranquilidad del servicio Elora detrás de cada pieza.
                </p>
              </motion.div>

              {/* Filtros */}
              <div className="mt-10 mb-12 flex gap-3 flex-wrap">
                {["Todos", "Gama ESENZA", "Gama AURA"].map((f) => (
                  <span key={f} className="font-body text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-border text-foreground/50 cursor-default">
                    {f}
                  </span>
                ))}
              </div>

              {/* Grid 6 productos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {ALL_PRODUCTS.map((prod, i) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
                    className="group flex flex-col h-full bg-background border border-border hover:border-accent-deep transition-colors"
                  >
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
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {prod.badges.map((b) => (
                          <span
                            key={b}
                            className={`font-body text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                              b === "Más vendido"
                                ? "bg-amber-500 text-white font-semibold"
                                : "bg-foreground text-background"
                            }`}
                          >
                            {b === "Más vendido" ? "★ " + b : b}
                          </span>
                        ))}
                      </div>
                      <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background font-body text-[9px] uppercase tracking-[0.25em] px-2 py-1">
                        Ver detalle
                      </span>
                    </button>

                    <div className="flex flex-col gap-2 flex-1 p-4">
                      <p className="font-body text-[10px] text-foreground/50 uppercase tracking-widest">{prod.id}</p>
                      <h3 className="font-display text-lg uppercase tracking-wide leading-tight">{prod.name}</h3>
                      <p className="font-body text-xs text-accent-deep leading-tight">{prod.tagline}</p>
                      <div className="mt-auto pt-4 border-t border-border">
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="font-display text-2xl tracking-wide text-foreground">
                            {prod.price.toLocaleString('es-ES')} €
                          </span>
                          <span className="font-body text-[10px] text-foreground/40 uppercase tracking-widest">IVA incl.</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { addToCart({ id: prod.id, name: prod.name, price: prod.price, img: prod.img }); setIsCartOpen(true); }}
                            className="flex-1 bg-foreground text-background font-body text-[10px] uppercase tracking-[0.25em] py-3 flex items-center justify-center gap-2 hover:bg-accent-deep transition-colors active:scale-[0.97]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Comprar
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

              {/* Bloque La experiencia Elora */}
              <div className="mt-16">
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

            <ReviewsSection />
            <Footer />
          </>
        )}
      </div>

      {/* ── PANEL CARRITO / CHECKOUT ──────────────────────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex"
            onClick={closeCart}
          >
            <div className="flex-1 bg-foreground/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-background border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <p className="font-display text-lg uppercase tracking-widest">
                    {checkoutStep === "cart" ? `Carrito · ${cart.length}` : checkoutStep === "checkout" ? "Datos de envío" : "Pedido recibido"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {checkoutStep === "checkout" && (
                    <button onClick={() => setCheckoutStep("cart")} className="font-body text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors outline-none flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 rotate-180" /> Volver
                    </button>
                  )}
                  <button onClick={closeCart} className="outline-none"><X className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Pasos */}
              {checkoutStep !== "success" && (
                <div className="flex border-b border-border flex-shrink-0">
                  {["Carrito", "Datos"].map((label, i) => (
                    <div key={label} className={`flex-1 flex items-center gap-2 px-6 py-3 font-body text-[10px] uppercase tracking-widest transition-colors ${(i === 0 && checkoutStep === "cart") || (i === 1 && checkoutStep === "checkout") ? "text-foreground border-b-2 border-foreground" : "text-foreground/30"}`}>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] flex-shrink-0 ${(i === 0 && checkoutStep === "cart") || (i === 1 && checkoutStep === "checkout") ? "border-foreground" : "border-foreground/20"}`}>
                        {i === 0 && checkoutStep === "checkout" ? <Check className="w-2.5 h-2.5" /> : i + 1}
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              )}

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto">
                {checkoutStep === "cart" ? (
                  <div className="px-8 py-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <ShoppingBag className="w-10 h-10 text-foreground/20" />
                        <p className="font-body text-sm text-foreground/40">No hay productos en el carrito.</p>
                        <button onClick={closeCart} className="font-body text-xs uppercase tracking-[0.3em] border border-border px-6 py-3 hover:border-foreground transition-colors">
                          Ver colección
                        </button>
                      </div>
                    ) : (
                      <ul className="flex flex-col gap-5">
                        {cart.map((item, idx) => (
                          <li key={`${item.id}-${idx}`} className="flex items-start gap-4 border-b border-border pb-5">
                            <div className="w-16 h-16 bg-muted border border-border flex-shrink-0 overflow-hidden">
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-[10px] uppercase tracking-widest text-foreground/50 mb-0.5">{item.id}</p>
                              <p className="font-display text-base uppercase tracking-wide leading-tight truncate">{item.name}</p>
                              <p className="font-display text-sm text-accent-deep mt-1">{item.price.toLocaleString('es-ES')} €</p>
                            </div>
                            <button onClick={() => removeFromCart(idx)} className="text-foreground/30 hover:text-accent-deep transition-colors flex-shrink-0 mt-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : checkoutStep === "checkout" ? (
                  <form
                    id="checkout-form-col"
                    onSubmit={(e) => { e.preventDefault(); }}
                    className="px-8 py-6 flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Nombre *</label><input required value={checkoutForm.nombre} onChange={e => setCheckoutForm(f => ({...f, nombre: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Tu nombre" /></div>
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Apellidos *</label><input required value={checkoutForm.apellidos} onChange={e => setCheckoutForm(f => ({...f, apellidos: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Apellidos" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Email *</label><input required type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({...f, email: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="tu@email.com" /></div>
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Teléfono</label><input type="tel" value={checkoutForm.telefono} onChange={e => setCheckoutForm(f => ({...f, telefono: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="+34 600 000 000" /></div>
                    </div>
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Dirección *</label><input required value={checkoutForm.direccion} onChange={e => setCheckoutForm(f => ({...f, direccion: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Calle, número, piso..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Ciudad *</label><input required value={checkoutForm.ciudad} onChange={e => setCheckoutForm(f => ({...f, ciudad: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="Ciudad" /></div>
                      <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">C.P. *</label><input required value={checkoutForm.cp} onChange={e => setCheckoutForm(f => ({...f, cp: e.target.value}))} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors" placeholder="00000" /></div>
                    </div>
                    <div className="flex flex-col gap-1"><label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">Notas</label><textarea value={checkoutForm.notas} onChange={e => setCheckoutForm(f => ({...f, notas: e.target.value}))} rows={3} className="bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors resize-none" placeholder="Instrucciones especiales de entrega..." /></div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center gap-6">
                    <div className="w-16 h-16 rounded-full border border-accent-deep/40 flex items-center justify-center">
                      <Check className="w-8 h-8 text-accent-deep" />
                    </div>
                    <h3 className="font-display text-2xl uppercase tracking-wide">Pedido recibido</h3>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">Nos pondremos en contacto contigo en breve para coordinar el pago y la entrega.</p>
                    <button onClick={() => { closeCart(); setCart([]); }} className="font-body text-xs uppercase tracking-[0.3em] border border-border px-8 py-3 hover:border-foreground transition-colors">
                      Cerrar
                    </button>
                  </div>
                )}
              </div>

              {/* Footer del panel */}
              {checkoutStep !== "success" && (
                <div className="px-8 py-6 border-t border-border flex-shrink-0">
                  {cart.length > 0 && checkoutStep === "cart" && (
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-body text-xs uppercase tracking-widest text-foreground/50">Total</span>
                      <span className="font-display text-2xl tracking-wide">{cartTotal.toLocaleString('es-ES')} €</span>
                    </div>
                  )}
                  {checkoutStep === "cart" ? (
                    <motion.button
                      onClick={() => setCheckoutStep("checkout")}
                      disabled={cart.length === 0}
                      whileHover={cart.length > 0 ? { scale: 1.01 } : {}}
                      whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
                      className={`w-full font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 transition-all duration-300 ${cart.length > 0 ? "bg-foreground text-background hover:bg-accent-deep" : "bg-foreground/10 text-foreground/30 cursor-not-allowed"}`}
                    >
                      <span>{cart.length > 0 ? `Continuar · ${cartTotal.toLocaleString('es-ES')} €` : "Añade productos"}</span>
                      {cart.length > 0 && <ArrowRight className="w-4 h-4" />}
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full bg-foreground/20 text-foreground/30 font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 cursor-not-allowed select-none"
                    >
                      <Check className="w-4 h-4" />Pago próximamente disponible
                    </button>
                  )}
                  <p className="font-body text-[10px] text-foreground/30 text-center leading-relaxed mt-3">Pago seguro · Envío e instalación coordinados por Elora</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
