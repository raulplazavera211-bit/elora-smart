// ─── AdminPedidos — Gestión de pedidos ───────────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ShoppingCart, ChevronDown, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRoute, useLocation } from "wouter";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = typeof ALL_STATUSES[number];

// ─── Order Detail View ────────────────────────────────────────────────────────
function OrderDetail({ orderId }: { orderId: number }) {
  const [, setLocation] = useLocation();
  const order = trpc.admin.getOrder.useQuery({ id: orderId });
  const utils = trpc.useUtils();

  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      utils.admin.getOrder.invalidate({ id: orderId });
      utils.admin.getOrders.invalidate();
      toast.success("Estado actualizado");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  if (order.isLoading) {
    return (
      <AdminLayout title="Pedido">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-foreground/30" />
        </div>
      </AdminLayout>
    );
  }

  if (order.error || !order.data) {
    return (
      <AdminLayout title="Pedido">
        <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-body text-sm">Pedido no encontrado</p>
        </div>
      </AdminLayout>
    );
  }

  const o = order.data;
  const total = parseFloat(o.total);

  return (
    <AdminLayout title={`Pedido #${o.id}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/admin/pedidos")}
            className="font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1"
          >
            ← Volver
          </button>
          <ChevronRight className="w-3 h-3 text-foreground/20" />
          <span className="font-body text-xs text-foreground/60">Pedido #{o.id}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Customer info */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-4">Cliente</h3>
            <div className="space-y-2">
              <p className="font-body text-sm font-medium text-foreground">{o.customerName}</p>
              <p className="font-body text-sm text-foreground/60">{o.customerEmail}</p>
              {o.customerPhone && <p className="font-body text-sm text-foreground/60">{o.customerPhone}</p>}
              {o.address && <p className="font-body text-xs text-foreground/40 mt-2">{o.address}</p>}
              {o.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="font-body text-[10px] uppercase tracking-widest text-foreground/30 mb-1">Notas</p>
                  <p className="font-body text-xs text-foreground/60">{o.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order info */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-4">Información del pedido</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-body text-xs text-foreground/50">Fecha</span>
                <span className="font-body text-sm text-foreground">
                  {new Date(o.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-xs text-foreground/50">Total</span>
                <span className="font-display text-lg text-accent-deep">{total.toLocaleString('es-ES')} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-foreground/50">Estado</span>
                <div className="relative">
                  <select
                    value={o.status}
                    onChange={e => updateStatus.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                    disabled={updateStatus.isPending}
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-full font-body text-[10px] uppercase tracking-widest border cursor-pointer focus:outline-none ${STATUS_COLORS[o.status] ?? "bg-foreground/10 text-foreground/60 border-border"} disabled:opacity-50`}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s} className="bg-background text-foreground">{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="font-body text-[10px] uppercase tracking-widest text-foreground/40">Productos</h3>
          </div>
          <div className="divide-y divide-border">
            {o.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                {item.productImg && (
                  <div className="w-14 h-14 shrink-0 overflow-hidden border border-border bg-foreground/5 rounded">
                    <img src={item.productImg} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground">{item.productName}</p>
                  <p className="font-body text-xs text-foreground/40">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-sm text-foreground">{parseFloat(item.unitPrice).toLocaleString('es-ES')} €</p>
                  {item.quantity > 1 && (
                    <p className="font-body text-xs text-foreground/40">{(parseFloat(item.unitPrice) * item.quantity).toLocaleString('es-ES')} € total</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-border bg-foreground/3 flex justify-between items-center">
            <span className="font-body text-xs uppercase tracking-widest text-foreground/50">Total del pedido</span>
            <span className="font-display text-xl text-accent-deep">{total.toLocaleString('es-ES')} €</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Orders List ──────────────────────────────────────────────────────────────
export default function AdminPedidos() {
  const [matchDetail, params] = useRoute("/admin/pedidos/:id");

  if (matchDetail && params?.id) {
    const id = parseInt(params.id, 10);
    if (!isNaN(id)) return <OrderDetail orderId={id} />;
  }

  return <OrdersList />;
}

function OrdersList() {
  const [, setLocation] = useLocation();
  const orders = trpc.admin.getOrders.useQuery();
  const utils = trpc.useUtils();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const updateStatus = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      utils.admin.getOrders.invalidate();
      toast.success("Estado actualizado");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const data = orders.data ?? [];
  const filtered = filterStatus === "all" ? data : data.filter(o => o.status === filterStatus);

  return (
    <AdminLayout title="Pedidos">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Pedidos</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">{data.length} pedidos en total</p>
          </div>
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {["all", ...ALL_STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`font-body text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                  filterStatus === s
                    ? "bg-accent-deep text-white border-accent-deep"
                    : "border-border text-foreground/40 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {s === "all" ? "Todos" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {orders.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-foreground/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">{orders.error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <ShoppingCart className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl uppercase tracking-wide text-foreground/40 mb-2">Sin pedidos</p>
            <p className="font-body text-sm text-foreground/30">
              {filterStatus === "all" ? "Aún no se han recibido pedidos." : `No hay pedidos con estado "${STATUS_LABELS[filterStatus]}".`}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-foreground/3">
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">#</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Cliente</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Productos</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Estado</th>
                  <th className="text-right px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-foreground/2 transition-colors cursor-pointer"
                    onClick={() => setLocation(`/admin/pedidos/${order.id}`)}
                  >
                    <td className="px-5 py-4">
                      <span className="font-body text-sm text-accent-deep">#{order.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-body text-sm text-foreground">{order.customerName}</p>
                      <p className="font-body text-xs text-foreground/40">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="font-body text-xs text-foreground/60">
                        {order.items.map(i => i.productName).join(", ")}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="font-body text-xs text-foreground/60">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={e => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                          disabled={updateStatus.isPending}
                          className={`appearance-none pl-3 pr-7 py-1 rounded-full font-body text-[10px] uppercase tracking-widest border cursor-pointer focus:outline-none ${STATUS_COLORS[order.status] ?? "bg-foreground/10 text-foreground/60 border-border"} disabled:opacity-50`}
                        >
                          {ALL_STATUSES.map(s => (
                            <option key={s} value={s} className="bg-background text-foreground">{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-2.5 h-2.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-display text-sm text-foreground">{parseFloat(order.total).toLocaleString('es-ES')} €</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
