import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, CheckCircle2, Sparkles, Layers, Award, Clock, Layout, ChevronRight } from 'lucide-react';

// --- SPRING CONFIGURATIONS FOR LIQUID PHYSICS ---
const STAGE_SPRING = { stiffness: 100, damping: 25, mass: 1 };
const CARD_SPRING = { stiffness: 180, damping: 20, mass: 1 };

// ============================================================================
// --- HELPER: ISOMETRIC FLOATING FILE / WINDOW CARD ---
// ============================================================================
function IsometricFileCard({ 
  children, 
  className = "", 
  restingZ = 0, 
  hoverZ = 80,
  restingX = 0,
  restingY = 0,
  glowColor = "from-violet-500/30 to-fuchsia-500/30"
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ z: restingZ, x: restingX, y: restingY }}
      animate={{
        z: isHovered ? hoverZ : restingZ,
        scale: isHovered ? 1.05 : 1,
        rotateX: isHovered ? -5 : 0, // Straightens slightly toward camera on hover
        rotateY: isHovered ? 5 : 0,
      }}
      transition={CARD_SPRING}
      style={{ transformStyle: 'preserve-3d' }}
      className={`absolute cursor-pointer select-none group ${className}`}
    >
      {/* Dynamic Ambient Glow Behind Card */}
      <div 
        className={`absolute -inset-2 rounded-[32px] bg-gradient-to-r ${glowColor} blur-xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 -z-10`} 
      />

      {/* Glassmorphic Chassis */}
      <div className="relative w-full h-full rounded-[28px] p-[1.5px] bg-gradient-to-b from-white/25 via-white/10 to-transparent shadow-[0_25px_60px_rgba(10,8,24,0.7)] group-hover:shadow-[0_35px_80px_rgba(147,51,234,0.4)] transition-shadow duration-500">
        <div className="relative w-full h-full rounded-[26.5px] bg-[#120e26]/90 backdrop-blur-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-5 sm:p-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// --- MAIN COMPONENT: HERO 3D ISOMETRIC ECOSYSTEM ---
// ============================================================================
export function Hero3DInteractiveStage() {
  // Global Mouse Tracking for Stage Parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Map Mouse Coordinates to Isometric Stage Tilt
  const stageRotateX = useSpring(useTransform(mouseY, [0, 1], [24, 14]), STAGE_SPRING);
  const stageRotateY = useSpring(useTransform(mouseX, [0, 1], [-14, -24]), STAGE_SPRING);
  const stageRotateZ = useSpring(useTransform(mouseX, [0, 1], [8, 4]), STAGE_SPRING);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1400px' }} 
      className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-visible py-10"
    >
      {/* Ambient Background Nebula Glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-transparent blur-[140px] pointer-events-none" />

      {/* ================================================================= */}
      {/* --- THE ISOMETRIC TILT STAGE --- */}
      {/* ================================================================= */}
      <motion.div
        style={{
          rotateX: stageRotateX,
          rotateY: stageRotateY,
          rotateZ: stageRotateZ,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[340px] sm:w-[480px] md:w-[600px] h-[480px] sm:h-[540px] transition-transform duration-700"
      >
        
        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 1 (BACK LEFT): MAIN APP IDE / WORKSPACE (Resting Z: 0px) */}
        {/* ----------------------------------------------------------------- */}
        <IsometricFileCard 
          restingZ={0} hoverZ={90} restingX={-40} restingY={-30}
          className="w-[300px] sm:w-[380px] h-[260px] sm:h-[300px] top-0 left-0 z-10"
          glowColor="from-indigo-500/30 to-purple-500/30"
        >
          {/* Window Title Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <Layout size={12} className="text-indigo-400" /> StudioEngine.tsx
            </span>
          </div>

          {/* IDE Content Area */}
          <div className="space-y-3 my-auto">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  Re
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">React 19 Canvas</h5>
                  <span className="text-[10px] text-slate-400">Server Actions Active</span>
                </div>
              </div>
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
            </div>

            {/* Mock Code Lines */}
            <div className="space-y-1.5 font-mono text-[10px] bg-black/30 p-3 rounded-xl border border-white/5 text-slate-300">
              <p className="text-fuchsia-400">export default <span className="text-blue-400">function</span> <span className="text-amber-300">Stage</span>() &#123;</p>
              <p className="pl-3 text-emerald-400">const <span className="text-slate-200">physics</span> = useSpring(&#123; mass: <span className="text-orange-400">1</span> &#125;);</p>
              <p className="text-fuchsia-400">&#125;</p>
            </div>
          </div>
        </IsometricFileCard>

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 2 (FRONT LEFT): MOBILE UI PLAYER CARD (Resting Z: 40px) */}
        {/* ----------------------------------------------------------------- */}
        <IsometricFileCard 
          restingZ={40} hoverZ={130} restingX={-20} restingY={180}
          className="w-[260px] sm:w-[300px] h-[200px] sm:h-[220px] bottom-0 left-0 z-20"
          glowColor="from-fuchsia-500/40 to-pink-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-[9px] font-extrabold tracking-widest text-fuchsia-300 uppercase">
              SwiftUI Mobile
            </span>
            <Clock size={14} className="text-slate-400" />
          </div>

          <div className="my-auto space-y-2">
            <h4 className="text-base sm:text-lg font-black text-white leading-tight">
              Liquid Gestures & Animations
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Build spatial interactions for iOS 18 using custom spring curves and glassmorphism.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-md shadow-fuchsia-500/30">
                <Play size={11} className="fill-white stroke-none translate-x-[1px]" />
              </div>
              <span>Watch Lesson</span>
            </div>
            <span className="text-xs font-mono text-slate-400">14:20</span>
          </div>
        </IsometricFileCard>

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 3 (TOP RIGHT): CERTIFICATE BADGE CARD (Resting Z: 60px) */}
        {/* ----------------------------------------------------------------- */}
        <IsometricFileCard 
          restingZ={60} hoverZ={150} restingX={220} restingY={-10}
          className="w-[240px] sm:w-[280px] h-[140px] sm:h-[160px] top-6 right-0 z-30"
          glowColor="from-cyan-500/40 to-blue-500/40"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Award size={20} />
            </div>
            <CheckCircle2 size={18} className="text-cyan-400" />
          </div>

          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-cyan-300 block font-semibold">CERTIFIED ARCHITECT</span>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">Advanced UI Systems</h4>
          </div>
        </IsometricFileCard>

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 4 (BOTTOM RIGHT): COURSE PLAYLIST MODULES (Resting Z: 30px) */}
        {/* ----------------------------------------------------------------- */}
        <IsometricFileCard 
          restingZ={30} hoverZ={110} restingX={180} restingY={160}
          className="w-[260px] sm:w-[320px] h-[220px] sm:h-[260px] bottom-4 right-4 z-20"
          glowColor="from-amber-500/30 to-rose-500/30"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Layers size={14} className="text-amber-400" /> Syllabus Playlist
            </span>
            <span className="text-[10px] font-mono text-slate-400">4 Modules</span>
          </div>

          <div className="divide-y divide-white/5 overflow-hidden my-auto">
            {[
              { title: "1. Intro to Spatial UI", time: "08:15", active: true },
              { title: "2. Glassmorphic Physics", time: "14:30", active: false },
              { title: "3. 3D Parallax Stacking", time: "19:00", active: false },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-colors ${
                  item.active ? 'bg-white/[0.08] text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs truncate">{item.title}</span>
                </div>
                <span className="text-[10px] font-mono shrink-0">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 text-center">
            <span className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1">
              <span>View Full Course Sandbox</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </IsometricFileCard>

      </motion.div>
    </div>
  );
}
export default Hero3DInteractiveStage;