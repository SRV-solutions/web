import React, { useMemo, useState, useEffect } from "react";
import styles from "../style.module.css";
import { randInt, pick } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

const ROWS = 3;
const COLS = 4;
// Bits de conexión: N=1, E=2, S=4, W=8
const DIRS = [
  { bit: 1, dr: -1, dc: 0, opp: 4 },
  { bit: 2, dr: 0, dc: 1, opp: 8 },
  { bit: 4, dr: 1, dc: 0, opp: 1 },
  { bit: 8, dr: 0, dc: -1, opp: 2 },
];

const rotate = (m) => ((m << 1) | (m >> 3)) & 15;
const rotateN = (m, n) => {
  let r = m;
  for (let i = 0; i < n; i++) r = rotate(r);
  return r;
};

function connected(grid, entryRow) {
  const seen = new Set();
  if (!(grid[entryRow][0] & 8)) return seen;
  const stack = [[entryRow, 0]];
  seen.add(`${entryRow},0`);
  while (stack.length) {
    const [r, c] = stack.pop();
    for (const d of DIRS) {
      if (!(grid[r][c] & d.bit)) continue;
      const nr = r + d.dr;
      const nc = c + d.dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      const key = `${nr},${nc}`;
      if (seen.has(key) || !(grid[nr][nc] & d.opp)) continue;
      seen.add(key);
      stack.push([nr, nc]);
    }
  }
  return seen;
}

const isSolved = (grid, entryRow, exitRow) =>
  connected(grid, entryRow).has(`${exitRow},${COLS - 1}`) && (grid[exitRow][COLS - 1] & 2) !== 0;

// Genera un camino aleatorio de izquierda a derecha y lo desordena
function generate() {
  const solution = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const visited = new Set();
  const entryRow = randInt(0, ROWS - 1);
  let r = entryRow;
  let c = 0;
  let from = 8;
  visited.add(`${r},${c}`);
  for (;;) {
    const vertical = [];
    if (r > 0 && !visited.has(`${r - 1},${c}`)) vertical.push({ bit: 1, dr: -1 });
    if (r < ROWS - 1 && !visited.has(`${r + 1},${c}`)) vertical.push({ bit: 4, dr: 1 });
    if (vertical.length && Math.random() < 0.35) {
      const v = pick(vertical);
      solution[r][c] = from | v.bit;
      r += v.dr;
      from = v.bit === 1 ? 4 : 1;
    } else {
      solution[r][c] = from | 2;
      if (c === COLS - 1) break;
      c += 1;
      from = 8;
    }
    visited.add(`${r},${c}`);
  }
  const exitRow = r;

  let grid;
  do {
    grid = solution.map((row) =>
      row.map((m) => rotateN(m || pick([5, 3]), randInt(0, 3)))
    );
  } while (isSolved(grid, entryRow, exitRow));
  return { grid, entryRow, exitRow };
}

function Tile({ mask, lit }) {
  const color = lit ? "#f6950a" : "#4b5563";
  const ends = { 1: [50, 0], 2: [100, 50], 4: [50, 100], 8: [0, 50] };
  return (
    <svg viewBox="0 0 100 100" className={styles.pipeSvg} aria-hidden="true">
      {Object.entries(ends).map(([bit, [x, y]]) =>
        mask & Number(bit) ? (
          <line key={bit} x1="50" y1="50" x2={x} y2={y} stroke={color} strokeWidth="20" strokeLinecap="round" />
        ) : null
      )}
      <circle cx="50" cy="50" r="12" fill={color} />
    </svg>
  );
}

export default function QueryMaster({ timeMult, onFinish }) {
  const total = 45 * timeMult;
  const finishOnce = useFinishOnce(onFinish);
  const initial = useMemo(() => generate(), []);
  const [grid, setGrid] = useState(initial.grid);
  const [won, setWon] = useState(false);
  const left = useCountdown(total, !won, () => finishOnce(false));
  const lit = connected(grid, initial.entryRow);

  useEffect(() => {
    if (!won && isSolved(grid, initial.entryRow, initial.exitRow)) {
      setWon(true);
      setTimeout(() => finishOnce(true), 700);
    }
  }, [grid, initial, won, finishOnce]);

  const spin = (r, c) => {
    if (won) return;
    setGrid((g) => g.map((row, ri) => row.map((m, ci) => (ri === r && ci === c ? rotate(m) : m))));
  };

  const leak = Math.round(100 - (left / total) * 100);

  return (
    <div>
      <TimerBar left={left} total={total} label={`Memory leak: ${leak}% de RAM`} />
      <div className={styles.pipeBoard}>
        <div className={styles.pipeSide}>
          {Array.from({ length: ROWS }, (_, r) => (
            <span key={r} className={styles.pipeLabel}>
              {r === initial.entryRow ? "API ▶" : ""}
            </span>
          ))}
        </div>
        <div className={styles.pipeGrid} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((m, c) => (
              <button
                type="button"
                key={`${r}-${c}`}
                className={styles.pipeCell}
                onClick={() => spin(r, c)}
                aria-label={`Rotar tubería ${r + 1}-${c + 1}`}
              >
                <Tile mask={m} lit={lit.has(`${r},${c}`)} />
              </button>
            ))
          )}
        </div>
        <div className={styles.pipeSide}>
          {Array.from({ length: ROWS }, (_, r) => (
            <span key={r} className={styles.pipeLabel}>
              {r === initial.exitRow ? "▶ DB" : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
