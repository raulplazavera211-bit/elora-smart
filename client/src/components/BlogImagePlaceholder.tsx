import { cn } from "@/lib/utils";

const LOGO_URL = "/manus-storage/elora_logo_color_2329eaab.webp";

type BlogImagePlaceholderProps = {
  className?: string;
  label?: string;
};

/** Placeholder editorial temporal: señala de forma visible dónde incorporar una imagen definitiva. */
export function BlogImagePlaceholder({ className, label = "Imagen pendiente de incorporar" }: BlogImagePlaceholderProps) {
  return (
    <div role="img" aria-label={label} className={cn("relative overflow-hidden bg-[#f4f0ea] border border-border flex items-center justify-center", className)}>
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(45deg, rgba(173, 132, 61, 0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(173, 132, 61, 0.08) 25%, transparent 25%)", backgroundSize: "24px 24px", backgroundPosition: "0 0, 12px 12px" }} />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <div className="bg-background/90 border border-border px-7 py-5 shadow-sm"><img src={LOGO_URL} alt="Elora Smart" className="h-9 sm:h-11 w-auto" /></div>
        <p className="font-body text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-foreground/55">{label}</p>
      </div>
    </div>
  );
}
