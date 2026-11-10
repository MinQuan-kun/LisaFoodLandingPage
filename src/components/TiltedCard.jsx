import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function TiltedCard({
  children,
  className = '',
  rotateAmplitude = 12,
  scaleOnHover = 1.03
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    rotateX.set(-yPct * rotateAmplitude);
    rotateY.set(xPct * rotateAmplitude);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`inline-block w-full ${className}`}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
        className="w-full h-full relative cursor-pointer"
      >
        {children}
      </motion.div>
    </div>
  );
}
