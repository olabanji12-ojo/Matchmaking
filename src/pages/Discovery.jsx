import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MatchCard from '../components/MatchCard';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const Discovery = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // For now, we just skip visually. In a more advanced app, we'd notify the backend to hide them.
    setMatches(prev => prev.filter(m => m.user_id !== userID));
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-primary-500" size={40} />
        <p className="font-medium">Finding spiritual connections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            Discover <Sparkles className="text-primary-500" />
          </h1>
          <p className="text-slate-500 font-medium">Potential matches based on your values</p>
        </div>
        <button 
          onClick={fetchMatches}
          className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary-500 hover:border-primary-200 transition-all active:rotate-180 duration-500"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="max-w-md mx-auto relative pt-4">
        <AnimatePresence mode="popLayout">
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {/* Only show top card for discovery flow, or show list */}
              {/* Here we show them in a stack-like list for the mobile app feel */}
              {matches.map((match) => (
                <MatchCard 
                  key={match.user_id} 
                  match={match} 
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 px-6 card bg-white/50 border-dashed"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🏜️
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">No more matches found</h2>
              <p className="text-slate-500 mb-8">Try updating your preferences or checking back later.</p>
              <button onClick={fetchMatches} className="btn-secondary">
                Refresh Feed
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Discovery;
