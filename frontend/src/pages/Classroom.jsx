import { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import useVideoProgress from '../hooks/useVideoProgress';
import Hls from 'hls.js';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronDown, ChevronRight, Clock, Check, Sparkles, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Copy } from 'lucide-react';



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

// Custom code block renderer with interactive copy-to-clipboard button
function CodeSnippetBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard', err);
    }
  };

  return (
    <div className="relative group/code rounded-xl overflow-hidden border border-slate-200 shadow-sm my-3 font-mono text-[10px] w-full select-text">
      {/* Code Header bar */}
      <div className="bg-slate-100 px-3.5 py-1.5 flex items-center justify-between border-b border-slate-200 select-none">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-indigo-600 cursor-pointer bg-white px-2 py-0.5 rounded border border-slate-200 transition-all active:scale-95 shadow-sm"
        >
          <Copy size={10} className={copied ? 'text-emerald-500' : 'text-slate-400'} />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {/* Code Text container */}
      <pre className="bg-slate-950 text-slate-100 p-3.5 overflow-x-auto font-semibold leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Custom simple markdown, list, and code-block renderer for AI Copilot Tutor messages
function CopilotMessageRenderer({ content }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-[11px] text-slate-800 leading-relaxed font-sans select-text w-full">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const codeLines = part.slice(3, -3).trim().split('\n');
          const lang = codeLines[0].match(/^[a-zA-Z0-9_-]+$/) ? codeLines[0] : '';
          const code = lang ? codeLines.slice(1).join('\n') : codeLines.join('\n');
          
          return (
            <CodeSnippetBlock key={index} code={code} lang={lang} />
          );
        }

        const lines = part.split('\n');
        return lines.map((line, lIdx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <li key={`${index}-${lIdx}`} className="ml-4 list-disc pl-1 font-semibold text-slate-700">
                {trimmed.substring(2)}
              </li>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={`${index}-${lIdx}`} className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider mt-3 mb-1">
                {trimmed.substring(4)}
              </h4>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={`${index}-${lIdx}`} className="text-[11px] font-bold text-slate-900 mt-2 mb-1">
                {trimmed.substring(5)}
              </h5>
            );
          }
          if (trimmed === '') {
            return <div key={`${index}-${lIdx}`} className="h-1.5" />;
          }

          const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((word, wIdx) => {
            if (word.startsWith('**') && word.endsWith('**')) {
              return <strong key={wIdx} className="font-extrabold text-indigo-700">{word.slice(2, -2)}</strong>;
            }
            return word;
          });

          return <p key={`${index}-${lIdx}`} className="font-semibold text-slate-600">{formattedLine}</p>;
        });
      })}
    </div>
  );
}

export default function Classroom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [signedStreamUrl, setSignedStreamUrl] = useState('');

  // Interactive AI Tutor Copilot states
  const [activeRightTab, setActiveRightTab] = useState('syllabus'); // 'syllabus' | 'copilot'
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      content: '### Welcome to AI Tutor!\n\nI can answer any questions you have about this video. Ask me anything, or click one of the suggested topics below!',
      citations: []
    }
  ]);
  const [questionInput, setQuestionInput] = useState('');
  const [askingCopilot, setAskingCopilot] = useState(false);

  // Custom HUD Video Player States & Refs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const controlsTimeoutRef = useRef(null);
  const playerContainerRef = useRef(null);
  const chatScrollRef = useRef(null);

  const fetchCourseDetails = async () => {
    try {
      const res = await api.get('/api/courses/28-day-ai-challenge');
      const courseDataFromAPI = res.data;

      const progressKey = user ? `lms_progress_${user.id}` : 'lms_progress_guest';
      const stored = localStorage.getItem(progressKey);
      const completedIds = stored ? JSON.parse(stored) : [];

      const updatedModules = (courseDataFromAPI.modules || []).map(mod => ({
        ...mod,
        lessons: (mod.lessons || []).map(les => {
          const minutes = Math.floor(les.duration_in_seconds / 60);
          const seconds = les.duration_in_seconds % 60;
          const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          // Mark completed if database status is completed OR locally recorded in localStorage
          const hasDbCompletion = les.activity_logs?.some(log => log.status === 'completed');
          return {
            ...les,
            duration: durationStr,
            isCompleted: hasDbCompletion || completedIds.includes(les.id) || completedIds.includes(String(les.id)),
          };
        })
      }));

      const updatedCourse = {
        ...courseDataFromAPI,
        modules: updatedModules,
      };

      setCourse(updatedCourse);
      
      const allLessons = getAllLessons(updatedModules);
      setCurrentLesson(prev => {
        if (lessonId) {
          const match = allLessons.find(l => String(l.id) === String(lessonId));
          if (match) return match;
        }
        if (!prev) return allLessons[0];
        return allLessons.find(l => l.id === prev.id) || allLessons[0];
      });

      // Auto-expand ONLY the active module containing the current lesson
      const expanded = {};
      let activeModuleId = null;
      if (lessonId) {
        const parentModule = updatedModules.find(m => m.lessons.some(l => String(l.id) === String(lessonId)));
        if (parentModule) {
          activeModuleId = parentModule.id;
        }
      }
      if (!activeModuleId && allLessons.length > 0) {
        const activeLesson = currentLesson || allLessons[0];
        const parentModule = updatedModules.find(m => m.lessons.some(l => l.id === activeLesson.id));
        if (parentModule) {
          activeModuleId = parentModule.id;
        }
      }
      if (activeModuleId) {
        expanded[activeModuleId] = true;
      }
      setExpandedModules(prev => {
        if (Object.keys(prev).length === 0) return expanded;
        return prev;
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Course not found or access denied.');
      setLoading(false);
    }
  };

  const { videoRef, flushProgress } = useVideoProgress(currentLesson?.id, user?.id, fetchCourseDetails);

  // Fetch signed HLS stream URL when current lesson changes
  useEffect(() => {
    if (!currentLesson) return;

    const fetchStreamUrl = async () => {
      try {
        const res = await api.get(`/api/classroom/${currentLesson.id}`);
        setSignedStreamUrl(res.data.stream_url);
      } catch (err) {
        console.error('Failed to fetch signed HLS stream URL', err);
        setSignedStreamUrl('');
      }
    };

    fetchStreamUrl();
  }, [currentLesson]);

  // Bind HLS player source to video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !signedStreamUrl) return;

    let hls = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = signedStreamUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
        }
      });
      hls.loadSource(signedStreamUrl);
      hls.attachMedia(video);
    } else {
      console.error('HLS playback is not supported on this device/browser.');
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [signedStreamUrl, videoRef]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (course && lessonId) {
      const allLessons = getAllLessons(course.modules);
      const match = allLessons.find(l => String(l.id) === String(lessonId));
      if (match && (!currentLesson || currentLesson.id !== match.id)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentLesson(match);
        const parentModule = course.modules.find(m => m.lessons.some(l => String(l.id) === String(lessonId)));
        if (parentModule) {
          setExpandedModules(prev => ({ ...prev, [parentModule.id]: true }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, course]);

  const handleAskCopilot = async (qText) => {
    const textToSend = qText || questionInput;
    if (!textToSend || !textToSend.trim()) return;

    // Add user message to history
    const userMsg = { role: 'user', content: textToSend };
    setCopilotMessages(prev => [...prev, userMsg]);
    setQuestionInput('');
    setAskingCopilot(true);

    try {
      const res = await api.post(`/api/classroom/${currentLesson.id}/copilot`, {
        question: textToSend
      });

      // Add assistant response with citations
      setCopilotMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.answer,
        citations: res.data.citations || []
      }]);
    } catch (err) {
      console.error(err);
      setCopilotMessages(prev => [...prev, {
        role: 'assistant',
        content: '### Connection Error\n\nFailed to communicate with the AI Tutor Copilot. Please check your network and try again.',
        citations: []
      }]);
    } finally {
      setAskingCopilot(false);
    }
  };

  // Synchronize custom video HUD states with the real video element
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handlePlayState = () => {
    setIsPlaying(true);
  };

  const handlePauseState = () => {
    setIsPlaying(false);
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(err => console.error(err));
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  };

  const handleVolumeSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const handleTimelineSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  const togglePip = () => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => console.error(err));
    } else if (videoRef.current !== document.pictureInPictureElement) {
      videoRef.current.requestPictureInPicture().catch(err => console.error(err));
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const handleMarkerSeek = (e) => {
    const time = parseFloat(e.currentTarget.getAttribute('data-time'));
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play().catch(err => console.error(err));
    }
  };

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
          }
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Scroll anchoring: auto-scroll to bottom of chat when new messages land
  useEffect(() => {
    const chatContainer = chatScrollRef.current;
    if (chatContainer) {
      const threshold = 100;
      const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < threshold;
      
      if (isNearBottom || askingCopilot) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [copilotMessages, askingCopilot]);

  // Route protection: redirect inactive users to dashboard (placed after all hooks)
  if (user && !user.is_active) {
    return <Navigate to="/dashboard" replace />;
  }

  const triggerLessonReward = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4']
    });
  };



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

      // Update localStorage progress
      const progressKey = user ? `lms_progress_${user.id}` : 'lms_progress_guest';
      const stored = localStorage.getItem(progressKey);
      let completedIds = stored ? JSON.parse(stored) : [];
      if (currentCompleted) {
        completedIds = completedIds.filter(id => id !== lesson.id);
      } else {
        if (!completedIds.includes(lesson.id)) {
          completedIds.push(lesson.id);
        }
      }
      localStorage.setItem(progressKey, JSON.stringify(completedIds));

      fetchCourseDetails();
    } catch (err) {
      console.error('Failed to toggle completion status', err);
    }
  };

  const handleVideoEnded = async () => {
    triggerLessonReward();
    if (currentLesson) {
      try {
        await flushProgress('completed');

        // Update localStorage progress
        const progressKey = user ? `lms_progress_${user.id}` : 'lms_progress_guest';
        const stored = localStorage.getItem(progressKey);
        let completedIds = stored ? JSON.parse(stored) : [];
        if (!completedIds.includes(currentLesson.id)) {
          completedIds.push(currentLesson.id);
          localStorage.setItem(progressKey, JSON.stringify(completedIds));
        }

        fetchCourseDetails();
      } catch (err) {
        console.error('Failed to log final completion', err);
      }
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      const wasExpanded = prev[moduleId];
      return wasExpanded ? {} : { [moduleId]: true };
    });
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
                <h2 className="text-base font-semibold text-slate-900 leading-tight mt-0.5">{course.title}</h2>
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

        <div
          ref={playerContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="relative aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl group/player select-none"
        >
          {/* Corner Tech HUD Elements */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-white/90 tracking-wider">LIVE STREAM ARCHITECTURE</span>
          </div>

          {signedStreamUrl ? (
            <>
              {/* Top HUD overlay showing Active Tutorial Title */}
              {showControls && currentLesson && (
                <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/85 via-black/35 to-transparent p-6 pb-12 flex items-center justify-between pointer-events-none select-none">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">ACTIVE TUTORIAL:</span>
                    <h3 className="text-xs font-bold text-white drop-shadow-md leading-tight">{currentLesson.title}</h3>
                  </div>
                </div>
              )}

              {/* Actual Video Tag (without native controls) */}
              <video
                key={currentLesson.id}
                ref={videoRef}
                onClick={togglePlay}
                onPlay={handlePlayState}
                onPause={handlePauseState}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
                onVolumeChange={handleVolumeChange}
                onEnded={handleVideoEnded}
                className="h-full w-full object-contain relative z-10 cursor-pointer"
              />

              {/* Big central Play/Pause overlay click helper */}
              <div 
                onClick={togglePlay}
                className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-opacity duration-300 cursor-pointer ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {!isPlaying && (
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-indigo-600/90 text-white shadow-lg border border-indigo-400 scale-110 hover:scale-125 transition-transform duration-200">
                    <Play size={28} className="fill-white translate-x-0.5" />
                  </div>
                )}
              </div>

              {/* Custom Glassmorphic Controls HUD */}
              <div
                className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-6 pb-6 pt-10 flex flex-col gap-3 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Custom Timeline Slider with Markers */}
                <div className="relative w-full flex items-center group/timeline">
                  {/* Visual progress track representation */}
                  <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full pointer-events-none" />
                  <div 
                    className="absolute left-0 h-1 bg-indigo-500 rounded-full pointer-events-none"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />

                  {duration > 0 && [
                    { time: 75, label: 'SPA Authentication (01:15)' },
                    { time: 225, label: 'API Route Setup (03:45)' }
                  ].map((marker, mIdx) => {
                    const pct = (marker.time / duration) * 100;
                    if (pct > 100) return null;
                    return (
                      <button
                        key={mIdx}
                        title={marker.label}
                        data-time={marker.time}
                        onClick={handleMarkerSeek}
                        className="absolute h-2.5 w-2.5 rounded-full bg-amber-400 border border-black hover:bg-amber-300 hover:scale-125 transition-all z-20 cursor-pointer -translate-x-1/2"
                        style={{ left: `${pct}%` }}
                      />
                    );
                  })}

                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleTimelineSeek}
                    className="w-full h-1 bg-transparent appearance-none cursor-pointer outline-none relative z-10 accent-white group-hover/timeline:h-1.5 transition-all"
                  />
                </div>

                {/* Controls toolbar */}
                <div className="flex items-center justify-between text-white text-xs select-none">
                  {/* Left Controls: Play, Time, Volume */}
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors cursor-pointer">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    {/* Time Counter */}
                    <span className="font-mono text-[10px] text-zinc-300">
                      {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {formatDuration(currentLesson.duration)}
                    </span>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="hover:text-indigo-400 transition-colors cursor-pointer">
                        {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeSliderChange}
                        className="w-16 sm:w-20 h-1 bg-white/30 rounded-full appearance-none accent-white cursor-pointer transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Right Controls: Playback rate, Picture in picture, Fullscreen */}
                  <div className="flex items-center gap-4">
                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1.5">
                      {[1, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                            playbackRate === rate
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                              : 'bg-transparent border-white/20 hover:border-white text-zinc-300'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    <button onClick={togglePip} title="Picture in Picture" className="hover:text-indigo-400 transition-colors cursor-pointer">
                      <Sparkles size={14} />
                    </button>

                    <button onClick={toggleFullscreen} className="hover:text-indigo-400 transition-colors cursor-pointer">
                      {isFullscreen ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,20 50,50 T100,50 L100,100 L0,100 Z" fill="url(#blueGrad)" className="animate-[pulse_4s_infinite]" />
              </svg>
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                <p className="text-[10px] font-mono text-slate-400 tracking-wider">SECURING HLS HANDSHAKE...</p>
              </div>
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

      {/* RIGHT: Tabbed Course Syllabus / AI Tutor Copilot Sidebar */}
      <div className="w-full lg:w-96 flex flex-col bg-white/80 border-t lg:border-t-0 lg:border-l border-slate-200 backdrop-blur-2xl">
        
        {/* Segmented Tab Control */}
        <div className="p-4 border-b border-slate-200 flex gap-2 shrink-0 bg-white">
          <button
            onClick={() => setActiveRightTab('syllabus')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeRightTab === 'syllabus'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            Syllabus
          </button>
          <button
            onClick={() => setActiveRightTab('copilot')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRightTab === 'copilot'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <Sparkles size={12} className={activeRightTab === 'copilot' ? 'text-white' : 'text-indigo-600'} />
            <span>AI Tutor</span>
          </button>
        </div>

        {activeRightTab === 'copilot' ? (
          /* Tab 1: AI Copilot Tutor Chat */
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            {/* Scrollable Message List */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-slate-950 text-white border-slate-955 self-end ml-auto'
                      : 'bg-white text-slate-800 border-slate-200 self-start mr-auto'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <CopilotMessageRenderer content={msg.content} />
                  ) : (
                    <p className="font-semibold text-slate-100">{msg.content}</p>
                  )}

                  {/* Cited Timestamps with Seeking Trigger */}
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2 w-full">
                      <span className="text-[9px] font-mono text-zinc-400 font-extrabold uppercase tracking-wider">CITED VIDEO SEGMENTS:</span>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {msg.citations.map((cite, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = cite.timestamp_seconds;
                                videoRef.current.play();
                              }
                            }}
                            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 text-[10px] font-bold text-indigo-600 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span>{cite.timestamp_formatted}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Tutor Thinking Overlay (Premium Skeleton Loader) */}
              {askingCopilot && (
                <div className="bg-white border border-slate-200 self-start mr-auto w-[85%] rounded-2xl p-4 shadow-sm space-y-2.5 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[9px] font-mono font-bold text-indigo-600 tracking-wider">AI TUTOR CONTEMPLATING...</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-2/3"></div>
                </div>
              )}
            </div>

            {/* Quick suggestions on empty conversation state */}
            {copilotMessages.length === 1 && !askingCopilot && (
              <div className="p-4 pt-0 shrink-0">
                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2.5">Suggested Topics:</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAskCopilot('Why did we use Sanctum here instead of Passport?')}
                    className="w-full text-left bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer shadow-sm flex items-center justify-between group"
                  >
                    <span>Why Sanctum instead of Passport?</span>
                    <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleAskCopilot('Explain SPA authentication security')}
                    className="w-full text-left bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all cursor-pointer shadow-sm flex items-center justify-between group"
                  >
                    <span>Explain SPA authentication security</span>
                    <ChevronRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCopilot();
              }}
              className="p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0"
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask the AI Tutor..."
                disabled={askingCopilot}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={askingCopilot || !questionInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          /* Tab 2: Standard Syllabus Curriculum */
          <>
            <div className="p-4 border-b border-slate-200 relative overflow-hidden shrink-0 bg-white">
              <svg className="absolute -right-4 -top-4 w-20 h-20 opacity-5 pointer-events-none text-indigo-600" viewBox="0 0 100 100" stroke="currentColor" fill="none">
                <circle cx="50" cy="50" r="40" strokeWidth="1" />
                <circle cx="50" cy="50" r="20" strokeWidth="1" strokeDasharray="5 5" />
              </svg>
              <h3 className="text-[10px] uppercase tracking-widest font-extrabold text-slate-900">Course Syllabus</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{course.modules.length} Modules · {allLessons.length} Lessons · {course.totalDuration}</p>
            </div>

            {/* MODULE CARDS — each module is a distinct visual block */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {course.modules?.map((module, mIdx) => {
                const isExpanded = expandedModules[module.id];
                const completedCount = module.lessons.filter(l => l.isCompleted).length;
                const totalCount = module.lessons.length;
                const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                const isModuleActive = module.lessons.some(l => l.id === currentLesson?.id);

                // Per-module accent colours
                const ACCENT = [
                  { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700', ring: 'bg-violet-500', border: 'border-violet-200' },
                  { bg: 'bg-cyan-600',   light: 'bg-cyan-50',   text: 'text-cyan-700',   ring: 'bg-cyan-500',   border: 'border-cyan-200'   },
                  { bg: 'bg-blue-600',   light: 'bg-blue-50',   text: 'text-blue-700',   ring: 'bg-blue-500',   border: 'border-blue-200'   },
                  { bg: 'bg-amber-600',  light: 'bg-amber-50',  text: 'text-amber-700',  ring: 'bg-amber-500',  border: 'border-amber-200'  },
                ][mIdx % 4];

                return (
                  <div
                    key={module.id}
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isModuleActive ? `${ACCENT.border} shadow-md` : 'border-slate-200/80 shadow-sm'
                    } bg-white`}
                  >
                    {/* ── Module Header ── */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left cursor-pointer group"
                    >
                      {/* Coloured top band */}
                      <div className={`${ACCENT.bg} px-4 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {mIdx + 1}
                          </span>
                          <p className="text-xs font-bold text-white truncate leading-tight">{module.title}</p>
                        </div>
                        <ChevronDown
                          size={14}
                          className={`text-white/80 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>

                      {/* Progress strip below band */}
                      <div className={`${ACCENT.light} px-4 py-2 flex items-center justify-between`}>
                        <span className={`text-[10px] font-bold ${ACCENT.text}`}>
                          {completedCount}/{totalCount} complete
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? 'bg-emerald-500' : ACCENT.ring}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-black ${ACCENT.text}`}>{progress}%</span>
                        </div>
                      </div>
                    </button>

                    {/* ── Lesson List (inside this module card) ── */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-50">
                        {module.lessons.map((lesson, idx) => {
                          const isCompleted = lesson.isCompleted;
                          const isActive = currentLesson?.id === lesson.id;

                          return (
                            <div
                              key={lesson.id}
                              className={`group flex items-center justify-between pl-4 pr-4 py-2.5 transition-all duration-200 relative ${
                                isActive
                                  ? `${ACCENT.light} border-l-2 ${ACCENT.border}`
                                  : 'hover:bg-slate-50/70'
                              }`}
                            >
                              <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                                {/* Completion checkbox */}
                                <button
                                  onClick={() => toggleCompletion(lesson, isCompleted)}
                                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all cursor-pointer ${
                                    isCompleted
                                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                      : 'border-slate-300 bg-transparent text-transparent hover:border-slate-400'
                                  }`}
                                >
                                  {isCompleted && <Check size={10} className="stroke-[3.5]" />}
                                </button>

                                {/* Title + duration */}
                                <button
                                  onClick={() => {
                                    setCurrentLesson(lesson);
                                    navigate(`/classroom/${lesson.id}`);
                                  }}
                                  className="text-left flex-1 min-w-0 cursor-pointer"
                                >
                                  <p className={`text-[11px] font-bold truncate leading-snug ${
                                    isActive ? ACCENT.text : 'text-slate-600 group-hover:text-slate-900'
                                  }`}>
                                    {idx + 1}. {lesson.title}
                                  </p>
                                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                    {formatDuration(lesson.duration)}
                                  </span>
                                </button>
                              </div>

                              {/* Active ping indicator */}
                              {isActive && (
                                <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                  <span className={`absolute inline-flex h-full w-full rounded-full ${ACCENT.ring} opacity-60 animate-ping`} />
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${ACCENT.ring}`} />
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
          </>

        )}
      </div>

    </div>
  );
}