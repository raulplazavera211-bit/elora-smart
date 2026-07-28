// ─── CartPanel — Panel de carrito con checkout Redsys ────────────────────────
// Flujo: Carrito → Datos de envío (validados para España) → Método de pago → TPV Redsys

import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { X, ShoppingBag, ArrowRight, Check, Loader2, CreditCard, Lock, AlertCircle, Smartphone, Truck, Gift, MapPin, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { REVIEWS, AVATAR_COLORS } from "@/lib/reviews";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

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

export type CartItem = { id: string; name: string; price: number; img?: string; quantity?: number };
type CheckoutStep = "cart" | "checkout" | "payment" | "redirecting";
type PayMethod = "card" | "bizum" | "transfer" | "cod" | "paypal" | "sequra";
// ─── Países y tarifas de envío ────────────────────────────────────────────────
export const SHIPPING_COUNTRIES = [
  { code: "ES",    label: "España Peninsular",    cost: 0,   flag: "🇪🇸" },
  { code: "PT",    label: "Portugal Continental", cost: 0,   flag: "🇵🇹" },
  { code: "ES-IB", label: "Baleares",             cost: 60,  flag: "🇪🇸" },
  { code: "FR",    label: "Francia Continental",  cost: 150, flag: "🇫🇷" },
  { code: "IT",    label: "Italia Continental",   cost: 120, flag: "🇮🇹" },
  { code: "DE",    label: "Alemania",             cost: 200, flag: "🇩🇪" },
  { code: "NL",    label: "Países Bajos",         cost: 150, flag: "🇳🇱" },
] as const;
export function getShippingCost(code: string): number {
  return SHIPPING_COUNTRIES.find(c => c.code === code)?.cost ?? 0;
}

/**
 * Detecta el país a partir del código postal.
 * El usuario elige el país introduciendo el CP en el formato nativo:
 *   - España:        5 dígitos numéricos (01000-52999, excl. Canarias/Ceuta/Melilla)
 *   - Baleares:      07000-07999
 *   - Portugal:      XXXX-XXX  (ej: 1000-001)
 *   - Países Bajos:  DDDD LL   (ej: 1234 AB)
 *   - Francia:       5 dígitos comenzando por 0-9 pero el usuario debe prefijarlo con "FR:"
 *                    → Para evitar ambigüedad con España, FR se detecta por rango 01000-99999
 *                      SOLO cuando el número está fuera del rango español (>52999) o el usuario
 *                      usa el prefijo "FR:XXXXX".
 *   - Alemania:      5 dígitos, prefijo "DE:" o rango 01067-99998 fuera del rango español.
 *   - Italia:        5 dígitos, prefijo "IT:" o rango 00100-98168 fuera del rango español.
 *
 * Para evitar ambigüedad entre ES/FR/DE/IT (todos usan 5 dígitos), la detección sigue este orden:
 *   1. Formatos inequívocos (PT, NL, prefijos)
 *   2. Baleares (07xxx)
 *   3. España (01000-52999, excl. islas)
 *   4. Francia (53000-99999 o prefijo FR:)
 *   5. Alemania / Italia: solo con prefijo DE: / IT:
 */
export function detectCountryFromCP(cp: string): string | null {
  const clean = cp.trim();

  // Prefijos explícitos: FR:75001, DE:10115, IT:00100
  if (/^FR:/i.test(clean)) {
    const digits = clean.slice(3).replace(/\D/g, "");
    if (digits.length === 5) return "FR";
  }
  if (/^DE:/i.test(clean)) {
    const digits = clean.slice(3).replace(/\D/g, "");
    if (digits.length === 5) return "DE";
  }
  if (/^IT:/i.test(clean)) {
    const digits = clean.slice(3).replace(/\D/g, "");
    if (digits.length === 5) return "IT";
  }

  // Países Bajos: 4 dígitos + espacio opcional + 2 letras (ej: 1234 AB)
  if (/^\d{4}\s?[A-Za-z]{2}$/.test(clean)) return "NL";

  // Portugal: 4 dígitos + guion + 3 dígitos (ej: 1000-001)
  if (/^\d{4}-\d{3}$/.test(clean)) return "PT";

  // Solo dígitos — detectar por rango
  const digits = clean.replace(/\D/g, "");
  if (digits.length === 5) {
    const num = parseInt(digits, 10);

    // Baleares: 07000-07999
    if (num >= 7000 && num <= 7999) return "ES-IB";

    // España peninsular: 01000-52999 (excluir Canarias, Ceuta, Melilla)
    if (num >= 1000 && num <= 52999) {
      if ((num >= 35000 && num <= 35999) || (num >= 38000 && num <= 38999)) return null; // Canarias
      if (num >= 51001 && num <= 51080) return null; // Ceuta
      if (num >= 52001 && num <= 52080) return null; // Melilla
      return "ES";
    }

    // Francia: 53000-99999 (rango inequívoco, fuera de España)
    if (num >= 53000 && num <= 99999) return "FR";
  }

  return null;
}

// ─── Validaciones internacionales ────────────────────────────────────────────
// Validation functions now accept a t() function for i18n
function validateCP(cp: string, t: (k: string) => string): string | null {
  const clean = cp.trim();
  if (!clean) return t("checkout.cpRequired");
  // Aceptar cualquier formato reconocido por detectCountryFromCP
  const detected = detectCountryFromCP(clean);
  if (!detected) return t("checkout.cpInvalid");
  return null;
}

function validateTelefono(tel: string, t: (k: string) => string): string | null {
  const clean = tel.trim().replace(/\s/g, "").replace(/-/g, "");
  if (!clean) return t("checkout.phoneRequired");
  // Aceptar teléfonos internacionales: +XX... o número local de al menos 7 dígitos
  const stripped = clean.replace(/^\+\d{1,3}/, "").replace(/^00\d{1,3}/, "");
  if (stripped.length < 7 || !/^\d+$/.test(stripped)) {
    return t("checkout.phoneInvalid");
  }
  return null;
}

function validateEmail(email: string, t: (k: string) => string): string | null {
  if (!email.trim()) return t("checkout.emailRequired");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return t("checkout.emailInvalid");
  return null;
}

function validateNombre(val: string, label: string, t: (k: string) => string): string | null {
  if (!val.trim()) return `${label} ${t("checkout.fieldRequired")}`;
  if (val.trim().length < 2) return `${label} ${t("checkout.fieldMin")}`;
  return null;
}

function validateDireccion(val: string, t: (k: string) => string): string | null {
  if (!val.trim()) return t("checkout.addressRequired");
  if (val.trim().length < 5) return t("checkout.addressMin");
  return null;
}

function validateCiudad(val: string, t: (k: string) => string): string | null {
  if (!val.trim()) return t("checkout.cityRequired");
  return null;
}

function validateProvincia(val: string, t: (k: string) => string, pais?: string): string | null {
  // Solo obligatoria para España peninsular y Baleares
  if ((pais === "ES" || pais === "ES-IB") && !val) return t("checkout.provinceRequired");
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

// ─── Club Elora formulario inline ───────────────────────────────────────────
function ClubEloraInlineForm() {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const signup = trpc.clubElora.signup.useMutation({
    onSuccess: (data) => {
      if (data.alreadyExists) {
        setAlreadyMember(true);
      } else {
        setDone(true);
      }
    },
    onError: () => toast.error(t("club.error")),
  });

  const inputCls = "bg-white/70 border border-foreground/15 px-3 py-2 font-body text-xs text-foreground placeholder-foreground/30 focus:outline-none focus:border-[#D67A00] transition-colors w-full";

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-2 py-3 text-center"
      >
        <div className="w-10 h-10 rounded-full bg-[#D67A00]/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#D67A00]" />
        </div>
        <p className="font-display text-sm uppercase tracking-wide text-foreground">{t("cart.clubWelcome")}</p>
        <p className="font-body text-[11px] text-foreground/50">{t("cart.clubConfirm")}</p>
      </motion.div>
    );
  }

  if (alreadyMember) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Check className="w-4 h-4 text-[#D67A00] shrink-0" />
        <p className="font-body text-[11px] text-foreground/60">{t("cart.clubAlready")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim()) return;
        signup.mutate({ nombre: nombre || undefined, email: email.trim() });
      }}
      className="flex flex-col gap-2.5"
    >
      <input
        type="text"
        placeholder={t("cart.clubNamePlaceholder")}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={inputCls}
      />
      <input
        type="email"
        placeholder={t("cart.clubEmailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputCls}
      />
      <button
        type="submit"
        disabled={signup.isPending || !email.trim()}
        className="w-full bg-[#D67A00] hover:bg-[#B86800] disabled:opacity-50 text-white font-body text-[10px] uppercase tracking-[0.3em] py-2.5 flex items-center justify-center gap-2 transition-colors"
      >
        {signup.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        {t("cart.clubJoin")}
      </button>
      <p className="font-body text-[9px] text-foreground/30 text-center">{t("cart.clubNoSpam")}</p>
    </form>
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
  pais: string;
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
  pais: "ES",
  direccion: "", numero: "", piso: "",
  ciudad: "", provincia: "", cp: "", notas: "",
};

// ─── Widget de cálculo de envío gratis ─────────────────────────────────────────
function ShippingWidget({
  city, setCity, cp, setCp,
  cpError, checked, showFree, onCheck, compact = false,
  shippingCostResult,
}: {
  city: string; setCity: (v: string) => void;
  cp: string; setCp: (v: string) => void;
  cpError: string | null; checked: boolean; showFree: boolean;
  onCheck: () => void; compact?: boolean;
  shippingCostResult?: { cost: number; country: typeof SHIPPING_COUNTRIES[number] } | null;
}) {
  const { t } = useTranslation();
  const inputCls = `bg-transparent border border-border px-3 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors w-full`;

  return (
    <div className={`border border-border ${compact ? "p-4" : "p-5"} flex flex-col gap-3 relative overflow-hidden`}>
      {/* Banner envío gratis */}
      <AnimatePresence>
        {showFree && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background gap-3 px-4"
          >
            {/* Confetti de puntos */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * (40 + Math.random() * 30),
                  y: Math.sin((i / 12) * Math.PI * 2) * (30 + Math.random() * 20),
                  scale: [0, 1.2, 1, 0],
                }}
                transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: i % 3 === 0 ? "#D67A00" : i % 3 === 1 ? "#22C55E" : "#3B82F6" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center"
            >
              <Truck className="w-7 h-7 text-green-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <p className="font-display text-lg uppercase tracking-wide text-green-500">{t("cart.freeShipping")}</p>
              <p className="font-body text-xs text-foreground/60 mt-1">{t("cart.freeShippingTo")} <span className="font-semibold text-foreground">{city}</span></p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-green-500/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-body text-[10px] uppercase tracking-widest">{t("cart.freeShippingIncluded")}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cabecera */}
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
        <p className="font-body text-[10px] uppercase tracking-widest text-foreground/50">{t("cart.calcShipping")}</p>
        {checked && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto flex items-center gap-1.5 font-body text-[10px] text-green-500"
          >
            <Check className="w-3 h-3" />
            {t("cart.freeShippingCheck")}
          </motion.span>
        )}
      </div>

      {/* Campos */}
      <div className={`grid ${compact ? "grid-cols-1 gap-2" : "grid-cols-[2fr_1fr] gap-3"}`}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          className={inputCls}
          placeholder={t("cart.localityField")}
        />
        <input
          value={cp}
          onChange={e => { setCp(e.target.value.slice(0, 10)); }}
          className={`${inputCls} ${cpError ? "border-red-400" : ""}`}
          placeholder={t("cart.cpField")}
          autoComplete="postal-code"
          maxLength={10}
        />
      </div>
      {cpError && <p className="font-body text-[10px] text-red-400 flex items-center gap-1.5"><AlertCircle className="w-3 h-3" />{cpError}</p>}
      {/* Resultado del cálculo de envío */}
      {shippingCostResult && (
        <div className={`flex items-center gap-2 px-3 py-2 border text-xs font-body ${
          shippingCostResult.cost === 0
            ? "border-green-500/30 bg-green-500/5 text-green-600"
            : "border-amber-500/30 bg-amber-500/5 text-amber-700"
        }`}>
          <span className="text-base">{shippingCostResult.country.flag}</span>
          <span className="font-medium">{shippingCostResult.country.label}</span>
          <span className="ml-auto font-semibold">
            {shippingCostResult.cost === 0 ? t("cart.shippingCostFree") : `${shippingCostResult.cost.toLocaleString("es-ES")} €`}
          </span>
        </div>
      )}

      <motion.button
        type="button"
        onClick={onCheck}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className="w-full border border-foreground/20 hover:border-foreground text-foreground font-body text-[10px] uppercase tracking-[0.25em] py-2.5 flex items-center justify-center gap-2 transition-colors"
      >
        <Truck className="w-3.5 h-3.5" />
        {t("cart.calcShipping")}
      </motion.button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function CartPanel({ isOpen, onClose, cart, onRemove, onClearCart, sections, onNavigate }: CartPanelProps) {
  const { t } = useTranslation();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<CheckoutFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormState, boolean>>>({});
    const [payMethod, setPayMethod] = useState<PayMethod>("card");
  // ─── Autocompletado CP / Municipio ──────────────────────────────────────
  const [cpLookupQuery, setCpLookupQuery] = useState("");
  const [municipioQuery, setMunicipioQuery] = useState("");
  const [showMunicipioSuggestions, setShowMunicipioSuggestions] = useState(false);
  const { data: cpLookupResult } = trpc.geo.lookupByCp.useQuery(
    { cp: cpLookupQuery },
    { enabled: cpLookupQuery.length === 5, staleTime: Infinity }
  );
  const { data: municipioSuggestions } = trpc.geo.lookupByMunicipio.useQuery(
    { query: municipioQuery },
    { enabled: municipioQuery.length >= 3, staleTime: Infinity }
  );
  // Cuando el CP tiene 5 dígitos y hay resultado, rellenar ciudad y provincia
  useEffect(() => {
    if (cpLookupResult && cpLookupQuery.length === 5) {
      setForm(f => ({
        ...f,
        ciudad: f.ciudad || cpLookupResult.municipio,
        provincia: f.provincia || cpLookupResult.provincia,
      }));
      setErrors(e => ({ ...e, ciudad: undefined, provincia: undefined, cp: undefined }));
    }
  }, [cpLookupResult, cpLookupQuery]);
  // ─── Métodos de pago activos (desde el admin) ────────────────────────────
  const { data: activeMethods } = trpc.payments.getActive.useQuery(undefined, {
    staleTime: 60_000,
  });
  const cardEnabled = !activeMethods || activeMethods.length === 0 || activeMethods.some(m => m.type === "redsys_card");
  const bizumEnabled = !activeMethods || activeMethods.length === 0 || activeMethods.some(m => m.type === "redsys_bizum");
  const transferEnabled = activeMethods ? activeMethods.some(m => m.type === "transfer") : false;
  const cashOnDeliveryEnabled = activeMethods ? activeMethods.some(m => m.type === "cash_on_delivery") : false;
  const paypalEnabled = activeMethods ? activeMethods.some(m => m.type === "paypal") : false;
  const sequraEnabled = activeMethods ? activeMethods.some(m => m.type === "sequra") : false;
  // Datos de configuración de los métodos no-Redsys
  const transferConfig = activeMethods?.find(m => m.type === "transfer")?.config as Record<string, string> | undefined;
  const cashConfig = activeMethods?.find(m => m.type === "cash_on_delivery")?.config as Record<string, string> | undefined;
  useEffect(() => {
    if (payMethod === "card" && !cardEnabled && bizumEnabled) setPayMethod("bizum");
    if (payMethod === "bizum" && !bizumEnabled && cardEnabled) setPayMethod("card");
    if (payMethod === "card" && !cardEnabled && !bizumEnabled && transferEnabled) setPayMethod("transfer");
    if (payMethod === "transfer" && !transferEnabled && cardEnabled) setPayMethod("card");
  }, [cardEnabled, bizumEnabled, transferEnabled, cashOnDeliveryEnabled, paypalEnabled, payMethod]);

  // ─── Estado widget envío (internacional) ────────────────────────────────
  const [shippingCity, setShippingCity] = useState("");
  const [shippingCp, setShippingCp] = useState("");
  const [shippingChecked, setShippingChecked] = useState(false);
  const [showFreeShipping, setShowFreeShipping] = useState(false);
  const [shippingCpError, setShippingCpError] = useState<string | null>(null);
  const [shippingCostResult, setShippingCostResult] = useState<{ cost: number; country: typeof SHIPPING_COUNTRIES[number] } | null>(null);
  // Popup de envío (solo móvil)
  const [showShippingPopup, setShowShippingPopup] = useState(false);

  function checkShipping() {
    if (!shippingCity.trim()) { toast.error(t("checkout.cityRequired")); return; }
    const cpErr = validateCP(shippingCp, t);
    if (cpErr) { setShippingCpError(cpErr); return; }
    setShippingCpError(null);
    const countryCode = detectCountryFromCP(shippingCp);
    const countryInfo = SHIPPING_COUNTRIES.find(c => c.code === countryCode);
    if (!countryInfo) {
      setShippingCpError(t("checkout.cpNotSpain"));
      return;
    }
    const cost = countryInfo.cost;
    setShippingCostResult({ cost, country: countryInfo });
    setShippingChecked(true);
    setShowFreeShipping(cost === 0);
    // Pre-rellenar el formulario con los datos ya introducidos
    setForm(f => ({
      ...f,
      ciudad: shippingCity,
      cp: shippingCp,
      pais: countryCode ?? f.pais,
    }));
    // Si es gratis, mostrar animación y luego ir al checkout
    if (cost === 0) {
      setTimeout(() => {
        setShowFreeShipping(false);
        setShowShippingPopup(false);
        setCheckoutStep("checkout");
      }, 2200);
    } else {
      // Si tiene coste, mostrar el precio y dejar que el usuario decida
      setTimeout(() => {
        setShowShippingPopup(false);
        setCheckoutStep("checkout");
      }, 2000);
    }
  }

  const redsysFormRef = useRef<HTMLFormElement>(null);
  const [redsysData, setRedsysData] = useState<{
    url: string;
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
  } | null>(null);

    const cartTotal = cart.reduce((s, i) => s + i.price, 0);
  const shippingCost = getShippingCost(form.pais);
  const orderTotal = cartTotal + shippingCost;
  const createOrder = trpc.orders.create.useMutation({
    onError: (err) => {
      toast.error(t("misc.error"));
      console.error("[Checkout] Error:", err);
      setCheckoutStep("checkout");
    },
  });

  const initPayment = trpc.orders.initPayment.useMutation({
    onError: (err) => {
      toast.error(err.message || t("misc.error"));
      console.error("[Redsys] Error:", err);
      setCheckoutStep("payment");
    },
  });

  const createPaypalOrder = trpc.orders.createPaypalOrder.useMutation();
  const capturePaypalOrder = trpc.orders.capturePaypalOrder.useMutation();
  const initSequraPayment = trpc.orders.initSequraPayment.useMutation({
    onError: (err) => {
      toast.error(err.message || "Error al iniciar el pago con seQura");
      setCheckoutStep("payment");
    },
  });
  const [{ isPending: paypalLoading }] = usePayPalScriptReducer();
  // orderId pendiente para PayPal (se crea antes de abrir el popup PayPal)
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);

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

    const nombreErr = validateNombre(form.nombre, t("checkout.name"), t);
    if (nombreErr) newErrors.nombre = nombreErr;

    const apellidosErr = validateNombre(form.apellidos, t("checkout.surnames"), t);
    if (apellidosErr) newErrors.apellidos = apellidosErr;

    const emailErr = validateEmail(form.email, t);
    if (emailErr) newErrors.email = emailErr;

    const telErr = validateTelefono(form.telefono, t);
    if (telErr) newErrors.telefono = telErr;

    const dirErr = validateDireccion(form.direccion, t);
    if (dirErr) newErrors.direccion = dirErr;

    const ciudadErr = validateCiudad(form.ciudad, t);
    if (ciudadErr) newErrors.ciudad = ciudadErr;

    const provErr = validateProvincia(form.provincia, t, form.pais);
    if (provErr) newErrors.provincia = provErr;

    const cpErr = validateCP(form.cp, t);
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
      toast.error(t("misc.error"));
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
    const countryLabel = SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? "España";
    const fullAddress = [
      addressParts,
      form.ciudad.trim(),
      form.provincia,
      form.cp.trim(),
      countryLabel,
    ].filter(Boolean).join(" · ");

    // Paso 1: crear pedido en la DB
    const orderResult = await createOrder.mutateAsync({
      customerName: fullName,
      customerEmail: form.email.trim(),
      customerPhone: form.telefono.trim() || undefined,
      address: fullAddress || undefined,
      shippingAddress: addressParts || undefined,
      shippingCity: form.ciudad.trim() || undefined,
      shippingProvince: form.provincia || undefined,
      shippingPostalCode: form.cp.trim() || undefined,
      shippingCountry: countryLabel,
      shippingCost,
      paymentMethod: payMethod,
      notes: form.notas.trim() || undefined,
      items: cart.map(item => ({
        productName: item.name,
        productImg: item.img || undefined,
        unitPrice: item.price,
        quantity: 1,
      })),
    });

    if (!orderResult?.orderId) return;

    // Paso 2a: seQura — formulario embebido
    if (payMethod === "sequra") {
      const sequraResult = await initSequraPayment.mutateAsync({
        orderId: orderResult.orderId,
        origin: window.location.origin,
        customerFirstName: form.nombre.trim(),
        customerLastName: form.apellidos.trim(),
        customerPhone: form.telefono.trim() || undefined,
        userAgent: navigator.userAgent,
        languageCode: navigator.language?.split('-')[0] ?? 'es',
      });
      if (!sequraResult?.formHtml) return;
      // Inyectar el HTML del formulario de seQura en el body y activarlo
      const container = document.getElementById('sequra-form-container') || (() => {
        const div = document.createElement('div');
        div.id = 'sequra-form-container';
        document.body.appendChild(div);
        return div;
      })();
      container.innerHTML = sequraResult.formHtml;
      // Ejecutar los scripts del formulario
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
          newScript.type = oldScript.type || 'text/javascript';
          newScript.onload = () => {
            // Mostrar el formulario cuando el script cargue
            setTimeout(() => {
              if ((window as any).SequraFormInstance) {
                (window as any).SequraFormInstance.setCloseCallback(() => {
                  container.innerHTML = '';
                });
                (window as any).SequraFormInstance.show();
              }
            }, 200);
          };
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
        oldScript.remove();
      });
      // Si el script ya estaba cargado, mostrar directamente
      setTimeout(() => {
        if ((window as any).SequraFormInstance) {
          (window as any).SequraFormInstance.setCloseCallback(() => {
            container.innerHTML = '';
          });
          (window as any).SequraFormInstance.show();
        }
      }, 500);
      onClearCart?.();
      return;
    }

    // Paso 2b: Redsys (tarjeta, Bizum, transferencia, contrareembolso)
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

  const isSubmitting = createOrder.isPending || initPayment.isPending || initSequraPayment.isPending || checkoutStep === "redirecting";

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
        <h2 className="font-display text-2xl uppercase tracking-wide mb-2">{t("checkout.title")}</h2>
        <p className="font-body text-xs text-foreground/50 -mt-3">{t("checkout.selectCountryHint")}</p>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("checkout.name")} required error={touched.nombre ? errors.nombre : null}>
            <input
              value={form.nombre}
              onChange={e => setField("nombre", e.target.value)}
              onBlur={() => markTouched("nombre")}
              className={inputClass("nombre")}
              placeholder={t("checkout.namePlaceholder")}
              autoComplete="given-name"
            />
          </Field>
          <Field label={t("checkout.surnames")} required error={touched.apellidos ? errors.apellidos : null}>
            <input
              value={form.apellidos}
              onChange={e => setField("apellidos", e.target.value)}
              onBlur={() => markTouched("apellidos")}
              className={inputClass("apellidos")}
              placeholder={t("checkout.surnamesPlaceholder")}
              autoComplete="family-name"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("checkout.email")} required error={touched.email ? errors.email : null}>
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
          <Field label={t("checkout.phone")} required error={touched.telefono ? errors.telefono : null}>
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

        {/* Selector de país */}
        <Field label={t("checkout.country")} required error={null}>
          <div className="relative">
            <select
              value={form.pais}
              onChange={e => {
                const newPais = e.target.value;
                setField("pais", newPais);
                if (newPais !== "ES" && newPais !== "ES-IB") {
                  setField("provincia", "");
                }
                setField("cp", "");
              }}
              className={selectClass("pais")}
            >
              {SHIPPING_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">▾</div>
          </div>
        </Field>

        {/* Campo CP con detección automática de país */}
        <Field label={t("checkout.cp")} required error={touched.cp ? errors.cp : null}>
          <div className="relative">
            <input
              value={form.cp}
              onChange={e => {
                const v = e.target.value.slice(0, 10);
                setField("cp", v);
                // Detectar país automáticamente
                const detected = detectCountryFromCP(v);
                if (detected && detected !== form.pais) {
                  setField("pais", detected);
                  if (detected !== "ES" && detected !== "ES-IB") {
                    setField("provincia", "");
                  }
                }
                // Para España/Baleares: autocompletar municipio cuando CP tiene 5 dígitos
                if ((detected === "ES" || detected === "ES-IB") && v.replace(/\D/g,"").length === 5) {
                  setCpLookupQuery(v.replace(/\D/g,""));
                }
              }}
              onBlur={() => markTouched("cp")}
              className={inputClass("cp")}
              placeholder="28001, 1000-001, 75001…"
              autoComplete="postal-code"
            />
            {/* Indicador de país detectado */}
            {form.pais && (() => {
              const country = SHIPPING_COUNTRIES.find(c => c.code === form.pais);
              return country ? (
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base" title={country.label}>
                  {country.flag}
                </div>
              ) : null;
            })()}
          </div>
        </Field>
        {/* Banner coste de envío — solo se muestra cuando el CP es reconocido */}
        {form.cp.length >= 4 && (
          <div className={`flex items-center gap-3 px-4 py-3 border ${
            detectCountryFromCP(form.cp)
              ? shippingCost === 0
                ? "border-green-500/30 bg-green-500/5 text-green-600"
                : "border-amber-500/30 bg-amber-500/5 text-amber-700"
              : "border-border/30 bg-muted/30 text-muted-foreground"
          }`}>
            <Truck className="w-4 h-4 shrink-0" />
            <span className="font-body text-xs">
              {detectCountryFromCP(form.cp)
                ? shippingCost === 0
                  ? `${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.flag ?? ""} ${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? ""} — ${t("checkout.shippingFree")}`
                  : `${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.flag ?? ""} ${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? ""} — ${t("checkout.shippingCost")} ${shippingCost.toLocaleString("es-ES")} €`
                : t("checkout.selectCountryHint")
              }
            </span>
          </div>
        )}
        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <Field label={t("checkout.street")} required error={touched.direccion ? errors.direccion : null}>
            <input
              value={form.direccion}
              onChange={e => setField("direccion", e.target.value)}
              onBlur={() => markTouched("direccion")}
              className={inputClass("direccion")}
              placeholder={t("checkout.streetPlaceholder")}
              autoComplete="address-line1"
            />
          </Field>
          <Field label={t("checkout.number")} error={null}>
            <input
              value={form.numero}
              onChange={e => setField("numero", e.target.value)}
              className={inputClass("numero")}
              placeholder={t("checkout.numberPlaceholder")}
              autoComplete="address-line2"
            />
          </Field>
          <Field label={t("checkout.floor")} error={null}>
            <input
              value={form.piso}
              onChange={e => setField("piso", e.target.value)}
              className={inputClass("piso")}
              placeholder={t("checkout.floorPlaceholder")}
            />
          </Field>
        </div>

        {/* Campos ciudad / región / CP — adaptativos según país */}
        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
          {/* Ciudad */}
          <Field label={t("checkout.city")} required error={touched.ciudad ? errors.ciudad : null}>
            {(form.pais === "ES" || form.pais === "ES-IB") ? (
              <div className="relative">
                <input
                  value={form.ciudad}
                  onChange={e => {
                    setField("ciudad", e.target.value);
                    if (e.target.value.length >= 3) {
                      setMunicipioQuery(e.target.value);
                      setShowMunicipioSuggestions(true);
                    } else {
                      setShowMunicipioSuggestions(false);
                    }
                  }}
                  onBlur={() => { markTouched("ciudad"); setTimeout(() => setShowMunicipioSuggestions(false), 200); }}
                  onFocus={() => { if (form.ciudad.length >= 3) setShowMunicipioSuggestions(true); }}
                  className={inputClass("ciudad")}
                  placeholder={t("checkout.cityPlaceholder")}
                  autoComplete="off"
                />
                {showMunicipioSuggestions && municipioSuggestions && municipioSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border shadow-lg max-h-48 overflow-y-auto">
                    {municipioSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => {
                          setField("ciudad", s.municipio);
                          setField("provincia", s.provincia);
                          setField("cp", s.cp);
                          setCpLookupQuery(s.cp);
                          setShowMunicipioSuggestions(false);
                          setErrors(e => ({ ...e, ciudad: undefined, provincia: undefined, cp: undefined }));
                        }}
                        className="w-full text-left px-4 py-2.5 font-body text-sm hover:bg-foreground/5 transition-colors flex items-center justify-between gap-4"
                      >
                        <span className="font-medium">{s.municipio}</span>
                        <span className="text-foreground/40 text-xs shrink-0">{s.provincia} · {s.cp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                value={form.ciudad}
                onChange={e => setField("ciudad", e.target.value)}
                onBlur={() => markTouched("ciudad")}
                className={inputClass("ciudad")}
                placeholder={t("checkout.cityPlaceholder")}
                autoComplete="address-level2"
              />
            )}
          </Field>
          {/* Provincia / Región */}
          <Field
            label={form.pais === "ES" || form.pais === "ES-IB" ? t("checkout.province") : t("checkout.region")}
            required={form.pais === "ES" || form.pais === "ES-IB"}
            error={touched.provincia ? errors.provincia : null}
          >
            {(form.pais === "ES" || form.pais === "ES-IB") ? (
              <div className="relative">
                <select
                  value={form.provincia}
                  onChange={e => { setField("provincia", e.target.value); markTouched("provincia"); }}
                  onBlur={() => markTouched("provincia")}
                  className={selectClass("provincia")}
                >
                  <option value="">{t("checkout.selectProvince")}</option>
                  {PROVINCIAS_ESPANA.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40">▾</div>
              </div>
            ) : (
              <input
                value={form.provincia}
                onChange={e => setField("provincia", e.target.value)}
                onBlur={() => markTouched("provincia")}
                className={inputClass("provincia")}
                placeholder={t("checkout.regionPlaceholder")}
                autoComplete="address-level1"
              />
            )}
          </Field>
          {/* CP ya se captura arriba con detección automática de país */}
        </div>

        <Field label={t("checkout.notes")} error={null}>
          <textarea
            rows={3}
            value={form.notas}
            onChange={e => setField("notas", e.target.value)}
            className={`${inputClass("notas")} resize-none`}
            placeholder={t("checkout.notesPlaceholder")}
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
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1">{t("checkout.paymentMethod")}</h2>
          <p className="font-body text-xs text-foreground/50">{t("checkout.bizumSub")}</p>
        </div>

        {/* Badge envío gratis animado */}
        <div className="relative overflow-hidden border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex items-center gap-3 rounded-sm">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div className="flex-1">
            <p className="font-body text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{t("cart.freeShippingBadge")}</p>
            <p className="font-body text-[10px] text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">{t("cart.freeShippingBadgeSub")}</p>
          </div>
          <span className="text-xl">🚚</span>
          {/* Efecto de brillo deslizante */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent" style={{ animationDelay: "0.5s" }} />
        </div>
        {/* Resumen del pedido */}
        <div className="border border-border p-5 flex flex-col gap-3 bg-foreground/[0.02]">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">{t("checkout.orderSummary")}</p>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="font-body text-sm text-foreground/70">{item.name}</span>
              <span className="font-display text-sm">{item.price.toLocaleString("es-ES")} €</span>
            </div>
          ))}
                    <div className="border-t border-border pt-3 flex flex-col gap-2">
            {shippingCost > 0 && (
              <div className="flex justify-between items-baseline">
                <span className="font-body text-xs text-foreground/50">{t("checkout.subtotal")}</span>
                <span className="font-display text-sm">{cartTotal.toLocaleString("es-ES")} €</span>
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <span className="font-body text-xs text-foreground/50">{t("checkout.shippingLabel")}</span>
              <span className={`font-body text-sm font-semibold ${shippingCost === 0 ? "text-green-600" : "text-amber-700"}`}>
                {shippingCost === 0 ? t("checkout.freeShipping") : `${shippingCost.toLocaleString("es-ES")} €`}
              </span>
            </div>
            <div className="flex justify-between items-baseline border-t border-border pt-2 mt-1">
              <span className="font-body text-xs uppercase tracking-widest text-foreground/50">{t("cart.totalVat")}</span>
              <span className="font-display text-2xl">{orderTotal.toLocaleString("es-ES")} €</span>
            </div>
          </div>
        </div>
                {/* Selector de método */}
        <div className="flex flex-col gap-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">{t("checkout.paymentMethodSelect")}</p>
          {/* Tarjeta */}
          {cardEnabled && (
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
                  <span className="font-body text-sm font-medium">{t("checkout.card")}</span>
                </div>
                <p className="font-body text-xs text-foreground/40">{t("checkout.cardSub")}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <VisaIcon />
                <MastercardIcon />
              </div>
            </button>
          )}
          {/* Bizum */}
          {bizumEnabled && (
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
                  <span className="font-body text-sm font-medium">{t("checkout.bizum")}</span>
                </div>
                <p className="font-body text-xs text-foreground/40">{t("checkout.bizumSub")}</p>
              </div>
              <BizumIcon size="lg" />
            </button>
          )}
          {/* PayPal */}
          {paypalEnabled && (
            <button
              type="button"
              onClick={() => setPayMethod("paypal")}
              className={`flex items-center gap-4 border p-4 transition-all duration-200 text-left outline-none ${
                payMethod === "paypal"
                  ? "border-[#003087] bg-[#003087]/5"
                  : "border-border hover:border-[#003087]/40"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                payMethod === "paypal" ? "border-[#003087]" : "border-border"
              }`}>
                {payMethod === "paypal" && <div className="w-2.5 h-2.5 rounded-full bg-[#003087]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-body text-sm font-medium text-[#003087]">PayPal</span>
                </div>
                <p className="font-body text-xs text-foreground/40">Paga de forma segura con tu cuenta PayPal</p>
              </div>
              <svg viewBox="0 0 101 32" className="h-5 w-auto" aria-label="PayPal">
                <path fill="#003087" d="M12.237 2.8H5.996C5.55 2.8 5.17 3.12 5.1 3.56L2.6 19.8c-.05.33.2.63.54.63h3.16c.45 0 .83-.32.9-.77l.67-4.26c.07-.44.45-.77.9-.77h2.04c4.24 0 6.69-2.05 7.33-6.12.29-1.78.01-3.17-.82-4.15-.91-1.07-2.52-1.56-4.1-1.56zm.74 6.03c-.35 2.3-2.11 2.3-3.81 2.3h-.97l.68-4.3c.04-.27.28-.47.55-.47h.44c1.16 0 2.25 0 2.82.66.34.39.44.97.29 1.81z"/>
                <path fill="#003087" d="M35.435 8.73h-3.17c-.28 0-.51.2-.55.47l-.14.9-.22-.32c-.69-1-2.22-1.33-3.75-1.33-3.51 0-6.51 2.66-7.09 6.39-.3 1.86.13 3.64 1.18 4.88.97 1.14 2.35 1.61 3.99 1.61 2.83 0 4.4-1.82 4.4-1.82l-.14.89c-.05.33.2.63.54.63h2.85c.45 0 .83-.32.9-.77l1.71-10.82c.05-.33-.2-.63-.55-.63zm-4.41 6.19c-.3 1.82-1.73 3.04-3.57 3.04-.92 0-1.65-.3-2.12-.85-.47-.56-.65-1.35-.5-2.23.28-1.8 1.73-3.06 3.54-3.06.9 0 1.63.3 2.11.86.49.57.68 1.36.54 2.24z"/>
                <path fill="#003087" d="M55.233 8.73h-3.18c-.31 0-.6.15-.78.41l-4.51 6.64-1.91-6.38c-.12-.4-.49-.67-.91-.67h-3.12c-.38 0-.64.37-.52.73l3.6 10.56-3.39 4.78c-.26.37 0 .88.44.88h3.17c.31 0 .6-.15.78-.4l10.88-15.7c.26-.37 0-.88-.44-.88z"/>
                <path fill="#009cde" d="M66.034 2.8h-6.24c-.45 0-.83.32-.9.77l-2.5 15.86c-.05.33.2.63.54.63h3.39c.31 0 .58-.23.63-.54l.71-4.49c.07-.44.45-.77.9-.77h2.04c4.24 0 6.69-2.05 7.33-6.12.29-1.78.01-3.17-.82-4.15-.91-1.07-2.52-1.56-4.08-1.56zm.74 6.03c-.35 2.3-2.11 2.3-3.81 2.3h-.96l.68-4.3c.04-.27.28-.47.55-.47h.44c1.16 0 2.25 0 2.82.66.34.39.44.97.28 1.81z"/>
                <path fill="#009cde" d="M89.23 8.73h-3.17c-.28 0-.51.2-.55.47l-.14.9-.22-.32c-.69-1-2.22-1.33-3.75-1.33-3.51 0-6.51 2.66-7.09 6.39-.3 1.86.13 3.64 1.18 4.88.97 1.14 2.35 1.61 3.99 1.61 2.83 0 4.4-1.82 4.4-1.82l-.14.89c-.05.33.2.63.54.63h2.85c.45 0 .83-.32.9-.77l1.71-10.82c.05-.33-.2-.63-.55-.63zm-4.41 6.19c-.3 1.82-1.73 3.04-3.57 3.04-.92 0-1.65-.3-2.12-.85-.47-.56-.65-1.35-.5-2.23.28-1.8 1.73-3.06 3.54-3.06.9 0 1.63.3 2.11.86.49.57.68 1.36.54 2.24z"/>
                <path fill="#009cde" d="M95.428 3.2l-2.54 16.16c-.05.33.2.63.54.63h2.73c.45 0 .83-.32.9-.77l2.5-15.86c.05-.33-.2-.63-.54-.63h-3.05c-.27 0-.5.2-.54.47z"/>
              </svg>
            </button>
          )}
          {/* seQura */}
          {sequraEnabled && (
            <button
              type="button"
              onClick={() => setPayMethod("sequra")}
              className={`flex items-center gap-4 border p-4 transition-all duration-200 text-left outline-none ${
                payMethod === "sequra"
                  ? "border-[#FF6B35] bg-[#FF6B35]/5"
                  : "border-border hover:border-[#FF6B35]/40"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                payMethod === "sequra" ? "border-[#FF6B35]" : "border-border"
              }`}>
                {payMethod === "sequra" && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body text-sm font-medium text-foreground">Paga en 3 cuotas sin interés</span>
                  <span className="bg-[#FF6B35] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">seQura</span>
                </div>
                <p className="font-body text-xs text-foreground/40">Solo necesitas tu DNI y móvil. Sin tarjeta.</p>
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-foreground/30 border border-border/50 p-3">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="font-body text-[10px]">{t("cart.securePayFull")}</span>
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
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("checkout.name")} required error={touched.nombre ? errors.nombre : null}>
            <input value={form.nombre} onChange={e => setField("nombre", e.target.value)} onBlur={() => markTouched("nombre")} className={inputClassSm("nombre")} placeholder={t("checkout.namePlaceholder")} autoComplete="given-name" />
          </Field>
          <Field label={t("checkout.surnames")} required error={touched.apellidos ? errors.apellidos : null}>
            <input value={form.apellidos} onChange={e => setField("apellidos", e.target.value)} onBlur={() => markTouched("apellidos")} className={inputClassSm("apellidos")} placeholder={t("checkout.surnamesPlaceholder")} autoComplete="family-name" />
          </Field>
        </div>

        <Field label={t("checkout.email")} required error={touched.email ? errors.email : null}>
          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} onBlur={() => markTouched("email")} className={inputClassSm("email")} placeholder="tu@email.com" autoComplete="email" inputMode="email" />
        </Field>

        <Field label={t("checkout.phone")} required error={touched.telefono ? errors.telefono : null}>
          <input type="tel" value={form.telefono} onChange={e => setField("telefono", e.target.value)} onBlur={() => markTouched("telefono")} className={inputClassSm("telefono")} placeholder="600 123 456" autoComplete="tel" inputMode="tel" />
        </Field>

        <Field label={t("checkout.street")} required error={touched.direccion ? errors.direccion : null}>
          <input value={form.direccion} onChange={e => setField("direccion", e.target.value)} onBlur={() => markTouched("direccion")} className={inputClassSm("direccion")} placeholder={t("checkout.streetPlaceholder")} autoComplete="address-line1" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t("checkout.number")} error={null}>
            <input value={form.numero} onChange={e => setField("numero", e.target.value)} className={inputClassSm("numero")} placeholder={t("checkout.numberPlaceholder")} />
          </Field>
          <Field label={t("checkout.floor")} error={null}>
            <input value={form.piso} onChange={e => setField("piso", e.target.value)} className={inputClassSm("piso")} placeholder={t("checkout.floorPlaceholder")} />
          </Field>
        </div>

        {/* Selector de país */}
        <Field label={t("checkout.country")} required error={null}>
          <div className="relative">
            <select
              value={form.pais}
              onChange={e => {
                const newPais = e.target.value;
                setField("pais", newPais);
                if (newPais !== "ES" && newPais !== "ES-IB") {
                  setField("provincia", "");
                }
                setField("cp", "");
              }}
              className={selectClassSm("pais")}
            >
              {SHIPPING_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">▾</div>
          </div>
        </Field>

        {/* CP con detección automática de país */}
        <Field label={t("checkout.cp")} required error={touched.cp ? errors.cp : null}>
          <div className="relative">
            <input
              value={form.cp}
              onChange={e => {
                const v = e.target.value.slice(0, 10);
                setField("cp", v);
                // Detectar país automáticamente
                const detected = detectCountryFromCP(v);
                if (detected && detected !== form.pais) {
                  setField("pais", detected);
                  if (detected !== "ES" && detected !== "ES-IB") {
                    setField("provincia", "");
                  }
                }
                // Para España/Baleares: autocompletar municipio cuando CP tiene 5 dígitos
                if ((detected === "ES" || detected === "ES-IB") && v.replace(/\D/g,"").length === 5) {
                  setCpLookupQuery(v.replace(/\D/g,""));
                }
              }}
              onBlur={() => markTouched("cp")}
              className={inputClassSm("cp")}
              placeholder="28001, 1000-001, 75001…"
              autoComplete="postal-code"
              maxLength={10}
            />
            {form.pais && (() => {
              const country = SHIPPING_COUNTRIES.find(c => c.code === form.pais);
              return country ? (
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base" title={country.label}>
                  {country.flag}
                </div>
              ) : null;
            })()}
          </div>
        </Field>
        {/* Banner coste de envío */}
        {form.cp.length >= 4 && (
          <div className={`flex items-center gap-2 px-3 py-2 border text-xs font-body ${
            detectCountryFromCP(form.cp)
              ? shippingCost === 0
                ? "border-green-500/30 bg-green-500/5 text-green-600"
                : "border-amber-500/30 bg-amber-500/5 text-amber-700"
              : "border-border/30 bg-muted/30 text-muted-foreground"
          }`}>
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>
              {detectCountryFromCP(form.cp)
                ? shippingCost === 0
                  ? `${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.flag ?? ""} ${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? ""} — ${t("checkout.shippingFree")}`
                  : `${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.flag ?? ""} ${SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? ""} — ${t("checkout.shippingCost")} ${shippingCost.toLocaleString("es-ES")} €`
                : t("checkout.selectCountryHint")
              }
            </span>
          </div>
        )}

        <Field label={t("checkout.city")} required error={touched.ciudad ? errors.ciudad : null}>
          <div className="relative">
            <input
              value={form.ciudad}
              onChange={e => {
                setField("ciudad", e.target.value);
                if (e.target.value.length >= 3) {
                  setMunicipioQuery(e.target.value);
                  setShowMunicipioSuggestions(true);
                } else {
                  setShowMunicipioSuggestions(false);
                }
              }}
              onBlur={() => { markTouched("ciudad"); setTimeout(() => setShowMunicipioSuggestions(false), 200); }}
              onFocus={() => { if (form.ciudad.length >= 3) setShowMunicipioSuggestions(true); }}
              className={inputClassSm("ciudad")}
              placeholder={t("checkout.cityPlaceholder")}
              autoComplete="off"
            />
            {showMunicipioSuggestions && municipioSuggestions && municipioSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border shadow-lg max-h-40 overflow-y-auto">
                {municipioSuggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={() => {
                      setField("ciudad", s.municipio);
                      setField("provincia", s.provincia);
                      setField("cp", s.cp);
                      setCpLookupQuery(s.cp);
                      setShowMunicipioSuggestions(false);
                      setErrors(e => ({ ...e, ciudad: undefined, provincia: undefined, cp: undefined }));
                    }}
                    className="w-full text-left px-3 py-2 font-body text-xs hover:bg-foreground/5 transition-colors flex items-center justify-between gap-3"
                  >
                    <span className="font-medium">{s.municipio}</span>
                    <span className="text-foreground/40 text-[10px] shrink-0">{s.cp}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        {/* Provincia / Región */}
        <Field
          label={form.pais === "ES" || form.pais === "ES-IB" ? t("checkout.province") : t("checkout.region")}
          required={form.pais === "ES" || form.pais === "ES-IB"}
          error={touched.provincia ? errors.provincia : null}
        >
          {(form.pais === "ES" || form.pais === "ES-IB") ? (
            <div className="relative">
              <select value={form.provincia} onChange={e => { setField("provincia", e.target.value); markTouched("provincia"); }} onBlur={() => markTouched("provincia")} className={selectClassSm("provincia")}>
                <option value="">{t("checkout.selectProvince")}</option>
                {PROVINCIAS_ESPANA.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">▾</div>
            </div>
          ) : (
            <input
              value={form.provincia}
              onChange={e => setField("provincia", e.target.value)}
              onBlur={() => markTouched("provincia")}
              className={inputClassSm("provincia")}
              placeholder={t("checkout.regionPlaceholder")}
              autoComplete="address-level1"
            />
          )}
        </Field>

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
          {cardEnabled && (
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
          )}
          {bizumEnabled && (
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
          )}
          {/* PayPal móvil */}
          {paypalEnabled && (
            <button type="button" onClick={() => setPayMethod("paypal")} className={`flex items-center gap-3 border p-3.5 transition-all duration-200 text-left outline-none ${payMethod === "paypal" ? "border-[#003087] bg-[#003087]/5" : "border-border"}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "paypal" ? "border-[#003087]" : "border-border"}`}>
                {payMethod === "paypal" && <div className="w-2 h-2 rounded-full bg-[#003087]" />}
              </div>
              <div className="flex-1">
                <span className="font-body text-sm font-medium text-[#003087]">PayPal</span>
                <p className="font-body text-[10px] text-foreground/40">Paga con tu cuenta PayPal</p>
              </div>
              <svg viewBox="0 0 101 32" className="h-4 w-auto" aria-label="PayPal">
                <path fill="#003087" d="M12.237 2.8H5.996C5.55 2.8 5.17 3.12 5.1 3.56L2.6 19.8c-.05.33.2.63.54.63h3.16c.45 0 .83-.32.9-.77l.67-4.26c.07-.44.45-.77.9-.77h2.04c4.24 0 6.69-2.05 7.33-6.12.29-1.78.01-3.17-.82-4.15-.91-1.07-2.52-1.56-4.1-1.56zm.74 6.03c-.35 2.3-2.11 2.3-3.81 2.3h-.97l.68-4.3c.04-.27.28-.47.55-.47h.44c1.16 0 2.25 0 2.82.66.34.39.44.97.29 1.81z"/>
                <path fill="#009cde" d="M66.034 2.8h-6.24c-.45 0-.83.32-.9.77l-2.5 15.86c-.05.33.2.63.54.63h3.39c.31 0 .58-.23.63-.54l.71-4.49c.07-.44.45-.77.9-.77h2.04c4.24 0 6.69-2.05 7.33-6.12.29-1.78.01-3.17-.82-4.15-.91-1.07-2.52-1.56-4.08-1.56zm.74 6.03c-.35 2.3-2.11 2.3-3.81 2.3h-.96l.68-4.3c.04-.27.28-.47.55-.47h.44c1.16 0 2.25 0 2.82.66.34.39.44.97.28 1.81z"/>
              </svg>
            </button>
          )}
          {/* seQura móvil */}
          {sequraEnabled && (
            <button type="button" onClick={() => setPayMethod("sequra")} className={`flex items-center gap-3 border p-3.5 transition-all duration-200 text-left outline-none ${payMethod === "sequra" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-border"}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "sequra" ? "border-[#FF6B35]" : "border-border"}`}>
                {payMethod === "sequra" && <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-body text-sm font-medium text-foreground">3 cuotas sin interés</span>
                  <span className="bg-[#FF6B35] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">seQura</span>
                </div>
                <p className="font-body text-[10px] text-foreground/40">Solo DNI y móvil. Sin tarjeta.</p>
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-foreground/30">
          <Lock className="w-3 h-3 shrink-0" />
          <span className="font-body text-[10px]">Pago seguro SSL · TPV Redsys · Banco Santander</span>
        </div>
      </div>
    );
  }

  // ─── Pasos del stepper ────────────────────────────────────────────────────
  const STEPS_KEYS = ["cart.steps.cart", "cart.steps.shipping", "cart.steps.payment"] as const;
  const stepIndex = checkoutStep === "cart" ? 0 : checkoutStep === "checkout" ? 1 : 2;

  function StepBar({ mobile = false }: { mobile?: boolean }) {
    if (checkoutStep === "redirecting") return null;
    return (
      <div className={`flex items-center gap-0 ${mobile ? "px-8 py-3" : "px-12 py-5"} border-b border-border shrink-0`}>
        {STEPS_KEYS.map((key, i) => (
          <div key={key} className="flex items-center gap-0">
            <div className={`flex items-center gap-2 transition-colors duration-300 ${i <= stepIndex ? "text-foreground" : "text-foreground/30"}`}>
              <div className={`${mobile ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-[11px]"} rounded-full flex items-center justify-center font-body transition-all duration-300 ${
                i < stepIndex ? "bg-accent-deep text-background" : i === stepIndex ? "bg-foreground text-background" : "border border-border text-foreground/30"
              }`}>
                {i < stepIndex ? <Check className={mobile ? "w-2.5 h-2.5" : "w-3 h-3"} /> : i + 1}
              </div>
              <span className={`font-body uppercase tracking-widest ${mobile ? "text-[9px]" : "text-xs"}`}>{t(key)}</span>
            </div>
            {i < STEPS_KEYS.length - 1 && (
              <div className={`${mobile ? "w-6 mx-2" : "w-10 mx-3"} h-[1px] transition-colors duration-300 ${i < stepIndex ? "bg-accent-deep" : "bg-border"}`} />
            )}
          </div>
        ))}
        {checkoutStep !== "cart" && (
          <button
            onClick={() => setCheckoutStep(checkoutStep === "payment" ? "checkout" : "cart")}
            className={`ml-auto font-body ${mobile ? "text-[9px]" : "text-[10px]"} uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors outline-none flex items-center gap-1.5`}
          >
            <ArrowRight className="w-3 h-3 rotate-180" /> {t("cart.back")}
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
              <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">{t("nav.index")}</p>
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
              EST. SPAIN - 2022
            </div>
          </div>
        </div>

        {/* ── DESKTOP: layout 2 columnas ── */}
        <div className="hidden md:flex flex-1 h-full overflow-hidden">
          {/* Columna izquierda */}
          <div className="w-[420px] xl:w-[480px] h-full bg-[#F5F0E8] flex flex-col shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0">
              <p className="font-display text-xs uppercase tracking-[0.35em] text-foreground/40">
                {checkoutStep === "cart" ? t("cart.title") : checkoutStep === "checkout" ? t("cart.titleCheckout") : checkoutStep === "payment" ? t("cart.titlePayment") : t("cart.titleRedirecting")}
              </p>
              <button onClick={handleClose} aria-label="Cerrar" className="outline-none w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center hover:border-foreground/30 transition-colors">
                <X className="w-4 h-4 text-foreground/50" />
              </button>
            </div>
            {/* Club Elora */}
            <div className="px-10 mb-8">
              <div className="border border-foreground/10 bg-white/60 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D67A00]/15 flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4 text-[#D67A00]" />
                  </div>
                  <div>
                    <p className="font-display text-sm uppercase tracking-[0.2em] text-foreground">{t("cart.clubTitle")}</p>
                    <p className="font-body text-[10px] text-foreground/40 mt-0.5">{t("cart.clubSub")}</p>
                  </div>
                </div>
                <p className="font-body text-xs text-foreground/60 leading-relaxed">
                  {t("cart.clubBody")}
                </p>
                {/* Formulario inline */}
                <ClubEloraInlineForm />
              </div>
            </div>

            {/* Reseñas */}
            <div className="px-10 mt-auto pb-10">
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/30 mb-4">{t("cart.reviewsTitle")}</p>
              <div className="flex flex-col gap-3">
                {REVIEWS.slice(0, 3).map((r, i) => (
                  <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.6, ease: "easeInOut", delay: i * 0.5 }} className="bg-white/60 border border-foreground/8 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{r.name.charAt(0)}</div>
                      <p className="text-foreground/80 text-[11px] font-semibold">{r.name}</p>
                      <div className="flex gap-0.5 ml-auto">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
                    </div>
                    <p className="text-foreground/50 text-[11px] leading-relaxed line-clamp-2">{r.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <GoogleStarIcon key={s} />)}</div>
                <p className="text-foreground/30 text-[10px]">5.0 · 31 {t("cart.reviews")}</p>
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
                    <h3 className="font-display text-2xl uppercase tracking-wide mb-3">{t("cart.redirecting")}</h3>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-sm">
                      {t("cart.redirectingBody")} {payMethod === "bizum" ? t("checkout.bizum") : t("checkout.card")}.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/30">
                    <Lock className="w-4 h-4" />
                    <span className="font-body text-xs uppercase tracking-widest">{t("cart.secureSsl")}</span>
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
                        <p className="font-display text-xl uppercase tracking-wide text-foreground/30 mb-2">{t("cart.empty")}</p>
                        <p className="font-body text-sm text-foreground/30">{t("cart.emptyBody")}</p>
                      </div>
                      <button onClick={handleClose} className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors border border-border px-8 py-3 hover:border-foreground">{t("cart.viewCollection")}</button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-display text-2xl uppercase tracking-wide mb-8">{t("cart.yourOrder")}</h2>
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
                      {/* Widget envío gratis desktop */}
                      <div className="mt-8">
                        <ShippingWidget
                          city={shippingCity} setCity={setShippingCity}
                          cp={shippingCp} setCp={setShippingCp}
                          cpError={shippingCpError}
                          checked={shippingChecked}
                          showFree={showFreeShipping}
                          onCheck={checkShipping}
                          shippingCostResult={shippingCostResult}
                        />
                      </div>
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
                    <span className="relative z-10">{cart.length > 0 ? `${t("cart.continue")} · ${orderTotal.toLocaleString("es-ES")} €` : t("cart.addProducts")}</span>
                    <motion.span className="relative z-10 flex items-center" animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}><ArrowRight className="w-5 h-5" /></motion.span>
                  </motion.button>
                ) : checkoutStep === "checkout" ? (
                  <motion.button type="submit" form="checkout-form-desktop" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 relative overflow-hidden group" style={{ boxShadow: "0 4px 32px rgba(214,122,0,0.4)" }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ArrowRight className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{t("cart.continueTo")}</span>
                  </motion.button>
                ) : payMethod === "paypal" ? (
                  <div className="flex flex-col gap-2">
                    {paypalLoading ? (
                      <div className="flex items-center justify-center py-4 gap-2 text-foreground/50">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-body text-xs">Cargando PayPal...</span>
                      </div>
                    ) : (
                      <PayPalButtons
                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal", height: 48 }}
                        disabled={isSubmitting}
                        createOrder={async () => {
                          const fullName = `${form.nombre.trim()} ${form.apellidos.trim()}`;
                          const addressParts = [form.direccion.trim(), form.numero.trim(), form.piso.trim()].filter(Boolean).join(", ");
                          const countryLabel = SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? "España";
                          const fullAddress = [addressParts, form.ciudad.trim(), form.provincia, form.cp.trim(), countryLabel].filter(Boolean).join(" · ");
                          const orderResult = await createOrder.mutateAsync({
                            customerName: fullName,
                            customerEmail: form.email.trim(),
                            customerPhone: form.telefono.trim() || undefined,
                            address: fullAddress || undefined,
                            shippingAddress: addressParts || undefined,
                            shippingCity: form.ciudad.trim() || undefined,
                            shippingProvince: form.provincia || undefined,
                            shippingPostalCode: form.cp.trim() || undefined,
                            shippingCountry: countryLabel,
                            shippingCost,
                            paymentMethod: "paypal",
                            notes: form.notas.trim() || undefined,
                            items: cart.map(item => ({ productName: item.name, productImg: item.img || undefined, unitPrice: item.price, quantity: 1 })),
                          });
                          if (!orderResult?.orderId) throw new Error("No se pudo crear el pedido");
                          setPendingOrderId(orderResult.orderId);
                          const paypalResult = await createPaypalOrder.mutateAsync({ orderId: orderResult.orderId });
                          if (paypalResult.clientOnly) {
                            // modo demo: devolver un ID ficticio
                            return `DEMO-${orderResult.orderId}`;
                          }
                          return paypalResult.paypalOrderId!;
                        }}
                        onApprove={async (data) => {
                          if (!pendingOrderId) return;
                          await capturePaypalOrder.mutateAsync({ orderId: pendingOrderId, paypalOrderId: data.orderID });
                          onClearCart?.();
                          toast.success("¡Pago con PayPal completado! Recibirás un email de confirmación.");
                          setCheckoutStep("cart");
                          onClose?.();
                        }}
                        onError={(err) => {
                          console.error("[PayPal] Error:", err);
                          toast.error("Error al procesar el pago con PayPal. Inténtalo de nuevo.");
                        }}
                        onCancel={() => {
                          toast.info("Pago con PayPal cancelado.");
                        }}
                      />
                    )}
                  </div>
                ) : payMethod === "sequra" ? (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.01 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} className="w-full text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ background: "#FF6B35", boxShadow: "0 4px 32px rgba(255,107,53,0.4)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>Conectando con seQura...</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="relative z-10">Pagar en 3 cuotas con seQura · {orderTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.01 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}} className="w-full bg-accent-deep text-white font-body text-sm uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: "0 4px 32px rgba(214,122,0,0.4)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /><span>{t("cart.preparing")}</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        {payMethod === "bizum" ? <Smartphone className="w-5 h-5 relative z-10 text-[#00B259]" /> : <CreditCard className="w-5 h-5 relative z-10" />}
                        <span className="relative z-10">{t("cart.payWith")} {payMethod === "bizum" ? t("checkout.bizum") : t("checkout.card")} · {orderTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                )}
                <p className="font-body text-[10px] text-foreground/30 text-center mt-3">
                  {t("cart.securePay")}
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
                {checkoutStep === "cart" ? `${t("cart.steps.cart")} · ${cart.length}` : checkoutStep === "checkout" ? t("cart.steps.shipping") : checkoutStep === "payment" ? t("cart.steps.payment") : t("cart.titleRedirecting")}
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
                  <h3 className="font-display text-xl uppercase tracking-wide mb-2">{t("cart.redirecting")}</h3>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">
                    {t("cart.redirectingBody")} {payMethod === "bizum" ? t("checkout.bizum") : t("checkout.card")}.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-foreground/30">
                  <Lock className="w-3 h-3" />
                  <span className="font-body text-[10px] uppercase tracking-widest">{t("cart.secureSsl")}</span>
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
                    <p className="font-body text-sm text-foreground/40">{t("cart.empty")}</p>
                  </div>
                ) : (
                  <>
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

                  </>
                )}
              </div>
            )}
          </div>

          {checkoutStep !== "redirecting" && (
            <div className="flex flex-col shrink-0">
              {checkoutStep === "cart" && (
                <div className="bg-[#F8F9FA] border-t border-gray-200 px-5 py-3">
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2.5 text-center">{t("cart.joinClub")}</p>
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
                    <p className="text-gray-400 text-[10px]">5.0 · 31 {t("cart.reviewsShort")}</p>
                    <GoogleLogoIcon />
                  </div>
                </div>
              )}
              <div className="px-8 py-6 border-t border-border flex flex-col gap-3">
                {checkoutStep === "cart" && cart.length > 0 && (
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-body text-xs text-foreground/50 uppercase tracking-widest">{t("cart.total")}</span>
                    <span className="font-display text-2xl">{orderTotal.toLocaleString("es-ES")} €</span>
                  </div>
                )}
                {checkoutStep === "cart" ? (
                  <motion.button onClick={() => { if (cart.length > 0) setShowShippingPopup(true); }} disabled={cart.length === 0} whileHover={cart.length > 0 ? { scale: 1.02 } : {}} whileTap={cart.length > 0 ? { scale: 0.97 } : {}} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-5 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: cart.length > 0 ? "0 4px 24px rgba(214,122,0,0.35)" : undefined }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ShoppingBag className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{cart.length > 0 ? `${t("cart.buy")} · ${orderTotal.toLocaleString("es-ES")} €` : t("cart.addProducts")}</span>
                    <motion.span className="relative z-10 flex items-center" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}><ArrowRight className="w-4 h-4" /></motion.span>
                  </motion.button>
                ) : checkoutStep === "checkout" ? (
                  <motion.button type="submit" form="checkout-form" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 relative overflow-hidden group" style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ArrowRight className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{t("cart.continueTo")}</span>
                  </motion.button>
                ) : payMethod === "paypal" ? (
                  <div className="flex flex-col gap-2">
                    {paypalLoading ? (
                      <div className="flex items-center justify-center py-3 gap-2 text-foreground/50">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="font-body text-xs">Cargando PayPal...</span>
                      </div>
                    ) : (
                      <PayPalButtons
                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal", height: 44 }}
                        disabled={isSubmitting}
                        createOrder={async () => {
                          const fullName = `${form.nombre.trim()} ${form.apellidos.trim()}`;
                          const addressParts = [form.direccion.trim(), form.numero.trim(), form.piso.trim()].filter(Boolean).join(", ");
                          const countryLabel = SHIPPING_COUNTRIES.find(c => c.code === form.pais)?.label ?? "España";
                          const fullAddress = [addressParts, form.ciudad.trim(), form.provincia, form.cp.trim(), countryLabel].filter(Boolean).join(" · ");
                          const orderResult = await createOrder.mutateAsync({
                            customerName: fullName,
                            customerEmail: form.email.trim(),
                            customerPhone: form.telefono.trim() || undefined,
                            address: fullAddress || undefined,
                            shippingAddress: addressParts || undefined,
                            shippingCity: form.ciudad.trim() || undefined,
                            shippingProvince: form.provincia || undefined,
                            shippingPostalCode: form.cp.trim() || undefined,
                            shippingCountry: countryLabel,
                            shippingCost,
                            paymentMethod: "paypal",
                            notes: form.notas.trim() || undefined,
                            items: cart.map(item => ({ productName: item.name, productImg: item.img || undefined, unitPrice: item.price, quantity: 1 })),
                          });
                          if (!orderResult?.orderId) throw new Error("No se pudo crear el pedido");
                          setPendingOrderId(orderResult.orderId);
                          const paypalResult = await createPaypalOrder.mutateAsync({ orderId: orderResult.orderId });
                          if (paypalResult.clientOnly) return `DEMO-${orderResult.orderId}`;
                          return paypalResult.paypalOrderId!;
                        }}
                        onApprove={async (data) => {
                          if (!pendingOrderId) return;
                          await capturePaypalOrder.mutateAsync({ orderId: pendingOrderId, paypalOrderId: data.orderID });
                          onClearCart?.();
                          toast.success("¡Pago con PayPal completado! Recibirás un email de confirmación.");
                          setCheckoutStep("cart");
                          onClose?.();
                        }}
                        onError={(err) => {
                          console.error("[PayPal] Error:", err);
                          toast.error("Error al procesar el pago con PayPal. Inténtalo de nuevo.");
                        }}
                        onCancel={() => { toast.info("Pago con PayPal cancelado."); }}
                      />
                    )}
                  </div>
                ) : payMethod === "sequra" ? (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.97 } : {}} className="w-full text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ background: "#FF6B35", boxShadow: "0 4px 24px rgba(255,107,53,0.35)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Conectando con seQura...</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="relative z-10">3 cuotas con seQura · {orderTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button onClick={handleSubmitPayment} disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.97 } : {}} className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group" style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}>
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>{t("cart.preparing")}</span></>
                    ) : (
                      <>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        {payMethod === "bizum" ? <Smartphone className="w-4 h-4 relative z-10 text-[#00B259]" /> : <CreditCard className="w-4 h-4 relative z-10" />}
                        <span className="relative z-10">{t("cart.payWith")} {payMethod === "bizum" ? t("checkout.bizum") : t("checkout.card")} · {orderTotal.toLocaleString("es-ES")} €</span>
                      </>
                    )}
                  </motion.button>
                )}
                <p className="font-body text-[10px] text-foreground/30 text-center leading-relaxed">{t("cart.securePay")}</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ─── Popup envío gratis (solo móvil) ─────────────────────────────── */}
      <AnimatePresence>
        {showShippingPopup && (
          <>
            {/* Overlay */}
            <motion.div
              key="shipping-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 z-[200] md:hidden"
              onClick={() => !showFreeShipping && setShowShippingPopup(false)}
            />
            {/* Panel */}
            <motion.div
              key="shipping-panel"
              initial={{ opacity: 0, y: 80, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[201] bg-background md:hidden"
              style={{ borderRadius: "16px 16px 0 0" }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-foreground/15 rounded-full" />
              </div>

              {/* Contenido */}
              <div className="px-6 pb-8 pt-2 flex flex-col gap-5">
                {/* Animación envío gratis */}
                <AnimatePresence>
                  {showFreeShipping && (
                    <motion.div
                      key="free-shipping-banner"
                      initial={{ opacity: 0, scale: 0.85, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ type: "spring", damping: 18, stiffness: 280 }}
                      className="flex flex-col items-center gap-3 py-6 text-center"
                    >
                      {/* Confetti emoji animado */}
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -8, 8, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl"
                      >
                        🎉
                      </motion.div>
                      <div>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="font-display text-2xl uppercase tracking-wide text-foreground"
                        >
                          {t("cart.freeShipping")}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="font-body text-sm text-foreground/50 mt-1"
                        >
                          {t("cart.freeShippingTo")} {shippingCity || t("misc.yourDoor")} ✨
                        </motion.p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2 bg-accent-deep/10 px-4 py-2 rounded-full"
                      >
                        <Truck className="w-4 h-4 text-accent-deep" />
                        <span className="font-body text-xs text-accent-deep font-semibold">{t("cart.shippingZero")}</span>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="font-body text-[11px] text-foreground/30"
                      >
                        {t("cart.preparingCheckout")}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Formulario de envío (oculto durante la animación) */}
                {!showFreeShipping && (
                  <>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-lg uppercase tracking-wide text-foreground">{t("cart.whereShip")}</h3>
                      <p className="font-body text-xs text-foreground/40">{t("cart.whereShipSub")}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder={t("cart.localityPlaceholder")}
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="bg-transparent border border-border px-3 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                      />
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          placeholder={t("cart.cpPlaceholder")}
                          value={shippingCp}
                          onChange={(e) => { setShippingCp(e.target.value.slice(0, 10)); setShippingCpError(null); }}
                          autoComplete="postal-code"
                          maxLength={10}
                          className="bg-transparent border border-border px-3 py-3 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-foreground transition-colors"
                        />
                        {shippingCpError && (
                          <p className="flex items-center gap-1.5 font-body text-[10px] text-red-400">
                            <AlertCircle className="w-3 h-3 shrink-0" />{shippingCpError}
                          </p>
                        )}
                      </div>
                      {/* Resultado del cálculo de envío */}
                      {shippingCostResult && (
                        <div className={`flex items-center gap-2 px-3 py-2.5 border text-xs font-body ${
                          shippingCostResult.cost === 0
                            ? "border-green-500/30 bg-green-500/5 text-green-600"
                            : "border-amber-500/30 bg-amber-500/5 text-amber-700"
                        }`}>
                          <span className="text-base">{shippingCostResult.country.flag}</span>
                          <span className="font-medium">{shippingCostResult.country.label}</span>
                          <span className="ml-auto font-semibold">
                            {shippingCostResult.cost === 0 ? t("cart.shippingCostFree") : `${shippingCostResult.cost.toLocaleString("es-ES")} €`}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={checkShipping}
                      className="w-full bg-accent-deep text-white font-body text-xs uppercase tracking-[0.3em] py-4 flex items-center justify-center gap-2 transition-colors hover:bg-[#B86800]"
                    >
                      <Truck className="w-4 h-4" />
                      {t("cart.calcShipping")}
                    </button>
                    <button
                      onClick={() => setShowShippingPopup(false)}
                      className="w-full border border-border text-foreground/50 font-body text-xs uppercase tracking-[0.2em] py-3 hover:border-foreground/30 transition-colors"
                    >
                      {t("misc.cancel")}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
