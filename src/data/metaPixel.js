import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '1616499123394079';

let initialized = false;

// Inicializa el Pixel
export const initMetaPixel = () => {
  if (initialized) return;

  const options = {
    autoConfig: true,
    debug: false,
  };

  ReactPixel.init(PIXEL_ID, {}, options);
  initialized = true;
};

// Envía evento de PageView
export const trackPageView = () => {
  if (!initialized) {
    initMetaPixel();
  }
  ReactPixel.pageView();
};

// Envía eventos estándar (Purchase, Lead, AddToCart, etc.)
export const trackEvent = (eventName, data = {}) => {
  if (!initialized) {
    initMetaPixel();
  }
  ReactPixel.track(eventName, data);
};

// Envía eventos personalizados
export const trackCustomEvent = (eventName, data = {}) => {
  if (!initialized) {
    initMetaPixel();
  }
  ReactPixel.trackCustom(eventName, data);
};