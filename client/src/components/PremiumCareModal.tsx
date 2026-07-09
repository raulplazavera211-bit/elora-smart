import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Cpu, Phone, Star, CheckCircle2, Zap } from "lucide-react";

interface PremiumCareModalProps {
  isOpen: boolean;
  productName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const PREMIUM_BENEFITS = [
  { icon: Shield, label: "Garantía extendida 5 años", sub: "De 3 a 5 años de cobertura total" },
  { icon: Cpu, label: "Componentes electrónicos", sub: "Tarjeta de control, sensores y motores" },
  { icon: Zap, label: "Sistema de lavado y secado", sub: "Boquillas, turbina y calefacción" },
  { icon: Phone, label: "Soporte prioritario", sub: "Atención directa sin esperas" },
];

export function PremiumCareModal({ isOpen, productName, onAccept, onDecline }: PremiumCareModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onDecline}
            style={{ backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg bg-background border border-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header dorado */}
              <div className="relative bg-gradient-to-br from-[#c9a227] via-[#e8c547] to-[#b8891a] px-6 pt-6 pb-8 overflow-hidden">
                {/* Patrón decorativo */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white -translate-x-8 translate-y-8" />
                </div>

                <button
                  onClick={onDecline}
                  className="absolute top-4 right-4 text-black/40 hover:text-black/70 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-black/60 fill-black/40" />
                    <span className="font-body text-[10px] uppercase tracking-[0.3em] text-black/60">
                      Garantía Premium
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-black leading-tight mb-1">
                    ELORA PREMIUM CARE
                  </h2>
                  <p className="font-body text-sm text-black/70 leading-snug">
                    Amplía la garantía de tu {productName} de 3 a 5 años
                  </p>
                </div>

                {/* Precio destacado */}
                <div className="relative z-10 mt-4 inline-flex items-baseline gap-1.5 bg-black/15 px-4 py-2">
                  <span className="font-body text-xs text-black/60 uppercase tracking-widest">Solo</span>
                  <span className="font-display text-3xl text-black tracking-wide">+249 €</span>
                  <span className="font-body text-xs text-black/60">/ único pago</span>
                </div>
              </div>

              {/* Beneficios */}
              <div className="px-6 py-5">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-4 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-foreground/20" /> Cobertura total en
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PREMIUM_BENEFITS.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-start gap-3 p-3 bg-muted border border-border">
                      <div className="mt-0.5 w-7 h-7 flex items-center justify-center bg-accent-deep/10 flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-accent-deep" />
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold text-foreground leading-tight">{label}</p>
                        <p className="font-body text-[10px] text-foreground/50 leading-tight mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="px-6 pb-6 flex flex-col gap-3">
                <button
                  onClick={onAccept}
                  className="group w-full flex items-center justify-center gap-3 bg-[#c9a227] text-black font-body text-xs uppercase tracking-[0.3em] py-4 hover:bg-[#b8891a] transition-colors active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Añadir PREMIUM CARE · +249 €
                </button>
                <button
                  onClick={onDecline}
                  className="w-full font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 hover:text-foreground/70 transition-colors py-2"
                >
                  Continuar con garantía estándar (3 años)
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
