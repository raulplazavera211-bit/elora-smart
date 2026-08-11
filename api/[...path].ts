import { createApp } from "../server/app";

/**
 * Adaptador de la API existente para Vercel. Exportar la instancia Express
 * permite que Vercel conserve las mismas rutas:
 * /api/trpc, /api/redsys/notification, /api/sequra/notification y /manus-storage.
 */
export default createApp();
