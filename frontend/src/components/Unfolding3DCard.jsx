import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Play, ArrowRight, BookOpen, Clock, Code, CheckCircle2, Sparkles } from 'lucide-react';

// --- SPRING PHYSICS CONFIGURATION ---
// High stiffness + low damping creates that snappy, heavy liquid-glass feel
const SPRING_CONFIG = { stiffness: 160, damping: 18, mass: 1 };

export function Unfolding3DCard({ 
  course = {
    title: "Mastering AI Agents & LangGraph",
    category: "AUTONOMOUS SYSTEMS",
    description: "Build production-grade multi-agent workflows and stateful memory loops using structured Python and modern LLMs.",
    modules: 6,
    hours: 10,
    price: "$99",
    glow: "from-violet-500 via-fuchsia-500 to-pink-500"
  } 
}) {
  const [isHovered, setIsHovered] = useState(false);

  // 1. Mouse Tracking Motion Values (Normalized from 0.0 to 1.0)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // 2. Map Cursor Position to 3D Tilt Angles (Tilts up to 14 degrees)
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [14, -14]), SPRING_CONFIG);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), SPRING_CONFIG);

  // 3. Dynamic Cursor-Tracking Spotlight Glare
  const glareX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), SPRING_CONFIG);
  const glareY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), SPRING_CONFIG);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 80%)`;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: '1200px' }} className="w-full h-[460px] select-none font-sans">
      
      {/* Outer Card Chassis with 3D Rotation */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.03, z: 30 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full h-full rounded-[32px] p-[1.5px] bg-gradient-to-b from-white/25 via-white/10 to-transparent shadow-[0_25px_60px_rgba(15,12,32,0.6)] cursor-pointer group transition-shadow duration-500 hover:shadow-[0_35px_80px_rgba(147,51,234,0.35)]"
      >
        {/* Neon Edge Highlight (Fades in on hover) */}
        <div className={`absolute -inset-[1px] rounded-[33px] bg-gradient-to-r ${course.glow} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10`} />

        {/* Translucent Dark Glass Body */}
        <div className="relative w-full h-full rounded-[30.5px] bg-[#120f24]/90 backdrop-blur-2xl p-7 flex flex-col justify-between overflow-hidden border border-white/10">
          
          {/* Mouse-Tracking Glare Overlay */}
          <motion.div
            style={{ background: glareBackground }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 rounded-[30.5px]"
          />

          {/* Ambient Colorful Background Orb */}
          <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br ${course.glow} blur-[60px] pointer-events-none opacity-25 group-hover:opacity-70 group-hover:scale-125 transition-all duration-700`} />

          {/* ================================================================= */}
          {/* --- PLANE 1: TOP META ROW (Z: 20px -> 40px on hover) --- */}
          {/* ================================================================= */}
          <motion.div
            animate={{ z: isHovered ? 40 : 20 }}
            transition={SPRING_CONFIG}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative z-10 flex items-center justify-between"
          >
            <span className="px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-[10px] tracking-widest uppercase font-extrabold text-violet-300 shadow-sm">
              {course.category}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white border border-white/15 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-950">
              <Play size={13} className="fill-current stroke-none translate-x-[1px]" />
            </div>
          </motion.div>

          {/* ================================================================= */}
          {/* --- PLANE 2: THE 3D UNFOLDING MOCKUP STAGE --- */}
          {/* ================================================================= */}
          <div style={{ transformStyle: 'preserve-3d' }} className="relative my-4 flex-1 flex items-center justify-center">
            
            {/* Base Interface Window */}
            <motion.div
              animate={{
                rotateX: isHovered ? 0 : 12,
                rotateY: isHovered ? 0 : -16,
                rotateZ: isHovered ? 0 : 4,
                z: isHovered ? 30 : 0,
                scale: isHovered ? 1.02 : 0.95
              }}
              transition={SPRING_CONFIG}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-[90%] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] shadow-2xl border border-white/10"
            >
              <div className="rounded-[15px] bg-[#181432]/95 backdrop-blur-xl p-4 space-y-3">
                
                {/* Window Header Buttons */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[9px] font-mono font-semibold text-slate-400">App.tsx — {course.title}</span>
                </div>

                {/* Inner Window Content */}
                <div className="h-20 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 p-3.5 text-white flex flex-col justify-between shadow-lg">
                  <span className="text-[8px] uppercase font-black tracking-widest bg-black/20 px-1.5 py-0.5 rounded w-max">COMPONENT</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Glass Surface Physics</span>
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Unfolding Layer A: Floating Code Snippet (Pops out Top-Right) */}
            <motion.div
              animate={{
                x: isHovered ? 20 : 10,
                y: isHovered ? -35 : -10,
                z: isHovered ? 80 : 20,
                rotateX: isHovered ? 0 : 10,
                rotateY: isHovered ? 0 : -10,
                opacity: isHovered ? 1 : 0.85
              }}
              transition={SPRING_CONFIG}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute right-2 top-2 w-56 rounded-xl p-[1px] bg-gradient-to-b from-slate-700 to-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            >
              <div className="rounded-[11px] bg-[#0c1021]/95 backdrop-blur-2xl p-3 font-mono text-[10px] text-slate-200 border border-slate-700/80 leading-relaxed shadow-inner">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Code size={11} /> useSpring.ts
                  </span>
                </div>
                <p className="text-fuchsia-400 font-bold">const <span className="text-blue-400">tilt</span> = useSpring(&#123;</p>
                <p className="pl-3 text-slate-300">stiffness: <span className="text-amber-400">160</span>,</p>
                <p className="pl-3 text-slate-300">damping: <span className="text-amber-400">18</span></p>
                <p className="text-fuchsia-400 font-bold">&#125;);</p>
              </div>
            </motion.div>

            {/* Unfolding Layer B: Floating Status Badge (Pops out Bottom-Left) */}
            <motion.div
              animate={{
                x: isHovered ? -25 : -5,
                y: isHovered ? 40 : 15,
                z: isHovered ? 110 : 30,
                rotateZ: isHovered ? -2 : -6,
                scale: isHovered ? 1.05 : 0.95
              }}
              transition={SPRING_CONFIG}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute left-2 bottom-2 rounded-xl p-3 bg-white/95 backdrop-blur-2xl border border-white shadow-[0_15px_35px_rgba(0,0,0,0.3)] flex items-center gap-2.5 z-30 pointer-events-none text-slate-900"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/30">
                <CheckCircle2 size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block">STATUS</span>
                <span className="text-xs font-black">100% Interactive</span>
              </div>
            </motion.div>

          </div>

          {/* ================================================================= */}
          {/* --- PLANE 3: FOOTER DETAILS (Z: 20px -> 50px on hover) --- */}
          {/* ================================================================= */}
          <motion.div
            animate={{ z: isHovered ? 50 : 20 }}
            transition={SPRING_CONFIG}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative z-10 pt-4 border-t border-white/10 flex flex-col gap-3"
          >
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-300 group-hover:via-fuchsia-300 group-hover:to-pink-300 transition-all duration-300 leading-tight">
                {course.title}
              </h3>
              <p className="text-xs font-light text-slate-400 mt-1 line-clamp-1">
                {course.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} className="text-violet-400" />
                  <span>{course.modules} Modules</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-fuchsia-400" />
                  <span>{course.hours} Hrs</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{course.price}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 transition-all duration-300 shadow-md">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
export default Unfolding3DCard;