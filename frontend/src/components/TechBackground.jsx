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
            opacity: isDark ? 0.5 : 0.15,
            color: isDark ? "#a855f7" : "#b6004f"
          }
        },
      },
    },
    particles: {
      color: {
        value: isDark ? ["#a855f7", "#38bdf8", "#ec4899"] : ["#b6004f", "#006852", "#6b5b00"],
      },
      links: {
        color: isDark ? "#8b5cf6" : "#b6004f",
        distance: 140,
        enable: true,
        opacity: isDark ? 0.22 : 0.05,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.45,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 900,
        },
        value: 30,
      },
      opacity: {
        value: isDark ? 0.5 : 0.2,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
    },
    detectRetina: true,
  }), [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. ANIMATED 3D PERSPECTIVE FLOOR GRID */}
      <div 
        className="absolute -bottom-[25%] -left-[10%] w-[120%] h-[65%] opacity-10 dark:opacity-20 pointer-events-none"
        style={{
          transform: "perspective(1000px) rotateX(72deg)",
          transformOrigin: "bottom center",
          maskImage: "radial-gradient(ellipse at top, black 5%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 5%, transparent 60%)"
        }}
      >
        <div className={`w-full h-full ${isDark ? 'bg-tech-grid-dark' : 'bg-tech-grid'}`} />
      </div>

      {/* 2. MORPHING AURORA MESH BLOBS */}
      <motion.div 
        animate={{ 
          x: [0, 40, -20, 0], 
          y: [0, -30, 15, 0],
          scale: [1, 1.1, 0.95, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[10%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] ${
          isDark 
            ? "bg-gradient-to-tr from-indigo-900/40 via-purple-900/30 to-transparent" 
            : "bg-gradient-to-tr from-primary-container/10 via-surface-container-low/20 to-transparent"
        }`} 
      />
      
      <motion.div 
        animate={{ 
          x: [0, -40, 30, 0], 
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1] 
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[140px] ${
          isDark 
            ? "bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-transparent" 
            : "bg-gradient-to-br from-primary-container/10 via-surface-container-low/20 to-transparent"
        }`} 
      />

      <motion.div 
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-[20%] left-[20%] w-[800px] h-[500px] rounded-full blur-[150px] ${
          isDark 
            ? "bg-gradient-to-t from-violet-950/50 via-indigo-950/30 to-transparent" 
            : "bg-gradient-to-t from-primary-container/10 via-surface-container-low/20 to-transparent"
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