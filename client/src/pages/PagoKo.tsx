// ─── Página de pago fallido (/pago/ko) ───────────────────────────────────────
// Redsys redirige aquí cuando el pago es rechazado o cancelado.

import { motion } from "motion/react";
import { XCircle, ArrowRight, RefreshCw, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

export default function PagoKo() {
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
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="font-body text-xs uppercase tracking-widest">Pago no completado</span>
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
            <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-14 h-14 text-red-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide mb-4">
              Pago no realizado
            </h1>
            {redsysOrderId && (
              <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">
                Referencia: {redsysOrderId}
              </p>
            )}
            <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
              El pago no se ha podido completar. Esto puede deberse a fondos insuficientes, datos incorrectos o cancelación del proceso. Tu pedido ha quedado guardado y puedes intentarlo de nuevo.
            </p>
          </motion.div>

          {/* Posibles causas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-border p-6 mb-8 text-left"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Posibles causas</p>
            <div className="flex flex-col gap-3">
              {[
                "Datos de la tarjeta incorrectos o caducada.",
                "Fondos insuficientes en la cuenta.",
                "El banco ha bloqueado la transacción por seguridad.",
                "Has cancelado el proceso de pago.",
              ].map((cause, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 mt-2 shrink-0" />
                  <p className="font-body text-sm text-foreground/50">{cause}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-accent-deep text-white px-8 py-4 font-body text-xs uppercase tracking-[0.3em] relative overflow-hidden group"
              style={{ boxShadow: "0 4px 24px rgba(214,122,0,0.35)" }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <RefreshCw className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Intentar de nuevo</span>
            </motion.button>
            <a
              href="tel:+34600000000"
              className="flex items-center justify-center gap-2 border border-border px-6 py-4 font-body text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              Llamar a Elora
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
