import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";
const LOGO_URL_DARK = "https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png";
const WHATSAPP_NUMBER = "34614451901";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20pedido`;
const FROM_EMAIL = "Elora Smart <pedidos@elorasmart.online>";

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

// ─── FICHA TÉCNICA ────────────────────────────────────────────────────────────

export type FichaTecnicaEmailData = {
  to: string;
  nombre: string;
  telefono?: string;
  productName: string;
  pdfUrl: string;
  pdfFileName: string;
};

function buildFichaTecnicaHtml(data: FichaTecnicaEmailData): string {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, tengo una consulta sobre el ${data.productName}`)}` ;
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ficha Técnica ${data.productName} — Elora Smart</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-body { padding: 28px 24px !important; }
      .email-header { padding: 28px 24px !important; }
      .email-footer { padding: 20px 24px !important; }
      .btn-row td { display: block !important; padding: 0 0 12px 0 !important; text-align: center !important; }
      h1.product-title { font-size: 22px !important; letter-spacing: 2px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ec;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec;padding:40px 16px;">
    <tr><td align="center">

      <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- ══ HEADER ══ -->
        <tr>
          <td class="email-header" style="background-color:#0a0a0a;padding:36px 48px 28px;text-align:center;">
            <img src="${LOGO_URL}" alt="Elora Smart" width="130" height="auto" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
            <p style="margin:14px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Inodoros Inteligentes Japoneses</p>
          </td>
        </tr>

        <!-- ══ GOLDEN STRIP ══ -->
        <tr><td style="background-color:#c9a96e;height:3px;"></td></tr>

        <!-- ══ EYEBROW + TITLE ══ -->
        <tr>
          <td class="email-body" style="padding:44px 48px 0;text-align:center;background-color:#ffffff;">
            <p style="margin:0 0 10px;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Ficha Técnica</p>
            <h1 class="product-title" style="margin:0 0 6px;font-size:26px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#0a0a0a;font-family:Georgia,serif;">${data.productName}</h1>
            <div style="width:40px;height:2px;background-color:#c9a96e;margin:16px auto 0;"></div>
          </td>
        </tr>

        <!-- ══ GREETING ══ -->
        <tr>
          <td class="email-body" style="padding:28px 48px 0;text-align:center;background-color:#ffffff;">
            <p style="margin:0;font-size:17px;color:#0a0a0a;line-height:1.6;font-family:'Helvetica Neue',Arial,sans-serif;">
              Hola, <strong style="color:#0a0a0a;font-weight:700;">${data.nombre}</strong> 👋
            </p>
            <p style="margin:12px 0 0;font-size:14px;color:#666666;line-height:1.8;font-family:'Helvetica Neue',Arial,sans-serif;">
              Aquí tienes la ficha técnica del <strong style="color:#0a0a0a;">${data.productName}</strong> que solicitaste.
              Pulsa el botón para descargarla. Si ya comenzó la descarga automática, este correo te servirá como referencia.
            </p>
          </td>
        </tr>

        <!-- ══ CTA DOWNLOAD ══ -->
        <tr>
          <td class="email-body" style="padding:36px 48px;text-align:center;background-color:#ffffff;">
            <a href="${data.pdfUrl}" target="_blank"
               style="display:inline-block;background-color:#0a0a0a;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:18px 44px;border-radius:2px;">
              ↓ &nbsp; Descargar Ficha Técnica
            </a>
          </td>
        </tr>

        <!-- ══ DIVIDER ══ -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background-color:#eeebe5;"></div></td></tr>

        <!-- ══ CONTACT BLOCK ══ -->
        <tr>
          <td class="email-body" style="padding:36px 48px;text-align:center;background-color:#ffffff;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">¿Tienes alguna duda?</p>
            <p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.7;font-family:'Helvetica Neue',Arial,sans-serif;">
              Responde a este correo o contáctanos directamente.<br />
              Estamos en España y te atendemos en persona.
            </p>
            <table class="btn-row" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="mailto:info@elorasmart.com"
                     style="display:inline-block;background-color:#ffffff;border:1px solid #cccccc;color:#333333;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:13px 24px;border-radius:2px;">
                    ✉ &nbsp; Email
                  </a>
                </td>
                <td style="padding-left:10px;">
                  <a href="${waUrl}"
                     style="display:inline-block;background-color:#25d366;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:13px 24px;border-radius:2px;">
                    💬 &nbsp; WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ GOLDEN STRIP BOTTOM ══ -->
        <tr><td style="background-color:#c9a96e;height:3px;"></td></tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td class="email-footer" style="background-color:#0a0a0a;padding:28px 48px;text-align:center;">
            <img src="${LOGO_URL}" alt="Elora Smart" width="90" height="auto" style="display:block;margin:0 auto 14px;filter:brightness(0) invert(1);opacity:0.7;" />
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Elora Smart</p>
            <p style="margin:0 0 4px;font-size:11px;color:#666666;font-family:'Helvetica Neue',Arial,sans-serif;">
              <a href="mailto:info@elorasmart.com" style="color:#888888;text-decoration:none;">info@elorasmart.com</a>
              &nbsp;·&nbsp;
              <a href="tel:+34614451901" style="color:#888888;text-decoration:none;">+34 614 45 19 01</a>
            </p>
            <p style="margin:8px 0 0;font-size:10px;color:#444444;font-family:'Helvetica Neue',Arial,sans-serif;">España · <a href="https://elorasmart.online" style="color:#555555;text-decoration:none;">elorasmart.online</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}

function buildFichaTecnicaNotificationHtml(data: FichaTecnicaEmailData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><title>Nueva solicitud de ficha técnica</title></head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#111111;border:1px solid #222222;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:28px 40px;text-align:center;border-bottom:1px solid #1e1e1e;">
            <img src="${LOGO_URL}" alt="Elora Smart" width="110" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
            <p style="margin:10px 0 0;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">Panel de notificaciones</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">Nueva solicitud</p>
            <h2 style="margin:0 0 24px;font-size:20px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:#ffffff;font-family:Georgia,serif;">Ficha Técnica Solicitada</h2>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Producto</span><br />
                  <span style="font-size:15px;color:#c9a96e;font-weight:600;">${data.productName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Nombre</span><br />
                  <span style="font-size:15px;color:#e0e0e0;">${data.nombre}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Email</span><br />
                  <a href="mailto:${data.to}" style="font-size:15px;color:#c9a96e;text-decoration:none;">${data.to}</a>
                </td>
              </tr>
              ${data.telefono ? `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Teléfono</span><br />
                  <a href="tel:${data.telefono}" style="font-size:15px;color:#e0e0e0;text-decoration:none;">${data.telefono}</a>
                </td>
              </tr>` : ''}
            </table>

            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${data.to}"
                 style="display:inline-block;background-color:#c9a96e;color:#0a0a0a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 36px;">
                ✉ &nbsp; Responder a ${data.nombre}
              </a>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:20px 40px;text-align:center;border-top:1px solid #1e1e1e;">
            <p style="margin:0;font-size:10px;color:#444444;">Elora Smart · info@elorasmart.com · +34 614 451 901</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}

export async function sendFichaTecnicaEmail(data: FichaTecnicaEmailData): Promise<boolean> {
  try {
    // Email al cliente con reply-to a info@elorasmart.com
    const { error: clientError } = await resend.emails.send({
      from: "Elora Smart <pedidos@elorasmart.online>",
      to: data.to,
      replyTo: "info@elorasmart.com",
      subject: `Ficha Técnica ${data.productName} — Elora Smart`,
      html: buildFichaTecnicaHtml(data),
    });

    if (clientError) {
      console.error("[Email] Error enviando ficha técnica al cliente:", clientError);
      return false;
    }

    // Notificación al propietario
    resend.emails.send({
      from: "Elora Smart <pedidos@elorasmart.online>",
      to: "info@elorasmart.com",
      replyTo: data.to,
      subject: `📄 Nueva solicitud de ficha: ${data.productName} — ${data.nombre}`,
      html: buildFichaTecnicaNotificationHtml(data),
    }).catch(() => {});

    console.log(`[Email] Ficha técnica enviada a ${data.to} para ${data.productName}`);
    return true;
  } catch (err) {
    console.error("[Email] Excepción enviando ficha técnica:", err);
    return false;
  }
}
