import crypto from "node:crypto";
import { CURSOS } from "./cursos.js";

// ==========================================
// CÓDIGOS DE DESCUENTO PARA ALUMNOS
// El código nunca se guarda en claro: ni en el repo ni en Netlify. En Netlify vive solo su hash
// SHA-256 (variable "envHash" del curso en CURSOS) y acá se compara el hash de lo que escribió
// el visitante, en tiempo constante. El precio con descuento lo define el servidor: el navegador
// solo manda el código, nunca un precio.
//
// Para crear un código y su hash: node scripts/cupon-hash.mjs
// ==========================================

// Sin tildes, en mayúsculas y solo letras/números: "srv-7k3q 9zpm" y "SRV7K3Q9ZPM" son el mismo código.
// Tiene que ser idéntica a la de scripts/cupon-hash.mjs.
export function normalizarCupon(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function hashCupon(texto) {
  return crypto.createHash("sha256").update(normalizarCupon(texto)).digest("hex");
}

// Devuelve { precio, tipo } si el código es válido para ese curso, o null si no.
export function aplicarCupon(cursoKey, cupon) {
  const curso = typeof cursoKey === "string" && Object.prototype.hasOwnProperty.call(CURSOS, cursoKey) ? CURSOS[cursoKey] : null;
  const config = curso && curso.cuponAlumnos;
  if (!config) return null;

  const normalizado = normalizarCupon(cupon);
  if (normalizado.length < 6 || normalizado.length > 64) return null;

  const esperado = String(process.env[config.envHash] || "").trim().toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(esperado)) {
    console.error(`Cupón de ${cursoKey}: falta o es inválida la variable ${config.envHash} en Netlify`);
    return null;
  }

  const recibido = hashCupon(normalizado);
  const coincide = crypto.timingSafeEqual(Buffer.from(recibido, "hex"), Buffer.from(esperado, "hex"));
  return coincide ? { precio: config.precio, tipo: "alumnos" } : null;
}
