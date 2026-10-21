import crypto from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getCurso } from "../lib/cursos.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// Arma la URL del webhook (un solo Apps Script para todos los cursos) con la clave secreta compartida.
// El Apps Script identifica el curso por el external_reference del pago.
function buildNotificationUrl() {
  const baseUrl = process.env.MP_WEBHOOK_URL;
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!baseUrl || !secret) return undefined;

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);
  url.searchParams.set("source_news", "webhooks");
  return url.toString();
}

export async function handler(event) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const bodyData = parseBody(event);
  // Compatibilidad: si no llega "curso", asumimos Python (comportamiento anterior)
  const cursoKey = typeof bodyData.curso === "string" ? bodyData.curso : "python";
  const curso = getCurso(cursoKey);

  if (!curso) {
    return json(400, { error: "Curso inválido" });
  }

  // Datos del navegador para el Purchase por CAPI (confirmar-compra y el webhook los leen del pago)
  const meta = (value, max) => (typeof value === "string" && value ? value.slice(0, max) : undefined);
  const metaData = {
    fbp: meta(bodyData.fbp, 200),
    fbc: meta(bodyData.fbc, 200),
    client_ip: meta(event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"], 100),
    user_agent: meta(event.headers["user-agent"], 500),
  };

  try {
    // Inicializar Mercado Pago con la variable de entorno segura de Netlify
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: curso.itemId,
            title: curso.titulo,
            quantity: 1,
            unit_price: curso.precio,
            currency_id: "ARS",
          },
        ],
        // El Apps Script y confirmar-compra validan este prefijo para saber de qué curso es el pago
        external_reference: `${cursoKey}:${crypto.randomUUID()}`,
        metadata: { curso: cursoKey, ...metaData },
        statement_descriptor: "WEARESRV",
        back_urls: {
          success: `${SITE_URL}/${curso.ruta}/gracias`,
          failure: curso.urlInscripcion ? `${SITE_URL}${curso.urlInscripcion}` : `${SITE_URL}/${curso.ruta}/inscripcion`,
          pending: `${SITE_URL}/${curso.ruta}/gracias`,
        },
        auto_return: "approved",
        notification_url: buildNotificationUrl(),
      },
    });

    return json(200, {
      init_point: response.init_point, // O response.sandbox_init_point para pruebas
    });
  } catch (error) {
    console.error("Error creando preferencia en MP:", error);
    // No exponemos detalles internos al navegador
    return json(500, { error: "No se pudo crear el pago" });
  }
}
