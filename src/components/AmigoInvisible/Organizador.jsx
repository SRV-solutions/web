import React, { useCallback, useEffect, useState } from "react";
import Icono from "../Icono";
import { LuArrowLeft, LuCircleCheck, LuMail, LuRefreshCw, LuShuffle } from "react-icons/lu";
import styles from "./style.module.css";
import { codigoGuardado, olvidarCodigo } from "./sesion";
import { fechaLarga, llamar, mensajeDe } from "./api";

// Panel del organizador (link #admin=... del mail de confirmación): revisa la lista, sortea, ve a quién le
// llegó el mail y quién ya entró, y reenvía el mail. No ve a quién le tocó quién.
export default function Organizador({ ir }) {
  const codigo = codigoGuardado("admin");
  const [datos, setDatos] = useState(null);
  const [carga, setCarga] = useState(codigo ? "cargando" : "sinCodigo"); // cargando | listo | error | sinCodigo
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const [reenviando, setReenviando] = useState(null);
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "error", texto }

  const cargar = useCallback(async () => {
    if (!codigo) return;
    const r = await llamar("organizador", { codigo });
    if (r.status === "ok") {
      setDatos(r);
      setCarga("listo");
    } else if (r.status === "no_encontrado") {
      olvidarCodigo("admin");
      setCarga("sinCodigo");
    } else {
      setError(mensajeDe(r.status));
      setCarga((actual) => (actual === "listo" ? actual : "error"));
    }
  }, [codigo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const sortear = async () => {
    setSorteando(true);
    setAviso(null);
    const r = await llamar("sortear", { codigo });
    setSorteando(false);
    setConfirmando(false);
    if (r.status === "ok") {
      setDatos(r);
      const pendientes = r.participantes.filter((p) => !p.mailEnviado).length;
      setAviso({
        tipo: "ok",
        texto: pendientes
          ? `¡Listo! Ya se hizo el sorteo. A ${pendientes} todavía no les salió el mail: sale solo en la próxima hora.`
          : "¡Listo! Ya se hizo el sorteo y a cada uno le llegó su mail.",
      });
    } else if (r.status === "en_proceso") {
      setAviso({ tipo: "ok", texto: "El sorteo está hecho y los mails están saliendo. En un minuto se actualiza la lista." });
      setTimeout(cargar, 15000);
    } else {
      setAviso({ tipo: "error", texto: mensajeDe(r.status) });
    }
  };

  const reenviar = async (p) => {
    setReenviando(p.id);
    setAviso(null);
    const r = await llamar("reenviarParticipante", { codigo, participante: p.id });
    setReenviando(null);
    if (r.status === "ok") {
      setDatos(r);
      setAviso({ tipo: "ok", texto: `Le reenviamos el mail a ${p.nombre}.` });
    } else {
      setAviso({
        tipo: "error",
        texto:
          r.status === "limite"
            ? `A ${p.nombre} ya le reenviamos el mail hace un rato. Probá de nuevo en 10 minutos.`
            : mensajeDe(r.status),
      });
    }
  };

  if (carga === "sinCodigo") {
    return (
      <div className={styles.panel}>
        <h1 className={styles.panelTitulo}>No encontramos tu panel</h1>
        <p className={styles.ayuda}>
          Entrá desde el botón «Revisar y sortear» del mail que te llegó cuando armaste el grupo. Si no lo encontrás,
          pedilo de nuevo con tu mail.
        </p>
        <button type="button" className={styles.btnSecundario} onClick={() => ir("inicio")}>
          Ir al inicio del amigo invisible
        </button>
      </div>
    );
  }
  if (carga === "cargando") return <p className={styles.cargando}>Cargando el panel...</p>;
  if (carga === "error") {
    return (
      <div className={styles.panel}>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.btnSecundario} onClick={cargar}>
          <Icono de={LuRefreshCw} /> Probar de nuevo
        </button>
      </div>
    );
  }

  const { grupo, participantes } = datos;
  const pendiente = grupo.estado === "pendiente";

  return (
    <>
      <div className={styles.volver}>
        <button type="button" className={styles.btnLink} onClick={() => ir("inicio")}>
          <Icono de={LuArrowLeft} /> Inicio del amigo invisible
        </button>
        {!pendiente && codigoGuardado("c") && (
          <button type="button" className={styles.btnLink} onClick={() => ir("participante")}>
            Ir a mi página del juego
          </button>
        )}
      </div>

      <p className={styles.kicker}>Panel del organizador</p>
      <h1 className={styles.title}>{grupo.nombre}</h1>
      <p className={styles.lead}>
        Intercambio el <strong>{fechaLarga(grupo.fecha)}</strong>
        {grupo.presupuesto && <> · Presupuesto: {grupo.presupuesto}</>}.{" "}
        {pendiente &&
          "Revisá la lista y hacé el sorteo. Después ya no se puede cambiar: si hay un error, armá el grupo de nuevo (este, sin sortear, se borra solo)."}
        {grupo.estado === "activo" &&
          "El sorteo ya está hecho. Acá ves a quién le llegó el mail y quién ya entró a su página. Ni vos ves a quién le tocó quién."}
        {grupo.estado === "terminado" && "El juego terminó: a todos les llega por mail cómo quedó el sorteo."}
      </p>

      <div className={styles.panel}>
        <h2 className={styles.panelTitulo}>
          {participantes.length} participantes
        </h2>
        <ul className={styles.tabla}>
          {participantes.map((p) => (
            <li key={p.id} className={styles.tablaFila}>
              <div className={styles.tablaPersona}>
                <strong>{p.nombre}</strong>
                <span>{p.mail}</span>
              </div>
              {!pendiente && (
                <div className={styles.tablaEstado}>
                  <span className={p.mailEnviado ? styles.chipOk : p.mailError ? styles.chipNo : styles.chip}>
                    {p.mailEnviado ? "Mail enviado" : p.mailError ? "No se pudo mandar" : "Mail en camino"}
                  </span>
                  <span className={p.entro ? styles.chipOk : styles.chip}>{p.entro ? "Ya entró" : "Todavía no entró"}</span>
                  {grupo.estado === "activo" && (
                    <button
                      type="button"
                      className={styles.btnChico}
                      onClick={() => reenviar(p)}
                      disabled={reenviando !== null}
                    >
                      <Icono de={LuMail} /> {reenviando === p.id ? "Enviando..." : "Reenviar mail"}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        {pendiente && !confirmando && (
          <button type="button" className={styles.btnPrimario} onClick={() => setConfirmando(true)}>
            <Icono de={LuShuffle} /> Hacer el sorteo
          </button>
        )}
        {pendiente && confirmando && (
          <div className={styles.confirmar}>
            <p>
              ¿Está bien la lista? Al sortear, a cada uno le llega su mail y ya no se pueden cambiar los participantes.
            </p>
            <div className={styles.filaAcciones}>
              <button type="button" className={styles.btnPrimario} onClick={sortear} disabled={sorteando}>
                {sorteando ? "Sorteando y mandando los mails..." : "Sí, sortear"}
              </button>
              <button type="button" className={styles.btnSecundario} onClick={() => setConfirmando(false)} disabled={sorteando}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {aviso && (
          <p className={aviso.tipo === "ok" ? styles.ok : styles.error}>
            {aviso.tipo === "ok" && <Icono de={LuCircleCheck} />} {aviso.texto}
          </p>
        )}
      </div>
    </>
  );
}
