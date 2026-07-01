import { ArrowUp, ArrowRight, Instagram, Linkedin } from "lucide-react";

// Iconos SVG para TikTok y Facebook (no disponibles en lucide-react)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

export function Footer() {
  const { t } = useTranslation();
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
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-28 md:pb-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

          {/* Marca */}
          <div className="md:col-span-5 flex flex-col items-start" style={anim(100)}>
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 md:h-12 w-auto brightness-0 invert opacity-90 mb-6" />
            <p className="font-body text-[13px] text-background/60 leading-relaxed max-w-sm mb-8">
              {t('footer.tagline')}
            </p>
            <div className="relative w-full max-w-[280px] group">
              <input
                type="email"
                placeholder={t('footer.newsletter')}
                className="w-full bg-transparent border-b border-background/20 pb-2 text-[13px] text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors"
                aria-label={t('footer.newsletter')}
              />
              <button className="absolute right-0 bottom-2 text-background/40 hover:text-background transition-colors"               aria-label={t('footer.newsletterBtn')}>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 justify-items-start md:justify-items-end text-left md:text-right" style={anim(200)}>
            <div className="flex flex-col gap-3">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">{t('footer.products')}</h4>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">ESENZA</a>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">AURA Compact</a>
              <a href="#" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">AURA Suspendido</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">{t('footer.company')}</h4>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">{t('product.installation')}</a>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">{t('product.warranty')}</a>
              <a href="https://elorasmart.com/contacto/" target="_blank" rel="noreferrer" className="font-body text-[13px] text-background/80 hover:text-white transition-colors">{t('nav.contacto')}</a>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-background/40 mb-1">Social</h4>
              <div className="flex gap-4 md:justify-end">
                <a href="https://www.instagram.com/elora_smart/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><Instagram className="w-4 h-4" /></a>
                <a href="https://www.linkedin.com/company/elora-smart/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><Linkedin className="w-4 h-4" /></a>
                <a href="https://www.tiktok.com/@elora_smart" target="_blank" rel="noreferrer" aria-label="TikTok" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><TikTokIcon /></a>
                <a href="https://www.facebook.com/elorasmart" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-background/60 hover:text-white hover:-translate-y-0.5 transition-all"><FacebookIcon /></a>
              </div>
              <p className="font-body text-[11px] text-background/50 mt-2">+34 614 45 19 01</p>
              <a href="https://maps.google.com/?q=Avenida+da+Mah%C3%ADa+17+Bertamir%C3%A1ns+Ames" target="_blank" rel="noreferrer" className="font-body text-[11px] text-background/50 hover:text-white transition-colors mt-1 leading-relaxed block">
                {t('contacto.store')}<br />
                <span className="text-background/30">{t('contacto.storeAddress')}</span>
              </a>
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
              <a href="https://elorasmart.com/aviso-legal/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">{t('footer.links.legal')}</a>
              <a href="https://elorasmart.com/politica-de-privacidad/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">{t('footer.links.privacy')}</a>
              <a href="https://elorasmart.com/politica-de-cookies/" target="_blank" rel="noreferrer" className="font-body text-[10px] uppercase tracking-widest text-background/40 hover:text-white transition-colors">{t('footer.links.cookies')}</a>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-background/40 hover:text-background transition-colors mt-4 md:mt-0"
            title={t('footer.backTop')}
          >
            <span className="font-body text-[10px] uppercase tracking-widest block md:hidden">{t('footer.backTop')}</span>
            <div className="p-2 border border-background/20 rounded-full group-hover:bg-background group-hover:text-foreground group-hover:border-background transition-all">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
