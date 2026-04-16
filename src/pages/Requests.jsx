import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Heart, Check, X, Clock, Loader2, User } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'received' ? '/requests/received' : '/requests/sent';
      const res = await api.get(endpoint);
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') {
        const res = await api.put(`/requests/${id}/accept`);
        Swal.fire({
          icon: 'success',
          title: 'Divine Match!',
          text: 'A new chat has been created.',
          confirmButtonColor: '#f59e0b',
        }).then(() => {
          navigate(`/chats`);
        });
      } else if (action === 'reject') {
        await api.put(`/requests/${id}/reject`);
      } else if (action === 'cancel') {
        await api.delete(`/requests/${id}`);
      }
      fetchRequests();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to process request',
        confirmButtonColor: '#f59e0b',
      });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Connections</h1>
        <p className="text-slate-500 font-medium">Manage your matching requests</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full max-w-sm">
        <button 
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'received' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Received
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'sent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Sent
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {requests.length > 0 ? (
              requests.map((req) => (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        User ID: {activeTab === 'received' ? req.sender_id : req.receiver_id}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock size={12} /> {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeTab === 'received' && req.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(req.id, 'reject')}
                          className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                        <button 
                          onClick={() => handleAction(req.id, 'accept')}
                          className="p-3 bg-primary-100 text-primary-600 hover:bg-primary-500 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                      </>
                    )}
                    {activeTab === 'sent' && req.status === 'pending' && (
                      <button 
                        onClick={() => handleAction(req.id, 'cancel')}
                        className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    {req.status !== 'pending' && (
                       <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                         req.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                       }`}>
                         {req.status}
                       </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 card border-dashed bg-transparent">
                <p className="text-slate-400 font-medium">No {activeTab} requests right now.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Requests;
