// ==========================================
// DATOS LEGALES DE WEARESRV
// ==========================================
// Los usan el pie de página y las páginas /terminos, /privacidad, /arrepentimiento y /baja.
// Para vender online hay que mostrar quién vende: razón social, CUIT, domicilio y un contacto
// (Ley 24.240, Res. 271/2020, Mercosur GMC 37/19 y Disp. 954/2025), y el QR de Data Fiscal (ARCA).
// Los campos en null se ven como "⚠ completar" en desarrollo y NO se muestran en producción.
export const LEGAL = {
  marca: "WEARESRV",
  razonSocial: "Marcos Roberto Costa Schmite",
  cuit: "23-94799356-9",
  domicilio: "Mar Dulce 305, piso 1, depto. 9, Ciudad Autónoma de Buenos Aires", // el declarado en ARCA
  email: "info@wearesrv.com",
  horario: "lunes a viernes de 10 a 18 h",
  whatsapp: "+54 9 11 2386-9799",
  whatsappNumero: "5491123869799",
  // Formulario 960/D para sitios web (ARCA). El link es el que da ARCA (solo http); la imagen es su
  // logo oficial DATAWEB.jpg, guardado en public/.
  dataFiscalUrl: "http://qr.afip.gob.ar/?qr=2fo6inei48mGOnEZH3MeZg,,",
  dataFiscalImg: "/data-fiscal.jpg",
  actualizacion: "30 de octubre de 2026",
};

export const whatsappLink = (texto) => `https://wa.me/${LEGAL.whatsappNumero}?text=${encodeURIComponent(texto)}`;

// Promociones con fecha: la Ley 24.240 (art. 7) y la Res. 271/2020 piden publicar cuándo empiezan,
// cuándo terminan y sus condiciones. Se listan en /terminos: mantener al día cuando cambie una promo.
export const PROMOCIONES = [
  {
    nombre: "Cyber SRV",
    detalle:
      "Todos los cursos grabados (incluida la Ruta Backend Completa) al 50% de su precio de lista. No participa el Intensivo Full Stack en vivo. Los packs \"Sumá a tu compra\" se calculan sobre los precios del Cyber, con su regla de siempre.",
    desde: "02/11/2026 a las 00:00",
    hasta: "04/11/2026 a las 23:59",
  },
  {
    nombre: "Preventa de Redes, Linux y AWS",
    detalle:
      "El curso cuesta $62.900 en lugar de $89.900. La carpeta llega al instante y las clases se habilitan el 27/01/2027. El examen AWS Certified Cloud Practitioner no está incluido: lo toma y lo cobra AWS. Si en el mismo pago sumás otros cursos desde la página de Redes, Linux y AWS, cada uno cuesta: Curso de Scripting, sin costo extra; Master en Python, Master en JavaScript, Backend Avanzado o Curso Fullstack con C#, $20.000 más; Ruta Backend Completa, $35.000 más. Esos cursos llegan al instante.",
    desde: "05/11/2026",
    hasta: "26/01/2027 a las 23:59",
  },
  {
    nombre: "Preventa de Scratch para Chicos",
    detalle: "El curso cuesta $10.000 en lugar de $18.000. La carpeta llega al instante y las clases se habilitan el 18/11/2026.",
    desde: "20/10/2026",
    hasta: "17/11/2026 a las 23:59",
  },
  {
    nombre: "Early bird del Intensivo Full Stack de verano 2027",
    detalle: "El Pack Fullstack cuesta $200.000 en un pago en lugar de $220.000 en 3 cuotas sin interés.",
    desde: "15/10/2026",
    hasta: "20/12/2026 a las 23:59",
  },
];

// Precios especiales sin fecha de fin: no son promociones, son la forma de armar el precio.
export const PRECIOS_ESPECIALES = [
  {
    nombre: "Ruta Backend Completa",
    detalle: "Master en JavaScript y Backend Avanzado juntos por $149.900, en lugar de $184.800 si se compran por separado.",
  },
  {
    nombre: "Sumá a tu compra",
    detalle:
      "Al comprar dos o más cursos grabados en un mismo pago, cada curso que se suma cuesta $30.000 menos. Mientras dura la preventa de Redes, Linux y AWS, los packs con ese curso tienen los precios de su promoción.",
  },
  {
    nombre: "Código de alumnos",
    detalle: "Los alumnos de SRV tienen un código personal con precio especial en el Curso Fullstack con C# y React.",
  },
];
