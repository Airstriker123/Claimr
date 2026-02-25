import { useEffect, useRef, useState } from 'react';

interface RotatingGlowCardProps {
  children: React.ReactNode;
  isHovered: boolean;
  borderRadius?: string;
}

export function RotatingGlowCard({ children, isHovered, borderRadius = '1rem' }: RotatingGlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isHovered) return;

    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newAngle = (elapsed / 20) % 360; // Complete rotation every ~7.2 seconds
      setAngle(newAngle);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovered]);

  // Calculate the position of the glow based on angle
  const getGlowPosition = () => {
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate offsets for box-shadow
    const distance = 20; // Distance of the glow from center
    const offsetX = Math.cos(angleRad) * distance;
    const offsetY = Math.sin(angleRad) * distance;
    
    return { offsetX, offsetY };
  };

  const { offsetX, offsetY } = getGlowPosition();

  const glowStyle = isHovered
    ? {
        boxShadow: `
          ${offsetX}px ${offsetY}px 15px 5px rgba(168, 85, 247, 0.8),
          ${-offsetX}px ${-offsetY}px 15px 5px rgba(236, 72, 153, 0.6),
          ${offsetY}px ${-offsetX}px 10px 3px rgba(59, 130, 246, 0.5),
          0 0 60px rgba(168, 85, 247, 0.3),
          inset 0 0 40px rgba(168, 85, 247, 0.1)
        `,
      }
    : {
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 30px rgba(168, 85, 247, 0.05)',
      };

  return (
    <div
      ref={cardRef}
      style={{
        ...glowStyle,
        borderRadius,
        transition: isHovered ? 'none' : 'box-shadow 0.3s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
