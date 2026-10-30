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
  domicilio: null, // domicilio comercial o fiscal
  email: null, // correo de atención al cliente
  horario: null, // horario de atención, por ejemplo "lunes a viernes de 10 a 18 h"
  whatsapp: "+54 9 11 2386-9799",
  whatsappNumero: "5491123869799",
  dataFiscalUrl: null, // link del QR de Data Fiscal (ARCA, formulario 960/NM)
  dataFiscalImg: null, // imagen del QR guardada en public/, por ejemplo "/data-fiscal.png"
  actualizacion: "29 de octubre de 2026",
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
    detalle: "Al comprar dos o más cursos grabados en un mismo pago, cada curso que se suma cuesta $30.000 menos.",
  },
  {
    nombre: "Código de alumnos",
    detalle: "Los alumnos de SRV tienen un código personal con precio especial en el Curso Fullstack con C# y React.",
  },
];
