import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartPanel } from "@/components/CartPanel";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/Footer";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";
const HERO_BG_URL = "/manus-storage/hero_paraguay_bg_efff84ad.jpg";

const EP_SECTIONS = [
  { label: "El Evento", id: "ep-evento" },
  { label: "Sobre Elora", id: "ep-sobre" },
  { label: "Experiencia", id: "ep-experiencia" },
  { label: "Proyectos", id: "ep-proyectos" },
  { label: "Networking", id: "ep-networking" },
  { label: "Registrarse", id: "ep-registro" },
];

export default function EventoParaguay() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, isCartOpen, openCart, closeCart, totalItems, removeFromCart } = useCart();

  useEffect(() => {
    document.title = "elora smart — Evento Exclusivo Paraguay";
  }, []);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-background text-foreground font-body flex overflow-hidden">

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex w-[220px] lg:w-[260px] flex-shrink-0 h-full border-r border-border flex-col justify-between py-10 z-30 bg-background">
        <div className="px-8 mb-10">
          <button onClick={() => navigate("/")} className="outline-none">
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
          </button>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
          <p className="mt-4 font-body text-[9px] uppercase tracking-[0.22em] text-foreground/50 border border-foreground/20 px-3 py-2 text-center">
            Evento Exclusivo · Paraguay
          </p>
        </div>
        <nav className="flex flex-col gap-5 w-full px-10 flex-1">
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/40 mb-2 border-b border-border pb-4">Programa</p>
          {EP_SECTIONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group text-left outline-none flex items-center gap-4 transition-all duration-500"
            >
              <span className="h-[1px] w-3 bg-foreground/20 group-hover:w-6 group-hover:bg-foreground/40 transition-all duration-500" />
              <span className="font-display text-base lg:text-lg uppercase tracking-wide text-foreground/40 group-hover:text-foreground/70 transition-colors duration-500">
                {item.label}
              </span>
              <span className="ml-auto font-body text-[10px] text-foreground/20">0{idx + 1}</span>
            </button>
          ))}
        </nav>
        <div className="px-10 w-full flex flex-col gap-5">
          <button
            onClick={openCart}
            className="group flex items-center justify-between w-full border border-border px-4 py-3 hover:border-accent-deep transition-colors outline-none"
          >
            <span className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.25em] text-foreground">
              <ShoppingBag className="w-4 h-4" /> {t('nav.cart')}
            </span>
            <span className="font-display text-sm text-accent-deep">{totalItems}</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="font-body text-xs uppercase tracking-[0.2em] text-foreground/40 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-deep" />
              EST. SPAIN - 2022
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 w-full h-20 bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
        <button onClick={() => navigate("/")} className="outline-none">
          <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto select-none" />
        </button>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={openCart}
            className="relative w-10 h-10 rounded-full border border-border flex items-center justify-center outline-none"
            aria-label={t('nav.cart')}
          >
            <ShoppingBag className="w-4 h-4 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-deep text-background font-body text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform duration-300 outline-none"
            aria-label={t('nav.menu')}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`fixed inset-0 bg-background z-40 transform transition-transform duration-500 ease-out flex flex-col justify-center px-8 md:hidden ${isMenuOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-7 pb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4 border-b border-border pb-4">Programa del Evento</p>
          {EP_SECTIONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left font-display text-3xl uppercase tracking-wide text-foreground/70 outline-none flex items-center gap-4 hover:text-foreground transition-colors"
            >
              <span className="text-sm font-body text-accent-deep">0{idx + 1}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── CART PANEL ── */}
      <CartPanel isOpen={isCartOpen} onClose={closeCart} cart={cart} onRemove={removeFromCart} />

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden" id="ep-scroll">
        <style>{`
          .ep-root *,
          .ep-root *::before,
          .ep-root *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          .ep-root {
            --mustard: #edb658;
            --mustard-light: #f5c97a;
            --mustard-pale: #fdf3dc;
            --navy: #0a2947;
            --blue-dark: #103f6a;
            --blue-light: #7fa4c1;
            --white: #FFFFFF;
            --bg: #F8F8F6;
            --bg2: #EFEFEC;
            --ink: #1a1a1a;
            --mid: #444;
            --soft: #777;
            font-family: 'Montserrat', sans-serif;
            font-weight: 400;
            background: var(--bg);
            color: var(--ink);
            -webkit-font-smoothing: antialiased;
            font-size: 16px;
            line-height: 1.7;
            overflow-x: hidden;
            width: 100%;
            min-height: 100vh;
          }

          /* ── HERO ── */
          .ep-hero {
            min-height: 100vh; position: relative;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            text-align: center; padding: 80px 24px 60px;
          }
          .ep-hero-bg {
            position: absolute; inset: 0;
            background-image: url('${HERO_BG_URL}');
            background-size: cover; background-position: center 30%; z-index: 0;
          }
          .ep-hero-bg::after {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(to bottom, rgba(10,41,71,0.80) 0%, rgba(10,41,71,0.62) 55%, rgba(10,41,71,0.88) 100%);
          }
          .ep-hero-content { position: relative; z-index: 1; max-width: 760px; width: 100%; }
          .ep-hero-logo { margin-bottom: 28px; }
          .ep-hero-logo img { height: 36px; width: auto; filter: brightness(0) invert(1); display: block; margin: 0 auto; }
          .ep-hero-eyebrow {
            font-size: 9px; font-weight: 600; letter-spacing: .28em; text-transform: uppercase;
            color: var(--mustard-light); margin-bottom: 18px;
          }
          .ep-hero h1 {
            font-size: clamp(26px,5vw,56px);
            font-weight: 800; line-height: 1.08;
            color: var(--white); margin-bottom: 14px;
            letter-spacing: -.01em; text-transform: uppercase;
          }
          .ep-hero h1 span { color: var(--mustard); display: block; }
          .ep-hero-divider { width: 44px; height: 3px; background: var(--mustard); margin: 18px auto; }
          .ep-hero-sub {
            font-size: clamp(9px,1.5vw,11px); font-weight: 600; letter-spacing: .2em; text-transform: uppercase;
            color: rgba(255,255,255,.7); margin-bottom: 20px; line-height: 2.2;
          }
          .ep-hero-intro {
            font-size: clamp(13px,2vw,15px); font-weight: 300; line-height: 1.85;
            color: rgba(255,255,255,.85); max-width: 580px; margin: 0 auto;
          }
          @media(max-width:480px) {
            .ep-hero { padding: 100px 20px 48px; }
            .ep-hero-logo img { height: 36px; }
            .ep-hero-eyebrow { font-size: 8px; letter-spacing: .18em; }
          }

          /* ── EVENT BAR ── */
          .ep-event-bar {
            background: var(--navy);
            display: flex; justify-content: center; flex-wrap: wrap;
            width: 100%;
          }
          .ep-event-pill {
            flex: 1; min-width: 160px;
            padding: 24px 20px;
            border-right: 1px solid rgba(255,255,255,.1);
            text-align: center;
            display: flex; flex-direction: column; align-items: center; gap: 5px;
          }
          .ep-event-pill:last-child { border-right: none; }
          .ep-event-pill-icon { font-size: 20px; line-height: 1; }
          .ep-event-pill-label {
            font-size: 8px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase;
            color: var(--mustard);
          }
          .ep-event-pill-value {
            font-size: clamp(12px,2vw,15px); font-weight: 500; color: var(--white); line-height: 1.3;
          }
          .ep-event-pill-sub {
            font-size: clamp(10px,1.5vw,12px); font-weight: 300; color: var(--blue-light);
            line-height: 1.4;
          }
          .ep-maps-link {
            display: inline-flex; align-items: center; gap: 5px;
            margin-top: 8px; padding: 6px 14px;
            font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
            color: var(--navy); background: var(--mustard);
            text-decoration: none; border: none;
            transition: background .2s; line-height: 1;
          }
          .ep-maps-link:hover { background: var(--mustard-light); }
          @media(max-width:600px) {
            .ep-event-bar { flex-direction: column; }
            .ep-event-pill {
              flex: none; width: 100%;
              border-right: none; border-bottom: 1px solid rgba(255,255,255,.1);
              padding: 20px 24px;
            }
            .ep-event-pill:last-child { border-bottom: none; }
          }

          /* ── PROGRAMME ── */
          .ep-programme { background: var(--blue-dark); padding: 64px 24px; }
          .ep-programme-inner { max-width: 960px; margin: 0 auto; }
          .ep-section-eyebrow {
            font-size: 9px; font-weight: 700; letter-spacing: .28em;
            text-transform: uppercase; color: var(--mustard); margin-bottom: 12px;
          }
          .ep-programme h2 {
            font-size: clamp(18px,3vw,28px);
            font-weight: 200; letter-spacing: .12em;
            text-transform: uppercase; color: var(--white);
            margin-bottom: 6px; font-style: italic;
          }
          .ep-programme-sub {
            font-size: 13px; font-weight: 300; color: rgba(255,255,255,.5);
            margin-bottom: 36px;
          }
          .ep-prog-steps {
            display: grid;
            grid-template-columns: repeat(4,1fr);
            gap: 1px; background: rgba(255,255,255,.08);
          }
          .ep-prog-step {
            background: var(--blue-dark); padding: 28px 20px;
            border-left: 3px solid transparent;
            transition: border-color .2s, background .2s;
          }
          .ep-prog-step:hover { border-left-color: var(--mustard); background: rgba(237,182,88,0.06); }
          .ep-prog-number {
            font-size: 36px; font-weight: 200; color: var(--mustard);
            line-height: 1; margin-bottom: 12px; font-style: italic;
          }
          .ep-prog-title {
            font-size: 11px; font-weight: 400; color: var(--white);
            text-transform: uppercase; letter-spacing: .07em; line-height: 1.5;
          }
          @media(max-width:700px) {
            .ep-prog-steps { grid-template-columns: 1fr 1fr; }
          }
          @media(max-width:400px) {
            .ep-prog-steps { grid-template-columns: 1fr; }
          }

          /* ── GENERIC SECTIONS ── */
          .ep-section { padding: 72px 24px; width: 100%; }
          .ep-section-inner { max-width: 920px; margin: 0 auto; }
          .ep-section h2 {
            font-size: clamp(18px,3vw,30px); font-weight: 700;
            line-height: 1.2; color: var(--navy);
            margin-bottom: 18px; text-transform: uppercase; letter-spacing: .02em;
          }
          .ep-section-body {
            font-size: clamp(13px,1.8vw,14px); font-weight: 300;
            line-height: 1.9; color: var(--mid); max-width: 680px;
          }
          .ep-section-alt { background: var(--bg2); }

          /* ── FEATURES VERTICAL ── */
          .ep-features-vertical { list-style: none; margin-top: 32px; max-width: 480px; }
          .ep-features-vertical li {
            display: flex; align-items: center; gap: 14px;
            padding: 12px 0; border-bottom: 1px solid #E0DDD8;
            font-size: clamp(12px,1.8vw,13px); font-weight: 500; color: var(--ink);
          }
          .ep-features-vertical li:last-child { border-bottom: none; }
          .ep-feat-check {
            width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
            background: var(--mustard); color: var(--navy);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: 800;
          }

          /* ── FUNC GRID ── */
          .ep-func-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill,minmax(180px,1fr));
            gap: 12px; margin-top: 32px;
          }
          .ep-func-card {
            background: var(--white); border: 1px solid #E0DDD8;
            padding: 20px 18px;
          }
          .ep-func-accent { width: 22px; height: 2px; background: var(--mustard); margin-bottom: 12px; }
          .ep-func-title { font-size: 12px; font-weight: 600; color: var(--navy); line-height: 1.4; }
          @media(max-width:480px) {
            .ep-func-grid { grid-template-columns: 1fr 1fr; }
          }

          /* ── SORTEO ── */
          .ep-sorteo-section { background: var(--bg2); padding: 72px 24px; }
          .ep-sorteo-inner { max-width: 680px; margin: 0 auto; }
          .ep-sorteo-box {
            border: 2px solid var(--mustard); padding: 48px 36px;
            position: relative; background: rgba(237,182,88,0.06); text-align: center;
          }
          .ep-sorteo-tag {
            position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
            background: var(--mustard); color: var(--navy);
            font-size: 8px; font-weight: 800; letter-spacing: .25em; text-transform: uppercase;
            padding: 5px 20px; white-space: nowrap;
          }
          .ep-sorteo-emoji { font-size: 36px; margin-bottom: 14px; }
          .ep-sorteo-box h3 {
            font-size: clamp(16px,3vw,22px); font-weight: 800;
            color: var(--navy); margin-bottom: 10px;
            text-transform: uppercase; letter-spacing: .02em;
          }
          .ep-sorteo-box p {
            font-size: clamp(12px,1.8vw,13px); font-weight: 300;
            color: var(--mid); line-height: 1.8; max-width: 440px; margin: 0 auto;
          }
          .ep-sorteo-value {
            display: inline-block; margin-top: 18px;
            font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
            color: var(--navy); background: var(--mustard-pale);
            padding: 8px 22px; border: 1px solid var(--mustard);
          }
          @media(max-width:480px) {
            .ep-sorteo-box { padding: 36px 24px; }
          }

          /* ── FORM ── */
          .ep-form-section { background: var(--bg); padding: 72px 24px; }
          .ep-form-inner { max-width: 640px; margin: 0 auto; }
          .ep-form-card {
            background: var(--white);
            border-top: 4px solid var(--mustard);
            padding: 48px 40px;
            box-shadow: 0 2px 20px rgba(10,41,71,0.06);
          }
          .ep-form-card .ep-section-eyebrow { margin-bottom: 10px; }
          .ep-form-card h2 {
            font-size: clamp(18px,3vw,24px); font-weight: 700;
            color: var(--navy); margin-bottom: 8px;
            text-transform: uppercase; letter-spacing: .02em;
          }
          .ep-form-card p {
            font-size: 13px; font-weight: 300; color: var(--mid);
            margin-bottom: 10px; line-height: 1.7;
          }
          .ep-form-deadline {
            display: inline-block; background: var(--mustard-pale);
            color: var(--navy); font-size: 11px; font-weight: 700; letter-spacing: .1em;
            padding: 7px 16px; margin-bottom: 24px; border-left: 3px solid var(--mustard);
          }
          .ep-form-note {
            font-size: 11px; font-weight: 300; color: var(--soft);
            text-align: center; margin-top: 16px; line-height: 1.8;
          }
          @media(max-width:520px) {
            .ep-form-card { padding: 32px 20px; }
          }

          /* ── FOOTER ── */
          .ep-footer { background: var(--navy); padding: 52px 24px 36px; text-align: center; }
          .ep-footer-logo { text-align: center; margin-bottom: 14px; }
          .ep-footer-logo img { height: 48px; width: auto; filter: brightness(0) invert(1); display: block; margin: 0 auto; }
          .ep-footer-divider { width: 36px; height: 2px; background: var(--mustard); margin: 16px auto; }
          .ep-footer-tagline {
            font-size: 9px; font-weight: 600; letter-spacing: .22em;
            text-transform: uppercase; color: var(--mustard); margin-bottom: 16px;
          }
          .ep-footer-contact {
            font-size: 12px; font-weight: 300; color: rgba(255,255,255,.5);
            line-height: 2.2; margin-bottom: 20px;
          }
          .ep-footer-legal {
            border-top: 1px solid rgba(255,255,255,.1); padding-top: 20px; margin-top: 8px;
            font-size: 10px; font-weight: 400; color: rgba(255,255,255,.28);
            line-height: 2.2; letter-spacing: .02em;
          }
        `}</style>

        {/* Google Fonts — Montserrat */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <div className="ep-root">

          {/* HERO */}
          <section className="ep-hero" id="ep-evento">
            <div className="ep-hero-bg" />
            <div className="ep-hero-content">
              <div className="ep-hero-logo">
                <img src={LOGO_URL} alt="Elora Smart" style={{height:'64px',width:'auto',filter:'brightness(0) invert(1)',display:'block',margin:'0 auto 24px'}} />
              </div>
                          <p className="ep-hero-eyebrow">Evento Exclusivo · Asunción, Paraguay · Agosto 2026</p>
              <h1>
                La nueva generación del
                <span>baño inteligente</span>
                llega a Paraguay
              </h1>
              <div className="ep-hero-divider" />
              <p className="ep-hero-sub">
                Arquitectos · Interioristas · Desarrolladores · Profesionales del Sector
              </p>
              <p className="ep-hero-intro">
                Le invitamos a descubrir una nueva forma de entender el espacio de baño, donde la tecnología, el diseño y el bienestar se integran para crear experiencias únicas.
              </p>
            </div>
          </section>

          {/* EVENT BAR */}
          <div className="ep-event-bar">
            <div className="ep-event-pill">
              <span className="ep-event-pill-icon">📅</span>
              <span className="ep-event-pill-label">Fecha</span>
              <span className="ep-event-pill-value">Miércoles 12 de Agosto 2026</span>
            </div>
            <div className="ep-event-pill">
              <span className="ep-event-pill-icon">🕕</span>
              <span className="ep-event-pill-label">Hora</span>
              <span className="ep-event-pill-value">18:00 horas</span>
            </div>
            <div className="ep-event-pill">
              <span className="ep-event-pill-icon">📍</span>
              <span className="ep-event-pill-label">Lugar</span>
              <span className="ep-event-pill-value">Terraza Hotel TRYP by Wyndham</span>
              <span className="ep-event-pill-sub">Av. Gral. José de San Martín 836</span>
              <span className="ep-event-pill-sub">Asunción, Paraguay</span>
              <a
                className="ep-maps-link"
                href="https://maps.google.com/?q=Hotel+TRYP+by+Wyndham+Asuncion+Paraguay"
                target="_blank"
                rel="noopener noreferrer"
              >
                📍 Ver en Google Maps
              </a>
            </div>

          </div>

          {/* PROGRAMME */}
          <section className="ep-programme">
            <div className="ep-programme-inner">
              <p className="ep-section-eyebrow">Agenda</p>
              <h2>Programa del Evento</h2>
              <p className="ep-programme-sub">Un encuentro diseñado para profesionales que buscan diferenciarse con soluciones de alto nivel.</p>
              <div className="ep-prog-steps">
                <div className="ep-prog-step">
                  <div className="ep-prog-number">01</div>
                  <div className="ep-prog-title">Descubra el futuro del baño</div>
                </div>
                <div className="ep-prog-step">
                  <div className="ep-prog-number">02</div>
                  <div className="ep-prog-title">Experiencia ELORA SMART</div>
                </div>
                <div className="ep-prog-step">
                  <div className="ep-prog-number">03</div>
                  <div className="ep-prog-title">Inspiración para proyectos de alto nivel</div>
                </div>
                <div className="ep-prog-step">
                  <div className="ep-prog-number">04</div>
                  <div className="ep-prog-title">Networking &amp; Cocktail</div>
                </div>
              </div>
            </div>
          </section>

          {/* SOBRE ELORA SMART */}
          <section className="ep-section" id="ep-sobre">
            <div className="ep-section-inner">
              <p className="ep-section-eyebrow">01 · Sobre el Evento</p>
              <h2>Descubra el futuro del baño</h2>
              <p className="ep-section-body">
                ELORA SMART presenta oficialmente en Paraguay su innovadora línea de smart toilets — una solución premium que redefine los estándares de confort, higiene y sofisticación en proyectos residenciales, hoteleros y corporativos de alto nivel.
              </p>
              <p className="ep-section-body">
                Durante este encuentro exclusivo podrá conocer de primera mano las últimas tendencias internacionales en baños inteligentes y experimentar las funcionalidades que están transformando los espacios más exigentes del mundo.
              </p>
              <ul className="ep-features-vertical">
                <li><span className="ep-feat-check">✓</span>Tecnología inteligente integrada</li>
                <li><span className="ep-feat-check">✓</span>Diseño contemporáneo y minimalista</li>
                <li><span className="ep-feat-check">✓</span>Máxima higiene y confort personal</li>
                <li><span className="ep-feat-check">✓</span>Eficiencia y sostenibilidad</li>
                <li><span className="ep-feat-check">✓</span>Soluciones para proyectos residenciales y hoteleros premium</li>
              </ul>
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section className="ep-section ep-section-alt" id="ep-experiencia">
            <div className="ep-section-inner">
              <p className="ep-section-eyebrow">02 · Experiencia en Vivo</p>
              <h2>Experiencia ELORA SMART</h2>
              <p className="ep-section-body">
                Conozca en vivo las principales funcionalidades de nuestros smart toilets y compruebe por qué están transformando los espacios más exigentes del mundo.
              </p>
              <div className="ep-func-grid">
                {[
                  "Sistema de lavado inteligente",
                  "Secado integrado",
                  "Asiento calefactado ajustable",
                  "Control remoto intuitivo",
                  "Tecnología de ahorro de agua",
                  "Apertura y cierre automático silencioso",
                  "Diseño elegante y minimalista",
                  "Soluciones para proyectos premium",
                ].map((f) => (
                  <div className="ep-func-card" key={f}>
                    <div className="ep-func-accent" />
                    <div className="ep-func-title">{f}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* INSPIRACION */}
          <section className="ep-section" id="ep-proyectos">
            <div className="ep-section-inner">
              <p className="ep-section-eyebrow">03 · Inspiración</p>
              <h2>Proyectos de Alto Nivel</h2>
              <p className="ep-section-body">
                Explore cómo ELORA SMART puede aportar valor diferencial a proyectos de vivienda premium, desarrollos inmobiliarios, hoteles boutique, clínicas privadas y espacios corporativos de nueva generación.
              </p>
            </div>
          </section>

          {/* NETWORKING */}
          <section className="ep-section ep-section-alt" id="ep-networking">
            <div className="ep-section-inner">
              <p className="ep-section-eyebrow">04 · Al Finalizar</p>
              <h2>Networking &amp; Cocktail</h2>
              <p className="ep-section-body">
                Al finalizar la presentación compartiremos un espacio exclusivo de networking donde podrá intercambiar ideas con arquitectos, diseñadores, desarrolladores y líderes del sector.<br /><br />
                Una oportunidad para generar nuevas conexiones profesionales y descubrir las posibilidades que ofrece la tecnología aplicada al diseño de interiores.
              </p>
            </div>
          </section>

          {/* SORTEO */}
          <section className="ep-sorteo-section">
            <div className="ep-sorteo-inner">
              <div className="ep-sorteo-box">
                <span className="ep-sorteo-tag">✦ Exclusivo para Asistentes ✦</span>
                <div className="ep-sorteo-emoji">🎁</div>
                <h3>Sorteo de un Smart Toilet de Alta Gama</h3>
                <p>Entre todos los asistentes sortearemos un inodoro inteligente ELORA SMART de alta gama. Solo podrán participar quienes estén presentes en la sala el día del evento.</p>
                <span className="ep-sorteo-value">Valorado en 2.000 USD · Solo presencial</span>
              </div>
            </div>
          </section>

          {/* FORMULARIO */}
          <section className="ep-form-section" id="ep-registro">
            <div className="ep-form-inner">
              <div className="ep-form-card">
                <p className="ep-section-eyebrow">Confirmación de Asistencia</p>
                <h2>Reserve su plaza</h2>
                <p>Aforo limitado para garantizar una experiencia personalizada y exclusiva.</p>
                <span className="ep-form-deadline">⏳ Fecha límite: viernes 31 de julio de 2026</span>
                <iframe
                  src="https://airtable.com/embed/appj9bAkqM61tklod/pagDek5WGBtvLU2CT/form"
                  frameBorder={0}
                  width="100%"
                  height={700}
                  style={{ background: "transparent", border: "none", marginTop: "20px", display: "block", maxWidth: "100%" }}
                  title="Formulario de registro"
                />
                <p className="ep-form-note">
                  Sus datos se usarán exclusivamente para la gestión de este evento.<br />
                  paraguay@elorasmart.com · WhatsApp +34 614 451 901
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="ep-footer">
            <div className="ep-footer-logo">
              <img src={LOGO_URL} alt="Elora Smart" />
            </div>
            <div className="ep-footer-divider" />
            <p className="ep-footer-tagline">Innovación que transforma la experiencia del baño</p>
            <p className="ep-footer-contact">
              paraguay@elorasmart.com &nbsp;·&nbsp; +34 614 451 901
            </p>
            <div className="ep-footer-legal">
              ELORA SMART EAS &nbsp;·&nbsp; RUC 801720842<br />
              Av. Defensores del Chaco 613 c/ Saturio Ríos<br />
              San Lorenzo 111423 · Departamento Central · Paraguay
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
