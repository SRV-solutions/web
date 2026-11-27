import React, { useEffect, useState } from "react";
import Seo from "../Seo";
import styles from "./style.module.css";
import { codigoGuardado, tomarCodigoDeLaUrl, vinoDelLink } from "./sesion";
import Inicio from "./Inicio";
import Organizador from "./Organizador";
import Participante from "./Participante";

// Amigo invisible gratis: el organizador arma el grupo, el sorteo llega por mail y cada uno tiene su página
// para mandarle pistas anónimas a quien le regala, contestar las que recibe y adivinar quién es su amigo
// invisible. Todo el juego está en appscript-amigo-invisible.gs; la página le habla a través de
// netlify/functions/amigo-invisible.js (en local, con npm run dev y las variables AMIGO_ en el .env).
//
// Una sola ruta con tres vistas: el inicio (armar un grupo), el panel del organizador (#admin=...) y la
// página de cada participante (#c=...). Los códigos de los links los guarda sesion.js.
function vistaInicial() {
  const delLink = vinoDelLink();
  if (delLink === "c") return "participante";
  if (delLink === "admin") return "organizador";
  if (codigoGuardado("c")) return "participante";
  if (codigoGuardado("admin")) return "organizador";
  return "inicio";
}

export default function AmigoInvisible() {
  const [vista, setVista] = useState(vistaInicial);
  // Cambia cuando llega otro código: la vista se arma de nuevo con el código nuevo
  const [version, setVersion] = useState(0);

  const ir = (destino) => {
    setVista(destino);
    window.scrollTo({ top: 0 });
  };

  // Un link pegado con la página ya abierta solo cambia el #: el navegador no recarga
  useEffect(() => {
    const alCambiar = () => {
      const tipo = tomarCodigoDeLaUrl();
      if (!tipo) return;
      setVersion((v) => v + 1);
      ir(tipo === "c" ? "participante" : "organizador");
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  return (
    <section className={styles.page}>
      <Seo pagina="/amigo-invisible" />
      <div className={styles.inner}>
        {vista === "participante" && <Participante key={version} ir={ir} />}
        {vista === "organizador" && <Organizador key={version} ir={ir} />}
        {vista === "inicio" && <Inicio key={version} ir={ir} />}
      </div>
    </section>
  );
}
