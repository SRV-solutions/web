import { json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido, enviarAlAppsScript } from "../lib/registros.js";

// ==========================================
// NEWSLETTER: ALTAS DESDE LAS GUÍAS GRATIS (/redes)
//
// Recibe el mail con el que se desbloquea una guía y se lo pasa al Apps Script de registros
// (appscript-fundamentos.gs), que lo guarda en la pestaña "Newsletter". No manda mail: la guía
// se abre en la página y la cuota de Gmail queda para las compras. Variables de entorno: ver
// netlify/lib/registros.js.
//
// El mail va dentro de "contacto" a propósito: un Apps Script sin la acción "newsletter" lo
// rechaza como mail inválido en vez de tomarlo como un registro de Fundamentos IA.
// ==========================================

// La guía que trajo a cada uno: queda en la planilla
const ORIGENES = {
  "guia-redes": "Guía Redes y nube",
};

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

  const origen = Object.hasOwn(ORIGENES, body.origen) ? ORIGENES[body.origen] : null;
  if (!origen) return json(400, { error: "Datos inválidos", campo: "origen" });

  const email = limpiar(body.email, 120).toLowerCase();
  if (!emailValido(email)) return json(400, { error: "Datos inválidos", campo: "email" });

  const status = await enviarAlAppsScript(
    { accion: "newsletter", origen, contacto: { email } },
    ["newsletter_ok", "newsletter_ya_registrado"],
    "Newsletter"
  );
  return json(status, status === 200 ? { ok: true } : { error: "No se pudo registrar" });
}
