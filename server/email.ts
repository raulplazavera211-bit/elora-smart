import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2024/11/elora-logo.png";
const WHATSAPP_NUMBER = "34614451901";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido`;
const FROM_EMAIL = "Elora Smart <pedidos@elorasmart.com>";

export type OrderEmailData = {
  to: string;
  customerName: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
};

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    card: "Tarjeta bancaria",
    bizum: "Bizum",
    transfer: "Transferencia bancaria",
    cod: "Contrareembolso",
    paypal: "PayPal",
  };
  return labels[method] ?? method;
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d4; font-family: Georgia, serif; font-size: 14px; color: #2a2a2a;">
          ${item.name}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d4; font-family: Georgia, serif; font-size: 14px; color: #2a2a2a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e0d4; font-family: Georgia, serif; font-size: 14px; color: #2a2a2a; text-align: right;">
          ${(item.price * item.quantity).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de pedido — Elora Smart</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f0e8; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f0e8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e8e0d4;">

          <!-- HEADER -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 32px 40px; text-align: center;">
              <img src="${LOGO_URL}" alt="Elora Smart" width="140" style="display: block; margin: 0 auto; filter: brightness(0) invert(1);" />
              <p style="margin: 16px 0 0; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #c9a96e;">
                Inodoros Inteligentes
              </p>
            </td>
          </tr>

          <!-- HERO TEXT -->
          <tr>
            <td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #e8e0d4;">
              <p style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e;">
                Pedido confirmado
              </p>
              <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 28px; font-weight: normal; color: #0a0a0a; letter-spacing: 2px; text-transform: uppercase;">
                ¡Gracias, ${data.customerName}!
              </h1>
              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 15px; color: #555; line-height: 1.6;">
                Tu pedido <strong style="color: #0a0a0a;">#${data.orderNumber}</strong> ha sido recibido correctamente.<br />
                Gracias por ser parte de Elora — te contactaremos pronto para coordinar la entrega.
              </p>
            </td>
          </tr>

          <!-- RESUMEN DEL PEDIDO -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #999;">
                Resumen del pedido
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; font-weight: normal; text-align: left; padding-bottom: 10px; border-bottom: 2px solid #0a0a0a;">Producto</th>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; font-weight: normal; text-align: center; padding-bottom: 10px; border-bottom: 2px solid #0a0a0a;">Ud.</th>
                    <th style="font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; font-weight: normal; text-align: right; padding-bottom: 10px; border-bottom: 2px solid #0a0a0a;">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 16px 0 0; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #999;">
                      Total con IVA
                    </td>
                    <td style="padding: 16px 0 0; font-family: Georgia, serif; font-size: 22px; color: #0a0a0a; text-align: right;">
                      ${data.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding: 4px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: #27ae60; text-align: right;">
                      ✓ Envío gratis incluido
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- DIRECCIÓN + PAGO -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 16px; vertical-align: top;">
                    <div style="background-color: #f5f0e8; padding: 20px; border: 1px solid #e8e0d4;">
                      <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999;">Dirección de envío</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #2a2a2a; line-height: 1.7;">
                        ${data.shippingAddress.street}<br />
                        ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br />
                        ${data.shippingAddress.province}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 16px; vertical-align: top;">
                    <div style="background-color: #f5f0e8; padding: 20px; border: 1px solid #e8e0d4;">
                      <p style="margin: 0 0 10px; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999;">Método de pago</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 13px; color: #2a2a2a; line-height: 1.7;">
                        ${getPaymentMethodLabel(data.paymentMethod)}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHATSAPP CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <div style="border-top: 1px solid #e8e0d4; padding-top: 32px;">
                <p style="margin: 0 0 20px; font-family: Arial, sans-serif; font-size: 14px; color: #555; line-height: 1.6;">
                  ¿Tienes alguna pregunta sobre tu pedido?<br />
                  Estamos en Galicia y te atendemos personalmente.
                </p>
                <a href="${WHATSAPP_URL}"
                   style="display: inline-block; background-color: #25d366; color: #ffffff; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 32px; font-weight: bold;">
                  💬 Contactar por WhatsApp
                </a>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 28px 40px; text-align: center;">
              <p style="margin: 0 0 8px; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e;">
                Elora Smart
              </p>
              <p style="margin: 0 0 4px; font-family: Arial, sans-serif; font-size: 11px; color: #666;">
                info@elorasmart.com · +34 614 451 901
              </p>
              <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: #444;">
                Galicia, España
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `✅ Pedido #${data.orderNumber} confirmado — Elora Smart`,
      html: buildOrderConfirmationHtml(data),
    });

    if (error) {
      console.error("[Email] Error enviando confirmación de pedido:", error);
      return false;
    }

    console.log(`[Email] Confirmación enviada a ${data.to} para pedido #${data.orderNumber}`);
    return true;
  } catch (err) {
    console.error("[Email] Excepción enviando email:", err);
    return false;
  }
}
