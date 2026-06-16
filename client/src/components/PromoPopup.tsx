import { useEffect, useState } from "react";
import { X, Gift, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const KIT_ITEMS = [
  "Mini-cepillos de mantenimiento",
  "Esponja Konjac anti-rayaduras",
  "Gamuza eco de bambú antibacteriana",
  "Limpiador ecológico para cerámica",
];

const STORAGE_KEY = "elora_promo_popup_dismissed";

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No mostrar si ya fue cerrado en esta sesión
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleCTA = () => {
    handleClose();
    // Scroll suave a la colección
    const el = document.getElementById("coleccion-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/coleccion";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Glow exterior */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#c9a96e]/40 via-transparent to-[#c9a96e]/20 blur-xl opacity-60" />

              {/* Tarjeta */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#c9a96e]/20"
                style={{ background: "linear-gradient(160deg, #0f0f0f 0%, #1a1510 60%, #0f0f0f 100%)" }}
              >
                {/* Franja dorada superior */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

                {/* Botón cerrar */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="px-7 pt-7 pb-7">
                  {/* Badge mes */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center gap-2 mb-5"
                  >
                    <span className="inline-flex items-center gap-1.5 bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e] font-body text-[10px] uppercase tracking-[0.4em] px-3 py-1.5 rounded-full">
                      <Gift className="w-3 h-3" />
                      Regalo exclusivo junio
                    </span>
                  </motion.div>

                  {/* Título */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-white leading-tight mb-1">
                      Llévate{" "}
                      <span className="text-[#c9a96e]">GRATIS</span>
                    </h2>
                    <h3 className="font-display text-lg uppercase tracking-wider text-white/80 mb-3">
                      nuestro Kit ECO-CARE
                    </h3>
                    <div className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1 mb-5">
                      <span className="font-body text-xs text-white/40 line-through">65€</span>
                      <span className="font-body text-xs text-[#c9a96e] font-semibold">valorado en 65€</span>
                    </div>
                    <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
                      Con la compra de cualquier inodoro inteligente Elora Smart.
                    </p>
                  </motion.div>

                  {/* Separador */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

                  {/* Lista del kit */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-2.5 mb-7"
                  >
                    <p className="font-body text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
                      Kit ECO-CARE incluye:
                    </p>
                    {KIT_ITEMS.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.38 + i * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/30 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#c9a96e]" />
                        </div>
                        <span className="font-body text-sm text-white/70">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-3"
                  >
                    <button
                      onClick={handleCTA}
                      className="group w-full relative overflow-hidden rounded-xl py-4 px-6 font-body text-sm uppercase tracking-[0.3em] font-semibold text-white transition-all duration-300 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #d4a96a 0%, #b8935a 50%, #c9a96e 100%)",
                        boxShadow: "0 8px 32px rgba(201,169,110,0.4), 0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Shimmer */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                      <span className="relative">Quiero mi kit gratis →</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full font-body text-[11px] text-white/20 hover:text-white/40 transition-colors py-1"
                    >
                      No, gracias
                    </button>
                  </motion.div>
                </div>

                {/* Franja dorada inferior */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
