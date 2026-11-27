// Las reglas del juego que nombra la página. Las hace cumplir el Apps Script (appscript-amigo-invisible.gs):
// si cambian ahí (CONFIG), cambiarlas también acá y en netlify/functions/amigo-invisible.js.
export const PISTAS_MAX = 5; // en todo el juego, no por día
export const INTENTOS_MAX = 3;
export const MIN_PARTICIPANTES = 3;
export const MAX_PARTICIPANTES = 30;
export const MAX_DIAS_HASTA_INTERCAMBIO = 120;
export const LARGO_MENSAJE = 400;
