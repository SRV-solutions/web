import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icono from "../Icono";
import { LuArrowLeft, LuCircleCheck, LuLightbulb, LuMail, LuSearch, LuUsers } from "react-icons/lu";
import styles from "./style.module.css";
import CrearGrupo from "./CrearGrupo";
import { codigoGuardado } from "./sesion";
import { llamar, mensajeDe } from "./api";
import { INTENTOS_MAX, MAX_PARTICIPANTES, MIN_PARTICIPANTES, PISTAS_MAX } from "./reglas";

export default function Inicio({ ir }) {
  const tieneJuego = Boolean(codigoGuardado("c"));
  const tienePanel = Boolean(codigoGuardado("admin"));

  return (
    <>
      {(tieneJuego || tienePanel) && (
        <div className={styles.volver}>
          {tieneJuego && (
            <button type="button" className={styles.btnLink} onClick={() => ir("participante")}>
              <Icono de={LuArrowLeft} /> Volver a mi página del juego
            </button>
          )}
          {tienePanel && (
            <button type="button" className={styles.btnLink} onClick={() => ir("organizador")}>
              <Icono de={LuArrowLeft} /> Volver al panel del organizador
            </button>
          )}
        </div>
      )}

      <p className={styles.kicker}>Gratis · Sin registrarse · Con pistas anónimas</p>
      <h1 className={styles.title}>
        Amigo invisible <span className={styles.orange}>online</span>
      </h1>
      <p className={styles.lead}>
        Cargá a los que participan y nosotros hacemos el sorteo: a cada uno le llega un mail con a quién le regala.
        Después, cada uno le puede mandar hasta {PISTAS_MAX} pistas anónimas a quien le tocó, que se las puede
        contestar, y todos tratan de adivinar quién es su amigo invisible.
      </p>

      <ol className={styles.pasos}>
        <li className={styles.paso}>
          <Icono de={LuUsers} className={styles.pasoIcono} />
          <h2>Armá el grupo</h2>
          <p>Nombre, fecha del intercambio, presupuesto y el mail de cada uno. Te llega un mail para confirmar.</p>
        </li>
        <li className={styles.paso}>
          <Icono de={LuMail} className={styles.pasoIcono} />
          <h2>Sorteo por mail</h2>
          <p>A cada uno le llega a quién le regala y el link a su página. Ni el organizador sabe a quién le tocó quién.</p>
        </li>
        <li className={styles.paso}>
          <Icono de={LuLightbulb} className={styles.pasoIcono} />
          <h2>Pistas anónimas</h2>
          <p>
            Cada uno tiene {PISTAS_MAX} pistas para todo el juego. Quien las recibe las puede contestar sin saber de
            quién vienen.
          </p>
        </li>
        <li className={styles.paso}>
          <Icono de={LuSearch} className={styles.pasoIcono} />
          <h2>Adiviná quién es</h2>
          <p>
            Tenés {INTENTOS_MAX} intentos para descubrir a tu amigo invisible. El día después del intercambio, a todos
            les llega cómo quedó el sorteo.
          </p>
        </li>
      </ol>

      <CrearGrupo />

      <Reenviar />

      <div className={styles.preguntas}>
        <h2>Preguntas frecuentes</h2>
        <details>
          <summary>¿Hay que crear una cuenta?</summary>
          <p>
            No. A cada uno le llega por mail un link que es solo suyo y con eso entra a su página. Si lo pierde, lo
            pide de nuevo con su mail en «¿Perdiste tu link?».
          </p>
        </details>
        <details>
          <summary>¿El organizador ve quién le regala a quién?</summary>
          <p>
            No. Desde su panel ve quién ya entró a su página y le puede reenviar el mail a quien no lo encuentre, pero
            el sorteo es secreto para todos hasta el final.
          </p>
        </details>
        <details>
          <summary>¿Cuántas pistas se pueden mandar?</summary>
          <p>
            {PISTAS_MAX} por persona en todo el juego, no por día: conviene guardarlas. Cada pista se puede contestar
            una vez.
          </p>
        </details>
        <details>
          <summary>¿Cuántos pueden participar?</summary>
          <p>
            De {MIN_PARTICIPANTES} a {MAX_PARTICIPANTES} personas, contando al organizador si también juega. Cada uno
            necesita su propio mail.
          </p>
        </details>
        <details>
          <summary>¿Qué pasa con los mails?</summary>
          <p>
            Los usamos para el juego y quedan registrados en WEARESRV. Solo le mandamos novedades a quien lo pide
            tildando la casilla. Más detalles en la <Link to="/privacidad">política de privacidad</Link>.
          </p>
        </details>
      </div>

      <p className={styles.firma}>
        Amigo Invisible SRV es gratis y lo hace <Link to="/">WEARESRV</Link>, donde enseñamos programación, IA y
        Excel.
      </p>
    </>
  );
}

// "Perdí el mail": le manda a esa dirección todos sus links (de participante y de organizador)
function Reenviar() {
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | listo | error
  const [error, setError] = useState("");

  const pedir = async (e) => {
    e.preventDefault();
    const mail = new FormData(e.target).get("mail");
    setEnvio("enviando");
    const r = await llamar("reenviar", { mail });
    if (r.status === "ok") {
      setEnvio("listo");
      return;
    }
    setError(r.status === "datos_invalidos" ? "Revisá el mail: parece que tiene un error." : mensajeDe(r.status));
    setEnvio("error");
  };

  return (
    <div className={styles.panel} id="perdi-mi-link">
      <h2 className={styles.panelTitulo}>¿Perdiste tu link?</h2>
      {envio === "listo" ? (
        <p className={styles.ok}>
          <Icono de={LuCircleCheck} /> Si ese mail está en algún amigo invisible, te llega en unos minutos un mail con
          tus links. Revisá también el spam.
        </p>
      ) : (
        <form className={styles.formLinea} onSubmit={pedir}>
          <p className={styles.ayuda}>Escribí tu mail y te mandamos de nuevo el link a tu página o a tu panel de organizador.</p>
          <input className={styles.campo} type="email" name="mail" placeholder="Tu mail" required autoComplete="email" aria-label="Tu mail" />
          <button className={styles.btnSecundario} type="submit" disabled={envio === "enviando"}>
            {envio === "enviando" ? "Enviando..." : "Mandarme mis links"}
          </button>
          {envio === "error" && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
}
