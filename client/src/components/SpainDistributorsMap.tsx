import { useEffect, useRef, useState } from "react";

// ViewBox del SVG real: 0 0 960 700
// Límites geográficos usados en la proyección: lon [-18.2, 4.4], lat [27.6, 43.8]
const VW = 960, VH = 700;
// ViewBox por defecto con zoom: recorta márgenes para que España ocupe más pantalla
const DEFAULT_VB = "240 -100 700 500";
const LON_MIN = -18.2, LON_MAX = 4.4;
const LAT_MIN = 27.6, LAT_MAX = 43.8;

function gpsToSvg(lat: number, lon: number) {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * VW;
  const y = (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * VH;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
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
  { id: 1,  name: "Almacenes Mariña Gamma",           address: "Travesía de Montouto, 11",              city: "Teo",                    cp: "15883", province: "A Coruña",        region: "Galicia",              type: "Distribuidor oficial",       phone: null,              email: "administracion@almacenesmarina.com", lat: 42.836, lon: -8.571 },
  { id: 2,  name: "Boiro Tenda",                       address: "Avda. Constitución, 29",                city: "Boiro",                  cp: "15930", province: "A Coruña",        region: "Galicia",              type: "Distribuidor oficial",       phone: "+34 678 076 281", email: "info@boirotenda.com",               lat: 42.648, lon: -8.882 },
  { id: 3,  name: "Santiago Criado",                   address: "Carretera de Valladolid, 113-123",      city: "Villares de la Reina",   cp: "37184", province: "Salamanca",       region: "Castilla y León",      type: "Distribuidor oficial",       phone: "+34 923 282 349", email: "gerencia@santiagocriado.com",       lat: 40.983, lon: -5.624 },
  { id: 4,  name: "OAB 4.0 SL",                        address: "Calle General Manso, 32, Local 5",      city: "Sant Feliu de Llobregat",cp: "08980", province: "Barcelona",       region: "Cataluña",             type: "Distribuidor",               phone: "+34 699 44 46 49",email: "oscar@oab40.cat",                  lat: 41.380, lon: 2.045  },
  { id: 5,  name: "Nahar Gres – Alcobendas",           address: "Paseo de la Chopera, 182",              city: "Alcobendas",             cp: "28100", province: "Madrid",          region: "Comunidad de Madrid",  type: "Distribuidor",               phone: null,              email: null,                                lat: 40.547, lon: -3.639 },
  { id: 6,  name: "Nahar Gres – Alcalá de Henares",   address: "C. Valdemorillo, 7, Bajo Local 1",      city: "Alcalá de Henares",      cp: "28805", province: "Madrid",          region: "Comunidad de Madrid",  type: "Distribuidor",               phone: "+34 918 88 10 34",email: null,                                lat: 40.482, lon: -3.360 },
  { id: 7,  name: "La Flecha (Cerámicas La Flecha)",   address: "Calle Caldereros, Parcela 3, Nave 7",   city: "Villanubla",             cp: "47620", province: "Valladolid",      region: "Castilla y León",      type: "Distribuidor",               phone: null,              email: null,                                lat: 41.700, lon: -4.827 },
  { id: 8,  name: "Barbanza Baños",                    address: "Calle Venezuela, 60 Bajo",              city: "Vigo",                   cp: "36204", province: "Pontevedra",      region: "Galicia",              type: "Distribuidor",               phone: null,              email: null,                                lat: 42.231, lon: -8.712 },
  { id: 9,  name: "Materials Carmen",                  address: "Carrer de Barcelona, 455",              city: "Sant Vicenç dels Horts", cp: "08620", province: "Barcelona",       region: "Cataluña",             type: "Distribuidor",               phone: null,              email: null,                                lat: 41.393, lon: 2.002  },
  { id: 10, name: "Pariente Ballesteros",               address: "Calle Horno, 7",                        city: "El Saucejo",             cp: "41650", province: "Sevilla",         region: "Andalucía",            type: "Distribuidor",               phone: null,              email: null,                                lat: 37.053, lon: -5.080 },
  { id: 11, name: "Almacenes Franganillo",              address: "Carretera Páramo, s/n, Requejo de la Vega", city: "León",              cp: "24240", province: "León",            region: "Castilla y León",      type: "Distribuidor",               phone: null,              email: null,                                lat: 42.282, lon: -5.991 },
  { id: 12, name: "TEIX Arquitectura",                  address: "Carrer de Can Granada, 9, Centre",     city: "Palma",                  cp: "07012", province: "Illes Balears",   region: "Islas Baleares",       type: "Distribuidor / Prescriptor", phone: null,              email: null,                                lat: 39.571, lon: 2.646  },
  { id: 13, name: "KASTALIA",                           address: "Av. de Buenos Aires, 33",               city: "Santa Cruz de Tenerife", cp: "38003", province: "Tenerife",        region: "Canarias",             type: "Distribuidor",               phone: "+34 615 38 33 22",email: null,                                lat: 28.463, lon: -16.251},
  { id: 14, name: "Puya",                               address: "C. Polonia, 10",                        city: "Marbella",               cp: "29670", province: "Málaga",          region: "Andalucía",            type: "Distribuidor",               phone: "+34 952 78 35 40",email: null,                                lat: 36.510, lon: -4.886 },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function SpainDistributorsMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [cp, setCp] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ nearest: Distributor; km: number; cpCity: string } | null>(null);
  const [searchError, setSearchError] = useState("");
  const [svgPaths, setSvgPaths] = useState<{ region: string; d: string }[]>([]);
  // Zoom animado: viewBox del SVG
  const [viewBox, setViewBox] = useState(DEFAULT_VB);
  const viewBoxRef = useRef(DEFAULT_VB);
  const animFrameRef = useRef<number | null>(null);

  // Cargar SVG real de España
  useEffect(() => {
    fetch("/manus-storage/spain-real_4ad50a1c.svg")
      .then(r => r.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const paths = Array.from(doc.querySelectorAll("path")).map(p => ({
          region: p.getAttribute("data-region") || "",
          d: p.getAttribute("d") || "",
        }));
        setSvgPaths(paths);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle
  useEffect(() => {
    if (!visible || searchResult) return;
    let i = 0;
    const iv = setInterval(() => { setSelected(DISTRIBUTORS[i].id); i = (i + 1) % DISTRIBUTORS.length; }, 2200);
    return () => clearInterval(iv);
  }, [visible, searchResult]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = cp.trim().replace(/\s/g, "");
    if (!/^\d{5}$/.test(cleaned)) { setSearchError("Introduce un código postal válido de 5 dígitos"); return; }
    setSearching(true); setSearchError(""); setSearchResult(null);
    try {
      const res = await fetch(`https://api.zippopotam.us/es/${cleaned}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) throw new Error();
      const userLat = parseFloat(place.latitude);
      const userLon = parseFloat(place.longitude);
      const cpCity = place["place name"];
      const cpIsCanarias = cleaned.startsWith("35") || cleaned.startsWith("38");
      const candidates = cpIsCanarias ? DISTRIBUTORS.filter(d => d.region === "Canarias") : DISTRIBUTORS.filter(d => d.region !== "Canarias");
      let nearest = candidates[0]; let minKm = Infinity;
      for (const d of candidates) { const km = haversineKm(userLat, userLon, d.lat, d.lon); if (km < minKm) { minKm = km; nearest = d; } }
      setSearchResult({ nearest, km: Math.round(minKm), cpCity });
      setSelected(nearest.id);
      // Zoom animado al distribuidor más cercano
      const targetPos = gpsToSvg(nearest.lat, nearest.lon);
      const zoomW = 280, zoomH = 200;
      const targetVB = `${targetPos.x - zoomW / 2} ${targetPos.y - zoomH / 2} ${zoomW} ${zoomH}`;
      animateViewBox(viewBoxRef.current, targetVB, 900);
    } catch { setSearchError("No encontramos ese código postal. Inténtalo de nuevo."); }
    finally { setSearching(false); }
  }

  const activeId = hovered ?? selected;
  const activeD = activeId ? DISTRIBUTORS.find(d => d.id === activeId) : null;

  // Función de zoom animado con lerp
  function animateViewBox(from: string, to: string, duration: number) {
    const parseVB = (s: string) => s.split(' ').map(Number);
    const [fx, fy, fw, fh] = parseVB(from);
    const [tx, ty, tw, th] = parseVB(to);
    const start = performance.now();
    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    function step(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const e = ease(t);
      const vb = `${fx + (tx - fx) * e} ${fy + (ty - fy) * e} ${fw + (tw - fw) * e} ${fh + (th - fh) * e}`;
      viewBoxRef.current = vb;
      setViewBox(vb);
      if (t < 1) animFrameRef.current = requestAnimationFrame(step);
    }
    animFrameRef.current = requestAnimationFrame(step);
  }

  // Reset zoom al limpiar búsqueda
  function resetZoom() {
    animateViewBox(viewBoxRef.current, DEFAULT_VB, 700);
  }

  // Región activa para resaltar en el mapa
  const activeRegion = activeD?.region;
  const regionMap: Record<string, string> = {
    "Galicia": "Galicia", "Castilla y León": "Castilla-Leon", "Cataluña": "Cataluña",
    "Comunidad de Madrid": "Madrid", "Andalucía": "Andalucia", "Islas Baleares": "Baleares",
    "Canarias": "Canarias",
  };

  return (
    <section ref={sectionRef} className="w-full bg-background py-20 md:py-28 overflow-hidden">
      <style>{`
        @keyframes dist-fade-up { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dot-pop { 0% { transform:scale(0); opacity:0; } 70% { transform:scale(1.3); } 100% { transform:scale(1); opacity:1; } }
        @keyframes ring-out { 0% { r:5px; opacity:0.8; } 80% { r:22px; opacity:0; } 100% { r:22px; opacity:0; } }
        @keyframes ring-out2 { 0% { r:4px; opacity:0.5; } 80% { r:14px; opacity:0; } 100% { r:14px; opacity:0; } }
        @keyframes card-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .dist-dot { transform-origin: center; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .spain-region { transition: fill 0.35s ease, opacity 0.35s ease; }
        .spain-region:hover { cursor: pointer; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Cabecera */}
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }} className="mb-10 md:mb-14">
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
        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }} className="mb-10 md:mb-14">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-deep">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text" inputMode="numeric" maxLength={5} value={cp}
                onChange={e => { setCp(e.target.value.replace(/\D/g, "")); setSearchError(""); setSearchResult(null); resetZoom(); }}
                placeholder="Introduce tu código postal"
                className="w-full pl-10 pr-4 py-3.5 bg-card border border-border text-foreground font-body text-sm placeholder:text-foreground/30 outline-none focus:border-accent-deep transition-colors duration-200"
                style={{ borderRadius: "2px" }}
              />
            </div>
            <button type="submit" disabled={searching}
              className="px-8 py-3.5 bg-foreground text-background font-display text-[11px] uppercase tracking-[0.25em] hover:bg-accent-deep transition-colors duration-200 disabled:opacity-50 flex items-center gap-2 justify-center"
              style={{ borderRadius: "2px", minWidth: "140px" }}>
              {searching ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Buscando</>
              ) : "Buscar"}
            </button>
          </form>
          {searchError && <p className="mt-2 font-body text-[11px] text-red-500/80 tracking-wide">{searchError}</p>}
          {searchResult && (
            <div className="mt-4 flex items-center gap-3 p-4 border border-accent-deep/30 bg-accent-deep/5 max-w-xl" style={{ borderRadius: "2px", animation: "card-in 0.4s ease both" }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#E87A3D", flexShrink:0, boxShadow:"0 0 10px #E87A3D" }} />
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent-deep mb-0.5">Distribuidor más cercano a {searchResult.cpCity}</p>
                <p className="font-display text-base uppercase tracking-wide text-foreground">{searchResult.nearest.name}</p>
                <p className="font-body text-[11px] text-foreground/50 mt-0.5">{searchResult.nearest.city} · {searchResult.nearest.province} · <strong className="text-accent-deep">{searchResult.km} km</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* Mapa + Panel */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* SVG Mapa real de España */}
          <div className="w-full lg:w-[65%]"
            style={{ opacity: visible ? 1 : 0, animation: visible ? "dist-fade-up 1s cubic-bezier(0.23,1,0.32,1) 0.3s both" : "none" }}>
            <svg viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: "720px", transition: "none" }}>
              <defs>
                <filter id="dotGlow2">
                  <feGaussianBlur stdDeviation="3" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="mapShadow2">
                  <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#001F3F" floodOpacity="0.2"/>
                </filter>
              </defs>

              {/* Comunidades autónomas reales */}
              {svgPaths.map(({ region, d }) => {
                const svgRegion = regionMap[activeRegion || ""] || "";
                const isActive = svgRegion && region === svgRegion;
                return (
                  <path
                    key={region}
                    d={d}
                    className="spain-region"
                    fill={isActive ? "rgba(232,122,61,0.18)" : "#001F3F"}
                    stroke="#E87A3D"
                    strokeWidth={isActive ? "1.5" : "0.8"}
                    strokeOpacity={isActive ? 0.6 : 0.25}
                    filter="url(#mapShadow2)"
                  />
                );
              })}

              {/* Puntos de distribuidores */}
              {DISTRIBUTORS.map((d, i) => {
                const pos = gpsToSvg(d.lat, d.lon);
                const isActive = activeId === d.id;
                return (
                  <g key={d.id}
                    className="dist-dot"
                    style={{ animationDelay: `${0.6 + i * 0.08}s`, cursor: "pointer" }}
                    onMouseEnter={() => setHovered(d.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(d.id === selected ? null : d.id)}
                  >
                    {/* Anillos pulsantes */}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 7 : 5} fill="none" stroke="#E87A3D"
                      strokeWidth={isActive ? 1.5 : 1} opacity={isActive ? 0.7 : 0.3}
                      style={{ animation: `ring-out ${1.6 + i * 0.15}s ease-out infinite`, animationDelay: `${i * 0.2}s` }} />
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 5 : 3.5} fill="none" stroke="#E87A3D"
                      strokeWidth="0.8" opacity={isActive ? 0.45 : 0.12}
                      style={{ animation: `ring-out2 ${2 + i * 0.12}s ease-out infinite`, animationDelay: `${i * 0.25 + 0.3}s` }} />
                    {/* Punto central */}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 5.5 : 3.5}
                      fill="#E87A3D" opacity={isActive ? 1 : 0.7}
                      filter={isActive ? "url(#dotGlow2)" : undefined}
                      style={{ transition: "all 0.3s ease" }} />
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 2.2 : 1.5} fill="white" opacity={0.9} />
                    {/* Etiqueta */}
                    <text
                      x={pos.x + (pos.x > VW / 2 ? -9 : 9)}
                      y={pos.y - 10}
                      textAnchor={pos.x > VW / 2 ? "end" : "start"}
                      fontSize="7" fontFamily="'Oswald', sans-serif" fontWeight="400" letterSpacing="1.2"
                      fill="white" opacity={isActive ? 1 : 0.45}
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
          <div className="w-full lg:w-[35%]"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(20px)", transition: "all 0.7s ease 0.5s" }}>

            {/* Tarjeta distribuidor activo */}
            {activeD ? (
              <div key={activeD.id} className="border border-border bg-card p-5 mb-4"
                style={{ borderRadius: "2px", animation: "card-in 0.35s ease both" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ width:7, height:7, borderRadius:"50%", background:"#E87A3D", display:"inline-block", boxShadow:"0 0 8px #E87A3D" }} />
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-accent-deep">{activeD.type}</p>
                    </div>
                    <h3 className="font-display text-lg md:text-xl uppercase tracking-wide text-foreground leading-tight">{activeD.name}</h3>
                  </div>
                  <span className="font-body text-[9px] uppercase tracking-[0.2em] text-foreground/30 mt-1 text-right">{activeD.region}</span>
                </div>
                <div className="h-px bg-border mb-4" />
                {/* Dirección */}
                <div className="flex items-start gap-3 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 mt-0.5 flex-shrink-0">
                    <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="font-body text-sm text-foreground/80 leading-snug">{activeD.address}</p>
                    <p className="font-body text-sm text-foreground/60">{activeD.cp} {activeD.city}, {activeD.province}</p>
                  </div>
                </div>
                {/* Teléfono */}
                {activeD.phone && (
                  <a href={`tel:${activeD.phone.replace(/\s/g,"")}`} className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200">{activeD.phone}</span>
                  </a>
                )}
                {/* Email */}
                {activeD.email && (
                  <a href={`mailto:${activeD.email}`} className="flex items-center gap-3 mb-3 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-deep/60 flex-shrink-0">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span className="font-body text-sm text-foreground/80 group-hover:text-accent-deep transition-colors duration-200 break-all">{activeD.email}</span>
                  </a>
                )}
                {!activeD.phone && !activeD.email && (
                  <p className="font-body text-[11px] text-foreground/30 uppercase tracking-[0.15em] mb-3">Contacto disponible próximamente</p>
                )}
                {/* Botones */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {activeD.phone && (
                    <a href={`tel:${activeD.phone.replace(/\s/g,"")}`}
                      className="flex-1 py-2.5 bg-foreground text-background font-display text-[10px] uppercase tracking-[0.2em] text-center hover:bg-accent-deep transition-colors duration-200 min-w-[80px]"
                      style={{ borderRadius:"2px" }}>Llamar</a>
                  )}
                  {activeD.email && (
                    <a href={`mailto:${activeD.email}`}
                      className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200 min-w-[80px]"
                      style={{ borderRadius:"2px" }}>Email</a>
                  )}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(activeD.address+", "+activeD.city)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 border border-border text-foreground font-display text-[10px] uppercase tracking-[0.2em] text-center hover:border-accent-deep hover:text-accent-deep transition-colors duration-200 min-w-[80px]"
                    style={{ borderRadius:"2px" }}>Cómo llegar</a>
                </div>
              </div>
            ) : (
              <div className="border border-border bg-card p-6 mb-4 flex flex-col items-center justify-center gap-3 opacity-40"
                style={{ borderRadius:"2px", minHeight:"160px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40 text-center">Introduce tu CP o<br/>selecciona un punto</p>
              </div>
            )}

            {/* Lista */}
            <div className="border border-border bg-card overflow-hidden" style={{ borderRadius:"2px" }}>
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
                    }}>
                    <span style={{ width:5, height:5, borderRadius:"50%", flexShrink:0,
                      background: selected === d.id ? "#E87A3D" : "rgba(232,122,61,0.35)",
                      boxShadow: selected === d.id ? "0 0 6px #E87A3D" : "none",
                      transition: "all 0.3s ease" }} />
                    <span className="font-display text-[10px] uppercase tracking-[0.18em] flex-1 text-left"
                      style={{ color: selected === d.id ? "var(--foreground)" : "rgba(0,31,63,0.6)" }}>
                      {d.name}
                    </span>
                    <span className="font-body text-[9px] uppercase tracking-[0.1em] text-foreground/25 flex-shrink-0">{d.province}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">¿Quieres ser distribuidor?</p>
              <a href="#contacto" className="inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-accent-deep hover:text-foreground transition-colors duration-200">
                Contactar <span style={{ fontSize:10 }}>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
