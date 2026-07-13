import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AlertCircle, CreditCard, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mockTransactionId = searchParams.get('mock_transaction_id');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!mockTransactionId);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (mockTransactionId) {
      return;
    }

    const startCheckout = async () => {
      try {
        const response = await api.post('/api/checkout/session');
        const { checkout_url } = response.data;
        if (checkout_url) {
          window.location.replace(checkout_url);
        } else {
          throw new Error('Checkout URL not returned from server.');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        if (err.response?.data?.already_purchased) {
          navigate('/dashboard');
        } else {
          setError(err.response?.data?.message || 'Unable to establish secure checkout session. Please try again.');
          setLoading(false);
        }
      }
    };

    startCheckout();
  }, [user, authLoading, navigate, mockTransactionId]);

  if (mockTransactionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-800 px-6 relative z-10 font-sans select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
        
        <div className="relative w-full max-w-[450px] rounded-[32px] p-[1px] bg-gradient-to-b from-indigo-500/20 via-violet-500/20 to-purple-500/10 shadow-2xl">
          <div className="relative w-full rounded-[31px] bg-white/70 backdrop-blur-2xl p-8 sm:p-10 border border-indigo-100 text-center">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-6 animate-pulse">
              <CreditCard size={32} />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 mb-4 uppercase tracking-widest font-mono">
              Developer Sandbox
            </span>
            
            <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Local Mock Payment</h2>
            <p className="text-xs text-slate-500 font-bold max-w-xs mx-auto mb-6">
              Paddle is unconfigured in development. Use this developer interface to simulate webhook and payment resolution.
            </p>

            <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/50 text-left mb-8 font-mono text-[10px] text-slate-600 space-y-1.5 break-all">
              <div><strong>Gateway:</strong> Paddle Billing (Mock)</div>
              <div><strong>Transaction ID:</strong> {mockTransactionId}</div>
              <div><strong>User ID:</strong> {user?.id} ({user?.email})</div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    await api.post('/api/checkout/mock-complete', { transaction_id: mockTransactionId });
                    navigate('/checkout/success');
                  } catch (err) {
                    console.error(err);
                    setError(err.response?.data?.message || 'Failed to complete mock transaction.');
                    setLoading(false);
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer"
              >
                Simulate Successful Payment
              </button>
              
              <button
                onClick={() => navigate('/checkout/cancelled')}
                className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
              >
                Simulate Cancelled Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] text-slate-800 px-6 relative z-10 font-sans select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
        <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-xl border border-white p-10 rounded-[32px] shadow-xl text-center max-w-sm">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 rounded-2xl shadow-inner mb-2 animate-pulse">
            <CreditCard size={28} />
          </div>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600/20 border-t-indigo-600"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Securing Connection</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider font-mono">Redirecting to Paddle Merchant of Record</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-800 px-6 relative z-10 font-sans select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10" />
      
      <div className="relative w-full max-w-[420px] rounded-[32px] p-[1px] bg-gradient-to-b from-white/60 via-white/30 to-white/10 shadow-xl">
        <div className="relative w-full rounded-[31px] bg-white/40 backdrop-blur-xl p-8 sm:p-10 border border-white/60 text-center">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Checkout Error</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
            {error}
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
