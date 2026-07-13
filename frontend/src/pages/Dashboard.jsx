import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { courseData } from '../data/mockCourse';
import { 
  Clock, 
  HelpCircle, 
  Briefcase,
  FileText,
  Award,
  CheckCircle2,
  Play,
  BookOpen
} from 'lucide-react';

const MODULE_COLORS = [
  { iconColor: 'text-violet-600', iconBg: 'bg-violet-500', image: 'bg-violet-950', glow: 'shadow-violet-500/20' },
  { iconColor: 'text-cyan-600', iconBg: 'bg-cyan-500', image: 'bg-cyan-950', glow: 'shadow-cyan-500/20' },
  { iconColor: 'text-blue-600', iconBg: 'bg-blue-500', image: 'bg-blue-950', glow: 'shadow-blue-500/20' },
  { iconColor: 'text-amber-600', iconBg: 'bg-amber-500', image: 'bg-amber-950', glow: 'shadow-amber-500/20' },
];

// --- NEW: Interactive 3D Holographic Brain/Core SVG ---
function HolographicAICore() {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none hidden sm:flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-700">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_25s_linear_infinite]">
        <defs>
          <radialGradient id="holoGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Background Glow */}
        <circle cx="100" cy="100" r="80" fill="url(#holoGrad)" />
        {/* Wireframe Polyhedron Nodes */}
        <polygon points="100,20 170,70 140,160 60,160 30,70" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        <polygon points="100,180 30,130 60,40 140,40 170,130" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
        {/* Inner Core Rings */}
        <circle cx="100" cy="100" r="45" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="20 10" />
        <circle cx="100" cy="100" r="25" fill="#6366f1" className="animate-pulse" opacity="0.7" />
        {/* Connecting Data Dots */}
        <circle cx="100" cy="20" r="4" fill="#38bdf8" />
        <circle cx="170" cy="70" r="4" fill="#38bdf8" />
        <circle cx="140" cy="160" r="4" fill="#38bdf8" />
        <circle cx="60" cy="160" r="4" fill="#38bdf8" />
        <circle cx="30" cy="70" r="4" fill="#38bdf8" />
      </svg>
    </div>
  );
}

function CircularDial({ value, max = 100, label, icon: Icon, color, glowClass, unit = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group relative overflow-hidden">
      {/* NEW: Subtle Ambient Grid behind Dials */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f115_1px,transparent_1px)] [background-size:12px_12px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className={`relative w-24 h-24 flex items-center justify-center shrink-0 ${glowClass}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-slate-100 stroke-current"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className={`${color} stroke-current`}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Icon size={18} className={color} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900 tracking-tight">
            {displayValue}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
        </div>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mt-0.5 truncate">
          {label}
        </p>
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function SkeletonShimmer() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 border border-slate-200 rounded-3xl p-5 h-32 relative overflow-hidden flex items-center gap-4">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-shimmer" />
            <div className="w-20 h-20 rounded-full bg-slate-200/70 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="w-3/4 h-6 bg-slate-200/70 rounded-lg" />
              <div className="w-1/2 h-3 bg-slate-200/70 rounded-md" />
              <div className="w-full h-2 bg-slate-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white/80 border border-slate-200 rounded-3xl p-10 h-64 relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer" />
        <div className="w-16 h-16 rounded-2xl bg-slate-200/70" />
        <div className="w-64 h-6 bg-slate-200/70 rounded-lg" />
        <div className="w-96 h-4 bg-slate-100 rounded-md" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const tabs = ['Overview', 'Enrollments', 'Certificates'];
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 600);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#9333ea', '#06b6d4', '#ec4899']
    });
  };

  return (
    <div className="relative min-h-screen text-slate-900 pb-20 font-sans select-none z-10 overflow-hidden">
      <main className="relative max-w-7xl mx-auto px-6 pt-32 z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 drop-shadow-sm">
              Welcome back, {user?.name || 'Developer'}!
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-8 border-b border-slate-200 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabSwitch(tab)}
              className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isTabLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonShimmer />
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'Overview' && (
                <>
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Curriculum Telemetry</h2>
                        <p className="text-sm font-bold text-slate-400">Real-time completion metrics across your active sandboxes</p>
                      </div>
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Live Sync Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <CircularDial value={24} max={50} label="Learning Hours" unit="hrs" icon={Clock} color="text-blue-600" glowClass="dial-glow-blue" />
                      <CircularDial value={18} max={30} label="Concepts Mastered" icon={FileText} color="text-emerald-600" glowClass="dial-glow-green" />
                      <CircularDial value={12} max={20} label="Lessons Complete" icon={Briefcase} color="text-orange-500" glowClass="dial-glow-orange" />
                      <CircularDial value={4} max={5} label="Projects Built" icon={Award} color="text-purple-600" glowClass="dial-glow-purple" />
                    </div>
                  </div>

                  {/* Hero Banner & Help Center with 3D Core */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-[32px] p-10 sm:p-14 flex flex-col justify-between relative overflow-hidden shadow-xl group">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />
                      
                      {/* NEW: Interactive Holographic AI Core */}
                      <HolographicAICore />

                      <div className="relative z-10 max-w-md space-y-4">
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-lg border border-white/10 shadow-inner">
                          NEXT STEP RECOMMENDATION
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                          Ready to deploy your next autonomous agent?
                        </h3>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                          Your environment is configured. Pick up right where you left off in LangGraph memory loop architecture.
                        </p>
                      </div>

                      <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono text-indigo-300 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-400" /> Environment: WSL Ubuntu 24.04
                        </span>
                        <button 
                          onClick={triggerCelebration}
                          className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          Resume Sandbox →
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[32px] p-8 flex flex-col justify-between shadow-sm">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                          <HelpCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Need Architecture Guidance?</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Connect directly with senior AI instructors or consult the interactive documentation roadmap for debugging assistance.
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-100 mt-6">
                        <a href="#help" className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs transition-colors">
                          <span>Visit AI Help Center</span>
                          <span className="text-indigo-600 font-black">→</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Course Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {courseData.modules.map((mod, i) => {
                        const colors = MODULE_COLORS[i % MODULE_COLORS.length];
                        const completed = mod.lessons.filter(l => l.isCompleted).length;
                        const total = mod.lessons.length;
                        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                        return (
                          <div key={mod.id} onClick={() => navigate('/classroom')} className={`group flex flex-col bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-[28px] overflow-hidden hover:shadow-[0_20px_40px_rgba(31,38,135,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
                            <div className={`h-28 relative ${colors.image} flex items-end p-5 overflow-hidden`}>
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
                              <div className={`w-11 h-11 rounded-2xl ${colors.iconBg} flex items-center justify-center text-white shadow-lg ${colors.glow} relative z-10 group-hover:scale-110 transition-transform`}>
                                <BookOpen size={22} />
                              </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className={`font-bold text-sm mb-1.5 ${colors.iconColor} leading-tight`}>{mod.title}</h3>
                                <p className="text-xs text-slate-500 mb-4 font-medium">{mod.lessons.length} lessons · {mod.duration}</p>
                              </div>
                              <div className="space-y-3 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{completed}/{total} complete</span>
                                  <span className="text-[11px] font-black text-indigo-600">{progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Enrollments' && (
                <div className="bg-white/80 border border-slate-200 rounded-3xl p-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Your Enrollment</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">You are enrolled in the {courseData.title}. Complete all {courseData.totalLessons} lessons across {courseData.modules.length} modules to earn your certificate.</p>
                  <button onClick={() => navigate('/classroom')} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-lg cursor-pointer">
                    <Play size={14} />
                    Continue Learning
                  </button>
                </div>
              )}

              {activeTab === 'Certificates' && (
                <div className="bg-white/80 border border-slate-200 rounded-3xl p-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Award size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Verified Engineering Credentials</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">Complete your remaining 6 modules in the AI Agent Engineering track to generate your cryptographically signed diploma.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}