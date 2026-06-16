/**
 * Tests de la integración Redsys
 * Verifica que el formulario se genera con los parámetros correctos.
 */
import { describe, it, expect, beforeAll } from "vitest";

// Configurar variables de entorno de prueba antes de importar el módulo
beforeAll(() => {
  process.env.REDSYS_SECRET_KEY = "XhMSH/uM/kOA06MFgnpxQj6/MkuYp4Su";
  process.env.REDSYS_MERCHANT_CODE = "368959276";
  process.env.REDSYS_TERMINAL = "1";
  process.env.REDSYS_SANDBOX = "true";
});

describe("Redsys helper", () => {
  it("getRedsysConfig devuelve la configuración correcta", async () => {
    const { getRedsysConfig } = await import("./redsys");
    const config = getRedsysConfig();
    expect(config.merchantCode).toBe("368959276");
    expect(config.terminal).toBe("1");
    expect(config.isSandbox).toBe(true);
    expect(config.secretKey).toBeTruthy();
  });

  it("createRedsysForm genera formulario con importe correcto en céntimos", async () => {
    const { createRedsysForm } = await import("./redsys");

    const form = createRedsysForm({
      amountEur: "1490.00",
      frontendOrigin: "https://test.manus.space",
      merchantName: "ELORA SMART TEST",
      productDescription: "Inodoro inteligente test",
    });

    // Verificar estructura del formulario
    expect(form.url).toBeTruthy();
    expect(form.body.Ds_SignatureVersion).toBe("HMAC_SHA256_V1");
    expect(form.body.Ds_MerchantParameters).toBeTruthy();
    expect(form.body.Ds_Signature).toBeTruthy();
    expect(form.redsysOrderId).toBeTruthy();
    expect(form.redsysOrderId.length).toBe(12);

    // Decodificar y verificar los parámetros internos
    const decoded = JSON.parse(
      Buffer.from(form.body.Ds_MerchantParameters, "base64").toString("utf8")
    );

    // El importe debe ser 149000 céntimos (1490.00 € × 100)
    expect(decoded.DS_MERCHANT_AMOUNT).toBe("149000");
    expect(decoded.DS_MERCHANT_CURRENCY).toBe("978"); // EUR
    expect(decoded.DS_MERCHANT_MERCHANTCODE).toBe("368959276");
    expect(decoded.DS_MERCHANT_TERMINAL).toBe("1");
    expect(decoded.DS_MERCHANT_TRANSACTIONTYPE).toBe("0"); // AUTHORIZATION
    expect(decoded.DS_MERCHANT_PAYMETHODS).toBe("T,bizum");
    expect(decoded.DS_MERCHANT_URLOK).toContain("/pago/ok");
    expect(decoded.DS_MERCHANT_URLKO).toContain("/pago/ko");
    expect(decoded.DS_MERCHANT_MERCHANTURL).toContain("/api/redsys/notification");
  });

  it("createRedsysForm acepta importe como número", async () => {
    const { createRedsysForm } = await import("./redsys");

    const form = createRedsysForm({
      amountEur: 1590,
      frontendOrigin: "https://test.manus.space",
    });

    const decoded = JSON.parse(
      Buffer.from(form.body.Ds_MerchantParameters, "base64").toString("utf8")
    );

    // 1590 € → 159000 céntimos
    expect(decoded.DS_MERCHANT_AMOUNT).toBe("159000");
  });

  it("createRedsysForm lanza error si el importe es 0 o negativo", async () => {
    const { createRedsysForm } = await import("./redsys");

    expect(() =>
      createRedsysForm({
        amountEur: "0",
        frontendOrigin: "https://test.manus.space",
      })
    ).toThrow("Importe inválido");

    expect(() =>
      createRedsysForm({
        amountEur: -100,
        frontendOrigin: "https://test.manus.space",
      })
    ).toThrow("Importe inválido");
  });
});
