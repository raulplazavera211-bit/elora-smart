import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("recuperación de la experiencia de producto", () => {
  it("muestra la descripción completa canónica de cada producto y no un texto de la base de datos", () => {
    const source = readProjectFile("client/src/components/ProductDetail.tsx");
    const catalog = readProjectFile("client/src/lib/products.ts");
    expect(source).toContain("{product.longDescription}");
    expect(catalog).toContain('tagline: "La experiencia AURA completa."');
    expect(catalog).toContain('longDescription: "El inodoro inteligente AURA ofrece higiene y confort');
  });

  it("deduplica las imágenes de galería antes de mostrar miniaturas o lightbox", () => {
    const source = readProjectFile("client/src/components/ProductDetail.tsx");
    expect(source).toContain("Array.from(new Set([product.img, ...product.gallery].filter(Boolean)))");
  });

  it("ofrece la descarga de ficha con un clic explícito después del formulario", () => {
    const source = readProjectFile("client/src/components/FichaTecnicaModal.tsx");
    const dialog = readProjectFile("client/src/components/ui/dialog.tsx");
    expect(source).toContain("href={pdfUrl}");
    expect(source).toContain('target="_blank"');
    expect(source).not.toContain("document.createElement('a')");
    expect(source).toContain("se habilitará el botón de descarga");
    expect(source).not.toContain("descargarla automáticamente");
    expect(source).toContain("max-h-[calc(100dvh-2rem)]");
    expect(dialog).toContain("z-[10000] bg-black/50");
    expect(dialog).toContain("z-[10010] grid");
  });

  it("usa cuentas sociales verificadas y elimina el destino de LinkedIn no confirmado", () => {
    const source = readProjectFile("client/src/components/Footer.tsx");
    expect(source).toContain("https://www.tiktok.com/@elora.smart");
    expect(source).toContain("https://www.facebook.com/61576584694086/");
    expect(source).not.toContain("linkedin.com/company/elora-smart");
  });

  it("mantiene visible el directorio de distribuidores, el mapa y su enlace hacia el contacto", () => {
    const source = readProjectFile("client/src/components/SpainDistributorsMap.tsx");
    expect(source).toContain('import { MapView } from "@/components/Map"');
    expect(source).toContain("onMapError={() => setGoogleMapUnavailable(true)}");
    expect(source).toContain('href="/#contacto"');
    expect(source).toContain("const [visible] = useState(true)");
    expect(source).toContain("Todos los distribuidores");
    expect(source).not.toContain("new IntersectionObserver");
  });

  it("resuelve el ancla de contacto dentro del contenedor de scroll de la portada", () => {
    const source = readProjectFile("client/src/pages/Home.tsx");
    expect(source).toContain('id="contacto"');
    expect(source).toContain('window.location.hash !== "#contacto"');
  });
});
