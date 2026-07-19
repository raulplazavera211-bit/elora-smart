import type { Express } from "express";

/**
 * Redirecciones 301 para slugs de elorasmart.com indexados en Google.
 * El dominio elorasmart.com redirige a elorasmart.online, pero las rutas
 * antiguas del WordPress no existen aquí → las mapeamos a sus equivalentes.
 */
export function registerLegacyRedirects(app: Express) {
  const REDIRECTS: Record<string, string> = {
    // ── Productos ──────────────────────────────────────────────────────────
    "/producto/inodoro-inteligente-japones-esenza":   "/?producto=ESENZA",
    "/producto/inodoro-inteligente-japones-esenza/":  "/?producto=ESENZA",
    "/producto/inodoro-con-bidet-esenza-compact":     "/?producto=ESENZA-COMPACT",
    "/producto/inodoro-con-bidet-esenza-compact/":    "/?producto=ESENZA-COMPACT",
    "/producto/inodoro-inteligente-esenza-suspendido":"/?producto=ESENZA-SUSPENDIDO",
    "/producto/inodoro-inteligente-esenza-suspendido/":"/?producto=ESENZA-SUSPENDIDO",
    "/producto/water-japones":                        "/?producto=AURA-COMPACT",
    "/producto/water-japones/":                       "/?producto=AURA-COMPACT",
    "/producto/water-inteligente":                    "/?producto=AURA-COMPACT",
    "/producto/water-inteligente/":                   "/?producto=AURA-COMPACT",
    "/producto/vater-japones":                        "/?producto=AURA-SUSPENDIDO",
    "/producto/vater-japones/":                       "/?producto=AURA-SUSPENDIDO",

    // ── Categorías ─────────────────────────────────────────────────────────
    "/categorias/inodoros-inteligentes":              "/coleccion",
    "/categorias/inodoros-inteligentes/":             "/coleccion",
    "/en/categories/smart-toilets":                   "/coleccion",
    "/en/categories/smart-toilets/":                  "/coleccion",

    // ── Páginas legales / info ──────────────────────────────────────────────
    "/garantias":                                     "/garantias",
    "/garantias/":                                    "/garantias",
    "/terminos-y-condiciones":                        "/terminos-condiciones",
    "/terminos-y-condiciones/":                       "/terminos-condiciones",
    "/devoluciones":                                  "/terminos-condiciones",
    "/devoluciones/":                                 "/terminos-condiciones",
    "/preguntas-frecuentes":                          "/",
    "/preguntas-frecuentes/":                         "/",
    "/distribuidores":                                "/",
    "/distribuidores/":                               "/",
    "/contacto":                                      "/",
    "/contacto/":                                     "/",
    "/accesibilidad":                                 "/aviso-legal",
    "/accesibilidad/":                                "/aviso-legal",

    // ── Blog / contenido ───────────────────────────────────────────────────
    "/blog":                                          "/",
    "/blog/":                                         "/",
    "/inodoros-inteligentes-guia-completa":           "/",
    "/inodoros-inteligentes-guia-completa/":          "/",
    "/landing-page-modelos":                          "/coleccion",
    "/landing-page-modelos/":                         "/coleccion",

    // ── Versión inglés ─────────────────────────────────────────────────────
    "/en":                                            "/",
    "/en/":                                           "/",
    "/en/product/esenza-wall-hung-smart-toilet":      "/?producto=ESENZA-SUSPENDIDO",
    "/en/product/esenza-wall-hung-smart-toilet/":     "/?producto=ESENZA-SUSPENDIDO",
  };

  // Registrar cada redirección como ruta GET 301
  for (const [from, to] of Object.entries(REDIRECTS)) {
    app.get(from, (_req, res) => {
      res.redirect(301, to);
    });
  }

  // Comodín: cualquier /blog/* o /producto/* no listado → home
  app.get("/blog/*", (_req, res) => res.redirect(301, "/"));
  app.get("/producto/*", (_req, res) => res.redirect(301, "/coleccion"));
  app.get("/en/*", (_req, res) => res.redirect(301, "/"));
  app.get("/categorias/*", (_req, res) => res.redirect(301, "/coleccion"));
}
