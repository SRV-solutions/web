import styles from './style.module.css';

const CopyPrincipal = () => {
  const textoCompleto = `Ellos también dudaron al principio. Se preguntaron si realmente podían lograrlo, si tenían lo necesario para dar el salto y cambiar sus vidas. Hoy, esas dudas quedaron atrás. Con SRV, no solo aprendieron nuevas habilidades, también descubrieron su verdadero potencial, y ahora están viviendo las oportunidades que antes parecían imposibles.
  Como [Nombre del Testimonio], que desde su casa en Buenos Aires aprendió Backend y en menos de seis meses consiguió su primer cliente internacional. O [Nombre del Testimonio], que combinó sus nuevas habilidades técnicas con su pasión por la creatividad y lanzó una startup que ya está transformando la vida de cientos de personas.
  Estas historias no son excepcionales, son pruebas de lo que sucede cuando unimos las herramientas correctas con las ganas de crecer. Y lo mejor es que no importa de dónde vengas, qué edad tengas o cuánta experiencia previa poseas: en SRV creemos que todos tienen el potencial para alcanzar resultados extraordinarios. Porque no se trata de dónde estás hoy, sino de dónde querés llegar mañana.
  Vos podés ser el próximo. Con nuestras herramientas, podés aprender a tu ritmo, desde cualquier lugar del mundo, y empezar a construir el futuro que siempre soñaste. No es un camino fácil, pero quienes están aquí saben que vale la pena.
  Leé sus historias, inspirate y animate a escribir la tuya. Hoy puede ser el día en que tu vida cambie para siempre.`;

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p>{textoCompleto}</p>
      </div>
    </div>
  );
};

export default CopyPrincipal;
