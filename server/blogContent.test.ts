import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "../client/src/lib/blog";

describe("blog editorial de Elora Smart", () => {
  it("contiene exactamente treinta entradas con identificadores únicos", () => {
    expect(BLOG_POSTS).toHaveLength(30);
    expect(new Set(BLOG_POSTS.map((post) => post.slug)).size).toBe(30);
  });

  it("mantiene una fuente interna y contenido editorial en todas las entradas", () => {
    BLOG_POSTS.forEach((post) => {
      expect(post.sourceHref).toMatch(/^\//);
      expect(post.sourceLabel.trim().length).toBeGreaterThan(0);
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.excerpt.trim().length).toBeGreaterThan(0);
      expect(post.body.length).toBeGreaterThan(0);
      expect(post.body.every((paragraph) => paragraph.trim().length > 0)).toBe(true);
      expect((post.additionalSources ?? []).every((source) => source.href.startsWith("/") && source.label.trim().length > 0)).toBe(true);
    });
  });

  it("registra las rutas públicas de índice y detalle", () => {
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

    expect(app).toContain('path="/blog" component={Blog}');
    expect(app).toContain('path="/blog/:slug" component={BlogPost}');
  });
});
