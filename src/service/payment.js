import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializar con tu Access Token de MP
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

export async function crearPreferencia() {
  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: [
        {
          id: 'curso-python-infoproducto',
          title: 'Master en Python Desde Cero - WEARESRV',
          quantity: 1,
          unit_price: 80000,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'https://wearesrv.com/python/gracias',
        failure: 'https://wearesrv.com/python/inscripcion',
        pending: 'https://wearesrv.com/python/inscripcion',
      },
      auto_return: 'approved', // Redirige automáticamente al usuario al aprobarse el pago
      notification_url: 'https://tu-api.com/api/webhooks/mercadopago', // Endpoint para recibir la notificación de pago
    },
  });

  return response.init_point; // Usar response.sandbox_init_point para testing
}