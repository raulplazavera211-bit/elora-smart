import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("CartPanel layering", () => {
  it("renders above product overlays when the cart is opened", () => {
    const component = readFileSync(
      resolve(process.cwd(), "client/src/components/CartPanel.tsx"),
      "utf8",
    );

    expect(component).toContain('className="fixed inset-0 z-[300] flex"');
  });

  it("adds the product and opens the cart from the product page handler", () => {
    const productPage = readFileSync(
      resolve(process.cwd(), "client/src/pages/ProductPage.tsx"),
      "utf8",
    );

    expect(productPage).toContain("addToCart({ id: p.id, name: p.name, price: p.price, img: p.img });");
    expect(productPage).toContain("openCart();");
  });
});
