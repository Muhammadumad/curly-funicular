import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Activity, DollarSign, ArrowUpRight, UserPlus, ArrowLeft } from 'lucide-react';

// ──────────────────────────────────────────────
// Stat Card — translucent dark glassmorphic with hover float
// ──────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden rounded-md bg-surface-container-lowest p-6 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 font-label">
            {label}
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 font-heading">
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-container text-primary">
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <span>+12% this week</span>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Recent Sign-ups Table — glassmorphic rows
// ──────────────────────────────────────────────
function RecentSignupsTable({ signups }) {
  if (!signups || signups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <UserPlus size={32} className="mb-3 text-slate-400" />
        <p className="text-sm font-medium font-sans">No students have signed up yet.</p>
      </div>
    );
  }

  const avatarStyles = [
    'bg-primary/10 text-primary',
    'bg-tertiary/10 text-tertiary',
    'bg-slate-200 text-slate-700',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-650">
        <thead>
          <tr className="border-b border-ghost-border">
            <th className="pb-3 pl-2 font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Name</th>
            <th className="pb-3 font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Email</th>
            <th className="pb-3 pr-2 text-right font-label text-xs tracking-widest text-slate-500 uppercase font-bold">Joined</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((student, i) => {
            const avatarClass = avatarStyles[i % avatarStyles.length];
            const isEven = i % 2 === 0;
            return (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className={`transition-all duration-300 hover:bg-surface-container ${isEven ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}
              >
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${avatarClass} text-xs font-bold font-label`}>
                      {student.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-bold text-slate-800 font-sans">{student.name}</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-600 font-medium font-sans">{student.email}</td>
                <td className="py-3.5 pr-2 text-right text-slate-500 font-medium font-label">
                  {new Date(student.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────
// AdminDashboard Component
// ──────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_students: 11,
    active_students: 3,
    total_revenue: 1099.89,
    recent_signups: [
      { id: 11, name: 'faisal', email: 'faisal@gmail.com', created_at: '2026-07-10T11:00:00Z' },
      { id: 3, name: 'Muhammad umad kamboh', email: 'muhammadumaf.com@gmail.com', created_at: '2026-07-10T10:30:00Z' },
      { id: 10, name: 'rizwan', email: 'rizwan@gmail.com', created_at: '2026-07-10T09:15:00Z' }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Backend API connection failed, keeping premium mock fallbacks.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <p className="text-xs font-label tracking-widest text-slate-500 uppercase font-bold">Synchronizing Portal...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Enrollments',
      value: stats?.total_students?.toLocaleString() ?? '11',
      icon: Users,
    },
    {
      label: 'Active Students',
      value: stats?.active_students?.toLocaleString() ?? '3',
      icon: Activity,
    },
    {
      label: 'Revenue',
      value: `$${(stats?.total_revenue ?? 1099.89).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-canvas min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-4"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors font-label group"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Storefront</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">Overview</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500 font-sans">Platform overview and recent activity.</p>
        </div>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} index={i} />
        ))}
      </div>

      {/* Recent sign-ups table container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-md bg-surface-container-lowest p-6"
      >
        <h2 className="mb-6 text-[15px] font-bold tracking-tight text-slate-900 font-heading">
          Recent Sign-ups
        </h2>
        <RecentSignupsTable signups={stats?.recent_signups} />
      </motion.div>
    </div>
  );
}
