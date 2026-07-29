import { useEffect } from "react";
import { useLocation } from "wouter";
import { ProductDetail } from "@/components/ProductDetail";
import { CartPanel } from "@/components/CartPanel";
import { ALL_PRODUCTS } from "@/lib/products";
import NotFound from "@/pages/NotFound";
import { useCart } from "@/contexts/CartContext";

// Mapa de slug de URL → id de producto
const SLUG_TO_ID: Record<string, string> = {
  "esenza":             "ESENZA",
  "esenza-compact":     "ESENZA-COMPACT",
  "esenza-suspendido":  "ESENZA-SUSPENDIDO",
  "aura":               "AURA",
  "aura-compact":       "AURA-COMPACT",
  "aura-suspendido":    "AURA-SUSPENDIDO",
};

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const [, navigate] = useLocation();
  const { cart, isCartOpen, addToCart, removeFromCart, updateQuantity, openCart, closeCart } = useCart();

  const productId = SLUG_TO_ID[params.slug];
  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  // Actualizar meta tags para SEO
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Elora Smart`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", product.description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = product.description;
      document.head.appendChild(meta);
    }
    // Open Graph
    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setOg("og:title", `${product.name} | Elora Smart`);
    setOg("og:description", product.description);
    setOg("og:image", `https://elorasmart.online${product.img}`);
    setOg("og:type", "product");
    setOg("og:url", `https://elorasmart.online/producto/${params.slug}`);
  }, [product, params.slug]);

  if (!product) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <ProductDetail
        product={product}
        onBack={() => navigate("/coleccion")}
        onAdd={(p) => {
          addToCart({ id: p.id, name: p.name, price: p.price, img: p.img });
          openCart();
        }}
      />
      <CartPanel
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
