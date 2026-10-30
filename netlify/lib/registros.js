// Registros que atiende el Apps Script appscript-fundamentos.gs: Fundamentos IA y las listas de
// espera de los próximos cursos (cada uno en su pestaña de la misma planilla).
//
// Variables de entorno en Netlify (las dos salen del mail de probarConfiguracion()):
//   FUNDAMENTOS_WEBHOOK_URL     URL /exec del Apps Script
//   FUNDAMENTOS_WEBHOOK_SECRET  la misma que WEBHOOK_SECRET en ese Apps Script

const TIMEOUT_APPS_SCRIPT_MS = 8000;

export function limpiar(texto, max) {
  return String(texto || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);
}

export function celularValido(celular) {
  const digitos = celular.replace(/\D/g, "");
  return digitos.length >= 8 && digitos.length <= 15 && /^[\d\s()+-]+$/.test(celular);
}

// Manda el registro al Apps Script y devuelve el statusCode para el navegador:
// 200 si respondió alguno de respuestasOk, 503 si faltan las variables, 502 si falló.
export async function enviarAlAppsScript(payload, respuestasOk, etiqueta) {
  const baseUrl = process.env.FUNDAMENTOS_WEBHOOK_URL;
  const secret = process.env.FUNDAMENTOS_WEBHOOK_SECRET;
  if (!baseUrl || !secret) {
    console.error(`${etiqueta}: faltan FUNDAMENTOS_WEBHOOK_URL o FUNDAMENTOS_WEBHOOK_SECRET`);
    return 503;
  }

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_APPS_SCRIPT_MS);
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!respuestasOk.includes(data.status)) {
      console.error(`${etiqueta}: el Apps Script respondió`, data);
      return 502;
    }
    return 200;
  } catch (error) {
    // El Apps Script sigue ejecutando aunque se corte la espera: si llegó a abortar,
    // Google ya recibió el registro y lo termina de procesar solo.
    if (error.name === "AbortError") {
      console.warn(`${etiqueta}: el Apps Script tardó más de lo esperado`);
      return 200;
    }
    console.error(`${etiqueta}: no se pudo llamar al Apps Script:`, error);
    return 502;
  } finally {
    clearTimeout(timer);
  }
}
