import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Award, Play } from 'lucide-react';

export default function CheckoutSuccess() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Re-verify the session to pull the updated 'has_purchased' flag
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-800 px-6 relative z-10 font-sans select-none">
      {/* Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      
      <div className="relative w-full max-w-[440px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-2xl">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 text-center">
          
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-6">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Enrollment Verified
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
            Your transaction has been securely processed. You now have lifetime access to the masterclass curriculum, developer starter kits, and Completion Certificate.
          </p>

          <div className="bg-slate-900/5 rounded-2xl p-4 border border-slate-900/5 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Play size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">Active Workspace Unlocked</h4>
                <p className="text-[10px] text-slate-400 font-bold">29 lessons · 4 modules of video content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Award size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">Credential Pipeline Initialized</h4>
                <p className="text-[10px] text-slate-400 font-bold">Cryptographically signed completion certificate</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/classroom"
              className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
            >
              Start Learning Now
            </Link>
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
