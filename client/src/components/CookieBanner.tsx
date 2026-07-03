import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Cookie, X, ChevronDown, ChevronUp } from "lucide-react";

type CookiePrefs = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("elora_cookie_consent");
    if (!consent) {
      // Mostrar el banner después de 1.5s para no interrumpir la carga inicial
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (newPrefs: CookiePrefs, type: "all" | "necessary" | "custom") => {
    localStorage.setItem("elora_cookie_prefs", JSON.stringify(newPrefs));
    localStorage.setItem("elora_cookie_consent", type);
    setVisible(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true }, "all");
  const rejectAll = () => save({ necessary: true, analytics: false, marketing: false }, "necessary");
  const saveCustom = () => save(prefs, "custom");

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Gestión de cookies"
    >
      <div className="max-w-2xl mx-auto bg-stone-950 text-white rounded-2xl shadow-2xl border border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-start gap-3">
          <Cookie className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-display text-sm uppercase tracking-widest text-white mb-1">
              Usamos cookies
            </p>
            <p className="font-body text-xs text-stone-400 leading-relaxed">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y mostrarte publicidad personalizada. Puedes aceptarlas todas, rechazar las no esenciales o personalizar tu elección.{" "}
              <Link href="/politica-cookies" className="text-amber-400 hover:text-amber-300 underline">
                Más información
              </Link>
            </p>
          </div>
        </div>

        {/* Panel expandible de personalización */}
        {expanded && (
          <div className="px-5 pb-4 space-y-3 border-t border-stone-800 pt-4">
            {/* Necesarias */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs font-semibold text-white">Necesarias</p>
                <p className="font-body text-[11px] text-stone-500">Sesión, carrito y preferencias. Siempre activas.</p>
              </div>
              <span className="font-body text-[10px] bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">Siempre activas</span>
            </div>
            {/* Analíticas */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs font-semibold text-white">Analíticas</p>
                <p className="font-body text-[11px] text-stone-500">Google Analytics — datos anonimizados.</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${prefs.analytics ? "bg-amber-500" : "bg-stone-700"}`}
                role="switch"
                aria-checked={prefs.analytics}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${prefs.analytics ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            {/* Marketing */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs font-semibold text-white">Marketing</p>
                <p className="font-body text-[11px] text-stone-500">Meta, Google Ads, TikTok — publicidad personalizada.</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${prefs.marketing ? "bg-amber-500" : "bg-stone-700"}`}
                role="switch"
                aria-checked={prefs.marketing}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${prefs.marketing ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="px-5 pb-5 flex flex-wrap gap-2 items-center">
          <button
            onClick={acceptAll}
            className="flex-1 min-w-[120px] bg-amber-500 hover:bg-amber-400 text-stone-950 font-body text-[11px] uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors font-semibold"
          >
            Aceptar todas
          </button>
          <button
            onClick={rejectAll}
            className="flex-1 min-w-[120px] border border-stone-700 text-stone-300 hover:bg-stone-800 font-body text-[11px] uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
          >
            Solo necesarias
          </button>
          {expanded ? (
            <button
              onClick={saveCustom}
              className="flex-1 min-w-[120px] bg-stone-700 hover:bg-stone-600 text-white font-body text-[11px] uppercase tracking-widest py-2.5 px-4 rounded-lg transition-colors"
            >
              Guardar selección
            </button>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 text-stone-400 hover:text-white font-body text-[11px] uppercase tracking-widest py-2.5 px-3 transition-colors"
            >
              Personalizar
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
