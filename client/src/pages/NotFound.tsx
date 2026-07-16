import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const LOGO_URL = "/manus-storage/elora_200_daf8d186.png";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto mb-12 opacity-40 saturate-0" />
      <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">Error 404</p>
      <h1 className="font-display text-6xl md:text-8xl uppercase tracking-wide leading-[0.9] mb-6">
        Página<br />no encontrada.
      </h1>
      <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-xs mb-10">
        La página que buscas no existe o ha sido movida. Vuelve al inicio para explorar la colección.
      </p>
      <button
        onClick={() => navigate("/")}
        className="group inline-flex items-center gap-3 font-body text-xs uppercase tracking-[0.3em] text-foreground border-b border-foreground pb-2 hover:text-foreground/60 hover:border-foreground/60 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </button>
    </div>
  );
}
