import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, Tag, Copy } from "lucide-react";

type CouponForm = {
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: string;
  minOrderAmount: string;
  maxUses: string;
  expiresAt: string;
  active: boolean;
};

const emptyForm: CouponForm = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

export default function AdminCupones() {
  const { data: coupons, isLoading, refetch } = trpc.admin.getCoupons.useQuery();
  const createCoupon = trpc.admin.createCoupon.useMutation();
  const updateCoupon = trpc.admin.updateCoupon.useMutation();
  const deleteCoupon = trpc.admin.deleteCoupon.useMutation();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowDialog(true);
  };

  const openEdit = (c: NonNullable<typeof coupons>[0]) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description ?? "",
      type: c.type,
      value: String(parseFloat(String(c.value))),
      minOrderAmount: c.minOrderAmount ? String(parseFloat(String(c.minOrderAmount))) : "",
      maxUses: c.maxUses !== null ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split("T")[0] : "",
      active: c.active,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.value) {
      toast.error("El código y el valor son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description || undefined,
        type: form.type,
        value: parseFloat(form.value),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
        active: form.active,
      };
      if (editingId !== null) {
        await updateCoupon.mutateAsync({ id: editingId, ...payload });
        toast.success("Cupón actualizado");
      } else {
        await createCoupon.mutateAsync(payload);
        toast.success("Cupón creado");
      }
      setShowDialog(false);
      refetch();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el cupón";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`¿Eliminar el cupón "${code}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteCoupon.mutateAsync({ id });
      toast.success("Cupón eliminado");
      refetch();
    } catch {
      toast.error("Error al eliminar el cupón");
    }
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await updateCoupon.mutateAsync({ id, active });
      refetch();
    } catch {
      toast.error("Error al actualizar el cupón");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Código "${code}" copiado`);
  };

  const formatValue = (type: string, value: string | number) => {
    const v = parseFloat(String(value));
    return type === "percentage" ? `${v}%` : `${v.toFixed(2)} €`;
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupones de descuento</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Crea y gestiona cupones de descuento para tus clientes
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo cupón
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      ) : !coupons?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Tag className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay cupones creados todavía</p>
            <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Crear primer cupón
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(c => {
            const expired = isExpired(c.expiresAt);
            return (
              <Card key={c.id} className={`relative ${!c.active || expired ? "opacity-60" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => copyCode(c.code)}
                        className="font-mono font-bold text-lg text-foreground hover:text-primary transition-colors flex items-center gap-1"
                        title="Copiar código"
                      >
                        {c.code}
                        <Copy className="w-3 h-3 opacity-50" />
                      </button>
                      <Badge variant={c.type === "percentage" ? "default" : "secondary"}>
                        {formatValue(c.type, c.value)}
                      </Badge>
                      {expired && <Badge variant="destructive">Caducado</Badge>}
                      {!c.active && !expired && <Badge variant="outline">Inactivo</Badge>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(c)} className="h-7 w-7">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id, c.code)} className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  {c.description && (
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Usos</span>
                    <span className="font-medium text-foreground">
                      {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : " / ∞"}
                    </span>
                  </div>
                  {c.minOrderAmount && (
                    <div className="flex justify-between">
                      <span>Pedido mínimo</span>
                      <span className="font-medium text-foreground">{parseFloat(String(c.minOrderAmount)).toFixed(2)} €</span>
                    </div>
                  )}
                  {c.expiresAt && (
                    <div className="flex justify-between">
                      <span>Caduca</span>
                      <span className={`font-medium ${expired ? "text-destructive" : "text-foreground"}`}>
                        {new Date(c.expiresAt).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t">
                    <span>Activo</span>
                    <Switch
                      checked={c.active}
                      onCheckedChange={(v) => handleToggle(c.id, v)}
                      disabled={expired}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md" style={{ zIndex: 200 }}>
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Editar cupón" : "Nuevo cupón"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Código *</Label>
                <Input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="VERANO20"
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo *</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as "percentage" | "fixed" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[300]">
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Importe fijo (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Valor * {form.type === "percentage" ? "(%)" : "(€)"}</Label>
                <Input
                  type="number"
                  min="0"
                  max={form.type === "percentage" ? "100" : undefined}
                  step="0.01"
                  value={form.value}
                  onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                  placeholder={form.type === "percentage" ? "20" : "50.00"}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Pedido mínimo (€)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minOrderAmount}
                  onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                  placeholder="Sin mínimo"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descuento de verano 20%"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Máximo de usos</Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={form.maxUses}
                  onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                  placeholder="Ilimitado"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha de caducidad</Label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <Label>Cupón activo</Label>
              <Switch
                checked={form.active}
                onCheckedChange={v => setForm(f => ({ ...f, active: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editingId !== null ? "Guardar cambios" : "Crear cupón"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
