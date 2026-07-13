import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(' '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Incorrect credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12 select-none font-sans z-10">

      <div className="relative z-10 w-full max-w-[420px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-[0_20px_40px_rgba(31,38,135,0.07)]">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Welcome Back
            </h2>
            <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
              Authenticate to sync your curriculum progress
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-start gap-3 backdrop-blur-md">
              <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed text-rose-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <Mail size={16} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@crux.io"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-500 hover:text-indigo-600 transition-colors font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center group">
                <Lock size={16} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-4 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-xs font-medium text-slate-500">
              First time?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 transition-colors duration-200 ml-1 font-bold underline decoration-indigo-500/30 hover:decoration-indigo-500 underline-offset-4">
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}