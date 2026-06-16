import { getLoginUrl } from "@/const";
import { motion } from "motion/react";
import { Shield, Lock, ArrowRight } from "lucide-react";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

// Partícula decorativa flotante
function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Fondo decorativo */}
      <FloatingOrb className="w-96 h-96 bg-[#c9a96e] -top-32 -right-32" />
      <FloatingOrb className="w-64 h-64 bg-[#c9a96e] bottom-0 -left-20" />
      <FloatingOrb className="w-48 h-48 bg-white top-1/2 left-1/4" />

      {/* Grid sutil de fondo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Tarjeta de login */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Borde dorado sutil */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c9a96e]/30 via-transparent to-[#c9a96e]/10 p-px">
          <div className="absolute inset-0 rounded-2xl bg-[#111111]" />
        </div>

        <div className="relative rounded-2xl bg-[#111111] border border-white/8 overflow-hidden">
          {/* Franja dorada superior */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

          <div className="px-8 py-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center mb-10"
            >
              <img
                src={LOGO_URL}
                alt="Elora Smart"
                className="h-14 w-auto mb-4"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-px w-12 bg-white/10" />
                <p className="font-body text-[9px] uppercase tracking-[0.5em] text-white/25">
                  Panel de administración
                </p>
                <div className="h-px w-12 bg-white/10" />
              </div>
            </motion.div>

            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-2xl uppercase tracking-wide text-white mb-2">
                Acceso seguro
              </h1>
              <p className="font-body text-sm text-white/40 leading-relaxed">
                Inicia sesión con tu cuenta autorizada para acceder al panel de gestión.
              </p>
            </motion.div>

            {/* Indicadores de seguridad */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-1.5 text-white/25">
                <Shield className="w-3.5 h-3.5 text-[#c9a96e]/60" />
                <span className="font-body text-[10px] uppercase tracking-widest">OAuth2</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-white/25">
                <Lock className="w-3.5 h-3.5 text-[#c9a96e]/60" />
                <span className="font-body text-[10px] uppercase tracking-widest">Cifrado SSL</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 inline-block" />
                <span className="font-body text-[10px] uppercase tracking-widest">Seguro</span>
              </div>
            </motion.div>

            {/* Botón de login */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <button
                onClick={() => { window.location.href = getLoginUrl(); }}
                className="group w-full relative overflow-hidden rounded-xl py-4 px-6 font-body text-sm uppercase tracking-[0.3em] transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #d4a96a 0%, #b8935a 50%, #c9a96e 100%)",
                  boxShadow: "0 8px 32px rgba(201,169,110,0.35), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {/* Shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-3 text-white font-semibold">
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </motion.div>

            {/* Nota de seguridad */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center font-body text-[10px] text-white/20 mt-6 leading-relaxed"
            >
              Solo usuarios autorizados pueden acceder a este panel.
              <br />
              La sesión se cierra automáticamente por inactividad.
            </motion.p>
          </div>

          {/* Franja dorada inferior */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
        </div>
      </motion.div>

      {/* Volver a la web */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-[10px] uppercase tracking-[0.4em] text-white/20 hover:text-white/40 transition-colors"
      >
        ← Volver a la web
      </motion.a>
    </div>
  );
}
