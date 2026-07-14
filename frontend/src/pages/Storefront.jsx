import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Star, Code, CreditCard, Cpu, Compass, Terminal, Search, ChevronDown, Award, Heart, Target, Trophy, HandCoins, FileText, MonitorPlay, Gift, Mail, Hash, Globe, Tv, MessageSquare, Box } from 'lucide-react';
import { courseData } from '../data/mockCourse';

const KEYWORDS = [
  { text: "Applied AI", gradient: "from-primary to-tertiary" },
  { text: "Prompting", gradient: "from-amber-700 via-tertiary to-amber-600" },
  { text: "Automation", gradient: "from-primary to-tertiary" },
  { text: "Systems", gradient: "from-amber-600 to-primary" },
  { text: "AI Agents", gradient: "from-tertiary to-primary" },
];

const SPRING_CONFIG = { stiffness: 160, damping: 18, mass: 1 };


export default function Storefront() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [keywordIdx, setKeywordIdx] = useState(0);

  const handleEnrollClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register');
    } else if (user.has_purchased) {
      navigate('/dashboard');
    } else {
      navigate('/checkout');
    }
  };

  const heroX = useMotionValue(0.5);
  const heroY = useMotionValue(0.5);
  const heroRotateX = useSpring(useTransform(heroY, [0, 1], [15, -15]), SPRING_CONFIG);
  const heroRotateY = useSpring(useTransform(heroX, [0, 1], [-15, 15]), SPRING_CONFIG);

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    heroX.set((event.clientX - rect.left) / rect.width);
    heroY.set((event.clientY - rect.top) / rect.height);
  };

  const handleHeroMouseLeave = () => {
    heroX.set(0.5);
    heroY.set(0.5);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIdx((prev) => (prev + 1) % KEYWORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const roadmaps = [
    { title: "Full-Stack AI Engineer", duration: "12 Weeks", level: "Advanced", desc: "Integrate LangChain agentic loops with Django backends and React 19 real-time streaming frontends.", icon: Cpu, accent: "border-indigo-200 bg-white/80 text-indigo-700 shadow-sm" },
    { title: "Spatial UI Architect", duration: "8 Weeks", level: "Intermediate", desc: "Master Figma spatial design tokens, 3D math for glassmorphism, and VisionOS gesture handlers.", icon: Compass, accent: "border-purple-200 bg-white/80 text-purple-700 shadow-sm" },
    { title: "High-Performance Backend", duration: "10 Weeks", level: "Core", desc: "Design distributed vector database caching, Redis event streaming, and custom tokenizers.", icon: Terminal, accent: "border-blue-200 bg-white/80 text-blue-700 shadow-sm" },
  ];

  return (
    <div className="relative min-h-screen text-slate-800 select-none font-sans overflow-hidden">
      


      {/* ==================== HERO STAGE ==================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 sm:pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-left z-20">
            <div className="font-heading font-bold tracking-tight text-5xl sm:text-[4.5rem] leading-[1.1] text-slate-900 drop-shadow-sm">
              <span className="text-primary">Build And Deploy </span>
              <br className="hidden sm:block" />
              <div className="inline-flex relative h-[1.15em] items-center overflow-hidden align-bottom px-1 -mx-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={KEYWORDS[keywordIdx].text}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${KEYWORDS[keywordIdx].gradient} pb-2`}
                  >
                    {KEYWORDS[keywordIdx].text}
                  </motion.span>
                </AnimatePresence>
              </div>
             
            </div>

            <p className="text-base sm:text-[17px] text-slate-700 font-medium leading-relaxed max-w-md drop-shadow-sm">
              Master AI in 28 days through scenario-driven, mission-based challenges. From survival-level basics to full automation workflows.
            </p>

            <div className="mt-8">
              <button 
                onClick={handleEnrollClick}
                className="inline-flex items-center gap-4 bg-gradient-to-r from-primary to-primary-container text-white px-6 py-4 rounded-md hover:scale-[1.02] active:scale-98 transition-all duration-300 group cursor-pointer relative overflow-hidden text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="w-12 h-12 rounded-md bg-white/20 flex items-center justify-center text-white group-hover:rotate-12 transition-transform relative z-10">
                  <CreditCard size={22} className="stroke-[2.5]" />
                </div>
                <div className="pr-4 relative z-10">
                  <h4 className="text-[13px] font-bold text-white tracking-wide uppercase font-label">
                    {user?.has_purchased ? 'GO TO DASHBOARD' : 'ENROLL IN THE MASTERCLASS'}
                  </h4>
                  <p className="text-[13px] text-white/80 font-medium mt-0.5">
                    {user?.has_purchased ? 'Lifetime access unlocked' : '$99 one-time access - Reg. $199'}
                  </p>
                </div>
              </button>
            </div>

            <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-[280px]">
              Purchase includes access to all 4 modules, 29 lessons, {courseData.totalDuration} of video content, complete starter codebases, and a verified completion certificate.
            </p>
          </div>

          {/* RIGHT COLUMN: LAYERED 3D HERO ARTIFACTS */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="relative min-h-[480px] sm:min-h-[580px] flex items-center justify-center pointer-events-auto z-10 w-full cursor-pointer" 
            style={{ perspective: '1200px' }}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            <motion.div
              style={{ rotateX: heroRotateX, rotateY: heroRotateY, transformStyle: 'preserve-3d' }}
              className="relative flex items-center justify-center w-full h-full"
            >
              
              {/* BACK MAIN WINDOW */}
              <motion.div
                variants={{
                  initial: { rotateX: 15, rotateY: -20, rotateZ: 5, z: 0, x: 20, y: 0, scale: 0.9 },
                  hover: { rotateX: 0, rotateY: 0, rotateZ: 0, z: 0, x: 0, y: -80, scale: 0.85 }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute w-[460px] h-[320px] rounded-2xl bg-white/95 backdrop-blur-3xl border border-ghost-border shadow-md overflow-hidden flex"
              >
                <div className="w-[140px] bg-surface-container-low/40 p-4 border-r border-ghost-border flex flex-col gap-4">
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-6 w-full bg-surface-container rounded-md flex items-center px-2 gap-1.5">
                    <Search size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 font-medium">Search</span>
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BookOpen size={12} /><div className="h-1.5 w-12 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Star size={12} /><div className="h-1.5 w-16 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Compass size={12} /><div className="h-1.5 w-10 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold block mb-2">Courses</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><div className="h-1.5 w-12 bg-slate-200 rounded-full" /></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-tertiary" /><div className="h-1.5 w-14 bg-slate-200 rounded-full" /></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400" /><div className="h-1.5 w-10 bg-slate-200 rounded-full" /></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-surface-container-low to-surface-container-lowest relative overflow-hidden">
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/60 rounded-full px-2 py-1 border border-ghost-border">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <span className="text-[10px] text-slate-800 font-medium">Meng To</span>
                    <ChevronDown size={10} className="text-slate-500" />
                  </div>
                  <div className="absolute right-8 top-16 w-32 rounded-xl bg-white border border-ghost-border p-3 shadow-sm">
                     <div className="flex items-center gap-2 mb-2">
                       <Award size={14} className="text-tertiary" />
                       <span className="text-[10px] text-slate-800 font-bold">Certificate</span>
                     </div>
                     <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-primary rounded-full" />
                     </div>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <path d="M0,100 Q50,50 100,100 T200,100 L200,200 L0,200 Z" fill="currentColor" className="text-primary" />
                  </svg>
                </div>
              </motion.div>
 
              {/* FRONT LEFT CARD (Blue Illustration) */}
              <motion.div
                variants={{
                  initial: { rotateX: 15, rotateY: -20, rotateZ: 5, z: 120, x: -60, y: 60, scale: 0.9 },
                  hover: { rotateX: 0, rotateY: 0, rotateZ: 0, z: 120, x: -220, y: 130, scale: 0.85 }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute w-[320px] h-[210px] rounded-[20px] bg-white/95 backdrop-blur-2xl border border-ghost-border shadow-md p-4 flex gap-4"
              >
                <div className="flex-1 flex flex-col justify-center gap-4">
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] text-white font-bold mt-1 shadow-md">1</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Intro to iOS Design</span>
                         <span className="text-[9px] text-primary bg-primary/10 px-1 rounded font-bold">6:08</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-primary rounded-full" /></div>
                       <div className="h-1 w-2/3 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold mt-1">2</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Design Guidelines</span>
                         <span className="text-[9px] text-slate-400 font-bold">9:02</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-1/4 bg-slate-400 rounded-full" /></div>
                       <div className="h-1 w-4/5 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold mt-1">3</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Colors and Gradients</span>
                         <span className="text-[9px] text-slate-400 font-bold">9:31</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-slate-400 rounded-full" /></div>
                       <div className="h-1 w-3/5 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                </div>
                <div className="w-[120px] rounded-xl bg-gradient-to-br from-primary to-tertiary p-3 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
                   <div className="absolute top-2 right-2 w-5 h-5 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-md"><Code size={10} className="text-white" /></div>
                   <svg viewBox="0 0 100 100" className="w-full h-20 text-white mb-2">
                     <circle cx="50" cy="35" r="14" fill="currentColor" opacity="0.9" />
                     <path d="M25,85 Q50,45 75,85" stroke="currentColor" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
                     <rect x="15" y="65" width="30" height="20" rx="4" fill="#00fcca" />
                     <rect x="55" y="65" width="30" height="20" rx="4" fill="#00fcca" />
                     <rect x="30" y="55" width="40" height="8" rx="2" fill="#f8f5ff" opacity="0.5" />
                   </svg>
                   <div className="flex gap-2">
                     <div className="w-3.5 h-3.5 rounded-full bg-white/40" />
                     <div className="w-3.5 h-3.5 rounded-full bg-white/40" />
                   </div>
                </div>
              </motion.div>
 
              {/* FRONT RIGHT CARD (Purple Illustration) */}
              <motion.div
                variants={{
                  initial: { rotateX: 15, rotateY: -20, rotateZ: 5, z: 240, x: 80, y: 100, scale: 0.9 },
                  hover: { rotateX: 0, rotateY: 0, rotateZ: 0, z: 240, x: 200, y: 130, scale: 0.85 }
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute w-[360px] h-[210px] rounded-[20px] bg-white/95 backdrop-blur-2xl border border-ghost-border shadow-md p-4 flex gap-5"
              >
                <div className="w-[140px] rounded-xl bg-gradient-to-br from-tertiary to-primary p-3 relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
                   <div className="absolute top-2 right-2 w-5 h-5 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-md"><Star size={10} className="text-white" /></div>
                   <svg viewBox="0 0 100 100" className="w-full h-24 text-white mb-1">
                     <path d="M20,65 L40,65 L40,45 L60,45 L60,65 L80,65 L80,85 L20,85 Z" fill="currentColor" opacity="0.7"/>
                     <circle cx="30" cy="55" r="12" fill="#f8f5ff" />
                     <circle cx="70" cy="55" r="12" fill="#f8f5ff" />
                     <rect x="45" y="30" width="10" height="15" fill="#f8f5ff" />
                   </svg>
                   <div className="w-3/4 h-1.5 bg-white/30 rounded-full mb-1" />
                   <div className="flex gap-2 mt-2">
                     <div className="w-4 h-4 rounded-full bg-white/40" />
                     <div className="w-4 h-4 rounded-full bg-white/40" />
                   </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold mt-1">1</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Intro to Visual Design</span>
                         <span className="text-[9px] text-slate-400 font-bold">10:08</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-1/4 bg-primary rounded-full" /></div>
                       <div className="h-1 w-2/3 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold mt-1">2</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Layout and Grids</span>
                         <span className="text-[9px] text-slate-400 font-bold">8:02</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-primary rounded-full" /></div>
                       <div className="h-1 w-3/4 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                   <div className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400 font-bold mt-1">3</div>
                     <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] text-slate-900 font-bold">Colors and Palettes</span>
                         <span className="text-[9px] text-slate-400 font-bold">11:12</span>
                       </div>
                       <div className="h-0.5 w-full bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-primary rounded-full" /></div>
                       <div className="h-1 w-4/5 bg-slate-100 rounded-full mt-2" />
                     </div>
                   </div>
                </div>
              </motion.div>
 
              {/* TOP LEFT FLOATING CARDS */}
              <motion.div
                variants={{
                  initial: { rotateX: 15, rotateY: -20, rotateZ: 5, z: 80, x: -140, y: -120, scale: 0.8 },
                  hover: { rotateX: 0, rotateY: 0, rotateZ: 0, z: 80, x: -300, y: -160, scale: 0.85 }
                }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute w-[180px] h-[100px] rounded-xl bg-gradient-to-br from-primary to-tertiary p-4 shadow-md border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-[10px] font-black text-white tracking-wider font-sans">SWIFTUI</h6>
                    <span className="text-[8px] text-white/70 font-label">Certificate</span>
                  </div>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shadow-lg"><Terminal size={12} className="text-white" /></div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-white/20 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
                </div>
              </motion.div>
 
              <motion.div
                variants={{
                  initial: { rotateX: 15, rotateY: -20, rotateZ: 5, z: 40, x: -20, y: -160, scale: 0.8 },
                  hover: { rotateX: 0, rotateY: 0, rotateZ: 0, z: 40, x: -100, y: -280, scale: 0.85 }
                }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="absolute w-[180px] h-[100px] rounded-xl bg-gradient-to-br from-tertiary to-primary-container p-4 shadow-md border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="text-[10px] font-black text-white tracking-wider font-sans">SWIFTUI</h6>
                    <span className="text-[8px] text-white/70 font-label">Certificate</span>
                  </div>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shadow-lg"><Terminal size={12} className="text-white" /></div>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-white/20 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
                </div>
              </motion.div>

            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ==================== SECTION 2: CAREER ROADMAPS ==================== */}
      <div id="roadmaps" className="relative z-10 py-16 px-6 lg:px-12 text-slate-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block mb-2">CURATED CAREER TRACKS</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Structured Learning Roadmaps.
            </h2>
            <p className="text-base text-slate-600 font-medium mt-3">
              Follow step-by-step curriculum tracks engineered to take you from foundational concepts to production-ready software architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roadmaps.map((track, i) => {
              const Icon = track.icon;
              return (
                 <div key={i} className="rounded-md p-8 bg-surface-container-lowest hover:bg-surface-container transition-all duration-300 space-y-6 flex flex-col justify-between group relative overflow-hidden">
 
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-tertiary/10 text-tertiary font-label">
                         {track.level}
                       </span>
                       <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                         <Clock size={12} className="text-tertiary" /> {track.duration}
                       </span>
                     </div>
                     <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-primary">
                       <Icon size={22} />
                     </div>
                     <h3 className="text-xl font-heading font-bold text-slate-900 tracking-tight">{track.title}</h3>
                     <p className="text-xs font-medium text-slate-600 leading-relaxed font-sans">{track.desc}</p>
                   </div>
                   <a href="#catalog" className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 transition-colors pt-4">
                     <span>Explore Track Modules</span>
                     <ArrowRight size={14} />
                   </a>
                 </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== SECTION 3: CAREER BOOST ==================== */}
      <div id="catalog" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-slate-900 leading-tight">
              Boost your AI career
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
              It's time to upgrade your AI skills
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-4">
            {[
              { icon: Heart, label: "Enjoy coding like\nnever before", gradient: "from-primary to-tertiary" },
              { icon: Target, label: "Reach out to new\nclients", gradient: "from-primary to-tertiary" },
              { icon: Trophy, label: "Stand out against\nthe competition", gradient: "from-primary to-tertiary" },
              { icon: HandCoins, label: "Increase your pay\nrate", gradient: "from-primary to-tertiary" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon size={28} className="text-white stroke-[2]" />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-700 leading-snug whitespace-pre-line">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      
      {/* ==================== SECTION 4: THE ONLY COURSE ==================== */}
      <div className="relative z-10 py-24 px-6 lg:px-12 text-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-slate-900 tracking-tight">
            The only course you need
          </h2>
          <p className="text-lg sm:text-xl font-medium text-slate-600 font-sans">
            AI Growth Academy is the <span className="font-bold text-slate-900">most complete</span>, yet <span className="font-bold text-slate-900">accessible</span> course you can find.
          </p>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto font-sans">
            You will start by discovering what <span className="font-bold text-slate-900">AI</span> is and why using modern <span className="font-bold text-slate-900">AI tools</span> is a must. You will then discover the various components of AI development and once the <span className="font-bold text-slate-900">basics</span> are acquired, you will move on to more <span className="font-bold text-slate-900">advanced techniques</span> and build up experience through tons of exercises.
          </p>
          <p className="text-base sm:text-lg text-slate-500 font-medium font-sans">
            At the end of the course, you will have enough experience and skills to <span className="font-bold text-slate-900">create your own projects</span>.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 pt-16">
            <div className="text-center space-y-2">
              <div className="text-7xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary-container">
                4
              </div>
              <div className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2 font-label">
                Chapters <BookOpen size={20} className="text-tertiary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-7xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary-container">
                28
              </div>
              <div className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2 font-label">
                Lessons <FileText size={20} className="text-tertiary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-7xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary-container">
                93
              </div>
              <div className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2 font-label">
                Hours of tutorial <MonitorPlay size={20} className="text-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <div className="relative z-10 w-full pt-12 pb-24 px-6 lg:px-12 flex flex-col items-center">
        {/* Banner */}
        <div className="w-full max-w-5xl bg-gradient-to-r from-primary to-primary-container rounded-md p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between text-white mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-12 -translate-y-1/2 w-16 h-16 bg-white/10 rotate-12 rounded-lg blur-xl"></div>
          
          <div className="space-y-3 z-10 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">Start learning now</h2>
            <p className="text-lg text-white font-medium font-sans">Only <span className="font-bold text-white">$99</span> for a <span className="font-bold text-white">93 hour</span> complete course</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 z-10">
            <button 
              onClick={handleEnrollClick}
              className="bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors px-8 py-3.5 rounded-md font-bold text-lg cursor-pointer font-label"
            >
              {user?.has_purchased ? 'Go to Dashboard' : 'Start learning now'}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-slate-600">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-black text-slate-900 text-lg mb-1">
              <Box size={24} className="text-indigo-600" />
              <span>AI Growth Academy</span>
            </div>
            <p className="text-xs text-slate-500">© 2026. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Navigation</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Login</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Join</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"><Gift size={14} /> Gift the course</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Mail size={14} /> contact@aigrowthacademy.com</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Hash size={14} /> bruno_simon</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><MessageSquare size={14} /> Discord</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Globe size={14} /> LinkedIn</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors flex items-center gap-2"><Tv size={14} /> Youtube</a></li>
            </ul>
            
            <h4 className="font-bold text-slate-900 mb-4 mt-8">Other</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Mux (video streaming)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-indigo-600 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}