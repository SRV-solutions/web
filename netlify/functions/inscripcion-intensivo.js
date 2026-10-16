import crypto from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { resolverPlan, PREFIJO_REF, EARLY_BIRD_HASTA_MP } from "../lib/intensivos.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// ==========================================
// INSCRIPCIÓN A LOS INTENSIVOS (Frontend / Backend / Fullstack)
//
// 1. Valida los datos del formulario.
// 2. Crea el link de pago de Mercado Pago PERSONAL de este alumno (external_reference único).
// 3. Le pide al Apps Script del Sheet "Curso FullStack" que cargue la fila como "Pendiente"
//    y le mande el mail de instrucciones con SU link de pago (por si pierde la redirección).
// 4. Devuelve el link para que la web lo redirija a Mercado Pago.
//
// Cuando paga, Mercado Pago avisa al mismo Apps Script (notification_url), que marca la fila
// como pagada y manda el mail con los accesos a Discord y WhatsApp.
//
// Variables de entorno en Netlify:
//   MP_ACCESS_TOKEN           (la misma que usan los cursos grabados)
//   INTENSIVO_WEBHOOK_URL     URL /exec del Apps Script del Sheet "Curso FullStack"
//   INTENSIVO_WEBHOOK_SECRET  clave larga y aleatoria; la misma que WEBHOOK_SECRET en ese Apps Script
// ==========================================

const TIMEOUT_APPS_SCRIPT_MS = 7000;

function limpiar(texto, max) {
  return String(texto || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function validar({ nombre, email, telefono }) {
  if (nombre.length < 3 || !/^[\p{L}' .-]+$/u.test(nombre)) return "nombre";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return "email";
  if (!/^\+\d{8,15}$/.test(telefono)) return "telefono";
  return null;
}

function webhookUrl() {
  const baseUrl = process.env.INTENSIVO_WEBHOOK_URL;
  const secret = process.env.INTENSIVO_WEBHOOK_SECRET;
  if (!baseUrl || !secret) return null;

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);
  return url;
}

// Carga la fila en el Sheet y dispara el mail de instrucciones. Si falla no frena el pago:
// cuando llegue el aviso de Mercado Pago, el Apps Script crea la fila con los datos del metadata.
async function registrarEnSheet(datos) {
  const url = webhookUrl();
  if (!url) {
    console.warn("Inscripción intensivo: faltan INTENSIVO_WEBHOOK_URL o INTENSIVO_WEBHOOK_SECRET");
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_APPS_SCRIPT_MS);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "inscripcion", ...datos }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (data.status !== "ok") console.warn("Inscripción intensivo: Apps Script respondió", data);
    return data.status === "ok";
  } catch (error) {
    console.warn("Inscripción intensivo: no se pudo avisar al Apps Script:", error.name);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const body = parseBody(event);
  const datos = {
    nombre: limpiar(body.nombre, 80),
    email: limpiar(body.email, 120).toLowerCase(),
    telefono: limpiar(body.telefono, 20),
  };

  const campoInvalido = validar(datos);
  if (campoInvalido) {
    return json(400, { error: "Datos inválidos", campo: campoInvalido });
  }

  const plan = resolverPlan(body.plan);
  if (!plan) {
    return json(400, { error: "Plan inválido" });
  }

  const ref = `${PREFIJO_REF}${plan.key}:${crypto.randomUUID()}`;
  const notificationUrl = webhookUrl();
  if (notificationUrl) notificationUrl.searchParams.set("source_news", "webhooks");

  const [nombrePila, ...apellidos] = datos.nombre.split(" ");

  const preferenceBody = {
    items: [
      {
        id: plan.itemId,
        title: plan.titulo,
        quantity: 1,
        unit_price: plan.precio,
        currency_id: "ARS",
      },
    ],
    payer: {
      name: nombrePila,
      surname: apellidos.join(" "),
      email: datos.email,
    },
    // El Apps Script busca la fila del alumno con este valor
    external_reference: ref,
    // Respaldo por si la fila no llegó a crearse: el Apps Script la arma con estos datos
    metadata: {
      plan: plan.key,
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
    },
    payment_methods: {
      installments: plan.maxCuotas,
    },
    statement_descriptor: "WEARESRV",
    back_urls: {
      success: `${SITE_URL}/full-stack/gracias`,
      pending: `${SITE_URL}/full-stack/gracias`,
      failure: `${SITE_URL}/full-stack/inscripcion`,
    },
    auto_return: "approved",
    notification_url: notificationUrl ? notificationUrl.toString() : undefined,
  };

  // El link del Early Bird deja de servir cuando termina la preventa
  if (plan.key === "earlybird") {
    preferenceBody.expires = true;
    preferenceBody.expiration_date_to = EARLY_BIRD_HASTA_MP;
  }

  let initPoint;
  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const response = await new Preference(client).create({ body: preferenceBody });
    initPoint = response.init_point;
  } catch (error) {
    console.error("Error creando preferencia del intensivo:", error);
    return json(500, { error: "No se pudo crear el pago" });
  }

  await registrarEnSheet({
    ref,
    plan: plan.key,
    planTexto: `${plan.nombre} ($${plan.precio.toLocaleString("es-AR")})`,
    monto: plan.precio,
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    linkPago: initPoint,
  });

  return json(200, {
    init_point: initPoint,
    plan: plan.key,
    value: plan.precio,
    content_name: plan.titulo,
    content_id: plan.itemId,
  });
}
