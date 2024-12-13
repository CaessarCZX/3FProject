import React, { useEffect, useState } from "react";

interface RotatingPhrasesProps {
  phrases: string[];
  interval?: number;
  transitionDuration?: number;
}

const RotatingPhrases: React.FC<RotatingPhrasesProps> = ({
  phrases,
  interval = 3000, // Tiempo entre cambios (3 segundos por defecto)
  transitionDuration = 500, // Duración de la transición fade (0.5 segundos)
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Primero desvanecemos la frase actual
      setIsVisible(false);

      // Después de la transición, cambiamos la frase y la hacemos visible
      setTimeout(() => {
        setCurrentPhraseIndex(prevIndex => (prevIndex + 1) % phrases.length);
        setIsVisible(true);
      }, transitionDuration);
    }, interval);

    return () => clearInterval(timer);
  }, [phrases, interval, transitionDuration]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
      }}
    >
      {phrases[currentPhraseIndex]}
    </div>
  );
};

export default RotatingPhrases;
