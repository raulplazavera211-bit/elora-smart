import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, CheckCircle, Loader2 } from "lucide-react";

interface FichaTecnicaModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function FichaTecnicaModal({ open, onClose, productId, productName }: FichaTecnicaModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const mutation = trpc.fichaTecnica.request.useMutation({
    onSuccess: (_data) => {
      setSubmitted(true);
      // Usar la URL del servidor proxy para evitar problemas de Access Denied en S3
      const proxyUrl = `${window.location.origin}/api/download-ficha/${productId}`;
      setPdfUrl(proxyUrl);
      // Abrir en nueva pestaña
      window.open(proxyUrl, '_blank');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      productId,
      nombre,
      email,
      telefono: telefono || undefined,
      origin: window.location.origin,
    });
  };

  const handleClose = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setSubmitted(false);
    setPdfUrl(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border border-[#2a2a2a] text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#c9a96e]" />
            </div>
            <div>
              <DialogTitle className="text-white font-light tracking-widest uppercase text-sm">
                Ficha Técnica
              </DialogTitle>
              <p className="text-[#c9a96e] text-xs tracking-wider uppercase mt-0.5">{productName}</p>
            </div>
          </div>
          <DialogDescription className="text-[#888] text-sm leading-relaxed mt-2">
            Introduce tus datos para recibir la ficha técnica por email y descargarla automáticamente.
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="ft-nombre" className="text-[#aaa] text-xs tracking-wider uppercase">
                Nombre *
              </Label>
              <Input
                id="ft-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
                className="bg-[#111] border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#c9a96e] focus:ring-0 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ft-email" className="text-[#aaa] text-xs tracking-wider uppercase">
                Email *
              </Label>
              <Input
                id="ft-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="bg-[#111] border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#c9a96e] focus:ring-0 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ft-telefono" className="text-[#aaa] text-xs tracking-wider uppercase">
                Teléfono <span className="text-[#555] normal-case">(opcional)</span>
              </Label>
              <Input
                id="ft-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+34 600 000 000"
                className="bg-[#111] border-[#2a2a2a] text-white placeholder:text-[#555] focus:border-[#c9a96e] focus:ring-0 rounded-none"
              />
            </div>

            {mutation.error && (
              <p className="text-red-400 text-xs">{mutation.error.message}</p>
            )}

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#c9a96e] hover:bg-[#b8965d] text-[#0a0a0a] font-semibold tracking-widest uppercase text-xs py-3 rounded-none transition-all duration-200 active:scale-[0.97]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Ficha Técnica
                </>
              )}
            </Button>

            <p className="text-[#555] text-xs text-center">
              Al enviar, recibirás la ficha en tu email y comenzará la descarga automáticamente.
            </p>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#c9a96e]" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-light tracking-wider text-lg mb-1">¡Ficha enviada!</h3>
              <p className="text-[#888] text-sm leading-relaxed">
                Hemos enviado la ficha técnica a <strong className="text-white">{email}</strong>.<br />
                La descarga debería haber comenzado automáticamente.
              </p>
            </div>
            {pdfUrl && (
              <a
                href={`${window.location.origin}/api/download-ficha/${productId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8965d] text-[#0a0a0a] font-semibold tracking-widest uppercase text-xs py-3 px-6 transition-all duration-200 active:scale-[0.97]"
              >
                <Download className="w-4 h-4" />
                Ver PDF
              </a>
            )}
            <button
              onClick={handleClose}
              className="block w-full text-[#555] hover:text-[#888] text-xs tracking-wider uppercase transition-colors mt-2"
            >
              Cerrar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
