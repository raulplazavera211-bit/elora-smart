import { LegalLayout } from "@/components/LegalLayout";
import { useState, useEffect } from "react";
import { Cookie, Settings, BarChart3, Megaphone, ShieldCheck } from "lucide-react";

type CookiePrefs = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

function CookieManager() {
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("elora_cookie_prefs");
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  const save = (newPrefs: CookiePrefs) => {
    localStorage.setItem("elora_cookie_prefs", JSON.stringify(newPrefs));
    localStorage.setItem("elora_cookie_consent", "custom");
    setPrefs(newPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => save({ necessary: true, analytics: false, marketing: false });

  return (
    <div className="not-prose my-8 rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-stone-900 text-white px-6 py-4 flex items-center gap-3">
        <Settings className="w-5 h-5" />
        <span className="font-display text-sm uppercase tracking-widest">Gestionar mis preferencias de cookies</span>
      </div>
      <div className="p-6 space-y-5">
        {/* Necesarias */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-stone-900 mb-1">Cookies Necesarias</p>
              <p className="font-body text-xs text-stone-500 leading-relaxed">
                Imprescindibles para el funcionamiento del sitio web. Incluyen la sesión de usuario, el carrito de compra y las preferencias de cookies. No pueden desactivarse.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="font-body text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Siempre activas</span>
          </div>
        </div>

        {/* Analíticas */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-stone-100">
          <div className="flex gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-stone-900 mb-1">Cookies Analíticas</p>
              <p className="font-body text-xs text-stone-500 leading-relaxed">
                Nos permiten medir el tráfico y analizar el comportamiento de los usuarios para mejorar la experiencia de navegación. Los datos son anonimizados y no permiten identificarte personalmente.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
            className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${prefs.analytics ? "bg-stone-900" : "bg-stone-200"}`}
            role="switch"
            aria-checked={prefs.analytics}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${prefs.analytics ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Marketing */}
        <div className="flex items-start justify-between gap-4 pt-4 border-t border-stone-100">
          <div className="flex gap-3">
            <Megaphone className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-stone-900 mb-1">Cookies de Marketing</p>
              <p className="font-body text-xs text-stone-500 leading-relaxed">
                Nos permiten mostrarte publicidad personalizada en otras plataformas (Meta, Google, TikTok) basada en tu comportamiento de navegación. Puedes desactivarlas sin que ello afecte al funcionamiento de la tienda.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
            className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${prefs.marketing ? "bg-stone-900" : "bg-stone-200"}`}
            role="switch"
            aria-checked={prefs.marketing}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${prefs.marketing ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={() => save(prefs)}
            className="flex-1 min-w-[140px] bg-stone-900 text-white font-body text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg hover:bg-stone-700 transition-colors"
          >
            {saved ? "✓ Guardado" : "Guardar preferencias"}
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 min-w-[140px] bg-amber-600 text-white font-body text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Aceptar todas
          </button>
          <button
            onClick={rejectAll}
            className="flex-1 min-w-[140px] border border-stone-200 text-stone-600 font-body text-xs uppercase tracking-widest py-2.5 px-4 rounded-lg hover:bg-stone-50 transition-colors"
          >
            Solo necesarias
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PoliticaCookies() {
  return (
    <LegalLayout title="Política de Cookies" lastUpdated="3 de julio de 2026">
      <p>
        Esta Política de Cookies explica qué son las cookies, qué tipos utilizamos en <strong>elorasmart.online</strong>, para qué las usamos y cómo puedes gestionarlas. De conformidad con el artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE) y el Reglamento (UE) 2016/679 (RGPD), te informamos de forma clara y transparente sobre el uso de cookies en este sitio web.
      </p>

      <h2>¿Qué son las Cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo (ordenador, tablet o smartphone) cuando los visitas. Sirven para que el sitio web recuerde tus preferencias, mantenga tu sesión activa y recopile información estadística sobre el uso del sitio.
      </p>
      <p>
        Las cookies no contienen virus ni pueden dañar tu dispositivo. Puedes configurar tu navegador para que te avise antes de aceptar cookies o para rechazarlas directamente, aunque esto puede afectar al funcionamiento de algunas funcionalidades del sitio web.
      </p>

      <h2>Tipos de Cookies que Utilizamos</h2>

      <h3>1. Cookies Técnicas o Necesarias</h3>
      <p>
        Son imprescindibles para el funcionamiento del sitio web. Sin ellas, no podrías navegar correctamente ni utilizar el carrito de compra. No requieren tu consentimiento.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Titular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>elora_session</code></td>
            <td>Mantiene la sesión del usuario autenticado</td>
            <td>Sesión</td>
            <td>ELORA SMART SL</td>
          </tr>
          <tr>
            <td><code>elora_cart</code></td>
            <td>Almacena el contenido del carrito de compra</td>
            <td>7 días</td>
            <td>ELORA SMART SL</td>
          </tr>
          <tr>
            <td><code>elora_cookie_consent</code></td>
            <td>Registra tus preferencias de cookies</td>
            <td>1 año</td>
            <td>ELORA SMART SL</td>
          </tr>
          <tr>
            <td><code>elora_cookie_prefs</code></td>
            <td>Almacena las categorías de cookies aceptadas</td>
            <td>1 año</td>
            <td>ELORA SMART SL</td>
          </tr>
          <tr>
            <td><code>XSRF-TOKEN</code></td>
            <td>Protección contra ataques CSRF</td>
            <td>Sesión</td>
            <td>ELORA SMART SL</td>
          </tr>
        </tbody>
      </table>

      <h3>2. Cookies Analíticas</h3>
      <p>
        Nos permiten medir el tráfico y analizar el comportamiento de los usuarios de forma anonimizada, para mejorar la experiencia de navegación y los contenidos del sitio web. Requieren tu consentimiento.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Titular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_ga</code></td>
            <td>Distingue usuarios únicos en Google Analytics</td>
            <td>2 años</td>
            <td>Google LLC</td>
          </tr>
          <tr>
            <td><code>_ga_*</code></td>
            <td>Mantiene el estado de la sesión en Google Analytics 4</td>
            <td>2 años</td>
            <td>Google LLC</td>
          </tr>
          <tr>
            <td><code>_gid</code></td>
            <td>Distingue usuarios en Google Analytics (sesión)</td>
            <td>24 horas</td>
            <td>Google LLC</td>
          </tr>
        </tbody>
      </table>

      <h3>3. Cookies de Marketing y Publicidad</h3>
      <p>
        Nos permiten mostrarte publicidad personalizada en plataformas de terceros (Meta, Google Ads, TikTok) basada en tu comportamiento de navegación. Requieren tu consentimiento.
      </p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Finalidad</th>
            <th>Duración</th>
            <th>Titular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_fbp</code></td>
            <td>Pixel de Meta (Facebook/Instagram) para retargeting</td>
            <td>3 meses</td>
            <td>Meta Platforms, Inc.</td>
          </tr>
          <tr>
            <td><code>_fbc</code></td>
            <td>Almacena el último clic de anuncio de Meta</td>
            <td>2 años</td>
            <td>Meta Platforms, Inc.</td>
          </tr>
          <tr>
            <td><code>_ttp</code></td>
            <td>Pixel de TikTok para medición de conversiones</td>
            <td>13 meses</td>
            <td>TikTok Inc.</td>
          </tr>
          <tr>
            <td><code>_gcl_au</code></td>
            <td>Google Ads: conversiones y remarketing</td>
            <td>3 meses</td>
            <td>Google LLC</td>
          </tr>
        </tbody>
      </table>

      <h2>Gestiona tus Preferencias</h2>
      <p>
        Puedes modificar tus preferencias de cookies en cualquier momento utilizando el panel de control a continuación. Los cambios se aplicarán de forma inmediata.
      </p>

      <CookieManager />

      <h2>Cómo Gestionar las Cookies desde tu Navegador</h2>
      <p>
        Además del panel anterior, puedes gestionar las cookies directamente desde la configuración de tu navegador. A continuación te indicamos cómo hacerlo en los principales navegadores:
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>
        Ten en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento del carrito de compra y otras funcionalidades del sitio web.
      </p>

      <h2>Transferencias Internacionales</h2>
      <p>
        Algunos de los proveedores de cookies de terceros (Google, Meta, TikTok) pueden transferir datos fuera del Espacio Económico Europeo. Estas transferencias se realizan bajo las garantías adecuadas establecidas en el RGPD (cláusulas contractuales tipo, decisiones de adecuación, etc.). Para más información, consulta las políticas de privacidad de cada proveedor.
      </p>

      <h2>Actualizaciones de esta Política</h2>
      <p>
        ELORA SMART SL puede actualizar esta Política de Cookies en cualquier momento para adaptarla a cambios legislativos o de los servicios. Te recomendamos revisarla periódicamente. Los cambios entrarán en vigor desde su publicación en el sitio web.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta sobre el uso de cookies en este sitio web, puedes contactarnos en <a href="mailto:info@elorasmart.com">info@elorasmart.com</a>.
      </p>
    </LegalLayout>
  );
}
