import { aplicarCupon } from "../lib/cupones.js";
import { json, isAllowedOrigin, parseBody } from "../lib/http.js";

// La página del curso pregunta si el código de alumno es válido para mostrar el precio especial.
// Es solo informativo: al crear el pago, crear-preferencia vuelve a validar el código.
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

  const resultado = aplicarCupon(curso, cupon);
  return json(200, resultado ? { valido: true, precio: resultado.precio } : { valido: false });
}
