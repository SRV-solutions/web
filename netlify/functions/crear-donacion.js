import crypto from "node:crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { SITE_URL, json, isAllowedOrigin, parseBody } from "../lib/http.js";

// Donaciones ("cafecito") desde el juego El Develop.
// El monto lo elige el usuario, pero se valida acá. Mantener en sync con DONATION_MIN / DONATION_MAX
// de src/components/ElDevelop/promo.js.
const MIN_MONTO = 500;
const MAX_MONTO = 500000;

// Sin notification_url: las donaciones no pasan por el Apps Script de cursos, así nunca
// se confunden con una compra. El prefijo "donacion:" las identifica en Mercado Pago.
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  if (!isAllowedOrigin(event)) {
    return json(403, { error: "Origen no permitido" });
  }

  const { monto } = parseBody(event);
  const valor = Number(monto);

  if (!Number.isInteger(valor) || valor < MIN_MONTO || valor > MAX_MONTO) {
    return json(400, { error: `El monto tiene que ser un número entero entre $${MIN_MONTO} y $${MAX_MONTO}` });
  }

  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "donacion-el-develop",
            title: "Cafecito para El Develop - WEARESRV",
            quantity: 1,
            unit_price: valor,
            currency_id: "ARS",
          },
        ],
        external_reference: `donacion:${crypto.randomUUID()}`,
        metadata: { tipo: "donacion", origen: "el-develop" },
        statement_descriptor: "WEARESRV",
        back_urls: {
          success: `${SITE_URL}/el-develop?donacion=gracias`,
          failure: `${SITE_URL}/el-develop?donacion=error`,
          pending: `${SITE_URL}/el-develop?donacion=pendiente`,
        },
        auto_return: "approved",
      },
    });

    return json(200, { init_point: response.init_point });
  } catch (error) {
    console.error("Error creando donación en MP:", error);
    return json(500, { error: "No se pudo crear el pago" });
  }
}
