import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { ShieldAlert, ShieldCheck, Search, Loader2 } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/api/admin/students');
        if (res.data && res.data.data) {
          const list = res.data.data.data || res.data.data;
          setStudents(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleToggleSuspension = async (id, isSuspended) => {
    setUpdatingId(id);
    try {
      const action = isSuspended ? 'unsuspend' : 'suspend';
      await api.patch(`/api/admin/students/${id}/${action}`);
      setStudents(prev =>
        prev.map(student =>
          student.id === id ? { ...student, is_suspended: !isSuspended } : student
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || `Failed to update student status.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(search.toLowerCase()) ||
    student.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase">Fetching Student Base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-slate-950 min-h-screen text-slate-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Students</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-400">Monitor enrollments, verify logs, and manage accounts.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-white/5 bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] focus:shadow-xs"
          />
        </div>
      </motion.div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-6 text-center text-red-400">
          {error}
        </div>
      )}

      {/* Student List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl shadow-xs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-3 pl-2 font-mono text-xs tracking-widest text-slate-500 uppercase">Student</th>
                <th className="pb-3 font-mono text-xs tracking-widest text-slate-500 uppercase">Status</th>
                <th className="pb-3 font-mono text-xs tracking-widest text-slate-500 uppercase">Last Activity</th>
                <th className="pb-3 pr-2 text-right font-mono text-xs tracking-widest text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b border-white/[0.01] transition-all duration-300 hover:bg-white/[0.02]"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-xs font-bold text-indigo-300 border border-white/5">
                          {student.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-semibold tracking-wide text-slate-200">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        student.is_suspended
                          ? 'bg-rose-500/10 text-rose-400/90 border border-rose-500/10'
                          : 'bg-emerald-500/10 text-emerald-400/90 border border-emerald-500/10'
                      }`}>
                        {student.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400 font-medium">
                      {student.activity_logs_max_last_accessed_at
                        ? new Date(student.activity_logs_max_last_accessed_at).toLocaleString()
                        : 'No activity logs'}
                    </td>
                    <td className="py-4 pr-2 text-right">
                      <button
                        onClick={() => handleToggleSuspension(student.id, student.is_suspended)}
                        disabled={updatingId === student.id}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-300 border border-transparent ${
                          student.is_suspended
                            ? 'bg-emerald-500/10 text-emerald-400/80 hover:bg-emerald-500/20 hover:border-emerald-500/10'
                            : 'bg-rose-500/10 text-rose-400/80 hover:bg-rose-500/20 hover:border-rose-500/10'
                        }`}
                      >
                        {updatingId === student.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : student.is_suspended ? (
                          <>
                            <ShieldCheck size={14} />
                            Unsuspend
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={14} />
                            Suspend
                          </>
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500 font-medium">
                    No students matched search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
