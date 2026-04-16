import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Mail, LogOut, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    icon: '✅',
    title: 'Account Created',
    desc: 'You successfully joined the ChurchMatch community.',
    done: true,
  },
  {
    icon: '🔍',
    title: 'Profile Under Review',
    desc: 'Our team is reviewing your account to maintain a safe, faith-centered community.',
    done: false,
  },
  {
    icon: '💌',
    title: 'Notification',
    desc: "You'll be notified by email once your account is approved.",
    done: false,
  },
  {
    icon: '🎉',
    title: 'Start Matching',
    desc: 'Once approved, discover divine connections and start your journey.',
    done: false,
  },
];

const PendingDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Hero Card */}
        <div className="card p-8 text-center mb-6 shadow-xl shadow-slate-200/50">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Clock size={40} className="text-primary-500" />
          </motion.div>

          <h1 className="text-2xl font-black text-slate-900 mb-3">
            You're In the Queue! 🙌
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Welcome, <span className="font-bold text-primary-500">{user?.email}</span>! Your account is being reviewed.
            This typically takes <strong>24–48 hours</strong>. We vet every member to ensure a safe, authentic church community.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="card p-8 shadow-xl shadow-slate-200/50 mb-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={14} className="text-primary-500" /> What Happens Next
          </h2>
          <div className="space-y-5">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-4 ${idx > 0 && 'pl-0'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  step.done ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  {step.icon}
                </div>
                <div className="pt-1">
                  <h3 className={`font-bold text-sm ${step.done ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {step.title}
                    {step.done && <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Done</span>}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2 text-center"
          >
            <Mail size={18} /> Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingDashboard;
