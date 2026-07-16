import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const CATALOG_LANGS = [
  { code: "es", label: "Español",    flag: "🇪🇸", url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/KbsgJycXJjdBoTcI.pdf",  filename: "Catálogo-ELORA-2026-ES.pdf" },
  { code: "en", label: "English",    flag: "🇬🇧", url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/TNfkYxyZxclCtoMU.pdf",  filename: "Catalogue-ELORA-2026-EN.pdf" },
  { code: "fr", label: "Français",   flag: "🇫🇷", url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/QfDgHkYnygMoipLh.pdf",  filename: "Catalogue-ELORA-2026-FR.pdf" },
  { code: "pt", label: "Português",  flag: "🇵🇹", url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/RRPtlvKXPWyjhpWo.pdf",  filename: "Catálogo-ELORA-2026-PT.pdf" },
];

export function CatalogDownloadButton() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Detectar idioma activo para preseleccionar
  const currentLang = CATALOG_LANGS.find(l => i18n.language.startsWith(l.code)) ?? CATALOG_LANGS[0];
  const [selected, setSelected] = useState(currentLang);

  // Actualizar selección si cambia el idioma de la app
  useEffect(() => {
    const match = CATALOG_LANGS.find(l => i18n.language.startsWith(l.code));
    if (match) setSelected(match);
  }, [i18n.language]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = (lang: typeof CATALOG_LANGS[0]) => {
    setDownloading(lang.code);
    setOpen(false);
    const a = document.createElement("a");
    a.href = lang.url;
    a.download = lang.filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div ref={ref} className="relative w-fit">
      {/* Botón principal split: [icono + texto] [chevron idioma] */}
      <div className="flex items-stretch border border-border hover:border-accent-deep transition-colors duration-200 group">
        {/* Parte izquierda: descarga */}
        <button
          onClick={() => handleDownload(selected)}
          disabled={!!downloading}
          className="flex items-center gap-3 px-5 py-3 font-body text-xs uppercase tracking-[0.25em] text-foreground hover:text-accent-deep transition-colors active:scale-[0.97] duration-150 disabled:opacity-60"
        >
          {downloading === selected.code ? (
            <span className="w-3.5 h-3.5 border border-accent-deep border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <Download className="w-3.5 h-3.5 shrink-0 text-accent-deep" />
          )}
          <span>
            {downloading === selected.code ? "Descargando..." : "Descargar catálogo"}
          </span>
          <span className="text-foreground/40">{selected.flag}</span>
        </button>

        {/* Separador vertical */}
        <div className="w-px bg-border group-hover:bg-accent-deep/30 transition-colors" />

        {/* Parte derecha: selector de idioma */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-3 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/50 hover:text-accent-deep transition-colors"
          aria-label="Seleccionar idioma del catálogo"
        >
          <span>{selected.code.toUpperCase()}</span>
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* Dropdown */}
      <div
        className="absolute left-0 top-full mt-1 w-full bg-background border border-border shadow-lg z-50 overflow-hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.95)",
          transformOrigin: "top",
          transition: "opacity 0.18s cubic-bezier(0.23,1,0.32,1), transform 0.18s cubic-bezier(0.23,1,0.32,1)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {CATALOG_LANGS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => { setSelected(lang); setOpen(false); handleDownload(lang); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 font-body text-xs text-left transition-colors hover:bg-accent-deep/10 hover:text-accent-deep ${
              selected.code === lang.code ? "text-accent-deep bg-accent-deep/5" : "text-foreground/70"
            }`}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span className="uppercase tracking-[0.15em]">{lang.label}</span>
            <FileText className="w-3 h-3 ml-auto opacity-40" />
          </button>
        ))}
      </div>
    </div>
  );
}
