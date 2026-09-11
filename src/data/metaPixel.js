import ReactPixel from 'react-facebook-pixel';

// Pone aquí tus dos IDs de Meta Pixel
const PIXEL_IDS = [
  '1616499123394079' // Pixel 2 (reemplázalo por tu segundo ID)
];

let initialized = false;

export const initMetaPixels = () => {
  if (initialized) return;

  const options = {
    autoConfig: true,
    debug: false,
  };

  // Inicializa cada uno de los pixeles
  PIXEL_IDS.forEach((pixelId) => {
    ReactPixel.init(pixelId, {}, options);
  });

  initialized = true;
};

export const trackPageView = () => {
  if (!initialized) {
    initMetaPixels();
  }
  // Envía el evento de PageView a todos los pixeles activos
  ReactPixel.pageView();
};

export const trackCustomEvent = (event, data = {}) => {
  if (!initialized) {
    initMetaPixels();
  }
  ReactPixel.track(event, data);
};