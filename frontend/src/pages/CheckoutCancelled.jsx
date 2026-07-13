import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';

export default function CheckoutCancelled() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-800 px-6 relative z-10 font-sans select-none">
      {/* Ambient Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      
      <div className="relative w-full max-w-[420px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-xl">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 text-center">
          <div className="w-16 h-16 bg-amber-50 border border-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-6">
            <AlertCircle size={32} />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Checkout Cancelled
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
            Your transaction was not completed. No charges were made, and your enrollment remains pending. Let us know if you need any assistance!
          </p>

          <div className="flex gap-4">
            <Link
              to="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Back to Pricing</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
