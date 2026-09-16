import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '1616499123394079';

let initialized = false;

// Inicializa el Pixel de Meta
export const initMetaPixel = () => {
  if (initialized) return;

  const options = {
    autoConfig: true,
    debug: false,
  };

  ReactPixel.init(PIXEL_ID, {}, options);
  initialized = true;
};

/**
 * Envía el evento PageView con soporte para desduplicación vía event_id
 * @param {string|null} eventId ID único generado en App.jsx (o por tu servidor)
 */
export const trackPageView = (eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  // ReactPixel permite enviar las opciones (como eventID) en el segundo parámetro de pageView
  const options = eventId ? { eventID: eventId } : {};
  ReactPixel.pageView({}, options);
};

/**
 * Envía eventos estándar de Meta (Lead, Purchase, AddToCart, etc.)
 * @param {string} eventName Nombre del evento (ej: 'Lead')
 * @param {object} data Payload adicional del evento
 * @param {string|null} eventId ID único para desduplicar con Conversions API (CAPI)
 */
export const trackEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  const options = eventId ? { eventID: eventId } : {};
  ReactPixel.track(eventName, data, options);
};

/**
 * Envía eventos personalizados
 * @param {string} eventName Nombre personalizado del evento
 * @param {object} data Payload adicional del evento
 * @param {string|null} eventId ID único para desduplicar con CAPI
 */
export const trackCustomEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  const options = eventId ? { eventID: eventId } : {};
  ReactPixel.trackCustom(eventName, data, options);
};