import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Eye, EyeOff, Gift, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/AdminLayout";

type PopupForm = {
  name: string;
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  body: string;
  items: string[];
  ctaLabel: string;
  ctaUrl: string;
  dismissLabel: string;
  footerNote: string;
  active: boolean;
  delayMs: number;
};

const EMPTY_FORM: PopupForm = {
  name: "",
  badge: "🎁 REGALO EXCLUSIVO",
  title: "",
  titleHighlight: "",
  subtitle: "",
  body: "",
  items: ["", "", "", ""],
  ctaLabel: "Ver la colección",
  ctaUrl: "/coleccion",
  dismissLabel: "No, gracias",
  footerNote: "",
  active: false,
  delayMs: 2000,
};

export default function AdminPopups() {
  const utils = trpc.useUtils();
  const { data: popups = [], isLoading } = trpc.popups.list.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PopupForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const createMutation = trpc.popups.create.useMutation({
    onSuccess: () => {
      toast.success("Popup creado correctamente");
      utils.popups.list.invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.popups.update.useMutation({
    onSuccess: () => {
      toast.success("Popup actualizado");
      utils.popups.list.invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const setActiveMutation = trpc.popups.setActive.useMutation({
    onSuccess: () => {
      utils.popups.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.popups.delete.useMutation({
    onSuccess: () => {
      toast.success("Popup eliminado");
      utils.popups.list.invalidate();
      setDeleteConfirm(null);
    },
    onError: (e) => toast.error(e.message),
  });

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(popup: typeof popups[0]) {
    setEditingId(popup.id);
    setForm({
      name: popup.name,
      badge: popup.badge ?? "",
      title: popup.title,
      titleHighlight: popup.titleHighlight ?? "",
      subtitle: popup.subtitle ?? "",
      body: popup.body ?? "",
      items: popup.items && popup.items.length > 0 ? [...popup.items, ...Array(4).fill("")].slice(0, Math.max(4, popup.items.length)) : ["", "", "", ""],
      ctaLabel: popup.ctaLabel,
      ctaUrl: popup.ctaUrl,
      dismissLabel: popup.dismissLabel,
      footerNote: popup.footerNote ?? "",
      active: popup.active,
      delayMs: popup.delayMs,
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    const cleanItems = form.items.filter(i => i.trim() !== "");
    const payload = {
      ...form,
      items: cleanItems,
      badge: form.badge || undefined,
      titleHighlight: form.titleHighlight || undefined,
      subtitle: form.subtitle || undefined,
      body: form.body || undefined,
      footerNote: form.footerNote || undefined,
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function updateItem(index: number, value: string) {
    const newItems = [...form.items];
    newItems[index] = value;
    setForm(f => ({ ...f, items: newItems }));
  }

  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, ""] }));
  }

  function removeItem(index: number) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display uppercase tracking-wide text-stone-900">Popups</h1>
            <p className="text-sm text-stone-500 mt-1">Gestiona los popups promocionales que aparecen en la web. Solo puede haber uno activo a la vez.</p>
          </div>
          <Button onClick={openCreate} className="gap-2" style={{ background: "linear-gradient(135deg, #d4a96a, #b8935a)" }}>
            <Plus className="w-4 h-4" />
            Nuevo popup
          </Button>
        </div>

        {/* Lista de popups */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : popups.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-body text-sm">No hay popups creados todavía.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Crear el primero
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {popups.map(popup => (
              <Card key={popup.id} className={`border transition-all ${popup.active ? "border-amber-300 bg-amber-50/30" : "border-stone-200"}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-body font-semibold text-stone-900 truncate">{popup.name}</span>
                        {popup.active ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Activo</Badge>
                        ) : (
                          <Badge variant="outline" className="text-stone-400 text-xs">Inactivo</Badge>
                        )}
                      </div>
                      {popup.badge && (
                        <p className="text-xs text-amber-600 font-body mb-1">{popup.badge}</p>
                      )}
                      <p className="text-sm text-stone-700 font-body">
                        <span className="font-semibold">{popup.title}</span>
                        {popup.titleHighlight && <span className="text-amber-600"> {popup.titleHighlight}</span>}
                      </p>
                      {popup.subtitle && <p className="text-xs text-stone-500 font-body mt-0.5">{popup.subtitle}</p>}
                      {popup.body && <p className="text-xs text-stone-400 font-body mt-1 line-clamp-1">{popup.body}</p>}
                      {popup.items && popup.items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {popup.items.map((item, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5 text-amber-500" />
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-stone-400 mt-2 font-body">
                        CTA: <span className="text-stone-600">{popup.ctaLabel}</span> → <span className="text-stone-600">{popup.ctaUrl}</span>
                        {" · "}Delay: <span className="text-stone-600">{popup.delayMs / 1000}s</span>
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle activo */}
                      <button
                        onClick={() => setActiveMutation.mutate({ id: popup.id, active: !popup.active })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                          popup.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                        }`}
                        title={popup.active ? "Desactivar" : "Activar"}
                      >
                        {popup.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {popup.active ? "Activo" : "Activar"}
                      </button>
                      <button
                        onClick={() => openEdit(popup)}
                        className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(popup.id)}
                        className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog crear/editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">
                {editingId !== null ? "Editar popup" : "Nuevo popup"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Nombre interno */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Nombre interno *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Promo Junio 2025"
                  className="mt-1"
                />
              </div>

              {/* Badge */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Badge (etiqueta superior)</Label>
                <Input
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  placeholder="🎁 REGALO EXCLUSIVO JUNIO"
                  className="mt-1"
                />
              </div>

              {/* Título + highlight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Título principal *</Label>
                  <Input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Llévate GRATIS nuestro kit"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Highlight (en dorado)</Label>
                  <Input
                    value={form.titleHighlight}
                    onChange={e => setForm(f => ({ ...f, titleHighlight: e.target.value }))}
                    placeholder="ECO-CARE"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Subtítulo */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Subtítulo</Label>
                <Input
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="valorado en 65€"
                  className="mt-1"
                />
              </div>

              {/* Cuerpo */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Texto del cuerpo</Label>
                <Textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Con la compra de cualquier inodoro inteligente ELORA SMART"
                  className="mt-1 resize-none"
                  rows={2}
                />
              </div>

              {/* Items del kit */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Ítems del kit (con ✔)</Label>
                  <button onClick={addItem} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Añadir ítem
                  </button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={e => updateItem(i, e.target.value)}
                        placeholder={`Ítem ${i + 1}`}
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeItem(i)}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Texto del botón CTA</Label>
                  <Input
                    value={form.ctaLabel}
                    onChange={e => setForm(f => ({ ...f, ctaLabel: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">URL del botón CTA</Label>
                  <Input
                    value={form.ctaUrl}
                    onChange={e => setForm(f => ({ ...f, ctaUrl: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Dismiss + footer note */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Texto "No gracias"</Label>
                  <Input
                    value={form.dismissLabel}
                    onChange={e => setForm(f => ({ ...f, dismissLabel: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Nota al pie</Label>
                  <Input
                    value={form.footerNote}
                    onChange={e => setForm(f => ({ ...f, footerNote: e.target.value }))}
                    placeholder="Oferta válida hasta fin de stock"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Delay */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Retraso antes de mostrar (ms)</Label>
                <Input
                  type="number"
                  value={form.delayMs}
                  onChange={e => setForm(f => ({ ...f, delayMs: parseInt(e.target.value) || 2000 }))}
                  className="mt-1 w-40"
                  min={0}
                  step={500}
                />
                <p className="text-[10px] text-stone-400 mt-1">{form.delayMs / 1000} segundos</p>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Switch
                  checked={form.active}
                  onCheckedChange={v => setForm(f => ({ ...f, active: v }))}
                />
                <div>
                  <p className="text-sm font-body font-medium text-stone-700">Activar al guardar</p>
                  <p className="text-xs text-stone-400">Si se activa, se desactivarán automáticamente todos los demás popups.</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.name || !form.title || createMutation.isPending || updateMutation.isPending}
                style={{ background: "linear-gradient(135deg, #d4a96a, #b8935a)" }}
              >
                {editingId !== null ? "Guardar cambios" : "Crear popup"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm delete */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>¿Eliminar popup?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-stone-500">Esta acción no se puede deshacer.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm !== null && deleteMutation.mutate({ id: deleteConfirm })}
                disabled={deleteMutation.isPending}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
