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
import PagoOk from "./pages/PagoOk";
import PagoKo from "./pages/PagoKo";

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";

function ComingSoonDesktop() {
  return (
    <div
      className="hidden md:flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        background: "#0a0a0a",
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,164,91,0.08) 0%, transparent 70%)",
      }}
    >
      <div className="flex flex-col items-center gap-8 px-8 text-center">
        <img src={LOGO_URL} alt="Elora Smart" className="h-14 w-auto brightness-0 invert opacity-90" />
        <div className="w-16 h-px bg-amber-500/60" />
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.5em] text-amber-500/80 mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Versión escritorio
          </p>
          <h1
            className="text-5xl md:text-7xl uppercase tracking-wide text-white leading-none mb-4"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 300 }}
          >
            Próximamente
          </h1>
          <p
            className="text-white/40 text-sm tracking-widest uppercase"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Mientras tanto, visítanos desde tu móvil.
          </p>
        </div>
        <div className="w-16 h-px bg-amber-500/60" />
        <p
          className="text-white/20 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          elorasmart.com
        </p>
      </div>
    </div>
  );
}

/**
 * Rutas visibles en móvil (la web pública).
 * En escritorio se muestra la pantalla "Próximamente" en su lugar.
 */
function MobileRouter() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/coleccion"} component={Coleccion} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Wrapper que decide qué mostrar según la ruta actual.
 * - /admin → siempre se muestra el panel de admin (sin el bloqueo de escritorio)
 * - Cualquier otra ruta → pantalla "Próximamente" en escritorio, web completa en móvil
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
        {/* Legacy admin (fallback) */}
        <Route path="/admin/legacy" component={Admin} />
        <Route component={AdminDashboard} />
      </Switch>
    );
  }

  return (
    <>
      {/* Desktop: pantalla Próximamente */}
      <ComingSoonDesktop />
      {/* Móvil: web completa */}
      <div className="md:hidden">
        <MobileRouter />
      </div>
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
