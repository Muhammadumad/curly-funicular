import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { BookOpen, Video, Edit2, Save, Loader2 } from 'lucide-react';

export default function AdminCurriculum() {
  const [course, setCourse] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get('/api/courses/28-day-ai-challenge');
        const courseDataFromAPI = res.data;

        // Add helper duration labels to the modules and lessons
        const updatedModules = (courseDataFromAPI.modules || []).map(mod => ({
          ...mod,
          lessons: (mod.lessons || []).map(les => {
            const minutes = Math.floor(les.duration_in_seconds / 60);
            const seconds = les.duration_in_seconds % 60;
            return {
              ...les,
              duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            };
          })
        }));

        const updatedCourse = {
          ...courseDataFromAPI,
          modules: updatedModules,
        };

        setCourse(updatedCourse);
        if (updatedModules.length > 0) {
          setActiveModuleId(prev => prev ?? updatedModules[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch course curriculum', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [refreshKey]);

  const activeModule = course?.modules?.find(m => m.id === activeModuleId);

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.duration);
  };

  const handleSaveLesson = async () => {
    setSaving(true);
    try {
      // Parse MM:SS to seconds
      const parts = lessonDuration.split(':');
      const minutes = parseInt(parts[0] || '0', 10);
      const seconds = parseInt(parts[1] || '0', 10);
      const totalSeconds = minutes * 60 + seconds;

      await api.put(`/api/admin/lessons/${editingLessonId}`, {
        title: lessonTitle,
        duration_in_seconds: totalSeconds,
      });

      // Refresh course list from database
      setRefreshKey(prev => prev + 1);
      setEditingLessonId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lesson details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Loading Course Syllabus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-slate-950 text-slate-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Curriculum</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-400">Add, edit, and organize lessons inside the 28-day challenge.</p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Modules Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">Modules</span>
          </div>

          <div className="space-y-2">
            {(course?.modules || []).map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleId(mod.id);
                  setEditingLessonId(null);
                }}
                className={`w-full flex items-center justify-between rounded-xl p-4 text-left border transition-all duration-300 ${
                  activeModuleId === mod.id
                    ? 'bg-indigo-500/15 border-indigo-500/20 text-indigo-200 shadow-sm'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                }`}
              >
                <div>
                  <h3 className="font-bold text-[14px]">{mod.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{(mod.lessons || []).length} Lessons • {mod.duration || 'N/A'}</p>
                </div>
                <BookOpen size={16} className={activeModuleId === mod.id ? 'text-indigo-300' : 'text-slate-500'} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lessons List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-8 space-y-4"
        >
          {activeModule && (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">{activeModule.title} — Lessons</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-transparent p-6 space-y-3">
                <AnimatePresence mode="popLayout">
                  {(activeModule.lessons || []).map((lesson, i) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="flex items-center justify-between rounded-xl border border-white/[0.02] bg-white/[0.01] p-4 hover:bg-white/[0.04] transition-all duration-300 group"
                    >
                      <div className="flex-1 flex items-center gap-3 pr-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/5 text-slate-400">
                          <Video size={16} />
                        </div>
                        
                        {editingLessonId === lesson.id ? (
                          <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={lessonTitle}
                              onChange={(e) => setLessonTitle(e.target.value)}
                              className="flex-grow rounded-lg border border-white/10 bg-slate-900 px-3 py-1 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/50"
                            />
                            <input
                              type="text"
                              value={lessonDuration}
                              onChange={(e) => setLessonDuration(e.target.value)}
                              className="w-20 rounded-lg border border-white/10 bg-slate-900 px-3 py-1 text-sm text-center text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/50"
                            />
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-200">{lesson.title}</h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{lesson.duration}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {editingLessonId === lesson.id ? (
                          <button
                            onClick={handleSaveLesson}
                            disabled={saving}
                            className="rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 p-2 border border-indigo-500/20 hover:border-indigo-500/30 transition-colors"
                          >
                            {saving ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 p-2 border border-white/5 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
