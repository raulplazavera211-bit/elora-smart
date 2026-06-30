import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ProductImageManagerProps {
  productId: number;
  currentMainImage?: string | null;
  currentGallery?: string[];
  onSuccess?: () => void;
}

export function ProductImageManager({
  productId,
  currentMainImage,
  currentGallery = [],
  onSuccess,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingType, setUploadingType] = useState<"main" | "gallery" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadImage = trpc.admin.uploadProductImage.useMutation({
    onSuccess: () => {
      toast.success("Imagen subida correctamente");
      setPreviewUrl(null);
      setUploadingType(null);
      onSuccess?.();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const removeImage = trpc.admin.removeProductImage.useMutation({
    onSuccess: () => {
      toast.success("Imagen eliminada");
      onSuccess?.();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, type: "main" | "gallery") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no puede superar 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(",")[1];
      setPreviewUrl(base64);
      setUploadingType(type);

      uploadImage.mutate({
        productId,
        imageBase64: base64Data,
        imageType: type,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6 bg-card border border-border rounded-lg p-6">
      {/* Foto principal */}
      <div>
        <h3 className="font-display text-sm uppercase tracking-wide mb-3">Foto Principal</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            {currentMainImage ? (
              <div className="relative w-full aspect-square bg-foreground/5 border border-border rounded-lg overflow-hidden group">
                <img
                  src={currentMainImage}
                  alt="Foto principal"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage.mutate({ productId, imageUrl: currentMainImage })}
                  disabled={removeImage.isPending}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full aspect-square bg-foreground/5 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <p className="font-body text-xs text-foreground/40">Sin imagen</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              fileInputRef.current?.click();
              setUploadingType("main");
            }}
            disabled={uploadImage.isPending}
            className="flex flex-col items-center justify-center gap-2 px-4 py-3 bg-accent-deep text-white font-body text-xs uppercase tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploadImage.isPending && uploadingType === "main" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Cambiar
          </button>
        </div>
      </div>

      {/* Galería */}
      <div>
        <h3 className="font-display text-sm uppercase tracking-wide mb-3">Galería</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {currentGallery.map((url) => (
            <div
              key={url}
              className="relative aspect-square bg-foreground/5 border border-border rounded-lg overflow-hidden group"
            >
              <img
                src={url}
                alt="Galería"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage.mutate({ productId, imageUrl: url })}
                disabled={removeImage.isPending}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              fileInputRef.current?.click();
              setUploadingType("gallery");
            }}
            disabled={uploadImage.isPending}
            className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-50"
          >
            {uploadImage.isPending && uploadingType === "gallery" ? (
              <Loader2 className="w-4 h-4 animate-spin text-foreground/40" />
            ) : (
              <Upload className="w-4 h-4 text-foreground/40" />
            )}
          </button>
        </div>
        <p className="font-body text-xs text-foreground/40">
          Máximo 10MB por imagen. Formatos: JPG, PNG, WebP
        </p>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, uploadingType || "gallery")}
        className="hidden"
      />
    </div>
  );
}
