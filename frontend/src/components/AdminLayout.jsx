import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Students', path: '/admin/students', icon: Users },
  { label: 'Curriculum', path: '/admin/curriculum', icon: BookOpen },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AVATAR_COLORS = [
  'bg-red-500/80', 'bg-orange-500/80', 'bg-amber-500/80', 'bg-green-500/80',
  'bg-emerald-500/80', 'bg-teal-500/80', 'bg-cyan-500/80', 'bg-blue-500/80',
  'bg-indigo-500/80', 'bg-violet-500/80', 'bg-purple-500/80', 'bg-fuchsia-500/80',
];

function getAvatarColor(name) {
  if (!name) return 'bg-slate-600';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AI';

  return (
    // 1. We define the true dark background here, at the absolute root of the layout.
    <div className="flex min-h-screen relative z-10 antialiased text-slate-300 bg-slate-950 overflow-hidden">

      {/* 2. Global Ambient Mesh Layer: This provides the subtle glow that the glass panels will blur. */}
      <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none -z-10"></div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-white/5 bg-white/[0.02] backdrop-blur-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Shield size={16} className="text-indigo-400" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-slate-100">Admin Portal</span>

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 text-slate-500 hover:text-slate-300 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isActive
                  ? 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/20 shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'} />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-indigo-400/70" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/5 p-4 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 border border-white/10 items-center justify-center rounded-full text-[13px] font-bold text-slate-100 shadow-inner ${getAvatarColor(user?.name)}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-bold tracking-wide text-slate-100">{user?.name || "Instructor"}</p>
              <p className="truncate text-[11px] font-medium text-slate-500">{user?.email || "admin@system.com"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-slate-500 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      {/* 3. CRITICAL FIX: The main container must be transparent to let the ambient mesh show through. */}
      <div className="flex flex-1 flex-col min-w-0 bg-transparent">
        
        {/* Top header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-white/[0.01] px-4 backdrop-blur-xl lg:px-8 z-20 sticky top-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all duration-300 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
            <span className="hidden sm:inline tracking-wide">Signed in as</span>
            <span className="font-bold text-slate-200 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5 shadow-sm">{user?.name || "Instructor"}</span>
          </div>
        </header>

        {/* Page content */}
        {/* 4. CRITICAL FIX: The wrapper around the Outlet must be transparent. */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}