import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldAlert, ShieldCheck, Search, Loader2, ArrowLeft } from 'lucide-react';

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
      <div className="flex items-center justify-center py-32 bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs font-label tracking-widest text-slate-500 uppercase font-bold">Fetching Student Base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-canvas min-h-screen p-6 text-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col gap-4"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors font-label group"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Storefront</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Students</h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500 font-sans">Monitor enrollments, verify logs, and manage accounts.</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-ghost-border bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary"
            />
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/5 px-8 py-6 text-center text-red-700">
          {error}
        </div>
      )}

      {/* Student List Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-md bg-surface-container-lowest p-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-650">
            <thead>
              <tr className="border-b border-ghost-border">
                <th className="pb-3 pl-2 font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Student</th>
                <th className="pb-3 font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Status</th>
                <th className="pb-3 font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Last Activity</th>
                <th className="pb-3 pr-2 text-right font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => {
                  const isEven = i % 2 === 0;
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className={`transition-all duration-300 hover:bg-surface-container ${isEven ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}
                    >
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-label">
                            {student.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 font-sans">{student.name}</p>
                            <p className="text-xs text-slate-500 font-sans">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold font-label ${
                          student.is_suspended
                            ? 'bg-rose-500/10 text-rose-700'
                            : 'bg-emerald-500/10 text-emerald-700'
                        }`}>
                          {student.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 font-medium font-label">
                        {student.activity_logs_max_last_accessed_at
                          ? new Date(student.activity_logs_max_last_accessed_at).toLocaleString()
                          : 'No activity logs'}
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          onClick={() => handleToggleSuspension(student.id, student.is_suspended)}
                          disabled={updatingId === student.id}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all duration-300 border border-transparent ${
                            student.is_suspended
                              ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/20'
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500 font-medium font-sans">
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
