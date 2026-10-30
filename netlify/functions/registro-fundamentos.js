import { json, isAllowedOrigin, parseBody } from "../lib/http.js";

// ==========================================
// REGISTRO A FUNDAMENTOS IA (gratis)
//
// Recibe nombre, mail y celular del formulario de /fundamentos-ia y se los pasa al Apps Script
// de Fundamentos IA (appscript-fundamentos.gs), que los guarda en su planilla, comparte la
// carpeta de Drive del material y manda el mail de acceso.
//
// Variables de entorno en Netlify (las dos salen del mail de probarConfiguracion()):
//   FUNDAMENTOS_WEBHOOK_URL     URL /exec del Apps Script de Fundamentos IA
//   FUNDAMENTOS_WEBHOOK_SECRET  la misma que WEBHOOK_SECRET en ese Apps Script
// ==========================================

const TIMEOUT_APPS_SCRIPT_MS = 8000;
const RESPUESTAS_OK = ["success", "already_registered"];

function limpiar(texto, max) {
  return String(texto || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function validar({ nombre, email, celular }) {
  if (nombre.length < 2) return "nombre";
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return "email";
  const digitos = celular.replace(/\D/g, "");
  if (digitos.length < 8 || digitos.length > 15 || !/^[\d\s()+-]+$/.test(celular)) return "celular";
  return null;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const body = parseBody(event);

  // Trampa para bots: el campo "empresa" está oculto en el formulario; una persona no lo completa
  if (body.empresa) {
    return json(200, { ok: true });
  }

  const datos = {
    nombre: limpiar(body.nombre, 80),
    email: limpiar(body.email, 120).toLowerCase(),
    celular: limpiar(body.celular, 25),
  };

  const campoInvalido = validar(datos);
  if (campoInvalido) {
    return json(400, { error: "Datos inválidos", campo: campoInvalido });
  }

  const baseUrl = process.env.FUNDAMENTOS_WEBHOOK_URL;
  const secret = process.env.FUNDAMENTOS_WEBHOOK_SECRET;
  if (!baseUrl || !secret) {
    console.error("Registro Fundamentos IA: faltan FUNDAMENTOS_WEBHOOK_URL o FUNDAMENTOS_WEBHOOK_SECRET");
    return json(503, { error: "Registro no disponible" });
  }

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_APPS_SCRIPT_MS);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!RESPUESTAS_OK.includes(data.status)) {
      console.error("Registro Fundamentos IA: el Apps Script respondió", data);
      return json(502, { error: "No se pudo registrar" });
    }
    return json(200, { ok: true });
  } catch (error) {
    // El Apps Script sigue ejecutando aunque se corte la espera: si llegó a abortar,
    // Google ya recibió el registro y lo termina de procesar solo.
    if (error.name === "AbortError") {
      console.warn("Registro Fundamentos IA: el Apps Script tardó más de lo esperado");
      return json(200, { ok: true });
    }
    console.error("Registro Fundamentos IA: no se pudo llamar al Apps Script:", error);
    return json(502, { error: "No se pudo registrar" });
  } finally {
    clearTimeout(timer);
  }
}
