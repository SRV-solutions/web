import { aplicarCupon } from "../lib/cupones.js";
import { json, isAllowedOrigin, parseBody } from "../lib/http.js";

// La página del curso pregunta si un código (de alumnos o de E-stellarium) es válido para mostrar el precio.
// Es solo informativo: al crear el pago, crear-preferencia vuelve a validar el código.
// Responde { valido: true, precio, tipo, porcentaje? } o { valido: false, motivo } (ver aplicarCupon).
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const { curso, cupon } = parseBody(event);
  if (typeof curso !== "string" || typeof cupon !== "string") {
    return json(400, { valido: false });
  }

  const resultado = await aplicarCupon(curso, cupon);
  if (!resultado.ok) return json(200, { valido: false, motivo: resultado.motivo });
  return json(200, { valido: true, precio: resultado.precio, tipo: resultado.tipo, porcentaje: resultado.porcentaje });
}
