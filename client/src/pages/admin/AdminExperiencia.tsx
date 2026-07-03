import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, ImagePlus, Eye, EyeOff, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/AdminLayout";

type SlideForm = {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  sortOrder: number;
  active: boolean;
};

const EMPTY_FORM: SlideForm = {
  step: "",
  title: "",
  description: "",
  imageUrl: "",
  imageKey: "",
  sortOrder: 0,
  active: true,
};

export default function AdminExperiencia() {
  const utils = trpc.useUtils();
  const { data: slides = [], isLoading } = trpc.experience.adminList.useQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SlideForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.experience.create.useMutation({
    onSuccess: () => {
      toast.success("Slide creado correctamente");
      utils.experience.adminList.invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.experience.update.useMutation({
    onSuccess: () => {
      toast.success("Slide actualizado");
      utils.experience.adminList.invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const reorderMutation = trpc.experience.reorder.useMutation({
    onSuccess: () => {
      utils.experience.adminList.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const toggleMutation = trpc.experience.update.useMutation({
    onSuccess: () => {
      utils.experience.adminList.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.experience.delete.useMutation({
    onSuccess: () => {
      toast.success("Slide eliminado");
      utils.experience.adminList.invalidate();
      setDeleteConfirm(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const uploadImageMutation = trpc.experience.uploadImage.useMutation({
    onError: (e) => toast.error("Error al subir imagen: " + e.message),
  });

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, sortOrder: slides.length });
    setDialogOpen(true);
  }

  function openEdit(slide: typeof slides[0]) {
    setEditingId(slide.id);
    setForm({
      step: slide.step,
      title: slide.title,
      description: slide.description ?? "",
      imageUrl: slide.imageUrl ?? "",
      imageKey: slide.imageKey ?? "",
      sortOrder: slide.sortOrder,
      active: slide.active,
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    const payload = {
      ...form,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      imageKey: form.imageKey || undefined,
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5MB");
      return;
    }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadImageMutation.mutateAsync({
        filename: file.name,
        mimeType: file.type,
        base64,
      });
      setForm(f => ({ ...f, imageUrl: result.url, imageKey: result.key }));
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  // Drag-and-drop reorder
  function handleDragStart(id: number) {
    dragItem.current = id;
  }

  function handleDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    setDragOverId(id);
  }

  function handleDrop(targetId: number) {
    if (dragItem.current === null || dragItem.current === targetId) {
      setDragOverId(null);
      return;
    }
    const currentOrder = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);
    const fromIndex = currentOrder.findIndex(s => s.id === dragItem.current);
    const toIndex = currentOrder.findIndex(s => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    const orderedIds = newOrder.map(s => s.id);
    reorderMutation.mutate({ orderedIds });
    dragItem.current = null;
    setDragOverId(null);
  }

  const sortedSlides = [...slides].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display uppercase tracking-wide text-stone-900">Sección Experiencia</h1>
            <p className="text-sm text-stone-500 mt-1">
              Gestiona las fotos y textos de la sección "La experiencia Elora" en la home. Arrastra para reordenar.
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2" style={{ background: "linear-gradient(135deg, #d4a96a, #b8935a)" }}>
            <Plus className="w-4 h-4" />
            Nuevo slide
          </Button>
        </div>

        {/* Lista de slides */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-stone-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sortedSlides.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-body text-sm">No hay slides creados todavía.</p>
            <Button variant="outline" onClick={openCreate} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Crear el primero
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSlides.map((slide, index) => (
              <div
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(slide.id)}
                onDragOver={e => handleDragOver(e, slide.id)}
                onDrop={() => handleDrop(slide.id)}
                onDragLeave={() => setDragOverId(null)}
                className={`flex items-center gap-4 p-4 rounded-xl border bg-white transition-all cursor-grab active:cursor-grabbing ${
                  dragOverId === slide.id ? "border-amber-400 bg-amber-50 scale-[1.01]" : "border-stone-200 hover:border-stone-300"
                } ${!slide.active ? "opacity-60" : ""}`}
              >
                {/* Drag handle */}
                <div className="text-stone-300 hover:text-stone-500 transition-colors shrink-0">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Número de orden */}
                <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-body font-semibold text-stone-500 shrink-0">
                  {index + 1}
                </div>

                {/* Imagen */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-stone-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {slide.step && (
                      <span className="text-[10px] font-body uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {slide.step}
                      </span>
                    )}
                    {!slide.active && (
                      <Badge variant="outline" className="text-[10px] text-stone-400">Oculto</Badge>
                    )}
                  </div>
                  <p className="font-body font-semibold text-stone-900 text-sm truncate">{slide.title}</p>
                  {slide.description && (
                    <p className="text-xs text-stone-400 font-body truncate">{slide.description}</p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate({ id: slide.id, active: !slide.active })}
                    className={`p-2 rounded-lg transition-all ${
                      slide.active
                        ? "text-green-600 hover:bg-green-50"
                        : "text-stone-400 hover:bg-stone-100"
                    }`}
                    title={slide.active ? "Ocultar" : "Mostrar"}
                  >
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(slide.id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog crear/editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-wide">
                {editingId !== null ? "Editar slide" : "Nuevo slide"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Imagen */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Imagen</Label>
                <div className="mt-2">
                  {form.imageUrl ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-100 group">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white/90 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-body font-medium flex items-center gap-1.5 hover:bg-white transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Cambiar
                        </button>
                        <button
                          onClick={() => setForm(f => ({ ...f, imageUrl: "", imageKey: "" }))}
                          className="bg-red-500/90 text-white px-3 py-1.5 rounded-lg text-xs font-body font-medium flex items-center gap-1.5 hover:bg-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Quitar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-amber-600"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-sm font-body">Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-8 h-8" />
                          <span className="text-sm font-body">Haz click para subir una imagen</span>
                          <span className="text-xs">JPG, PNG, WebP · Máx. 5MB</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              {/* Step label */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Etiqueta del paso (ej: "01", "PASO 1")</Label>
                <Input
                  value={form.step}
                  onChange={e => setForm(f => ({ ...f, step: e.target.value }))}
                  placeholder="01"
                  className="mt-1 w-32"
                  maxLength={8}
                />
              </div>

              {/* Título */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Título *</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="La tapa se levanta automáticamente"
                  className="mt-1"
                />
              </div>

              {/* Descripción */}
              <div>
                <Label className="text-xs font-body uppercase tracking-wider text-stone-500">Descripción</Label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción opcional del paso..."
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              {/* Activo */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <Switch
                  checked={form.active}
                  onCheckedChange={v => setForm(f => ({ ...f, active: v }))}
                />
                <div>
                  <p className="text-sm font-body font-medium text-stone-700">Visible en la web</p>
                  <p className="text-xs text-stone-400">Si está desactivado, no se mostrará en la sección Experiencia.</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.title || !form.step || createMutation.isPending || updateMutation.isPending || uploading}
                style={{ background: "linear-gradient(135deg, #d4a96a, #b8935a)" }}
              >
                {editingId !== null ? "Guardar cambios" : "Crear slide"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm delete */}
        <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>¿Eliminar slide?</DialogTitle>
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
