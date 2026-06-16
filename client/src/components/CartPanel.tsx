// ─── CartPanel — Panel de carrito con checkout Redsys ────────────────────────
// Flujo: Carrito → Datos de envío (validados para España) → Método de pago → TPV Redsys

import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ArrowRight, Check, Loader2, CreditCard, Lock, AlertCircle, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { REVIEWS, AVATAR_COLORS } from "@/lib/reviews";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

// ─── Provincias de España ─────────────────────────────────────────────────────
const PROVINCIAS_ESPANA = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
  "Badajoz", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria",
  "Castellón", "Ciudad Real", "Córdoba", "Cuenca", "Girona", "Granada",
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares",
  "Jaén", "La Coruña", "La Rioja", "Las Palmas", "León", "Lleida",
  "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
  "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid",
  "Vizcaya", "Zamora", "Zaragoza", "Ceuta", "Melilla",
];

export type CartItem = { id: string; name: string; price: number; img: string };
type CheckoutStep = "cart" | "checkout" | "payment" | "redirecting";
type PayMethod = "card" | "bizum";

// ─── Validaciones España ──────────────────────────────────────────────────────
function validateCP(cp: string): string | null {
  const clean = cp.trim();
  if (!clean) return "El código postal es obligatorio";
  if (!/^\d{5}$/.test(clean)) return "El código postal debe tener exactamente 5 dígitos";
  const num = parseInt(clean, 10);
  if (num < 1000 || num > 52999) return "Código postal no válido para España";
  return null;
}

function validateTelefono(tel: string): string | null {
  const clean = tel.trim().replace(/\s/g, "").replace(/-/g, "");
  if (!clean) return "El teléfono es obligatorio";
  // Acepta: 6XXXXXXXX, 7XXXXXXXX, 9XXXXXXXX, +346XXXXXXXX, 0034...
  const stripped = clean.replace(/^(\+34|0034)/, "");
  if (!/^[679]\d{8}$/.test(stripped)) {
    return "Introduce un teléfono español válido (ej: 600 123 456 o +34 600 123 456)";
  }
  return null;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return "El email es obligatorio";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Introduce un email válido";
  return null;
}

function validateNombre(val: string, label: string): string | null {
  if (!val.trim()) return `${label} es obligatorio`;
  if (val.trim().length < 2) return `${label} debe tener al menos 2 caracteres`;
  return null;
}

function validateDireccion(val: string): string | null {
  if (!val.trim()) return "La dirección es obligatoria";
  if (val.trim().length < 5) return "Introduce la dirección completa (calle y número)";
  return null;
}

function validateCiudad(val: string): string | null {
  if (!val.trim()) return "La ciudad/localidad es obligatoria";
  return null;
}

function validateProvincia(val: string): string | null {
  if (!val) return "Selecciona una provincia";
  return null;
}

// ─── Iconos ───────────────────────────────────────────────────────────────────
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

function VisaIcon() {
  return (
    <svg viewBox="0 0 60 20" className="h-5 w-auto">
      <text x="0" y="16" fontFamily="Arial" fontWeight="900" fontSize="18" fill="#1A1F71">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto">
      <circle cx="15" cy="12" r="10" fill="#EB001B"/>
      <circle cx="23" cy="12" r="10" fill="#F79E1B"/>
      <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
    </svg>
  );
}

function BizumIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-7 w-auto" : size === "sm" ? "h-4 w-auto" : "h-5 w-auto";
  return (
    <svg viewBox="0 0 70 22" className={cls}>
      <text x="0" y="17" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#00B259">Bizum</text>
    </svg>
  );
}

// ─── Campo de formulario con error inline ─────────────────────────────────────
function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50">
        {label}{required && <span className="text-accent-deep ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 font-body text-[10px] text-red-400 mt-0.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (idx: number) => void;
  onClearCart?: () => void;
  sections?: string[];
  onNavigate?: (idx: number) => void;
}

// ─── Estado del formulario ────────────────────────────────────────────────────
interface CheckoutFormState {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  numero: string;
  piso: string;
  ciudad: string;
  provincia: string;
  cp: string;
  notas: string;
}

const EMPTY_FORM: CheckoutFormState = {
  nombre: "", apellidos: "", email: "", telefono: "",
  direccion: "", numero: "", piso: "",
  ciudad: "", provincia: "", cp: "", notas: "",
};

// ─── Componente principal ─────────────────────────────────────────────────────
export function CartPanel({ isOpen, onClose, cart, onRemove, onClearCart, sections, onNavigate }: CartPanelProps) {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<CheckoutFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormState, boolean>>>({});
  const [payMethod, setPayMethod] = useState<PayMethod>("card");

  const redsysFormRef = useRef<HTMLFormElement>(null);
  const [redsysData, setRedsysData] = useState<{
    url: string;
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
  } | null>(null);

  const cartTotal = cart.reduce((s, i) => s + i.price, 0);

  const createOrder = trpc.orders.create.useMutation({
    onError: (err) => {
      toast.error("No se pudo procesar el pedido. Por favor, inténtalo de nuevo.");
      console.error("[Checkout] Error:", err);
      setCheckoutStep("checkout");
    },
  });

  const initPayment = trpc.orders.initPayment.useMutation({
    onError: (err) => {
      toast.error(err.message || "Error al iniciar el pago. Inténtalo de nuevo.");
      console.error("[Redsys] Error:", err);
      setCheckoutStep("payment");
    },
  });

  function setField<K extends keyof CheckoutFormState>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }));
    // Limpiar error al editar
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  }

  function markTouched(key: keyof CheckoutFormState) {
    setTouched(t => ({ ...t, [key]: true }));
  }

  function validateAll(): boolean {
    const newErrors: Partial<Record<keyof CheckoutFormState, string>> = {};

    const nombreErr = validateNombre(form.nombre, "El nombre");
    if (nombreErr) newErrors.nombre = nombreErr;

    const apellidosErr = validateNombre(form.apellidos, "Los apellidos");
    if (apellidosErr) newErrors.apellidos = apellidosErr;

    const emailErr = validateEmail(form.email);
    if (emailErr) newErrors.email = emailErr;

    const telErr = validateTelefono(form.telefono);
    if (telErr) newErrors.telefono = telErr;

    const dirErr = validateDireccion(form.direccion);
    if (dirErr) newErrors.direccion = dirErr;

    const ciudadErr = validateCiudad(form.ciudad);
    if (ciudadErr) newErrors.ciudad = ciudadErr;

    const provErr = validateProvincia(form.provincia);
    if (provErr) newErrors.provincia = provErr;

    const cpErr = validateCP(form.cp);
    if (cpErr) newErrors.cp = cpErr;

    setErrors(newErrors);
    // Marcar todos como tocados para mostrar errores
    const allTouched: Partial<Record<keyof CheckoutFormState, boolean>> = {};
    (Object.keys(EMPTY_FORM) as (keyof CheckoutFormState)[]).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  }

  function handleClose() {
    onClose();
    if (checkoutStep !== "redirecting") setCheckoutStep("cart");
  }

  function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Por favor, revisa los campos marcados en rojo.");
      return;
    }
    setCheckoutStep("payment");
  }

  async function handleSubmitPayment() {
    if (cart.length === 0) return;
    setCheckoutStep("redirecting");

    const fullName = `${form.nombre.trim()} ${form.apellidos.trim()}`;
    const addressParts = [
      form.direccion.trim(),
      form.numero.trim(),
      form.piso.trim(),
    ].filter(Boolean).join(", ");
    const fullAddress = [
      addressParts,
      form.ciudad.trim(),
      form.provincia,
      form.cp.trim(),
      "España",
    ].filter(Boolean).join(" · ");

    // Paso 1: crear pedido en la DB
    const orderResult = await createOrder.mutateAsync({
      customerName: fullName,
      customerEmail: form.email.trim(),
      customerPhone: form.telefono.trim() || undefined,
      address: fullAddress || undefined,
      notes: form.notas.trim() || undefined,
      items: cart.map(item => ({
        productName: item.name,
        productImg: item.img || undefined,
        unitPrice: item.price,
        quantity: 1,
      })),
    });

    if (!orderResult?.orderId) return;

    // Paso 2: obtener formulario firmado Redsys con el método de pago elegido
    const paymentResult = await initPayment.mutateAsync({
      orderId: orderResult.orderId,
      origin: window.location.origin,
      payMethod,
    });

    if (!paymentResult) return;

    // Paso 3: vaciar carrito y redirigir al TPV
    onClearCart?.();
    setRedsysData({
      url: paymentResult.url,
      Ds_SignatureVersion: paymentResult.body.Ds_SignatureVersion,
      Ds_MerchantParameters: paymentResult.body.Ds_MerchantParameters,
      Ds_Signature: paymentResult.body.Ds_Signature,
    });

    setTimeout(() => { redsysFormRef.current?.submit(); }, 150);
  }

  const isSubmitting = createOrder.isPending || initPayment.isPending || checkoutStep === "redirecting";

  // ─── Clases reutilizables ─────────────────────────────────────────────────
  const inputBase = "bg-transparent border px-4 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none transition-colors w-full";
  const inputClass = (key: keyof CheckoutFormState) =>
    `${inputBase} ${touched[key] && errors[key] ? "border-red-400 focus:border-red-400" : "border-border focus:border-foreground"}`;
  const inputBaseSm = "bg-transparent border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none transition-colors w-full";
  const inputClassSm = (key: keyof CheckoutFormState) =>
    `${inputBaseSm} ${touched[key] && errors[key] ? "border-red-400 focus:border-red-400" : "border-border focus:border-foreground"}`;

  const selectBase = "bg-background border px-4 py-3 font-body text-sm text-foreground focus:outline-none transition-colors w-full appearance-none cursor-pointer";
  const selectClass = (key: keyof CheckoutFormState) =>
    `${selectBase} ${touched[key] && errors[key] ? "border-red-400 focus:border-red-400" : "border-border focus:border-foreground"}`;
  const selectBaseSm = "bg-background border px-3 py-2.5 font-body text-sm text-foreground focus:outline-none transition-colors w-full appearance-none cursor-pointer";
  const selectClassSm = (key: keyof CheckoutFormState) =>
    `${selectBaseSm} ${touched[key] && errors[key] ? "border-red-400 focus:border-red-400" : "border-border focus:border-foreground"}`;

  // ─── Formulario de datos (desktop) ───────────────────────────────────────
  function renderFormDesktop() {
    return (
      <form
        id="checkout-form-desktop"
        onSubmit={handleContinueToPayment}
        className="px-12 py-10 flex flex-col gap-5 max-w-xl"
        noValidate
      >
        <h2 className="font-display text-2xl uppercase tracking-wide mb-2">Datos de envío</h2>
        <p className="font-body text-xs text-foreground/50 -mt-3">Solo enviamos a España peninsular, Baleares, Canarias, Ceuta y Melilla.</p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre" required error={touched.nombre ? errors.nombre : null}>
            <input
              value={form.nombre}
              onChange={e => setField("nombre", e.target.value)}
              onBlur={() => markTouched("nombre")}
              className={inputClass("nombre")}
              placeholder="Tu nombre"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Apellidos" required error={touched.apellidos ? errors.apellidos : null}>
            <input
              value={form.apellidos}
              onChange={e => setField("apellidos", e.target.value)}
              onBlur={() => markTouched("apellidos")}
              className={inputClass("apellidos")}
              placeholder="Apellidos"
              autoComplete="family-name"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" required error={touched.email ? errors.email : null}>
            <input
              type="email"
              value={form.email}
              onChange={e => setField("email", e.target.value)}
              onBlur={() => markTouched("email")}
              className={inputClass("email")}
              placeholder="tu@email.com"
              autoComplete="email"
              inputMode="email"
            />
          </Field>
          <Field label="Teléfono" required error={touched.telefono ? errors.telefono : null}>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setField("telefono", e.target.value)}
              onBlur={() => markTouched("telefono")}
              className={inputClass("telefono")}
              placeholder="600 123 456"
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
          <Field label="Calle / Avenida" required error={touched.direccion ? errors.direccion : null}>
            <input
              value={form.direccion}
              onChange={e => setField("direccion", e.target.value)}
              onBlur={() => markTouched("direccion")}
              className={inputClass("direccion")}
              placeholder="Calle Mayor"
              autoComplete="address-line1"
            />
          </Field>
          <Field label="Número" error={null}>
            <input
              value={form.numero}
              onChange={e => setField("numero", e.target.value)}
              className={inputClass("numero")}
              placeholder="12"
              autoComplete="address-line2"
            />
          </Field>
          <Field label="Piso / Puerta" error={null}>
            <input
              value={form.piso}
              onChange={e => setField("piso", e.target.value)}
              className={inputClass("piso")}
              placeholder="3ºA"
            />
          </Field>
        </div>

        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
          <Field label="Ciudad / Localidad" required error={touched.ciudad ? errors.ciudad : null}>
            <input
              value={form.ciudad}
              onChange={e => setField("ciudad", e.target.value)}
              onBlur={() => markTouched("ciudad")}
              className={inputClass("ciudad")}
              placeholder="Madrid"
              autoComplete="address-level2"
            />
          </Field>
          <Field label="Provincia" required error={touched.provincia ? errors.provincia : null}>
            <div className="relative">
              <select
                value={form.provincia}
                onChange={e => { setField("provincia", e.target.value); markTouched("provincia"); }}
                onBlur={() => markTouched("provincia")}
                className={selectClass("provincia")}
              >
                <option value="">Selecciona...</option>
                {PROVINCIAS_ESPANA.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">▾</div>
            </div>
          </Field>
          <Field label="C.P." required error={touched.cp ? errors.cp : null}>
            <input
              value={form.cp}
              onChange={e => setField("cp", e.target.value.replace(/\D/g, "").slice(0, 5))}
              onBlur={() => markTouched("cp")}
              className={inputClass("cp")}
              placeholder="28001"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
            />
          </Field>
        </div>

        <Field label="Notas adicionales" error={null}>
          <textarea
            rows={3}
            value={form.notas}
            onChange={e => setField("notas", e.target.value)}
            className={`${inputClass("notas")} resize-none`}
            placeholder="Instrucciones de entrega, horario preferido, preguntas..."
          />
        </Field>
      </form>
    );
  }

  // ─── Selector de método de pago (desktop) ────────────────────────────────
  function renderPaymentSelectorDesktop() {
    return (
      <div className="px-12 py-10 flex flex-col gap-6 max-w-xl">
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1">Método de pago</h2>
          <p className="font-body text-xs text-foreground/50">Elige cómo quieres pagar. Serás redirigido al TPV seguro de Redsys.</p>
        </div>

        {/* Resumen del pedido */}
        <div className="border border-border p-5 flex flex-col gap-3 bg-foreground/[0.02]">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">Resumen del pedido</p>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-body text-sm text-foreground/70">{item.name}</span>
              <span className="font-display text-sm">{item.price.toLocaleString("es-ES")} €</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="font-body text-xs uppercase tracking-widest text-foreground/50">Total con IVA</span>
            <span className="font-display text-2xl">{cartTotal.toLocaleString("es-ES")} €</span>
          </div>
        </div>

        {/* Selector de método */}
        <div className="flex flex-col gap-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">Selecciona tu método de pago</p>

          {/* Tarjeta */}
          <button
            type="button"
            onClick={() => setPayMethod("card")}
            className={`flex items-center gap-4 border p-4 transition-all duration-200 text-left outline-none ${
              payMethod === "card"
                ? "border-foreground bg-foreground/5"
                : "border-border hover:border-foreground/40"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              payMethod === "card" ? "border-foreground" : "border-border"
            }`}>
              {payMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <CreditCard className="w-4 h-4 text-foreground/60" />
                <span className="font-body text-sm font-medium">Tarjeta bancaria</span>
              </div>
              <p className="font-body text-xs text-foreground/40">Visa, Mastercard, American Express</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <VisaIcon />
              <MastercardIcon />
            </div>
          </button>

          {/* Bizum */}
          <button
            type="button"
            onClick={() => setPayMethod("bizum")}
            className={`flex items-center gap-4 border p-4 transition-all duration-200 text-left outline-none ${
              payMethod === "bizum"
                ? "border-[#00B259] bg-[#00B259]/5"
                : "border-border hover:border-[#00B259]/40"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              payMethod === "bizum" ? "border-[#00B259]" : "border-border"
            }`}>
              {payMethod === "bizum" && <div className="w-2.5 h-2.5 rounded-full bg-[#00B259]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Smartphone className="w-4 h-4 text-[#00B259]" />
                <span className="font-body text-sm font-medium">Bizum</span>
              </div>
              <p className="font-body text-xs text-foreground/40">Paga desde tu app bancaria en segundos</p>
            </div>
            <BizumIcon size="lg" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-foreground/30 border border-border/50 p-3">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="font-body text-[10px]">Pago 100% seguro con cifrado SSL · TPV Virtual Redsys · Banco Santander</span>
        </div>
      </div>
    );
  }

  // ─── Formulario de datos (móvil) ──────────────────────────────────────────
  function renderFormMobile() {
    return (
      <form
        id="checkout-form"
        onSubmit={handleContinueToPayment}
        className="px-8 py-6 flex flex-col gap-4"
        noValidate
      >
        <p className="font-body text-[10px] text-foreground/40">Solo enviamos a España. Todos los campos marcados con * son obligatorios.</p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre" required error={touched.nombre ? errors.nombre : null}>
            <input value={form.nombre} onChange={e => setField("nombre", e.target.value)} onBlur={() => markTouched("nombre")} className={inputClassSm("nombre")} placeholder="Nombre" autoComplete="given-name" />
          </Field>
          <Field label="Apellidos" required error={touched.apellidos ? errors.apellidos : null}>
            <input value={form.apellidos} onChange={e => setField("apellidos", e.target.value)} onBlur={() => markTouched("apellidos")} className={inputClassSm("apellidos")} placeholder="Apellidos" autoComplete="family-name" />
          </Field>
        </div>

        <Field label="Email" required error={touched.email ? errors.email : null}>
          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} onBlur={() => markTouched("email")} className={inputClassSm("email")} placeholder="tu@email.com" autoComplete="email" inputMode="email" />
        </Field>

        <Field label="Teléfono" required error={touched.telefono ? errors.telefono : null}>
          <input type="tel" value={form.telefono} onChange={e => setField("telefono", e.target.value)} onBlur={() => markTouched("telefono")} className={inputClassSm("telefono")} placeholder="600 123 456" autoComplete="tel" inputMode="tel" />
        </Field>

        <Field label="Calle / Avenida" required error={touched.direccion ? errors.direccion : null}>
          <input value={form.direccion} onChange={e => setField("direccion", e.target.value)} onBlur={() => markTouched("direccion")} className={inputClassSm("direccion")} placeholder="Calle Mayor" autoComplete="address-line1" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Número" error={null}>
            <input value={form.numero} onChange={e => setField("numero", e.target.value)} className={inputClassSm("numero")} placeholder="12" />
          </Field>
          <Field label="Piso / Puerta" error={null}>
            <input value={form.piso} onChange={e => setField("piso", e.target.value)} className={inputClassSm("piso")} placeholder="3ºA" />
          </Field>
        </div>

        <Field label="Ciudad / Localidad" required error={touched.ciudad ? errors.ciudad : null}>
          <input value={form.ciudad} onChange={e => setField("ciudad", e.target.value)} onBlur={() => markTouched("ciudad")} className={inputClassSm("ciudad")} placeholder="Madrid" autoComplete="address-level2" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Provincia" required error={touched.provincia ? errors.provincia : null}>
            <div className="relative">
              <select value={form.provincia} onChange={e => { setField("provincia", e.target.value); markTouched("provincia"); }} onBlur={() => markTouched("provincia")} className={selectClassSm("provincia")}>
                <option value="">Selecciona...</option>
                {PROVINCIAS_ESPANA.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">▾</div>
            </div>
          </Field>
          <Field label="Código Postal" required error={touched.cp ? errors.cp : null}>
            <input value={form.cp} onChange={e => setField("cp", e.target.value.replace(/\D/g, "").slice(0, 5))} onBlur={() => markTouched("cp")} className={inputClassSm("cp")} placeholder="28001" inputMode="numeric" maxLength={5} autoComplete="postal-code" />
          </Field>
        </div>

        <Field label="Notas adicionales" error={null}>
          <textarea rows={2} value={form.notas} onChange={e => setField("notas", e.target.value)} className={`${inputClassSm("notas")} resize-none`} placeholder="Instrucciones de entrega..." />
        </Field>
      </form>
    );
  }

  // ─── Selector de método de pago (móvil) ──────────────────────────────────
  function renderPaymentSelectorMobile() {
    return (
      <div className="px-8 py-6 flex flex-col gap-5">
        {/* Resumen */}
        <div className="border border-border p-4 flex flex-col gap-2 bg-foreground/[0.02]">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Resumen</p>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-body text-xs text-foreground/70 truncate pr-2">{item.name}</span>
              <span className="font-display text-sm shrink-0">{item.price.toLocaleString("es-ES")} €</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between items-baseline mt-1">
            <span className="font-body text-[10px] uppercase tracking-widest text-foreground/50">Total</span>
            <span className="font-display text-xl">{cartTotal.toLocaleString("es-ES")} €</span>
          </div>
        </div>

        {/* Selector */}
        <div className="flex flex-col gap-2">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">Método de pago</p>

          <button type="button" onClick={() => setPayMethod("card")} className={`flex items-center gap-3 border p-3.5 transition-all duration-200 text-left outline-none ${payMethod === "card" ? "border-foreground bg-foreground/5" : "border-border"}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "card" ? "border-foreground" : "border-border"}`}>
              {payMethod === "card" && <div className="w-2 h-2 rounded-full bg-foreground" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <CreditCard className="w-3.5 h-3.5 text-foreground/60" />
                <span className="font-body text-sm font-medium">Tarjeta bancaria</span>
              </div>
              <p className="font-body text-[10px] text-foreground/40">Visa, Mastercard</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <VisaIcon />
              <MastercardIcon />
            </div>
          </button>

          <button type="button" onClick={() => setPayMethod("bizum")} className={`flex items-center gap-3 border p-3.5 transition-all duration-200 text-left outline-none ${payMethod === "bizum" ? "border-[#00B259] bg-[#00B259]/5" : "border-border"}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "bizum" ? "border-[#00B259]" : "border-border"}`}>
              {payMethod === "bizum" && <div className="w-2 h-2 rounded-full bg-[#00B259]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <Smartphone className="w-3.5 h-3.5 text-[#00B259]" />
                <span className="font-body text-sm font-medium">Bizum</span>
              </div>
              <p className="font-body text-[10px] text-foreground/40">Paga desde tu app bancaria</p>
            </div>
            <BizumIcon size="md" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-foreground/30">
          <Lock className="w-3 h-3 shrink-0" />
          <span className="font-body text-[10px]">Pago seguro SSL · TPV Redsys · Banco Santander</span>
        </div>
      </div>
    );
  }

  // ─── Pasos del stepper ────────────────────────────────────────────────────
  const STEPS = ["Carrito", "Datos de envío", "Pago"];
  const stepIndex = checkoutStep === "cart" ? 0 : checkoutStep === "checkout" ? 1 : 2;

  function StepBar({ mobile = false }: { mobile?: boolean }) {
    if (checkoutStep === "redirecting") return null;
    return (
      <div className={`flex items-center gap-0 ${mobile ? "px-8 py-3" : "px-12 py-5"} border-b border-border shrink-0`}>
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-0">
            <div className={`flex items-center gap-2 transition-colors duration-300 ${i <= stepIndex ? "text-foreground" : "text-foreground/30"}`}>
              <div className={`${mobile ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-[11px]"} rounded-full flex items-center justify-center font-body transition-all duration-300 ${
                i < stepIndex ? "bg-accent-deep text-background" : i === stepIndex ? "bg-foreground text-background" : "border border-border text-foreground/30"
              }`}>
                {i < stepIndex ? <Check className={mobile ? "w-2.5 h-2.5" : "w-3 h-3"} /> : i + 1}
              </div>
              <span className={`font-body uppercase tracking-widest ${mobile ? "text-[9px]" : "text-xs"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${mobile ? "w-6 mx-2" : "w-10 mx-3"} h-[1px] transition-colors duration-300 ${i < stepIndex ? "bg-accent-deep" : "bg-border"}`} />
            )}
          </div>
        ))}
        {checkoutStep !== "cart" && (
          <button
            onClick={() => setCheckoutStep(checkoutStep === "payment" ? "checkout" : "cart")}
            className={`ml-auto font-body ${mobile ? "text-[9px]" : "text-[10px]"} uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors outline-none flex items-center gap-1.5`}
          >
            <ArrowRight className="w-3 h-3 rotate-180" /> Volver
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ── Formulario oculto para POST a Redsys ── */}
      {redsysData && (
        <form ref={redsysFormRef} method="POST" action={redsysData.url} style={{ display: "none" }}>
          <input type="hidden" name="Ds_SignatureVersion" value={redsysData.Ds_SignatureVersion} />
          <input type="hidden" name="Ds_MerchantParameters" value={redsysData.Ds_MerchantParameters} />
          <input type="hidden" name="Ds_Signature" value={redsysData.Ds_Signature} />
        </form>
      )}

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
                <button key={`cart-nav-${item}`} onClick={() => { handleClose(); onNavigate?.(idx); }} className="group text-left outline-none flex items-center gap-4 transition-all duration-500">
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
          {/* Columna izquierda oscura */}
          <div className="w-[420px] xl:w-[480px] h-full bg-[#0F0F0F] flex flex-col shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0">
              <p className="font-display text-xs uppercase tracking-[0.35em] text-white/40">
                {checkoutStep === "cart" ? "Tu selección" : checkoutStep === "checkout" ? "Resumen del pedido" : checkoutStep === "payment" ? "Confirmar pago" : "Procesando pago"}
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
                  <p className="font-display text-base text-[#D67A00] shrink-0">{item.price.toLocaleString("es-ES")} €</p>
                </div>
              ))}
              {cart.length > 0 && (
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-body text-[10px] uppercase tracking-widest text-white/30">Total</span>
                  <span className="font-display text-2xl text-white">{cartTotal.toLocaleString("es-ES")} €</span>
                </div>
              )}
            </div>
            <div className="px-10 mt-auto pb-10">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 mb-4">Lo que dicen nuestros clientes</p>
              <div className="flex flex-col gap-3">
                {REVIEWS.slice(0, 3).map((r, i) => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.6, ease: "easeInOut", delay: i * 0.5 }} className="bg-white/5 border border-white/8 rounded-lg px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{r.name.charAt(0)}</div>
                      <p className="text-white/80 text-[11px] font-semibold">{r.name}</p>
                      <div className="flex gap-0.5 ml-auto">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
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

          {/* Columna derecha */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={isOpen ? { x: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            className="flex-1 h-full bg-background flex flex-col"
          >
            <StepBar />
            <div className="flex-1 overflow-y-auto">
              {checkoutStep === "redirecting" ? (
                <div className="flex flex-col items-center justify-center h-full px-16 text-center gap-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-20 h-20 rounded-full border-2 border-accent-deep border-t-transparent flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-accent-deep" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide mb-3">Redirigiendo al pago</h3>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-sm">
                      Te llevamos al TPV seguro de Redsys para pagar con {payMethod === "bizum" ? "Bizum" : "tarjeta"}.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/30">
                    <Lock className="w-4 h-4" />
                    <span className="font-body text-xs uppercase tracking-widest">Pago 100% seguro · SSL</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <VisaIcon />
                    <MastercardIcon />
                    <BizumIcon />
                  </div>
                </div>
              ) : checkoutStep === "payment" ? (
                renderPaymentSelectorDesktop()
              ) : checkoutStep === "checkout" ? (
                renderFormDesktop()
              ) : (
                <div className="px-12 py-10">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center gap-6 py-20 text-center">
                      <ShoppingBag className="w-16 h-16 text-foreground/10" />
                      <div>
                        <p className="font-display text-xl uppercase tracking-wide text-foreground/30 mb-2">Tu carrito está vacío</p>
                        <p className="font-body text-sm text-foreground/30">Explora nuestra colección y añade un producto</p>
                      </div>
                      <button onClick={handleClose} className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors border border-border px-8 py-3 hover:border-foreground">Ver colección</button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-display text-2xl uppercase tracking-wide mb-8">Tu pedido</h2>
                      <AnimatePresence>
                        <ul className="flex flex-col gap-6">
                          {cart.map((item, idx) => (
                            <motion.li key={`${item.id}-${idx}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="flex items-center gap-6 border-b border-border pb-6">
                              <div className="w-24 h-24 shrink-0 overflow-hidden border border-border bg-[#F8F8F8]">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-1">{item.id}</p>
                                <p className="font-display text-lg uppercase tracking-wide leading-snug">{item.name}</p>
                                <p className="font-display text-xl text-accent-deep mt-2">{item.price.toLocaleString("es-ES")} €</p>
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

            {checkoutStep !== "redirecting" && (
              <div className="px-12 py-8 border-t border-border shrink-0">
                {checkoutStep === "cart" ? (
                  <motion.button onClick={() => setCheckoutStep("checkout")} disabled={cart.length === 0} whileHover={cart.length > 0 ? { scale: 1.01 } : {}} whileTap={cart.length > 0 ? { scale: 0.98 } : {}} className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: cart.length > 0 ? "0 4px 32px rgba(214,122,0,0.4)" : undefined }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ShoppingBag className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{cart.length > 0 ? `Continuar · ${cartTotal.toLocaleString("es-ES")} €` : "Añade productos"}</span>
                    <motion.span className="relative z-10 flex items-center" animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}><ArrowRight className="w-5 h-5" /></motion.span>
                  </motion.button>
                ) : checkoutStep === "checkout" ? (
                  <motion.button type="submit" form="checkout-form-desktop" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 relative overflow-hidden group" style={{ boxShadow: "0 4px 32px rgba(214,122,0,0.4)" }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ArrowRight className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Continuar al pago</span>
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.01 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: "0 4px 32px rgba(214,122,0,0.4)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Preparando pago...</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        {payMethod === "bizum" ? <Smartphone className="w-5 h-5 relative z-10 text-[#00B259]" /> : <CreditCard className="w-5 h-5 relative z-10" />}
                        <span className="relative z-10">Pagar con {payMethod === "bizum" ? "Bizum" : "tarjeta"} · {cartTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                )}
                <p className="font-body text-[10px] text-foreground/30 text-center mt-3">
                  Pago seguro con tarjeta o Bizum · TPV Virtual Redsys
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── MÓVIL ── */}
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
                {checkoutStep === "cart" ? `Carrito · ${cart.length}` : checkoutStep === "checkout" ? "Datos de envío" : checkoutStep === "payment" ? "Método de pago" : "Procesando pago"}
              </p>
            </div>
            <button onClick={handleClose} aria-label="Cerrar" className="outline-none">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <StepBar mobile />

          <div className="flex-1 overflow-y-auto">
            {checkoutStep === "redirecting" ? (
              <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-6">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-16 h-16 rounded-full border-2 border-accent-deep border-t-transparent flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent-deep" />
                </motion.div>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-wide mb-2">Redirigiendo al pago</h3>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">
                    Te llevamos al TPV seguro de Redsys para pagar con {payMethod === "bizum" ? "Bizum" : "tarjeta"}.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-foreground/30">
                  <Lock className="w-3 h-3" />
                  <span className="font-body text-[10px] uppercase tracking-widest">Pago seguro SSL</span>
                </div>
              </div>
            ) : checkoutStep === "payment" ? (
              renderPaymentSelectorMobile()
            ) : checkoutStep === "checkout" ? (
              renderFormMobile()
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
                            <p className="font-display text-base text-accent-deep mt-1">{item.price.toLocaleString("es-ES")} €</p>
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

          {checkoutStep !== "redirecting" && (
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
                    <span className="font-display text-2xl">{cartTotal.toLocaleString("es-ES")} €</span>
                  </div>
                )}
                {checkoutStep === "cart" ? (
                  <motion.button onClick={() => setCheckoutStep("checkout")} disabled={cart.length === 0} whileHover={cart.length > 0 ? { scale: 1.02 } : {}} whileTap={cart.length > 0 ? { scale: 0.97 } : {}} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: cart.length > 0 ? "0 4px 24px rgba(214,122,0,0.35)" : undefined }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ShoppingBag className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{cart.length > 0 ? `Comprar · ${cartTotal.toLocaleString("es-ES")} €` : "Añade productos"}</span>
                    <motion.span className="relative z-10 flex items-center" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}><ArrowRight className="w-4 h-4" /></motion.span>
                  </motion.button>
                ) : checkoutStep === "checkout" ? (
                  <motion.button type="submit" form="checkout-form" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 relative overflow-hidden group" style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ArrowRight className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Continuar al pago</span>
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.97 } : {}} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Preparando pago...</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        {payMethod === "bizum" ? <Smartphone className="w-4 h-4 relative z-10 text-[#00B259]" /> : <CreditCard className="w-4 h-4 relative z-10" />}
                        <span className="relative z-10">Pagar con {payMethod === "bizum" ? "Bizum" : "tarjeta"} · {cartTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                )}
                <p className="font-body text-[10px] text-foreground/30 text-center leading-relaxed">Pago seguro con tarjeta o Bizum · TPV Redsys</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
