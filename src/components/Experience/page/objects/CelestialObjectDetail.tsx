import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { InfoCard } from './InfoCard';
import { StatCard } from './StatCard';
import { GalacticBackground } from './GalacticBackground';
import type {CelestialObject} from '../data/celestialObjects.tsx';
import HeroPlanet from "../../../models/Earth.tsx";
import Jupiter from "../../../models/Jupiter.tsx";
import Star from "../../../models/Star.tsx";
import Galaxy from "../../../models/Galaxy.tsx";
import NeutronStar from "../../../models/NeutronStar.tsx";
import Blackhole from "../../../models/Blackhole.tsx";



interface CelestialObjectDetailProps {
  object: CelestialObject;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function CelestialObjectDetail({ 
  object, 
  onBack, 
  onNext, 
  onPrevious 
}: CelestialObjectDetailProps)
{

  const PlanetViewer = () => {
    switch (object.id) {
      case 'earth':
        return <HeroPlanet
            control={true}
        />
      case 'jupiter':
        return <Jupiter/>
      case 'stars':
        return <Star/>
      case 'galaxies':
        return <Galaxy/>
      case 'neutron-stars':
          return <NeutronStar/>
      case 'black-holes':
        return <Blackhole/>
      default:
        return (
            <>
              error 404 - invalid request in systems
            </>
        )
    }
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Galactic Background */}
      <GalacticBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-300 group"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
              <span>Back to Experience</span>
            </motion.button>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h1 className="text-white tracking-wide">SPACE ATLAS</h1>
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.div>

            <div className="w-40" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Object title and tagline */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-white mb-2 tracking-wider uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {object.name}
          </motion.h2>
          <p className="text-purple-300">
            {object.tagline}
          </p>
        </motion.div>

        {/* Main layout: 3D display and info panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
          {/* 3D Display / Main visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-black/40 backdrop-blur-sm">
              {/* Main  OBJECT */}
              <div className="w-full h-screen">
                {PlanetViewer()}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-purple-400/50 rounded-tl-2xl" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-purple-400/50 rounded-br-2xl" />
          </motion.div>

          {/* Info panels */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Description */}
            <motion.div 
              className="border border-purple-500/30 rounded-xl bg-black/40 backdrop-blur-sm p-6"
              whileHover={{ 
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.1)',
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                boxShadow: '0 0 15px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.05)',
              }}
            >
              <h3 className="text-purple-200 mb-3">Overview</h3>
              <p className="text-purple-300/80 leading-relaxed">
                {object.description}
              </p>
            </motion.div>

            {/* Expandable fact cards */}
            <div className="space-y-4">
              {object.facts.map((fact, index) => (
                <InfoCard
                  key={fact.title}
                  title={fact.title}
                  content={fact.content}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-purple-200 mb-6 text-center">Key Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {object.stats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {onPrevious && (
            <motion.button
              onClick={onPrevious}
              className="flex items-center gap-2 px-6 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 hover:bg-purple-900/50 hover:border-purple-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </motion.button>
          )}
          
          {onNext && (
            <motion.button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 hover:bg-purple-900/50 hover:border-purple-400/50 transition-all duration-300"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Decorative blur elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 backdrop-blur-sm bg-black/20 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-purple-400/60">
            <p>© 2026 SPACE ATLAS - Explore the Cosmos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}