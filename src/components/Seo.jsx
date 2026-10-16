import React from "react";
import { Helmet } from "react-helmet";

export const SITE_URL = "https://wearesrv.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

// Título, descripción, canonical, Open Graph, Twitter y datos estructurados de cada página.
// Reemplaza a los tags por defecto de index.html (marcados con data-react-helmet).
export default function Seo({ title, description, path = "/", image = DEFAULT_IMAGE, type = "website", noindex = false, jsonLd }) {
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
