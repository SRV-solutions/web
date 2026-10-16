import { sendMetaEvent } from "../lib/metaCapi.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// Eventos que el navegador puede reportar por CAPI.
// "Purchase" se permite solo para la reserva del intensivo Full Stack (no tiene pago online).
// Las compras de los cursos grabados NO pasan por acá: se confirman en confirmar-compra,
// después de verificar el pago con Mercado Pago.
const ALLOWED_EVENTS = ["ViewContent", "InitiateCheckout", "Lead", "CompleteRegistration", "Contact", "Purchase"];

export const handler = async (event) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return json(405, { message: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const body = parseBody(event);
  const { nombre, email, telefono, event_id, event_name, currency, value, content_name, event_source_url, fbp, fbc } = body;

  if (!ALLOWED_EVENTS.includes(event_name)) {
    return json(400, { error: "Evento no permitido" });
  }

  const numericValue = Number(value);
  const result = await sendMetaEvent(event, {
    eventName: event_name,
    eventId: event_id,
    eventSourceUrl: event_source_url || event.headers.referer || SITE_URL,
    email,
    telefono,
    nombre,
    fbp,
    fbc,
    customData: {
      currency: typeof currency === "string" ? currency.slice(0, 3) : "ARS",
      value: Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : undefined,
      content_name: typeof content_name === "string" ? content_name.slice(0, 200) : undefined,
    },
  });

  return json(result.ok ? 200 : 502, { success: result.ok });
};
