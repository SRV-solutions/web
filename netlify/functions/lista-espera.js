import { json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido, celularValido, enviarAlAppsScript } from "../lib/registros.js";

// ==========================================
// LISTA DE ESPERA DE LOS PRÓXIMOS CURSOS (/proximos-cursos)
//
// Recibe curso, nombre, apellido, mail y celular y se los pasa al Apps Script de registros
// (appscript-fundamentos.gs), que los guarda en la pestaña "Lista de espera" y le manda al
// anotado un mail de confirmación. Variables de entorno: ver netlify/lib/registros.js.
// ==========================================

// Mismas claves que PROXIMOS en src/components/ProximosCursos/Index.jsx
const CURSOS = {
  "ia-trabajo": "IA para el trabajo",
  sql: "SQL desde cero",
  "ia-docentes": "IA para docentes",
  redes: "Redes, Linux y AWS",
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

  const curso = CURSOS[body.curso];
  if (!curso) return json(400, { error: "Datos inválidos", campo: "curso" });

  const contacto = {
    nombre: limpiar(body.nombre, 60),
    apellido: limpiar(body.apellido, 60),
    email: limpiar(body.email, 120).toLowerCase(),
    celular: limpiar(body.celular, 25),
  };

  if (contacto.nombre.length < 2) return json(400, { error: "Datos inválidos", campo: "nombre" });
  if (contacto.apellido.length < 2) return json(400, { error: "Datos inválidos", campo: "apellido" });
  if (!emailValido(contacto.email)) return json(400, { error: "Datos inválidos", campo: "email" });
  if (!celularValido(contacto.celular)) return json(400, { error: "Datos inválidos", campo: "celular" });

  const status = await enviarAlAppsScript(
    { accion: "lista-espera", curso, contacto },
    ["lista_ok", "lista_ya_registrado"],
    "Lista de espera"
  );
  return json(status, status === 200 ? { ok: true } : { error: "No se pudo registrar" });
}
