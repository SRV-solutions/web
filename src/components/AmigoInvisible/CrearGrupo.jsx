import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icono from "../Icono";
import { LuCircleCheck, LuUserPlus, LuX } from "react-icons/lu";
import styles from "./style.module.css";
import { hoyLocal, llamar, mensajeDe, nuevoPedido, sumarDias } from "./api";
import { MAX_DIAS_HASTA_INTERCAMBIO, MAX_PARTICIPANTES, MIN_PARTICIPANTES } from "./reglas";

const filaVacia = () => ({ key: nuevoPedido(), nombre: "", mail: "" });
const mailValido = (mail) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail.trim());
const normalizar = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// El mismo control que hace el Apps Script, para avisar antes de mandar
function revisar(datos) {
  if (!datos.grupo.nombre.trim()) return { campo: "grupo" };
  const { fecha } = datos.grupo;
  if (!fecha || fecha < hoyLocal() || fecha > sumarDias(hoyLocal(), MAX_DIAS_HASTA_INTERCAMBIO)) return { campo: "fecha" };
  if (!datos.organizador.nombre.trim()) return { campo: "organizador" };
  if (!mailValido(datos.organizador.mail)) return { campo: "mailOrganizador" };
  const todos = [...(datos.participa ? [datos.organizador] : []), ...datos.participantes];
  if (todos.length < MIN_PARTICIPANTES || todos.length > MAX_PARTICIPANTES) return { campo: "cantidad" };
  const incompleta = datos.participantes.findIndex((p) => !p.nombre.trim() || !mailValido(p.mail));
  if (incompleta !== -1) {
    const p = datos.participantes[incompleta];
    return p.nombre.trim() ? { campo: "mailParticipante", detalle: p.nombre } : { campo: "participante", detalle: incompleta };
  }
  const mails = new Set();
  const nombres = new Set();
  for (const p of todos) {
    const mail = p.mail.trim().toLowerCase();
    if (mails.has(mail)) return { campo: "mailRepetido", detalle: mail };
    if (nombres.has(normalizar(p.nombre))) return { campo: "nombreRepetido", detalle: p.nombre };
    mails.add(mail);
    nombres.add(normalizar(p.nombre));
  }
  return null;
}

function textoDelProblema({ campo, detalle }, datos) {
  switch (campo) {
    case "grupo":
      return "Ponele un nombre al grupo.";
    case "fecha":
      return `Elegí la fecha del intercambio: de hoy a ${MAX_DIAS_HASTA_INTERCAMBIO} días.`;
    case "organizador":
      return "Escribí tu nombre.";
    case "mailOrganizador":
      return "Revisá tu mail: parece que tiene un error.";
    case "cantidad":
      return `Tienen que participar de ${MIN_PARTICIPANTES} a ${MAX_PARTICIPANTES} personas, contándote a vos si jugás.`;
    case "participante":
      return Number.isInteger(detalle)
        ? `Falta el nombre del participante ${detalle + 1}.`
        : "Falta el nombre de un participante.";
    case "mailParticipante":
      return `Revisá el mail de ${detalle || "un participante"}.`;
    case "mailRepetido":
      return detalle === datos.organizador.mail.trim().toLowerCase() && datos.participa
        ? "Tu mail está también en la lista. Como participás, no hace falta que te sumes abajo."
        : `El mail ${detalle} está dos veces: cada uno necesita el suyo.`;
    case "nombreRepetido":
      return `Hay dos que se llaman ${detalle}: agregales el apellido o un apodo, así se distinguen al adivinar.`;
    case "enlace":
      return "Los nombres no pueden tener links ni direcciones web.";
    default:
      return mensajeDe("datos_invalidos");
  }
}

export default function CrearGrupo() {
  const [participa, setParticipa] = useState(true);
  const [filas, setFilas] = useState(() => [filaVacia(), filaVacia(), filaVacia()]);
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | listo | error
  const [error, setError] = useState("");
  const [mailEnviado, setMailEnviado] = useState("");

  const hoy = hoyLocal();
  const cargadas = filas.filter((f) => f.nombre.trim() || f.mail.trim());
  const total = cargadas.length + (participa ? 1 : 0);
  const maxFilas = MAX_PARTICIPANTES - (participa ? 1 : 0);

  const cambiarFila = (key, campo, valor) =>
    setFilas((actuales) => actuales.map((f) => (f.key === key ? { ...f, [campo]: valor } : f)));
  const sacarFila = (key) => setFilas((actuales) => actuales.filter((f) => f.key !== key));
  const sumarFila = () => setFilas((actuales) => (actuales.length < maxFilas ? [...actuales, filaVacia()] : actuales));

  const crear = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const datos = {
      grupo: { nombre: form.get("grupo"), fecha: form.get("fecha"), presupuesto: form.get("presupuesto") },
      organizador: { nombre: form.get("nombre"), mail: form.get("mail") },
      participa,
      participantes: cargadas.map(({ nombre, mail }) => ({ nombre, mail })),
      novedades: form.get("novedades") === "on",
      empresa: form.get("empresa"),
    };
    const problema = revisar(datos);
    if (problema) {
      setError(textoDelProblema(problema, datos));
      setEnvio("error");
      return;
    }

    setEnvio("enviando");
    setError("");
    const r = await llamar("crear", { ...datos, pedido: nuevoPedido() });
    if (r.status === "ok") {
      setMailEnviado(datos.organizador.mail);
      setEnvio("listo");
      return;
    }
    setError(
      r.status === "datos_invalidos"
        ? textoDelProblema(r, datos)
        : r.status === "limite"
          ? "Ya armaste varios grupos seguidos con este mail. Probá de nuevo en unas horas."
          : mensajeDe(r.status)
    );
    setEnvio("error");
  };

  if (envio === "listo") {
    return (
      <div className={`${styles.panel} ${styles.panelArmar}`} id="armar">
        <h2 className={styles.panelTitulo}>Revisá tu mail</h2>
        <p className={styles.ok}>
          <Icono de={LuCircleCheck} /> Te mandamos a <strong>{mailEnviado}</strong> el botón para revisar la lista y
          hacer el sorteo. Si no lo ves en unos minutos, buscalo en el spam o en Promociones.
        </p>
        <p className={styles.ayuda}>Hasta que no lo confirmes, no le llega nada a nadie.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${styles.panelArmar}`} id="armar">
      <h2 className={styles.panelTitulo}>Armá tu amigo invisible</h2>
      <form className={styles.form} onSubmit={crear} noValidate>
        <fieldset className={styles.bloque}>
          <legend>El grupo</legend>
          <div className={styles.grilla}>
            <label className={styles.etiqueta}>
              Nombre del grupo
              <input className={styles.campo} name="grupo" placeholder="Navidad en familia" maxLength={60} required />
            </label>
            <label className={styles.etiqueta}>
              Fecha del intercambio
              <input
                className={styles.campo}
                type="date"
                name="fecha"
                min={hoy}
                max={sumarDias(hoy, MAX_DIAS_HASTA_INTERCAMBIO)}
                required
              />
            </label>
            <label className={styles.etiqueta}>
              Presupuesto (opcional)
              <input className={styles.campo} name="presupuesto" placeholder="Hasta $20.000" maxLength={40} />
            </label>
          </div>
        </fieldset>

        <fieldset className={styles.bloque}>
          <legend>Vos, que organizás</legend>
          <div className={styles.grilla}>
            <label className={styles.etiqueta}>
              Tu nombre
              <input className={styles.campo} name="nombre" maxLength={60} required autoComplete="given-name" />
            </label>
            <label className={styles.etiqueta}>
              Tu mail (te llega para confirmar)
              <input className={styles.campo} type="email" name="mail" maxLength={120} required autoComplete="email" />
            </label>
          </div>
          <label className={styles.check}>
            <input type="checkbox" checked={participa} onChange={(e) => setParticipa(e.target.checked)} />
            Yo también participo del sorteo
          </label>
        </fieldset>

        <fieldset className={styles.bloque}>
          <legend>{participa ? "Los demás participantes" : "Los participantes"}</legend>
          <ul className={styles.filas}>
            {filas.map((f, i) => (
              <li key={f.key} className={styles.fila}>
                <input
                  className={styles.campo}
                  value={f.nombre}
                  onChange={(e) => cambiarFila(f.key, "nombre", e.target.value)}
                  placeholder={`Nombre ${i + 1}`}
                  aria-label={`Nombre del participante ${i + 1}`}
                  maxLength={60}
                  autoComplete="off"
                />
                <input
                  className={styles.campo}
                  type="email"
                  value={f.mail}
                  onChange={(e) => cambiarFila(f.key, "mail", e.target.value)}
                  placeholder="Mail"
                  aria-label={`Mail del participante ${i + 1}`}
                  maxLength={120}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.btnIcono}
                  onClick={() => sacarFila(f.key)}
                  disabled={filas.length <= 1}
                  aria-label={`Sacar al participante ${i + 1}`}
                  title="Sacar"
                >
                  <Icono de={LuX} />
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.filaAcciones}>
            <button type="button" className={styles.btnSecundario} onClick={sumarFila} disabled={filas.length >= maxFilas}>
              <Icono de={LuUserPlus} /> Sumar participante
            </button>
            <span className={styles.contador}>
              Participan {total} {total === 1 ? "persona" : "personas"}
            </span>
          </div>
          <p className={styles.ayuda}>
            Sumá solo a gente que sabe que la anotás: a cada uno le llega un mail con el sorteo.
          </p>
        </fieldset>

        <label className={styles.check}>
          <input type="checkbox" name="novedades" />
          Quiero recibir novedades y promos de los cursos de WEARESRV
        </label>
        <input className={styles.trampa} type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <button className={styles.btnPrimario} type="submit" disabled={envio === "enviando"}>
          {envio === "enviando" ? "Armando el grupo..." : "Armar el grupo"}
        </button>
        <p className={styles.consentimiento}>
          Al armar el grupo aceptás nuestra <Link to="/privacidad">política de privacidad</Link>. Los mails se usan
          solo para el juego.
        </p>
        {envio === "error" && error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
