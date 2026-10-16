import crypto from "node:crypto";

// Versión de la Graph API. Meta da de baja cada versión ~2 años después de lanzarla:
// se puede actualizar sin tocar código con la variable de entorno META_GRAPH_VERSION.
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

// Hashea datos personales con SHA-256 (requisito de la API de Conversiones)
function hashData(data) {
  if (!data) return undefined;
  return crypto
    .createHash("sha256")
    .update(String(data).trim().toLowerCase())
    .digest("hex");
}

function cleanString(value, max = 200) {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

// Envía un evento a la API de Conversiones de Meta (CAPI).
// El event_id tiene que ser el mismo que usó el Pixel en el navegador para que Meta deduplique.
export async function sendMetaEvent(event, {
  eventName,
  eventId,
  eventSourceUrl,
  email,
  telefono,
  nombre,
  fbp,
  fbc,
  customData = {},
}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("CAPI: faltan META_PIXEL_ID o META_ACCESS_TOKEN en Netlify");
    return { ok: false, error: "missing_env" };
  }

  // Normalizar teléfono (solo dígitos)
  const cleanPhone = telefono ? String(telefono).replace(/\D/g, "") : "";
  // Solo el primer nombre, como pide Meta para "fn"
  const firstName = nombre ? String(nombre).trim().split(/\s+/)[0] : "";

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: cleanString(eventId, 100),
        event_source_url: cleanString(eventSourceUrl, 500),
        action_source: "website",
        user_data: {
          em: email ? [hashData(email)] : undefined,
          ph: cleanPhone ? [hashData(cleanPhone)] : undefined,
          fn: firstName ? [hashData(firstName)] : undefined,
          fbp: cleanString(fbp),
          fbc: cleanString(fbc),
          client_ip_address:
            event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"],
          client_user_agent: event.headers["user-agent"],
        },
        custom_data: customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      console.error("CAPI error:", response.status, await response.text());
      return { ok: false, error: `http_${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.error("CAPI error:", error);
    return { ok: false, error: "network" };
  }
}
