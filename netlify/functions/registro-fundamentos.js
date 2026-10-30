import { json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido, celularValido, enviarAlAppsScript } from "../lib/registros.js";

// ==========================================
// REGISTRO A FUNDAMENTOS IA (gratis)
//
// Recibe nombre, mail y celular del formulario de /fundamentos-ia y se los pasa al Apps Script
// (appscript-fundamentos.gs), que los guarda en su planilla, comparte la carpeta de Drive del
// material y manda el mail de acceso. Variables de entorno: ver netlify/lib/registros.js.
// ==========================================

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

  if (datos.nombre.length < 2) return json(400, { error: "Datos inválidos", campo: "nombre" });
  if (!emailValido(datos.email)) return json(400, { error: "Datos inválidos", campo: "email" });
  if (!celularValido(datos.celular)) return json(400, { error: "Datos inválidos", campo: "celular" });

  const status = await enviarAlAppsScript(datos, ["success", "already_registered"], "Registro Fundamentos IA");
  return json(status, status === 200 ? { ok: true } : { error: "No se pudo registrar" });
}
