import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

const WA_NUMBER = "34614451901";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20productos%20Elora%20Smart`;

export function WhatsAppButton() {
  const { t } = useTranslation();
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Aparecer el botón después de 1s
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t1);
  }, []);

  // Mostrar la burbuja después de 3s (solo si no fue cerrada)
  useEffect(() => {
    if (!visible || dismissed) return;
    const t2 = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(t2);
  }, [visible, dismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBubble(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
      style={{ pointerEvents: "none" }}
    >
      {/* Burbuja de mensaje */}
      <div
        className="relative"
        style={{
          pointerEvents: showBubble ? "auto" : "none",
          opacity: showBubble ? 1 : 0,
          transform: showBubble ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          transition: "opacity 250ms cubic-bezier(0.23,1,0.32,1), transform 250ms cubic-bezier(0.23,1,0.32,1)",
          transformOrigin: "bottom left",
        }}
      >
        <div className="bg-white text-gray-800 rounded-2xl rounded-br-sm shadow-xl px-4 py-3 max-w-[220px] border border-gray-100">
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -left-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
          <p className="font-body text-sm leading-snug text-gray-700">
            {t("whatsapp.bubble", "¿Tienes alguna duda?")}
          </p>
          <p className="font-body text-xs text-gray-400 mt-1">
            {t("whatsapp.reply", "Respondemos al instante")}
          </p>
        </div>
        {/* Triángulo apuntando al botón */}
        <div
          className="absolute -bottom-2 left-4 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid white",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.08))",
          }}
        />
      </div>

      {/* Botón WhatsApp */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        onClick={() => setShowBubble(false)}
        style={{ pointerEvents: "auto" }}
        className="group relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        title={t("whatsapp.bubble", "¿Tienes alguna duda?")}
      >
        {/* Fondo verde WhatsApp */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] group-hover:bg-[#20c55e] transition-colors duration-200" />
        {/* Pulso animado */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
        {/* Icono SVG oficial de WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="relative z-10 w-7 h-7 fill-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
