import { json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido, celularValido } from "../lib/registros.js";

// ==========================================
// PEDIDOS DE DEMO DE GESTIÓNCOOP (/gestioncoop)
//
// Recibe el formulario de la página y lo manda por mail con Resend (el mismo servicio y el mismo dominio
// que usa la app GestiónCoop). No guarda nada: el pedido queda solo en el mail. Con "Responder" se le
// contesta directo a quien lo pidió, si dejó su email.
//
// Variables de entorno en Netlify:
//   RESEND_API_KEY   clave de Resend (la misma que usa GestiónCoop en Railway)
//   LEADS_DESTINO    opcional: a quién llegan los pedidos (por defecto, info@wearesrv.com)
//   LEADS_REMITENTE  opcional: desde dónde salen (por defecto, «WEARESRV <info@wearesrv.com>»)
// Sin RESEND_API_KEY responde 503 y la página ofrece mandar el pedido por WhatsApp.
// ==========================================

const TIMEOUT_MS = 8000;
const SERVICIOS = ["Energía eléctrica", "Agua potable", "Internet", "TV", "Sepelio"];
const PEDIDOS = { demo: "Una demo", cotizacion: "Una cotización", "las-dos": "Una demo y una cotización" };

// Freno simple contra envíos en cadena desde una misma conexión (vale mientras la función siga caliente)
const recientes = new Map();
function demasiados(ip) {
  const ahora = Date.now();
  const lista = (recientes.get(ip) || []).filter((t) => ahora - t < 10 * 60_000);
  lista.push(ahora);
  recientes.set(ip, lista);
  return lista.length > 5;
}

// Link de WhatsApp a partir de cómo lo escriba la persona: «11 2345-6789», «011 ...» o «+54 9 11 ...»
function linkWhatsapp(celular) {
  let d = celular.replace(/\D/g, "");
  if (d.startsWith("0")) d = d.slice(1);
  if (!d.startsWith("54")) d = `549${d}`;
  return `https://wa.me/${d}`;
}

const escapar = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  if (!isAllowedOrigin(event)) return json(403, { error: "Origen no permitido" });

  const body = parseBody(event);
  // Trampa para bots: el campo "empresa" está oculto en el formulario; una persona no lo completa
  if (body.empresa) return json(200, { ok: true });

  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["x-forwarded-for"] || "?";
  if (demasiados(ip)) return json(429, { error: "Demasiados envíos seguidos" });

  const pedido = {
    nombre: limpiar(body.nombre, 80),
    cooperativa: limpiar(body.cooperativa, 120),
    localidad: limpiar(body.localidad, 120),
    celular: limpiar(body.celular, 25),
    email: limpiar(body.email, 120).toLowerCase(),
    servicios: Array.isArray(body.servicios) ? SERVICIOS.filter((s) => body.servicios.includes(s)) : [],
    quiere: Object.hasOwn(PEDIDOS, body.pedido) ? PEDIDOS[body.pedido] : PEDIDOS.demo,
  };
  if (pedido.nombre.length < 2) return json(400, { error: "Datos inválidos", campo: "nombre" });
  if (pedido.cooperativa.length < 2) return json(400, { error: "Datos inválidos", campo: "cooperativa" });
  if (!celularValido(pedido.celular)) return json(400, { error: "Datos inválidos", campo: "celular" });
  if (pedido.email && !emailValido(pedido.email)) return json(400, { error: "Datos inválidos", campo: "email" });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error("GestiónCoop: falta RESEND_API_KEY");
    return json(503, { error: "No se pudo enviar" });
  }

  const filas = [
    ["Nombre", pedido.nombre],
    ["Cooperativa", pedido.cooperativa],
    ["Localidad", pedido.localidad || "—"],
    ["Celular", pedido.celular],
    ["Email", pedido.email || "—"],
    ["Servicios", pedido.servicios.join(", ") || "—"],
    ["Quiere", pedido.quiere],
  ];
  const whatsapp = linkWhatsapp(pedido.celular);
  const texto = [`Pedido de ${pedido.quiere.toLowerCase()} de GestiónCoop desde wearesrv.com/gestioncoop`, "", ...filas.map(([k, v]) => `${k}: ${v}`)].join("\n");
  const html =
    `<p style="font-family:Arial,sans-serif;font-size:15px">Pedido de <b>${escapar(pedido.quiere.toLowerCase())}</b> de GestiónCoop desde wearesrv.com/gestioncoop</p>` +
    `<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    filas.map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${escapar(v)}</b></td></tr>`).join("") +
    `</table><p style="font-family:Arial,sans-serif;font-size:15px"><a href="${escapar(whatsapp)}">Escribirle por WhatsApp</a></p>`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_REMITENTE || "WEARESRV <info@wearesrv.com>",
        to: [process.env.LEADS_DESTINO || "info@wearesrv.com"],
        ...(pedido.email ? { reply_to: pedido.email } : {}),
        subject: `GestiónCoop: ${pedido.quiere.toLowerCase()} para ${pedido.cooperativa}${pedido.localidad ? ` (${pedido.localidad})` : ""}`,
        text: texto,
        html,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("GestiónCoop: Resend respondió", res.status, await res.text().catch(() => ""));
      return json(502, { error: "No se pudo enviar" });
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error("GestiónCoop: no se pudo llamar a Resend:", error);
    return json(502, { error: "No se pudo enviar" });
  } finally {
    clearTimeout(timer);
  }
}
