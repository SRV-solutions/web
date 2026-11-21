import crypto from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getCurso, webhookCursosUrl, cursosQueEntrega } from "../lib/cursos.js";
import { aplicarCupon } from "../lib/cupones.js";
import { promoVigente } from "../lib/promo.js";
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
  const vuelve = desdeKey !== cursoKey && cursosQueEntrega(cursoKey).includes(desdeKey) ? getCurso(desdeKey) : curso;

  // Código de alumnos o cupón de E-stellarium: si es válido para este curso, el precio lo decide el servidor.
  // Queda marcado en el metadata del pago para que el Apps Script acepte ese monto (y consuma el de E-stellarium).
  // Si el código ya no sirve (por ejemplo, lo usaron en otra compra mientras tanto), no se cobra el precio
  // completo sin avisar: la página muestra el motivo.
  let cupon = null;
  if (typeof bodyData.cupon === "string" && bodyData.cupon.trim()) {
    const resultado = await aplicarCupon(cursoKey, bodyData.cupon);
    if (!resultado.ok) return json(409, { error: "Cupón inválido", motivo: resultado.motivo });
    cupon = resultado;
  }
  const precio = cupon ? cupon.precio : curso.precio;
  const promo = promoVigente(process.env.PROMO);
  const titulo = !cupon
    ? curso.titulo
    : cupon.tipo === "alumnos"
      ? `${curso.titulo} (precio alumnos)`
      : `${curso.titulo} (cupón E-stellarium ${cupon.porcentaje}% OFF)`;

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
          // Cupón de E-stellarium: el Apps Script acepta el monto con este porcentaje y consume el código
          // cuando el pago se aprueba. El porcentaje va acá (lo puso el servidor) para no tener que volver a
          // validar el cupón en el webhook, donde podría haber vencido entre el pago y la notificación.
          cupon_codigo: cupon && cupon.tipo === "estellarium" ? cupon.codigo : undefined,
          cupon_porcentaje: cupon && cupon.tipo === "estellarium" ? cupon.porcentaje : undefined,
          // Promo con fecha (variable PROMO): el Apps Script acepta el descuento solo si el pago viene marcado
          // acá, que es el servidor; el navegador no puede ponerlo. Ver netlify/lib/promo.js.
          ...(promo && !cupon
            ? {
                promo: promo.nombre,
                promo_porcentaje: promo.porcentaje,
                promo_hasta: new Date(promo.hasta).toISOString(),
                promo_cursos: promo.cursos ? promo.cursos.join(",") : "",
              }
            : {}),
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
