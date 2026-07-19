import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { registerRedsysWebhook } from "../redsysWebhook";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { storageGetSignedUrl } from "../storage";
import { registerLegacyRedirects } from "../legacyRedirects";

// Mapeo de producto → clave de storage (sin prefijo /manus-storage/)
const FICHA_MAP: Record<string, { key: string; fileName: string }> = {
  "ESENZA": { key: "Ficha-ELORA-ESENZA-BL200_e0eb0386.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA.pdf" },
  "ESENZA-COMPACT": { key: "Ficha-ELORA-ESENZA-COMPACT-BL_8388860b.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA-Compact.pdf" },
  "ESENZA-SUSPENDIDO": { key: "Ficha-ELORA-ESENZA-SUSPENDIDO-BL_59147055.pdf", fileName: "Ficha-Tecnica-ELORA-ESENZA-Suspendido.pdf" },
  "AURA": { key: "Ficha-ELORA-AURA-BL200_11c3b008.pdf", fileName: "Ficha-Tecnica-ELORA-AURA.pdf" },
  "AURA-COMPACT": { key: "Ficha-ELORA-AURA-COMPACT_4e9b8f67.pdf", fileName: "Ficha-Tecnica-ELORA-AURA-Compact.pdf" },
  "AURA-SUSPENDIDO": { key: "Ficha-ELORA-AURA-SUSPENDIDO_fbc02eb7.pdf", fileName: "Ficha-Tecnica-ELORA-AURA-Suspendido.pdf" },
};

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerRedsysWebhook(app);
  registerLegacyRedirects(app);

  // ── Descarga de ficha técnica (genera URL pre-firmada fresca en cada clic) ──
  app.get("/api/download-ficha/:productId", async (req, res) => {
    const productId = req.params.productId?.toUpperCase();
    const ficha = FICHA_MAP[productId];
    if (!ficha) {
      res.status(404).send("Ficha técnica no encontrada");
      return;
    }
    try {
      const signedUrl = await storageGetSignedUrl(ficha.key);
      // Hacer proxy del PDF para forzar descarga (evita Access Denied en S3 y permite Content-Disposition)
      const pdfResp = await fetch(signedUrl);
      if (!pdfResp.ok) {
        res.status(502).send("Error al obtener el PDF");
        return;
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${ficha.fileName}"`);
      res.setHeader("Cache-Control", "no-store");
      // Stream the PDF directly to the client
      const buffer = await pdfResp.arrayBuffer();
      res.end(Buffer.from(buffer));
    } catch (err) {
      console.error("[download-ficha] Error:", err);
      res.status(500).send("Error al generar el enlace de descarga");
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
