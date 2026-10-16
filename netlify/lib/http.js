export const SITE_URL = "https://wearesrv.com";

const ALLOWED_ORIGINS = [SITE_URL, "https://www.wearesrv.com"];

export function json(statusCode, data) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

// Bloquea llamadas desde otros sitios. Se permiten el dominio, los deploy previews y localhost.
export function isAllowedOrigin(event) {
  const origin = event.headers.origin;
  if (!origin) return true; // mismo origen en algunos navegadores / llamadas server-to-server
  return (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".netlify.app") ||
    origin.startsWith("http://localhost")
  );
}

export function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return {};
  }
}
