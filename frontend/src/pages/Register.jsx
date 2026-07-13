import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(' '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12 select-none font-sans z-10">

      <div className="relative z-10 w-full max-w-[440px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-[0_20px_40px_rgba(31,38,135,0.07)] my-8">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Create Account
            </h2>
            <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
              Register to access the developer training program
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
              <label htmlFor="name" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                Full Name
              </label>
              <div className="relative flex items-center group">
                <User size={16} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
              </div>
            </div>

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
                  placeholder="name@domain.com"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                Password
              </label>
              <div className="relative flex items-center group">
                <Lock size={16} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                Confirm Password
              </label>
              <div className="relative flex items-center group">
                <Lock size={16} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-12 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-4 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  {showPasswordConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-4 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-xs font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors duration-200 ml-1 font-bold underline decoration-indigo-500/30 hover:decoration-indigo-500 underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}