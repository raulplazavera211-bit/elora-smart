import express from "express";
import { registerStorageProxy } from "./_core/storageProxy";

/**
 * Función dedicada a los activos históricos. No inicializa OAuth, correo ni
 * pasarelas de pago para que `/manus-storage/*` pueda atenderse desde Blob.
 */
const app = express();
registerStorageProxy(app);

export default app;
