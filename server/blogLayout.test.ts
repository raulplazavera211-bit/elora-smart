import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("estructura responsive y SEO del blog", () => {
  it("mantiene una navegación de escritorio fija y separa el contenido del sidebar", () => {
    const shell = readProjectFile("client/src/components/BlogShell.tsx");
    expect(shell).toContain("fixed left-0 top-0 bottom-0 w-72");
    expect(shell).toContain("md:ml-72");
    expect(shell).toContain("fixed top-0 left-0 w-full h-20");
  });

  it("utiliza el placeholder uniforme de Elora en índice y fichas", () => {
    const index = readProjectFile("client/src/pages/Blog.tsx");
    const post = readProjectFile("client/src/pages/BlogPost.tsx");
    const placeholder = readProjectFile("client/src/components/BlogImagePlaceholder.tsx");
    expect(index).toContain("BlogImagePlaceholder");
    expect(post).toContain("BlogImagePlaceholder");
    expect(placeholder).toContain("elora_logo_color_2329eaab.webp");
    expect(index).toContain('"@type": "Blog"');
    expect(post).toContain('"@type": "Article"');
  });

  it("restablece el scroll al inicio cuando cambia la URL de una entrada", () => {
    const post = readProjectFile("client/src/pages/BlogPost.tsx");
    expect(post).toContain("useLayoutEffect");
    expect(post).toContain("window.scrollTo({ top: 0, left: 0, behavior: \"auto\" })");
    expect(post).toContain("[params.slug]");
  });
});
