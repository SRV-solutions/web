import crypto from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getCurso, webhookCursosUrl } from "../lib/cursos.js";
import { aplicarCupon } from "../lib/cupones.js";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

export async function handler(event) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const bodyData = parseBody(event);
  // Compatibilidad: si no llega "curso", asumimos Python (comportamiento anterior)
  const cursoKey = typeof bodyData.curso === "string" ? bodyData.curso : "python";
  const curso = getCurso(cursoKey);

  if (!curso) {
    return json(400, { error: "Curso inválido" });
  }

  // Página desde la que se compró. Para una suma ("scripting-python" comprada en /scripting/inscripcion)
  // el comprador vuelve a la página de gracias de ese curso; si no viene o no corresponde, a la del producto.
  const desdeKey = typeof bodyData.desde === "string" ? bodyData.desde : cursoKey;
  const vuelve =
    desdeKey !== cursoKey && Array.isArray(curso.incluye) && curso.incluye.includes(desdeKey)
      ? getCurso(desdeKey)
      : curso;

  // Código de alumnos: si es válido para este curso, el precio especial lo decide el servidor.
  // Queda marcado en el metadata del pago para que el Apps Script acepte ese monto.
  const cupon = typeof bodyData.cupon === "string" ? aplicarCupon(cursoKey, bodyData.cupon) : null;
  const precio = cupon ? cupon.precio : curso.precio;
  const titulo = cupon ? `${curso.titulo} (precio alumnos)` : curso.titulo;

  // Datos del navegador para el Purchase por CAPI (confirmar-compra y el webhook los leen del pago)
  const meta = (value, max) => (typeof value === "string" && value ? value.slice(0, max) : undefined);
  const metaData = {
    fbp: meta(bodyData.fbp, 200),
    fbc: meta(bodyData.fbc, 200),
    client_ip: meta(event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"], 100),
    user_agent: meta(event.headers["user-agent"], 500),
  };

  try {
    // Inicializar Mercado Pago con la variable de entorno segura de Netlify
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: curso.itemId,
            title: titulo,
            quantity: 1,
            unit_price: precio,
            currency_id: "ARS",
          },
        ],
        // El Apps Script y confirmar-compra validan este prefijo para saber de qué curso es el pago
        external_reference: `${cursoKey}:${crypto.randomUUID()}`,
        metadata: {
          curso: cursoKey,
          desde: vuelve === curso ? undefined : desdeKey,
          cupon: cupon ? cupon.tipo : undefined,
          ...metaData,
        },
        statement_descriptor: "WEARESRV",
        back_urls: {
          success: `${SITE_URL}/${vuelve.ruta}/gracias`,
          failure: vuelve.urlInscripcion ? `${SITE_URL}${vuelve.urlInscripcion}` : `${SITE_URL}/${vuelve.ruta}/inscripcion`,
          pending: `${SITE_URL}/${vuelve.ruta}/gracias`,
        },
        auto_return: "approved",
        // Un solo Apps Script para todos los cursos: identifica el curso por el external_reference
        notification_url: webhookCursosUrl(),
      },
    });

    return json(200, {
      init_point: response.init_point, // O response.sandbox_init_point para pruebas
    });
  } catch (error) {
    console.error("Error creando preferencia en MP:", error);
    // No exponemos detalles internos al navegador
    return json(500, { error: "No se pudo crear el pago" });
  }
}
