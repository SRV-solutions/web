import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CursoGrabado.module.css";
import { CURSOS_GRABADOS, formatearPrecio, linkInscripcion, nombreCurso } from "../../data/cursosGrabados";
import { ESCALERA_PACK } from "../../data/packs";

// ---------- "Sumá a tu compra": lo que le muestra al visitante cuánto ahorra mientras tilda ----------
// Todos los números son reales: salen de los mismos precios que se cobran (src/data/packs.js).

// Un precio que sube o baja de a poco cuando cambia. Quien pide menos movimiento en su sistema lo ve directo.
function useNumeroAnimado(valor, duracion = 550) {
  const [mostrado, setMostrado] = useState(valor);
  const anterior = useRef(valor);

  useEffect(() => {
    const desde = anterior.current;
    anterior.current = valor;
    if (desde === valor) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setMostrado(valor);
      return undefined;
    }
    const inicio = performance.now();
    let cuadro;
    const avanzar = (ahora) => {
      const avance = Math.min((ahora - inicio) / duracion, 1);
      setMostrado(Math.round(desde + (valor - desde) * (1 - (1 - avance) ** 3)));
      if (avance < 1) cuadro = requestAnimationFrame(avanzar);
    };
    cuadro = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, duracion]);

  return mostrado;
}

export function PrecioAnimado({ valor }) {
  return formatearPrecio(useNumeroAnimado(valor));
}

// Los escalones de descuento, encendidos a medida que el pack crece
export function EscaleraPack({ cantidadCursos }) {
  const escalones = [
    ...ESCALERA_PACK.map((descuento, i) => ({ rotulo: `${i + 2}.º curso`, valor: `−${formatearPrecio(descuento)}` })),
    { rotulo: `${ESCALERA_PACK.length + 2}.º o más`, valor: "GRATIS" },
  ];
  return (
    <ol className={styles.escalera}>
      {escalones.map((e, i) => (
        <li key={e.rotulo} className={cantidadCursos >= i + 2 ? styles.escalonActivo : ""}>
          <span>{e.rotulo}</span>
          <strong>{e.valor}</strong>
        </li>
      ))}
    </ol>
  );
}

export function MedidorAhorro({ pack }) {
  const porcentaje = Math.round((pack.ahorro / pack.precioSeparado) * 100);
  return (
    <div className={styles.medidor}>
      <div className={styles.medidorFila}>
        <span>{pack.cantidadCursos} cursos, uno por uno</span>
        <s>{formatearPrecio(pack.precioSeparado)}</s>
      </div>
      <div className={styles.medidorFila}>
        <span>Con tu pack pagás</span>
        <strong>
          <PrecioAnimado valor={pack.precio} />
        </strong>
      </div>
      <div className={styles.medidorAhorro}>
        <span>Ahorrás</span>
        <strong>
          <PrecioAnimado valor={pack.ahorro} />
        </strong>
        <em>{porcentaje}% OFF</em>
      </div>
    </div>
  );
}

// ---------- Secciones opcionales de la página ----------
// Cada una aparece solo si el curso trae sus datos (hoy, el Master en Excel y Sheets con IA y su combo).
// Los demás cursos no cambian.

// Antes de "Ideal para vos si…": cifras, qué abarca el curso y por qué aprenderlo
export function ResumenCurso({ curso }) {
  const { cifras, pilares, dato } = curso;
  if (!cifras && !pilares && !dato) return null;

  return (
    <div className={styles.resumen}>
      {cifras && (
        <ul className={styles.cifras}>
          {cifras.map((c) => (
            <li key={c.rotulo}>
              <strong>{c.valor}</strong>
              <span>{c.rotulo}</span>
            </li>
          ))}
        </ul>
      )}
      {pilares && (
        <div className={styles.pilares}>
          {pilares.map((p) => (
            <div key={p.titulo} className={styles.pilar}>
              <h2>{p.titulo}</h2>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      )}
      {dato && (
        <p className={styles.dato}>
          {dato.texto}{" "}
          <a href={dato.url} target="_blank" rel="noopener noreferrer">
            Fuente: {dato.fuente}
          </a>
          .
        </p>
      )}
    </div>
  );
}

// Después del plan de estudios: novedades, qué se necesita en cada nivel y cómo seguir
export function DetallesCurso({ curso, onElegirCombo, ahorroCombo }) {
  const { novedades, requisitosPorNivel, siguientePaso } = curso;
  if (!novedades && !requisitosPorNivel && !siguientePaso) return null;
  const proximo = siguientePaso?.curso ? CURSOS_GRABADOS[siguientePaso.curso] : null;

  return (
    <>
      {novedades && (
        <div className={styles.novedades}>
          <h2 className={styles.subTitle}>{novedades.titulo}</h2>
          <p className={styles.subTitleDesc}>{novedades.intro}</p>
          <div className={styles.novedadesGrid}>
            {novedades.items.map((n) => (
              <div key={n.titulo} className={styles.novedad}>
                <h3>{n.titulo}</h3>
                <p>{n.texto}</p>
              </div>
            ))}
          </div>
          <p className={styles.novedadesNota}>{novedades.nota}</p>
        </div>
      )}

      {requisitosPorNivel && (
        <div className={styles.requisitos}>
          <h2 className={styles.subTitle}>Qué necesitás en cada nivel</h2>
          <p className={styles.subTitleDesc}>Podés arrancar gratis. Solo los niveles más avanzados de Excel piden una versión de escritorio.</p>
          <dl className={styles.requisitosLista}>
            {requisitosPorNivel.map((r) => (
              <div key={r.nivel} className={styles.requisitoFila}>
                <dt>{r.nivel}</dt>
                <dd>{r.necesitas}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {siguientePaso && (
        <div className={styles.siguientePaso}>
          <div>
            <h2>{siguientePaso.titulo}</h2>
            <p>{siguientePaso.texto}</p>
          </div>
          <div className={styles.siguientePasoAcciones}>
            {proximo && (
              <Link className={styles.btnSiguiente} to={linkInscripcion(proximo)}>
                Ver {nombreCurso(proximo)} · {formatearPrecio(proximo.precio)}
              </Link>
            )}
            {onElegirCombo && (
              <button type="button" className={styles.linkBtn} onClick={onElegirCombo}>
                O llevalos juntos y ahorrá {formatearPrecio(ahorroCombo)}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
