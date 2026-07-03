import { LegalLayout } from "@/components/LegalLayout";
import { Truck, Package, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export default function PoliticaEnvios() {
  return (
    <LegalLayout title="Política de Envíos" lastUpdated="3 de julio de 2026">
      <p>
        En ELORA SMART SL nos comprometemos a entregar tu inodoro inteligente con la máxima seguridad y cuidado. Todos nuestros productos se envían con embalaje reforzado específico para equipos sanitarios de alto valor, con seguro de transporte incluido.
      </p>

      {/* Zonas de envío */}
      <h2>Zonas de Envío y Tarifas</h2>

      {/* España Peninsular */}
      <div className="not-prose my-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="font-display text-base uppercase tracking-wide text-emerald-800 m-0">España Peninsular — ENVÍO GRATUITO</h3>
        </div>
        <p className="font-body text-sm text-emerald-700 m-0">
          Envío completamente gratuito a toda la Península Ibérica española. Sin mínimo de compra. Incluye Comunidad de Madrid, Cataluña, Andalucía, Comunidad Valenciana, Castilla y León, Galicia, País Vasco, Aragón, Castilla-La Mancha, Extremadura, Asturias, Murcia, Cantabria, La Rioja, Navarra y Álava.
        </p>
      </div>

      {/* Portugal Peninsular */}
      <div className="not-prose my-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="font-display text-base uppercase tracking-wide text-emerald-800 m-0">Portugal Continental — ENVÍO GRATUITO</h3>
        </div>
        <p className="font-body text-sm text-emerald-700 m-0">
          Envío gratuito a Portugal continental. <strong>No realizamos envíos a las islas portuguesas</strong> (Azores y Madeira) por las restricciones logísticas y de aduana aplicables.
        </p>
      </div>

      {/* Tabla de tarifas internacionales */}
      <h3>Envíos Internacionales</h3>
      <table>
        <thead>
          <tr>
            <th>País / Zona</th>
            <th>Coste del envío</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Francia Continental</strong></td>
            <td>150 €</td>
            <td>Solo Francia metropolitana. No incluye Córcega ni territorios de ultramar.</td>
          </tr>
          <tr>
            <td><strong>Italia Continental</strong></td>
            <td>120 €</td>
            <td>Solo Italia peninsular. No incluye Sicilia, Cerdeña ni otras islas italianas.</td>
          </tr>
          <tr>
            <td><strong>Alemania</strong></td>
            <td>200 €</td>
            <td>Alemania continental. Incluye todas las regiones federales.</td>
          </tr>
          <tr>
            <td><strong>Países Bajos</strong></td>
            <td>150 €</td>
            <td>Países Bajos continentales. No incluye Aruba, Curazao ni islas caribeñas.</td>
          </tr>
          <tr>
            <td><strong>Baleares</strong></td>
            <td>60 €</td>
            <td>Mallorca, Menorca, Ibiza y Formentera.</td>
          </tr>
        </tbody>
      </table>

      {/* Zonas sin envío */}
      <div className="not-prose my-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <h3 className="font-display text-base uppercase tracking-wide text-red-800 m-0">Zonas sin Servicio de Envío</h3>
        </div>
        <p className="font-body text-sm text-red-700 mb-3">
          Actualmente <strong>no realizamos envíos</strong> a las siguientes zonas debido a restricciones aduaneras, logísticas o fiscales:
        </p>
        <ul className="font-body text-sm text-red-700 space-y-1 m-0 pl-4">
          <li><strong>Canarias</strong> — Régimen fiscal especial (IGIC), trámites aduaneros y costes de importación incompatibles con nuestro modelo de envío directo.</li>
          <li><strong>Ceuta</strong> — Ciudad autónoma con régimen aduanero especial fuera del territorio aduanero de la UE.</li>
          <li><strong>Melilla</strong> — Ciudad autónoma con régimen aduanero especial fuera del territorio aduanero de la UE.</li>
          <li><strong>Islas portuguesas</strong> (Azores y Madeira) — Restricciones logísticas y aduaneras.</li>
          <li><strong>Córcega e islas italianas</strong> (Sicilia, Cerdeña, etc.) — Restricciones logísticas.</li>
          <li><strong>Territorios de ultramar franceses</strong> — Restricciones aduaneras.</li>
        </ul>
        <p className="font-body text-sm text-red-700 mt-3 mb-0">
          Si resides en alguna de estas zonas y estás interesado en adquirir un producto Elora Smart, contáctanos en <a href="mailto:info@elorasmart.com" className="underline">info@elorasmart.com</a> y estudiaremos tu caso de forma personalizada.
        </p>
      </div>

      {/* Plazos de entrega */}
      <h2>Plazos de Entrega</h2>
      <table>
        <thead>
          <tr>
            <th>Destino</th>
            <th>Plazo estimado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>España Peninsular</td>
            <td>3–7 días laborables</td>
          </tr>
          <tr>
            <td>Portugal Continental</td>
            <td>5–10 días laborables</td>
          </tr>
          <tr>
            <td>Baleares</td>
            <td>5–10 días laborables</td>
          </tr>
          <tr>
            <td>Francia, Italia, Alemania, Países Bajos</td>
            <td>7–15 días laborables</td>
          </tr>
        </tbody>
      </table>
      <p>
        Los plazos indicados son estimaciones y pueden variar en función de la disponibilidad del producto, la agencia de transporte y circunstancias excepcionales (festivos, huelgas, condiciones meteorológicas adversas). ELORA SMART SL no se hace responsable de los retrasos imputables a la agencia de transporte una vez el pedido haya sido entregado al transportista.
      </p>

      {/* Proceso de envío */}
      <h2>Proceso de Envío</h2>
      <div className="not-prose my-6 space-y-4">
        {[
          { icon: Package, step: "1", title: "Preparación del pedido", body: "Una vez confirmado el pago, tu pedido se prepara en nuestras instalaciones de Bertamiráns (AMES) en un plazo de 1–2 días laborables. Cada unidad se embala con material de protección específico para equipos sanitarios de alto valor." },
          { icon: Truck, step: "2", title: "Recogida por el transportista", body: "La agencia de transporte recoge el pedido en nuestras instalaciones. Recibirás un correo electrónico con el número de seguimiento para que puedas rastrear tu envío en tiempo real." },
          { icon: Clock, step: "3", title: "Entrega en tu domicilio", body: "El transportista contactará contigo para coordinar la entrega. Te recomendamos que en el momento de la recepción revises el embalaje exterior antes de firmar el albarán. Si detectas daños, indícalo en el albarán y contáctanos de inmediato." },
        ].map(({ icon: Icon, step, title, body }) => (
          <div key={step} className="flex gap-4 p-4 rounded-xl border border-stone-200 bg-white">
            <div className="shrink-0 w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center font-display text-sm">
              {step}
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-wide text-stone-900 mb-1">{title}</p>
              <p className="font-body text-sm text-stone-600 m-0">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daños en el transporte */}
      <h2>Daños Durante el Transporte</h2>
      <p>
        Si al recibir tu pedido observas daños en el embalaje o en el producto, debes:
      </p>
      <ol>
        <li>Indicar los daños visibles en el albarán de entrega antes de firmar.</li>
        <li>Fotografiar el embalaje y el producto dañado.</li>
        <li>Contactarnos en un plazo máximo de <strong>24 horas</strong> desde la recepción en <a href="mailto:info@elorasmart.com">info@elorasmart.com</a> adjuntando las fotografías.</li>
      </ol>
      <p>
        ELORA SMART SL gestionará la reclamación ante la aseguradora y el transportista, y procederá a la reposición o reparación del producto dañado sin coste adicional para el cliente.
      </p>

      {/* Seguimiento */}
      <h2>Seguimiento del Pedido</h2>
      <p>
        Una vez que tu pedido haya sido recogido por el transportista, recibirás un correo electrónico con el número de seguimiento y el enlace directo a la plataforma de la agencia de transporte para que puedas consultar el estado de tu envío en tiempo real.
      </p>
      <p>
        Si tienes cualquier duda sobre el estado de tu pedido, puedes contactarnos en <a href="mailto:info@elorasmart.com">info@elorasmart.com</a> o llamarnos al <a href="tel:+34614451901">+34 614 45 19 01</a> en horario de lunes a viernes de 10:00 a 18:00.
      </p>

      {/* Devoluciones */}
      <h2>Devoluciones y Derecho de Desistimiento</h2>
      <p>
        De conformidad con el Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios), tienes derecho a desistir del contrato en un plazo de <strong>14 días naturales</strong> desde la recepción del producto, sin necesidad de justificación.
      </p>
      <p>
        Para ejercer el derecho de desistimiento, debes notificárnoslo por escrito a <a href="mailto:info@elorasmart.com">info@elorasmart.com</a> antes de que expire el plazo. El producto debe devolverse en su embalaje original, sin usar y en perfecto estado. Los gastos de devolución corren a cargo del cliente, salvo que el producto presente un defecto de fabricación.
      </p>
      <p>
        Una vez recibido y verificado el producto devuelto, procederemos al reembolso íntegro del importe abonado en un plazo máximo de <strong>14 días</strong> mediante el mismo método de pago utilizado en la compra.
      </p>

      <h2>Contacto para Envíos</h2>
      <p>
        Para cualquier consulta relacionada con tu envío, puedes contactarnos en:
      </p>
      <ul>
        <li>Correo electrónico: <a href="mailto:info@elorasmart.com">info@elorasmart.com</a></li>
        <li>Teléfono: <a href="tel:+34614451901">+34 614 45 19 01</a> (lunes a viernes, 10:00–18:00)</li>
        <li>WhatsApp: <a href="https://wa.me/34614451901" target="_blank" rel="noreferrer">+34 614 45 19 01</a></li>
      </ul>
    </LegalLayout>
  );
}
