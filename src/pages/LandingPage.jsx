import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 glass py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Heart fill="currentColor" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ChurchMatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-500 transition-colors">How it Works</a>
            <a href="#about" className="hover:text-primary-500 transition-colors">Community</a>
            
            {user ? (
               <>
                 <Link to="/app" className="text-slate-900 font-bold hover:text-primary-500 transition-colors">Dashboard</Link>
                 <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100">
                   Sign Out
                 </button>
               </>
            ) : (
               <>
                 <Link to="/login" className="text-slate-900 hover:text-primary-500 transition-colors">Login</Link>
                 <Link to="/register" className="bg-primary-500 text-white px-5 py-2.5 rounded-xl hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20">
                   Join Free
                 </Link>
               </>
            )}
          </div>
          {/* Mobile Login Button */}
          {user ? (
             <Link to="/app" className="md:hidden bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
               Dashboard
             </Link>
          ) : (
             <Link to="/login" className="md:hidden bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
               Get Started
             </Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 inline-block">
              Built for Believers
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Find Your <span className="text-primary-500">Divine Connection</span> in Faith.
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
              The premier social matching platform designed exclusively for church communities. Connect with people who share your values, faith, and vision for the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/app" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
                    Go to Dashboard <ArrowRight size={20} />
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary flex items-center justify-center text-lg px-8 py-4 text-rose-500 hover:bg-rose-50 border-rose-100">
                    Logout Account
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4">
                    Create Your Profile <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="btn-secondary flex items-center justify-center text-lg px-8 py-4">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary-400 to-amber-600 p-1 shadow-2xl overflow-hidden shadow-primary-500/20">
              <div className="w-full h-full bg-white rounded-[2.9rem] flex items-center justify-center relative overflow-hidden">
                {/* Visual Placeholder for App Mockup */}
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                   <img 
                     src="/matchmaking.jpg" 
                     alt="ChurchMatch App Preview" 
                     className="w-full h-full object-cover"
                   />
                </div>
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">92% Match</p>
                    <p className="text-[10px] text-slate-400">Shared Values</p>
                  </div>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                  className="absolute bottom-20 left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">New Message</p>
                    <p className="text-[10px] text-slate-400">Faith is typing...</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Values-Based Matching</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We go beyond surface-level stats. Our algorithm connects you based on the foundations of your faith and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 bg-white hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Verified</h3>
              <p className="text-slate-500 leading-relaxed">
                Mandatory admin approval for every new profile. We ensure a safe community of real believers.
              </p>
            </div>
            <div className="card p-8 bg-white hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Church Focused</h3>
              <p className="text-slate-500 leading-relaxed">
                Filter and match within your specific church or broaden your reach across denominations.
              </p>
            </div>
            <div className="card p-8 bg-white hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Deep Compatibility</h3>
              <p className="text-slate-500 leading-relaxed">
                Matches are calculated based on your spiritual values, church service, and life vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-slate-900/40">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
           
           <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 relative z-10">
             Ready to find your match?
           </h2>
           <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
             Join thousands of believers who have already found their partners through ChurchMatch.
           </p>
           <Link to="/register" className="btn-primary inline-flex scale-110 relative z-10">
             Get Started Today
           </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2026 ChurchMatch. Developed for Graduation Project.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
