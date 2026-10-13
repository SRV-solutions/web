import { MercadoPagoConfig, Preference } from "mercadopago";

export async function handler(event, context) {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Inicializar Mercado Pago con la variable de entorno segura de Netlify
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    const preference = new Preference(client);
    console.log(preference);

    const PRECIO_FIJO = 80000;
    const TITULO_FIJO = "Master en Python Desde Cero - WEARESRV";

    const response = await preference.create({
      body: {
        items: [
          {
            id: "curso-python-infoproducto",
            title: TITULO_FIJO,
            quantity: 1,
            unit_price: PRECIO_FIJO,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: "https://wearesrv.com/python/gracias",
          failure: "https://wearesrv.com/python/inscripcion",
          pending: "https://wearesrv.com/python/inscripcion",
        },
        auto_return: "approved",
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        init_point: response.init_point, // O response.sandbox_init_point para pruebas
      }),
    };
  } catch (error) {
    console.error("Error creando preferencia en MP:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
