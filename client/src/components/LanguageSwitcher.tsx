import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, X, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "es", label: "ES", name: "Español", flag: "🇪🇸" },
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
  { code: "pt", label: "PT", name: "Português", flag: "🇵🇹" },
  { code: "fr", label: "FR", name: "Français", flag: "🇫🇷" },
  { code: "it", label: "IT", name: "Italiano", flag: "🇮🇹" },
];

const STORAGE_KEY = "elora_lang_banner_dismissed";

/** Dropdown compacto para el navbar */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("elora_lang", code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.25em] text-foreground/60 hover:text-foreground transition-colors border border-border/60 px-2.5 py-1.5 hover:border-foreground/40 active:scale-[0.97]"
        aria-label="Cambiar idioma"
      >
        <Globe className="w-3 h-3" />
        <span>{current.label}</span>
        <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-[300] bg-background border border-border shadow-xl min-w-[140px]"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "scale(1) translateY(0)" : "scale(0.95) translateY(-4px)",
            transformOrigin: "top right",
            transition: "opacity 180ms cubic-bezier(0.23,1,0.32,1), transform 180ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 font-body text-[11px] uppercase tracking-[0.2em] transition-colors text-left
                ${lang.code === i18n.language
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Banner de detección automática del idioma del navegador */
export function LanguageDetectionBanner() {
  const { i18n, t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [suggestedLang, setSuggestedLang] = useState<typeof LANGUAGES[0] | null>(null);

  useEffect(() => {
    // Solo mostrar si no se ha descartado antes y el idioma del navegador difiere del actual
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (localStorage.getItem("elora_lang")) return; // usuario ya eligió idioma manualmente

    const browserLang = navigator.language.split("-")[0].toLowerCase();
    const supported = LANGUAGES.find((l) => l.code === browserLang);

    if (supported && supported.code !== i18n.language) {
      setSuggestedLang(supported);
      // Pequeño delay para no aparecer inmediatamente
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    if (suggestedLang) {
      i18n.changeLanguage(suggestedLang.code);
      localStorage.setItem("elora_lang", suggestedLang.code);
    }
    dismiss();
  };

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible || !suggestedLang) return null;

  // Textos del banner según el idioma sugerido (siempre en ese idioma)
  const bannerTexts: Record<string, { msg: string; accept: string; dismiss: string }> = {
    en: { msg: "We detected your browser is in English. Would you like to switch?", accept: "Switch to English", dismiss: "Keep Spanish" },
    pt: { msg: "Detectámos que o seu navegador está em Português. Quer mudar?", accept: "Mudar para Português", dismiss: "Manter Espanhol" },
    fr: { msg: "Nous avons détecté que votre navigateur est en Français. Voulez-vous changer ?", accept: "Passer en Français", dismiss: "Garder l'Espagnol" },
    it: { msg: "Abbiamo rilevato che il tuo browser è in Italiano. Vuoi cambiare?", accept: "Passa all'Italiano", dismiss: "Mantieni Spagnolo" },
  };

  const texts = bannerTexts[suggestedLang.code] ?? bannerTexts.en;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[400] w-[calc(100%-2rem)] max-w-md bg-background border border-border shadow-2xl px-5 py-4"
      style={{
        animation: "slideUpBanner 0.35s cubic-bezier(0.23,1,0.32,1) both",
      }}
    >
      <style>{`
        @keyframes slideUpBanner {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-foreground/40 hover:text-foreground transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <Globe className="w-4 h-4 text-accent-deep mt-0.5 shrink-0" />
        <div className="flex flex-col gap-3">
          <p className="font-body text-xs text-foreground/70 leading-relaxed">
            {suggestedLang.flag} {texts.msg}
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="font-body text-[10px] uppercase tracking-[0.25em] bg-foreground text-background px-3 py-2 hover:bg-accent-deep transition-colors active:scale-[0.97]"
            >
              {texts.accept}
            </button>
            <button
              onClick={dismiss}
              className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/50 hover:text-foreground transition-colors px-2"
            >
              {texts.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
