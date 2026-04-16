import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Mail, LogOut, Sparkles, Heart, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const steps = [
  {
    icon: '✅',
    title: 'Account Created',
    desc: 'You successfully joined the ChurchMatch community.',
    done: true,
  },
  {
    icon: '👤',
    title: 'Profile Completed',
    desc: 'Your identity and spiritual values are set.',
    done: true,
  },
  {
    icon: '🔍',
    title: 'Final Verification',
    desc: 'Our team is reviewing your account for safety.',
    done: false,
  },
];

const PendingDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [teasers, setTeasers] = useState([]);
  const [loadingTeasers, setLoadingTeasers] = useState(true);

  useEffect(() => {
    const fetchTeasers = async () => {
      try {
        const res = await api.get('/matches');
        setTeasers(res.data.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Failed to fetch teasers', err);
      } finally {
        setLoadingTeasers(false);
      }
    };
    fetchTeasers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Status & Steps */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Status Card */}
          <div className="card p-8 text-center bg-white shadow-xl shadow-slate-200/50">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
               <CheckCircle size={40} className="text-emerald-500" />
               <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Profile Submitted!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Great job, <span className="font-bold text-primary-500">{user?.profile?.name || user?.email}</span>. 
              The community is getting ready for you.
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
              <Clock className="text-amber-600 mt-1 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-900 leading-none mb-1">Estimated Wait</p>
                <p className="text-xs text-amber-700 font-medium">Under 24 hours</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="card p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Verification Journey</h2>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                    step.done ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="pt-1">
                    <h3 className={`font-bold text-sm ${step.done ? 'text-emerald-600' : 'text-slate-900'}`}>{step.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleLogout} className="btn-secondary w-full py-4 flex items-center justify-center gap-2">
            <LogOut size={18} /> Sign Out
          </button>
        </motion.div>

        {/* Right Column: Sneak Peek Teasers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card p-8 bg-slate-900 text-white min-h-[500px] flex flex-col relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
             
             <div className="relative z-10 flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-2xl font-black flex items-center gap-3">
                      Community Sneak Peek <Sparkles size={24} className="text-primary-400" />
                   </h2>
                   <p className="text-slate-400 font-medium">Connectable believers are waiting...</p>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold backdrop-blur-md">
                   {teasers.length}+ Active Members
                </div>
             </div>

             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
               {loadingTeasers ? (
                 <div className="col-span-2 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-400" size={40} />
                 </div>
               ) : (
                 teasers.map((match, idx) => (
                   <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all cursor-not-allowed"
                   >
                     <div className="aspect-[4/3] relative blur-md grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                           <Heart size={48} className="text-white/20" />
                        </div>
                     </div>
                     <div className="p-5 relative">
                        <div className="absolute -top-6 left-5 px-3 py-1 bg-primary-500 text-white text-[10px] font-black rounded-full shadow-lg">
                           {match.score}% MATCH
                        </div>
                        <h4 className="font-bold text-slate-300 blur-[2px] mb-1">Hidden Potential</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                           <ShieldCheck size={12} className="text-primary-400" /> Verified Member
                        </p>
                     </div>
                     {/* Lock Overlay */}
                     <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                        <div className="bg-white/95 text-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                           <Eye size={14} /> Unlock After Approval
                        </div>
                     </div>
                   </motion.div>
                 ))
               )}
             </div>

             <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                   "Your eyes shall see your teachers..." 
                   <span className="block italic text-slate-500 text-xs mt-1">— Isaiah 30:20</span>
                </p>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PendingDashboard;
