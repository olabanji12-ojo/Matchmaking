import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MatchCard from '../components/MatchCard';
import ProfileDetailView from '../components/ProfileDetailView';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const Discovery = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/matches');
      setMatches(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAccept = async (receiverID) => {
    try {
      await api.post('/requests', { receiver_id: receiverID });
      setMatches(prev => prev.filter(m => m.user_id !== receiverID));
      setSelectedMatch(null);
      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: 'We notified them of your interest.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.error || 'Failed to send request',
        confirmButtonColor: '#f59e0b',
      });
    }
  };

  const handleReject = (userID) => {
    setMatches(prev => prev.filter(m => m.user_id !== userID));
    setSelectedMatch(null);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-primary-500" size={40} />
        <p className="font-medium animate-pulse">Finding spiritual connections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Discover <Sparkles className="text-primary-500" />
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Hand-picked matches for your journey</p>
        </div>
        {!selectedMatch && (
          <button 
            onClick={fetchMatches}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary-500 hover:border-primary-200 shadow-sm transition-all active:rotate-180 duration-500"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </header>

      <div className="max-w-md mx-auto relative pt-4">
        <AnimatePresence mode="wait">
          {matches.length > 0 ? (
            <motion.div 
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-8"
            >
              {matches.map((match) => (
                <MatchCard 
                  key={match.user_id} 
                  match={match} 
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onClick={(m) => setSelectedMatch(m)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-8 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 shadow-inner"
            >
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                 <Sparkles className="text-primary-500" size={40} />
                 <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Divine Silence...</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                We couldn't find more matches matching your current criteria. Try expanding your preferences or check back tomorrow!
              </p>
              <button onClick={fetchMatches} className="btn-primary w-full py-4 text-lg">
                Seek Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanding Card Deep Dive Overlay */}
        <AnimatePresence>
          {selectedMatch && (
            <ProfileDetailView 
              match={selectedMatch}
              onBack={() => setSelectedMatch(null)}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Discovery;
