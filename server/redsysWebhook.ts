/**
 * ─── Redsys IPN Webhook Handler ──────────────────────────────────────────────
 *
 * Redsys llama a esta URL (POST /api/redsys/notification) cuando se completa
 * una transacción (aprobada o rechazada). El servidor debe responder con 200.
 *
 * Flujo:
 *   1. Redsys POST → /api/redsys/notification
 *   2. Verificar firma y extraer resultado
 *   3. Actualizar paymentStatus en la DB
 *   4. Notificar al propietario si el pago fue aprobado
 */

import type { Express, Request, Response } from "express";
import { processRedsysNotification } from "./redsys";
import { updatePaymentStatus, getOrderByRedsysId } from "./db";
import { notifyOwner } from "./_core/notification";

export function registerRedsysWebhook(app: Express): void {
  /**
   * POST /api/redsys/notification
   * Endpoint IPN que Redsys llama al completar una transacción.
   * Redsys espera una respuesta HTTP 200 (sin importar el cuerpo).
   */
  app.post("/api/redsys/notification", async (req: Request, res: Response) => {
    try {
      const { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } = req.body as {
        Ds_SignatureVersion?: string;
        Ds_MerchantParameters?: string;
        Ds_Signature?: string;
      };

      if (!Ds_SignatureVersion || !Ds_MerchantParameters || !Ds_Signature) {
        console.warn("[Redsys IPN] Notificación recibida sin los campos requeridos");
        res.status(400).send("Bad Request");
        return;
      }

      // Verificar firma y extraer datos
      const result = processRedsysNotification({
        Ds_SignatureVersion,
        Ds_MerchantParameters,
        Ds_Signature,
      });

      console.log(
        `[Redsys IPN] Orden: ${result.redsysOrderId} | Código: ${result.responseCode} | OK: ${result.success}`
      );

      // Actualizar estado de pago en la DB
      const paymentStatus = result.success ? "paid" : "failed";
      const { orderId } = await updatePaymentStatus(result.redsysOrderId, paymentStatus);

      // Notificar al propietario si el pago fue aprobado
      if (result.success && orderId) {
        const order = await getOrderByRedsysId(result.redsysOrderId);
        if (order) {
          notifyOwner({
            title: `✅ Pago confirmado — Pedido #${orderId} — ${order.total}€`,
            content: [
              `Cliente: ${order.customerName}`,
              `Email: ${order.customerEmail}`,
              order.customerPhone ? `Teléfono: ${order.customerPhone}` : null,
              `Total: ${order.total}€`,
              `Código autorización: ${result.authCode ?? "N/A"}`,
              `ID Redsys: ${result.redsysOrderId}`,
            ]
              .filter(Boolean)
              .join("\n"),
          }).catch(() => {});
        }
      }

      // Redsys no necesita cuerpo en la respuesta, solo HTTP 200
      res.status(200).send("OK");
    } catch (err) {
      console.error("[Redsys IPN] Error procesando notificación:", err);
      // Devolver 200 igualmente para evitar reintentos de Redsys
      res.status(200).send("OK");
    }
  });
}
