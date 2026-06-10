import { ArrowUp, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

export function Footer() {
  const scrollToTop = () => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const anim = (delay: number): React.CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
  });

  return (
    <footer ref={footerRef} className="bg-foreground text-background w-full font-sans antialiased border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

          {/* Marca */}
          <div className="md:col-span-5 flex flex-col items-start" style={anim(100)}>
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 md:h-12 w-auto brightness-0 invert opacity-90 mb-6" />
            <p className="font-body text-[13px] text-background/60 leading-relaxed max-w-sm mb-8">
              Redefiniendo el estándar europeo con inodoros inteligentes diseñados para la estética y el bienestar diario. Feito en Galicia.
            </p>
            <div className="relative w-full max-w-[280px] group">
              <input
                type="email"
                placeholder="Suscríbete a novedades"
                className="w-full bg-transparent border-b border-background/20 pb-2 text-[13px] text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors"
                aria-label="Email para newsletter"
              />
              <button className="absolute right-0 bottom-2 text-background/40 hover:text-background transition-colors" aria-label="Suscribirse">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-start md:justify-items-end text-left md:text-right" style={anim(200)}>
            <div className="flex flex-col gap-3">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">Colección</h4>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">ESENZA</a>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">AURA Compact</a>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">AURA Suspendido</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">Soporte</h4>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">Instalación</a>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">Garantía</a>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">Contacto</a>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">Social</h4>
              <div className="flex gap-4 md:justify-end">
                <a href="https://www.instagram.com/elorasmart/" target="_blank" rel="noreferrer" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><Linkedin className="w-4 h-4" /></a>
              </div>
              <p className="font-body text-[11px] text-background/50 mt-2">+34 614 45 19 01</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-background/10" style={anim(300)}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <span className="font-body text-[10px] uppercase tracking-widest text-background/40">
              © {new Date().getFullYear()} Elora Smart
            </span>
            <div className="flex gap-6">
              <a href="https://elorasmart.com/aviso-legal/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">Aviso Legal</a>
              <a href="https://elorasmart.com/politica-de-privacidad/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">Privacidad</a>
              <a href="https://elorasmart.com/politica-de-cookies/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-background/40 hover:text-background transition-colors mt-4 md:mt-0"
            title="Subir al inicio"
          >
            <span className="font-body text-[10px] uppercase tracking-widest block md:hidden">Subir al inicio</span>
            <div className="p-2 border border-background/20 rounded-full group-hover:bg-background group-hover:text-foreground group-hover:border-background transition-all">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
