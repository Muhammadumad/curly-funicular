import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronDown, Clock, Check, Sparkles } from 'lucide-react';
import { courseData } from '../data/mockCourse';



// --- Interactive 3D AI Bot SVG Companion ---
function FloatingAIBot() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center select-none pointer-events-none">
      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md animate-pulse" />
      <svg viewBox="0 0 100 100" className="w-7 h-7 relative z-10 drop-shadow-lg">
        <defs>
          <radialGradient id="botGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="48" r="30" fill="url(#botGlow)" />
        <rect x="30" y="22" width="40" height="8" rx="4" fill="#6366f1" />
        <circle cx="40" cy="44" r="5" fill="white" />
        <circle cx="60" cy="44" r="5" fill="white" />
        <circle cx="41" cy="44" r="2.5" fill="#1e1b4b" />
        <circle cx="61" cy="44" r="2.5" fill="#1e1b4b" />
        <path d="M40,58 Q50,66 60,58" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="20" y="40" width="8" height="4" rx="2" fill="#818cf8" />
        <rect x="72" y="40" width="8" height="4" rx="2" fill="#818cf8" />
        <line x1="50" y1="18" x2="50" y2="10" stroke="#818cf8" strokeWidth="2" />
        <circle cx="50" cy="8" r="3" fill="#a5b4fc" className="animate-pulse" />
        <defs>
          <radialGradient id="botAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

// Helper: flatten all lessons from modules for indexing
function getAllLessons(modules) {
  return modules.flatMap(m => m.lessons);
}

export default function Classroom() {
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchTimeCounter, setWatchTimeCounter] = useState(0);
  const [prevLessonId, setPrevLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const isPlayingRef = useRef(false);

  if (currentLesson?.id !== prevLessonId) {
    setPrevLessonId(currentLesson?.id);
    setWatchTimeCounter(0);
  }

  const triggerLessonReward = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4']
    });
  };

  const fetchCourseDetails = async () => {
    try {
      // Simulate network delay to show loading skeleton
      setTimeout(() => {
        setCourse(courseData);
        const allLessons = getAllLessons(courseData.modules);
        setCurrentLesson(prev => {
          if (!prev) return allLessons[0];
          return allLessons.find(l => l.id === prev.id) || prev;
        });
        // Auto-expand all modules on first load
        const expanded = {};
        courseData.modules.forEach(m => { expanded[m.id] = true; });
        setExpandedModules(prev => {
          // Only set if empty (first load)
          if (Object.keys(prev).length === 0) return expanded;
          return prev;
        });
        setLoading(false);
      }, 800);

    } catch {
      setError('Course not found or access denied.');
      setLoading(false);
    }
  };
  useEffect(() => {
    const load = async () => {
      await fetchCourseDetails();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentLesson) return;

    const interval = setInterval(() => {
      if (isPlayingRef.current) {
        setWatchTimeCounter((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= 30) {
            api.post('/api/progress/ping', {
              lesson_id: currentLesson.id,
              watch_time_seconds: 30,
            }).then(() => {
              fetchCourseDetails();
            }).catch((err) => {
              console.error('Failed to ping progress heartbeat', err);
            });
            return 0;
          }
          return nextVal;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson]);

  const formatDuration = (durationStr) => {
    if (!durationStr) return '0:00';
    return durationStr;
  };

  const toggleCompletion = async (lesson, currentCompleted) => {
    const newStatus = currentCompleted ? 'started' : 'completed';

    if (!currentCompleted) {
      triggerLessonReward();
    }

    try {
      await api.post('/api/progress/ping', {
        lesson_id: lesson.id,
        watch_time_seconds: 0,
        status: newStatus,
      });
      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to toggle completion status', err);
    }
  };

  const handleVideoEnded = async () => {
    isPlayingRef.current = false;
    triggerLessonReward();
    if (currentLesson) {
      try {
        await api.post('/api/progress/ping', {
          lesson_id: currentLesson.id,
          watch_time_seconds: watchTimeCounter,
          status: 'completed',
        });
        setWatchTimeCounter(0);
        fetchCourseDetails();
      } catch (err) {
        console.error('Failed to log final completion', err);
      }
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Compute current lesson's global index and total
  const allLessons = course ? getAllLessons(course.modules) : [];
  const currentLessonGlobalIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-white relative z-10 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase font-bold">INITIALIZING WORKSPACE</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-slate-900 px-6 relative z-10 font-sans">
        <div className="text-center">
          <p className="text-sm font-light text-rose-500 mb-4">{error || 'Course not found.'}</p>
          <Link to="/" className="text-xs font-bold tracking-wide text-slate-500 hover:text-slate-900 transition-colors duration-200">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row text-slate-900 pt-24 relative z-10 font-sans select-none overflow-hidden">
      
      {/* Ambient Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* LEFT: Video Stream & Meta */}
      <div className="flex-1 flex flex-col justify-start p-6 lg:p-10 border-r border-slate-200 backdrop-blur-md relative">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-500 hover:text-slate-900 hover:bg-white transition-all duration-300 shadow-sm"
            >
              <ChevronLeft size={16} />
            </Link>
            <div className="flex items-center gap-3 ">
              <FloatingAIBot />
              <div>
                <span className="text-[15px] uppercase tracking-widest font-mono font-bold text-indigo-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  CLASSROOM WORKSPACE
                </span>
                <h2 className="text-base font-bold-300 text-slate-900 leading-tight mt-0.5">{course.title}</h2>
              </div>
            </div>
          </div>

          <button 
            onClick={triggerLessonReward}
            className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles size={13} className="text-amber-500 animate-pulse" />
            <span>Simulate Reward</span>
          </button>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl group">
          {/* Corner Tech HUD Elements */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-white/90 tracking-wider">LIVE STREAM ARCHITECTURE</span>
          </div>

          {currentLesson?.videoUrl ? (
            <video
              key={currentLesson.id}
              src={currentLesson.videoUrl}
              controls
              onPlay={() => { isPlayingRef.current = true; }}
              onPause={() => { isPlayingRef.current = false; }}
              onEnded={handleVideoEnded}
              className="h-full w-full object-contain relative z-10"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="url(#blueGrad)" className="animate-[pulse_4s_infinite]" />
              </svg>
              <p className="text-sm font-light text-slate-400 relative z-10 font-mono">NO VIDEO STREAM PROVIDED FOR THIS MODULE.</p>
            </div>
          )}
        </div>

        {currentLesson && (
          <div className="mt-6 text-left">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentLesson.title}</span>
            </h1>
            <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                <Clock size={13} className="text-indigo-600" />
                Duration: {formatDuration(currentLesson.duration)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-bold">Lesson {currentLessonGlobalIndex + 1} of {allLessons.length}</span>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: Module-Grouped Course Syllabus */}
      <div className="w-full lg:w-96 flex flex-col bg-white/80 border-t lg:border-t-0 lg:border-l border-slate-200 backdrop-blur-2xl">
        <div className="p-6 border-b border-slate-200 relative overflow-hidden">
          {/* Subtle Decorative SVG Wireframe */}
          <svg className="absolute -right-6 -top-6 w-24 h-24 opacity-10 pointer-events-none text-indigo-600" viewBox="0 0 100 100" stroke="currentColor" fill="none">
            <circle cx="50" cy="50" r="40" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" strokeWidth="1" strokeDasharray="5 5" />
          </svg>
          <h3 className="text-xs uppercase tracking-widest font-extrabold text-slate-900 flex items-center gap-2">
            <span>Course Syllabus</span>
          </h3>
          <p className="text-[11px] font-bold text-slate-500 mt-1">{course.modules.length} Modules · {allLessons.length} Lessons · {course.totalDuration}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.modules?.map((module) => {
            const isExpanded = expandedModules[module.id];
            const completedCount = module.lessons.filter(l => l.isCompleted).length;
            const totalCount = module.lessons.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div key={module.id} className="border-b border-slate-100">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                      progress === 100 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      {progress === 100 ? <Check size={14} className="stroke-[3]" /> : `${completedCount}`}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{module.title}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{totalCount} lessons · {module.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Progress bar mini */}
                    <div className="hidden sm:block w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </button>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="divide-y divide-slate-50">
                    {module.lessons.map((lesson, idx) => {
                      const isCompleted = lesson.isCompleted;
                      const isActive = currentLesson?.id === lesson.id;

                      return (
                        <div 
                          key={lesson.id}
                          className={`group flex items-center justify-between pl-8 pr-4 py-3 transition-all duration-300 relative ${isActive ? 'bg-indigo-50 border-l-2 border-indigo-600' : 'hover:bg-slate-50/80'}`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                            <button
                              onClick={() => toggleCompletion(lesson, isCompleted)}
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all cursor-pointer ${
                                isCompleted 
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm scale-110' 
                                  : 'border-slate-300 bg-transparent text-transparent hover:border-slate-400'
                              }`}
                            >
                              {isCompleted && <Check size={11} className="stroke-[3]" />}
                            </button>

                            <button
                              onClick={() => setCurrentLesson(lesson)}
                              className="text-left flex-1 min-w-0 cursor-pointer"
                            >
                              <p className={`text-xs font-bold tracking-wide truncate ${isActive ? 'text-indigo-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                {idx + 1}. {lesson.title}
                              </p>
                              <span className="text-[11px] font-mono text-slate-400 block mt-1">
                                {formatDuration(lesson.duration)}
                              </span>
                            </button>
                          </div>

                          {isActive && (
                            <div className="relative flex items-center justify-center w-4 h-4">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}