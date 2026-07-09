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
  customerPhone?: string;
  customerEmail?: string;
  orderNumber: string;
  items: { name: string; quantity: number; price: number; img?: string }[];
  total: number;
  shippingCost?: number;
  shippingCountry?: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
  discountAmount?: number;
  authCode?: string;
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
  const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = data.shippingCost ?? 0;
  const discount = data.discountAmount ?? 0;

  const paymentInstructions: Record<string, string> = {
    transfer: `<div style="background-color:#fffbf0;border:1px solid #f0e0a0;padding:20px 24px;margin-top:20px;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#b8860b;">Instrucciones de pago — Transferencia bancaria</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#2a2a2a;line-height:1.8;">
        Realiza una transferencia por el importe exacto de <strong>${data.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</strong> indicando en el concepto tu número de pedido <strong>#${data.orderNumber}</strong>.<br/><br/>
        Banco: <strong>Banco Santander</strong><br/>
        Titular: <strong>ELORA SMART SL</strong><br/>
        IBAN: <strong>ES00 0000 0000 0000 0000 0000</strong>
      </p>
    </div>`,
    cod: `<div style="background-color:#f0fff4;border:1px solid #a0e0b0;padding:20px 24px;margin-top:20px;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#2e7d32;">Pago contra reembolso</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#2a2a2a;line-height:1.8;">
        Pagarás <strong>${data.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</strong> en efectivo al transportista en el momento de la entrega. Ten preparado el importe exacto.
      </p>
    </div>`,
  };

  const paymentBlock = paymentInstructions[data.paymentMethod] ?? "";

  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e8e0d4;vertical-align:middle;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${item.img ? `<img src="${item.img}" alt="${item.name}" width="48" height="48" style="width:48px;height:48px;object-fit:cover;border:1px solid #e8e0d4;border-radius:2px;flex-shrink:0;" />` : ""}
            <span style="font-family:Arial,sans-serif;font-size:14px;color:#2a2a2a;">${item.name}</span>
          </div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #e8e0d4;font-family:Arial,sans-serif;font-size:14px;color:#2a2a2a;text-align:center;vertical-align:middle;">${item.quantity}</td>
        <td style="padding:14px 0;border-bottom:1px solid #e8e0d4;font-family:Georgia,serif;font-size:14px;color:#2a2a2a;text-align:right;vertical-align:middle;white-space:nowrap;">${(item.price * item.quantity).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de pedido #${data.orderNumber} — Elora Smart</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e8e0d4;">

      <!-- HEADER -->
      <tr>
        <td style="background-color:#0a0a0a;padding:32px 40px;text-align:center;">
          <img src="${LOGO_URL}" alt="Elora Smart" width="130" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
          <p style="margin:14px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;">Inodoros Inteligentes</p>
        </td>
      </tr>
      <!-- GOLD STRIP -->
      <tr><td style="background-color:#c9a96e;height:3px;"></td></tr>

      <!-- HERO -->
      <tr>
        <td style="padding:40px 40px 28px;text-align:center;border-bottom:1px solid #e8e0d4;">
          <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">✅ Pedido confirmado</p>
          <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:28px;font-weight:normal;color:#0a0a0a;letter-spacing:2px;text-transform:uppercase;">¡Gracias, ${data.customerName}!</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">
            Tu pedido <strong style="color:#0a0a0a;font-size:17px;">#${data.orderNumber}</strong> ha sido recibido correctamente.<br />
            Nos pondremos en contacto contigo pronto para coordinar la entrega.
          </p>
          <div style="display:inline-block;background-color:#f5f0e8;border:1px solid #e8e0d4;padding:10px 24px;">
            <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;">Fecha del pedido</span>
            <span style="display:block;font-family:Georgia,serif;font-size:15px;color:#0a0a0a;margin-top:4px;">${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</span>
          </div>
        </td>
      </tr>

      <!-- PRODUCTOS -->
      <tr>
        <td style="padding:32px 40px 0;">
          <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#999;">Productos del pedido</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr style="border-bottom:2px solid #0a0a0a;">
                <th style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:normal;text-align:left;padding-bottom:10px;">Producto</th>
                <th style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:normal;text-align:center;padding-bottom:10px;">Ud.</th>
                <th style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:normal;text-align:right;padding-bottom:10px;">Importe</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
            <tfoot>
              ${discount > 0 ? `<tr><td colspan="2" style="padding:10px 0 0;font-size:12px;color:#27ae60;">Descuento (${data.couponCode ?? "cupón"})</td><td style="padding:10px 0 0;font-size:12px;color:#27ae60;text-align:right;">−${discount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</td></tr>` : ""}
              <tr><td colspan="2" style="padding:10px 0 0;font-size:11px;color:#999;letter-spacing:1px;">Envío</td><td style="padding:10px 0 0;font-size:13px;color:${shippingCost === 0 ? "#27ae60" : "#0a0a0a"};text-align:right;">${shippingCost === 0 ? "Gratis ✔" : shippingCost.toLocaleString("es-ES", { minimumFractionDigits: 2 }) + " €"}</td></tr>
              <tr style="border-top:2px solid #0a0a0a;"><td colspan="2" style="padding:14px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#999;">Total con IVA</td><td style="padding:14px 0 0;font-family:Georgia,serif;font-size:24px;color:#0a0a0a;text-align:right;">${data.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €</td></tr>
            </tfoot>
          </table>
        </td>
      </tr>

      <!-- DIRECCIÓN + PAGO -->
      <tr>
        <td style="padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-right:12px;vertical-align:top;">
                <div style="background-color:#f5f0e8;padding:18px;border:1px solid #e8e0d4;">
                  <p style="margin:0 0 8px;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#999;">Dirección de envío</p>
                  <p style="margin:0;font-size:13px;color:#2a2a2a;line-height:1.8;">
                    ${data.shippingAddress.street}<br />
                    ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br />
                    ${data.shippingAddress.province}${data.shippingCountry && data.shippingCountry !== "ES" ? `<br />${data.shippingCountry}` : ""}
                  </p>
                </div>
              </td>
              <td width="50%" style="padding-left:12px;vertical-align:top;">
                <div style="background-color:#f5f0e8;padding:18px;border:1px solid #e8e0d4;">
                  <p style="margin:0 0 8px;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#999;">Método de pago</p>
                  <p style="margin:0;font-size:13px;color:#2a2a2a;line-height:1.8;font-weight:600;">${getPaymentMethodLabel(data.paymentMethod)}</p>
                  ${data.authCode ? `<p style="margin:6px 0 0;font-size:11px;color:#27ae60;">Cód. autorización: ${data.authCode}</p>` : ""}
                </div>
              </td>
            </tr>
          </table>
          ${paymentBlock}
          ${data.notes ? `<div style="margin-top:16px;background-color:#fffef0;border:1px solid #e8e0a0;padding:16px 18px;"><p style="margin:0 0 6px;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#999;">Notas del pedido</p><p style="margin:0;font-size:13px;color:#2a2a2a;line-height:1.7;">${data.notes}</p></div>` : ""}
        </td>
      </tr>

      <!-- GARANTIA REMINDER -->
      <tr>
        <td style="padding:0 40px 28px;">
          <div style="background-color:#0a0a0a;padding:20px 24px;text-align:center;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">Tu protección Elora</p>
            <p style="margin:0;font-size:13px;color:#e0e0e0;line-height:1.7;">10 años de garantía en cerámica &nbsp;·&nbsp; Servicio técnico en español &nbsp;·&nbsp; Repuestos garantizados 10 años</p>
          </div>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 40px 40px;text-align:center;border-top:1px solid #e8e0d4;padding-top:32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.7;">¿Tienes alguna pregunta sobre tu pedido?<br />Estamos en Galicia y te atendemos personalmente.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="padding-right:8px;">
                <a href="${WHATSAPP_URL}" style="display:inline-block;background-color:#25d366;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 24px;">💬 WhatsApp</a>
              </td>
              <td style="padding-left:8px;">
                <a href="mailto:info@elorasmart.com" style="display:inline-block;background-color:#0a0a0a;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 24px;">✉ Email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background-color:#0a0a0a;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">Elora Smart</p>
          <p style="margin:0 0 4px;font-size:11px;color:#666;">info@elorasmart.com &nbsp;·&nbsp; +34 614 451 901</p>
          <p style="margin:0 0 8px;font-size:11px;color:#444;">ELORA SMART SL &nbsp;·&nbsp; B23990492 &nbsp;·&nbsp; Galicia, España</p>
          <p style="margin:0;font-size:10px;color:#333;">
            <a href="https://elorasmart.online/politica-privacidad" style="color:#555;text-decoration:none;">Política de privacidad</a> &nbsp;·&nbsp;
            <a href="https://elorasmart.online/terminos-condiciones" style="color:#555;text-decoration:none;">Términos y condiciones</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
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

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO PRIVADO — Notificación al propietario vía Resend
// ─────────────────────────────────────────────────────────────────────────────

export type CatalogRequestEmailData = {
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje?: string | null;
  idiomaCatalogo: "es" | "en" | "fr" | "pt";
};

const CATALOG_PDF_URLS: Record<string, string> = {
  es: "https://elorasmart.online/manus-storage/catalogo-es_1e20b742.pdf",
  en: "https://elorasmart.online/manus-storage/catalogo-en_8e026862.pdf",
  fr: "https://elorasmart.online/manus-storage/catalogo-fr_ebd56ebd.pdf",
  pt: "https://elorasmart.online/manus-storage/catalogo-pt_e0ff7e89.pdf",
};

const CATALOG_LANG_LABELS: Record<string, string> = {
  es: "Español 🇪🇸",
  en: "English 🇬🇧",
  fr: "Français 🇫🇷",
  pt: "Português 🇵🇹",
};

const CATALOG_LANG_FLAGS: Record<string, string> = {
  es: "🇪🇸",
  en: "🇬🇧",
  fr: "🇫🇷",
  pt: "🇵🇹",
};

function buildCatalogRequestHtml(data: CatalogRequestEmailData): string {
  const pdfUrl = CATALOG_PDF_URLS[data.idiomaCatalogo];
  const langLabel = CATALOG_LANG_LABELS[data.idiomaCatalogo];
  const langFlag = CATALOG_LANG_FLAGS[data.idiomaCatalogo];
  const waLink = data.telefono
    ? `https://wa.me/${data.telefono.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${data.nombre}, te escribo desde Elora Smart en respuesta a tu solicitud de catálogo.`)}`
    : null;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Solicitud de catálogo — Elora Smart</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border:1px solid #1e1e1e;">
        <!-- HEADER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:32px 40px;text-align:center;border-bottom:2px solid #c9a96e;">
            <img src="https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png" alt="Elora Smart" width="120" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
            <p style="margin:12px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;">Inodoros Inteligentes</p>
          </td>
        </tr>
        <!-- HERO -->
        <tr>
          <td style="padding:36px 40px 24px;text-align:center;border-bottom:1px solid #1e1e1e;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;">📬 Nueva solicitud</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:#f0f0f0;letter-spacing:2px;text-transform:uppercase;line-height:1.2;">Catálogo Privado</h1>
            <p style="margin:10px 0 0;font-size:13px;color:#888888;letter-spacing:1px;">
              Solicitado en <strong style="color:#c9a96e;">${langFlag} ${langLabel}</strong>
            </p>
          </td>
        </tr>
        <!-- DATOS -->
        <tr>
          <td style="padding:28px 40px;">
            <p style="margin:0 0 18px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#666666;">Datos del contacto</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Nombre</span><br />
                  <span style="font-size:16px;color:#f0f0f0;font-family:Georgia,serif;">${data.nombre}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Email</span><br />
                  <a href="mailto:${data.email}" style="font-size:15px;color:#c9a96e;text-decoration:none;">${data.email}</a>
                </td>
              </tr>
              ${data.telefono ? `<tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Teléfono</span><br />
                  <a href="tel:${data.telefono}" style="font-size:15px;color:#f0f0f0;text-decoration:none;">${data.telefono}</a>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Idioma catálogo</span><br />
                  <span style="font-size:18px;line-height:1.4;">${langFlag}</span>
                  <span style="font-size:15px;color:#c9a96e;margin-left:6px;">${langLabel}</span>
                </td>
              </tr>
              ${data.mensaje ? `<tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#666666;">Mensaje</span><br />
                  <p style="margin:6px 0 0;font-size:14px;color:#cccccc;line-height:1.6;white-space:pre-wrap;">${data.mensaje}</p>
                </td>
              </tr>` : ""}
            </table>
          </td>
        </tr>
        <!-- CTA PDF -->
        <tr>
          <td style="padding:8px 40px 28px;text-align:center;">
            <p style="margin:0 0 14px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#666666;">Catálogo solicitado</p>
            <a href="${pdfUrl}" style="display:inline-block;background-color:#c9a96e;color:#0a0a0a;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 36px;margin-bottom:10px;">
              📄 &nbsp; Abrir catálogo ${langFlag}
            </a>
            <p style="margin:10px 0 0;font-size:11px;color:#555555;word-break:break-all;">${pdfUrl}</p>
          </td>
        </tr>
        <!-- ACCIONES -->
        <tr>
          <td style="padding:0 40px 32px;text-align:center;border-top:1px solid #1e1e1e;">
            <p style="margin:20px 0 14px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#666666;">Responder al contacto</p>
            <a href="mailto:${data.email}?subject=Cat%C3%A1logo%20Elora%20Smart"
               style="display:inline-block;background-color:#0a0a0a;border:1px solid #c9a96e;color:#c9a96e;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 28px;margin:4px;">
              ✉ &nbsp; Responder por email
            </a>
            ${waLink ? `<a href="${waLink}" style="display:inline-block;background-color:#25d366;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 28px;margin:4px;">
              💬 &nbsp; WhatsApp
            </a>` : ""}
          </td>
        </tr>
        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:20px 40px;text-align:center;border-top:1px solid #1e1e1e;">
            <p style="margin:0;font-size:10px;color:#444444;letter-spacing:1px;">Elora Smart · info@elorasmart.com · +34 614 451 901</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendCatalogRequestEmail(data: CatalogRequestEmailData): Promise<boolean> {
  try {
    const langLabel = CATALOG_LANG_LABELS[data.idiomaCatalogo];
    const langFlag = CATALOG_LANG_FLAGS[data.idiomaCatalogo];
    const { error } = await resend.emails.send({
      from: "Elora Smart <pedidos@elorasmart.online>",
      to: "info@elorasmart.com",
      replyTo: data.email,
      subject: `📬 Catálogo ${langFlag} ${langLabel} — ${data.nombre}`,
      html: buildCatalogRequestHtml(data),
    });
    if (error) {
      console.error("[Email] Error enviando notificación de catálogo:", error);
      return false;
    }
    console.log(`[Email] Notificación catálogo enviada para ${data.nombre} (${data.idiomaCatalogo})`);
    return true;
  } catch (err) {
    console.error("[Email] Excepción enviando notificación de catálogo:", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO PRIVADO — Email al CLIENTE con descarga + contacto
// ─────────────────────────────────────────────────────────────────────────────

const CATALOG_CLIENT_COPY: Record<string, {
  subject: string; greeting: string; intro: string; downloadBtn: string;
  contactTitle: string; contactBody: string; waBtn: string; phoneBtn: string;
  footerNote: string;
}> = {
  es: {
    subject: "Tu catálogo Elora Smart está listo",
    greeting: "Hola",
    intro: "Gracias por tu interés en Elora Smart. Aquí tienes el catálogo que solicitaste. Puedes descargarlo con el botón de abajo.",
    downloadBtn: "Descargar catálogo",
    contactTitle: "¿Tienes alguna pregunta?",
    contactBody: "Estamos en Galicia y te atendemos personalmente. Escríbenos o llámanos cuando quieras.",
    waBtn: "WhatsApp",
    phoneBtn: "Llamar",
    footerNote: "Elora Smart · Inodoros Inteligentes · Galicia, España",
  },
  en: {
    subject: "Your Elora Smart catalogue is ready",
    greeting: "Hello",
    intro: "Thank you for your interest in Elora Smart. Here is the catalogue you requested. Download it using the button below.",
    downloadBtn: "Download catalogue",
    contactTitle: "Any questions?",
    contactBody: "We are based in Galicia, Spain, and happy to assist you personally. Write or call us anytime.",
    waBtn: "WhatsApp",
    phoneBtn: "Call us",
    footerNote: "Elora Smart · Smart Toilets · Galicia, Spain",
  },
  fr: {
    subject: "Votre catalogue Elora Smart est prêt",
    greeting: "Bonjour",
    intro: "Merci pour votre intérêt pour Elora Smart. Voici le catalogue que vous avez demandé. Téléchargez-le en cliquant sur le bouton ci-dessous.",
    downloadBtn: "Télécharger le catalogue",
    contactTitle: "Des questions ?",
    contactBody: "Nous sommes en Galice, Espagne, et nous vous accompagnons personnellement. Écrivez-nous ou appelez-nous quand vous voulez.",
    waBtn: "WhatsApp",
    phoneBtn: "Appeler",
    footerNote: "Elora Smart · Toilettes Intelligentes · Galice, Espagne",
  },
  pt: {
    subject: "O seu catálogo Elora Smart está pronto",
    greeting: "Olá",
    intro: "Obrigado pelo seu interesse na Elora Smart. Aqui está o catálogo que solicitou. Faça o download com o botão abaixo.",
    downloadBtn: "Descarregar catálogo",
    contactTitle: "Tem alguma dúvida?",
    contactBody: "Estamos na Galiza, Espanha, e atendemos pessoalmente. Escreva-nos ou ligue quando quiser.",
    waBtn: "WhatsApp",
    phoneBtn: "Ligar",
    footerNote: "Elora Smart · Sanitas Inteligentes · Galiza, Espanha",
  },
};

function buildCatalogClientHtml(data: CatalogRequestEmailData): string {
  const pdfUrl = CATALOG_PDF_URLS[data.idiomaCatalogo];
  const copy = CATALOG_CLIENT_COPY[data.idiomaCatalogo];
  const waText = encodeURIComponent(
    data.idiomaCatalogo === "en" ? "Hello, I have a question about Elora Smart." :
    data.idiomaCatalogo === "fr" ? "Bonjour, j'ai une question sur Elora Smart." :
    data.idiomaCatalogo === "pt" ? "Olá, tenho uma dúvida sobre a Elora Smart." :
    "Hola, tengo una consulta sobre Elora Smart."
  );
  const waUrl = `https://wa.me/34614451901?text=${waText}`;

  return `<!DOCTYPE html>
<html lang="${data.idiomaCatalogo}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1ec;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ec;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:2px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.07);">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:36px 48px 28px;text-align:center;">
            <img src="https://elorasmart.com/wp-content/uploads/2025/05/elora_200.png" alt="Elora Smart" width="130" height="auto" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />
            <p style="margin:14px 0 0;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Inodoros Inteligentes</p>
          </td>
        </tr>
        <!-- GOLD STRIP -->
        <tr><td style="background-color:#c9a96e;height:3px;"></td></tr>

        <!-- GREETING -->
        <tr>
          <td style="padding:44px 48px 0;text-align:center;background-color:#ffffff;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Elora Smart</p>
            <h1 style="margin:0 0 6px;font-size:26px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#0a0a0a;font-family:Georgia,serif;">${copy.greeting}, ${data.nombre}</h1>
            <div style="width:40px;height:2px;background-color:#c9a96e;margin:16px auto 0;"></div>
          </td>
        </tr>

        <!-- INTRO TEXT -->
        <tr>
          <td style="padding:28px 48px 0;text-align:center;background-color:#ffffff;">
            <p style="margin:0;font-size:15px;color:#555555;line-height:1.8;font-family:'Helvetica Neue',Arial,sans-serif;">${copy.intro}</p>
          </td>
        </tr>

        <!-- DOWNLOAD BUTTON -->
        <tr>
          <td style="padding:36px 48px 32px;text-align:center;background-color:#ffffff;">
            <a href="${pdfUrl}" target="_blank"
               style="display:inline-block;background-color:#c9a96e;color:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:18px 48px;border-radius:2px;">
              ↓ &nbsp; ${copy.downloadBtn}
            </a>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background-color:#eeebe5;"></div></td></tr>

        <!-- CONTACT BLOCK -->
        <tr>
          <td style="padding:36px 48px;text-align:center;background-color:#ffffff;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">${copy.contactTitle}</p>
            <p style="margin:0 0 28px;font-size:14px;color:#666666;line-height:1.8;font-family:'Helvetica Neue',Arial,sans-serif;">${copy.contactBody}</p>
            <!-- BUTTONS ROW -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:8px;">
                  <a href="${waUrl}" target="_blank"
                     style="display:inline-block;background-color:#25d366;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:2px;white-space:nowrap;">
                    💬 &nbsp; ${copy.waBtn}
                  </a>
                </td>
                <td style="padding-left:8px;">
                  <a href="tel:+34614451901"
                     style="display:inline-block;background-color:#ffffff;border:2px solid #0a0a0a;color:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:2px;white-space:nowrap;">
                    📞 &nbsp; ${copy.phoneBtn}
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:12px;color:#999999;font-family:'Helvetica Neue',Arial,sans-serif;">+34 614 451 901 &nbsp;·&nbsp; info@elorasmart.com</p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0a0a0a;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a96e;font-family:'Helvetica Neue',Arial,sans-serif;">Elora Smart</p>
            <p style="margin:0;font-size:11px;color:#555555;font-family:'Helvetica Neue',Arial,sans-serif;">${copy.footerNote}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendCatalogClientEmail(data: CatalogRequestEmailData): Promise<boolean> {
  const copy = CATALOG_CLIENT_COPY[data.idiomaCatalogo];
  const langFlag = CATALOG_LANG_FLAGS[data.idiomaCatalogo];
  try {
    const { error } = await resend.emails.send({
      from: "Elora Smart <pedidos@elorasmart.online>",
      to: data.email,
      replyTo: "info@elorasmart.com",
      subject: `${langFlag} ${copy.subject}`,
      html: buildCatalogClientHtml(data),
    });
    if (error) {
      console.error("[Email] Error enviando catálogo al cliente:", error);
      return false;
    }
    console.log(`[Email] Catálogo enviado al cliente ${data.email} (${data.idiomaCatalogo})`);
    return true;
  } catch (err) {
    console.error("[Email] Excepción enviando catálogo al cliente:", err);
    return false;
  }
}
