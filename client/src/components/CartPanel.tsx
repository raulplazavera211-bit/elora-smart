// ─── CartPanel — Panel de carrito con checkout real ──────────────────────────
// Diseño premium Elora Smart: sidebar oscuro con reseñas + columna de checkout.
// Paso 2 ahora envía el pedido real a la base de datos via tRPC orders.create.

import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { REVIEWS, AVATAR_COLORS } from "@/lib/reviews";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

export type CartItem = { id: string; name: string; price: number; img: string };
type CheckoutStep = "cart" | "checkout" | "success";

function GoogleStarIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="#FBBC04">
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

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (idx: number) => void;
  onClearCart?: () => void;
  sections?: string[];
  onNavigate?: (idx: number) => void;
}

export function CartPanel({ isOpen, onClose, cart, onRemove, onClearCart, sections, onNavigate }: CartPanelProps) {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: "", apellidos: "", email: "", telefono: "",
    direccion: "", ciudad: "", cp: "", notas: ""
  });
  const [orderId, setOrderId] = useState<number | null>(null);

  const cartTotal = cart.reduce((s, i) => s + i.price, 0);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setOrderId(data.orderId);
      setCheckoutStep("success");
      onClearCart?.();
    },
    onError: (err) => {
      toast.error("No se pudo procesar el pedido. Por favor, inténtalo de nuevo.");
      console.error("[Checkout] Error:", err);
    },
  });

  function handleClose() {
    onClose();
    // Reset solo si no estamos en success (para que el usuario vea la confirmación)
    if (checkoutStep !== "success") {
      setCheckoutStep("cart");
    }
  }

  function handleSuccessClose() {
    onClose();
    setCheckoutStep("cart");
    setCheckoutForm({ nombre: "", apellidos: "", email: "", telefono: "", direccion: "", ciudad: "", cp: "", notas: "" });
    setOrderId(null);
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    const fullName = `${checkoutForm.nombre} ${checkoutForm.apellidos}`.trim();
    const address = [checkoutForm.direccion, checkoutForm.ciudad, checkoutForm.cp].filter(Boolean).join(", ");
    await createOrder.mutateAsync({
      customerName: fullName,
      customerEmail: checkoutForm.email,
      customerPhone: checkoutForm.telefono || undefined,
      address: address || undefined,
      notes: checkoutForm.notas || undefined,
      items: cart.map(item => ({
        productName: item.name,
        productImg: item.img || undefined,
        unitPrice: item.price,
        quantity: 1,
      })),
    });
  }

  const isSubmitting = createOrder.isPending;

  // ─── FORM FIELDS ────────────────────────────────────────────────────────────
  const inputClass = "bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors w-full";
  const inputClassSm = "bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors w-full";
  const labelClass = "font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50";

  return (
    <motion.div
      initial={false}
      animate={isOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] flex"
      onClick={handleClose}
    >
      {/* Overlay móvil */}
      <motion.div
        className="md:hidden flex-1 bg-foreground/30 backdrop-blur-sm"
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* ── DESKTOP: sidebar izquierdo ── */}
      <div className="hidden md:flex w-72 h-full border-r border-border bg-background flex-col justify-between items-start shrink-0 py-12 z-10">
        <button onClick={handleClose} className="px-10 text-left outline-none">
          <img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto select-none" />
          <p className="font-display text-xs uppercase tracking-[0.4em] text-foreground/50 mt-3">Smart</p>
        </button>
        {sections && sections.length > 0 && (
          <nav className="flex flex-col gap-5 w-full px-10">
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">Índice</p>
            {sections.map((item, idx) => (
              <button
                key={`cart-nav-${item}`}
                onClick={() => { handleClose(); onNavigate?.(idx); }}
                className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
              >
                <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 transition-all duration-500" />
                <span className="font-display text-xl lg:text-2xl uppercase tracking-wide text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">{item}</span>
                <span className="ml-auto font-body text-[10px] text-foreground/20">0{idx + 1}</span>
              </button>
            ))}
          </nav>
        )}
        <div className="px-10 w-full">
          <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent-deep" />
            Est. Galicia · 2024
          </div>
        </div>
      </div>

      {/* ── DESKTOP: layout 2 columnas ── */}
      <div className="hidden md:flex flex-1 h-full overflow-hidden">
        {/* Columna izquierda oscura: imagen + items + reseñas */}
        <div className="w-[420px] xl:w-[480px] h-full bg-[#0F0F0F] flex flex-col shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-white/40">
              {checkoutStep === "cart" ? "Tu selección" : checkoutStep === "checkout" ? "Resumen" : "Confirmado"}
            </p>
            <button onClick={handleClose} aria-label="Cerrar" className="outline-none w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

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
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                      {r.name.charAt(0)}
                    </div>
                    <p className="text-white/80 text-[11px] font-semibold">{r.name}</p>
                    <div className="flex gap-0.5 ml-auto">
                      {[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}
                    </div>
                  </div>
                  <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">{r.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
              <p className="text-white/30 text-[10px]">5.0 · 10 reseñas verificadas en Google</p>
            </div>
          </div>
        </div>

        {/* Columna derecha: carrito / formulario / éxito */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ x: "100%" }}
          animate={isOpen ? { x: 0 } : { x: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 38 }}
          className="flex-1 h-full bg-background flex flex-col"
        >
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
                  {orderId && <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-3">Pedido #{orderId}</p>}
                  <p className="font-body text-base text-foreground/60 leading-relaxed max-w-md">
                    Gracias, {checkoutForm.nombre}. Nos pondremos en contacto contigo en menos de 24h para confirmar tu pedido y coordinar la instalación.
                  </p>
                </div>
                <button
                  onClick={handleSuccessClose}
                  className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors border border-border px-8 py-3 hover:border-foreground"
                >
                  Volver al inicio
                </button>
              </div>
            ) : checkoutStep === "checkout" ? (
              <form
                id="checkout-form-desktop"
                onSubmit={handleSubmitOrder}
                className="px-12 py-10 flex flex-col gap-5 max-w-xl"
              >
                <h2 className="font-display text-2xl uppercase tracking-wide mb-2">Datos de contacto</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Nombre *</label>
                    <input required value={checkoutForm.nombre} onChange={e => setCheckoutForm(f => ({...f, nombre: e.target.value}))} className={inputClass} placeholder="Tu nombre" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Apellidos *</label>
                    <input required value={checkoutForm.apellidos} onChange={e => setCheckoutForm(f => ({...f, apellidos: e.target.value}))} className={inputClass} placeholder="Apellidos" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Email *</label>
                    <input required type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({...f, email: e.target.value}))} className={inputClass} placeholder="tu@email.com" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Teléfono *</label>
                    <input required type="tel" value={checkoutForm.telefono} onChange={e => setCheckoutForm(f => ({...f, telefono: e.target.value}))} className={inputClass} placeholder="+34 600 000 000" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Dirección de envío</label>
                  <input value={checkoutForm.direccion} onChange={e => setCheckoutForm(f => ({...f, direccion: e.target.value}))} className={inputClass} placeholder="Calle, número, piso" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Ciudad</label>
                    <input value={checkoutForm.ciudad} onChange={e => setCheckoutForm(f => ({...f, ciudad: e.target.value}))} className={inputClass} placeholder="Ciudad" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>C.P.</label>
                    <input value={checkoutForm.cp} onChange={e => setCheckoutForm(f => ({...f, cp: e.target.value}))} className={inputClass} placeholder="00000" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Notas adicionales</label>
                  <textarea rows={3} value={checkoutForm.notas} onChange={e => setCheckoutForm(f => ({...f, notas: e.target.value}))} className={`${inputClass} resize-none`} placeholder="Instrucciones de entrega, preguntas..." />
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
                    <button onClick={handleClose} className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors border border-border px-8 py-3 hover:border-foreground">
                      Ver colección
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-wide mb-8">Tu pedido</h2>
                    <AnimatePresence>
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
                            <button onClick={() => onRemove(idx)} className="shrink-0 w-8 h-8 border border-border flex items-center justify-center text-foreground/30 hover:text-foreground hover:border-foreground transition-colors outline-none">
                              <X className="w-4 h-4" />
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </div>

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
                <motion.button
                  type="submit"
                  form="checkout-form-desktop"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{ boxShadow: "0 4px 32px rgba(214,122,0,0.4)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando pedido...</span>
                    </>
                  ) : (
                    <>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <Check className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Confirmar pedido · {cartTotal.toLocaleString('es-ES')} €</span>
                    </>
                  )}
                </motion.button>
              )}
              <p className="font-body text-[10px] text-foreground/30 text-center mt-3">
                Pago seguro · Envío e instalación coordinados por Elora
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── MÓVIL: panel lateral deslizante ── */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={isOpen ? { x: 0 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 38 }}
        className="md:hidden w-full max-w-md h-full bg-background border-l border-border flex flex-col shadow-2xl ml-auto"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <p className="font-display text-lg uppercase tracking-widest">
              {checkoutStep === "cart" ? `Carrito · ${cart.length}` : checkoutStep === "checkout" ? "Datos de contacto" : "Pedido confirmado"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {checkoutStep === "checkout" && (
              <button onClick={() => setCheckoutStep("cart")} className="font-body text-[10px] uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors outline-none flex items-center gap-1">
                <ArrowRight className="w-3 h-3 rotate-180" /> Volver
              </button>
            )}
            <button onClick={handleClose} aria-label="Cerrar" className="outline-none">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

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
                {orderId && <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Pedido #{orderId}</p>}
                <p className="font-body text-sm text-foreground/60 leading-relaxed">Gracias, {checkoutForm.nombre}. Nos pondremos en contacto contigo en menos de 24h.</p>
              </div>
              <button onClick={handleSuccessClose} className="font-body text-xs uppercase tracking-[0.3em] text-foreground/50 hover:text-foreground transition-colors">
                Cerrar
              </button>
            </div>
          ) : checkoutStep === "checkout" ? (
            <form
              id="checkout-form"
              onSubmit={handleSubmitOrder}
              className="px-8 py-6 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelClass}>Nombre *</label><input required value={checkoutForm.nombre} onChange={e => setCheckoutForm(f => ({...f, nombre: e.target.value}))} className={inputClassSm} placeholder="Tu nombre" /></div>
                <div className="flex flex-col gap-1"><label className={labelClass}>Apellidos *</label><input required value={checkoutForm.apellidos} onChange={e => setCheckoutForm(f => ({...f, apellidos: e.target.value}))} className={inputClassSm} placeholder="Apellidos" /></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelClass}>Email *</label><input required type="email" value={checkoutForm.email} onChange={e => setCheckoutForm(f => ({...f, email: e.target.value}))} className={inputClassSm} placeholder="tu@email.com" /></div>
              <div className="flex flex-col gap-1"><label className={labelClass}>Teléfono *</label><input required type="tel" value={checkoutForm.telefono} onChange={e => setCheckoutForm(f => ({...f, telefono: e.target.value}))} className={inputClassSm} placeholder="+34 600 000 000" /></div>
              <div className="flex flex-col gap-1"><label className={labelClass}>Dirección</label><input value={checkoutForm.direccion} onChange={e => setCheckoutForm(f => ({...f, direccion: e.target.value}))} className={inputClassSm} placeholder="Calle, número, piso" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1"><label className={labelClass}>Ciudad</label><input value={checkoutForm.ciudad} onChange={e => setCheckoutForm(f => ({...f, ciudad: e.target.value}))} className={inputClassSm} placeholder="Ciudad" /></div>
                <div className="flex flex-col gap-1"><label className={labelClass}>C.P.</label><input value={checkoutForm.cp} onChange={e => setCheckoutForm(f => ({...f, cp: e.target.value}))} className={inputClassSm} placeholder="00000" /></div>
              </div>
              <div className="flex flex-col gap-1"><label className={labelClass}>Notas</label><textarea rows={2} value={checkoutForm.notas} onChange={e => setCheckoutForm(f => ({...f, notas: e.target.value}))} className={`${inputClassSm} resize-none`} placeholder="Instrucciones de entrega..." /></div>
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
                <AnimatePresence>
                  <ul className="flex flex-col gap-4">
                    {cart.map((item, idx) => (
                      <motion.li key={`mob-${item.id}-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex items-center gap-4 border-b border-border pb-4">
                        <div className="w-16 h-16 shrink-0 overflow-hidden border border-border"><img src={item.img} alt={item.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5">{item.id}</p>
                          <p className="font-display text-sm uppercase tracking-wide leading-snug">{item.name}</p>
                          <p className="font-display text-base text-accent-deep mt-1">{item.price.toLocaleString('es-ES')} €</p>
                        </div>
                        <button onClick={() => onRemove(idx)} className="shrink-0 text-foreground/30 hover:text-foreground transition-colors outline-none"><X className="w-4 h-4" /></button>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>

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
                        <div className="flex items-center gap-1.5">
                          <p className="text-gray-800 text-[11px] font-semibold leading-none shrink-0">{r.name}</p>
                          <div className="flex gap-0.5 shrink-0">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
                        </div>
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
                <motion.button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Enviando...</span></>
                  ) : (
                    <>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <Check className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Confirmar pedido</span>
                    </>
                  )}
                </motion.button>
              )}
              <p className="font-body text-[10px] text-foreground/30 text-center leading-relaxed">Pago seguro · Envío e instalación coordinados por Elora</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
