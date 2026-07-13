import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Terminal, User, Menu, X, LayoutList, CreditCard, Search, LogOut, Settings, BookOpen, MoreHorizontal, LayoutDashboard, Code, PenTool, Play, Shield } from 'lucide-react';

const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const getUserColor = (name) => {
  if (!name) return 'bg-slate-200';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutList },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Pricing', path: '/pricing', icon: CreditCard },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-24 bg-transparent backdrop-blur-md flex items-center justify-between px-6 lg:px-16 transition-all duration-300">
      
      {/* Brand Identity */}
      <div className="pointer-events-auto">
        <Link to="/" className="flex items-center justify-center w-15 h-15 rounded-full bg-white hover:scale-105 transition-transform duration-200 shadow-md">
          <Terminal size={30} className="text-black-400 stroke-[4]" />
        </Link>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex pointer-events-auto items-center gap-8">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-[16px] font-bold tracking-wide transition-colors duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <link.icon size={20} className={isActive ? "text-indigo-500" : "text-slate-400"} />
              <span>{link.name}</span>
            </Link>
          );
        })}
        <button className="text-slate-400 hover:text-slate-900 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </nav>

      {/* Right Action & Search */}
      <div className="hidden md:flex pointer-events-auto items-center gap-6">
        <div className="relative pointer-events-auto">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className={`transition-colors ${searchOpen ? 'text-indigo-500' : 'text-slate-500 hover:text-slate-900'}`} 
            title="Search catalog"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>

          <AnimatePresence>
            {searchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-5 w-[360px] bg-[#110c2e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-5 flex flex-col z-50 overflow-hidden"
              >
                {/* Search Input Field */}
                <div className="flex items-center gap-3 bg-white/5 border border-indigo-500/30 rounded-full px-4 py-2.5 w-full transition-colors focus-within:border-indigo-500/70 focus-within:bg-white/10 shadow-inner shadow-white/5">
                  <Search size={16} className="text-indigo-400" />
                  <input 
                    type="text" 
                    placeholder="Search" 
                    autoFocus
                    className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full font-medium"
                  />
                </div>

                {/* Quick Links */}
                <div className="mt-6 flex flex-col">
                  <div className="flex items-center">
                    <span className="text-[11px] font-bold tracking-widest text-slate-400 mb-3 px-1">QUICK LINKS</span>
                    <div className="h-[1px] bg-white/10 flex-grow ml-3"></div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Link to="/classroom" onClick={() => setSearchOpen(false)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all duration-300">
                          <Code size={16} />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Level 1: AI Survival</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">Module</span>
                    </Link>

                    <Link to="/classroom" onClick={() => setSearchOpen(false)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300">
                          <Code size={16} />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Level 2: AI Professional</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">Module</span>
                    </Link>

                    <Link to="/classroom" onClick={() => setSearchOpen(false)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all duration-300">
                          <Code size={16} />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Level 3: AI Creator</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">Module</span>
                    </Link>
                    
                    <Link to="/classroom" onClick={() => setSearchOpen(false)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-full text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all duration-300">
                          <PenTool size={16} />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Level 4: AI Automator</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold px-2.5 py-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">Module</span>
                    </Link>
                  </div>
                </div>

                {/* Suggested Search */}
                <div className="mt-5 flex flex-col">
                  <div className="flex items-center">
                    <span className="text-[11px] font-bold tracking-widest text-slate-400 mb-3 px-1">SUGGESTED SEARCH</span>
                    <div className="h-[1px] bg-white/10 flex-grow ml-3"></div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Link to="/" onClick={() => setSearchOpen(false)} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2.5 rounded-2xl transition-all duration-200">
                      <LayoutList size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Home</span>
                    </Link>
                    <Link to="/classroom" onClick={() => setSearchOpen(false)} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2.5 rounded-2xl transition-all duration-200">
                      <Play size={18} className="text-slate-400 group-hover:text-fuchsia-400 transition-colors" />
                      <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Classroom</span>
                    </Link>
                    <Link to="/pricing" onClick={() => setSearchOpen(false)} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2.5 rounded-2xl transition-all duration-200">
                      <CreditCard size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">Pricing</span>
                    </Link>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {user ? (
          <div className="relative pointer-events-auto">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-white/20 transition-all hover:scale-105 shadow-sm ${user?.name ? `${getUserColor(user.name)} text-white` : 'bg-slate-200 text-slate-600'}`}
            >
              {user.name ? (
                <span className="text-[14px] font-bold tracking-wide">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={16} />
              )}
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-3xl border border-slate-200/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 flex flex-col z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email || 'user@example.com'}</p>
                  </div>
                  
                  <div className="p-2 flex flex-col gap-1">
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                        <Shield size={14} />
                        Admin Portal
                      </Link>
                    )}

                    <Link to="/classroom" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors">
                      <BookOpen size={14} />
                      My Courses
                    </Link>
                    <Link to="/billing" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors">
                      <CreditCard size={14} />
                      Billing & Payment
                    </Link>
                    <Link to="/settings" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors">
                      <Settings size={14} />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t border-slate-100">
                    <button onClick={() => { logout(); setUserDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <Link 
              to="/register" 
              className="text-[13px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full transition-colors shadow-md"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Pill Trigger */}
      <div className="md:hidden pointer-events-auto">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-3 text-slate-700 hover:text-slate-950 rounded-full bg-white/60 backdrop-blur-2xl border border-white/80 shadow-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Frosted Glass Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-24 left-6 right-6 pointer-events-auto bg-white/80 backdrop-blur-3xl border border-white rounded-3xl p-6 flex flex-col gap-3 md:hidden z-50 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-slate-950 py-3 px-4 rounded-2xl hover:bg-white/60 border border-transparent hover:border-white transition-all"
            >
              <link.icon size={18} className="text-violet-600" />
              {link.name}
            </Link>
          ))}
          <div className="h-[1px] bg-slate-200/80 my-2" />
          {user ? (
            <div className="flex flex-col gap-2 pt-1">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-indigo-950 py-3.5 px-4 rounded-2xl bg-indigo-50 border border-indigo-200"
                >
                  <span>Admin Portal</span>
                  <Shield size={16} className="text-indigo-600" />
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs font-bold text-violet-950 py-3.5 px-4 rounded-2xl bg-violet-50 border border-violet-200"
              >
                <span>Workspace: {user.name || 'Student'}</span>
                <User size={16} className="text-violet-600" />
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-2 text-xs font-bold text-red-600 py-3 rounded-xl bg-red-50 border border-red-100 shadow-sm"
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs text-center font-bold text-slate-700 py-3 rounded-xl bg-white/60 border border-white shadow-sm">
                Log in
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white text-xs font-black text-center py-3.5 rounded-xl shadow-lg shadow-fuchsia-500/25">
                Sign up
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
}