// ─── AdminContactos — Solicitudes de contacto ────────────────────────────────
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Mail, AlertCircle, Search, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function AdminContactos() {
  const contacts = trpc.admin.getContacts.useQuery();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const data = contacts.data ?? [];
  const filtered = search.trim()
    ? data.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.mensaje?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    : data;

  return (
    <AdminLayout title="Contactos">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl uppercase tracking-wide">Contactos</h1>
            <p className="font-body text-sm text-foreground/50 mt-1">{data.length} solicitudes recibidas</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="bg-card border border-border pl-9 pr-4 py-2.5 font-body text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent-deep transition-colors rounded-lg w-56"
            />
          </div>
        </div>

        {contacts.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-foreground/10 rounded w-1/3 mb-2" />
                <div className="h-3 bg-foreground/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : contacts.error ? (
          <div className="flex items-center gap-3 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm">{contacts.error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <Mail className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl uppercase tracking-wide text-foreground/40 mb-2">
              {search ? "Sin resultados" : "Sin contactos"}
            </p>
            <p className="font-body text-sm text-foreground/30">
              {search ? `No se encontraron resultados para "${search}".` : "Aún no se han recibido solicitudes de contacto."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(contact => (
              <div
                key={contact.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent-deep/30 transition-colors"
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                  onClick={() => setExpanded(expanded === contact.id ? null : contact.id)}
                >
                  <div className="w-9 h-9 rounded-full bg-accent-deep/20 flex items-center justify-center text-accent-deep font-bold text-sm shrink-0 mt-0.5">
                    {contact.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-body text-sm font-medium text-foreground">{contact.nombre}</p>
                      <p className="font-body text-xs text-foreground/50">{contact.email}</p>
                      {contact.telefono && (
                        <div className="flex items-center gap-1 text-foreground/40">
                          <Phone className="w-3 h-3" />
                          <p className="font-body text-xs">{contact.telefono}</p>
                        </div>
                      )}
                    </div>
                    {contact.mensaje && !expanded && (
                      <p className="font-body text-xs text-foreground/40 mt-1 line-clamp-1">{contact.mensaje}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-body text-[10px] text-foreground/30 hidden md:block">
                      {new Date(contact.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className={`w-4 h-4 text-foreground/30 transition-transform ${expanded === contact.id ? "rotate-180" : ""}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                </button>
                {expanded === contact.id && contact.mensaje && (
                  <div className="px-5 pb-5 pt-0 border-t border-border">
                    <div className="flex items-start gap-2 mt-3">
                      <MessageSquare className="w-4 h-4 text-foreground/30 shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-foreground/70 leading-relaxed">{contact.mensaje}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href={`mailto:${contact.email}?subject=Re: Solicitud de catálogo Elora Smart`}
                        className="flex items-center gap-2 bg-accent-deep text-white font-body text-xs uppercase tracking-widest px-4 py-2 hover:opacity-90 transition-opacity rounded"
                        onClick={e => e.stopPropagation()}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Responder por email
                      </a>
                      {contact.telefono && (
                        <a
                          href={`tel:${contact.telefono}`}
                          className="flex items-center gap-2 border border-border text-foreground/60 hover:text-foreground hover:border-foreground font-body text-xs uppercase tracking-widest px-4 py-2 transition-colors rounded"
                          onClick={e => e.stopPropagation()}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Llamar
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
