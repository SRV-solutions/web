import crypto from "node:crypto";
import { CURSOS, getCurso } from "./cursos.js";
import { precioConPromo } from "./promo.js";

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

// Un código que escribió el visitante, para cualquiera de los dos tipos. Devuelve:
//   { ok: true, tipo: "alumnos", precio }
//   { ok: true, tipo: "estellarium", precio, codigo, porcentaje }
//   { ok: false, motivo }  con motivo "invalido", "usado", "vencido", "combo", "con_descuento" o "error"
export async function aplicarCupon(cursoKey, cupon) {
  const curso = typeof cursoKey === "string" && Object.prototype.hasOwnProperty.call(CURSOS, cursoKey) ? CURSOS[cursoKey] : null;
  const codigoEs = codigoEstellarium(cupon);
  if (codigoEs) return aplicarCuponEstellarium(cursoKey, curso, codigoEs);
  const alumnos = aplicarCuponAlumnos(cursoKey, curso, cupon);
  return alumnos ? { ok: true, ...alumnos } : { ok: false, motivo: "invalido" };
}

// ==========================================
// CUPONES DE E-STELLARIUM (los que se ganan en la plataforma: ESTL-PY-7K3QM2)
// Los valida y los da la API de E-stellarium (variables ESTELLARIUM_URL y ESTELLARIUM_KEY en Netlify, la misma
// clave interna que usa el Apps Script). Acá se controlan las reglas de la compra, que la API no conoce:
//   - solo cursos sueltos: no valen en combos ni packs
//   - solo a precio de lista: no valen en preventa, en el Cyber ni con una promo (no se suman descuentos)
// El precio con descuento se calcula sobre el de lista con la misma cuenta que la promo. El cupón se consume
// (/coupons/redeem) recién en el Apps Script, cuando el pago está aprobado.
// ==========================================

// "estl-py-7k3qm2", "ESTL PY 7K3QM2" y "ESTLPY7K3QM2" son el mismo: se arma como lo guarda la API
export function codigoEstellarium(texto) {
  const m = normalizarCupon(texto).match(/^ESTL([A-Z0-9]{2})([A-Z0-9]{6})$/);
  return m ? `ESTL-${m[1]}-${m[2]}` : null;
}

// El tope de los cupones en E-stellarium (no se toca). El Apps Script tiene el mismo número.
const PORCENTAJE_MAXIMO_ESTELLARIUM = 60;

const MOTIVOS_API ={ not_found: "invalido", voided: "invalido", used: "usado", expired: "vencido" };

async function aplicarCuponEstellarium(cursoKey, curso, codigo) {
  if (!curso) return { ok: false, motivo: "combo" }; // los packs ("pack-...") no están en CURSOS
  if (curso.incluye) return { ok: false, motivo: "combo" };
  if (getCurso(cursoKey).precio !== curso.precio) return { ok: false, motivo: "con_descuento" };

  const url = String(process.env.ESTELLARIUM_URL || "").replace(/\/+$/, "");
  const key = String(process.env.ESTELLARIUM_KEY || "").trim();
  if (!url || !key) {
    console.error("Cupones de E-stellarium: faltan ESTELLARIUM_URL o ESTELLARIUM_KEY en Netlify");
    return { ok: false, motivo: "error" };
  }

  try {
    const res = await fetch(`${url}/coupons/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify({ code: codigo }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`Cupones de E-stellarium: la API respondió HTTP ${res.status}`);
      return { ok: false, motivo: "error" };
    }
    const data = await res.json();
    if (!data.valid) return { ok: false, motivo: MOTIVOS_API[data.reason] || "invalido" };
    const porcentaje = Number(data.percent);
    if (!Number.isInteger(porcentaje) || porcentaje < 1 || porcentaje > PORCENTAJE_MAXIMO_ESTELLARIUM) {
      console.error(`Cupones de E-stellarium: porcentaje inesperado ${data.percent}`);
      return { ok: false, motivo: "error" };
    }
    return { ok: true, tipo: "estellarium", codigo, porcentaje, precio: precioConPromo(curso.precio, porcentaje) };
  } catch (error) {
    console.error("Cupones de E-stellarium: no se pudo consultar la API:", error);
    return { ok: false, motivo: "error" };
  }
}

// ==========================================
// CÓDIGO DE ALUMNOS (Fullstack C#)
// ==========================================

// Devuelve { precio, tipo } si el código es válido para ese curso, o null si no.
function aplicarCuponAlumnos(cursoKey, curso, cupon) {
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
