import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '1616499123394079';

let initialized = false;

export const initMetaPixel = () => {
  if (initialized) return;

  const options = {
    autoConfig: true,
    debug: false,
  };

  ReactPixel.init(PIXEL_ID, {}, options);
  initialized = true;
};

export const generateEventId = (prefix = 'evt') =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Cookies que crea el Pixel: mejoran el match de los eventos de servidor (CAPI)
const readCookie = (name) => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const getMetaCookies = () => ({ fbp: readCookie('_fbp'), fbc: readCookie('_fbc') });

export const trackPageView = (eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  const options = eventId ? { eventID: eventId } : {};
  ReactPixel.pageView({}, options);
};

export const trackEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  // Asegurar que eventID vaya en las opciones del tercer parámetro
  const options = eventId ? { eventID: eventId } : undefined;

  // Garantizar que data contenga las propiedades necesarias
  const eventData = { ...data };

  ReactPixel.track(eventName, eventData, options);
};

export const trackCustomEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) {
    initMetaPixel();
  }

  const options = eventId ? { eventID: eventId } : undefined;
  ReactPixel.trackCustom(eventName, data, options);
};

// Advanced matching: los datos personales NUNCA van dentro de los parámetros del evento.
// Se le pasan al Pixel con un nuevo init, y el Pixel los hashea antes de enviarlos.
export const setUserData = ({ email, telefono, nombre } = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (!initialized) initMetaPixel();

  const userData = {};
  if (email) userData.em = String(email).trim().toLowerCase();
  if (telefono) userData.ph = String(telefono).replace(/\D/g, '');
  if (nombre) userData.fn = String(nombre).trim().split(/\s+/)[0].toLowerCase();

  window.fbq('init', PIXEL_ID, userData);
};

// Dispara el evento en el Pixel (navegador) y en la API de Conversiones (servidor)
// con el mismo event_id, para que Meta lo cuente una sola vez.
export const trackConversion = (eventName, data = {}, user = {}) => {
  const eventId = generateEventId(eventName.toLowerCase());

  if (user.email || user.telefono || user.nombre) setUserData(user);
  trackEvent(eventName, data, eventId);

  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true, // permite que el envío termine aunque el usuario cambie de página
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        currency: data.currency,
        value: data.value,
        content_name: data.content_name,
        ...getMetaCookies(),
        email: user.email,
        telefono: user.telefono,
        nombre: user.nombre,
      }),
    }).catch((err) => console.warn('Error al enviar evento CAPI:', err));
  } catch (err) {
    console.warn('Error al enviar evento CAPI:', err);
  }

  return eventId;
};
