import { useEffect, useRef, useState } from "react";

const teamMembers = [
  {
    name: "Eloy Ramos",
    role: "Cofundador y Director de Producto",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m1-3NRdKwH8BiRuSz58zowsUU.webp",
  },
  {
    name: "Marta Rama",
    role: "Cofundadora y Directora de Marketing",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m2-V2nxMUpmGiciBeF2Bt5tBc.webp",
  },
  {
    name: "Alejandro Rodriguez",
    role: "Director de Expansión Comercial",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m3-2pafZmtLHgvxqQ4JdZGe4P.webp",
  },
  {
    name: "Rubén Beiroa",
    role: "Responsable de Ingeniería y Desarrollo",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m4-ev5Uf3wMMPUdyQYu2hnKgj.webp",
  },
  {
    name: "César Juncal",
    role: "Técnico Especialista de Producto",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m5-GXVFsaGGpa662S8fB2ZBPs.webp",
  },
  {
    name: "Jesús Fernandez",
    role: "Responsable Técnico Nacional",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m6-6tqjEN7P8KgrfTrfLp7nai.webp",
  },
  {
    name: "Uxia Tarrío",
    role: "Responsable de Ventas Península Ibérica",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_f1-NKED4ykAPKCppJXk3zGEiR.webp",
  },
  {
    name: "Raul Plaza",
    role: "Responsable de Ventas Sur de España",
    photo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455453024/U6TuTW84Fsnjnw5Ltb3Zs4/team_m7-GECT5oegAHHkRvrxpkBsfz.webp",
  },
];

function TeamCard({
  member,
  index,
  isVisible,
}: {
  member: (typeof teamMembers)[0];
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 60}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 60}ms`,
      }}
    >
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          border: "1px solid rgba(201,169,110,0.15)",
          position: "relative",
        }}
      >
        {/* Foto */}
        <div style={{ position: "relative", paddingBottom: "110%", overflow: "hidden" }}>
          <img
            src={member.photo}
            alt={member.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(15%)",
            }}
          />

          {/* Overlay blur "Próximamente" — cubre toda la foto */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.45)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {/* Punto pulsante dorado */}
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#c9a96e",
                display: "block",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            {/* Texto */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#8a6d3b",
                textTransform: "uppercase",
                fontFamily: "inherit",
                textAlign: "center",
                padding: "0 8px",
              }}
            >
              Próximamente
            </span>
            {/* Línea dorada */}
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div
          style={{
            padding: "14px 16px 16px",
            background: "#fff",
            borderTop: "1px solid rgba(201,169,110,0.12)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "0.01em",
              lineHeight: 1.25,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {member.name}
          </p>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: "11px",
              fontWeight: 500,
              color: "#c9a96e",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              lineHeight: 1.4,
            }}
          >
            {member.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(180deg, #faf8f5 0%, #f4f1ec 100%)",
        padding: "80px 0 90px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
          50% { opacity: 0.7; transform: scale(0.85); box-shadow: 0 0 0 6px rgba(201,169,110,0); }
        }
      `}</style>

      {/* Detalle decorativo superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
        }}
      />

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 24px" }}>
        {/* Cabecera */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "56px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div style={{ width: "36px", height: "1px", background: "#c9a96e", opacity: 0.5 }} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#c9a96e",
                textTransform: "uppercase",
              }}
            >
              Las personas detrás de ELORA
            </span>
            <div style={{ width: "36px", height: "1px", background: "#c9a96e", opacity: 0.5 }} />
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 12px",
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.15,
            }}
          >
            Nuestro Equipo
          </h2>

          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
              margin: "0 auto 16px",
            }}
          />

          <p
            style={{
              fontSize: "15px",
              color: "#666",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Un equipo apasionado por transformar la experiencia del baño en algo extraordinario.
          </p>
        </div>

        {/* Grid de tarjetas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {teamMembers.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} isVisible={isVisible} />
          ))}
        </div>

        {/* Nota pie */}
        <p
          style={{
            textAlign: "center",
            marginTop: "44px",
            fontSize: "12px",
            color: "#c9a96e",
            letterSpacing: "0.1em",
            fontStyle: "italic",
            opacity: isVisible ? 0.8 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          Fotos reales del equipo — próximamente
        </p>
      </div>

      {/* Detalle decorativo inferior */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
        }}
      />
    </section>
  );
}
