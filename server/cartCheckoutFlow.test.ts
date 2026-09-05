import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const cartPanelSource = readFileSync(
  new URL("../client/src/components/CartPanel.tsx", import.meta.url),
  "utf8",
);

describe("avance desde el carrito al checkout", () => {
  it("lleva el botón móvil Comprar directamente al formulario de checkout", () => {
    expect(cartPanelSource).toContain(
      'onClick={() => { if (cart.length > 0) setCheckoutStep("checkout"); }}',
    );
    expect(cartPanelSource).not.toContain(
      "onClick={() => { if (cart.length > 0) setShowShippingPopup(true); }}",
    );
  });

  it("mantiene un formulario móvil asociado al botón de continuar", () => {
    expect(cartPanelSource).toContain('id="checkout-form"');
    expect(cartPanelSource).toContain('form="checkout-form"');
  });
});
