import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { FileText, ChevronLeft, CreditCard, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to fetch your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingId(orderId);
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download invoice', err);
      alert('Could not download invoice. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-amber-600 bg-amber-50 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-rose-600 bg-rose-50 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-slate-600 bg-slate-50 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-slate-900 pt-24 relative z-10 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase font-bold">Synchronizing Transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-900 pb-20 font-sans select-none z-10 overflow-hidden">
      {/* Ambient Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <main className="relative max-w-4xl mx-auto px-6 pt-32 z-10">
        
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-slate-500 hover:text-slate-900 hover:bg-white transition-all duration-300 shadow-sm"
          >
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Billing & Invoices
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Verify purchases and download cryptographically stamped invoices
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-start gap-3 backdrop-blur-md">
            <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed text-rose-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white/80 border border-slate-200 rounded-[32px] p-16 text-center space-y-4 shadow-sm backdrop-blur-xl">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CreditCard size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No Orders Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You haven't initiated any payment transactions yet. When you enroll in the masterclass, your invoice logs will populate here.
            </p>
            <Link to="/pricing" className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-lg cursor-pointer">
              Go to Pricing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-inner group-hover:scale-105 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Masterclass Invoice #{order.id}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><CreditCard size={12} /> {(order.gateway || 'Stripe').toUpperCase()}</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-black">${parseFloat(order.amount_total || 0).toFixed(2)} {order.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  {getStatusBadge(order.status)}

                  {order.status === 'paid' && (
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      disabled={downloadingId === order.id}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm disabled:opacity-75"
                    >
                      {downloadingId === order.id ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-white" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          <span>Invoice PDF</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
