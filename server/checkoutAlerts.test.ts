import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cartPanel = readFileSync(
  new URL("../client/src/components/CartPanel.tsx", import.meta.url),
  "utf8",
);
const router = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const email = readFileSync(new URL("./email.ts", import.meta.url), "utf8");
const redsysWebhook = readFileSync(new URL("./redsysWebhook.ts", import.meta.url), "utf8");
const sequraWebhook = readFileSync(new URL("./sequraWebhook.ts", import.meta.url), "utf8");

describe("alertas de checkout y pago", () => {
  it("captura una sola vez el contacto cuando correo y teléfono son válidos", () => {
    expect(cartPanel).toContain("hasValidCheckoutEmail(form.email)");
    expect(cartPanel).toContain("hasValidCheckoutPhone(form.telefono)");
    expect(cartPanel).toContain("captureCheckoutContact.mutate");
    expect(cartPanel).toContain("checkoutContactSent.current = true");
    expect(cartPanel).toContain("elora-checkout-contact-session");
  });

  it("expone los procedimientos para capturar el contacto y registrar incidencias de PayPal", () => {
    expect(router).toContain("captureCheckoutContact: publicProcedure");
    expect(router).toContain("reportPaymentIssue: publicProcedure");
    expect(router).toContain("sendCheckoutContactAlert");
    expect(router).toContain("sendPaymentOutcomeAlert");
  });

  it("envía todos los avisos internos a los dos destinatarios configurados", () => {
    expect(email).toContain('"info@elorasmart.com", "vioccodigital@gmail.com"');
    expect(email).toContain("sendCheckoutContactAlert");
    expect(email).toContain("sendPaymentOutcomeAlert");
  });

  it("cubre rechazos de Redsys y seQura sin duplicar reintentos del webhook", () => {
    expect(redsysWebhook).toContain("paymentStateChanged");
    expect(redsysWebhook).toContain("sendPaymentOutcomeAlert");
    expect(sequraWebhook).toContain("paymentStateChanged");
    expect(sequraWebhook).toContain("sendPaymentOutcomeAlert");
  });
});
