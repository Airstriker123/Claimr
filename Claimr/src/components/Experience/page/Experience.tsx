import { useState } from 'react';
import { motion } from 'motion/react';
import {ArrowLeft, Sparkles} from 'lucide-react';
import { SpaceObjectCard } from './objects/SpaceObjectCard';
import { GalacticBackground } from './objects/GalacticBackground';
import { CelestialObjectDetail } from './objects/CelestialObjectDetail';
import { celestialObjects } from './data/celestialObjects.tsx';
import planets from "./data/planets.json"

const spaceObjects = planets

export interface NavigateToLanding
{
  onNavigateToLanding?: () => void;
}

export default function Experience({onNavigateToLanding}: NavigateToLanding)
{
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const handleObjectClick = (objectId: string) => {
    setSelectedObjectId(objectId);
  };

  const handleBack = () => {
    setSelectedObjectId(null);
  };

  const handleNext = () => {
    if (selectedObjectId) {
      const currentIndex = celestialObjects.findIndex(obj => obj.id === selectedObjectId);
      const nextIndex = (currentIndex + 1) % celestialObjects.length;
      setSelectedObjectId(celestialObjects[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    if (selectedObjectId) {
      const currentIndex = celestialObjects.findIndex(obj => obj.id === selectedObjectId);
      const previousIndex = (currentIndex - 1 + celestialObjects.length) % celestialObjects.length;
      setSelectedObjectId(celestialObjects[previousIndex].id);
    }
  };

  // If an object is selected, show detail page
  const selectedObject = celestialObjects.find(obj => obj.id === selectedObjectId);
  if (selectedObject) {
    return (
      <CelestialObjectDetail
        object={selectedObject}
        onBack={handleBack}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  }

  // Otherwise show main experience page
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-linear-to-br from-black via-purple-950 to-black -z-10" />
      
      {/* Secondary gradient overlay for depth */}
      <div className="fixed inset-0 bg-linear-to-t from-purple-900/20 via-transparent to-black/40 -z-10" />
      
      {/* Star field animation */}
      <GalacticBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onNavigateToLanding}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-300 group"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span>Back</span>
            </motion.button>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-white tracking-wide">
                SPACE ATLAS
              </h1>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.div>

            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-purple-200 mb-4 tracking-wider uppercase">
            Choose Your Journey
          </h2>
          <p className="text-purple-300/70 max-w-2xl mx-auto">
            Select a celestial object to explore its mysteries and discover the wonders of our universe
          </p>
        </motion.div>

        {/* Grid of space objects */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {spaceObjects.map((object, index) => (
            <motion.div
              key={object.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + index * 0.1,
                ease: "easeOut",
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
            >
              <SpaceObjectCard
                name={object.name}
                imageUrl={object.imageUrl}
                onClick={() => handleObjectClick(object.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 backdrop-blur-sm bg-black/20 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-purple-400/60">
            <p>© 2026 SPACE ATLAS - Explore the Cosmos</p>
          </div>
        </div>
      </footer>

      {/* Vignette effect */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-black/40 -z-5" />
    </div>
  );
}