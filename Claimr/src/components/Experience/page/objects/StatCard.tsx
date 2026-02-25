import { motion } from 'motion/react';
import { useState } from 'react';
import { RotatingGlowCard } from './RotatingGlowCard';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RotatingGlowCard isHovered={isHovered} borderRadius="0.5rem">
      <motion.div
        className="relative border border-purple-500/30 rounded-lg bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm p-4 group"
        whileHover={{ scale: 1.03, y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative z-10">
          {/* Icon */}
          {icon && (
            <motion.div 
              className="text-purple-400 mb-2"
              animate={{
                color: isHovered ? 'rgb(216, 180, 254)' : 'rgb(192, 132, 252)',
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {icon}
            </motion.div>
          )}
          
          {/* Label */}
          <motion.div 
            className="text-purple-400/70 mb-1 uppercase tracking-wider"
            animate={{
              color: isHovered ? 'rgba(216, 180, 254, 0.9)' : 'rgba(192, 132, 252, 0.7)',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {label}
          </motion.div>
          
          {/* Value */}
          <motion.div 
            className="text-purple-100"
            animate={{
              color: isHovered ? 'rgb(250, 245, 255)' : 'rgb(243, 232, 255)',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {value}
          </motion.div>
        </div>

        {/* Decorative corner */}
        <motion.div 
          className="absolute top-1 right-1 w-4 h-4 border-t border-r border-purple-400/30"
          animate={{
            borderColor: isHovered ? 'rgba(216, 180, 254, 0.7)' : 'rgba(192, 132, 252, 0.3)',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        
        {/* Inner glow effect */}
        <motion.div 
          className="absolute inset-0 bg-purple-500/0 rounded-lg pointer-events-none"
          animate={{
            backgroundColor: isHovered ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0)',
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.div>
    </RotatingGlowCard>
  );
}