import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Coleccion from "./pages/Coleccion";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminContactos from "./pages/admin/AdminContactos";
import AdminClubElora from "./pages/admin/AdminClubElora";
import AdminPagos from "./pages/admin/AdminPagos";
import AdminCupones from "./pages/admin/AdminCupones";
import PagoOk from "./pages/PagoOk";
import PagoKo from "./pages/PagoKo";
import { ChatBot } from "./components/ChatBot";
import PromoPopup from "./components/PromoPopup";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { useEffect, useRef, useState } from "react";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";
const HERO_VIDEO = "/manus-storage/elora-hero-drone-trimmed_8ab79e91.mp4";

// Duración del contador: 12 horas en ms
const COUNTDOWN_DURATION_MS = 12 * 60 * 60 * 1000;
// Versión del contador — al cambiar este valor se fuerza reset en todos los visitantes
const COUNTDOWN_VERSION = "v3";

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedVersion = localStorage.getItem("elora_countdown_version");
    const stored = localStorage.getItem("elora_countdown_end");
    // Si la versión cambió, resetear el contador
    if (stored && storedVersion === COUNTDOWN_VERSION) {
      const end = parseInt(stored, 10);
      const diff = end - Date.now();
      return diff > 0 ? diff : 0;
    }
    const end = Date.now() + COUNTDOWN_DURATION_MS;
    localStorage.setItem("elora_countdown_end", String(end));
    localStorage.setItem("elora_countdown_version", COUNTDOWN_VERSION);
    return COUNTDOWN_DURATION_MS;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const stored = localStorage.getItem("elora_countdown_end");
      if (stored) {
        const diff = parseInt(stored, 10) - Date.now();
        setTimeLeft(diff > 0 ? diff : 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
  const seconds = String(Math.floor((timeLeft % (1000 * 60)) / 1000)).padStart(2, "0");

  return { hours, minutes, seconds, done: timeLeft <= 0 };
}

function ComingSoon() {
  const { hours, minutes, seconds, done } = useCountdown();
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden bg-black">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      {/* Gradiente oscuro encima del video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      {/* Línea superior decorativa */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-10 px-6 md:px-8 text-center max-w-3xl w-full">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 md:gap-3">
          <img
            src={LOGO_URL}
            alt="Elora Smart"
            className="h-10 md:h-16 w-auto"
            style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 20px rgba(245,164,91,0.4))" }}
          />
          <p
            className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] md:tracking-[0.6em] text-amber-400/70"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Smart · Est. Galicia 2024
          </p>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 w-full max-w-[200px] md:max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/40" />
          <div className="w-1 h-1 rounded-full bg-amber-500/60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>

        {/* Título principal */}
        <div>
          <p
            className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-amber-400/80 mb-3 md:mb-5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Algo extraordinario está a punto de llegar
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl uppercase text-white leading-tight md:leading-none mb-3 md:mb-5"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 200,
              letterSpacing: "0.08em",
              textShadow: "0 0 60px rgba(245,164,91,0.15)",
            }}
          >
            {done ? "Ya estamos aquí" : "Próximamente"}
          </h1>
          <p
            className="text-white/50 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase leading-relaxed max-w-xs md:max-w-md mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Estamos ultimando los últimos detalles<br className="hidden md:block" />
            {" "}para ofrecerte la experiencia Elora que mereces.
          </p>
        </div>

        {/* Cuenta atrás */}
        {!done && (
          <div className="flex items-end gap-2 md:gap-3">
            {[{ val: hours, label: "Horas" }, { val: minutes, label: "Min" }, { val: seconds, label: "Seg" }].map(
              (item, i) => (
                <div key={item.label} className="flex items-end gap-2 md:gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: "clamp(72px, 22vw, 100px)",
                        height: "clamp(72px, 22vw, 100px)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(245,164,91,0.25)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <span
                        className="text-3xl sm:text-4xl md:text-5xl text-white tabular-nums"
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          fontWeight: 200,
                          letterSpacing: "0.05em",
                          textShadow: "0 0 30px rgba(245,164,91,0.3)",
                        }}
                      >
                        {item.val}
                      </span>
                    </div>
                    <p
                      className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-amber-400/50 mt-2"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {item.label}
                    </p>
                  </div>
                  {i < 2 && (
                    <span
                      className="text-xl md:text-3xl text-amber-500/40 mb-9"
                      style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 200 }}
                    >
                      :
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Separador inferior */}
        <div className="flex items-center gap-4 w-full max-w-[200px] md:max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/30" />
          <div className="w-1 h-1 rounded-full bg-amber-500/40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/30" />
        </div>

        {/* Tagline inferior */}
        <p
          className="text-white/20 text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          elorasmart.online · Bertamiráns, Galicia
        </p>
      </div>

      {/* Línea inferior decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <PromoPopup />
    </div>
  );
}

/**
 * Rutas visibles en móvil (la web pública).
 * En escritorio se muestra la pantalla "Próximamente" en su lugar.
 */
function MobileRouter() {
  return (
    <>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/coleccion"} component={Coleccion} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <ChatBot />
      <PromoPopup />
    </>
  );
}

/**
 * Wrapper que decide qué mostrar según la ruta actual.
 * - /admin → siempre se muestra el panel de admin
 * - /pago/* → páginas de retorno de Redsys
 * - Cualquier otra ruta → pantalla "Próximamente" en todos los dispositivos
 */
function AppRouter() {
  const [location] = useLocation();
  const isAdmin = location === "/admin" || location.startsWith("/admin/");
  const isPago = location.startsWith("/pago/");

  // Las páginas de retorno de Redsys son accesibles desde cualquier dispositivo
  if (isPago) {
    return (
      <Switch>
        <Route path="/pago/ok" component={PagoOk} />
        <Route path="/pago/ko" component={PagoKo} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/productos" component={AdminProductos} />
        <Route path="/admin/pedidos/:id" component={AdminPedidos} />
        <Route path="/admin/pedidos" component={AdminPedidos} />
        <Route path="/admin/clientes" component={AdminClientes} />
        <Route path="/admin/contactos" component={AdminContactos} />
        <Route path="/admin/club-elora" component={AdminClubElora} />
        <Route path="/admin/pagos" component={AdminPagos} />
        <Route path="/admin/cupones" component={AdminCupones} />
        {/* Legacy admin (fallback) */}
        <Route path="/admin/legacy" component={Admin} />
        <Route component={AdminDashboard} />
      </Switch>
    );
  }

  // Mostrar la web completa
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/coleccion" component={Coleccion} />
        <Route path="/pago/ok" component={PagoOk} />
        <Route path="/pago/ko" component={PagoKo} />
        <Route component={NotFound} />
      </Switch>
      <ChatBot />
      <PromoPopup />
      <WhatsAppButton />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
