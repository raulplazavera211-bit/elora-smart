// ─── AdminLayout — Panel de administración Elora Smart ───────────────────────
// Sidebar con navegación completa al estilo WooCommerce.
// Requiere rol admin; redirige al login si no autenticado.

import AdminLogin from "@/pages/AdminLogin";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Star,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
  Tag,
  Megaphone,
  Images,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "/manus-storage/elora_200_daf8d186.png";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Productos", path: "/admin/productos" },
  { icon: ShoppingCart, label: "Pedidos", path: "/admin/pedidos" },
  { icon: Users, label: "Clientes", path: "/admin/clientes" },
  { icon: Mail, label: "Contactos", path: "/admin/contactos" },
  { icon: Star, label: "Club Elora", path: "/admin/club-elora" },
  { icon: CreditCard, label: "Pagos", path: "/admin/pagos" },
  { icon: Tag, label: "Cupones", path: "/admin/cupones" },
  { icon: Megaphone, label: "Popups", path: "/admin/popups" },
  { icon: Images, label: "Experiencia", path: "/admin/experiencia" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { data: adminUser, isLoading } = trpc.auth.adminMe.useQuery();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/admin";
    },
    onError: () => {
      toast.error("Error al cerrar sesión");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-deep border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-foreground/40 uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin />;
  }

  const activeItem = NAV_ITEMS.find(item =>
    item.path === "/admin" ? location === "/admin" : location.startsWith(item.path)
  );

  const Sidebar = () => (
    <aside className="w-64 h-full bg-[#0A0A0A] border-r border-white/8 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8">
        <Link href="/" className="block">
          <img
            src={LOGO_URL}
            alt="Elora Smart"
            className="h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="font-body text-[9px] uppercase tracking-[0.4em] text-white/30 mt-2">Panel de administración</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === "/admin" ? location === "/admin" : location.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-accent-deep/20 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent-deep" : ""}`} />
                  <span className="font-body text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-accent-deep/60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent-deep/20 flex items-center justify-center text-accent-deep font-bold text-sm shrink-0">
            {adminUser.email?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs text-white/70 truncate">Administrador</p>
            <p className="font-body text-[10px] text-white/30 truncate">{adminUser.email ?? ""}</p>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="font-body text-sm">Cerrar sesión</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all mt-0.5"
        >
          <span className="font-body text-sm">← Ver web</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background flex items-center px-6 gap-4 shrink-0">
          <button
            className="md:hidden text-foreground/60 hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {activeItem && (
              <>
                <activeItem.icon className="w-4 h-4 text-foreground/40" />
                <h1 className="font-body text-sm font-medium text-foreground">
                  {title ?? activeItem.label}
                </h1>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" className="font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors hidden md:block">
              Ver web →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
