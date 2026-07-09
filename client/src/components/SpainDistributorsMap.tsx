import { useEffect, useRef, useState } from "react";

// Coordenadas en el viewBox 0 0 1000 800 del mapa de España
// Ajustadas para coincidir con la silueta real del SVG
const DISTRIBUTORS = [
  { id: 1,  city: "Madrid",        region: "Comunidad de Madrid",   x: 500, y: 340, distributor: "Elora Madrid Central" },
  { id: 2,  city: "Barcelona",     region: "Cataluña",              x: 760, y: 220, distributor: "Elora Catalunya" },
  { id: 3,  city: "Valencia",      region: "Comunidad Valenciana",  x: 660, y: 390, distributor: "Elora Valencia" },
  { id: 4,  city: "Sevilla",       region: "Andalucía",             x: 330, y: 530, distributor: "Elora Sur" },
  { id: 5,  city: "Bilbao",        region: "País Vasco",            x: 520, y: 130, distributor: "Elora Norte" },
  { id: 6,  city: "Zaragoza",      region: "Aragón",                x: 610, y: 230, distributor: "Elora Aragón" },
  { id: 7,  city: "Málaga",        region: "Andalucía",             x: 390, y: 590, distributor: "Elora Costa del Sol" },
  { id: 8,  city: "Vigo",          region: "Galicia",               x: 200, y: 200, distributor: "Elora Galicia" },
  { id: 9,  city: "Palma",         region: "Islas Baleares",        x: 790, y: 370, distributor: "Elora Baleares" },
  { id: 10, city: "Las Palmas",    region: "Canarias",              x: 160, y: 700, distributor: "Elora Canarias" },
];

// Silueta simplificada de España (peninsular + Baleares + Canarias)
const SPAIN_PATH = `
M 240 80
L 280 60 L 340 55 L 400 50 L 460 45 L 520 42 L 580 45 L 640 50 L 700 60 L 750 75
L 790 95 L 820 120 L 840 150 L 850 180 L 845 210 L 830 235 L 810 255
L 800 280 L 810 305 L 820 330 L 815 360 L 800 385 L 790 410
L 770 430 L 750 455 L 720 475 L 690 490 L 660 500 L 630 510
L 600 525 L 570 540 L 540 555 L 510 565 L 480 570 L 450 568
L 420 560 L 395 548 L 370 535 L 345 520 L 320 505 L 295 490
L 270 472 L 248 452 L 232 430 L 220 408 L 210 385 L 205 360
L 200 335 L 198 308 L 200 280 L 205 255 L 212 228 L 220 202
L 225 175 L 222 148 L 218 122 L 225 100 L 232 88 Z
M 760 340 L 775 330 L 800 335 L 820 345 L 825 360 L 815 375 L 795 378 L 775 370 L 762 355 Z
M 770 355 L 790 348 L 808 355 L 810 368 L 796 374 L 778 368 Z
M 130 670 L 155 660 L 185 658 L 210 665 L 225 678 L 220 695 L 200 705 L 175 708 L 150 700 L 132 688 Z
M 240 672 L 265 665 L 290 668 L 305 680 L 300 695 L 280 702 L 255 700 L 238 688 Z
`;

function PulsingDot({ x, y, delay, active, onClick }: {
  x: number; y: number; delay: number; active: boolean; onClick: () => void;
}) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Anillo exterior pulsante */}
      <circle
        cx={x} cy={y} r={active ? 18 : 14}
        fill="none"
        stroke="#E87A3D"
        strokeWidth={active ? 2 : 1.5}
        opacity={active ? 0.6 : 0.3}
        style={{
          animation: `ping-ring ${1.8 + delay * 0.3}s ease-out infinite`,
          animationDelay: `${delay * 0.25}s`,
        }}
      />
      {/* Segundo anillo */}
      <circle
        cx={x} cy={y} r={active ? 10 : 8}
        fill="none"
        stroke="#E87A3D"
        strokeWidth={1}
        opacity={active ? 0.5 : 0.2}
        style={{
          animation: `ping-ring2 ${2.2 + delay * 0.2}s ease-out infinite`,
          animationDelay: `${delay * 0.3 + 0.4}s`,
        }}
      />
      {/* Punto central */}
      <circle
        cx={x} cy={y} r={active ? 6 : 4}
        fill={active ? "#E87A3D" : "#E87A3D"}
        opacity={active ? 1 : 0.7}
        style={{
          filter: active ? "drop-shadow(0 0 8px #E87A3D)" : "drop-shadow(0 0 3px #E87A3D)",
          transition: "all 0.3s ease",
        }}
      />
      {/* Núcleo blanco */}
      <circle cx={x} cy={y} r={active ? 2.5 : 1.8} fill="white" opacity={0.9} />
    </g>
  );
}

export default function SpainDistributorsMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setLineProgress(Math.min(p, 100));
        if (p >= 100) clearInterval(interval);
      }, 20);
    }, 600);
    return () => clearTimeout(t);
  }, [visible]);

  // Auto-cycle through dots
  useEffect(() => {
    if (!visible) return;
    let idx = 0;
    const interval = setInterval(() => {
      setActive(DISTRIBUTORS[idx].id);
      idx = (idx + 1) % DISTRIBUTORS.length;
    }, 1800);
    return () => clearInterval(interval);
  }, [visible]);

  const activeItem = active ? DISTRIBUTORS.find(d => d.id === active) : null;
  const hoveredItem = hovered ? DISTRIBUTORS.find(d => d.id === hovered) : null;
  const displayItem = hoveredItem || activeItem;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background py-20 md:py-28 overflow-hidden"
    >
      <style>{`
        @keyframes ping-ring {
          0%   { r: 6px; opacity: 0.7; }
          70%  { r: 22px; opacity: 0; }
          100% { r: 22px; opacity: 0; }
        }
        @keyframes ping-ring2 {
          0%   { r: 4px; opacity: 0.5; }
          70%  { r: 14px; opacity: 0; }
          100% { r: 14px; opacity: 0; }
        }
        @keyframes map-fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dot-appear {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes line-draw {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes counter-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .map-dot-group {
          transform-origin: center;
          animation: dot-appear 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .spain-path-fill {
          transition: fill 0.8s ease;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        {/* Cabecera */}
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep/70 mb-3">
            Red de distribución
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-foreground leading-[0.95]">
              Distribuidores<br />en España
            </h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p
                  className="font-display text-4xl md:text-5xl text-accent-deep leading-none"
                  style={{ animation: visible ? "counter-pulse 2s ease-in-out infinite" : "none" }}
                >
                  {DISTRIBUTORS.length}
                </p>
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-1">Puntos de venta</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-display text-4xl md:text-5xl text-foreground leading-none">17</p>
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-1">Comunidades</p>
              </div>
            </div>
          </div>
          <div className="mt-5 h-px w-16 bg-accent-deep/40" />
        </div>

        {/* Mapa + Info */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

          {/* SVG Mapa */}
          <div
            className="w-full lg:w-2/3 relative"
            style={{
              opacity: visible ? 1 : 0,
              animation: visible ? "map-fade-in 1s cubic-bezier(0.23,1,0.32,1) 0.3s both" : "none",
            }}
          >
            <svg
              viewBox="0 0 1000 800"
              className="w-full h-auto"
              style={{ maxHeight: "520px" }}
            >
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E87A3D" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#E87A3D" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="mapShadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#001F3F" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Fondo glow */}
              <ellipse cx="500" cy="380" rx="380" ry="260" fill="url(#mapGlow)" />

              {/* Silueta de España */}
              <path
                d={SPAIN_PATH}
                className="spain-path-fill"
                fill={visible ? "#001F3F" : "#001F3F"}
                stroke="#E87A3D"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                filter="url(#mapShadow)"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: "opacity 1s ease 0.2s",
                }}
              />

              {/* Textura interior sutil */}
              <path
                d={SPAIN_PATH}
                fill="none"
                stroke="rgba(232,122,61,0.06)"
                strokeWidth="20"
                strokeDasharray="4 8"
              />

              {/* Líneas de conexión desde Madrid (centro) */}
              {visible && DISTRIBUTORS.filter(d => d.id !== 1).map((d, i) => {
                const madrid = DISTRIBUTORS[0];
                const totalLen = Math.sqrt((d.x - madrid.x) ** 2 + (d.y - madrid.y) ** 2);
                return (
                  <line
                    key={d.id}
                    x1={madrid.x} y1={madrid.y}
                    x2={d.x} y2={d.y}
                    stroke="#E87A3D"
                    strokeWidth="0.8"
                    strokeOpacity={active === d.id ? 0.5 : 0.12}
                    strokeDasharray={`${totalLen} ${totalLen}`}
                    strokeDashoffset={totalLen * (1 - lineProgress / 100)}
                    style={{ transition: "stroke-opacity 0.4s ease" }}
                  />
                );
              })}

              {/* Puntos de distribuidores */}
              {DISTRIBUTORS.map((d, i) => (
                <g
                  key={d.id}
                  className="map-dot-group"
                  style={{ animationDelay: `${0.5 + i * 0.12}s` }}
                  onMouseEnter={() => setHovered(d.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setActive(d.id === active ? null : d.id)}
                >
                  <PulsingDot
                    x={d.x} y={d.y}
                    delay={i}
                    active={active === d.id || hovered === d.id}
                    onClick={() => {}}
                  />
                  {/* Nombre ciudad en SVG */}
                  <text
                    x={d.x + (d.x > 500 ? -8 : 8)}
                    y={d.y - 14}
                    textAnchor={d.x > 500 ? "end" : "start"}
                    fontSize="9"
                    fontFamily="'Oswald', sans-serif"
                    fontWeight="400"
                    letterSpacing="1.5"
                    fill="white"
                    opacity={active === d.id || hovered === d.id ? 1 : 0.55}
                    style={{ transition: "opacity 0.3s ease", textTransform: "uppercase" }}
                  >
                    {d.city.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Panel info lateral */}
          <div
            className="w-full lg:w-1/3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: "opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s",
            }}
          >
            {/* Tarjeta activa */}
            <div
              className="border border-border bg-card p-6 mb-6"
              style={{ borderRadius: "2px", minHeight: "140px" }}
            >
              {displayItem ? (
                <div style={{ animation: "tooltip-in 0.3s ease both" }} key={displayItem.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      style={{ width: 8, height: 8, borderRadius: "50%", background: "#E87A3D", display: "inline-block",
                        boxShadow: "0 0 10px #E87A3D", animation: "counter-pulse 1.5s ease-in-out infinite" }}
                    />
                    <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent-deep">Distribuidor activo</p>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide text-foreground leading-tight mb-1">
                    {displayItem.city}
                  </h3>
                  <p className="font-body text-[11px] uppercase tracking-[0.15em] text-foreground/50 mb-3">
                    {displayItem.region}
                  </p>
                  <div className="h-px bg-border mb-3" />
                  <p className="font-body text-sm text-foreground/70">{displayItem.distributor}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                  <div className="w-8 h-8 border border-border rounded-full flex items-center justify-center">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E87A3D", display: "block" }} />
                  </div>
                  <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    Selecciona un punto
                  </p>
                </div>
              )}
            </div>

            {/* Lista de ciudades */}
            <div className="space-y-1">
              {DISTRIBUTORS.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d.id === active ? null : d.id)}
                  onMouseEnter={() => setHovered(d.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left transition-all duration-200"
                  style={{
                    background: active === d.id || hovered === d.id ? "rgba(232,122,61,0.06)" : "transparent",
                    borderLeft: active === d.id ? "2px solid #E87A3D" : "2px solid transparent",
                    opacity: visible ? 1 : 0,
                    transition: "all 0.2s ease, opacity 0.5s ease",
                    transitionDelay: `${0.7 + i * 0.06}s`,
                  }}
                >
                  <span
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: active === d.id ? "#E87A3D" : "rgba(232,122,61,0.4)",
                      flexShrink: 0,
                      boxShadow: active === d.id ? "0 0 8px #E87A3D" : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <span className="font-display text-[11px] uppercase tracking-[0.2em] text-foreground/70"
                    style={{ color: active === d.id ? "var(--foreground)" : undefined }}>
                    {d.city}
                  </span>
                  <span className="ml-auto font-body text-[9px] uppercase tracking-[0.15em] text-foreground/30">
                    {d.region.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 pt-5 border-t border-border">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-3">
                ¿Quieres ser distribuidor?
              </p>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-accent-deep hover:text-foreground transition-colors duration-200"
              >
                Contactar
                <span style={{ fontSize: 10 }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
