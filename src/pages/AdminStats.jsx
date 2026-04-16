import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Heart, MessageCircle, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card p-8 flex items-center justify-between">
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-current/10`}>
      <Icon size={28} />
    </div>
  </div>
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Platform Analytics</h1>
        <p className="text-slate-500 font-medium font-sans">Real-time health of your community</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.total_users || 0} 
          icon={Users} 
          color="bg-primary-100 text-primary-600"
        />
        <StatCard 
          title="Matches Found" 
          value={stats?.total_requests || 0} 
          icon={Heart} 
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard 
          title="Active Chats" 
          value={stats?.total_chats || 0} 
          icon={MessageCircle} 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Growth" 
          value="+12%" 
          icon={TrendingUp} 
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8 space-y-4">
           <h3 className="font-bold text-slate-900">Platform Activity</h3>
           <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
             <p className="text-slate-400 text-sm font-medium">Activity graph placeholder</p>
           </div>
        </div>
        <div className="card p-8 space-y-4">
           <h3 className="font-bold text-slate-900">Request Success Rate</h3>
           <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
             <p className="text-slate-400 text-sm font-medium">Success analytics placeholder</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
