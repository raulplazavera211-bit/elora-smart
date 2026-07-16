import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Lock, LogOut, Mail, Phone, RefreshCw, ShieldAlert, Users } from "lucide-react";

const LOGO_URL = "/manus-storage/elora_200_daf8d186.png";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoadingRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-amber-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ContactsTable() {
  const { data, isLoading, error, refetch } = trpc.admin.getContacts.useQuery();

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-sm">
        Error al cargar los datos. {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {isLoading ? "Cargando..." : `${data?.length ?? 0} envío${(data?.length ?? 0) !== 1 ? "s" : ""}`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 text-xs"
        >
          <RefreshCw className="w-3 h-3" />
          Actualizar
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-amber-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">#</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Nombre</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Teléfono</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Mensaje</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows cols={6} />
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No hay envíos de contacto todavía.
                </td>
              </tr>
            ) : (
              [...data].reverse().map((row) => (
                <tr key={row.id} className="border-b border-amber-50 hover:bg-amber-50/40 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{row.nombre}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.telefono ? (
                      <a
                        href={`tel:${row.telefono}`}
                        className="flex items-center gap-1 hover:text-amber-600 transition-colors"
                      >
                        <Phone className="w-3 h-3 shrink-0" />
                        {row.telefono}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    {row.mensaje ? (
                      <span className="line-clamp-2 text-xs leading-relaxed">{row.mensaje}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClubSignupsTable() {
  const { data, isLoading, error, refetch } = trpc.admin.getClubSignups.useQuery();

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 text-sm">
        Error al cargar los datos. {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {isLoading ? "Cargando..." : `${data?.length ?? 0} suscriptor${(data?.length ?? 0) !== 1 ? "es" : ""}`}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 text-xs"
        >
          <RefreshCw className="w-3 h-3" />
          Actualizar
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-amber-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">#</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Nombre</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Fecha de registro</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows cols={4} />
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  No hay suscriptores del Club Elora todavía.
                </td>
              </tr>
            ) : (
              [...data].reverse().map((row) => (
                <tr key={row.id} className="border-b border-amber-50 hover:bg-amber-50/40 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {row.nombre ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${row.email}`}
                      className="text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, loading, logout } = useAuth();

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src={LOGO_URL} alt="Elora Smart" className="h-10 w-auto opacity-40 saturate-0" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm shadow-lg border-0">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto mx-auto mb-4 opacity-70" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Panel de Administración</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Inicia sesión con tu cuenta de Manus para acceder al panel.
            </p>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Not admin ──────────────────────────────────────────────────────────────
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm shadow-lg border-0">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Acceso denegado</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Tu cuenta no tiene permisos de administrador.
            </p>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Admin panel ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Elora Smart" className="h-8 w-auto" />
            <div className="w-px h-6 bg-gray-200" />
            <div>
              <span
                className="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Panel Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-xs hidden sm:flex">
              {user.name ?? user.email ?? "Admin"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-gray-500 hover:text-gray-700 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1
            className="text-3xl uppercase tracking-wide text-gray-900 mb-1"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
          >
            Datos de clientes
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona los envíos de contacto y los suscriptores del Club Elora.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contactos">
          <TabsList className="mb-6 bg-amber-50 border border-amber-100">
            <TabsTrigger
              value="contactos"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Contactos
            </TabsTrigger>
            <TabsTrigger
              value="club"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4" />
              Club Elora
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contactos">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  Formulario de contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="club">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  Suscriptores del Club Elora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClubSignupsTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
