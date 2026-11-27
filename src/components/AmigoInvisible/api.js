// Todas las llamadas del amigo invisible pasan por netlify/functions/amigo-invisible.js, que habla con el
// Apps Script del juego. En local andan con npm run dev si el .env tiene AMIGO_WEBHOOK_URL y AMIGO_WEBHOOK_SECRET
// (vite.config.js corre la misma función).
const URL_FUNCION = "/.netlify/functions/amigo-invisible";

// Identifica un envío: si hay que reintentarlo, el Apps Script no lo guarda dos veces
export const nuevoPedido = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

// Devuelve siempre un objeto con status: "ok" o el motivo (ver MENSAJES)
export async function llamar(accion, datos = {}) {
  const enviar = async () => {
    const res = await fetch(URL_FUNCION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, ...datos }),
    });
    return res.json().catch(() => ({ status: "error" }));
  };
  try {
    let data = await enviar();
    // Tardó o estaba ocupado: con el mismo pedido, reintentar no duplica nada
    if (data.status === "tarde" || data.status === "ocupado") data = await enviar();
    return data;
  } catch {
    return { status: "sin_conexion" };
  }
}

const MENSAJES = {
  sin_conexion: "No hay conexión. Revisá internet y probá de nuevo.",
  error: "Algo falló de nuestro lado. Probá de nuevo en un rato.",
  no_configurado: "El amigo invisible todavía no está activo. Volvé en un rato.",
  tarde: "Tardó más de lo normal. Actualizá la página para ver si se guardó.",
  ocupado: "Hay mucha gente jugando en este momento. Probá de nuevo en unos segundos.",
  sin_cuota: "Hoy ya mandamos todos los mails que podíamos. Probá de nuevo mañana.",
  error_mail: "No pudimos mandar el mail. Revisá que la dirección esté bien escrita.",
  no_encontrado: "Este link no es válido o el juego ya se borró.",
  no_sorteado: "Todavía no se hizo el sorteo de este grupo.",
  juego_terminado: "El juego ya terminó.",
  fecha_vencida: "La fecha del intercambio ya pasó: armá el grupo de nuevo con otra fecha.",
  sin_pistas: "Ya usaste todas tus pistas.",
  sin_intentos: "Ya usaste todos tus intentos.",
  ya_adivinaste: "Ya adivinaste quién es.",
  ya_respondida: "Ya contestaste esa pista.",
  datos_invalidos: "Revisá lo que escribiste.",
};

export const mensajeDe = (status) => MENSAJES[status] || MENSAJES.error;

// ===== Fechas: "AAAA-MM-DD" (la del intercambio y "hoy" llegan así del Apps Script, en hora argentina) =====
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const aUtc = (fecha) => {
  const [a, m, d] = fecha.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
};

export function hoyLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const sumarDias = (fecha, dias) => new Date(aUtc(fecha) + dias * 86400000).toISOString().slice(0, 10);

export const diasEntre = (desde, hasta) => Math.round((aUtc(hasta) - aUtc(desde)) / 86400000);

// "2026-12-24" -> "jueves 24 de diciembre"
export function fechaLarga(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || "")) return fecha || "";
  const d = new Date(aUtc(fecha));
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
}

// Fecha y hora de una pista, en la hora del que la mira
export function cuando(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("es-AR", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}
