import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend API Key", () => {
  it("debe tener la API Key configurada", () => {
    expect(process.env.RESEND_API_KEY).toBeDefined();
    expect(process.env.RESEND_API_KEY).toMatch(/^re_/);
  });

  it("debe poder instanciar el cliente Resend sin errores", () => {
    const client = new Resend(process.env.RESEND_API_KEY);
    expect(client).toBeDefined();
  });

  it("debe tener el formato correcto de API Key", () => {
    const key = process.env.RESEND_API_KEY ?? "";
    expect(key.length).toBeGreaterThan(10);
    expect(key.startsWith("re_")).toBe(true);
  });
});
