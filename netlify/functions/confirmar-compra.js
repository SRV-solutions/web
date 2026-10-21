import { getCurso } from "../lib/cursos.js";
import { planDesdeReferencia } from "../lib/intensivos.js";
import { sendMetaEvent } from "../lib/metaCapi.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// La página de "gracias" llama a esta función con el payment_id que devuelve Mercado Pago.
// Acá se verifica el pago real contra la API de MP y, si está aprobado, se envía el Purchase
// a Meta por CAPI. El navegador dispara el Pixel con el mismo event_id solo si esto confirma,
// así Meta deduplica y nadie puede inventar una compra cambiando la URL.
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const { payment_id, curso: cursoKey, fbp, fbc } = parseBody(event);
  // "intensivo" = Intensivos de Verano (Frontend / Backend / Fullstack); el plan sale del pago
  const esIntensivo = cursoKey === "intensivo";
  const curso = esIntensivo ? null : getCurso(cursoKey);
  const paymentId = String(payment_id || "");

  // El ID debe ser numérico: evita inyectar rutas en la URL de la API
  if ((!esIntensivo && !curso) || !/^\d{1,20}$/.test(paymentId)) {
    return json(400, { status: "invalid" });
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });

    if (!response.ok) {
      return json(404, { status: "not_found" });
    }

    const payment = await response.json();

    // El pago tiene que pertenecer a este curso
    const ref = String(payment.external_reference || "");
    let producto;

    if (esIntensivo) {
      const plan = planDesdeReferencia(ref);
      if (!plan) {
        return json(404, { status: "not_found" });
      }
      producto = { itemId: plan.itemId, contentName: plan.titulo, precio: plan.precio, ruta: "full-stack" };
    } else {
      const items = (payment.additional_info && payment.additional_info.items) || [];
      const esDeEsteCurso =
        ref.startsWith(`${cursoKey}:`) || items.some((item) => String(item.id) === curso.itemId);

      if (!esDeEsteCurso) {
        return json(404, { status: "not_found" });
      }
      producto = curso;
    }

    if (payment.status !== "approved") {
      // pending / in_process / rejected: la página muestra el estado, sin Purchase
      return json(200, { status: payment.status });
    }

    const value = Number(payment.transaction_amount) || producto.precio;
    const currency = payment.currency_id || "ARS";
    // Mismo event_id que usa el webhook (appscript-cursos.gs): Meta cuenta una sola compra
    const eventId = `purchase_${paymentId}`;
    const payer = payment.payer || {};
    const metadata = payment.metadata || {};
    const telefono = payer.phone && payer.phone.number
      ? `${payer.phone.area_code || ""}${payer.phone.number}`
      : undefined;

    await sendMetaEvent(event, {
      eventName: "Purchase",
      eventId,
      eventSourceUrl: `${SITE_URL}/${producto.ruta}/gracias`,
      email: payer.email,
      telefono,
      nombre: payer.first_name,
      // Cookies del navegador; si no llegan, las que se guardaron al crear la preferencia
      fbp: fbp || metadata.fbp,
      fbc: fbc || metadata.fbc,
      clientIp: metadata.client_ip,
      userAgent: metadata.user_agent,
      customData: {
        currency,
        value,
        content_name: producto.contentName,
        content_ids: [producto.itemId],
        content_type: "product",
        order_id: paymentId,
      },
    });

    return json(200, {
      status: "approved",
      event_id: eventId,
      value,
      currency,
      content_name: producto.contentName,
      content_id: producto.itemId,
    });
  } catch (error) {
    console.error("Error confirmando compra:", error);
    return json(500, { status: "error" });
  }
}
