import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("configuración de rutas de Vercel", () => {
  it("sirve los archivos estáticos antes de aplicar el fallback SPA", () => {
    const config = JSON.parse(
      readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as {
      routes: Array<Record<string, string>>;
    };

    expect(config.routes[0]).toEqual({ handle: "filesystem" });
    expect(config.routes).toContainEqual({
      src: "/manus-storage/(.*)",
      dest: "/api/storage.mjs",
    });
    expect(config.routes.at(-1)).toEqual({ src: "/(.*)", dest: "/index.html" });
  });
});
