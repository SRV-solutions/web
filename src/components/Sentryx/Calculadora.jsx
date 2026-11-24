import React, { useState } from "react";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";
import { PRECIOS } from "./contenido";

// Cómo se cobra Sentryx (confirmado por Marcos el 24/11/2026): por usuario por mes, con IVA incluido. Tienen
// usuario el personal, cada adulto de la familia que quiera entrar y los estudiantes de Secundario. Cada usuario
// puede tener su plan, por eso el del personal se elige aparte.
const PLANES = [
  { id: "basico", nombre: "Básico" },
  { id: "ampliadoSinKydo", nombre: "Ampliado sin Kydo" },
  { id: "ampliadoConKydo", nombre: "Ampliado con Kydo" },
  { id: "profesional", nombre: "Profesional" },
  { id: "integral", nombre: "Integral" },
];

const CAMPOS = [
  { id: "inicialPrimario", etiqueta: "Alumnos de Inicial y Primario", ayuda: "Entran sus familias." },
  { id: "secundario", etiqueta: "Alumnos de Secundario", ayuda: "Cada uno tiene su usuario, además de su familia." },
  { id: "personal", etiqueta: "Docentes y personal", ayuda: "Conducción, secretaría, preceptoría y docentes." },
];

const MAXIMO = 20000;
const aNumero = (texto) => Math.min(MAXIMO, Math.max(0, Math.floor(Number(texto)) || 0));
const pesos = (n) => `$${Math.round(n).toLocaleString("es-AR")}`;
const cantidad = (n, uno, varios) => `${n.toLocaleString("es-AR")} ${n === 1 ? uno : varios}`;

export default function Calculadora({ onContacto }) {
  // Los números se guardan como texto para que el campo se pueda vaciar mientras se escribe
  const [valores, setValores] = useState({ inicialPrimario: "280", secundario: "140", personal: "65" });
  const [adultos, setAdultos] = useState(1);
  const [planFamilias, setPlanFamilias] = useState("basico");
  const [planPersonal, setPlanPersonal] = useState("basico");

  const inicialPrimario = aNumero(valores.inicialPrimario);
  const secundario = aNumero(valores.secundario);
  const personal = aNumero(valores.personal);
  const alumnos = inicialPrimario + secundario;
  const familiares = alumnos * adultos;

  const totalFamilias = (familiares + secundario) * PRECIOS[planFamilias];
  const totalPersonal = personal * PRECIOS[planPersonal];
  const total = totalFamilias + totalPersonal;
  const usuarios = familiares + secundario + personal;

  const mensaje =
    `Hola, quiero una demo de Sentryx. Mi colegio tiene ${cantidad(alumnos, "alumno", "alumnos")} y ` +
    `${cantidad(personal, "persona", "personas")} entre docentes y personal. ` +
    `La calculadora me dio ${pesos(total)} por mes.`;

  return (
    <div className={styles.calculadora} id="calculadora">
      <div className={styles.calculadoraEncabezado}>
        <h3 className={styles.calculadoraTitulo}>Calculá cuánto sale para tu colegio</h3>
        <p className={styles.calculadoraBajada}>
          Se paga por usuario: el personal, cada adulto de la familia que quiera entrar y los estudiantes de Secundario.
          Poné los números de tu colegio y mirá el total por mes.
        </p>
      </div>

      <div className={styles.calculadoraCampos}>
        {CAMPOS.map((c) => (
          <div key={c.id} className={styles.campo}>
            <label htmlFor={`calc-${c.id}`}>{c.etiqueta}</label>
            <input
              id={`calc-${c.id}`}
              type="number"
              inputMode="numeric"
              min="0"
              max={MAXIMO}
              step="1"
              value={valores[c.id]}
              onChange={(e) => setValores({ ...valores, [c.id]: e.target.value })}
              aria-describedby={`calc-${c.id}-ayuda`}
            />
            <span id={`calc-${c.id}-ayuda`} className={styles.campoAyuda}>
              {c.ayuda}
            </span>
          </div>
        ))}

        <div className={styles.campo}>
          <span id="calc-adultos-etiqueta">Adultos con usuario por alumno</span>
          <div className={styles.calculadoraSelector} role="group" aria-labelledby="calc-adultos-etiqueta">
            {[1, 2].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={adultos === n}
                className={adultos === n ? styles.calculadoraOpcionActiva : styles.calculadoraOpcion}
                onClick={() => setAdultos(n)}
              >
                {n === 1 ? "Uno" : "Dos"}
              </button>
            ))}
          </div>
          <span className={styles.campoAyuda}>
            Cada familia decide cuántos adultos entran. Los hermanos comparten los mismos usuarios, así que puede ser
            menos.
          </span>
        </div>

        <div className={styles.campo}>
          <label htmlFor="calc-plan-familias">Plan de familias y estudiantes</label>
          <select id="calc-plan-familias" value={planFamilias} onChange={(e) => setPlanFamilias(e.target.value)}>
            {PLANES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · {pesos(PRECIOS[p.id])}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="calc-plan-personal">Plan de docentes y personal</label>
          <select id="calc-plan-personal" value={planPersonal} onChange={(e) => setPlanPersonal(e.target.value)}>
            {PLANES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · {pesos(PRECIOS[p.id])}
              </option>
            ))}
          </select>
          <span className={styles.campoAyuda}>No hace falta el mismo plan para todos.</span>
        </div>
      </div>

      <div className={styles.calculadoraResultado} aria-live="polite">
        <p className={styles.calculadoraRotulo}>Total por mes, con IVA incluido</p>
        <p className={styles.calculadoraTotal}>{pesos(total)}</p>
        {alumnos > 0 && (
          <p className={styles.calculadoraPorAlumno}>
            Repartido entre los alumnos: <strong>{pesos(total / alumnos)}</strong> por alumno por mes.
          </p>
        )}
        <ul className={styles.calculadoraDetalle}>
          <li>
            <span>
              Familias y estudiantes: {cantidad(familiares + secundario, "usuario", "usuarios")} ×{" "}
              {pesos(PRECIOS[planFamilias])}
            </span>
            <strong>{pesos(totalFamilias)}</strong>
          </li>
          <li>
            <span>
              Docentes y personal: {cantidad(personal, "usuario", "usuarios")} × {pesos(PRECIOS[planPersonal])}
            </span>
            <strong>{pesos(totalPersonal)}</strong>
          </li>
        </ul>
        <p className={styles.calculadoraNota}>
          Es una estimación para {cantidad(usuarios, "usuario", "usuarios")}. Cada mes se cobra por los usuarios que
          tienen acceso ese mes.
        </p>
        <a
          href={whatsappLink(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
          onClick={onContacto}
        >
          Pedir una demo con estos números →
        </a>
      </div>
    </div>
  );
}
