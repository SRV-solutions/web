import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";
import { limpiar, emailValido } from "../lib/registros.js";

// ==========================================
// AMIGO INVISIBLE (wearesrv.com/amigo-invisible)
//
// La página llama acá con { accion, ... }. Esta función valida los datos, se los pasa al Apps Script del
// juego (appscript-amigo-invisible.gs, un proyecto aparte de los de cursos) con la clave secreta, y le
// devuelve al navegador lo que responde: { status: "ok", ... } o { status: "<motivo>" }.
//
// Variables de entorno en Netlify (salen del mail de probarConfiguracion() de ese Apps Script):
//   AMIGO_WEBHOOK_URL     URL /exec del Apps Script
//   AMIGO_WEBHOOK_SECRET  la misma que WEBHOOK_SECRET en ese Apps Script
// ==========================================

// Netlify corta las funciones a los 10 segundos. Si el Apps Script tarda más, sigue trabajando solo: el
// sorteo ya quedó guardado y los mails siguen saliendo (por eso "en_proceso"); en lo demás, la página
// reintenta con el mismo "pedido" y el Apps Script no lo guarda dos veces.
const TIMEOUT_MS = 9000;

const LARGO_MENSAJE = 400; // igual a CONFIG.LARGO_MENSAJE del Apps Script
const MAX_PARTICIPANTES = 30; // igual a CONFIG.MAX_PARTICIPANTES

const CODIGO = /^[a-f0-9]{32}$/;
const ID = /^[A-Z0-9-]{1,24}$/;
const PEDIDO = /^[A-Za-z0-9-]{8,40}$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Respuestas del Apps Script que son fallas de configuración o del script: el navegador ve "error"
const FALLAS = ["unauthorized", "config_error", "error", "accion_invalida"];

class Invalido extends Error {
  constructor(campo, detalle = "") {
    super(campo);
    this.campo = campo;
    this.detalle = detalle;
  }
}

const codigo = (valor) => {
  const c = String(valor || "").toLowerCase();
  if (!CODIGO.test(c)) throw new Invalido("codigo");
  return c;
};
const id = (valor, campo) => {
  const v = String(valor || "").toUpperCase();
  if (!ID.test(v)) throw new Invalido(campo);
  return v;
};
const pedido = (valor) => (PEDIDO.test(String(valor || "")) ? String(valor) : "");
const mensaje = (valor) => {
  const texto = String(valor || "").replace(/\r\n?/g, "\n").trim().slice(0, LARGO_MENSAJE);
  if (!texto) throw new Invalido("texto");
  return texto;
};
const mail = (valor, campo, detalle) => {
  const m = limpiar(valor, 120).toLowerCase();
  if (!emailValido(m)) throw new Invalido(campo, detalle);
  return m;
};

// Los links de los mails apuntan al sitio donde se armó el grupo: wearesrv.com, un deploy preview (para probar
// antes de publicar) o localhost con npm run dev. Sale del host al que llegó el pedido, que Netlify solo atiende
// para este sitio, y no de algo que mande el navegador.
function sitioDe(event) {
  const host = String(event.headers.host || "").toLowerCase();
  if (/^[a-z0-9-]+\.netlify\.app$/.test(host)) return `https://${host}`;
  if (/^localhost:\d{2,5}$/.test(host)) return `http://${host}`;
  return SITE_URL;
}

// Cada acción arma lo que le llega al Apps Script. Los mínimos, las fechas y los repetidos los revisa él.
const ACCIONES = {
  crear: (b, event) => {
    const nombre = limpiar(b.grupo?.nombre, 60);
    if (!nombre) throw new Invalido("grupo");
    const fecha = String(b.grupo?.fecha || "");
    if (!FECHA.test(fecha)) throw new Invalido("fecha");
    const organizador = { nombre: limpiar(b.organizador?.nombre, 60) };
    if (!organizador.nombre) throw new Invalido("organizador");
    organizador.mail = mail(b.organizador?.mail, "mailOrganizador");

    const lista = Array.isArray(b.participantes) ? b.participantes : [];
    if (lista.length > MAX_PARTICIPANTES) throw new Invalido("cantidad");
    const participantes = lista.map((p, i) => {
      const nombreP = limpiar(p?.nombre, 60);
      if (!nombreP) throw new Invalido("participante", i);
      return { nombre: nombreP, mail: mail(p?.mail, "mailParticipante", nombreP) };
    });

    return {
      grupo: { nombre, fecha, presupuesto: limpiar(b.grupo?.presupuesto, 40) },
      organizador,
      participa: b.participa === true,
      participantes,
      novedades: b.novedades === true,
      pedido: pedido(b.pedido),
      sitio: sitioDe(event),
    };
  },
  organizador: (b) => ({ codigo: codigo(b.codigo) }),
  sortear: (b) => ({ codigo: codigo(b.codigo) }),
  reenviarParticipante: (b) => ({ codigo: codigo(b.codigo), participante: id(b.participante, "participante") }),
  estado: (b) => ({ codigo: codigo(b.codigo) }),
  pista: (b) => ({ codigo: codigo(b.codigo), texto: mensaje(b.texto), pedido: pedido(b.pedido) }),
  responder: (b) => ({
    codigo: codigo(b.codigo),
    pista: id(b.pista, "pista"),
    texto: mensaje(b.texto),
    pedido: pedido(b.pedido),
  }),
  adivinar: (b) => ({
    codigo: codigo(b.codigo),
    participante: id(b.participante, "participante"),
    pedido: pedido(b.pedido),
  }),
  novedades: (b) => ({ codigo: codigo(b.codigo), acepta: b.acepta === true }),
  reenviar: (b) => ({ mail: mail(b.mail, "mail") }),
};

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { status: "metodo_invalido" });
  if (!isAllowedOrigin(event)) return json(403, { status: "origen_invalido" });

  const body = parseBody(event);

  // Trampa para bots: el campo "empresa" está oculto en el formulario; una persona no lo completa
  if (body.empresa) return json(200, { status: "ok" });

  const armar = Object.hasOwn(ACCIONES, body.accion) ? ACCIONES[body.accion] : null;
  if (!armar) return json(400, { status: "accion_invalida" });

  let payload;
  try {
    payload = armar(body, event);
  } catch (error) {
    if (error instanceof Invalido) {
      return json(400, { status: "datos_invalidos", campo: error.campo, detalle: error.detalle });
    }
    throw error;
  }

  const baseUrl = process.env.AMIGO_WEBHOOK_URL;
  const secret = process.env.AMIGO_WEBHOOK_SECRET;
  if (!baseUrl || !secret) {
    console.error("Amigo invisible: faltan AMIGO_WEBHOOK_URL o AMIGO_WEBHOOK_SECRET");
    return json(503, { status: "no_configurado" });
  }

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: body.accion, ...payload }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (!data || typeof data.status !== "string" || FALLAS.includes(data.status)) {
      console.error(`Amigo invisible (${body.accion}): el Apps Script respondió`, res.status, data);
      return json(502, { status: "error" });
    }
    return json(200, data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn(`Amigo invisible (${body.accion}): el Apps Script tardó más de lo esperado`);
      return json(200, { status: body.accion === "sortear" ? "en_proceso" : "tarde" });
    }
    console.error(`Amigo invisible (${body.accion}): no se pudo llamar al Apps Script:`, error);
    return json(502, { status: "error" });
  } finally {
    clearTimeout(timer);
  }
}
