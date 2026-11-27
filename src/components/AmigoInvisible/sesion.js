// El link de cada uno trae su código después del #: wearesrv.com/amigo-invisible#c=... (participante) o
// #admin=... (organizador). Lo que va después del # no viaja a ningún servidor. Apenas carga la página, el
// código se guarda en este navegador y se borra de la barra de direcciones, para que no quede a la vista ni
// lo registren el píxel de Meta y Google Tag Manager, que guardan la URL de cada visita.
// Por eso App.jsx importa este archivo antes de contar la visita, y no la página (que carga después).
const CLAVES = { c: "amigoInvisible.participante", admin: "amigoInvisible.organizador" };
const enMemoria = {}; // por si el navegador no deja guardar (modo privado)
let tipoDelLink = null;

function guardar(tipo, codigo) {
  enMemoria[tipo] = codigo;
  try {
    if (codigo) localStorage.setItem(CLAVES[tipo], codigo);
    else localStorage.removeItem(CLAVES[tipo]);
  } catch {
    // queda en memoria mientras la pestaña esté abierta
  }
}

// Guarda el código del link y lo saca de la URL. Devuelve "c", "admin" o null si la URL no traía código.
// Corre al cargar la página y otra vez si alguien pega un link con la página ya abierta (solo cambia el #).
export function tomarCodigoDeLaUrl() {
  if (typeof window === "undefined" || window.location.pathname.replace(/\/+$/, "") !== "/amigo-invisible") return null;
  const link = window.location.hash.match(/^#(c|admin)=([a-f0-9]{32})$/i);
  if (!link) return null;
  guardar(link[1], link[2].toLowerCase());
  tipoDelLink = link[1];
  window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  return link[1];
}

tomarCodigoDeLaUrl();

// tipo: "c" (participante) o "admin" (organizador)
export function codigoGuardado(tipo) {
  if (enMemoria[tipo] !== undefined) return enMemoria[tipo];
  try {
    return localStorage.getItem(CLAVES[tipo]);
  } catch {
    return null;
  }
}

export const olvidarCodigo = (tipo) => guardar(tipo, null);

// "c" o "admin" si esta visita llegó desde un link del mail
export const vinoDelLink = () => tipoDelLink;
