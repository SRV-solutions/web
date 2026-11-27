import { json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido, celularValido } from "../lib/registros.js";

// ==========================================
// PEDIDOS DE DEMO DE GESTIÓNCOOP (/gestioncoop)
//
// Recibe el formulario de la página y manda dos mails con Resend (el mismo servicio y el mismo dominio
// que usa la app GestiónCoop). No guarda nada: el pedido queda solo en los mails.
//   1. Aviso a SRV con todos los datos. «Responder» le contesta directo a quien lo pidió.
//   2. Confirmación a quien lo pidió, en nombre de SRV. Si responde, la respuesta llega a SRV.
// Si el aviso no sale, la página ofrece mandar el pedido por WhatsApp. Si la confirmación no sale, el
// pedido igual cuenta como recibido (el aviso ya llegó) y queda el error en el registro de la función.
//
// Variables de entorno en Netlify:
//   RESEND_API_KEY   clave de Resend (la misma que usa GestiónCoop en Railway)
//   LEADS_DESTINO    opcional: a quién llegan los avisos (por defecto, info@wearesrv.com; acepta varios
//                    separados por coma)
//   LEADS_REMITENTE  opcional: desde dónde salen, como Nombre <direccion@wearesrv.com> (por defecto,
//                    WEARESRV <info@wearesrv.com>). Se acomoda solo si viene con comillas o acentos.
// Sin RESEND_API_KEY responde 503 y la página ofrece mandar el pedido por WhatsApp.
// ==========================================

const TIMEOUT_MS = 5000;
const SERVICIOS = ["Energía eléctrica", "Agua potable", "Internet", "TV", "Sepelio"];
const PEDIDOS = { demo: "Una demo", cotizacion: "Una cotización", "las-dos": "Una demo y una cotización" };
const REMITENTE_POR_DEFECTO = "WEARESRV <info@wearesrv.com>";
const DESTINO_POR_DEFECTO = "info@wearesrv.com";
// El mismo WhatsApp que muestra la web (LEGAL en src/data/legal.js)
const WHATSAPP_SRV = "https://wa.me/5491123869799";
const LOGO = "https://wearesrv.com/SRV-LOGO.png";
const DIRECCION = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// Freno simple contra envíos en cadena desde una misma conexión (vale mientras la función siga caliente)
const recientes = new Map();
function demasiados(ip) {
  const ahora = Date.now();
  const lista = (recientes.get(ip) || []).filter((t) => ahora - t < 10 * 60_000);
  lista.push(ahora);
  recientes.set(ip, lista);
  return lista.length > 5;
}

// Resend no acepta acentos ni comillas en el remitente: de lo que venga se saca la dirección y un nombre
// sin acentos. «WEARESRV info@wearesrv.com» o "GestiónCoop <info@...>" quedan bien.
export function remitente(crudo) {
  const direccion = String(crudo || "").match(DIRECCION)?.[0];
  if (!direccion) return REMITENTE_POR_DEFECTO;
  const nombre = String(crudo)
    .replace(direccion, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .&'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return nombre ? `${nombre} <${direccion}>` : direccion;
}

export function destinos(crudo) {
  const lista = String(crudo || "").match(DIRECCION);
  return lista && lista.length ? lista : [DESTINO_POR_DEFECTO];
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

const FUENTE = "font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a";

async function enviarMail(clave, mail) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify(mail),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`GestiónCoop: Resend respondió ${res.status} (${mail.subject})`, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error(`GestiónCoop: no se pudo llamar a Resend (${mail.subject}):`, error);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function avisoParaSrv(pedido) {
  const filas = [
    ["Nombre", pedido.nombre],
    ["Cooperativa", pedido.cooperativa],
    ["Localidad", pedido.localidad || "—"],
    ["Celular", pedido.celular],
    ["Email", pedido.email],
    ["Servicios", pedido.servicios.join(", ") || "—"],
    ["Quiere", pedido.quiere],
  ];
  const whatsapp = linkWhatsapp(pedido.celular);
  return {
    subject: `GestiónCoop: ${pedido.quiere.toLowerCase()} para ${pedido.cooperativa}${pedido.localidad ? ` (${pedido.localidad})` : ""}`,
    text: [
      `${pedido.nombre} pidió ${pedido.quiere.toLowerCase()} de GestiónCoop desde wearesrv.com/gestioncoop.`,
      "",
      ...filas.map(([k, v]) => `${k}: ${v}`),
      "",
      `WhatsApp: ${whatsapp}`,
      "Ya le llegó un mail de confirmación. Si respondés este mail, le llega a esa persona.",
    ].join("\n"),
    html:
      `<div style="${FUENTE}"><p><b>${escapar(pedido.nombre)}</b> pidió <b>${escapar(pedido.quiere.toLowerCase())}</b> de GestiónCoop desde wearesrv.com/gestioncoop.</p>` +
      `<table style="border-collapse:collapse">` +
      filas.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${escapar(v)}</b></td></tr>`).join("") +
      `</table><p><a href="${escapar(whatsapp)}" style="color:#0b78fb;font-weight:bold">Escribirle por WhatsApp</a></p>` +
      `<p style="color:#666;font-size:13px">Ya le llegó un mail de confirmación. Si respondés este mail, le llega a esa persona.</p></div>`,
  };
}

function confirmacionParaQuienPidio(pedido) {
  const primerNombre = pedido.nombre.split(" ")[0];
  const quiere = pedido.quiere.toLowerCase();
  return {
    subject: "Recibimos tu pedido de GestiónCoop",
    text: [
      `Hola, ${primerNombre}:`,
      "",
      `Recibimos tu pedido de ${quiere} de GestiónCoop para ${pedido.cooperativa}. Te escribimos en menos de un día hábil al ${pedido.celular}.`,
      "",
      `Si querés adelantarlo, escribinos por WhatsApp: ${WHATSAPP_SRV}`,
      "",
      "Saludos,",
      "SRV · wearesrv.com",
    ].join("\n"),
    html:
      `<div style="${FUENTE};max-width:560px">` +
      `<div style="background:#000;padding:18px 22px;border-radius:12px 12px 0 0"><img src="${LOGO}" alt="SRV" height="36" style="display:block"></div>` +
      `<div style="border:1px solid #e6e6e6;border-top:0;border-radius:0 0 12px 12px;padding:22px">` +
      `<p>Hola, ${escapar(primerNombre)}:</p>` +
      `<p>Recibimos tu pedido de <b>${escapar(quiere)}</b> de GestiónCoop para <b>${escapar(pedido.cooperativa)}</b>. Te escribimos en menos de un día hábil al <b>${escapar(pedido.celular)}</b>.</p>` +
      `<p>Si querés adelantarlo, <a href="${WHATSAPP_SRV}" style="color:#0b78fb;font-weight:bold">escribinos por WhatsApp</a>.</p>` +
      `<p style="margin-top:24px">Saludos,<br><b>SRV</b> · <a href="https://wearesrv.com" style="color:#f6950a">wearesrv.com</a></p>` +
      `</div></div>`,
  };
}

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
  if (!emailValido(pedido.email)) return json(400, { error: "Datos inválidos", campo: "email" });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    console.error("GestiónCoop: falta RESEND_API_KEY");
    return json(503, { error: "No se pudo enviar" });
  }
  const from = remitente(process.env.LEADS_REMITENTE);
  const srv = destinos(process.env.LEADS_DESTINO);

  // Primero el aviso: es lo que no se puede perder
  const avisado = await enviarMail(clave, { from, to: srv, reply_to: pedido.email, ...avisoParaSrv(pedido) });
  if (!avisado) return json(502, { error: "No se pudo enviar" });

  await enviarMail(clave, { from, to: [pedido.email], reply_to: srv, ...confirmacionParaQuienPidio(pedido) });
  return json(200, { ok: true });
}
