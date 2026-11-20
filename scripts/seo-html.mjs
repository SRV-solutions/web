// Plugin de Vite: después de compilar, escribe en dist un HTML por ruta con el <head> de esa página (título,
// descripción, canonical y vista previa). La web es una SPA: sin esto, cualquier URL devuelve el HTML del inicio,
// y WhatsApp, Facebook y los buscadores que no ejecutan JavaScript ven el título y la imagen del inicio.
// Solo cambia el <head>: el <body> es el mismo y React arranca igual, así que no hay precios ni contenido
// congelados en el HTML. Los textos salen de src/data/seo.js y src/data/seoCursos.js, los mismos que usan las páginas.
//
// Netlify sirve /sql/inscripcion desde dist/sql/inscripcion.html. Lo que no tiene archivo ni regla en
// public/_redirects cae en dist/404.html, que es la misma app con estado 404 (React muestra «Página no encontrada»).
// Por eso el build se corta si App.jsx tiene una ruta que no está cubierta: mejor que no se publique.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const escapar = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Reemplaza un tag de index.html. Tiene que estar una sola vez: si index.html cambia, el build avisa.
function cambiar(html, nombre, patron, valor) {
  const veces = html.match(new RegExp(patron.source, "g"))?.length || 0;
  if (veces !== 1) throw new Error(`seo-html: se esperaba un solo «${nombre}» en index.html y hay ${veces}`);
  return html.replace(patron, (_todo, antes, despues) => `${antes}${escapar(valor)}${despues}`);
}

const meta = (atributo, nombre) => new RegExp(`(<meta[^>]*${atributo}="${nombre}"[^>]*content=")[^"]*(")`);

export function htmlDePagina(base, pagina, { SITE_URL, IMAGEN_POR_DEFECTO }) {
  const url = `${SITE_URL}${pagina.path}`;
  const imagen = pagina.image || IMAGEN_POR_DEFECTO;
  let html = base;
  html = cambiar(html, "title", /(<title>)[^<]*(<\/title>)/, pagina.title);
  html = cambiar(html, "description", meta("name", "description"), pagina.description);
  html = cambiar(html, "canonical", /(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/, url);
  html = cambiar(html, "og:type", meta("property", "og:type"), pagina.type || "website");
  html = cambiar(html, "og:title", meta("property", "og:title"), pagina.title);
  html = cambiar(html, "og:description", meta("property", "og:description"), pagina.description);
  html = cambiar(html, "og:url", meta("property", "og:url"), url);
  html = cambiar(html, "og:image", meta("property", "og:image"), imagen);
  html = cambiar(html, "twitter:title", meta("name", "twitter:title"), pagina.title);
  html = cambiar(html, "twitter:description", meta("name", "twitter:description"), pagina.description);
  html = cambiar(html, "twitter:image", meta("name", "twitter:image"), imagen);
  if (pagina.imageAlt) html = cambiar(html, "og:image:alt", meta("property", "og:image:alt"), pagina.imageAlt);
  if (pagina.image) {
    // El ancho y el alto de index.html son los de la imagen por defecto
    html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, "");
  }
  if (pagina.noindex) {
    // Con data-react-helmet, la página lo saca sola si resulta que sí se indexa
    html = html.replace(
      /(<link[^>]*rel="canonical"[^>]*>)/,
      `$1\n  <meta data-react-helmet="true" name="robots" content="noindex, follow" />`
    );
  }
  return html;
}

// Todas las páginas que llevan HTML propio. archivo es la ruta dentro de dist.
async function paginas(raiz) {
  const traer = (archivo) => import(pathToFileURL(path.join(raiz, archivo)).href);
  const seo = await traer("src/data/seo.js");
  const { seoInicio, seoCurso, CURSOS_CON_PAGINA } = await traer("src/data/seoCursos.js");

  const lista = [{ ...seoInicio(), archivo: "index.html" }];
  for (const key of CURSOS_CON_PAGINA) lista.push(seoCurso(key));
  for (const [ruta, datos] of Object.entries(seo.SEO_PAGINAS)) lista.push({ path: ruta, ...datos });
  // Páginas de gracias (Mercado Pago vuelve a cada una) y certificados: sin buscadores
  for (const ruta of RUTAS_GRACIAS) lista.push({ path: ruta, ...seo.SEO_GRACIAS, sitemap: false });
  lista.push({ path: "/certificates", ...seo.SEO_CERTIFICADO, sitemap: false });
  lista.push({ ...seo.SEO_NO_ENCONTRADA, archivo: "404.html", sitemap: false });
  return { lista, seo };
}

const RUTAS_GRACIAS = [
  "/scripting/gracias",
  "/scratch/gracias",
  "/python/gracias",
  "/fullstack-csharp/gracias",
  "/ruta-backend/gracias",
  "/javascript/gracias",
  "/backend-avanzado/gracias",
  "/full-stack/gracias",
  "/redes/gracias",
  "/excel/gracias",
  "/sql/gracias",
];

// Cada ruta de App.jsx tiene que tener su HTML o una regla en _redirects (redirecciones y /certificates/*)
function revisarRutas(raiz, lista) {
  const app = fs.readFileSync(path.join(raiz, "src/App.jsx"), "utf8");
  const rutas = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((r) => r !== "*");
  const conHtml = new Set(lista.map((p) => p.path));
  const reglas = fs
    .readFileSync(path.join(raiz, "public/_redirects"), "utf8")
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea && !linea.startsWith("#"))
    .map((linea) => linea.split(/\s+/)[0]);
  const conRegla = (ruta) => {
    const pedida = ruta.replace(/:[^/]+/g, "x");
    return reglas.some((regla) =>
      regla.endsWith("/*") ? regla !== "/*" && pedida.startsWith(regla.slice(0, -1)) : regla === pedida
    );
  };
  const sueltas = rutas.filter((ruta) => !conHtml.has(ruta) && !conRegla(ruta));
  if (sueltas.length) {
    throw new Error(
      `seo-html: estas rutas de App.jsx no tienen HTML ni regla en public/_redirects y devolverían 404: ${sueltas.join(", ")}. ` +
        "Sumalas a src/data/seo.js (o a RUTAS_GRACIAS en scripts/seo-html.mjs) o agregá su redirección."
    );
  }
}

// Las páginas que se ofrecen a los buscadores tienen que estar en el sitemap
function revisarSitemap(raiz, lista, SITE_URL) {
  const sitemap = fs.readFileSync(path.join(raiz, "public/sitemap.xml"), "utf8");
  const faltan = lista
    .filter((p) => !p.noindex && p.sitemap !== false)
    .map((p) => `${SITE_URL}${p.path}`)
    .filter((url) => !sitemap.includes(`<loc>${url}</loc>`));
  if (faltan.length) throw new Error(`seo-html: faltan en public/sitemap.xml: ${faltan.join(", ")}`);
}

export default function seoHtml({ promo = "" } = {}) {
  let raiz = process.cwd();
  let salida = "dist";
  return {
    name: "srv-seo-html",
    apply: "build",
    configResolved(config) {
      raiz = config.root;
      salida = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      // src/data/promo.js lee la promo de esta variable (en el navegador la inyecta Vite)
      globalThis.__PROMO__ = promo;
      const { lista, seo } = await paginas(raiz);
      revisarRutas(raiz, lista);
      revisarSitemap(raiz, lista, seo.SITE_URL);

      const base = fs.readFileSync(path.join(salida, "index.html"), "utf8");
      for (const pagina of lista) {
        const archivo = path.join(salida, pagina.archivo || `${pagina.path.slice(1)}.html`);
        fs.mkdirSync(path.dirname(archivo), { recursive: true });
        fs.writeFileSync(archivo, htmlDePagina(base, pagina, seo));
      }
      console.log(`seo-html: ${lista.length} páginas con su propio <head>`);
    },
  };
}
