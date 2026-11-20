import React from "react";
import { Helmet } from "react-helmet";
import { SITE_URL, IMAGEN_POR_DEFECTO, SEO_PAGINAS } from "../data/seo";

export { SITE_URL };

// Título, descripción, canonical, Open Graph, Twitter y datos estructurados de cada página.
// Reemplaza a los tags por defecto de index.html (marcados con data-react-helmet).
// Con pagina="/ruta" toma el título, la descripción y la imagen de src/data/seo.js, que es de donde también
// los lee el build para escribir el HTML de esa ruta: así lo que ve Google sin JavaScript es lo mismo.
export default function Seo({ pagina, jsonLd, ...propios }) {
  const datos = { ...(pagina ? { path: pagina, ...SEO_PAGINAS[pagina] } : {}), ...propios };
  const { title, description, path = "/", image = IMAGEN_POR_DEFECTO, type = "website", noindex = false } = datos;
  const url = `${SITE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
