import React from 'react';
import { motion } from 'motion/react';

export default function SplitText({
  text = '',
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, y: 30 },
  animationTo = { opacity: 1, y: 0 },
  easing = [0.25, 0.1, 0.25, 1]
}) {
  const words = text.split(' ');

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em]">
          {word.split('').map((char, charIndex) => {
            const index = wordIndex * 5 + charIndex;
            return (
              <motion.span
                key={charIndex}
                initial={animationFrom}
                animate={animationTo}
                transition={{
                  duration: 0.6,
                  delay: (index * delay) / 1000,
                  ease: easing
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
