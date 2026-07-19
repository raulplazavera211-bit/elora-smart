import type { Express } from "express";

/**
 * Redirecciones 301 para TODOS los slugs de elorasmart.com indexados en Google.
 * El dominio elorasmart.com redirige a elorasmart.online, pero las rutas
 * del WordPress antiguo no existen aquí → las mapeamos a sus equivalentes.
 *
 * Fuentes: Google site:elorasmart.com (páginas 1-3), búsquedas específicas de
 * productos, blog, páginas legales y versión en inglés.
 */
export function registerLegacyRedirects(app: Express) {
  const REDIRECTS: Record<string, string> = {

    // ── Productos (ES) ─────────────────────────────────────────────────────
    "/producto/inodoro-inteligente-japones-esenza":            "/producto/esenza",
    "/producto/inodoro-inteligente-japones-esenza/":           "/producto/esenza",
    "/producto/inodoro-con-bidet-esenza-compact":              "/producto/esenza-compact",
    "/producto/inodoro-con-bidet-esenza-compact/":             "/producto/esenza-compact",
    "/producto/inodoro-inteligente-esenza-suspendido":         "/producto/esenza-suspendido",
    "/producto/inodoro-inteligente-esenza-suspendido/":        "/producto/esenza-suspendido",
    "/producto/water-japones":                                 "/producto/aura-compact",
    "/producto/water-japones/":                                "/producto/aura-compact",
    "/producto/water-inteligente":                             "/producto/aura-compact",
    "/producto/water-inteligente/":                            "/producto/aura-compact",
    "/producto/vater-japones":                                 "/producto/aura-suspendido",
    "/producto/vater-japones/":                                "/producto/aura-suspendido",

    // ── Productos (EN) ─────────────────────────────────────────────────────
    "/en/product/esenza-smart-toilet":                         "/producto/esenza",
    "/en/product/esenza-smart-toilet/":                        "/producto/esenza",
    "/en/product/esenza-compact-smart-toilet":                 "/producto/esenza-compact",
    "/en/product/esenza-compact-smart-toilet/":                "/producto/esenza-compact",
    "/en/product/esenza-wall-hung-smart-toilet":               "/producto/esenza-suspendido",
    "/en/product/esenza-wall-hung-smart-toilet/":              "/producto/esenza-suspendido",
    "/en/product/aura-smart-toilet":                           "/producto/aura",
    "/en/product/aura-smart-toilet/":                          "/producto/aura",
    "/en/product/aura-compact-smart-toilet":                   "/producto/aura-compact",
    "/en/product/aura-compact-smart-toilet/":                  "/producto/aura-compact",
    "/en/product/aura-wall-mounted-smart-toilet":              "/producto/aura-suspendido",
    "/en/product/aura-wall-mounted-smart-toilet/":             "/producto/aura-suspendido",

    // ── Categorías (ES) ────────────────────────────────────────────────────
    "/categorias/inodoros-inteligentes":                       "/coleccion",
    "/categorias/inodoros-inteligentes/":                      "/coleccion",
    "/categoria/sin-categorizar":                              "/coleccion",
    "/categoria/sin-categorizar/":                             "/coleccion",
    "/tienda":                                                 "/coleccion",
    "/tienda/":                                                "/coleccion",

    // ── Categorías (EN) ────────────────────────────────────────────────────
    "/en/categories/smart-toilets":                            "/coleccion",
    "/en/categories/smart-toilets/":                           "/coleccion",
    "/en/shop":                                                "/coleccion",
    "/en/shop/":                                               "/coleccion",

    // ── Blog (ES) ──────────────────────────────────────────────────────────
    "/blog":                                                   "/",
    "/blog/":                                                  "/",
    "/inodoros-inteligentes-guia-completa":                    "/",
    "/inodoros-inteligentes-guia-completa/":                   "/",
    "/inodoro-inteligente-japones-que-es-y-como-funciona-guia-2025": "/",
    "/inodoro-inteligente-japones-que-es-y-como-funciona-guia-2025/": "/",

    // ── Páginas informativas (ES) ──────────────────────────────────────────
    "/quienes-somos":                                          "/",
    "/quienes-somos/":                                         "/",
    "/contacto":                                               "/",
    "/contacto/":                                              "/",
    "/distribuidores":                                         "/",
    "/distribuidores/":                                        "/",
    "/hazte-distribuidor":                                     "/",
    "/hazte-distribuidor/":                                    "/",
    "/preguntas-frecuentes":                                   "/",
    "/preguntas-frecuentes/":                                  "/",
    "/ebook":                                                  "/",
    "/ebook/":                                                 "/",
    "/landing-page-modelos":                                   "/coleccion",
    "/landing-page-modelos/":                                  "/coleccion",
    "/formas-de-pago":                                         "/",
    "/formas-de-pago/":                                        "/",

    // ── Páginas legales (ES) ───────────────────────────────────────────────
    "/garantias":                                              "/garantias",
    "/garantias/":                                             "/garantias",
    "/terminos-y-condiciones":                                 "/terminos-condiciones",
    "/terminos-y-condiciones/":                                "/terminos-condiciones",
    "/devoluciones":                                           "/terminos-condiciones",
    "/devoluciones/":                                          "/terminos-condiciones",
    "/aviso-legal":                                            "/aviso-legal",
    "/aviso-legal/":                                           "/aviso-legal",
    "/politica-de-privacidad":                                 "/politica-privacidad",
    "/politica-de-privacidad/":                                "/politica-privacidad",
    "/politica-de-cookies":                                    "/politica-cookies",
    "/politica-de-cookies/":                                   "/politica-cookies",
    "/accesibilidad":                                          "/aviso-legal",
    "/accesibilidad/":                                         "/aviso-legal",

    // ── Páginas legales (EN) ───────────────────────────────────────────────
    "/en/legal-notice":                                        "/aviso-legal",
    "/en/legal-notice/":                                       "/aviso-legal",
    "/en/privacy-policy":                                      "/politica-privacidad",
    "/en/privacy-policy/":                                     "/politica-privacidad",
    "/en/cookie-policy":                                       "/politica-cookies",
    "/en/cookie-policy/":                                      "/politica-cookies",
    "/en/terms-and-conditions":                                "/terminos-condiciones",
    "/en/terms-and-conditions/":                               "/terminos-condiciones",
    "/en/warranty":                                            "/garantias",
    "/en/warranty/":                                           "/garantias",
    "/en/returns":                                             "/terminos-condiciones",
    "/en/returns/":                                            "/terminos-condiciones",
    "/en/accessibility":                                       "/aviso-legal",
    "/en/accessibility/":                                      "/aviso-legal",
    "/en/payment-methods":                                     "/",
    "/en/payment-methods/":                                    "/",

    // ── Páginas informativas (EN) ──────────────────────────────────────────
    "/en/contact":                                             "/",
    "/en/contact/":                                            "/",
    "/en/distributors":                                        "/",
    "/en/distributors/":                                       "/",
    "/en/affiliate-registration":                              "/",
    "/en/affiliate-registration/":                             "/",

    // ── Raíz EN ────────────────────────────────────────────────────────────
    "/en":                                                     "/",
    "/en/":                                                    "/",
  };

  // Registrar cada redirección explícita como ruta GET 301
  for (const [from, to] of Object.entries(REDIRECTS)) {
    app.get(from, (_req, res) => {
      res.redirect(301, to);
    });
  }

  // ── Comodines para rutas no listadas explícitamente ────────────────────
  // Cualquier artículo de blog no listado → home
  app.get("/blog/*", (_req, res) => res.redirect(301, "/"));
  // NOTA: /producto/* NO tiene comodín — las rutas /producto/:slug son páginas reales del frontend
  // Cualquier categoría no listada → colección
  app.get("/categorias/*", (_req, res) => res.redirect(301, "/coleccion"));
  app.get("/categoria/*", (_req, res) => res.redirect(301, "/coleccion"));
  // Cualquier página EN de producto no listada → colección
  app.get("/en/product/*", (_req, res) => res.redirect(301, "/coleccion"));
  app.get("/en/categories/*", (_req, res) => res.redirect(301, "/coleccion"));
  // Cualquier otra ruta EN no listada → home
  app.get("/en/*", (_req, res) => res.redirect(301, "/"));
}
