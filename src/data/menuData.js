const WHATSAPP_URL = "https://wa.me/5491123869799?text=Hola,%20quiero%20cotizar%20un%20software";
const YOUTUBE_URL = "https://www.youtube.com/@weareSRV/playlists";
const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";

const menuData = [
  {
    title: "SERVICIOS",
    disabled: false,
    links: [
      { label: "Software a Medida", to: WHATSAPP_URL, isExternal: true },
      { label: "Backend & APIs", to: "/#backend", isExternal: false },
      { label: "Plataformas Web & SaaS", to: "/#saas", isExternal: false },
      { label: "Automatización & Cloud", to: "/#automatizacion", isExternal: false },
    ],
  },
  {
    title: "CURSOS GRATIS",
    disabled: false,
    links: [
      { label: "Ruta Backend (YouTube)", to: YOUTUBE_URL, isExternal: true },
      { label: "Python Engineer", to: YOUTUBE_URL, isExternal: true },
      { label: "Fundamentos Backend", to: YOUTUBE_URL, isExternal: true },
    ],
  },
  {
    title: "COMUNIDAD",
    disabled: false,
    links: [
      { label: "Discord Oficial", to: DISCORD_URL, isExternal: true },
      { label: "Canal de YouTube", to: YOUTUBE_URL, isExternal: true },
      { label: "Instagram", to: "https://www.instagram.com/wearesrv/", isExternal: true },
      { label: "TikTok", to: "https://www.tiktok.com/@wearesrv", isExternal: true },
    ],
  },
  {
    title: "NOSOTROS",
    disabled: false,
    links: [
      { label: "Manifiesto", to: "/#manifiesto", isExternal: false },
      { label: "Cotizaciones", to: WHATSAPP_URL, isExternal: true },
    ],
  },
];

export default menuData;