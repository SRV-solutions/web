import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { COURSES, CAFECITO_URL, INSTAGRAM_HANDLE, MINIGAME_COURSE, recommendCourse, track } from "./promo";
import { createShareImage, shareText, gameUrl } from "./share";

// ---------- Compartir ----------
export function SharePanel({ game }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let url = null;
    let alive = true;
    createShareImage(game).then((blob) => {
      if (!alive || !blob) return;
      url = URL.createObjectURL(blob);
      setImg({ blob, url });
    });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [game]);

  const text = shareText(game);
  const file = img ? new File([img.blob], "el-develop.png", { type: "image/png" }) : null;
  const canShareFile = !!file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] });

  const shareNative = async () => {
    try {
      await navigator.share({ files: [file], text, title: "El Develop" });
      track("GameShare", { method: "native" });
    } catch {
      // El usuario canceló
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("✔ Texto y link copiados");
    } catch {
      setStatus(gameUrl());
    }
    track("GameShare", { method: "copy" });
  };

  return (
    <div className={styles.share}>
      <div className={styles.sharePreview}>
        {img ? <img src={img.url} alt="Tarjeta para compartir tu partida de El Develop" /> : <span className={styles.muted}>Generando imagen…</span>}
      </div>
      <div className={styles.shareActions}>
        <h3 className={styles.subtitle}>📸 Compartí tu partida</h3>
        <p className={styles.muted}>
          La imagen está en formato historia: ideal para estados de WhatsApp, historias de Instagram y TikTok. ¡Etiquetanos{" "}
          {INSTAGRAM_HANDLE}!
        </p>
        {canShareFile && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={shareNative}>
            📲 Compartir (WhatsApp, Instagram, TikTok…)
          </button>
        )}
        <a
          className={`${styles.btn} ${canShareFile ? "" : styles.btnPrimary} ${!img ? styles.btnDisabled : ""}`}
          href={img?.url}
          download="el-develop.png"
          onClick={() => track("GameShare", { method: "download" })}
        >
          ⬇️ Descargar imagen
        </a>
        <a
          className={`${styles.btn} ${styles.btnWhatsapp}`}
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("GameShare", { method: "whatsapp" })}
        >
          💬 Mandar por WhatsApp
        </a>
        <button type="button" className={styles.btn} onClick={copyLink}>
          🔗 Copiar link
        </button>
        {status && <p className={styles.muted}>{status}</p>}
        <p className={styles.muted}>
          Para Instagram o TikTok desde la compu: descargá la imagen, pasala al celu y subila a tu historia.
        </p>
      </div>
    </div>
  );
}

export function ShareModal({ game, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Compartir partida">
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <SharePanel game={game} />
      </div>
    </div>
  );
}

// ---------- Cursos ----------
function CourseLink({ courseKey, highlight, source }) {
  const c = COURSES[courseKey];
  return (
    <a
      href={c.to}
      target="_blank"
      rel="noopener"
      className={`${styles.course} ${highlight ? styles.courseHighlight : ""}`}
      onClick={() => track("GameCourseClick", { course: courseKey, source })}
    >
      <span className={styles.courseIcon}>{c.icon}</span>
      <span>
        <strong>{c.name}</strong>
        <span className={styles.muted}>{c.pitch}</span>
      </span>
      <span className={styles.courseArrow}>→</span>
    </a>
  );
}

// Tip corto después de perder un minijuego
export function MinigameCourseTip({ gameId }) {
  const key = MINIGAME_COURSE[gameId];
  if (!key) return null;
  return (
    <div className={styles.courseTip}>
      <p className={styles.kicker}>💡 Tip de la vida real</p>
      <p className={styles.muted}>Esto en el laburo de verdad se aprende practicando. Lo vemos paso a paso en:</p>
      <CourseLink courseKey={key} highlight source={`minigame-${gameId}`} />
    </div>
  );
}

// Bloque con todos los cursos (hub y final)
export function CoursesBlock({ game, title, source }) {
  const rec = recommendCourse(game);
  const keys = [rec, ...Object.keys(COURSES).filter((k) => k !== rec)];
  return (
    <div className={styles.courses}>
      <p className={styles.kicker}>Subí tus stats en la vida real</p>
      <h3 className={styles.subtitle}>{title}</h3>
      <div className={styles.courseGrid}>
        {keys.map((k) => (
          <CourseLink key={k} courseKey={k} highlight={k === rec} source={source} />
        ))}
      </div>
    </div>
  );
}

// ---------- Cafecito ----------
export function CafecitoButton({ compact = false }) {
  if (!CAFECITO_URL) return null;
  return (
    <a
      href={CAFECITO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.cafecito} ${compact ? styles.cafecitoCompact : ""}`}
      onClick={() => track("GameDonateClick")}
    >
      <span className={styles.cafecitoIcon}>☕</span>
      <span>
        <strong>¿Te gustó El Develop? Invitame un cafecito</strong>
        {!compact && <span className={styles.muted}>Así seguimos sumando eventos, minijuegos y chistes de Capa 8.</span>}
      </span>
    </a>
  );
}
