import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { motion } from "framer-motion";

export default function TechBackground({ variant = "light" }) {
  const [init, setInit] = useState(false);
  const isDark = variant === "dark";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 180,
          links: {
            opacity: isDark ? 0.5 : 0.35,
            color: isDark ? "#a855f7" : "#6366f1"
          }
        },
      },
    },
    particles: {
      color: {
        value: isDark ? ["#a855f7", "#38bdf8", "#ec4899"] : ["#6366f1", "#9333ea", "#0891b2", "#f43f5e"],
      },
      links: {
        color: isDark ? "#8b5cf6" : "#6366f1",
        distance: 140,
        enable: true,
        opacity: isDark ? 0.22 : 0.15,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.65,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 900,
        },
        value: 45,
      },
      opacity: {
        value: isDark ? 0.5 : 0.35,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1.5, max: 3.5 },
      },
    },
    detectRetina: true,
  }), [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. ANIMATED 3D PERSPECTIVE FLOOR GRID */}
      <div 
        className="absolute -bottom-[25%] -left-[10%] w-[120%] h-[65%] opacity-40 dark:opacity-25 pointer-events-none"
        style={{
          transform: "perspective(1000px) rotateX(72deg)",
          transformOrigin: "bottom center",
          maskImage: "radial-gradient(ellipse at top, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 10%, transparent 75%)"
        }}
      >
        <div className={`w-full h-full ${isDark ? 'bg-tech-grid-dark' : 'bg-tech-grid'}`} />
      </div>

      {/* 2. MORPHING AURORA MESH BLOBS */}
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0], 
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.9, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[10%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[130px] ${
          isDark 
            ? "bg-gradient-to-tr from-indigo-900/40 via-purple-900/30 to-transparent" 
            : "bg-gradient-to-tr from-purple-300/40 via-pink-300/30 to-transparent"
        }`} 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -60, 40, 0], 
          y: [0, 50, -30, 0],
          scale: [1, 0.85, 1.2, 1] 
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute top-[25%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[140px] ${
          isDark 
            ? "bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-transparent" 
            : "bg-gradient-to-br from-indigo-300/40 via-blue-300/30 to-cyan-200/20"
        }`} 
      />

      <motion.div 
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-[20%] left-[20%] w-[800px] h-[500px] rounded-full blur-[150px] ${
          isDark 
            ? "bg-gradient-to-t from-violet-950/50 via-indigo-950/30 to-transparent" 
            : "bg-gradient-to-t from-indigo-200/40 via-purple-200/30 to-transparent"
        }`} 
      />

      {/* 3. INTERACTIVE AI / LANGGRAPH PARTICLE CONSTELLATIONS */}
      {init && (
        <Particles
          id={isDark ? "tech-particles-dark" : "tech-particles-light"}
          options={particlesOptions}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        />
      )}

    </div>
  );
}