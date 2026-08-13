import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

export default function Coursel({ testimonios, interval = 3000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonios.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [testimonios.length, interval]);

  return (
    <div className={styles.carousel}>
      <div
        className={styles.testimonialWrapper}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {testimonios.map((testimonio, index) => (
          <div key={index} className={styles.testimonio}>
            <img
              src={testimonio.image}
              alt={testimonio.user}
              className={styles.image}
            />
            <p className={styles.testimonioText}>
              "{testimonio.testimonio}"
            </p>
            <p className={styles.testimonioUser}>{testimonio.user}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
