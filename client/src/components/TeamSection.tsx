import { useEffect, useRef, useState } from "react";

const PHOTOS = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m1-3NRdKwH8BiRuSz58zowsUU.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m2-V2nxMUpmGiciBeF2Bt5tBc.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m3-2pafZmtLHgvxqQ4JdZGe4P.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m4-ev5Uf3wMMPUdyQYu2hnKgj.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m5-GXVFsaGGpa662S8fB2ZBPs.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m6-6tqjEN7P8KgrfTrfLp7nai.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_f1-NKED4ykAPKCppJXk3zGEiR.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m7-GECT5oegAHHkRvrxpkBsfz.webp",
];

const TEAM = [
  { name: "Eloy Ramos",          role: "Director de Producto",          photo: PHOTOS[0] },
  { name: "Marta Rama",          role: "Directora de Marketing",        photo: PHOTOS[1] },
  { name: "Alejandro Rodriguez", role: "Expansión Comercial",           photo: PHOTOS[2] },
  { name: "Rubén Beiroa",        role: "Ingeniería y Desarrollo",       photo: PHOTOS[3] },
  { name: "César Juncal",        role: "Soporte Técnico",               photo: PHOTOS[4] },
  { name: "Jesús Fernandez",     role: "Servicio Técnico Nacional",     photo: PHOTOS[5] },
  { name: "Uxia Tarrío",         role: "Ventas Península Ibérica",      photo: PHOTOS[6] },
  { name: "Raul Plaza",          role: "Ventas Sur de España",          photo: PHOTOS[7] },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-16 md:py-24"
    >
      <style>{`
        @keyframes team-fade-up {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes team-reveal-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes team-glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,122,61,0); }
          50%       { box-shadow: 0 0 20px 4px rgba(232,122,61,0.18); }
        }
        @keyframes prox-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes prox-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .team-card-inner:hover .team-blur-overlay {
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          background: rgba(0,0,0,0.55) !important;
        }
        .team-card-inner:hover img {
          transform: scale(1.07) !important;
          filter: grayscale(0%) !important;
        }
        .team-card-inner:hover {
          animation: team-glow-pulse 1.8s ease-in-out infinite;
          border-color: rgba(232,122,61,0.5) !important;
        }
      `}</style>

      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{ background: "linear-gradient(90deg,transparent,#E87A3D,transparent)" }} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        {/* Cabecera compacta centrada */}
        <div
          className="text-center mb-10 md:mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep/70 mb-3">
            Las personas detrás de ELORA
          </p>
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-foreground leading-[0.95]">
            Nuestro Equipo
          </h2>
          {/* Línea dorada animada */}
          <div
            className="mx-auto mt-4 h-px origin-center"
            style={{
              width: "56px",
              background: "linear-gradient(90deg,transparent,#E87A3D,transparent)",
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s",
            }}
          />
        </div>

        {/* Grid 4×2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {TEAM.map((m, i) => {
            const delay = i * 70;
            return (
              <div
                key={m.name}
                className="team-card-inner relative overflow-hidden border border-border cursor-default flex flex-col"
                style={{
                  opacity: visible ? 1 : 0,
                  animation: visible
                    ? `team-fade-up 0.6s cubic-bezier(0.23,1,0.32,1) ${delay}ms both`
                    : "none",
                  borderRadius: "2px",
                  transition: "border-color 0.3s ease",
                }}
              >
                {/* Foto */}
                <div className="relative overflow-hidden" style={{ paddingBottom: "100%" }}>
                  <img
                    src={m.photo}
                    alt={m.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter: "grayscale(30%)",
                      transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1), filter 0.4s ease",
                    }}
                  />

                  {/* Overlay oscuro degradado inferior */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                    }}
                  />

                  {/* Blur overlay "Próximamente" */}
                  <div
                    className="team-blur-overlay absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      background: "rgba(0,0,0,0.42)",
                      transition: "backdrop-filter 0.4s ease, background 0.4s ease",
                    }}
                  >
                    {/* Punto pulsante */}
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#E87A3D",
                        display: "block",
                        animation: "prox-dot 2s ease-in-out infinite",
                      }}
                    />
                    {/* Texto shimmer */}
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body)",
                        background: "linear-gradient(90deg, #E87A3D 0%, #fbbf24 40%, #E87A3D 80%)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "prox-shimmer 2.5s linear infinite",
                      }}
                    >
                      Próximamente
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-2 py-3 md:px-3 md:py-4 bg-background border-t border-border">
                  <p className="font-display text-[13px] md:text-[17px] uppercase tracking-wide text-foreground leading-tight break-words hyphens-auto">
                    {m.name}
                  </p>
                  <p className="font-body text-[10px] md:text-[12px] uppercase tracking-[0.08em] text-accent-deep/80 mt-1 leading-snug break-words hyphens-auto">
                    {m.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota pie */}
        <p
          className="text-center font-body text-[10px] uppercase tracking-[0.2em] text-foreground/30 mt-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
          }}
        >
          Fotos reales del equipo — próximamente
        </p>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px"
        style={{ background: "linear-gradient(90deg,transparent,#E87A3D,transparent)" }} />
    </section>
  );
}
