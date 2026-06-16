// ─── AdminDashboard — Panel principal ────────────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  ShoppingCart, Package, Users, Mail, Star, TrendingUp,
  ArrowRight, Loader2, AlertCircle, Zap
} from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-cyan-500/20 text-cyan-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminDashboard() {
  const stats = trpc.admin.getDashboardStats.useQuery();
  const recentOrders = trpc.admin.getOrders.useQuery();
  const seedProducts = trpc.admin.seedProducts.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      stats.refetch();
    },
    onError: () => toast.error("Error al sembrar productos"),
  });

  const isLoading = stats.isLoading;
  const error = stats.error;

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Dashboard</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">Resumen de actividad de Elora Smart</p>
          </div>
          {stats.data?.totalProducts === 0 && (
            <button
              onClick={() => seedProducts.mutate()}
              disabled={seedProducts.isPending}
              className="flex items-center gap-2 bg-accent-deep text-white font-body text-xs uppercase tracking-widest px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {seedProducts.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Cargar productos
            </button>
          )}
        </div>

        {/* Stats grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-foreground/10 rounded mb-3 w-2/3" />
                <div className="h-8 bg-foreground/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">Error al cargar estadísticas: {error.message}</p>
          </div>
        ) : stats.data ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={TrendingUp} label="Ingresos" value={`${stats.data.totalRevenue.toLocaleString('es-ES')} €`} color="text-accent-deep" href="/admin/pedidos" />
            <StatCard icon={ShoppingCart} label="Pedidos" value={stats.data.totalOrders} href="/admin/pedidos" />
            <StatCard icon={Package} label="Productos" value={stats.data.totalProducts} href="/admin/productos" />
            <StatCard icon={Users} label="Clientes" value={stats.data.totalUsers} href="/admin/clientes" />
            <StatCard icon={Mail} label="Contactos" value={stats.data.totalContacts} href="/admin/contactos" />
            <StatCard icon={Star} label="Club Elora" value={stats.data.totalClubMembers} href="/admin/club-elora" />
          </div>
        ) : null}

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg uppercase tracking-wide">Pedidos recientes</h2>
            <Link href="/admin/pedidos" className="flex items-center gap-1.5 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentOrders.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-foreground/10 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : recentOrders.data && recentOrders.data.length > 0 ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">#</th>
                    <th className="text-left px-4 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Cliente</th>
                    <th className="text-left px-4 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Fecha</th>
                    <th className="text-left px-4 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Estado</th>
                    <th className="text-right px-4 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.data.slice(0, 8).map(order => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-foreground/3 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${order.id}`} className="font-body text-sm text-accent-deep hover:underline">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-body text-sm text-foreground">{order.customerName}</p>
                        <p className="font-body text-xs text-foreground/40">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-body text-xs text-foreground/60">
                          {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-body text-[10px] uppercase tracking-widest ${STATUS_COLORS[order.status] ?? "bg-foreground/10 text-foreground/60"}`}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-display text-sm text-foreground">{parseFloat(order.total).toLocaleString('es-ES')} €</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <ShoppingCart className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
              <p className="font-body text-sm text-foreground/40">Aún no hay pedidos</p>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { href: "/admin/productos", icon: Package, label: "Gestionar productos", desc: "Editar precios, stock y visibilidad" },
            { href: "/admin/pedidos", icon: ShoppingCart, label: "Ver pedidos", desc: "Gestionar estados y detalles" },
            { href: "/admin/clientes", icon: Users, label: "Ver clientes", desc: "Lista de usuarios registrados" },
          ].map(item => (
            <Link key={item.href} href={item.href} className="bg-card border border-border rounded-lg p-5 hover:border-accent-deep/40 transition-colors group">
              <item.icon className="w-5 h-5 text-foreground/40 group-hover:text-accent-deep transition-colors mb-3" />
              <p className="font-body text-sm font-medium text-foreground mb-1">{item.label}</p>
              <p className="font-body text-xs text-foreground/40">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  href: string;
}) {
  return (
    <Link href={href} className="bg-card border border-border rounded-lg p-5 hover:border-accent-deep/40 transition-colors group">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-foreground/30 group-hover:text-accent-deep/60 transition-colors" />
        <p className="font-body text-[10px] uppercase tracking-widest text-foreground/40">{label}</p>
      </div>
      <p className={`font-display text-2xl ${color ?? "text-foreground"}`}>{value}</p>
    </Link>
  );
}
