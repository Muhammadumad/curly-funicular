import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Minus, Plus } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    title: 'BASIC',
    price: 'Free',
    subtitle: 'Trial',
    features: [
      { name: 'Free courses', included: true },
      { name: '5 Premium Videos', included: true },
      { name: 'Notify me, Favorite', included: true },
    ],
    buttonText: 'Sign Up',
    glow: 'from-blue-200 to-indigo-200'
  },
  {
    name: 'Pro',
    title: 'PRO AT 50%',
    price: '$5',
    subtitle: 'per month, billed annually',
    features: [
      { name: 'Full course access (29 lessons)', included: true },
      { name: 'Source files, ePub', included: true },
      { name: 'Certificate of completion', included: true },
      { name: 'All 4 modules unlocked', included: true },
      { name: 'Downloadable resources', included: true },
      { name: 'Lifetime access', included: true },
    ],
    buttonText: 'Subscribe',
    glow: 'from-fuchsia-200 to-violet-200',
    popular: true
  },
  {
    name: 'Team',
    title: 'TEAM',
    price: '$15',
    subtitle: 'per member, per month,\nbilled annually',
    features: [
      { name: '5 users', included: true, custom: true },
      { name: 'Manage subscriptions', included: true },
      { name: 'Team progress', included: true },
    ],
    buttonText: 'Subscribe',
    glow: 'from-cyan-200 to-blue-200'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('Annual');

  // --- CONFETTI & FIREWORKS ENGINE ---
  const triggerConfetti = (isMassive = false) => {
    if (isMassive) {
      // Massive celebration burst on Subscribe
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } else {
      // Light celebratory spark when toggling monthly/annual
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
    }
  };

  const handleBillingToggle = (cycle) => {
    if (cycle !== billingCycle) {
      setBillingCycle(cycle);
      triggerConfetti(false);
    }
  };

  return (
    <div className="relative w-full pt-32 pb-24 px-6 md:px-12 z-10 flex flex-col items-center select-none font-sans">
      
      <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 drop-shadow-sm">
          Pricing Plans
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Get full access to the 28-Day AI Challenge masterclass, all modules, downloads, certificate and priority support.
        </p>
      </div>

      {/* Interactive Billing Toggle with Dopamine Feedback */}
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full p-1.5 mb-16 shadow-md border border-slate-200 relative z-10">
        <button 
          onClick={() => handleBillingToggle('Monthly')}
          className={`px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer ${billingCycle === 'Monthly' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Monthly
        </button>
        <button 
          onClick={() => handleBillingToggle('Annual')}
          className={`px-6 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${billingCycle === 'Annual' ? 'bg-indigo-600 text-white shadow-md scale-105' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <span>Annual</span>
          <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">47% OFF</span>
        </button>
      </div>

      {/* Isometric Plan Cards */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto mb-24 relative z-10">
        {PLANS.map((plan) => (
          <motion.div 
            key={plan.name}
            className="relative group w-[330px] h-[520px]"
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className={`absolute -inset-[1px] rounded-[33px] bg-gradient-to-br ${plan.glow} opacity-0 group-hover:opacity-100 blur-[4px] transition-opacity duration-500 -z-10`} />

            <div className="relative w-full h-full rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white shadow-xl p-8 flex flex-col justify-between overflow-hidden z-10">
              <div className="flex flex-col items-center text-center relative z-10">
                <h3 className="text-xs font-black tracking-widest text-slate-400 mb-6 uppercase">{plan.title}</h3>
                
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-lg animate-pulse">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-5xl font-black text-slate-900 mb-2">{plan.price}</div>
                <p className="text-[11px] font-bold text-slate-500 min-h-[32px] whitespace-pre-line">{plan.subtitle}</p>

                <div className="w-full h-[1px] bg-slate-100 my-6" />

                <ul className="w-full space-y-4 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="flex-1">{feature.name}</span>
                      {feature.custom && (
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
                          <Minus size={12} className="cursor-pointer hover:text-slate-700" />
                          <Plus size={12} className="cursor-pointer hover:text-slate-700" />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6">
                <button 
                  onClick={() => triggerConfetti(true)}
                  className={`w-full py-4 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md hover:shadow-xl cursor-pointer ${plan.popular ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white hover:scale-[1.02]' : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}