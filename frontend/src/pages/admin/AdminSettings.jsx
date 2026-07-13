import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ShieldAlert, Loader2, Check } from 'lucide-react';

export default function AdminSettings() {
  const [signupsEnabled, setSignupsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [adminNotificationEmail, setAdminNotificationEmail] = useState('admin@test.com');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-slate-950 min-h-screen text-slate-300">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Settings</h1>
        <p className="mt-1.5 text-sm font-medium text-slate-400">Configure global application variables and security gates.</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Settings Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="md:col-span-8 rounded-2xl border border-white/10 bg-transparent p-6 space-y-6"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-[16px] text-slate-100">Platform Settings</h3>
            
            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">Notification Email</label>
              <input
                type="email"
                value={adminNotificationEmail}
                onChange={(e) => setAdminNotificationEmail(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 px-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.05] focus:shadow-xs"
              />
            </div>

            {/* Signup Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Registration Status</h4>
                <p className="text-xs text-slate-400 mt-0.5">Control whether new students are allowed to sign up.</p>
              </div>
              <button
                onClick={() => setSignupsEnabled(!signupsEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 outline-none ${
                  signupsEnabled ? 'bg-indigo-600' : 'bg-white/10 border border-white/5'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-250 ${
                  signupsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Maintenance Mode</h4>
                <p className="text-xs text-slate-400 mt-0.5">Lock down student access to perform system database upgrades.</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 outline-none ${
                  maintenanceMode ? 'bg-indigo-600' : 'bg-white/10 border border-white/5'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-250 ${
                  maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-all duration-200"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Saved
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Security Warning side block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="md:col-span-4 rounded-2xl border border-rose-500/15 bg-rose-500/[0.02] p-6 backdrop-blur-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-bold text-[15px] text-rose-200">Security Checklist</h3>
            <p className="text-xs text-rose-350 leading-relaxed">
              Always restrict notification routing to vetted email domains. Toggling Maintenance Mode will terminate student websocket pings and force student redirect logs instantly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
