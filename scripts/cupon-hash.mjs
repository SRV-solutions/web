#!/usr/bin/env node
// Código de alumnos para un curso con precio especial.
//
//   node scripts/cupon-hash.mjs              -> inventa un código nuevo al azar y muestra su hash
//   node scripts/cupon-hash.mjs MI-CODIGO    -> muestra el hash de un código que ya elegiste
//
// El HASH se guarda en Netlify (Site configuration -> Environment variables) con el nombre que
// figura en "envHash" del curso en netlify/lib/cursos.js (hoy: CUPON_ALUMNOS_FULLSTACK_SHA256)
// y en el .env local para probar con netlify dev. El CÓDIGO se lo das a tus alumnos: no se guarda
// en ningún lado. Para cambiarlo, generás otro y reemplazás el hash en Netlify.
import crypto from "node:crypto";

// Misma normalización que netlify/lib/cupones.js: sin tildes, mayúsculas, solo letras y números
const normalizar = (texto) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
// Sin 0/O ni 1/I: se puede dictar por audio sin confusiones
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const azar = (n) => Array.from(crypto.randomBytes(n), (b) => ALFABETO[b % ALFABETO.length]).join("");

const codigo = process.argv[2] ? process.argv[2].trim() : `SRV-${azar(4)}-${azar(4)}-${azar(4)}`;
const hash = crypto.createHash("sha256").update(normalizar(codigo)).digest("hex");

console.log("");
console.log("Código para tus alumnos (no se guarda en ningún lado):");
console.log(`  ${codigo}`);
console.log("");
console.log("Hash para Netlify y .env (CUPON_ALUMNOS_FULLSTACK_SHA256):");
console.log(`  ${hash}`);
console.log("");
console.log("Se acepta en mayúsculas o minúsculas, con o sin guiones y espacios.");
