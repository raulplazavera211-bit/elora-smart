import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { registerRedsysWebhook } from "./redsysWebhook";
import { registerSequraWebhook } from "./sequraWebhook";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { storageGetSignedUrl } from "./storage";
import { registerLegacyRedirects } from "./legacyRedirects";

const FICHA_MAP: Record<string, { key: string; fileName: string }> = {
  ESENZA: { key: "Ficha-ELORA-ESENZA-BL200_e0eb0386.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA.pdf" },
  "ESENZA-COMPACT": { key: "Ficha-ELORA-ESENZA-COMPACT-BL_8388860b.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA-Compact.pdf" },
  "ESENZA-SUSPENDIDO": { key: "Ficha-ELORA-ESENZA-SUSPENDIDO-BL_59147055.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA-Suspendido.pdf" },
  AURA: { key: "Ficha-ELORA-AURA-BL200_11c3b008.pdf", fileName: "Ficha-Tecnica-ELORA-AURA.pdf" },
  "AURA-COMPACT": { key: "Ficha-ELORA-AURA-COMPACT_4e9b8f67.pdf", fileName: "Ficha-Tecnica-ELORA-AURA-Compact.pdf" },
  "AURA-SUSPENDIDO": { key: "Ficha-ELORA-AURA-SUSPENDIDO_fbc02eb7.pdf", fileName: "Ficha-Tecnica-ELORA-AURA-Suspendido.pdf" },
};

/**
 * Construye la API compartida por el servidor actual y las funciones de Vercel.
 * No registra servidor HTTP ni contenido estático para mantener la UI intacta.
 */
export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerRedsysWebhook(app);
  registerSequraWebhook(app);
  registerLegacyRedirects(app);

  app.get("/api/download-ficha/:productId", async (req, res) => {
    const productId = req.params.productId?.toUpperCase();
    const ficha = FICHA_MAP[productId];
    if (!ficha) {
      res.status(404).send("Ficha técnica no encontrada");
      return;
    }

    try {
      const signedUrl = await storageGetSignedUrl(ficha.key);
      const pdfResp = await fetch(signedUrl);
      if (!pdfResp.ok) {
        res.status(502).send("Error al obtener el PDF");
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${ficha.fileName}"`);
      res.setHeader("Cache-Control", "no-store");
      res.end(Buffer.from(await pdfResp.arrayBuffer()));
    } catch (err) {
      console.error("[download-ficha] Error:", err);
      res.status(500).send("Error al generar el enlace de descarga");
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
