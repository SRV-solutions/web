import crypto from "node:crypto";

// Función auxiliar para hashear datos personales con SHA-256
function hashData(data) {
  if (!data) return undefined;
  return crypto
    .createHash("sha256")
    .update(data.trim().toLowerCase())
    .digest("hex");
}

export const handler = async (event) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      nombre,
      email,
      telefono,
      event_id,
      event_name,
      currency,
      value,
      content_name,
    } = body;

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Faltan variables de entorno en Netlify" }),
      };
    }

    // Normalizar teléfono (remover caracteres no numéricos)
    const cleanPhone = telefono ? telefono.replace(/\D/g, "") : "";

    // Construir el payload para el Graph API de Meta
    const payload = {
      data: [
        {
          event_name: event_name || "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id,
          action_source: "website",
          user_data: {
            em: [hashData(email)],
            ph: cleanPhone ? [hashData(cleanPhone)] : undefined,
            client_ip_address:
              event.headers["x-nf-client-connection-ip"] ||
              event.headers["client-ip"],
            client_user_agent: event.headers["user-agent"],
          },
          custom_data: {
            currency: currency || "ARS",
            value: value || 80000,
            content_name: content_name || "Curso Redes & AWS",
          },
        },
      ],
    };

    // Enviar evento a la API Graph de Meta (fetch ya está disponible de forma nativa en Node 18+)
    const metaResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const metaData = await metaResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, metaResponse: metaData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};