// ─── AdminClubElora — Miembros del Club Elora ────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Star, AlertCircle, Search, Mail } from "lucide-react";
import { useState } from "react";

export default function AdminClubElora() {
  const members = trpc.admin.getClubSignups.useQuery();
  const [search, setSearch] = useState("");

  const data = members.data ?? [];
  const filtered = !search.trim()
    ? data
    : data.filter(m =>
        (m.nombre?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        m.email.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <AdminLayout title="Club Elora">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Club Elora</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">{data.length} miembros activos</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar miembro..."
              className="bg-card border border-border pl-9 pr-4 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent-deep transition-colors rounded-lg w-56"
            />
          </div>
        </div>



        {members.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-foreground/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : members.error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">{members.error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <Star className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl uppercase tracking-wide text-foreground/40 mb-2">
              {search ? "Sin resultados" : "Sin miembros"}
            </p>
            <p className="font-body text-sm text-foreground/30">
              {search
                ? "No se encontraron miembros con esos filtros."
                : "Aún no hay miembros del Club Elora."}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-foreground/3">
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Miembro</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden md:table-cell">Contacto</th>
                  <th className="text-left px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40">Membresía</th>
                  <th className="text-right px-5 py-3 font-body text-[10px] uppercase tracking-widest text-foreground/40 hidden lg:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(member => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-foreground/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-deep/20 flex items-center justify-center text-accent-deep font-bold text-sm shrink-0">
                          {(member.nombre ?? member.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{member.nombre ?? "—"}</p>
                          <p className="font-body text-xs text-foreground/40 md:hidden">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-foreground/60">
                        <Mail className="w-3 h-3 text-foreground/30" />
                        <p className="font-body text-xs">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-body text-[10px] uppercase tracking-widest border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Star className="w-2.5 h-2.5" />
                        Club Elora
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden lg:table-cell">
                      <p className="font-body text-xs text-foreground/40">
                        {new Date(member.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
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
