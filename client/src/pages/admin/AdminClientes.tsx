// ─── AdminClientes — Lista de clientes ───────────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Users, AlertCircle, Search } from "lucide-react";
import { useState } from "react";

export default function AdminClientes() {
  const users = trpc.admin.getUsers.useQuery();
  const [search, setSearch] = useState("");

  const data = users.data ?? [];
  const filtered = search.trim()
    ? data.filter(u =>
        (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    : data;

  return (
    <AdminLayout title="Clientes">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Clientes</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">{data.length} usuarios registrados</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="bg-card border border-border pl-9 pr-4 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent-deep transition-colors rounded-lg w-64"
            />
          </div>
        </div>

        {users.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-foreground/10 rounded w-1/3" />
                    <div className="h-3 bg-foreground/10 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">{users.error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <Users className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl uppercase tracking-wide text-foreground/40 mb-2">
              {search ? "Sin resultados" : "Sin clientes"}
            </p>
            <p className="font-body text-sm text-foreground/30">
              {search ? `No se encontraron usuarios para "${search}".` : "Aún no hay usuarios registrados."}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-foreground/3">
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Usuario</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden lg:table-cell">Método</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Rol</th>
                  <th className="text-right px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Registro</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-foreground/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-deep/20 flex items-center justify-center text-accent-deep font-bold text-sm shrink-0">
                          {user.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{user.name ?? "Sin nombre"}</p>
                          <p className="font-body text-xs text-foreground/40 md:hidden">{user.email ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="font-body text-sm text-foreground/70">{user.email ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="font-body text-xs text-foreground/50">{user.loginMethod ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-[10px] uppercase tracking-widest ${
                        user.role === "admin"
                          ? "bg-accent-deep/20 text-accent-deep"
                          : "bg-foreground/10 text-foreground/50"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell">
                      <p className="font-body text-xs text-foreground/40">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
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
