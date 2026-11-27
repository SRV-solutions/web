import React, { useCallback, useEffect, useRef, useState } from "react";
import Icono from "../Icono";
import {
  LuArrowLeft,
  LuCalendarDays,
  LuCircleCheck,
  LuGift,
  LuPartyPopper,
  LuRefreshCw,
  LuReply,
  LuSearch,
  LuSend,
  LuWallet,
} from "react-icons/lu";
import styles from "./style.module.css";
import { codigoGuardado, olvidarCodigo } from "./sesion";
import { cuando, diasEntre, fechaLarga, llamar, mensajeDe, nuevoPedido } from "./api";

// Errores después de los cuales conviene volver a pedir el estado (otra pestaña o el cierre del juego
// pueden haber cambiado algo)
const RECARGAR_SI = ["sin_pistas", "sin_intentos", "ya_adivinaste", "ya_respondida", "juego_terminado"];

// La página de cada participante (link #c=... del mail del sorteo)
export default function Participante({ ir }) {
  const codigo = codigoGuardado("c");
  const [d, setD] = useState(null);
  const [carga, setCarga] = useState(codigo ? "cargando" : "sinCodigo"); // cargando | listo | error | sinCodigo | noSorteado
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!codigo) return;
    const r = await llamar("estado", { codigo });
    if (r.status === "ok") {
      setD(r);
      setCarga("listo");
    } else if (r.status === "no_encontrado") {
      olvidarCodigo("c");
      setCarga("sinCodigo");
    } else if (r.status === "no_sorteado") {
      setCarga("noSorteado");
    } else {
      setError(mensajeDe(r.status));
      setCarga((actual) => (actual === "listo" ? actual : "error"));
    }
  }, [codigo]);

  // Al volver a la pestaña se actualiza: puede haber llegado una pista o una respuesta
  useEffect(() => {
    cargar();
    const alVolver = () => {
      if (document.visibilityState === "visible") cargar();
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [cargar]);

  const hacer = async (accion, datos) => {
    const r = await llamar(accion, { codigo, ...datos });
    if (r.status === "ok") setD(r);
    else if (RECARGAR_SI.includes(r.status)) cargar();
    return r;
  };

  const pedirLink = () => {
    ir("inicio");
    setTimeout(() => document.getElementById("perdi-mi-link")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (carga === "sinCodigo") {
    return (
      <div className={styles.panel}>
        <h1 className={styles.panelTitulo}>Entrá desde tu link</h1>
        <p className={styles.ayuda}>
          Para ver tu página entrá desde el botón «Entrar a mi página» del mail del sorteo. Si no lo encontrás, te lo
          mandamos de nuevo.
        </p>
        <div className={styles.filaAcciones}>
          <button type="button" className={styles.btnSecundario} onClick={pedirLink}>
            Pedir mi link
          </button>
          <button type="button" className={styles.btnLink} onClick={() => ir("inicio")}>
            Armar un amigo invisible
          </button>
        </div>
      </div>
    );
  }
  if (carga === "noSorteado") {
    return (
      <div className={styles.panel}>
        <h1 className={styles.panelTitulo}>Todavía no se hizo el sorteo</h1>
        <p className={styles.ayuda}>Cuando el organizador lo haga, te llega un mail con a quién le regalás.</p>
      </div>
    );
  }
  if (carga === "cargando") return <p className={styles.cargando}>Cargando tu página...</p>;
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

  const { grupo, yo, leRegalo, limites, misPistas, pistasRecibidas, intentosSobreMi, final } = d;
  const activo = grupo.estado === "activo";
  const faltan = diasEntre(grupo.hoy, grupo.fecha);
  const pistasQuedan = limites.pistas - misPistas.length;
  const descubierto = intentosSobreMi.some((i) => i.acierto);

  return (
    <>
      <div className={styles.volver}>
        <button type="button" className={styles.btnLink} onClick={() => ir("inicio")}>
          <Icono de={LuArrowLeft} /> Armar otro amigo invisible
        </button>
        {codigoGuardado("admin") && (
          <button type="button" className={styles.btnLink} onClick={() => ir("organizador")}>
            Panel del organizador
          </button>
        )}
      </div>

      <p className={styles.kicker}>Amigo invisible · {grupo.nombre}</p>
      <h1 className={styles.title}>
        Hola, <span className={styles.orange}>{yo.nombre}</span>
      </h1>

      {final ? (
        <div className={styles.destacado}>
          <p className={styles.destacadoEtiqueta}>
            <Icono de={LuPartyPopper} /> Terminó el juego
          </p>
          <p className={styles.destacadoNombre}>
            {final.miAmigo ? (
              <>
                Tu amigo invisible era <span className={styles.orange}>{final.miAmigo}</span>
              </>
            ) : (
              "Así quedó el sorteo"
            )}
          </p>
          <ul className={styles.sorteoFinal}>
            {final.sorteo.map((x) => (
              <li key={x.de}>
                <strong>{x.de}</strong> le regaló a <strong>{x.para}</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.destacado}>
          <p className={styles.destacadoEtiqueta}>
            <Icono de={LuGift} /> Te toca regalarle a
          </p>
          <p className={styles.destacadoNombre}>{leRegalo}</p>
          <p className={styles.destacadoDatos}>
            <span>
              <Icono de={LuCalendarDays} /> {fechaLarga(grupo.fecha)} ·{" "}
              {faltan <= 0 ? "es hoy" : faltan === 1 ? "es mañana" : `faltan ${faltan} días`}
            </span>
            {grupo.presupuesto && (
              <span>
                <Icono de={LuWallet} /> {grupo.presupuesto}
              </span>
            )}
          </p>
        </div>
      )}

      <div className={styles.columnas}>
        <section className={styles.panel}>
          <div className={styles.panelCabecera}>
            <h2 className={styles.panelTitulo}>Tus pistas para {leRegalo}</h2>
            <span className={pistasQuedan > 0 ? styles.chip : styles.chipNo}>
              {pistasQuedan > 0 ? `Te quedan ${pistasQuedan} de ${limites.pistas}` : "Sin pistas"}
            </span>
          </div>
          {activo && pistasQuedan > 0 && (
            <>
              <p className={styles.ayuda}>
                Le llegan sin tu nombre. Tenés {limites.pistas} en todo el juego: usalas de a poco, que no vuelven.
              </p>
              <FormMensaje
                placeholder="Una pista sobre vos, sin que sea obvia"
                boton={pistasQuedan === 1 ? "Mandar la última pista" : "Mandar pista"}
                icono={LuSend}
                largo={limites.largo}
                onEnviar={(texto, pedido) => hacer("pista", { texto, pedido })}
              />
            </>
          )}
          {activo && pistasQuedan <= 0 && <p className={styles.ayuda}>Ya usaste tus {limites.pistas} pistas.</p>}
          {misPistas.length > 0 && (
            <ol className={styles.mensajes}>
              {misPistas.map((p, i) => (
                <li key={p.id} className={styles.mensajeItem}>
                  <div className={styles.burbujaMia}>
                    <span className={styles.burbujaMeta}>
                      Pista {i + 1} · {cuando(p.fecha)}
                    </span>
                    {p.texto}
                  </div>
                  {p.respuesta ? (
                    <div className={styles.burbuja}>
                      <span className={styles.burbujaMeta}>
                        {leRegalo} te contestó · {cuando(p.respuesta.fecha)}
                      </span>
                      {p.respuesta.texto}
                    </div>
                  ) : (
                    <p className={styles.sinRespuesta}>Todavía no te contestó.</p>
                  )}
                </li>
              ))}
            </ol>
          )}
          {intentosSobreMi.length > 0 && (
            <div className={styles.intentosAjenos}>
              {descubierto ? (
                <p className={styles.ok}>
                  <Icono de={LuSearch} /> {leRegalo} adivinó que sos su amigo invisible.
                </p>
              ) : (
                <p className={styles.ayuda}>
                  {leRegalo} trató de adivinar quién es su amigo invisible y dijo:{" "}
                  {intentosSobreMi.map((i) => i.nombre).join(", ")}. Todavía no te descubrió.
                </p>
              )}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitulo}>Pistas de tu amigo invisible</h2>
          {pistasRecibidas.length === 0 ? (
            <p className={styles.ayuda}>
              {activo
                ? "Todavía no te mandó ninguna. Cuando llegue una, te avisamos por mail."
                : "No te mandó ninguna pista."}
            </p>
          ) : (
            <ol className={styles.mensajes}>
              {pistasRecibidas.map((p, i) => (
                <li key={p.id} className={styles.mensajeItem}>
                  <div className={styles.burbuja}>
                    <span className={styles.burbujaMeta}>
                      Pista {i + 1} · {cuando(p.fecha)}
                    </span>
                    {p.texto}
                  </div>
                  {p.respuesta ? (
                    <div className={styles.burbujaMia}>
                      <span className={styles.burbujaMeta}>Tu respuesta · {cuando(p.respuesta.fecha)}</span>
                      {p.respuesta.texto}
                    </div>
                  ) : (
                    activo && (
                      <FormMensaje
                        compacto
                        placeholder="Contestale (una sola vez)"
                        boton="Contestar"
                        icono={LuReply}
                        largo={limites.largo}
                        onEnviar={(texto, pedido) => hacer("responder", { pista: p.id, texto, pedido })}
                      />
                    )
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <Adivinar d={d} activo={activo} hacer={hacer} />

      <div className={styles.panel}>
        <Novedades acepta={yo.novedades} hacer={hacer} />
        <p className={styles.ayuda}>
          Este link es solo tuyo: no lo compartas, que con él cualquiera ve a quién le regalás. Para entrar desde otro
          dispositivo, usá el botón del mail del sorteo.
        </p>
      </div>
    </>
  );
}

// Cuadro para escribir una pista o una respuesta
function FormMensaje({ placeholder, boton, icono, largo, onEnviar, compacto = false }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  // Mismo texto, mismo pedido: si se reintenta un envío que en realidad llegó, no se guarda dos veces
  const pedido = useRef(nuevoPedido());

  const cambiar = (e) => {
    setTexto(e.target.value);
    pedido.current = nuevoPedido();
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    setError("");
    const r = await onEnviar(texto.trim(), pedido.current);
    setEnviando(false);
    if (r.status === "ok") {
      setTexto("");
      pedido.current = nuevoPedido();
    } else {
      setError(r.status === "datos_invalidos" ? "Escribí algo antes de mandarlo." : mensajeDe(r.status));
    }
  };

  return (
    <form className={compacto ? styles.formMensajeCompacto : styles.formMensaje} onSubmit={enviar}>
      <textarea
        className={styles.campo}
        value={texto}
        onChange={cambiar}
        placeholder={placeholder}
        maxLength={largo}
        rows={compacto ? 2 : 3}
        aria-label={placeholder}
      />
      <div className={styles.formMensajePie}>
        <span className={styles.contador}>
          {texto.length}/{largo}
        </span>
        <button className={styles.btnPrimario} type="submit" disabled={enviando || !texto.trim()}>
          <Icono de={icono} /> {enviando ? "Enviando..." : boton}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

function Adivinar({ d, activo, hacer }) {
  const [elegido, setElegido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");
  const pedido = useRef(nuevoPedido());

  const { misIntentos, participantes, limites } = d;
  const acierto = misIntentos.find((i) => i.acierto);
  const descartados = new Set(misIntentos.map((i) => i.nombre));
  const opciones = participantes.filter((p) => !descartados.has(p.nombre));
  const quedan = limites.intentos - misIntentos.length;

  const arriesgar = async (e) => {
    e.preventDefault();
    if (!elegido) return;
    const nombre = participantes.find((p) => p.id === elegido)?.nombre;
    setEnviando(true);
    setResultado("");
    const r = await hacer("adivinar", { participante: elegido, pedido: pedido.current });
    setEnviando(false);
    if (r.status === "ok") {
      pedido.current = nuevoPedido();
      setElegido("");
      if (!r.acierto) setResultado(`No es ${nombre}.`);
    } else {
      setResultado(mensajeDe(r.status));
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelCabecera}>
        <h2 className={styles.panelTitulo}>¿Quién es tu amigo invisible?</h2>
        {!acierto && (
          <span className={quedan > 0 ? styles.chip : styles.chipNo}>
            {quedan > 0 ? `Te quedan ${quedan} de ${limites.intentos} intentos` : "Sin intentos"}
          </span>
        )}
      </div>

      {acierto ? (
        <p className={styles.ok}>
          <Icono de={LuCircleCheck} /> ¡Adivinaste! Tu amigo invisible es <strong>{acierto.nombre}</strong>.
        </p>
      ) : activo && quedan > 0 ? (
        <form className={styles.formLinea} onSubmit={arriesgar}>
          <select
            className={styles.campo}
            value={elegido}
            onChange={(e) => {
              setElegido(e.target.value);
              pedido.current = nuevoPedido();
            }}
            aria-label="Quién creés que es"
          >
            <option value="">Elegí a quién arriesgás</option>
            {opciones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <button className={styles.btnPrimario} type="submit" disabled={enviando || !elegido}>
            <Icono de={LuSearch} /> {enviando ? "Fijándonos..." : "Arriesgar"}
          </button>
        </form>
      ) : (
        <p className={styles.ayuda}>
          {activo
            ? "Te quedaste sin intentos. Lo vas a saber cuando termine el juego."
            : "El juego terminó: arriba está quién era."}
        </p>
      )}
      {resultado && !acierto && <p className={styles.error}>{resultado}</p>}

      {misIntentos.length > 0 && (
        <ul className={styles.intentos}>
          {misIntentos.map((i) => (
            <li key={i.fecha + i.nombre} className={i.acierto ? styles.chipOk : styles.chipNo}>
              {i.nombre}: {i.acierto ? "sí" : "no"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Novedades({ acepta, hacer }) {
  const [guardando, setGuardando] = useState(false);
  const cambiar = async (e) => {
    setGuardando(true);
    await hacer("novedades", { acepta: e.target.checked });
    setGuardando(false);
  };
  return (
    <label className={styles.check}>
      <input type="checkbox" checked={acepta} onChange={cambiar} disabled={guardando} />
      Quiero recibir novedades y promos de los cursos de WEARESRV
    </label>
  );
}
