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