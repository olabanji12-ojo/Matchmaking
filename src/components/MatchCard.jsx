import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Church, Award, Heart, X } from 'lucide-react';

const MatchCard = ({ match, onAccept, onReject }) => {
  const { profile, score, user_id } = match;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="card relative group"
    >
      {/* Compatibility Badge */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-primary-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-xl shadow-primary-500/30 flex items-center gap-2">
          <Award size={16} />
          {score} Match
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="aspect-[4/5] bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-3xl font-black mb-1">{profile.name}, {profile.age}</h3>
          <p className="flex items-center gap-1.5 text-sm font-medium text-white/90">
            <MapPin size={14} className="text-primary-400" /> {profile.location}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
            <Church size={14} className="text-primary-500" /> {profile.church}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 uppercase">
            {profile.gender}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Core Values</h4>
          <div className="flex flex-wrap gap-2">
            {profile.values.map((val, idx) => (
              <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-md text-xs font-bold border border-primary-100">
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => onReject(user_id)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95 group/btn"
          >
            <X size={24} strokeWidth={3} />
          </button>
          <button 
            onClick={() => onAccept(user_id)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95"
          >
            <Heart size={24} fill="currentColor" strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
