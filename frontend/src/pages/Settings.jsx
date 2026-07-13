import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Percent, 
  LogOut, 
  User, 
  Link as LinkIcon, 
  AlignLeft, 
  Mail, 
  Lock, 
  ArrowUpRight,
  CheckCircle
} from 'lucide-react';

const Twitter = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

  const getSavedProfile = () => {
    try {
      const savedProfile = localStorage.getItem('user_profile_mock');
      return savedProfile ? JSON.parse(savedProfile) : {};
    } catch {
      return {};
    }
  };

  const [name, setName] = useState(user?.name || '');
  const [twitter, setTwitter] = useState(() => getSavedProfile().twitter || '');
  const [website, setWebsite] = useState(() => getSavedProfile().website || '');
  const [description, setDescription] = useState(() => getSavedProfile().description || '');

  const [email, setEmail] = useState(user?.email || '');
  const [password] = useState('******');
  const [notification, setNotification] = useState(null);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const profileData = { twitter, website, description };
    localStorage.setItem('user_profile_mock', JSON.stringify(profileData));
    showToast('Profile settings saved successfully!');
  };

  const handleResetPassword = () => {
    showToast('Password reset link sent to your email!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      showToast('Account successfully deleted.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    }
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="relative min-h-screen text-slate-900 pt-28 pb-20 px-4 md:px-8 flex items-center justify-center font-sans select-none z-10">
      
      <div className="relative z-10 w-full max-w-5xl rounded-[32px] border border-white/20 shadow-[0_20px_40px_rgba(31,38,135,0.07)]">
        <div className="w-full h-full rounded-[31px] bg-transparent overflow-hidden flex flex-col md:flex-row min-h-[680px]">
        
        {notification && (
          <div className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-violet-500 text-white px-4 py-2.5 rounded-2xl font-bold shadow-lg animate-bounce text-xs">
            <CheckCircle size={16} />
            {notification}
          </div>
        )}

        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200/50 bg-transparent p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                activeTab === 'settings' 
                  ? 'text-slate-900 bg-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <SettingsIcon size={16} className={activeTab === 'settings' ? 'text-violet-600' : ''} />
              Settings
            </button>
            
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                activeTab === 'billing' 
                  ? 'text-slate-900 bg-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CreditCard size={16} className={activeTab === 'billing' ? 'text-violet-600' : ''} />
              Billing
            </button>

            <button 
              onClick={() => setActiveTab('discounts')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                activeTab === 'discounts' 
                  ? 'text-slate-900 bg-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Percent size={16} className={activeTab === 'discounts' ? 'text-violet-600' : ''} />
              Discounts
            </button>
          </div>

          <div className="mt-8 md:mt-0 pt-4 border-t border-white/30 md:border-none">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-2xl transition-all duration-300"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[85vh] md:max-h-[750px]">
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black tracking-wider uppercase text-slate-900">Edit Profile</h2>
                <p className="text-slate-500 text-xs mt-1">Manage your Design+Code profile and account</p>
              </div>

              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white/60 border border-white/300 flex items-center justify-center text-slate-500 shadow-inner relative overflow-hidden">
                  {user?.name ? (
                    <span className="text-xl font-bold text-violet-600">{user.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <button className="bg-white/90 border border-slate-200 hover:border-violet-400 text-slate-900 hover:text-violet-600 text-[10px] tracking-wider font-extrabold px-4 py-2 rounded-full transition-all duration-300 uppercase shadow-md">
                  Change Avatar
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                <div className="flex flex-col gap-5">
                  <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Profile Settings</h3>
                  
                  <div className="h-12 pl-2 pr-4 flex items-center gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600">
                      <User size={14} className="text-violet-600" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0"
                    />
                  </div>

                  <div className="h-12 pl-2 pr-4 flex items-center gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600">
                      <Twitter size={14} className="text-violet-600" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Your Twitter handle" 
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0"
                    />
                  </div>

                  <div className="h-12 pl-2 pr-4 flex items-center gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600">
                      <LinkIcon size={14} className="text-violet-600" />
                    </div>
                    <input 
                      type="url" 
                      placeholder="Your website" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0"
                    />
                  </div>

                  <div className="pl-2 pr-4 py-2 flex items-start gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300 min-h-[90px]">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600 flex-shrink-0">
                      <AlignLeft size={14} className="text-violet-600" />
                    </div>
                    <textarea 
                      placeholder="Your description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0 resize-none mt-1.5"
                    />
                  </div>

                  <div className="mt-4">
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black text-xs px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 select-none cursor-pointer tracking-wider"
                    >
                      SAVE SETTINGS
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex flex-col gap-5">
                    <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Account Settings</h3>
                    
                    <div className="h-12 pl-2 pr-4 flex items-center gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600">
                        <Mail size={14} className="text-violet-600" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0"
                      />
                    </div>

                    <div className="h-12 pl-2 pr-4 flex items-center gap-3 bg-white/50 border border-white/300 rounded-2xl focus-within:border-violet-400 transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-white/80 border border-white/30 flex items-center justify-center text-slate-600">
                        <Lock size={14} className="text-violet-600" />
                      </div>
                      <input 
                        type="text" 
                        readOnly
                        value={password}
                        className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-xs w-full focus:ring-0 cursor-default"
                      />
                    </div>

                    <div>
                      <button 
                        type="button"
                        onClick={handleResetPassword}
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black text-xs px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 select-none cursor-pointer tracking-wider"
                      >
                        RESET PASSWORD
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="border-t border-slate-200/50 pt-8 flex flex-col gap-4">
                <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Delete Account</h3>
                <p className="text-slate-500 text-xs max-w-lg leading-relaxed">
                  Your account will be permanently deleted along with its data. You will lose all of your progresses, favorites, certificates, history and profile information.
                </p>
                <div>
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-gradient-to-r from-[#ef4444] to-[#f43f5e] text-white font-black text-xs px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 select-none cursor-pointer tracking-wider"
                  >
                    DELETE ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black tracking-wider uppercase text-slate-900">Billing Details</h2>
                <p className="text-slate-500 text-xs mt-1">View plan information and transaction invoices</p>
              </div>

              <div className="bg-white/50 border border-white/300 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-violet-600">PRO Membership Plan</h4>
                  <p className="text-xs text-slate-500 mt-1">Renews automatically on Oct 14, 2026</p>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 text-violet-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                  Active
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Invoice History</h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { date: 'June 14, 2026', desc: 'Design+Code Pro Plan - Monthly', price: '$19.00' },
                    { date: 'May 14, 2026', desc: 'Design+Code Pro Plan - Monthly', price: '$19.00' },
                    { date: 'April 14, 2026', desc: 'Design+Code Pro Plan - Monthly', price: '$19.00' },
                  ].map((inv, idx) => (
                    <div key={idx} className="h-14 px-4 flex items-center justify-between bg-white/30 border border-white/30 rounded-2xl hover:bg-white/60 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{inv.desc}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-violet-600">{inv.price}</span>
                        <button className="p-1 rounded bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100/10 transition-colors">
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discounts' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black tracking-wider uppercase text-slate-900">Discounts & Promos</h2>
                <p className="text-slate-500 text-xs mt-1">Claim discount offers or manage redeem codes</p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Apply Promo Code</label>
                <div className="flex gap-3 max-w-md">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code (e.g. HALFOFF)" 
                    className="flex-1 h-12 px-4 bg-white/50 border border-white/300 rounded-2xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-violet-400 focus:ring-0 transition-colors"
                  />
                  <button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-black text-xs px-6 py-3 rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 select-none cursor-pointer">
                    REDEEM
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Special Offers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white/40 border border-violet-500/20 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <span className="text-[9px] font-black tracking-wider text-violet-600 bg-violet-500/10 px-2 py-0.5 rounded-md uppercase self-start">Special Student Promo</span>
                    <h4 className="text-sm font-extrabold text-slate-900">Get 50% Off Annual Membership</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-1">Verify your student status with school email to avail 50% discount on yearly plans.</p>
                  </div>
                  
                  <div className="p-5 bg-white/40 border border-white/30 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                    <span className="text-[9px] font-black tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-md uppercase self-start">Legacy User</span>
                    <h4 className="text-sm font-extrabold text-slate-900">Upgrade Special: 3 Months Free</h4>
                    <p className="text-[11px] text-slate-500 leading-normal mt-1">Legacy basic accounts can upgrade to Pro annual plan today and get 3 extra months completely free.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      </div>
    </div>
  );
}   