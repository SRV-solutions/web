// Se llama a fbq directamente (el snippet base está en index.html).
// No usamos react-facebook-pixel: su track() descarta el tercer argumento ({ eventID }),
// y sin ese ID Meta no puede deduplicar el evento del navegador con el del servidor (CAPI).
const PIXEL_ID = '1616499123394079';

let initialized = false;

const fbq = (...args) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq(...args);
};

export const initMetaPixel = () => {
  if (initialized) return;
  fbq('init', PIXEL_ID);
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

const eventOptions = (eventId) => (eventId ? { eventID: eventId } : undefined);

export const trackPageView = (eventId = null) => {
  if (!initialized) initMetaPixel();
  fbq('track', 'PageView', {}, eventOptions(eventId));
};

export const trackEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) initMetaPixel();
  fbq('track', eventName, { ...data }, eventOptions(eventId));
};

export const trackCustomEvent = (eventName, data = {}, eventId = null) => {
  if (!initialized) initMetaPixel();
  fbq('trackCustom', eventName, { ...data }, eventOptions(eventId));
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
        content_ids: data.content_ids,
        content_type: data.content_type,
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
