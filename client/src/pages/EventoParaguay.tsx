import { useEffect } from "react";

const LOGO_COLOR_URL = "/manus-storage/elora_logo_color_2329eaab.webp";
// Logo blanco para fondos oscuros (hero y footer)
const LOGO_WHITE_URL = "/manus-storage/elora_200_daf8d186.png";

// Imagen de fondo del hero (foto de producto Elora Smart)
const HERO_BG_URL = "/manus-storage/AURA-compact-p-800x800_597da236.jpg";

export default function EventoParaguay() {
  useEffect(() => {
    document.title = "elora smart — Evento Exclusivo Paraguay";
  }, []);

  return (
    <>
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

        /* ── HEADER ── */
        .ep-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.97);
          border-bottom: 2px solid var(--mustard);
          padding: 0 40px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ep-logo img { height: 30px; display: block; width: auto; }
        .ep-header-badge {
          font-size: 9px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
          color: var(--navy); border: 1.5px solid var(--navy); padding: 6px 14px;
          white-space: nowrap;
        }
        @media(max-width:480px) {
          .ep-header { padding: 0 16px; height: 56px; }
          .ep-header-badge { font-size: 8px; padding: 5px 10px; letter-spacing: .12em; }
          .ep-logo img { height: 24px; }
        }

        /* ── HERO ── */
        .ep-hero {
          min-height: 100vh; position: relative;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          text-align: center; padding: 100px 24px 60px;
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
        .ep-hero-logo img { height: 44px; width: auto; filter: brightness(0) invert(1); }
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
          .ep-hero { padding: 80px 20px 48px; }
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
        .ep-footer-logo img { height: 32px; width: auto; margin-bottom: 14px; filter: brightness(0) invert(1); }
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
        {/* HEADER */}
        <header className="ep-header">
          <a className="ep-logo" href="https://elorasmart.online">
            <img src={LOGO_COLOR_URL} alt="Elora Smart" />
          </a>
          <span className="ep-header-badge">Evento Exclusivo · Paraguay</span>
        </header>

        {/* HERO */}
        <section className="ep-hero">
          <div className="ep-hero-bg" />
          <div className="ep-hero-content">
            <div className="ep-hero-logo">
              <img src={LOGO_WHITE_URL} alt="Elora Smart" />
            </div>
            <p className="ep-hero-eyebrow">Presentación Exclusiva · Paraguay 2026</p>
            <h1>
              El Futuro del Baño
              <span>Ha Llegado a Paraguay</span>
            </h1>
            <div className="ep-hero-divider" />
            <p className="ep-hero-sub">
              Smart Toilets · Diseño Premium · Tecnología Japonesa<br />
              Arquitectos · Diseñadores · Desarrolladores Inmobiliarios
            </p>
            <p className="ep-hero-intro">
              Le invitamos a una presentación privada donde descubrirá en vivo la tecnología de inodoros inteligentes ELORA SMART, referencia en el mercado europeo de baños de alta gama.
            </p>
          </div>
        </section>

        {/* EVENT BAR */}
        <div className="ep-event-bar">
          <div className="ep-event-pill">
            <span className="ep-event-pill-icon">📅</span>
            <span className="ep-event-pill-label">Fecha</span>
            <span className="ep-event-pill-value">Jueves, 7 de agosto</span>
            <span className="ep-event-pill-sub">2026</span>
          </div>
          <div className="ep-event-pill">
            <span className="ep-event-pill-icon">🕕</span>
            <span className="ep-event-pill-label">Hora</span>
            <span className="ep-event-pill-value">18:30 h</span>
            <span className="ep-event-pill-sub">Puntual · Aforo limitado</span>
          </div>
          <div className="ep-event-pill">
            <span className="ep-event-pill-icon">📍</span>
            <span className="ep-event-pill-label">Lugar</span>
            <span className="ep-event-pill-value">Asunción, Paraguay</span>
            <span className="ep-event-pill-sub">Dirección confirmada al registrarse</span>
            <a
              className="ep-maps-link"
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Ver en Maps
            </a>
          </div>
          <div className="ep-event-pill">
            <span className="ep-event-pill-icon">🎟</span>
            <span className="ep-event-pill-label">Acceso</span>
            <span className="ep-event-pill-value">Solo con invitación</span>
            <span className="ep-event-pill-sub">Registro previo obligatorio</span>
          </div>
        </div>

        {/* PROGRAMME */}
        <section className="ep-programme">
          <div className="ep-programme-inner">
            <p className="ep-section-eyebrow">Programa del Evento</p>
            <h2>Una noche de innovación</h2>
            <p className="ep-programme-sub">Cuatro momentos diseñados para inspirar y conectar</p>
            <div className="ep-prog-steps">
              <div className="ep-prog-step">
                <div className="ep-prog-number">01</div>
                <p className="ep-prog-title">Bienvenida &amp; Presentación de Marca</p>
              </div>
              <div className="ep-prog-step">
                <div className="ep-prog-number">02</div>
                <p className="ep-prog-title">Demostración en Vivo de Smart Toilets</p>
              </div>
              <div className="ep-prog-step">
                <div className="ep-prog-number">03</div>
                <p className="ep-prog-title">Proyectos de Alto Nivel &amp; Casos de Éxito</p>
              </div>
              <div className="ep-prog-step">
                <div className="ep-prog-number">04</div>
                <p className="ep-prog-title">Networking &amp; Cocktail Exclusivo</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE ELORA SMART */}
        <section className="ep-section">
          <div className="ep-section-inner">
            <p className="ep-section-eyebrow">01 · Sobre Elora Smart</p>
            <h2>Tecnología que Transforma Espacios</h2>
            <p className="ep-section-body">
              ELORA SMART es la marca española de referencia en inodoros inteligentes de alta gama. Combinamos tecnología japonesa de última generación con diseño europeo de vanguardia para ofrecer una experiencia de baño sin precedentes.
            </p>
            <ul className="ep-features-vertical">
              <li><span className="ep-feat-check">✔</span>10 años de garantía y fabricación de calidad</li>
              <li><span className="ep-feat-check">✔</span>Diseño contemporáneo y minimalista</li>
              <li><span className="ep-feat-check">✔</span>Máxima higiene y confort personal</li>
              <li><span className="ep-feat-check">✔</span>Eficiencia y sostenibilidad</li>
              <li><span className="ep-feat-check">✔</span>Soluciones para proyectos residenciales y hoteleros premium</li>
            </ul>
          </div>
        </section>

        {/* EXPERIENCIA */}
        <section className="ep-section ep-section-alt">
          <div className="ep-section-inner">
            <p className="ep-section-eyebrow">02 · Experiencia en Vivo</p>
            <h2>Experiencia ELORA SMART</h2>
            <p className="ep-section-body">
              Conozca en vivo las principales funcionalidades de nuestros smart toilets y compruebe por qué están transformando los espacios más exigentes del mundo.
            </p>
            <div className="ep-func-grid">
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Sistema de lavado inteligente</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Secado integrado</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Asiento calefactado ajustable</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Control remoto intuitivo</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Tecnología de ahorro de agua</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Apertura y cierre automático silencioso</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Diseño elegante y minimalista</p></div>
              <div className="ep-func-card"><div className="ep-func-accent" /><p className="ep-func-title">Soluciones para proyectos premium</p></div>
            </div>
          </div>
        </section>

        {/* INSPIRACION */}
        <section className="ep-section">
          <div className="ep-section-inner">
            <p className="ep-section-eyebrow">03 · Inspiración</p>
            <h2>Proyectos de Alto Nivel</h2>
            <p className="ep-section-body">
              Explore cómo ELORA SMART puede aportar valor diferencial a proyectos de vivienda premium, desarrollos inmobiliarios, hoteles boutique, clínicas privadas y espacios corporativos de nueva generación.
            </p>
          </div>
        </section>

        {/* NETWORKING */}
        <section className="ep-section ep-section-alt">
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
        <section className="ep-form-section" id="confirmar">
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
            <img src={LOGO_WHITE_URL} alt="Elora Smart" />
          </div>
          <div className="ep-footer-divider" />
          <p className="ep-footer-tagline">Smart Toilets · Diseño Premium · Tecnología Japonesa</p>
          <p className="ep-footer-contact">
            paraguay@elorasmart.com<br />
            WhatsApp +34 614 451 901<br />
            <a href="https://elorasmart.online" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>elorasmart.online</a>
          </p>
          <div className="ep-footer-legal">
            © 2026 Elora Smart · Todos los derechos reservados<br />
            Avda. da Mahía, 17, bajo 2 — 15220 Bertamiráns (Ames), A Coruña, España
          </div>
        </footer>
      </div>
    </>
  );
}
