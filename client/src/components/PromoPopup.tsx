import { useEffect, useState } from "react";
import { X, Gift, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

// KIT_ITEMS se genera dinámicamente con i18n

const STORAGE_KEY = "elora_promo_popup_dismissed";

export default function PromoPopup() {
  const { t } = useTranslation();
  const KIT_ITEMS = [
    t('promo.items.hose'),
    t('promo.items.valve'),
    t('promo.items.seat'),
    t('promo.items.guide'),
  ];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const handleCTA = () => {
    handleClose();
    window.location.href = "/coleccion";
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay — clic para cerrar */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-5 pointer-events-none"
          >
            <div className="relative w-full max-w-sm pointer-events-auto">

              {/* Tarjeta blanca */}
              <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden border border-stone-100">

                {/* Franja dorada superior */}
                <div className="h-1 bg-gradient-to-r from-[#c9a96e] via-[#e8c98a] to-[#c9a96e]" />

                {/* Botón cerrar — grande y visible */}
                <button
                  onClick={handleClose}
                  aria-label={t('nav.close')}
                  className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="px-6 pt-6 pb-6">

                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.35 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-body text-[10px] uppercase tracking-[0.35em] px-3 py-1.5 rounded-full">
                      <Gift className="w-3 h-3" />
                      {t('promo.badge')}
                    </span>
                  </motion.div>

                  {/* Título */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.38 }}
                  >
                    <h2 className="font-display text-2xl uppercase tracking-wide text-stone-900 leading-tight mb-1">
                      {t('promo.title')}{" "}
                      <span
                        className="font-display"
                        style={{ color: "#c9a96e" }}
                      >
                        {t('promo.titleHighlight')}
                      </span>
                    </h2>
                    <h3 className="font-display text-base uppercase tracking-wider text-stone-700 mb-2">
                      {t('promo.subtitle')}
                    </h3>
                    <p className="font-body text-sm text-stone-500 leading-relaxed mb-4">
                      {t('promo.body')}
                    </p>
                    <p className="font-body text-xs text-stone-400 mb-4">
                      {t('promo.limited')}
                    </p>
                  </motion.div>

                  {/* Separador */}
                  <div className="h-px bg-stone-100 mb-4" />

                  {/* Lista del kit */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.38 }}
                    className="space-y-2 mb-6"
                  >
                    <p className="font-body text-[10px] uppercase tracking-[0.35em] text-stone-400 mb-2">
                      {t('promo.badge')}:
                    </p>
                    {KIT_ITEMS.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.36 + i * 0.06, duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.35)" }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: "#c9a96e" }} />
                        </div>
                        <span className="font-body text-sm text-stone-700">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.35 }}
                    className="space-y-2"
                  >
                    <button
                      onClick={handleCTA}
                      className="group w-full relative overflow-hidden rounded-xl py-3.5 px-6 font-body text-sm uppercase tracking-[0.25em] font-semibold text-white transition-all duration-300 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #d4a96a 0%, #b8935a 50%, #c9a96e 100%)",
                        boxShadow: "0 6px 24px rgba(201,169,110,0.35)",
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative">{t('promo.cta')} →</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full font-body text-xs text-stone-400 hover:text-stone-600 transition-colors py-1.5"
                    >
                      {t('promo.dismiss')}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
