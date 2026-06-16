// ─── AdminProductos — Gestión de productos ───────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Package, Edit2, Eye, EyeOff, Loader2, AlertCircle, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductos() {
  const products = trpc.admin.getProducts.useQuery();
  const utils = trpc.useUtils();

  const updateProduct = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      utils.admin.getProducts.invalidate();
      toast.success("Producto actualizado");
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const seedProducts = trpc.admin.seedProducts.useMutation({
    onSuccess: (data) => {
      utils.admin.getProducts.invalidate();
      toast.success(data.message);
    },
    onError: () => toast.error("Error al cargar productos"),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ price: string; stock: string; name: string; tagline: string }>({
    price: "", stock: "", name: "", tagline: ""
  });

  function startEdit(product: { id: number; price: string; stock: number; name: string; tagline?: string | null }) {
    setEditingId(product.id);
    setEditForm({
      price: product.price,
      stock: String(product.stock),
      name: product.name,
      tagline: product.tagline ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: number) {
    const price = parseFloat(editForm.price);
    const stock = parseInt(editForm.stock, 10);
    if (isNaN(price) || price <= 0) { toast.error("Precio inválido"); return; }
    if (isNaN(stock) || stock < 0) { toast.error("Stock inválido"); return; }
    updateProduct.mutate({
      id,
      price,
      stock,
      name: editForm.name.trim() || undefined,
      tagline: editForm.tagline.trim() || undefined,
    });
    setEditingId(null);
  }

  function toggleActive(id: number, current: boolean) {
    updateProduct.mutate({ id, active: !current });
  }

  const isLoading = products.isLoading;
  const data = products.data ?? [];

  return (
    <AdminLayout title="Productos">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Productos</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">{data.length} productos en el catálogo</p>
          </div>
          {data.length === 0 && !isLoading && (
            <button
              onClick={() => seedProducts.mutate()}
              disabled={seedProducts.isPending}
              className="flex items-center gap-2 bg-accent-deep text-white font-body text-xs uppercase tracking-widest px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {seedProducts.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
              Cargar los 6 productos
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-foreground/10 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/3" />
                    <div className="h-3 bg-foreground/10 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">{products.error.message}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl uppercase tracking-wide text-foreground/40 mb-2">Sin productos</p>
            <p className="font-body text-sm text-foreground/30">Haz clic en "Cargar los 6 productos" para empezar.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-foreground/3">
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Producto</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden lg:table-cell">Precio</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Stock</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Estado</th>
                  <th className="text-right px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map(product => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-foreground/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        {product.img && (
                          <div className="w-12 h-12 shrink-0 overflow-hidden border border-border bg-foreground/5 rounded">
                            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          {editingId === product.id ? (
                            <input
                              value={editForm.name}
                              onChange={e => setEditForm(f => ({...f, name: e.target.value}))}
                              className="bg-background border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-accent-deep w-full max-w-xs"
                            />
                          ) : (
                            <p className="font-body text-sm font-medium text-foreground truncate">{product.name}</p>
                          )}
                          {editingId === product.id ? (
                            <input
                              value={editForm.tagline}
                              onChange={e => setEditForm(f => ({...f, tagline: e.target.value}))}
                              className="bg-background border border-border px-2 py-1 font-body text-xs text-foreground/60 focus:outline-none focus:border-accent-deep w-full max-w-xs mt-1"
                              placeholder="Tagline..."
                            />
                          ) : (
                            <p className="font-body text-xs text-foreground/40 truncate mt-0.5">{product.tagline ?? ""}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={e => setEditForm(f => ({...f, price: e.target.value}))}
                            className="bg-background border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-accent-deep w-24"
                            step="0.01"
                            min="0"
                          />
                          <span className="font-body text-xs text-foreground/40">€</span>
                        </div>
                      ) : (
                        <span className="font-display text-sm text-foreground">{parseFloat(product.price).toLocaleString('es-ES')} €</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={e => setEditForm(f => ({...f, stock: e.target.value}))}
                          className="bg-background border border-border px-2 py-1 font-body text-sm text-foreground focus:outline-none focus:border-accent-deep w-20"
                          min="0"
                        />
                      ) : (
                        <span className="font-body text-sm text-foreground/70">{product.stock}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(product.id, product.active)}
                        disabled={updateProduct.isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body text-[10px] uppercase tracking-widest transition-colors ${
                          product.active
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-foreground/10 text-foreground/40 hover:bg-foreground/20"
                        }`}
                      >
                        {product.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {product.active ? "Activo" : "Oculto"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {editingId === product.id ? (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => saveEdit(product.id)}
                            disabled={updateProduct.isPending}
                            className="flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded font-body text-xs transition-colors"
                          >
                            {updateProduct.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Guardar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-1 bg-foreground/10 text-foreground/50 hover:bg-foreground/20 px-3 py-1.5 rounded font-body text-xs transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(product)}
                          className="flex items-center gap-1.5 text-foreground/40 hover:text-foreground transition-colors font-body text-xs ml-auto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Editar
                        </button>
                      )}
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
