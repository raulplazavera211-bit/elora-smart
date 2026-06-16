// ─── Página de pago exitoso (/pago/ok) ───────────────────────────────────────
// Redsys redirige aquí cuando el pago se completa con éxito.
// La URL incluye ?order=REDSYS_ORDER_ID

import { motion } from "motion/react";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

export default function PagoOk() {
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
          <span className="font-body text-xs uppercase tracking-widest">Pago confirmado</span>
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
              ¡Pago realizado!
            </h1>
            {redsysOrderId && (
              <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">
                Referencia Redsys: {redsysOrderId}
              </p>
            )}
            <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
              Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve y nuestro equipo se pondrá en contacto contigo para coordinar la instalación.
            </p>
          </motion.div>

          {/* Pasos siguientes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-border p-6 mb-8 text-left"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">¿Qué ocurre ahora?</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "01", text: "Recibirás un email de confirmación con los detalles de tu pedido." },
                { step: "02", text: "Nuestro equipo técnico contactará contigo en menos de 24h para coordinar la instalación." },
                { step: "03", text: "Un instalador certificado acudirá a tu domicilio en la fecha acordada." },
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
              Llamar a Elora
            </a>
            <a
              href="mailto:info@elorasmart.com"
              className="flex items-center justify-center gap-2 border border-border px-6 py-3 font-body text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              Enviar email
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors"
          >
            Volver al inicio
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="px-8 py-4 border-t border-border">
        <p className="font-body text-[10px] text-foreground/30 text-center uppercase tracking-widest">
          Elora Smart · Inodoros inteligentes · Est. Galicia 2024
        </p>
      </footer>
    </div>
  );
}
