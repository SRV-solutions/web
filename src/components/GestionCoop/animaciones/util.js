import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Datos de ejemplo de todas las animaciones: la cooperativa y las personas son inventadas
export const COOPE = "Cooperativa Arroyo del Monte";

export const pesos = (n, decimales = 2) =>
  `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;

// Avanza por los pasos de una animación (duraciones en ms) solo mientras se ve en pantalla: fuera de la pantalla
// se queda quieta y no gasta batería. Con «reducir movimiento» del sistema queda fija en el paso `final`.
// `duraciones` tiene que ser una constante del módulo (si cambia en cada render, el ciclo se reinicia).
export function useCiclo(duraciones, { final = duraciones.length - 1, amount = 0.35 } = {}) {
  const ref = useRef(null);
  const enPantalla = useInView(ref, { amount });
  const reducido = useReducedMotion();
  const [paso, setPaso] = useState(0);
  // El contenido animado se monta recién la primera vez que entra en pantalla: si no, sus animaciones de entrada
  // correrían fuera de la vista y el primer paso se perdería.
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    if (enPantalla) setVisto(true);
  }, [enPantalla]);

  useEffect(() => {
    if (reducido || !enPantalla) return undefined;
    const t = setTimeout(() => setPaso((p) => (p + 1) % duraciones.length), duraciones[paso]);
    return () => clearTimeout(t);
  }, [paso, enPantalla, reducido, duraciones]);

  return { ref, paso: reducido ? final : paso, reducido: Boolean(reducido), activo: visto || Boolean(reducido) };
}

// Número que sube de 0 al valor cuando `activo` pasa a true (una sola vez). Sin animación si se pidió menos movimiento.
export function useContador(valor, activo, duracion = 1400) {
  const reducido = useReducedMotion();
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (!activo) return undefined;
    if (reducido) {
      setActual(valor);
      return undefined;
    }
    let raf;
    const inicio = performance.now();
    const tick = (ahora) => {
      const k = Math.min(1, (ahora - inicio) / duracion);
      setActual(valor * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valor, activo, duracion, reducido]);

  return actual;
}

// Generador pseudoaleatorio con semilla: el mapa, el código de barras y el QR salen siempre iguales
export function azar(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
