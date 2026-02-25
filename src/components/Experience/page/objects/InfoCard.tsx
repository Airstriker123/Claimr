import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { RotatingGlowCard } from './RotatingGlowCard';

interface InfoCardProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export function InfoCard({ title, content, defaultOpen = false }: InfoCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RotatingGlowCard isHovered={isHovered} borderRadius="0.75rem">
      <motion.div
        className="border border-purple-500/30 rounded-xl bg-black/40 backdrop-blur-sm overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-purple-900/20 transition-colors duration-300 group relative z-10"
        >
          <motion.h3 
            className="text-purple-200"
            animate={{
              color: isHovered ? 'rgb(233, 213, 255)' : 'rgb(233, 213, 255)',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {title}
          </motion.h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-4 text-purple-300/80 relative z-10">
            {content}
          </div>
        </motion.div>

        {/* Subtle glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.div>
    </RotatingGlowCard>
  );
}