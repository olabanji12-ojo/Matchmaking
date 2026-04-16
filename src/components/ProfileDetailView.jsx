import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Church, Heart, Shield, MessageCircle, Calendar } from 'lucide-react';

const ProfileDetailView = ({ match, onBack, onAccept, onReject }) => {
  const { profile, score, user_id } = match;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        layoutId={`card-bg-${user_id}`}
        className="w-full max-w-2xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden h-full sm:h-auto max-h-screen sm:max-h-[85vh] flex flex-col"
      >
        {/* Header / Image Section */}
        <div className="relative h-72 sm:h-96 shrink-0">
          <motion.div 
            layoutId={`card-image-${user_id}`}
            className="absolute inset-0 bg-slate-200"
          >
            {profile.image_url ? (
              <img src={profile.image_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-amber-600 flex items-center justify-center text-white/20">
                <Heart size={120} fill="currentColor" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </motion.div>

          {/* Close Button */}
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 z-20 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all"
          >
            <X size={24} />
          </button>

          {/* Compatibility Overlay */}
          <motion.div 
            layoutId={`card-score-${user_id}`}
            className="absolute top-6 right-6 z-20 bg-primary-500 text-white px-5 py-2.5 rounded-full font-black text-sm shadow-xl flex items-center gap-2"
          >
            <Shield size={18} />
            {score}% Compatibility
          </motion.div>

          <div className="absolute bottom-8 left-8 right-8 text-white z-20">
            <motion.h2 
              layoutId={`card-name-${user_id}`}
              className="text-4xl font-black mb-2"
            >
              {profile.name}, {profile.age}
            </motion.h2>
            <div className="flex flex-wrap gap-4 text-white/90 font-medium">
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg">
                <MapPin size={16} className="text-primary-400" /> {profile.location}
              </span>
              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg">
                <Church size={16} className="text-primary-400" /> {profile.church}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">The Spiritual Foundation</h3>
            <div className="flex flex-wrap gap-3">
              {profile.values.map((val, idx) => (
                <span key={idx} className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold border border-primary-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  {val}
                </span>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold">
                <Calendar size={20} className="text-primary-500" />
                <span>Life Stage</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Currently looking for someone aged {profile.min_age || 18} - {profile.max_age || 50}.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold">
                <MessageCircle size={20} className="text-primary-500" />
                <span>Intentions</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Open to connecting with {profile.preferred_gender === 'any' ? 'everyone' : profile.preferred_gender} who shares core spiritual values.
              </p>
            </div>
          </section>

          <section className="bg-primary-50 p-8 rounded-[2rem] border border-primary-100">
            <h3 className="text-primary-900 font-black mb-2 italic">"Why we matched"</h3>
            <p className="text-primary-700 text-sm leading-relaxed">
              Based on your profiles, you share a strong foundation in <strong>{profile.values[0] || 'faith'}</strong> and {profile.values[1] || 'community'}. 
              Your mutual focus on church life in {profile.location} makes this a highly compatible connection.
            </p>
          </section>
        </div>

        {/* Action Footer */}
        <div className="p-8 border-t border-slate-100 bg-white grid grid-cols-2 gap-6 pb-12 sm:pb-8">
          <button 
            onClick={() => onReject(user_id)}
            className="flex items-center justify-center gap-2 py-5 rounded-2xl bg-slate-100 text-slate-500 font-bold hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
          >
            <X size={24} strokeWidth={3} />
            Skip
          </button>
          <button 
            onClick={() => onAccept(user_id)}
            className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary-500 text-white font-black shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-all"
          >
            <Heart size={24} fill="currentColor" strokeWidth={3} />
            Connect
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailView;
