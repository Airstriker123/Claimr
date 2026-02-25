import { motion } from 'motion/react';
import { useState } from 'react';
import { RotatingGlowCard } from './RotatingGlowCard';

interface SpaceObjectCardProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
}

export function SpaceObjectCard({ name, imageUrl, onClick }: SpaceObjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RotatingGlowCard isHovered={isHovered} borderRadius="1rem">
      <motion.button
        className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-black/60 backdrop-blur-sm cursor-pointer w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Enhanced glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-purple-500/20 to-transparent pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        
        {/* Image container */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <motion.img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* Title */}
        <div className="relative p-6">
          <motion.h3 
            className="text-white tracking-wider uppercase"
            animate={{
              color: isHovered ? 'rgb(216, 180, 254)' : 'rgb(255, 255, 255)',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {name}
          </motion.h3>
          
          {/* Decorative line */}
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-purple-500 to-transparent mt-3"
            animate={{ 
              width: isHovered ? '100%' : '30%',
              boxShadow: isHovered ? '0 0 10px rgba(168, 85, 247, 0.8)' : 'none',
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Corner accent */}
        <motion.div 
          className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-purple-400/50"
          animate={{
            borderColor: isHovered ? 'rgba(216, 180, 254, 0.8)' : 'rgba(192, 132, 252, 0.5)',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-purple-400/50"
          animate={{
            borderColor: isHovered ? 'rgba(216, 180, 254, 0.8)' : 'rgba(192, 132, 252, 0.5)',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.button>
    </RotatingGlowCard>
  );
}