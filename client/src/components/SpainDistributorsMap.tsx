import { useEffect, useRef, useState } from "react";

// Coordenadas GPS reales de cada distribuidor
// Convertidas al viewBox 0 0 1000 780 del mapa SVG de España
// lat/lon → x/y usando proyección lineal calibrada con España peninsular
// España: lon [-9.3, 3.3] → x [130, 870]; lat [36.0, 43.8] → y [680, 100]
function gpsToSvg(lat: number, lon: number): { x: number; y: number } {
  const x = 130 + ((lon - (-9.3)) / (3.3 - (-9.3))) * (870 - 130);
  const y = 100 + ((43.8 - lat) / (43.8 - 36.0)) * (680 - 100);
  return { x: Math.round(x), y: Math.round(y) };
}

interface Distributor {
  id: number;
  name: string;
  address: string;
  city: string;
  cp: string;
  province: string;
  region: string;
  type: string;
  phone: string | null;
  email: string | null;
  lat: number;
  lon: number;
}

const DISTRIBUTORS: Distributor[] = [
  {
    id: 1, name: "Almacenes Mariña Gamma",
    address: "Travesía de Montouto, 11", city: "Teo", cp: "15883", province: "A Coruña", region: "Galicia",
    type: "Distribuidor oficial", phone: null, email: "administracion@almacenesmarina.com",
    lat: 42.836, lon: -8.571,
  },
  {
    id: 2, name: "Boiro Tenda",
    address: "Avda. Constitución, 29", city: "Boiro", cp: "15930", province: "A Coruña", region: "Galicia",
    type: "Distribuidor oficial", phone: "+34 678 076 281", email: "info@boirotenda.com",
    lat: 42.648, lon: -8.882,
  },
  {
    id: 3, name: "Santiago Criado",
    address: "Carretera de Valladolid, 113-123", city: "Villares de la Reina", cp: "37184", province: "Salamanca", region: "Castilla y León",
    type: "Distribuidor oficial", phone: "+34 923 282 349", email: "gerencia@santiagocriado.com",
    lat: 40.983, lon: -5.624,
  },
  {
    id: 4, name: "OAB 4.0 SL",
    address: "Calle General Manso, 32, Local 5", city: "Sant Feliu de Llobregat", cp: "08980", province: "Barcelona", region: "Cataluña",
    type: "Distribuidor", phone: "+34 699 44 46 49", email: "oscar@oab40.cat",
    lat: 41.380, lon: 2.045,
  },
  {
    id: 5, name: "Nahar Gres – Alcobendas",
    address: "Paseo de la Chopera, 182", city: "Alcobendas", cp: "28100", province: "Madrid", region: "Comunidad de Madrid",
    type: "Distribuidor", phone: null, email: null,
    lat: 40.547, lon: -3.639,
  },
  {
    id: 6, name: "Nahar Gres – Alcalá de Henares",
    address: "C. Valdemorillo, 7, Bajo Local 1", city: "Alcalá de Henares", cp: "28805", province: "Madrid", region: "Comunidad de Madrid",
    type: "Distribuidor", phone: "+34 918 88 10 34", email: null,
    lat: 40.482, lon: -3.360,
  },
  {
    id: 7, name: "La Flecha (Cerámicas La Flecha SL)",
    address: "Calle Caldereros, Parcela 3, Nave 7", city: "Villanubla", cp: "47620", province: "Valladolid", region: "Castilla y León",
    type: "Distribuidor", phone: null, email: null,
    lat: 41.700, lon: -4.827,
  },
  {
    id: 8, name: "Barbanza Baños",
    address: "Calle Venezuela, 60 Bajo", city: "Vigo", cp: "36204", province: "Pontevedra", region: "Galicia",
    type: "Distribuidor", phone: null, email: null,
    lat: 42.231, lon: -8.712,
  },
  {
    id: 9, name: "Materials Carmen",
    address: "Carrer de Barcelona, 455", city: "Sant Vicenç dels Horts", cp: "08620", province: "Barcelona", region: "Cataluña",
    type: "Distribuidor", phone: null, email: null,
    lat: 41.393, lon: 2.002,
  },
  {
    id: 10, name: "Pariente Ballesteros",
    address: "Calle Horno, 7", city: "El Saucejo", cp: "41650", province: "Sevilla", region: "Andalucía",
    type: "Distribuidor", phone: null, email: null,
    lat: 37.053, lon: -5.080,
  },
  {
    id: 11, name: "Almacenes Franganillo",
    address: "Carretera Páramo, s/n, Requejo de la Vega", city: "León", cp: "24240", province: "León", region: "Castilla y León",
    type: "Distribuidor", phone: null, email: null,
    lat: 42.282, lon: -5.991,
  },
  {
    id: 12, name: "TEIX Arquitectura",
    address: "Carrer de Can Granada, 9, Centre", city: "Palma", cp: "07012", province: "Illes Balears", region: "Islas Baleares",
    type: "Distribuidor / Prescriptor", phone: null, email: null,
    lat: 39.571, lon: 2.646,
  },
  {
    id: 13, name: "KASTALIA",
    address: "Av. de Buenos Aires, 33", city: "Santa Cruz de Tenerife", cp: "38003", province: "Tenerife", region: "Canarias",
    type: "Distribuidor", phone: "+34 615 38 33 22", email: null,
    lat: 28.463, lon: -16.251,
  },
  {
    id: 14, name: "Puya",
    address: "C. Polonia, 10", city: "Marbella", cp: "29670", province: "Málaga", region: "Andalucía",
    type: "Distribuidor", phone: "+34 952 78 35 40", email: null,
    lat: 36.510, lon: -4.886,
  },
];

// Coordenadas CP españoles (muestra representativa para cálculo de distancia)
// Para el cálculo real usamos la API de zippopotam.us
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Silueta simplificada de España peninsular + Baleares + Canarias (viewBox 0 0 1000 780)
const SPAIN_PENINSULA = `M 250 90 L 290 72 L 350 62 L 420 55 L 490 50 L 560 48 L 630 52 L 700 62 L 750 78 L 790 100 L 820 128 L 838 158 L 845 190 L 840 220 L 826 248 L 808 268 L 800 295 L 808 322 L 818 350 L 812 378 L 796 402 L 778 425 L 752 448 L 722 468 L 690 482 L 658 494 L 626 506 L 594 518 L 562 530 L 530 540 L 498 546 L 466 544 L 434 536 L 406 524 L 380 510 L 354 494 L 328 476 L 304 456 L 282 434 L 264 410 L 250 385 L 240 358 L 236 330 L 234 302 L 236 274 L 242 246 L 248 218 L 248 190 L 244 162 L 240 134 L 246 108 Z`;
const BALEARES_PATH = `M 768 348 L 790 338 L 820 342 L 838 356 L 834 374 L 814 382 L 790 378 L 772 364 Z`;
const CANARIAS_PATH = `M 128 672 L 158 660 L 192 658 L 218 668 L 228 684 L 220 700 L 196 710 L 166 708 L 138 696 Z M 244 674 L 272 666 L 298 670 L 312 684 L 306 698 L 282 706 L 256 702 L 240 688 Z`;

function svgPos(d: Distributor) {
  // Canarias: posición especial en el mapa
  if (d.region === "Canarias") return { x: 175, y: 685 };
  // Baleares: posición especial
  if (d.region === "Islas Baleares") return { x: 800, y: 360 };
  return gpsToSvg(d.lat, d.lon);
}

export default function SpainDistributorsMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cp, setCp] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ nearest: Distributor; km: number; cpCity: string } | null>(null);
  const [searchError, setSearchError] = useState("");
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      let p = 0;
      const iv = setInterval(() => {
        p += 3;
        setLineProgress(Math.min(p, 100));
        if (p >= 100) clearInterval(iv);
      }, 18);
      return () => clearInterval(iv);
    }, 700);
    return () => clearTimeout(t);
  }, [visible]);

  // Auto-cycle
  useEffect(() => {
    if (!visible || searchResult) return;
    let i = 0;
    const iv = setInterval(() => {
      setSelected(DISTRIBUTORS[i].id);
      i = (i + 1) % DISTRIBUTORS.length;
    }, 2000);
    return () => clearInterval(iv);
  }, [visible, searchResult]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = cp.trim().replace(/\s/g, "");
    if (cleaned.length !== 5 || !/^\d{5}$/.test(cleaned)) {
      setSearchError("Introduce un código postal válido de 5 dígitos");
      return;
    }
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/es/${cleaned}`);
      if (!res.ok) throw new Error("CP no encontrado");
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) throw new Error("CP no encontrado");
      const userLat = parseFloat(place.latitude);
      const userLon = parseFloat(place.longitude);
      const cpCity = place["place name"];

      // Calcular distancia a cada distribuidor (excluir Canarias si CP peninsular)
      const cpIsCanarias = cleaned.startsWith("35") || cleaned.startsWith("38");
      const candidates = cpIsCanarias
        ? DISTRIBUTORS.filter(d => d.region === "Canarias")
        : DISTRIBUTORS.filter(d => d.region !== "Canarias");

      let nearest = candidates[0];
      let minKm = Infinity;
      for (const d of candidates) {
        const km = haversineKm(userLat, userLon, d.lat, d.lon);
        if (km < minKm) { minKm = km; nearest = d; }
      }
      setSearchResult({ nearest, km: Math.round(minKm), cpCity });
      setSelected(nearest.id);
    } catch {
      setSearchError("No encontramos ese código postal. Inténtalo de nuevo.");
    } finally {
      setSearching(false);
    }
  }

  const activeId = hovered ?? selected;
  const activeD = activeId ? DISTRIBUTORS.find(d => d.id === activeId) : null;

  return (
    <section ref={sectionRef} className="w-full bg-background py-20 md:py-28 overflow-hidden">
      <style>{`
        @keyframes dist-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ring-pulse {
          0%   { r: 7px; opacity: 0.7; }
          80%  { r: 20px; opacity: 0; }
          100% { r: 20px; opacity: 0; }
        }
        @keyframes ring-pulse2 {
          0%   { r: 5px; opacity: 0.5; }
          80%  { r: 13px; opacity: 0; }
          100% { r: 13px; opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .dist-dot { transform-origin: center; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* Cabecera */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}
          className="mb-10 md:mb-14">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-accent-deep/70 mb-3">Red de distribución</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-foreground leading-[0.95]">
              Encuentra tu<br />distribuidor
            </h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-4xl md:text-5xl text-accent-deep leading-none">{DISTRIBUTORS.length}</p>
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-1">Distribuidores</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-display text-4xl md:text-5xl text-foreground leading-none">7</p>
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40 mt-1">Comunidades</p>
              </div>
            </div>
          </div>
          <div className="mt-5 h-px w-16 bg-accent-deep/40" />
        </div>

        {/* Buscador CP */}
        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}
          className="mb-10 md:mb-14">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="text-accent-deep">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={cp}
                onChange={e => { setCp(e.target.value.replace(/\D/g, "")); setSearchError(""); setSearchResult(null); }}
                placeholder="Introduce tu código postal"
                className="w-full pl-10 pr-4 py-3.5 bg-card border border-border text-foreground font-body text-sm placeholder:text-foreground/30 outline-none focus:border-accent-deep transition-colors duration-200"
                style={{ borderRadius: "2px" }}
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-8 py-3.5 bg-foreground text-background font-display text-[11px] uppercase tracking-[0.25em] hover:bg-accent-deep transition-colors duration-200 disabled:opacity-50 flex items-center gap-2 justify-center"
              style={{ borderRadius: "2px", minWidth: "140px" }}
            >
              {searching ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: "spin-slow 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Buscando
                </>
              ) : "Buscar"}
            </button>
          </form>
          {searchError && (
            <p className="mt-2 font-body text-[11px] text-red-500/80 tracking-wide">{searchError}</p>
          )}
          {searchResult && (
            <div className="mt-4 flex items-center gap-3 p-4 border border-accent-deep/30 bg-accent-deep/5 max-w-xl"
              style={{ borderRadius: "2px", animation: "card-in 0.4s ease both" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E87A3D", flexShrink: 0,
                boxShadow: "0 0 10px #E87A3D", animation: "ring-pulse 1.5s ease-in-out infinite" }} />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent-deep mb-0.5">
                  Distribuidor más cercano a {searchResult.cpCity}
                </p>
                <p className="font-display text-base uppercase tracking-wide text-foreground">
                  {searchResult.nearest.name}
                </p>
                <p className="font-body text-[11px] text-foreground/50 mt-0.5">
                  {searchResult.nearest.city} · {searchResult.nearest.province} · <strong className="text-accent-deep">{searchResult.km} km</strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mapa + Panel */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* SVG Mapa */}
          <div className="w-full lg:w-[58%]"
            style={{ opacity: visible ? 1 : 0, animation: visible ? "dist-fade-up 1s cubic-bezier(0.23,1,0.32,1) 0.3s both" : "none" }}>
            <svg viewBox="0 0 1000 780" className="w-full h-auto" style={{ maxHeight: "500px" }}>
              <defs>
                <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E87A3D" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#E87A3D" stopOpacity="0" />
                </radialGradient>
                <filter id="dotGlow">
                  <feGaussianBlur stdDeviation="3" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="mapShadow">
                  <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#001F3F" floodOpacity="0.25"/>
                </filter>
              </defs>

              <ellipse cx="500" cy="380" rx="400" ry="280" fill="url(#bgGlow)" />

              {/* España peninsular */}
              <path d={SPAIN_PENINSULA} fill="#001F3F" stroke="#E87A3D" strokeWidth="1.2" strokeOpacity="0.35"
                filter="url(#mapShadow)"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.2s" }} />
              {/* Baleares */}
              <path d={BALEARES_PATH} fill="#001F3F" stroke="#E87A3D" strokeWidth="1" strokeOpacity="0.3"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.4s" }} />
              {/* Canarias */}
              <path d={CANARIAS_PATH} fill="#001F3F" stroke="#E87A3D" strokeWidth="1" strokeOpacity="0.3"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.5s" }} />
              {/* Línea separadora Canarias */}
              <line x1="230" y1="650" x2="230" y2="720" stroke="#E87A3D" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3 4" />

              {/* Líneas de conexión entre distribuidores cercanos */}
              {visible && DISTRIBUTORS.filter(d => d.region !== "Canarias" && d.region !== "Islas Baleares").map((d, i) => {
                const pos = svgPos(d);
                const next = DISTRIBUTORS.filter(x => x.region !== "Canarias" && x.region !== "Islas Baleares")[(i + 1) % DISTRIBUTORS.filter(x => x.region !== "Canarias" && x.region !== "Islas Baleares").length];
                const posNext = svgPos(next);
                const len = Math.sqrt((posNext.x - pos.x) ** 2 + (posNext.y - pos.y) ** 2);
                return (
                  <line key={`line-${d.id}`}
                    x1={pos.x} y1={pos.y} x2={posNext.x} y2={posNext.y}
                    stroke="#E87A3D" strokeWidth="0.6"
                    strokeOpacity={activeId === d.id || activeId === next.id ? 0.4 : 0.08}
                    strokeDasharray={`${len} ${len}`}
                    strokeDashoffset={len * (1 - lineProgress / 100)}
                    style={{ transition: "stroke-opacity 0.4s ease" }}
                  />
                );
              })}

              {/* Puntos de distribuidores */}
              {DISTRIBUTORS.map((d, i) => {
                const pos = svgPos(d);
                const isActive = activeId === d.id;
                return (
                  <g key={d.id}
                    className="dist-dot"
                    style={{ animationDelay: `${0.5 + i * 0.1}s`, cursor: "pointer" }}
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(d.id === selected ? null : d.id)}
                  >
                    {/* Anillos pulsantes */}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 7 : 5} fill="none" stroke="#E87A3D"
                      strokeWidth={isActive ? 1.5 : 1} opacity={isActive ? 0.7 : 0.3}
                      style={{ animation: `ring-pulse ${1.6 + i * 0.15}s ease-out infinite`, animationDelay: `${i * 0.2}s` }} />
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 5 : 3.5} fill="none" stroke="#E87A3D"
                      strokeWidth="0.8" opacity={isActive ? 0.5 : 0.15}
                      style={{ animation: `ring-pulse2 ${2 + i * 0.12}s ease-out infinite`, animationDelay: `${i * 0.25 + 0.3}s` }} />
                    {/* Punto central */}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 5.5 : 3.5}
                      fill={isActive ? "#E87A3D" : "#E87A3D"}
                      opacity={isActive ? 1 : 0.65}
                      filter={isActive ? "url(#dotGlow)" : undefined}
                      style={{ transition: "all 0.3s ease" }} />
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 2.2 : 1.5} fill="white" opacity={0.9} />
                    {/* Etiqueta ciudad */}
                    <text
                      x={pos.x + (pos.x > 530 ? -9 : 9)}
                      y={pos.y - 11}
                      textAnchor={pos.x > 530 ? "end" : "start"}
                      fontSize="7.5"
                      fontFamily="'Oswald', sans-serif"
                      fontWeight="400"
                      letterSpacing="1.2"
                      fill="white"
                      opacity={isActive ? 1 : 0.45}
                      style={{ transition: "opacity 0.3s ease", pointerEvents: "none" }}
                    >
                      {d.city.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Panel lateral */}
          <div className="w-full lg:w-[42%]"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(20px)", transition: "all 0.7s ease 0.5s" }}>

            {/* Tarjeta del distribuidor activo */}
            {activeD ? (
              <div key={activeD.id} className="border border-border bg-card p-5 mb-4"
                style={{ borderRadius: "2px", animation: "card-in 0.35s ease both" }}>
                {/* Cabecera tarjeta */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E87A3D", display: "inline-block",
                        boxShadow: "0 0 8px #E87A3D" }} />
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent-deep">{activeD.type}</p>
                    </div>
                    <h3 className="font-display text-lg md:text-xl uppercase tracking-wide text-foreground leading-tight">
                      {activeD.name}
                    </h3>
                  </div>
                  <span className="font-body text-[9px] uppercase tracking-[0.2em] text-foreground/30 mt-1 text-right">
                    {activeD.region}
                  </span>
                </div>

                <div className="h-px bg-border mb-4" />

                {/* Dirección */}
                <div className="flex items-start gap-3 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="text-accent-deep/60 mt-0.5 flex-shrink-0">
                    <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="font-body text-sm text-foreground/80 leading-snug">{activeD.address}</p>
                    <p className="font-body text-sm text-foreground/60">{activeD.cp} {activeD.city}, {activeD.province}</p>
                  </div>
                </div>

                {/* Teléfono */}
                {activeD.phone && (
                  <a href={`tel:${activeD.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className="text-accent-deep/60 flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200">
                      {activeD.phone}
                    </span>
                  </a>
                )}

                {/* Email */}
                {activeD.email && (
                  <a href={`mailto:${activeD.email}`}
                    className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className="text-accent-deep/60 flex-shrink-0">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200 break-all">
                      {activeD.email}
                    </span>
                  </a>
                )}

                {/* Sin contacto */}
                {!activeD.phone && !activeD.email && (
                  <p className="font-body text-[11px] text-foreground/30 uppercase tracking-[0.15em] mb-3">
                    Contacto disponible próximamente
                  </p>
                )}

                {/* Botones acción */}
                <div className="flex gap-2 mt-4">
                  {activeD.phone && (
                    <a href={`tel:${activeD.phone.replace(/\s/g, "")}`}
                      className="flex-1 py-2.5 bg-foreground text-background font-display text-[10px] uppercase tracking-[0.2em] text-center hover:bg-accent-deep transition-colors duration-200"
                      style={{ borderRadius: "2px" }}>
                      Llamar
                    </a>
                  )}
                  {activeD.email && (
                    <a href={`mailto:${activeD.email}`}
                      className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200"
                      style={{ borderRadius: "2px" }}>
                      Email
                    </a>
                  )}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(activeD.address + ", " + activeD.city)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200"
                    style={{ borderRadius: "2px" }}>
                    Cómo llegar
                  </a>
                </div>
              </div>
            ) : (
              <div className="border border-border bg-card p-6 mb-4 flex flex-col items-center justify-center gap-3 opacity-40"
                style={{ borderRadius: "2px", minHeight: "160px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className="text-foreground/40">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-center">
                  Introduce tu CP o<br />selecciona un punto
                </p>
              </div>
            )}

            {/* Lista compacta */}
            <div className="border border-border bg-card overflow-hidden" style={{ borderRadius: "2px" }}>
              <div className="px-4 py-3 border-b border-border">
                <p className="font-body text-[9px] uppercase tracking-[0.3em] text-foreground/40">Todos los distribuidores</p>
              </div>
              <div className="divide-y divide-border max-h-[280px] overflow-y-auto">
                {DISTRIBUTORS.map((d, i) => (
                  <button key={d.id}
                    onClick={() => setSelected(d.id === selected ? null : d.id)}
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150"
                    style={{
                      background: activeId === d.id ? "rgba(232,122,61,0.06)" : "transparent",
                      borderLeft: selected === d.id ? "2px solid #E87A3D" : "2px solid transparent",
                      opacity: visible ? 1 : 0,
                      transition: "all 0.2s ease, opacity 0.5s ease",
                      transitionDelay: `${0.6 + i * 0.04}s`,
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                      background: selected === d.id ? "#E87A3D" : "rgba(232,122,61,0.35)",
                      boxShadow: selected === d.id ? "0 0 6px #E87A3D" : "none",
                      transition: "all 0.3s ease" }} />
                    <span className="font-display text-[10px] uppercase tracking-[0.18em] flex-1 text-left"
                      style={{ color: selected === d.id ? "var(--foreground)" : "rgba(0,31,63,0.6)" }}>
                      {d.name}
                    </span>
                    <span className="font-body text-[9px] uppercase tracking-[0.1em] text-foreground/25 flex-shrink-0">
                      {d.province}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
                ¿Quieres ser distribuidor?
              </p>
              <a href="#contacto"
                className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-accent-deep hover:text-foreground transition-colors duration-200">
                Contactar <span style={{ fontSize: 10 }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
