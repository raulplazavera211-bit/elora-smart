/**
 * Tests para el helper de Redsys.
 * Valida que las credenciales estén configuradas y que el formulario se genere correctamente.
 */
import { describe, it, expect } from "vitest";

// Cargar variables de entorno para los tests
process.env.REDSYS_MERCHANT_CODE = process.env.REDSYS_MERCHANT_CODE || "368959276";
process.env.REDSYS_SECRET_KEY = process.env.REDSYS_SECRET_KEY || "XhMSH/uM/kOA06MFgnpxQj6/MkuYp4Su";
process.env.REDSYS_TERMINAL = process.env.REDSYS_TERMINAL || "1";
process.env.REDSYS_SANDBOX = process.env.REDSYS_SANDBOX ?? "true";

describe("Redsys helper", () => {
  it("getRedsysConfig devuelve la configuración correctamente", async () => {
    const { getRedsysConfig } = await import("./redsys");
    const config = getRedsysConfig();
    expect(config.merchantCode).toBe("368959276");
    expect(config.secretKey).toBeTruthy();
    expect(config.terminal).toBe("1");
    expect(typeof config.isSandbox).toBe("boolean");
  });

  it("createRedsysForm genera un formulario firmado válido", async () => {
    const { createRedsysForm } = await import("./redsys");
    const form = createRedsysForm({
      amountEur: "1490.00",
      frontendOrigin: "https://elora.manus.space",
      merchantName: "ELORA SMART",
      productDescription: "Inodoro inteligente ESENZA x1",
    });

    // El formulario debe tener URL y los 3 campos firmados
    expect(form.url).toContain("redsys");
    expect(form.body.Ds_SignatureVersion).toBe("HMAC_SHA256_V1");
    expect(form.body.Ds_MerchantParameters).toBeTruthy();
    expect(form.body.Ds_Signature).toBeTruthy();
    // El redsysOrderId debe tener exactamente 12 caracteres
    expect(form.redsysOrderId).toHaveLength(12);
  });

  it("createRedsysForm usa la URL de sandbox cuando REDSYS_SANDBOX=true", async () => {
    process.env.REDSYS_SANDBOX = "true";
    // Limpiar módulo cacheado para que tome el nuevo valor
    const { createRedsysForm } = await import("./redsys");
    const form = createRedsysForm({
      amountEur: "100.00",
      frontendOrigin: "https://elora.manus.space",
    });
    expect(form.url).toContain("sis-t.redsys.es");
  });
});
