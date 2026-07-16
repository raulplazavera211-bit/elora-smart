// ─── Página de pago exitoso (/pago/ok) ───────────────────────────────────────
// Redsys redirige aquí cuando el pago se completa con éxito.
// La URL incluye ?order=REDSYS_ORDER_ID

import { motion } from "motion/react";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/WejihdAdoNhfTwYK.png";

export default function PagoOk() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [redsysOrderId, setRedsysOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order");
    if (order) setRedsysOrderId(order);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header mínimo */}
      <header className="px-8 py-6 border-b border-border flex items-center justify-between">
        <button onClick={() => navigate("/")} className="outline-none">
          <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto" />
        </button>
        <div className="flex items-center gap-2 text-foreground/40">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-body text-xs uppercase tracking-widest">{t('pagoOk.confirmed')}</span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-accent-deep rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">✓</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide mb-4">
              {t('pagoOk.title')}
            </h1>
            {redsysOrderId && (
              <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">
                Referencia Redsys: {redsysOrderId}
              </p>
            )}
            <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
              {t('pagoOk.body')}
            </p>
          </motion.div>

          {/* Pasos siguientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-border p-6 mb-8 text-left"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">{t('pagoOk.nextTitle')}</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "01", text: t('pagoOk.step1') },
                { step: "02", text: t('pagoOk.step2') },
                { step: "03", text: t('pagoOk.step3') },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="font-display text-2xl text-accent-deep/40 shrink-0 leading-none">{step}</span>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <a
              href="tel:+34600000000"
              className="flex items-center justify-center gap-2 border border-border px-6 py-3 font-body text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              {t('pagoOk.callUs')}
            </a>
            <a
              href="mailto:info@elorasmart.com"
              className="flex items-center justify-center gap-2 border border-border px-6 py-3 font-body text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('pagoOk.sendEmail')}
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors"
          >
            {t('nav.backHome')}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="px-8 py-4 border-t border-border">
        <p className="font-body text-[10px] text-foreground/30 text-center uppercase tracking-widest">
          {t('footer.taglineShort')}
        </p>
      </footer>
    </div>
  );
}
