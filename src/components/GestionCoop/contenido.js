// Textos de la página de GestiónCoop. Salen del brief de Marcos (27/11/2026): lo que se promete acá tiene que
// coincidir con lo que hace la plataforma. Sin precios, sin testimonios, sin cifras de clientes y sin nombrar
// cooperativas reales: los ejemplos de las animaciones son de «Cooperativa Arroyo del Monte», que es inventada.
// La factura electrónica se presenta como «integrada con ARCA» (no «homologada»).
import {
  LuArrowLeftRight,
  LuChartColumn,
  LuDatabase,
  LuDroplet,
  LuEye,
  LuFingerprint,
  LuFlower2,
  LuGraduationCap,
  LuGauge,
  LuLock,
  LuMegaphone,
  LuReceiptText,
  LuScanBarcode,
  LuSmartphone,
  LuTv,
  LuWifi,
  LuZap,
} from "react-icons/lu";

export const SERVICIOS = [
  { icono: LuZap, nombre: "Energía eléctrica" },
  { icono: LuDroplet, nombre: "Agua potable" },
  { icono: LuWifi, nombre: "Internet" },
  { icono: LuTv, nombre: "TV" },
  { icono: LuFlower2, nombre: "Sepelio" },
];

// Resumen de arriba: cada tarjeta lleva a su bloque
export const PUESTOS = [
  { id: "socio", icono: LuSmartphone, titulo: "Socio", texto: "Ve lo que debe y paga desde el celular." },
  { id: "lecturista", icono: LuGauge, titulo: "Lecturista", texto: "Carga cada medidor, con o sin señal." },
  { id: "oficina", icono: LuReceiptText, titulo: "Oficina", texto: "Factura el mes en pocos pasos." },
  { id: "caja", icono: LuScanBarcode, titulo: "Caja", texto: "Cobra con lector y cierra con arqueo." },
  { id: "gerencia", icono: LuChartColumn, titulo: "Gerencia y Consejo", texto: "Tablero, informes y mapa." },
  { id: "socio", icono: LuMegaphone, titulo: "Reclamos y cortes", texto: "Con aviso a los socios." },
];

export const BLOQUES = {
  socio: {
    etiqueta: "Socio",
    titulo: "Entiende lo que paga. Y lo paga en el momento.",
    puntos: [
      "Entra desde el celular con tres datos de su factura: código de socio, número de conexión y documento. Sin usuario ni contraseña.",
      "Ve cuánto debe y entiende en qué se va cada peso de su boleta.",
      "Mira su consumo y paga en el momento, desde el mismo celular.",
      "Hace reclamos con foto y se entera de los cortes programados.",
    ],
  },
  lecturista: {
    etiqueta: "Lecturista",
    titulo: "Cada medidor, cargado desde el celular. Aunque no haya señal.",
    puntos: [
      "El lecturista carga cada medidor con su celular, recorriendo su ruta.",
      "Si no hay señal, la lectura queda guardada en el teléfono.",
      "Cuando vuelve la señal, se envía sola: nadie tiene que acordarse de nada.",
    ],
  },
  oficina: {
    etiqueta: "Oficina y facturación",
    titulo: "El mes se factura en pocos pasos.",
    puntos: [
      "Cerrar lectura, pre-facturar, revisar las fuera de lo común y emitir.",
      "Factura electrónica integrada con ARCA: cada factura sale con su CAE y su código QR.",
      "Reclamos y cortes programados en el mismo sistema, con aviso a los socios.",
    ],
  },
  caja: {
    etiqueta: "Caja",
    titulo: "Se cobra con el lector. El turno cierra con arqueo.",
    puntos: [
      "Cobra con lector de código de barras: la factura aparece sola.",
      "Al terminar, cierra el turno con su arqueo.",
    ],
  },
  gerencia: {
    etiqueta: "Gerencia y Consejo",
    titulo: "El mes de la cooperativa, en un tablero.",
    puntos: [
      "Tablero del mes: lo facturado, lo cobrado y lo que falta cobrar.",
      "Informes en Excel, listos para la reunión del Consejo.",
      "Un mapa con la situación de cada conexión, de día y de noche, con las lecturas en vivo.",
    ],
  },
};

export const SEGURIDAD = [
  {
    icono: LuEye,
    titulo: "Cada uno ve lo suyo",
    texto: "Cada persona entra con su rol y ve solo lo de su área.",
  },
  {
    icono: LuLock,
    titulo: "Todo viaja cifrado",
    texto: "La información viaja cifrada entre los celulares, las computadoras y el sistema.",
  },
  {
    icono: LuFingerprint,
    titulo: "Facturas y cobros a prueba de cambios",
    texto:
      "Cada factura y cada cobro quedan registrados de forma que no se pueden alterar sin que el sistema lo detecte y avise.",
  },
];

export const PASOS = [
  {
    icono: LuDatabase,
    titulo: "Migramos tus datos.",
    texto: "Nosotros pasamos la información de tu sistema actual a GestiónCoop.",
  },
  {
    icono: LuArrowLeftRight,
    titulo: "Conviven los dos sistemas.",
    texto: "Durante la transición, la cooperativa sigue con su sistema actual en paralelo, para que nada se corte.",
  },
  {
    icono: LuGraduationCap,
    titulo: "Viajamos a la cooperativa.",
    texto: "Dejamos todo funcionando y capacitamos al equipo.",
  },
];

export const FAQ = [
  {
    q: "¿Para qué cooperativas es GestiónCoop?",
    a: "Para cooperativas de servicios: energía eléctrica, agua potable, internet, TV y sepelio.",
  },
  {
    q: "¿El socio tiene que crearse un usuario?",
    a: "No. Entra desde el celular con tres datos de su factura: código de socio, número de conexión y documento. Sin usuario ni contraseña.",
  },
  {
    q: "¿Qué pasa si el lecturista se queda sin señal?",
    a: "La lectura queda guardada en el teléfono y se envía sola cuando vuelve la señal.",
  },
  {
    q: "¿La factura electrónica funciona con ARCA?",
    a: "Sí. La factura electrónica está integrada con ARCA: cada factura sale con su CAE y su código QR.",
  },
  {
    q: "¿Tenemos que dejar nuestro sistema de un día para el otro?",
    a: "No. SRV migra los datos y, durante la transición, la cooperativa sigue con su sistema actual en paralelo, para que nada se corte.",
  },
  {
    q: "¿Quién capacita al equipo?",
    a: "Nosotros. SRV viaja a la cooperativa para dejar todo funcionando y capacitar al equipo.",
  },
  {
    q: "¿Quién puede ver los datos de los socios?",
    a: "Cada persona ve solo lo de su área y todo viaja cifrado. Además, cada factura y cada cobro quedan registrados de forma que no se pueden alterar sin que el sistema lo detecte y avise.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Lo cotizamos para cada cooperativa. Pedí la cotización desde el formulario de esta página o por WhatsApp.",
  },
];
