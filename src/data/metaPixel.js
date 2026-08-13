import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true,
  debug: false,
};

if (ReactPixel) {
  ReactPixel.init('1453952745206164', options);
} else {
  console.error('ReactPixel no se cargó correctamente.');
}

export const trackPageView = () => {
  if (ReactPixel) {
    ReactPixel.pageView();
  } else {
    console.error('ReactPixel no está disponible para realizar trackPageView.');
  }
};

export const trackEvent = (event, data) => {
  if (ReactPixel) {
    ReactPixel.track(event, data);
  } else {
    console.error('ReactPixel no está disponible para realizar trackEvent.');
  }
};
