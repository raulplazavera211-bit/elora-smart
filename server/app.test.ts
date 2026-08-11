import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type Server } from "node:http";
import { createApp } from "./app";

describe("createApp", () => {
  let server: Server;
  let origin = "";

  beforeAll(async () => {
    server = createServer(createApp());
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("No se pudo iniciar el servidor de prueba");
    origin = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  });

  it("mantiene disponible la ruta de fichas técnicas para la función de Vercel", async () => {
    const response = await fetch(`${origin}/api/download-ficha/producto-inexistente`);
    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toContain("Ficha técnica no encontrada");
  });
});
