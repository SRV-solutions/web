/**
 * ============================================================
 *  AMIGO INVISIBLE SRV (wearesrv.com/amigo-invisible)
 * ============================================================
 *
 *  El juego entero vive acá. La página le habla a la Netlify Function amigo-invisible, que valida los
 *  datos y llama a este script con la clave secreta: nadie puede llamarlo directo para mandar mails.
 *
 *  CÓMO SE JUEGA
 *    1. El organizador arma el grupo en la página: nombre, fecha del intercambio, presupuesto y
 *       participantes. Le llega un mail para confirmar (así nadie usa la página para mandarles mails a
 *       desconocidos con el mail de otro).
 *    2. Desde ese mail entra a su panel y hace el sorteo. A cada participante le llega a quién le regala
 *       y el link a su página. No hay usuario ni contraseña: el link lleva un código que es solo suyo.
 *    3. En su página, cada uno le puede mandar a quien le regala hasta CONFIG.PISTAS_MAX pistas anónimas
 *       en TODO el juego. Quien recibe una pista la puede contestar una vez, y tiene CONFIG.INTENTOS_MAX
 *       intentos para adivinar quién es su amigo invisible.
 *    4. El día después del intercambio se cierra el juego y a todos les llega cómo quedó el sorteo.
 *    5. NO SE BORRA NADA: los grupos, los mails de todos los participantes y los mensajes quedan en la
 *       planilla como registro de quienes usaron el juego. Promociones, solo a los de la pestaña
 *       Novedades sin fecha de baja (los que tildaron "Quiero recibir novedades").
 *
 *  LINKS DE LOS MAILS: apuntan al sitio desde donde se armó el grupo (columna "Sitio" de Grupos), que
 *  manda la Netlify Function: wearesrv.com, un deploy preview de Netlify o localhost con npm run dev.
 *  Así se puede probar el juego entero antes de publicarlo.
 *
 *  PESTAÑAS: Grupos, Participantes, Mensajes (pistas, respuestas e intentos) y Novedades. Ni el
 *  organizador sabe quién le regala a quién: eso está solo en la columna "Le regala a" de Participantes.
 *
 *  CUOTA DE MAILS: una cuenta de Gmail manda unos 100 mails por día desde Apps Script, y la cuota es de
 *  la CUENTA. Este proyecto está en la cuenta de SRV (la misma de los cursos), así que comparte la cuota
 *  con los mails de las compras: deja libres siempre CONFIG.RESERVA_MAILS para ellos. Si algún día se
 *  pasa a una cuenta propia del juego, poner 0. Lo que no sale por falta de cuota sale solo en la
 *  próxima hora que haya.
 *
 *  CONFIGURACIÓN (una sola vez; es un proyecto SEPARADO de los de cursos):
 *  1. En la cuenta de SRV, crear una Google Sheet nueva ("Amigo Invisible SRV") -> Extensiones ->
 *     Apps Script -> pegar este archivo -> Guardar.
 *  2. Ejecutar probarConfiguracion() y aceptar los permisos. Crea las pestañas, la clave y el activador.
 *  3. Implementar -> Nueva implementación -> Aplicación web
 *       Ejecutar como: Yo   |   Quién tiene acceso: Cualquier usuario
 *     Al terminar muestra la "URL de la aplicación web" (termina en /exec). Después se ve en
 *     Implementar -> Gestionar implementaciones.
 *  4. En Netlify -> Project configuration -> Environment variables, agregar:
 *       AMIGO_WEBHOOK_URL    = la URL /exec de la implementación
 *       AMIGO_WEBHOOK_SECRET = la clave del mail de probarConfiguracion() (también está en Configuración
 *                              del proyecto -> Propiedades de la secuencia de comandos -> WEBHOOK_SECRET)
 *     y después Deploys -> Trigger deploy -> Deploy project (las variables toman efecto ahí).
 *  5. Para probar en la PC con npm run dev: las mismas dos variables en el archivo .env del proyecto.
 *
 *  Después de pegar una versión nueva: Implementar -> Gestionar implementaciones -> editar (lápiz) ->
 *  Versión: "Nueva versión" -> Implementar. Así la URL /exec no cambia.
 *  Si cambiás PISTAS_MAX, INTENTOS_MAX o los mínimos y máximos, cambialos también en
 *  src/components/AmigoInvisible/reglas.js (los textos de la página) y en la Netlify Function.
 * ============================================================
 */

const CONFIG = {
  EMAIL_ADMIN: "marcos.schmite@gmail.com",   // recibe el mail de probarConfiguracion()
  NOMBRE_REMITENTE: "Amigo Invisible SRV",
  LOGO_URL: "https://wearesrv.com/SRV-LOGO.png",
  URL_SITIO: "https://wearesrv.com",          // si el grupo no trae sitio
  RUTA: "/amigo-invisible",
  ZONA: "America/Argentina/Buenos_Aires",
  PISTAS_MAX: 5,             // pistas que cada uno le puede mandar a quien le regala, en todo el juego
  INTENTOS_MAX: 3,           // veces que cada uno puede arriesgar quién es su amigo invisible
  MIN_PARTICIPANTES: 3,
  MAX_PARTICIPANTES: 30,
  MAX_DIAS_HASTA_INTERCAMBIO: 120,
  LARGO_MENSAJE: 400,        // caracteres de una pista o una respuesta
  RESERVA_MAILS: 40,         // mails por día que este script deja libres (0 si la cuenta es solo del juego)
  HORA_FINAL: 10,            // hora del día después del intercambio en que sale el mail con el sorteo
  GRUPOS_CADA_6_HORAS: 3     // grupos que puede armar un mismo mail cada 6 horas
};

const ESTADO_PENDIENTE = "PENDIENTE";  // armado: falta que el organizador lo confirme y sortee
const ESTADO_ACTIVO = "ACTIVO";        // sorteado: se juega hasta el día del intercambio
const ESTADO_TERMINADO = "TERMINADO";  // pasó el intercambio: salió (o está saliendo) el mail final

const TIPO_PISTA = "PISTA";
const TIPO_RESPUESTA = "RESPUESTA";
const TIPO_INTENTO = "INTENTO";

// Columnas de cada pestaña: [clave en el código, encabezado en la hoja]. "texto" son las columnas con
// formato de texto plano, para que la planilla no convierta fechas, montos o códigos.
const TABLAS = {
  grupos: {
    hoja: "Grupos",
    columnas: [
      ["creado", "Creado"],
      ["id", "Grupo"],
      ["nombre", "Nombre"],
      ["organizador", "Organizador"],
      ["mailOrganizador", "Mail del organizador"],
      ["fecha", "Intercambio"],
      ["presupuesto", "Presupuesto"],
      ["estado", "Estado"],
      ["codigo", "Código del organizador"],
      ["sorteado", "Sorteado"],
      ["pedido", "Pedido"],
      ["sitio", "Sitio"]
    ],
    texto: ["id", "nombre", "organizador", "mailOrganizador", "fecha", "presupuesto", "codigo", "pedido", "sitio"]
  },
  participantes: {
    hoja: "Participantes",
    columnas: [
      ["grupo", "Grupo"],
      ["id", "Participante"],
      ["nombre", "Nombre"],
      ["mail", "Mail"],
      ["codigo", "Código"],
      ["regalaA", "Le regala a"],
      ["mailSorteo", "Mail del sorteo"],
      ["mailFinal", "Mail final"],
      ["visita", "Última visita"]
    ],
    texto: ["grupo", "id", "nombre", "mail", "codigo", "regalaA"]
  },
  mensajes: {
    hoja: "Mensajes",
    columnas: [
      ["fecha", "Fecha"],
      ["grupo", "Grupo"],
      ["id", "Mensaje"],
      ["tipo", "Tipo"],
      ["de", "De"],
      ["para", "Para"],
      ["texto", "Texto"],
      ["respondeA", "Responde a"],
      ["acierto", "Acierto"],
      ["avisado", "Avisado"],
      ["pedido", "Pedido"]
    ],
    texto: ["grupo", "id", "de", "para", "texto", "respondeA", "pedido"]
  },
  novedades: {
    hoja: "Novedades",
    columnas: [
      ["fecha", "Fecha"],
      ["nombre", "Nombre"],
      ["mail", "Mail"],
      ["origen", "Origen"],
      ["baja", "Baja"]           // fecha en que destildó la casilla: la fila queda como registro
    ],
    texto: ["nombre", "mail"]
  }
};

// Lo que puede pedir la Netlify Function
const ACCIONES = {
  crear: crearGrupo_,
  organizador: verOrganizador_,
  sortear: sortear_,
  reenviarParticipante: reenviarParticipante_,
  estado: verEstado_,
  pista: mandarPista_,
  responder: contestarPista_,
  adivinar: adivinar_,
  novedades: cambiarNovedades_,
  reenviar: reenviarLinks_
};

// ============================================================
//  ENTRADA (Netlify Function -> acá)
// ============================================================
function doPost(e) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!secret) return salida_({ status: "config_error" });

    const params = (e && e.parameter) || {};
    if (!compararSeguro_(String(params.key || ""), secret)) return salida_({ status: "unauthorized" });

    let body = {};
    try {
      body = JSON.parse((e.postData && e.postData.contents) || "{}");
    } catch (parseErr) {
      body = {};
    }

    const accion = Object.prototype.hasOwnProperty.call(ACCIONES, body.accion) ? ACCIONES[body.accion] : null;
    if (!accion) return salida_({ status: "accion_invalida" });

    // Todo pasa con el lock: dos pistas juntas no pueden pasarse del límite ni pisarse en la planilla.
    // La espera es corta porque la Netlify Function corta a los 9 segundos.
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(6000)) return salida_({ status: "ocupado" });
    try {
      return salida_(accion(body));
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return salida_({ status: "error" });
  }
}

function doGet() {
  return salida_({ status: "ok" });
}

// ============================================================
//  ORGANIZADOR
// ============================================================

// Arma el grupo sin sortear y le manda al organizador el mail para confirmar
function crearGrupo_(b) {
  const pedido = texto_(b.pedido, 40);
  if (pedido && leer_("grupos").some((g) => g.pedido === pedido)) return { status: "ok" }; // reintento

  const grupoIn = b.grupo || {};
  const orgIn = b.organizador || {};
  const nombreGrupo = texto_(grupoIn.nombre, 60);
  const fecha = String(grupoIn.fecha || "");
  const presupuesto = texto_(grupoIn.presupuesto, 40);
  const org = { nombre: texto_(orgIn.nombre, 60), mail: mail_(orgIn.mail) };
  const hoy = hoy_();

  if (!nombreGrupo) return invalido_("grupo");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || fecha < hoy || fecha > sumarDias_(hoy, CONFIG.MAX_DIAS_HASTA_INTERCAMBIO)) {
    return invalido_("fecha");
  }
  if (!org.nombre) return invalido_("organizador");
  if (!mailValido_(org.mail)) return invalido_("mailOrganizador");

  const lista = (Array.isArray(b.participantes) ? b.participantes : [])
    .slice(0, CONFIG.MAX_PARTICIPANTES + 1)
    .map((p) => ({ nombre: texto_(p && p.nombre, 60), mail: mail_(p && p.mail) }));
  if (b.participa === true) lista.unshift({ nombre: org.nombre, mail: org.mail });
  if (lista.length < CONFIG.MIN_PARTICIPANTES || lista.length > CONFIG.MAX_PARTICIPANTES) return invalido_("cantidad");

  const mails = {};
  const nombres = {};
  for (const p of lista) {
    if (!p.nombre) return invalido_("participante");
    if (!mailValido_(p.mail)) return invalido_("mailParticipante", p.nombre);
    if (mails[p.mail]) return invalido_("mailRepetido", p.mail);
    const clave = normalizar_(p.nombre);
    if (nombres[clave]) return invalido_("nombreRepetido", p.nombre);
    mails[p.mail] = true;
    nombres[clave] = true;
  }
  // Los nombres llegan en los mails a otra gente: sin links, para que nadie use el juego para mandar spam
  if ([nombreGrupo, org.nombre, presupuesto].concat(lista.map((p) => p.nombre)).some(tieneEnlace_)) {
    return invalido_("enlace");
  }

  const cache = CacheService.getScriptCache();
  const claveLimite = "crear:" + org.mail;
  const armados = Number(cache.get(claveLimite) || 0);
  if (armados >= CONFIG.GRUPOS_CADA_6_HORAS) return { status: "limite" };
  if (!hayCuota_(1)) return { status: "sin_cuota" };

  const grupo = {
    creado: new Date(),
    id: nuevoId_("G"),
    nombre: nombreGrupo,
    organizador: org.nombre,
    mailOrganizador: org.mail,
    fecha: fecha,
    presupuesto: presupuesto,
    estado: ESTADO_PENDIENTE,
    codigo: nuevoCodigo_(),
    sorteado: "",
    pedido: pedido,
    sitio: sitioValido_(b.sitio)
  };
  agregar_("grupos", grupo);
  agregar_("participantes", lista.map((p, i) => ({
    grupo: grupo.id,
    id: grupo.id + "-" + (i + 1),
    nombre: p.nombre,
    mail: p.mail,
    codigo: nuevoCodigo_(),
    regalaA: "",
    mailSorteo: "",
    mailFinal: "",
    visita: ""
  })));
  if (b.novedades === true) agregarNovedad_(org.nombre, org.mail, "Organizó un amigo invisible");
  cache.put(claveLimite, String(armados + 1), 21600);

  const r = enviar_(org.mail, "Confirmá el amigo invisible «" + grupo.nombre + "»", mailConfirmacion_(grupo, lista.length));
  if (r !== "ok") return { status: r === "sin_cuota" ? "sin_cuota" : "error_mail" };
  return { status: "ok" };
}

function verOrganizador_(b) {
  const g = grupoPorCodigo_(b.codigo);
  if (!g) return { status: "no_encontrado" };
  return Object.assign({ status: "ok" }, vistaOrganizador_(g));
}

// Sortea y le manda a cada uno su mail. Si se corta la espera de la Netlify Function, el sorteo ya quedó
// guardado y los mails siguen saliendo; los que no salen por cuota, salen en la próxima hora.
function sortear_(b) {
  const g = grupoPorCodigo_(b.codigo);
  if (!g) return { status: "no_encontrado" };
  if (g.estado !== ESTADO_PENDIENTE) return Object.assign({ status: "ok" }, vistaOrganizador_(g)); // ya estaba
  if (g.fecha < hoy_()) return { status: "fecha_vencida" };

  const ps = participantesDe_(g.id);
  const pares = sortearPares_(ps.map((p) => p.id));
  ps.forEach((p) => actualizar_("participantes", p._fila, { regalaA: pares[p.id] }));
  actualizar_("grupos", g._fila, { estado: ESTADO_ACTIVO, sorteado: new Date() });

  const porId = indexar_(ps);
  for (const p of ps) {
    if (enviarMailSorteo_(g, p, porId[p.regalaA]) === "sin_cuota") break;
  }
  return Object.assign({ status: "ok" }, vistaOrganizador_(g));
}

function reenviarParticipante_(b) {
  const g = grupoPorCodigo_(b.codigo);
  if (!g) return { status: "no_encontrado" };
  if (g.estado === ESTADO_PENDIENTE) return { status: "no_sorteado" };
  const ps = participantesDe_(g.id);
  const p = ps.find((x) => x.id === String(b.participante || ""));
  if (!p) return { status: "no_encontrado" };

  const cache = CacheService.getScriptCache();
  if (cache.get("reenvio:" + p.id)) return { status: "limite" };
  const r = enviarMailSorteo_(g, p, indexar_(ps)[p.regalaA]);
  if (r !== "ok") return { status: r === "sin_cuota" ? "sin_cuota" : "error_mail" };
  cache.put("reenvio:" + p.id, "1", 600);
  return Object.assign({ status: "ok" }, vistaOrganizador_(g));
}

function vistaOrganizador_(g) {
  return {
    grupo: vistaGrupo_(g),
    participantes: participantesDe_(g.id).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      mail: p.mail,
      mailEnviado: p.mailSorteo instanceof Date,
      mailError: typeof p.mailSorteo === "string" && p.mailSorteo !== "",
      entro: p.visita instanceof Date
    }))
  };
}

// ============================================================
//  PARTICIPANTE
// ============================================================
function verEstado_(b) {
  const p = participantePorCodigo_(b.codigo);
  const g = p && grupoPorId_(p.grupo);
  if (!g) return { status: "no_encontrado" };
  if (g.estado === ESTADO_PENDIENTE) return { status: "no_sorteado" };
  actualizar_("participantes", p._fila, { visita: new Date() });
  return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
}

function mandarPista_(b) {
  const ctx = contextoDeJuego_(b.codigo);
  if (ctx.status) return ctx;
  const g = ctx.g;
  const p = ctx.p;
  const texto = mensaje_(b.texto);
  if (!texto) return invalido_("texto");

  const ms = mensajesDe_(g.id);
  if (b.pedido && ms.some((m) => m.pedido === b.pedido)) return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
  const usadas = ms.filter((m) => m.tipo === TIPO_PISTA && m.de === p.id).length;
  if (usadas >= CONFIG.PISTAS_MAX) return { status: "sin_pistas" };

  const m = nuevoMensaje_(g, TIPO_PISTA, p.id, p.regalaA, { texto: texto, pedido: b.pedido });
  agregar_("mensajes", m);
  avisar_(g, m);
  return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
}

function contestarPista_(b) {
  const ctx = contextoDeJuego_(b.codigo);
  if (ctx.status) return ctx;
  const g = ctx.g;
  const p = ctx.p;
  const texto = mensaje_(b.texto);
  if (!texto) return invalido_("texto");

  const ms = mensajesDe_(g.id);
  if (b.pedido && ms.some((m) => m.pedido === b.pedido)) return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
  const pista = ms.find((m) => m.id === String(b.pista || "") && m.tipo === TIPO_PISTA && m.para === p.id);
  if (!pista) return { status: "no_encontrado" };
  if (ms.some((m) => m.tipo === TIPO_RESPUESTA && m.respondeA === pista.id)) return { status: "ya_respondida" };

  const m = nuevoMensaje_(g, TIPO_RESPUESTA, p.id, pista.de, { texto: texto, respondeA: pista.id, pedido: b.pedido });
  agregar_("mensajes", m);
  avisar_(g, m);
  return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
}

// Un intento guarda en "Para" a quién se arriesgó. Si acierta, se le avisa a ese (que es quien le regala).
function adivinar_(b) {
  const ctx = contextoDeJuego_(b.codigo);
  if (ctx.status) return ctx;
  const g = ctx.g;
  const p = ctx.p;

  const ms = mensajesDe_(g.id);
  if (b.pedido && ms.some((m) => m.pedido === b.pedido)) return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
  const ps = participantesDe_(g.id);
  const candidato = ps.find((x) => x.id === String(b.participante || ""));
  if (!candidato || candidato.id === p.id) return invalido_("participante");

  const mios = ms.filter((m) => m.tipo === TIPO_INTENTO && m.de === p.id);
  if (mios.some((m) => m.acierto === "SI")) return { status: "ya_adivinaste" };
  if (mios.length >= CONFIG.INTENTOS_MAX) return { status: "sin_intentos" };

  const quienMeRegala = ps.find((x) => x.regalaA === p.id);
  const acierto = !!quienMeRegala && quienMeRegala.id === candidato.id;
  const m = nuevoMensaje_(g, TIPO_INTENTO, p.id, candidato.id, {
    acierto: acierto ? "SI" : "NO",
    avisado: acierto ? "" : "-", // los intentos fallidos no mandan mail: se ven en la página
    pedido: b.pedido
  });
  agregar_("mensajes", m);
  if (acierto) avisar_(g, m);
  return Object.assign({ status: "ok", acierto: acierto }, vistaParticipante_(g, p));
}

function cambiarNovedades_(b) {
  const p = participantePorCodigo_(b.codigo);
  const g = p && grupoPorId_(p.grupo);
  if (!g) return { status: "no_encontrado" };
  if (b.acepta === true) {
    agregarNovedad_(p.nombre, p.mail, "Jugó al amigo invisible");
  } else {
    // La baja no borra la fila: le pone la fecha, y así queda el registro de que la pidió
    leer_("novedades")
      .filter((n) => n.mail === p.mail && !n.baja)
      .forEach((n) => actualizar_("novedades", n._fila, { baja: new Date() }));
  }
  return Object.assign({ status: "ok" }, vistaParticipante_(g, p));
}

// "Perdí el mail": le manda a esa dirección todos sus links. Responde lo mismo esté o no en algún grupo.
function reenviarLinks_(b) {
  const mail = mail_(b.mail);
  if (!mailValido_(mail)) return invalido_("mail");
  const cache = CacheService.getScriptCache();
  if (cache.get("links:" + mail)) return { status: "ok" };

  const grupos = indexar_(leer_("grupos"));
  const comoParticipante = leer_("participantes")
    .filter((p) => p.mail === mail && grupos[p.grupo] && grupos[p.grupo].estado !== ESTADO_PENDIENTE)
    .map((p) => ({ grupo: grupos[p.grupo], link: linkParticipante_(grupos[p.grupo], p) }));
  const comoOrganizador = leer_("grupos")
    .filter((g) => g.mailOrganizador === mail)
    .map((g) => ({ grupo: g, link: linkOrganizador_(g) }));
  if (!comoParticipante.length && !comoOrganizador.length) return { status: "ok" };

  const r = enviar_(mail, "Tus links del amigo invisible", mailLinks_(comoParticipante, comoOrganizador));
  if (r === "sin_cuota") return { status: "sin_cuota" };
  cache.put("links:" + mail, "1", 900);
  return { status: "ok" };
}

// El participante del código y su grupo, si el juego está abierto. Si no, { status } con el motivo.
function contextoDeJuego_(codigo) {
  const p = participantePorCodigo_(codigo);
  const g = p && grupoPorId_(p.grupo);
  if (!g) return { status: "no_encontrado" };
  if (g.estado === ESTADO_PENDIENTE) return { status: "no_sorteado" };
  if (estadoJuego_(g) !== "activo") return { status: "juego_terminado" };
  return { g: g, p: p };
}

// Lo que ve cada uno en su página. Nunca dice quién mandó las pistas que recibe, salvo cuando terminó.
function vistaParticipante_(g, p) {
  const ps = participantesDe_(g.id);
  const porId = indexar_(ps);
  const ms = mensajesDe_(g.id);
  const leRegalo = porId[p.regalaA];
  const quienMeRegala = ps.find((x) => x.regalaA === p.id);

  const respuestaA = (pistaId) => {
    const r = ms.find((m) => m.tipo === TIPO_RESPUESTA && m.respondeA === pistaId);
    return r ? { texto: r.texto, fecha: iso_(r.fecha) } : null;
  };
  const pista = (m) => ({ id: m.id, fecha: iso_(m.fecha), texto: m.texto, respuesta: respuestaA(m.id) });
  const intentosDe = (id) => ms
    .filter((m) => m.tipo === TIPO_INTENTO && m.de === id)
    .map((m) => ({ nombre: porId[m.para] ? porId[m.para].nombre : "", acierto: m.acierto === "SI", fecha: iso_(m.fecha) }));
  const misIntentos = intentosDe(p.id);
  const terminado = estadoJuego_(g) === "terminado";

  return {
    grupo: vistaGrupo_(g),
    yo: { nombre: p.nombre, novedades: quiereNovedades_(p.mail) },
    leRegalo: leRegalo ? leRegalo.nombre : "",
    participantes: ps.filter((x) => x.id !== p.id).map((x) => ({ id: x.id, nombre: x.nombre })),
    limites: { pistas: CONFIG.PISTAS_MAX, intentos: CONFIG.INTENTOS_MAX, largo: CONFIG.LARGO_MENSAJE },
    misPistas: ms.filter((m) => m.tipo === TIPO_PISTA && m.de === p.id).map(pista),
    pistasRecibidas: ms.filter((m) => m.tipo === TIPO_PISTA && m.para === p.id).map(pista),
    misIntentos: misIntentos,
    adivine: misIntentos.some((i) => i.acierto),
    intentosSobreMi: leRegalo ? intentosDe(leRegalo.id) : [],
    final: terminado
      ? {
        miAmigo: quienMeRegala ? quienMeRegala.nombre : "",
        sorteo: ps.map((x) => ({ de: x.nombre, para: porId[x.regalaA] ? porId[x.regalaA].nombre : "" }))
      }
      : null
  };
}

function vistaGrupo_(g) {
  return {
    nombre: g.nombre,
    organizador: g.organizador,
    fecha: g.fecha,
    presupuesto: g.presupuesto,
    estado: estadoJuego_(g),
    hoy: hoy_()
  };
}

// pendiente | activo | terminado (desde el día después del intercambio, aunque el mail final salga más tarde)
function estadoJuego_(g) {
  if (g.estado === ESTADO_PENDIENTE) return "pendiente";
  if (g.estado === ESTADO_TERMINADO || g.fecha < hoy_()) return "terminado";
  return "activo";
}

// ============================================================
//  CADA HORA (activador)
// ============================================================
// Manda lo que quedó sin salir por cuota y cierra los juegos cuyo intercambio pasó (con el mail de cómo
// quedó el sorteo). No borra nada: todo queda como registro.
function tareasProgramadas() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const hoy = hoy_();
    const hora = Number(Utilities.formatDate(new Date(), CONFIG.ZONA, "H"));

    if (hora >= CONFIG.HORA_FINAL) {
      leer_("grupos")
        .filter((g) => g.estado === ESTADO_ACTIVO && g.fecha < hoy)
        .forEach((g) => actualizar_("grupos", g._fila, { estado: ESTADO_TERMINADO }));
    }

    const grupos = indexar_(leer_("grupos"));
    const participantes = leer_("participantes");
    const porId = indexar_(participantes);
    let hayCuota = true;

    for (const p of participantes) {
      const g = grupos[p.grupo];
      if (!g || !hayCuota) continue;
      if (g.estado === ESTADO_ACTIVO && p.mailSorteo === "" && g.fecha >= hoy) {
        hayCuota = enviarMailSorteo_(g, p, porId[p.regalaA]) !== "sin_cuota";
      } else if (g.estado === ESTADO_TERMINADO && p.mailFinal === "") {
        hayCuota = enviarMailFinal_(g, p, participantes.filter((x) => x.grupo === g.id)) !== "sin_cuota";
      }
    }

    for (const m of leer_("mensajes")) {
      if (m.avisado !== "" || !hayCuota) continue;
      const g = grupos[m.grupo];
      if (!g || estadoJuego_(g) !== "activo") {
        actualizar_("mensajes", m._fila, { avisado: "-" }); // el juego terminó: ya no tiene sentido avisar
        continue;
      }
      hayCuota = avisar_(g, m) !== "sin_cuota";
    }
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
//  CONFIGURACIÓN Y PRUEBA (ejecutar desde el editor)
// ============================================================
// La primera vez crea la clave secreta, las pestañas y el activador. Las siguientes solo verifica.
// Te manda un mail con el estado y los valores para Netlify.
function probarConfiguracion() {
  const props = PropertiesService.getScriptProperties();
  const mensajes = [];

  let secret = props.getProperty("WEBHOOK_SECRET");
  if (!secret) {
    secret = nuevoCodigo_() + nuevoCodigo_();
    props.setProperty("WEBHOOK_SECRET", secret);
    mensajes.push("Clave secreta creada");
  } else {
    mensajes.push("Clave secreta OK");
  }

  Object.keys(TABLAS).forEach((clave) => {
    const hoja = hoja_(clave);
    mensajes.push("Pestaña \"" + TABLAS[clave].hoja + "\" OK: " + Math.max(hoja.getLastRow() - 1, 0) + " fila(s)");
  });

  const existentes = ScriptApp.getProjectTriggers().map((t) => t.getHandlerFunction());
  if (existentes.indexOf("tareasProgramadas") === -1) {
    ScriptApp.newTrigger("tareasProgramadas").timeBased().everyHours(1).create();
    mensajes.push("Activador creado: tareasProgramadas() cada hora");
  } else {
    mensajes.push("Activador OK: tareasProgramadas() cada hora");
  }

  mensajes.push("Mails disponibles hoy en la cuenta: " + MailApp.getRemainingDailyQuota() +
    " (este script deja siempre " + CONFIG.RESERVA_MAILS + " libres)");
  mensajes.push("Los mails salen de: " + Session.getEffectiveUser().getEmail() + ", como \"" + CONFIG.NOMBRE_REMITENTE + "\"");
  mensajes.push("Hoy, en " + CONFIG.ZONA + ": " + hoy_());

  // Desde el editor, ScriptApp.getService().getUrl() devuelve la URL de prueba (/dev), no la de la
  // implementación: por eso solo se indica dónde está
  mensajes.push("");
  mensajes.push("VALORES PARA NETLIFY (Project configuration -> Environment variables):");
  mensajes.push("AMIGO_WEBHOOK_URL = la URL de la aplicación web (Implementar -> Gestionar implementaciones; termina en /exec)");
  mensajes.push("AMIGO_WEBHOOK_SECRET = " + secret);
  mensajes.push("Después: Deploys -> Trigger deploy -> Deploy project.");

  const resumen = mensajes.join("\n");
  Logger.log(resumen);
  MailApp.sendEmail({ to: CONFIG.EMAIL_ADMIN, subject: "Configuración del Amigo Invisible SRV", body: resumen });
}

// ============================================================
//  MAILS DEL JUEGO
// ============================================================
function enviarMailSorteo_(g, p, destinatario) {
  if (!destinatario) return "error";
  const r = enviar_(p.mail, "Amigo invisible «" + g.nombre + "»: ya sabés a quién le regalás", mailSorteo_(g, p, destinatario));
  if (r === "ok") actualizar_("participantes", p._fila, { mailSorteo: new Date() });
  if (r === "error") actualizar_("participantes", p._fila, { mailSorteo: "ERROR" });
  return r;
}

function enviarMailFinal_(g, p, ps) {
  const r = enviar_(p.mail, "Amigo invisible «" + g.nombre + "»: así quedó el sorteo", mailFinal_(g, p, ps));
  if (r === "ok") actualizar_("participantes", p._fila, { mailFinal: new Date() });
  if (r === "error") actualizar_("participantes", p._fila, { mailFinal: "ERROR" });
  return r;
}

// El aviso de un mensaje nuevo: la pista a quien la recibe, la respuesta a quien la mandó, el acierto a
// quien fue descubierto. Si no hay cuota, queda sin marcar y sale en la próxima hora.
function avisar_(g, m) {
  const porId = indexar_(participantesDe_(g.id));
  const de = porId[m.de];
  const para = porId[m.para];
  if (!de || !para) {
    actualizar_("mensajes", m._fila || filaDeMensaje_(m.id), { avisado: "ERROR" });
    return "error";
  }

  let asunto;
  let html;
  if (m.tipo === TIPO_PISTA) {
    asunto = "Tu amigo invisible te mandó una pista";
    html = mailPista_(g, para, m);
  } else if (m.tipo === TIPO_RESPUESTA) {
    const pista = mensajesDe_(g.id).find((x) => x.id === m.respondeA);
    const usadas = mensajesDe_(g.id).filter((x) => x.tipo === TIPO_PISTA && x.de === para.id).length;
    asunto = de.nombre + " te contestó la pista";
    html = mailRespuesta_(g, para, de, m, pista, CONFIG.PISTAS_MAX - usadas);
  } else {
    asunto = de.nombre + " adivinó que sos su amigo invisible";
    html = mailDescubierto_(g, para, de);
  }

  const r = enviar_(para.mail, asunto, html);
  if (r !== "sin_cuota") {
    actualizar_("mensajes", m._fila || filaDeMensaje_(m.id), { avisado: r === "ok" ? new Date() : "ERROR" });
  }
  return r;
}

function filaDeMensaje_(id) {
  const m = leer_("mensajes").find((x) => x.id === id);
  return m ? m._fila : 0;
}

// "ok" | "sin_cuota" | "error"
function enviar_(para, asunto, html) {
  if (!hayCuota_(1)) return "sin_cuota";
  try {
    MailApp.sendEmail({
      to: para,
      subject: asunto,
      htmlBody: html,
      body: textoPlano_(html),
      name: CONFIG.NOMBRE_REMITENTE
    });
    return "ok";
  } catch (err) {
    console.error("No se pudo mandar el mail a " + para + ": " + err);
    return /quota|cuota|too many|demasiad/i.test(String(err)) ? "sin_cuota" : "error";
  }
}

function hayCuota_(cuantos) {
  return MailApp.getRemainingDailyQuota() - CONFIG.RESERVA_MAILS >= cuantos;
}

function mailConfirmacion_(g, cantidad) {
  return envolverMail_({
    badge: "Amigo invisible • Falta un paso",
    titulo: 'Confirmá el sorteo de <span style="color:#f6950a;">' + esc_(g.nombre) + "</span>",
    cuerpo: saludo_(g.organizador) +
      "Armaste el amigo invisible <strong>" + esc_(g.nombre) + "</strong> con <strong>" + cantidad +
      " participantes</strong> e intercambio el <strong>" + fechaLarga_(g.fecha) + "</strong>.<br><br>" +
      "Entrá, revisá la lista y hacé el sorteo: a cada uno le llega un mail con a quién le regala y el link a su " +
      "página, donde le puede mandar pistas anónimas y tratar de adivinar quién es su amigo invisible.<br><br>" +
      "Guardá este mail: el botón es tu acceso de organizador, para ver quién ya entró y reenviarle el mail a quien " +
      "no lo encuentre. Ni vos vas a ver quién le regala a quién.",
    boton: boton_("Revisar y sortear", linkOrganizador_(g)),
    pie: "Te llegó porque armaste un amigo invisible en wearesrv.com con este mail. Si no fuiste vos, ignoralo: " +
      "sin tu confirmación no se le manda nada a nadie."
  });
}

function mailSorteo_(g, p, destinatario) {
  const esOrganizador = p.mail === g.mailOrganizador;
  return envolverMail_({
    badge: "Amigo invisible • " + esc_(g.nombre),
    titulo: 'Te toca regalarle a <span style="color:#f6950a;">' + esc_(destinatario.nombre) + "</span>",
    cuerpo: saludo_(p.nombre) +
      (esOrganizador
        ? "Ya se hizo el sorteo del amigo invisible <strong>" + esc_(g.nombre) + "</strong>. "
        : esc_(g.organizador) + " te sumó al amigo invisible <strong>" + esc_(g.nombre) + "</strong> y ya se hizo el sorteo. ") +
      'Te toca regalarle a <strong style="color:#f6950a;">' + esc_(destinatario.nombre) + "</strong>. Que no se entere nadie.<br><br>" +
      datosIntercambio_(g) +
      "En tu página le podés mandar a " + esc_(destinatario.nombre) + " hasta <strong>" + CONFIG.PISTAS_MAX +
      " pistas anónimas</strong> en todo el juego, y te las puede contestar sin saber que sos vos. A vos también te " +
      "va a mandar pistas tu amigo invisible: tenés <strong>" + CONFIG.INTENTOS_MAX + " intentos</strong> para adivinar quién es.<br><br>" +
      "El link es solo tuyo: no lo reenvíes, que con él cualquiera ve a quién le regalás.",
    boton: boton_("Entrar a mi página", linkParticipante_(g, p)),
    pie: piePartida_(g, p)
  });
}

function mailPista_(g, para, m) {
  return envolverMail_({
    badge: "Amigo invisible • Nueva pista",
    titulo: 'Tu amigo invisible te mandó una <span style="color:#f6950a;">pista</span>',
    cuerpo: saludo_(para.nombre) +
      "En el amigo invisible <strong>" + esc_(g.nombre) + "</strong>, tu amigo invisible te dejó esta pista:" +
      cita_(m.texto) +
      "Se la podés contestar una vez desde tu página, sin que sepa nada más que lo que le escribas. " +
      "¿Ya tenés una idea de quién es? Arriesgalo ahí.",
    boton: boton_("Contestar la pista", linkParticipante_(g, para)),
    pie: piePartida_(g, para)
  });
}

function mailRespuesta_(g, para, de, m, pista, restantes) {
  return envolverMail_({
    badge: "Amigo invisible • Te contestaron",
    titulo: esc_(de.nombre) + ' te <span style="color:#f6950a;">contestó</span>',
    cuerpo: saludo_(para.nombre) +
      "A tu pista" + cita_(pista ? pista.texto : "") +
      esc_(de.nombre) + " te contestó:" + cita_(m.texto) +
      "No sabe que sos vos. " +
      (restantes > 0
        ? "Te " + (restantes === 1 ? "queda 1 pista" : "quedan " + restantes + " pistas") + " para mandarle."
        : "Ya usaste tus " + CONFIG.PISTAS_MAX + " pistas."),
    boton: boton_("Ver mi página", linkParticipante_(g, para)),
    pie: piePartida_(g, para)
  });
}

function mailDescubierto_(g, para, de) {
  return envolverMail_({
    badge: "Amigo invisible • Te descubrieron",
    titulo: esc_(de.nombre) + ' te <span style="color:#f6950a;">descubrió</span>',
    cuerpo: saludo_(para.nombre) +
      esc_(de.nombre) + " adivinó que sos su amigo invisible en <strong>" + esc_(g.nombre) + "</strong>. " +
      "El regalo, igual, sigue siendo sorpresa.",
    boton: boton_("Ver mi página", linkParticipante_(g, para)),
    pie: piePartida_(g, para)
  });
}

function mailFinal_(g, p, ps) {
  const porId = indexar_(ps);
  const quienMeRegala = ps.find((x) => x.regalaA === p.id);
  const lista = ps
    .map((x) => "<li>" + esc_(x.nombre) + " le regaló a " + esc_(porId[x.regalaA] ? porId[x.regalaA].nombre : "") + "</li>")
    .join("");
  return envolverMail_({
    badge: "Amigo invisible • Terminó el juego",
    titulo: 'Así quedó el <span style="color:#f6950a;">sorteo</span>',
    cuerpo: saludo_(p.nombre) +
      "Terminó el amigo invisible <strong>" + esc_(g.nombre) + "</strong>." +
      (quienMeRegala
        ? ' Tu amigo invisible era <strong style="color:#f6950a;">' + esc_(quienMeRegala.nombre) + "</strong>."
        : "") +
      "<br><br>Así quedó el sorteo:" +
      '<ul style="margin:10px 0 16px 0; padding-left:20px; line-height:1.8;">' + lista + "</ul>" +
      "¡Gracias por jugar! Si querés armar otro, entrá a " +
      '<a href="' + CONFIG.URL_SITIO + CONFIG.RUTA + '" style="color:#0b78fb;">wearesrv.com/amigo-invisible</a>.',
    boton: boton_("Ver las pistas del juego", linkParticipante_(g, p)),
    pie: piePartida_(g, p)
  });
}

function mailLinks_(comoParticipante, comoOrganizador) {
  const item = (texto, link) =>
    '<li style="margin-bottom:8px;"><a href="' + esc_(link) + '" style="color:#0b78fb; font-weight:bold;">' + texto + "</a></li>";
  const listaParticipante = comoParticipante
    .map((x) => item("Tu página en «" + esc_(x.grupo.nombre) + "»", x.link))
    .join("");
  const listaOrganizador = comoOrganizador
    .map((x) => item("Panel del organizador de «" + esc_(x.grupo.nombre) + "»", x.link))
    .join("");
  return envolverMail_({
    badge: "Amigo invisible • Tus links",
    titulo: 'Tus <span style="color:#f6950a;">links</span>',
    cuerpo: "¡Hola! Pediste tus links del amigo invisible. Son solo tuyos: no los reenvíes." +
      '<ul style="margin:14px 0 0 0; padding-left:20px; line-height:1.6;">' + listaParticipante + listaOrganizador + "</ul>",
    boton: "",
    pie: "Te llegó porque alguien pidió en wearesrv.com/amigo-invisible los links de este mail. Si no fuiste vos, ignoralo."
  });
}

function datosIntercambio_(g) {
  return "<strong>Intercambio:</strong> " + fechaLarga_(g.fecha) + "<br>" +
    (g.presupuesto ? "<strong>Presupuesto:</strong> " + esc_(g.presupuesto) + "<br>" : "") + "<br>";
}

function piePartida_(g, p) {
  return p.mail === g.mailOrganizador
    ? "Te llegó porque armaste el amigo invisible «" + esc_(g.nombre) + "» en wearesrv.com."
    : "Te llegó porque " + esc_(g.organizador) + " te sumó al amigo invisible «" + esc_(g.nombre) + "» en wearesrv.com.";
}

function linkParticipante_(g, p) {
  return paginaDe_(g) + "#c=" + p.codigo;
}

function linkOrganizador_(g) {
  return paginaDe_(g) + "#admin=" + g.codigo;
}

// La página del juego en el sitio donde se armó el grupo
function paginaDe_(g) {
  return sitioValido_(g.sitio) + CONFIG.RUTA;
}

// Solo wearesrv.com, un deploy de Netlify o localhost (para probar con npm run dev). Cualquier otra cosa: wearesrv.com
function sitioValido_(sitio) {
  const s = String(sitio || "");
  return /^(https:\/\/(www\.)?wearesrv\.com|https:\/\/[a-z0-9-]+\.netlify\.app|http:\/\/localhost:\d{2,5})$/.test(s)
    ? s
    : CONFIG.URL_SITIO;
}

function saludo_(nombre) {
  return '¡Hola <strong style="color:#f6950a;">' + esc_(nombre || "") + "</strong>!<br><br>";
}

function cita_(texto) {
  return '<div style="margin:12px 0; padding:12px 16px; border-left:3px solid #f6950a; background-color:#1a1a1a; ' +
    'border-radius:6px; color:#ffffff; font-size:15px; line-height:1.5;">' + esc_(texto).replace(/\n/g, "<br>") + "</div>";
}

function boton_(texto, link) {
  return `
            <tr>
              <td align="center" style="padding: 5px 30px 20px 30px;">
                <a href="${esc_(link)}" target="_blank" style="background-color:#0b78fb; border-radius:8px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 28px; display:inline-block; box-shadow:0 4px 10px rgba(11, 120, 251, 0.4);">
                  ${texto}
                </a>
              </td>
            </tr>`;
}

// Misma estructura que los mails de los cursos: logo, etiqueta, título, cuerpo, botón y pie
function envolverMail_(m) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amigo Invisible SRV</title>
  </head>
  <body style="margin:0; padding:0; background-color:#000000; font-family:'Roboto', Arial, sans-serif; color:#ffffff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; padding: 20px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0d0d0d; border:1px solid #0b78fb; border-radius:12px; width:100%; max-width:600px;">
            <tr>
              <td style="padding: 25px 30px 10px 30px;" align="center">
                <img src="${CONFIG.LOGO_URL}" alt="SRV" style="max-width:140px; height:auto; display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 10px 30px;" align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border:1px solid #0b78fb; border-radius:50px; padding: 4px 12px; color:#0b78fb; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                      ${m.badge}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 0px 30px; font-size:24px; font-weight:900; text-transform:uppercase; color:#ffffff; line-height:1.2;">
                ${m.titulo}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; font-size:15px; line-height:1.6; color:#ffffff;">
                ${m.cuerpo}
              </td>
            </tr>
            ${m.boton}
            <tr>
              <td style="padding: 10px 30px 25px 30px; font-size:13px; line-height:1.6; color:#aaaaaa; border-top:1px dashed #333333;">
                ${m.pie}<br>
                No respondas este mail: todo el juego se hace desde la página.<br><br>
                <strong style="color:#ffffff;">Amigo Invisible SRV</strong><br>
                <span style="color:#0b78fb; font-size:12px;">Un juego gratis de <a href="https://wearesrv.com" style="color:#0b78fb;">WEARESRV</a></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// Versión en texto del mail (la usan los clientes que no muestran HTML y ayuda a no caer en spam)
function textoPlano_(html) {
  return String(html)
    .replace(/<(head|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (todo, link, texto) => texto.trim() + ": " + link)
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|div|li|ul)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ============================================================
//  PLANILLA
// ============================================================
// Lo leído en esta ejecución: cada pedido vuelve a leer la planilla (corre siempre con el lock)
let memo_ = {};

function hoja_(clave) {
  const def = TABLAS[clave];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(def.hoja);
  if (hoja) return hoja;
  hoja = ss.insertSheet(def.hoja);
  hoja.getRange(1, 1, 1, def.columnas.length).setValues([def.columnas.map((c) => c[1])]).setFontWeight("bold");
  hoja.setFrozenRows(1);
  (def.texto || []).forEach((k) => hoja.getRange(1, columna_(def, k), hoja.getMaxRows(), 1).setNumberFormat("@"));
  return hoja;
}

function columna_(def, clave) {
  return def.columnas.findIndex((c) => c[0] === clave) + 1;
}

function leer_(clave) {
  if (memo_[clave]) return memo_[clave];
  const def = TABLAS[clave];
  const hoja = hoja_(clave);
  const ultima = hoja.getLastRow();
  const filas = ultima < 2 ? [] : hoja.getRange(2, 1, ultima - 1, def.columnas.length).getValues();
  memo_[clave] = filas.map((valores, i) => {
    const obj = { _fila: i + 2 };
    def.columnas.forEach((c, j) => { obj[c[0]] = leido_(def, c[0], valores[j]); });
    return obj;
  });
  return memo_[clave];
}

function leido_(def, clave, valor) {
  const esTexto = (def.texto || []).indexOf(clave) !== -1;
  if (esTexto && valor instanceof Date) return Utilities.formatDate(valor, CONFIG.ZONA, "yyyy-MM-dd");
  if (esTexto) valor = String(valor);
  return typeof valor === "string" ? valor.replace(/^'(?=[=+\-@])/, "") : valor;
}

// Agrega una o varias filas de una sola vez
function agregar_(clave, objetos) {
  const lista = Array.isArray(objetos) ? objetos : [objetos];
  if (!lista.length) return;
  const def = TABLAS[clave];
  const hoja = hoja_(clave);
  const desde = hoja.getLastRow() + 1;
  const faltan = desde + lista.length - 1 - hoja.getMaxRows();
  if (faltan > 0) hoja.insertRowsAfter(hoja.getMaxRows(), faltan);
  (def.texto || []).forEach((k) => hoja.getRange(desde, columna_(def, k), lista.length, 1).setNumberFormat("@"));
  hoja.getRange(desde, 1, lista.length, def.columnas.length)
    .setValues(lista.map((o) => def.columnas.map((c) => escribible_(o[c[0]]))));
  if (memo_[clave]) {
    lista.forEach((o, i) => {
      o._fila = desde + i;
      memo_[clave].push(o);
    });
  } else {
    lista.forEach((o, i) => { o._fila = desde + i; });
  }
}

function actualizar_(clave, fila, campos) {
  if (!fila) return;
  const def = TABLAS[clave];
  const hoja = hoja_(clave);
  Object.keys(campos).forEach((k) => hoja.getRange(fila, columna_(def, k)).setValue(escribible_(campos[k])));
  const enMemo = memo_[clave] && memo_[clave].find((o) => o._fila === fila);
  if (enMemo) Object.assign(enMemo, campos);
}

// Evita que la planilla tome como fórmula un texto que empieza con =, +, - o @
function escribible_(valor) {
  if (valor === null || valor === undefined) return "";
  if (typeof valor !== "string") return valor;
  return /^[=+\-@]/.test(valor) ? "'" + valor : valor;
}

function grupoPorCodigo_(codigo) {
  const c = String(codigo || "");
  return c ? leer_("grupos").find((g) => g.codigo === c) : null;
}

function grupoPorId_(id) {
  return leer_("grupos").find((g) => g.id === id) || null;
}

function participantePorCodigo_(codigo) {
  const c = String(codigo || "");
  return c ? leer_("participantes").find((p) => p.codigo === c) : null;
}

function participantesDe_(grupoId) {
  return leer_("participantes").filter((p) => p.grupo === grupoId);
}

function mensajesDe_(grupoId) {
  return leer_("mensajes").filter((m) => m.grupo === grupoId);
}

function nuevoMensaje_(g, tipo, de, para, extra) {
  return {
    fecha: new Date(),
    grupo: g.id,
    id: nuevoId_("M"),
    tipo: tipo,
    de: de,
    para: para,
    texto: extra.texto || "",
    respondeA: extra.respondeA || "",
    acierto: extra.acierto || "",
    avisado: extra.avisado || "",
    pedido: texto_(extra.pedido, 40)
  };
}

// Alta en novedades. Si ya estaba y se había dado de baja, vuelve a estar de alta (sin otra fila).
function agregarNovedad_(nombre, mail, origen) {
  const filas = leer_("novedades").filter((n) => n.mail === mail);
  if (!filas.length) {
    agregar_("novedades", { fecha: new Date(), nombre: nombre, mail: mail, origen: origen, baja: "" });
    return;
  }
  if (!filas.some((n) => !n.baja)) actualizar_("novedades", filas[0]._fila, { baja: "" });
}

function quiereNovedades_(mail) {
  return leer_("novedades").some((n) => n.mail === mail && !n.baja);
}

// ============================================================
//  HELPERS
// ============================================================

// A cada id le asigna otro al azar, sin que a nadie le toque sí mismo. Puede haber parejas que se regalan
// entre sí: así nadie puede descartar a quien le regala como su amigo invisible.
function sortearPares_(ids) {
  for (let intento = 0; intento < 1000; intento++) {
    const mezcla = ids.slice();
    for (let i = mezcla.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const aux = mezcla[i];
      mezcla[i] = mezcla[j];
      mezcla[j] = aux;
    }
    if (mezcla.every((id, i) => id !== ids[i])) {
      const pares = {};
      ids.forEach((id, i) => { pares[id] = mezcla[i]; });
      return pares;
    }
  }
  throw new Error("No se pudo sortear");
}

function indexar_(lista) {
  const porId = {};
  lista.forEach((x) => { porId[x.id] = x; });
  return porId;
}

function nuevoCodigo_() {
  return Utilities.getUuid().replace(/-/g, "");
}

function nuevoId_(prefijo) {
  return prefijo + Utilities.getUuid().replace(/-/g, "").slice(0, 10).toUpperCase();
}

function hoy_() {
  return Utilities.formatDate(new Date(), CONFIG.ZONA, "yyyy-MM-dd");
}

function sumarDias_(fecha, dias) {
  const partes = fecha.split("-").map(Number);
  return new Date(Date.UTC(partes[0], partes[1] - 1, partes[2] + dias)).toISOString().slice(0, 10);
}

// "2026-12-24" -> "jueves 24 de diciembre"
function fechaLarga_(fecha) {
  const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre",
    "octubre", "noviembre", "diciembre"];
  const partes = String(fecha).split("-").map(Number);
  const d = new Date(Date.UTC(partes[0], partes[1] - 1, partes[2]));
  if (isNaN(d.getTime())) return esc_(fecha);
  return dias[d.getUTCDay()] + " " + partes[2] + " de " + meses[partes[1] - 1];
}

function iso_(fecha) {
  return fecha instanceof Date ? fecha.toISOString() : "";
}

function texto_(valor, max) {
  return String(valor === null || valor === undefined ? "" : valor).replace(/\s+/g, " ").trim().slice(0, max);
}

// Pistas y respuestas: conservan los saltos de línea
function mensaje_(valor) {
  return String(valor === null || valor === undefined ? "" : valor)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, CONFIG.LARGO_MENSAJE);
}

function mail_(valor) {
  return texto_(valor, 120).toLowerCase();
}

function mailValido_(mail) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail);
}

// Para comparar nombres: sin tildes ni mayúsculas
function normalizar_(texto) {
  return String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function tieneEnlace_(texto) {
  return /(https?:|www\.|:\/\/|\.(com|net|org|ar|io|ly|me|info|xyz|site|link|club|app|shop|online|top)\b)/i.test(String(texto));
}

function invalido_(campo, detalle) {
  return { status: "datos_invalidos", campo: campo, detalle: detalle === undefined ? "" : detalle };
}

function esc_(texto) {
  return String(texto === null || texto === undefined ? "" : texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Comparación en tiempo constante (evita ataques de timing sobre la clave)
function compararSeguro_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function salida_(datos) {
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
}
