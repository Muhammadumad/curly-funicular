import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.get('/sanctum/csrf-cookie');
      const res = await api.post('/api/forgot-password', { email });
      if (res.status === 200) {
        setIsSent(true);
      }
    } catch (err) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to dispatch recovery link. Please try again.');
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
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                    Enter your email to receive a recovery link
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-start gap-3 backdrop-blur-md">
                    <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium leading-relaxed text-rose-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-slate-900 text-white font-bold py-3.5 rounded-2xl text-xs transition-all duration-300 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                    ) : (
                      <>
                        <span>Send Recovery Transmission</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
                  <p className="text-xs text-slate-400 font-medium">
                    Remember password?{' '}
                    <Link to="/login" className="text-indigo-500 hover:text-indigo-600 transition-colors font-bold">
                      Back to Login
                    </Link>
                  </p>
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
                  Link Dispatched
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
                  A secure recovery transmission has been sent to <span className="font-bold text-slate-800">{email}</span>.
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
