import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Lock, AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.post('/api/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.status === 200) {
        setIsSuccess(true);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(' '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. The link may have expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12 select-none font-sans z-10">
      <div className="relative z-10 w-full max-w-[420px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-[0_20px_40px_rgba(31,38,135,0.07)]">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                    New Password
                  </h2>
                  <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                    Set a new password for account recovery
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
                    <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                      New Password
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
                        className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-12 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="passwordConfirmation" className="block text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">
                      Confirm New Password
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
                        className="w-full rounded-2xl bg-white/50 border border-slate-200 pl-11 pr-12 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPasswordConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-xs transition-all duration-300 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
                  <Link to="/login" className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors font-bold">
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto shadow-inner mb-6">
                  <CheckCircle2 size={32} />
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                  Password Updated
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
                  Your credentials have been securely updated. You can now authenticate.
                </p>

                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-xs transition-all duration-300 hover:bg-slate-800 shadow-md cursor-pointer"
                >
                  Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
