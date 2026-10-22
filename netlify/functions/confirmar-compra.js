import { getCurso, webhookCursosUrl } from "../lib/cursos.js";
import { planDesdeReferencia } from "../lib/intensivos.js";
import { sendMetaEvent } from "../lib/metaCapi.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// Respaldo de la notificación de Mercado Pago: le avisa al Apps Script de cursos que este pago
// está aprobado, por si el webhook de MP no llegó o falló. El Apps Script vuelve a consultar el pago
// a MP y no da acceso dos veces (lock + antiduplicados en la hoja), así que avisar de más no hace daño.
async function avisarAppsScript(paymentId) {
  const url = webhookCursosUrl();
  if (!url) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "payment", data: { id: paymentId } }),
      signal: controller.signal,
    });
    console.log(`Apps Script cursos (pago ${paymentId}): HTTP ${res.status} ${(await res.text()).slice(0, 100)}`);
  } catch (error) {
    // Timeout o error de red: el Apps Script igual puede terminar de procesar, y MP reintenta su webhook
    console.error(`Apps Script cursos (pago ${paymentId}):`, error.name === "AbortError" ? "timeout" : error);
  } finally {
    clearTimeout(timer);
  }
}

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

    // Los intensivos tienen su propio Apps Script (lo avisa la notification_url de inscripcion-intensivo)
    const respaldoAcceso = esIntensivo ? Promise.resolve() : avisarAppsScript(paymentId);

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
    await respaldoAcceso;

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
