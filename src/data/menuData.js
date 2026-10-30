const WHATSAPP_URL =
  "https://wa.me/5491123869799?text=Hola,%20quiero%20cotizar%20un%20software";
const YOUTUBE_URL = "https://www.youtube.com/@weareSRV";
const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";

const menuData = [
  {
    title: "SERVICIOS",
    disabled: false,
    links: [
      { label: "Software a Medida", to: WHATSAPP_URL, isExternal: true },
      { label: "Backend & APIs", to: "/#backend", isExternal: false },
      { label: "Plataformas Web & SaaS", to: "/#saas", isExternal: false },
      {
        label: "Automatización & Cloud",
        to: "/#automatizacion",
        isExternal: false,
      },
      { label: "Sentryx", to: "/sentryx", isExternal: false, isNew: true },
      { label: "Event Box", to: "/eventbox", isExternal: false, isNew: true },
      { label: "Empresas e Instituciones", to: "/empresas", isExternal: false, isNew: true },
    ],
  },
  {
    title: "FORMACIONES",
    disabled: false,
    isExternal: false,
    hasNotification: true,
    badgeCount: 6,
    links: [
      {
        label: "Scratch para Chicos",
        to: "/scratch/inscripcion",
        isNew: true
      },
      {
        label: "Scripting",
        to: "/scripting/inscripcion",
        isNew: true
      },
      {
        label: "Master en Python",
        to: "/python/inscripcion",
        isNew: true
      },
      {
        label: "Ruta Backend: JavaScript + Node",
        to: "/ruta-backend/inscripcion",
        isNew: true
      },
      {
        label: "Fullstack con C# y React",
        to: "/fullstack-csharp/inscripcion",
        isNew: true
      },
      {
        label: "Full Stack",
        to: "/full-stack/inscripcion",
        isNew: true
      },
      {
        label: "Fundamentos IA · Gratis",
        to: "/fundamentos-ia",
        isNew: true
      },
      {
        label: "Próximos cursos · Lista de espera",
        to: "/proximos-cursos",
        isNew: true
      }
    ],
  },
  {
    title: "JUEGO",
    disabled: false,
    links: [
      { label: "El Develop", to: "/el-develop", isNew: true },
      { label: "Dev Clicker", to: "https://dev-clicker-jade.vercel.app/", isNew: true },
    ],
  },
  {
    title: "COMUNIDAD",
    disabled: false,
    links: [
      { label: "Discord Oficial", to: DISCORD_URL, isExternal: true },
      { label: "Canal de YouTube", to: YOUTUBE_URL, isExternal: true },
      {
        label: "Instagram",
        to: "https://www.instagram.com/wearesrv/",
        isExternal: true,
      },
      {
        label: "TikTok",
        to: "https://www.tiktok.com/@wearesrv",
        isExternal: true,
      },
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
