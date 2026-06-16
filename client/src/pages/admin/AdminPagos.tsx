import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  CreditCard, Smartphone, Building2, Globe, Package,
  ChevronDown, ChevronUp, Save, Loader2, ToggleLeft, ToggleRight,
  ShieldCheck, AlertCircle, Info,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PaymentMethodType = "redsys_card" | "redsys_bizum" | "transfer" | "paypal" | "cash_on_delivery" | "other";

interface PaymentMethod {
  id: number;
  key: string;
  name: string;
  description: string | null;
  type: PaymentMethodType;
  enabled: boolean;
  config: Record<string, string> | null;
  position: number;
}

// ─── Iconos por tipo ──────────────────────────────────────────────────────────
function MethodIcon({ type, className = "w-5 h-5" }: { type: PaymentMethodType; className?: string }) {
  switch (type) {
    case "redsys_card": return <CreditCard className={className} />;
    case "redsys_bizum": return <Smartphone className={className} />;
    case "transfer": return <Building2 className={className} />;
    case "paypal": return <Globe className={className} />;
    case "cash_on_delivery": return <Package className={className} />;
    default: return <CreditCard className={className} />;
  }
}

// ─── Etiquetas de tipo ────────────────────────────────────────────────────────
const TYPE_LABELS: Record<PaymentMethodType, string> = {
  redsys_card: "TPV Redsys — Tarjeta",
  redsys_bizum: "TPV Redsys — Bizum",
  transfer: "Transferencia bancaria",
  paypal: "PayPal",
  cash_on_delivery: "Contrareembolso",
  other: "Otro",
};

// ─── Campos de configuración por tipo ────────────────────────────────────────
const CONFIG_FIELDS: Record<PaymentMethodType, { key: string; label: string; placeholder: string; sensitive?: boolean; textarea?: boolean }[]> = {
  redsys_card: [],
  redsys_bizum: [],
  transfer: [
    { key: "banco", label: "Nombre del banco", placeholder: "Ej: CaixaBank" },
    { key: "iban", label: "IBAN", placeholder: "ES00 0000 0000 0000 0000 0000" },
    { key: "titular", label: "Titular de la cuenta", placeholder: "Elora Smart S.L." },
    { key: "instrucciones", label: "Instrucciones adicionales", placeholder: "Indica tu número de pedido en el concepto...", textarea: true },
  ],
  paypal: [
    { key: "paypal_email", label: "Email de PayPal", placeholder: "pagos@elorasmart.com" },
    { key: "client_id", label: "Client ID (API)", placeholder: "AXxx...", sensitive: true },
    { key: "client_secret", label: "Client Secret (API)", placeholder: "EXxx...", sensitive: true },
  ],
  cash_on_delivery: [
    { key: "surcharge", label: "Suplemento (€)", placeholder: "5" },
    { key: "instrucciones", label: "Instrucciones al cliente", placeholder: "Pago en efectivo al repartidor...", textarea: true },
  ],
  other: [
    { key: "instrucciones", label: "Instrucciones", placeholder: "Describe cómo realizar el pago...", textarea: true },
  ],
};

// ─── Tarjeta de método de pago ────────────────────────────────────────────────
function PaymentMethodCard({ method, onRefetch }: { method: PaymentMethod; onRefetch: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [localConfig, setLocalConfig] = useState<Record<string, string>>(method.config ?? {});
  const [localName, setLocalName] = useState(method.name);
  const [localDesc, setLocalDesc] = useState(method.description ?? "");

  const toggle = trpc.admin.togglePaymentMethod.useMutation({
    onSuccess: () => { toast.success(method.enabled ? "Método desactivado" : "Método activado"); onRefetch(); },
    onError: () => toast.error("Error al cambiar el estado"),
  });

  const save = trpc.admin.updatePaymentMethod.useMutation({
    onSuccess: () => { toast.success("Configuración guardada"); onRefetch(); },
    onError: () => toast.error("Error al guardar la configuración"),
  });

  const fields = CONFIG_FIELDS[method.type] ?? [];
  const isRedsys = method.type === "redsys_card" || method.type === "redsys_bizum";

  return (
    <div className={`border ${method.enabled ? "border-foreground/20" : "border-border"} bg-card transition-all duration-200`}>
      {/* Cabecera */}
      <div className="flex items-center gap-4 p-5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${method.enabled ? "bg-accent-deep/10" : "bg-muted"}`}>
          <MethodIcon type={method.type} className={`w-5 h-5 ${method.enabled ? "text-accent-deep" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-sm uppercase tracking-wide text-foreground">{method.name}</h3>
            <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5">
              {TYPE_LABELS[method.type]}
            </span>
            {method.enabled && (
              <span className="font-body text-[10px] uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5">
                Activo
              </span>
            )}
          </div>
          {method.description && (
            <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-1">{method.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Toggle */}
          <button
            onClick={() => toggle.mutate({ key: method.key, enabled: !method.enabled })}
            disabled={toggle.isPending}
            className="outline-none"
            title={method.enabled ? "Desactivar" : "Activar"}
          >
            {toggle.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : method.enabled ? (
              <ToggleRight className="w-8 h-8 text-accent-deep" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-muted-foreground" />
            )}
          </button>
          {/* Expandir */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="outline-none w-8 h-8 flex items-center justify-center border border-border hover:border-foreground/30 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Panel expandido */}
      {expanded && (
        <div className="border-t border-border p-5 flex flex-col gap-5">
          {/* Aviso Redsys */}
          {isRedsys && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-xs text-blue-700 font-semibold mb-0.5">Configurado automáticamente</p>
                <p className="font-body text-xs text-blue-600">
                  Las credenciales Redsys (FUC, clave secreta y terminal) se gestionan desde los <strong>Secretos del proyecto</strong>.
                  Este método usa la configuración del TPV virtual ya activo.
                </p>
              </div>
            </div>
          )}

          {/* Nombre y descripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Nombre visible al cliente</label>
              <input
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="bg-background border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Descripción</label>
              <input
                type="text"
                value={localDesc}
                onChange={(e) => setLocalDesc(e.target.value)}
                className="bg-background border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          {/* Campos de configuración específicos */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground border-b border-border pb-2">
                Configuración del método
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {field.label}
                      {field.sensitive && (
                        <span className="ml-1.5 text-amber-500 normal-case tracking-normal">🔒 sensible</span>
                      )}
                    </label>
                    {field.textarea ? (
                      <textarea
                        value={localConfig[field.key] ?? ""}
                        onChange={(e) => setLocalConfig({ ...localConfig, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        rows={3}
                        className="bg-background border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type={field.sensitive ? "password" : "text"}
                        value={localConfig[field.key] ?? ""}
                        onChange={(e) => setLocalConfig({ ...localConfig, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="bg-background border border-border px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón guardar */}
          <div className="flex justify-end">
            <button
              onClick={() => save.mutate({
                key: method.key,
                name: localName,
                description: localDesc,
                config: localConfig,
              })}
              disabled={save.isPending}
              className="flex items-center gap-2 bg-foreground text-background font-body text-xs uppercase tracking-[0.25em] px-5 py-2.5 hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {save.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function AdminPagos() {
  const { data: methods, isLoading, refetch } = trpc.admin.getPaymentMethods.useQuery();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Cabecera */}
        <div className="mb-8">
          <h1 className="font-display text-2xl uppercase tracking-wide text-foreground mb-1">Métodos de pago</h1>
          <p className="font-body text-sm text-muted-foreground">
            Activa o desactiva los métodos de pago disponibles para tus clientes y configura sus parámetros.
          </p>
        </div>

        {/* Aviso sandbox */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 mb-6">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-xs text-amber-700 font-semibold mb-0.5">Modo sandbox activo</p>
            <p className="font-body text-xs text-amber-600">
              Redsys está en modo de pruebas. Para activar pagos reales, cambia <code className="bg-amber-100 px-1">REDSYS_SANDBOX</code> a <code className="bg-amber-100 px-1">false</code> en los Secretos del proyecto.
            </p>
          </div>
        </div>

        {/* Info general */}
        <div className="flex items-start gap-3 bg-muted/50 border border-border p-4 mb-8">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="font-body text-xs text-muted-foreground">
            Los métodos activos aparecerán en el carrito de compra para que el cliente elija. Puedes personalizar el nombre y la descripción que ve el cliente, y configurar los datos de cada método (cuenta bancaria, email de PayPal, etc.).
          </p>
        </div>

        {/* Lista de métodos */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(methods ?? []).map((method) => (
              <PaymentMethodCard
                key={method.key}
                method={method as PaymentMethod}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
