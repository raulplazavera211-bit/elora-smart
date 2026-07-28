/**
 * ─── Sequra IPN Webhook Handler ──────────────────────────────────────────────
 *
 * Sequra llama a esta URL (POST /api/sequra/notification) cuando aprueba
 * o rechaza una solicitud de crédito.
 *
 * Flujo:
 *   1. Sequra POST → /api/sequra/notification
 *   2. Verificar firma HMAC (opcional pero recomendado)
 *   3. Confirmar el pedido en Sequra (PUT {orderUrl}/confirm)
 *   4. Actualizar paymentStatus en la DB
 *   5. Notificar al propietario y enviar email de confirmación
 */
import type { Express, Request, Response } from "express";
import { confirmSequraOrder, verifySequraSignature } from "./sequra";
import { updateSequraPaymentStatus, getOrderWithItems } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendOrderConfirmationEmail } from "./email";

export function registerSequraWebhook(app: Express): void {
  /**
   * POST /api/sequra/notification
   * Endpoint IPN que Sequra llama al aprobar/rechazar una solicitud.
   */
  app.post("/api/sequra/notification", async (req: Request, res: Response) => {
    try {
      // Optional signature verification
      const signature = req.headers["x-sequra-signature"] as string | undefined;
      if (signature) {
        const rawBody = JSON.stringify(req.body);
        const valid = verifySequraSignature(rawBody, signature);
        if (!valid) {
          console.warn("[Sequra IPN] Firma inválida");
          res.status(401).send("Unauthorized");
          return;
        }
      }

      const body = req.body as {
        order_ref?: string;
        order_url?: string;
        event?: string;
        approved?: boolean;
      };

      console.log("[Sequra IPN] Notificación recibida:", JSON.stringify(body));

      // Sequra sends the order URL and approval status
      const orderUrl = body.order_url;
      const approved = body.approved ?? body.event === "approved";

      if (!orderUrl) {
        console.warn("[Sequra IPN] Sin order_url en la notificación");
        res.status(200).send("OK");
        return;
      }

      const paymentStatus = approved ? "paid" : "failed";

      if (approved) {
        // Confirm the order with Sequra
        try {
          await confirmSequraOrder(orderUrl);
          console.log("[Sequra IPN] Pedido confirmado en Sequra:", orderUrl);
        } catch (err) {
          console.error("[Sequra IPN] Error confirmando pedido en Sequra:", err);
        }
      }

      // Update payment status in DB
      const { orderId } = await updateSequraPaymentStatus(orderUrl, paymentStatus);

      if (approved && orderId) {
        const order = await getOrderWithItems(orderId);
        if (order) {
          // Notify owner
          notifyOwner({
            title: `✅ Pago Sequra confirmado — Pedido #${orderId} — ${order.total}€`,
            content: [
              `Cliente: ${order.customerName}`,
              `Email: ${order.customerEmail}`,
              order.customerPhone ? `Teléfono: ${order.customerPhone}` : null,
              `Total: ${order.total}€`,
              `Método: seQura (financiación)`,
            ]
              .filter(Boolean)
              .join("\n"),
          }).catch(() => {});

          // Send confirmation email to customer
          sendOrderConfirmationEmail({
            to: order.customerEmail,
            customerName: order.customerName,
            orderNumber: String(orderId),
            items: order.items.map(i => ({
              name: i.productName,
              quantity: i.quantity,
              price: Number(i.unitPrice),
            })),
            total: Number(order.total),
            shippingAddress: {
              street: order.shippingAddress ?? order.address ?? "",
              city: order.shippingCity ?? "",
              province: order.shippingProvince ?? "",
              postalCode: order.shippingPostalCode ?? "",
            },
            paymentMethod: "sequra",
          }).catch(() => {});
        }
      }

      // Sequra expects HTTP 200
      res.status(200).send("OK");
    } catch (err) {
      console.error("[Sequra IPN] Error procesando notificación:", err);
      res.status(200).send("OK");
    }
  });
}
