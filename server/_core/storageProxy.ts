import type { Express } from "express";
import { list } from "@vercel/blob";

async function getVercelBlobUrl(key: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const result = await list({ prefix: key, token });
  return result.blobs.find((blob) => blob.pathname === key)?.url ?? null;
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    // En Vercel los activos se conservan en Blob. El navegador continúa usando
    // exactamente las mismas rutas /manus-storage/ que usa la interfaz actual.
    try {
      const blobUrl = await getVercelBlobUrl(key);
      if (blobUrl) {
        res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
        res.redirect(307, blobUrl);
        return;
      }
    } catch (err) {
      console.error("[StorageProxy] Vercel Blob lookup failed:", err);
      res.status(502).send("Blob storage error");
      return;
    }

    // No se usa Manus como respaldo: todos los activos históricos viven en
    // Vercel Blob y deben conservar la misma ruta pública.
    res.status(404).send("Blob asset not found");
  });
}
